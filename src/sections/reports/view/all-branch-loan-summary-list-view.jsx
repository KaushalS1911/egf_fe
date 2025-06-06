import isEqual from 'lodash/isEqual';
import React, { useState, useCallback, useEffect } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import axios from 'axios';
import { useAuthContext } from '../../../auth/hooks';
import { useGetLoanissue } from '../../../api/loanissue';
import { LoadingScreen } from '../../../components/loading-screen';
import { fDate, isBetween } from '../../../utils/format-time';
import { useGetConfigs } from '../../../api/config';
import AllBranchLoanSummaryTableRow from '../all-branch-loan/all-branch-loan-summary-table-row';
import AllBranchLoanSummaryTableToolbar from '../all-branch-loan/all-branch-loan-summary-table-toolbar';
import AllBranchLoanSummaryTableFiltersResult from '../all-branch-loan/all-branch-loan-summary-table-filters-result';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Label from '../../../components/label';
import { useGetAllLoanSummary } from '../../../api/all-branch-loan-summary';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'index', label: '#' },
  { id: 'LoanNo', label: 'Loan No.' },
  { id: 'CustomerName', label: 'Customer name' },
  { id: 'contact', label: 'Contact' },
  { id: 'int%', label: 'int (%)' },
  { id: 'OtherInt%', label: 'Other int (%)' },
  { id: 'issueDate', label: 'Issue date' },
  { id: 'loanAmount', label: 'loan amt' },
  { id: 'lastAmtPayDate', label: 'Last amt. pay date' },
  { id: 'LoanAmountPay', label: 'loan amt pay' },
  { id: 'interestLoanAmount', label: 'Int. loan amt' },
  { id: 'lastInstallmentDate', label: 'Last int. pay date' },
  { id: 'day', label: ' Day ' },
  { id: 'totalPaidInterest', label: 'Total int. pay ' },
  { id: 'pendingDay', label: 'Pending day' },
  { id: 'pendingInterest', label: ' Pending int. ' },
  { id: 'nextInstallmentDate', label: 'Next int. pay date' },
  { id: 'approvalCharge', label: 'Approval charge' },
  { id: 'status', label: 'Status' },
];
const STATUS_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Issued', label: 'Issued' },
  {
    value: 'Disbursed',
    label: 'Disbursed',
  },
  { value: 'Regular', label: 'Regular' },
  {
    value: 'Overdue',
    label: 'Overdue',
  },
];
const defaultFilters = {
  username: '',
  status: 'All',
  startDate: null,
  endDate: null,
  branch: '',
  issuedBy: '',
};

// ----------------------------------------------------------------------

export default function AllBranchLoanSummaryListView() {
  const [options, setOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const { LoanSummary, LoanSummaryLoading } = useGetAllLoanSummary(true, false);
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [tableData, setTableData] = useState(LoanSummary);
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: LoanSummary,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const int = dataFiltered.reduce(
    (prev, next) =>
      prev + (Number(next?.scheme.interestRate > 1.5 ? 1.5 : next?.scheme.interestRate) || 0),
    0
  );
  const approvalCharge = dataFiltered.reduce(
    (prev, next) => prev + (Number(next?.approvalCharge) || 0),
    0
  );
  const conCharge = dataFiltered.reduce(
    (prev, next) => prev + (Number(next?.consultingCharge) || 0),
    0
  );

  const loanAmt = dataFiltered.reduce((prev, next) => prev + (Number(next?.loanAmount) || 0), 0);

  const intLoanAmt = dataFiltered.reduce(
    (prev, next) => prev + (Number(next?.interestLoanAmount) || 0),
    0
  );

  const totalIntPay = dataFiltered.reduce(
    (prev, next) => prev + (Number(next?.totalPaidInterest) || 0),
    0
  );
  const day = dataFiltered.reduce(
    (prev, next) => prev + (Number(next.day > 0 && next?.day) || 0),
    0
  );
  const pendingDays = dataFiltered.reduce(
    (prev, next) => prev + (Number(next.pendingDays > 0 && next?.pendingDays) || 0),
    0
  );
  const pendingIntAmt = dataFiltered.reduce(
    (prev, next) => prev + (Number(next?.pendingInterest) || 0),
    0
  );

  const total = {
    int,
    approvalCharge,
    conCharge,
    loanAmt,
    intLoanAmt,
    totalIntPay,
    day,
    pendingDays,
    pendingIntAmt,
  };
  useEffect(() => {
    fetchStates();
  }, [dataFiltered]);

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/${user?.company}/loans`, {
        data: { ids: id },
      });
      enqueueSnackbar(res.data.message);
      confirm.onFalse();
      mutate();
    } catch (err) {
      enqueueSnackbar('Failed to delete Employee');
    }
  };
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );
  const handleDeleteRow = useCallback(
    (id) => {
      if (id) {
        handleDelete([id]);
        table.onUpdatePageDeleteRow(dataInPage.length);
      }
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = LoanSummary.filter((row) => table.selected.includes(row._id));
    const deleteIds = deleteRows.map((row) => row._id);
    handleDelete(deleteIds);
    setTableData(deleteRows);
    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.loanissue.edit(id));
    },
    [router]
  );

  const handleClick = useCallback(
    (id) => {
      router.push(paths.dashboard.disburse.new(id));
    },
    [router]
  );

  // const loans = Loanissue.map((item) => ({
  //   'Loan No': item.loanNo,
  //   'Customer Name': `${item.customer.firstName} ${item.customer.middleName} ${item.customer.lastName}`,
  //   'Contact': item.customer.contact,
  //   'OTP Contact': item.customer.otpContact,
  //   Email: item.customer.email,
  //   'Permanent address': `${item.customer.permanentAddress.street} ${item.customer.permanentAddress.landmark} ${item.customer.permanentAddress.city} , ${item.customer.permanentAddress.state} ${item.customer.permanentAddress.country} ${item.customer.permanentAddress.zipcode}`,
  //   'Issue date': item.issueDate,
  //   'Scheme': item.scheme.name,
  //   'Rate per gram': item.scheme.ratePerGram,
  //   'Interest rate': item.scheme.interestRate,
  //   valuation: item.scheme.valuation,
  //   'Interest period': item.scheme.interestPeriod,
  //   'Renewal time': item.scheme.renewalTime,
  //   'min loan time': item.scheme.minLoanTime,
  //   'Loan amount': item.loanAmount,
  //   'Next nextInstallment date': fDate(item.nextInstallmentDate),
  //   'Payment mode': item.paymentMode,
  //   'Paying cashAmount': item.payingCashAmount,
  //   'Pending cashAmount': item.pendingCashAmount,
  //   'Paying bankAmount': item.payingBankAmount,nasm
  //   'Pending bankAmount': item.pendingBankAmount,
  // }));

  if (LoanSummaryLoading) {
    return <LoadingScreen />;
  }

  function fetchStates() {
    dataFiltered?.map((data) => {
      setOptions((item) => {
        if (!item.find((option) => option.value === data.issuedBy._id)) {
          return [
            ...item,
            {
              name: `${data.issuedBy.firstName} ${data.issuedBy.middleName} ${data.issuedBy.lastName}`,
              value: data.issuedBy._id,
            },
          ];
        } else {
          return item;
        }
      });
    });
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="All Branch Loan Summary"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Reports', href: paths.dashboard.reports.root },
            { name: 'All Branch Loan Summary', href: paths.dashboard.reports['loan-list'] },
            { name: ' List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <>
                    <Label
                      style={{ margin: '5px' }}
                      variant={
                        ((tab.value === 'All' || tab.value == filters.status) && 'filled') || 'soft'
                      }
                      color={
                        (tab.value === 'Regular' && 'success') ||
                        (tab.value === 'Overdue' && 'error') ||
                        (tab.value === 'Disbursed' && 'info') ||
                        (tab.value === 'Issued' && 'secondary') ||
                        'default'
                      }
                    >
                      {['Issued', 'Regular', 'Overdue', 'Disbursed', 'Closed'].includes(tab.value)
                        ? LoanSummary.filter((item) => item.status === tab.value).length
                        : LoanSummary.length}
                    </Label>
                  </>
                }
              />
            ))}
          </Tabs>

          <AllBranchLoanSummaryTableToolbar
            filters={filters}
            onFilters={handleFilters}
            dataFilter={dataFiltered}
            configs={configs}
            options={options}
            total={total}
          />

          {canReset && (
            <AllBranchLoanSummaryTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer
            sx={{
              maxHeight: 500,
              overflow: 'auto',
              position: 'relative',
              ' .css-131g1ae-MuiTableCell-root': {
                padding: '6px',
              },
              ' .css-1613c04-MuiTableCell-root': {
                padding: '8px',
              },
              ' .css-1ms7e38-MuiTableCell-root': {
                padding: '6px',
              },
            }}
          >
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row._id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Table size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1000,
                  backgroundColor: '#2f3944',
                }}
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <AllBranchLoanSummaryTableRow
                      key={row._id}
                      row={row}
                      index={index}
                      handleClick={() => handleClick(row._id)}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                    />
                  ))}
                <TableNoData notFound={notFound} />
                <TableRow
                  sx={{
                    backgroundColor: '#F4F6F8',
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 1,
                    boxShadow: '0px 2px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  {/*<TableCell padding="checkbox" />*/}
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}>
                    TOTAL
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}
                  ></TableCell>
                  <TableCell
                    sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}
                  ></TableCell>
                  <TableCell
                    sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}
                  ></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}>
                    {(int / dataFiltered.length).toFixed(2)}
                  </TableCell>{' '}
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}>
                    {(conCharge / dataFiltered.length).toFixed(2)}
                  </TableCell>{' '}
                  <TableCell
                    sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}
                  ></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}>
                    {loanAmt.toFixed(0)}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}
                  ></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}>
                    {(loanAmt - intLoanAmt).toFixed(0)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}>
                    {intLoanAmt.toFixed(0)}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}
                  ></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}>
                    {(day / dataFiltered.length).toFixed(0)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}>
                    {totalIntPay.toFixed(0)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}>
                    {(pendingDays / dataFiltered.length).toFixed(0)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}>
                    {pendingIntAmt.toFixed(0)}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}
                  ></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}>
                    {approvalCharge}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: '600', color: '#637381', py: 1, px: 0.5 }}
                  ></TableCell>
                </TableRow>
                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />
              </TableBody>
            </Table>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------
function applyFilter({ inputData, comparator, filters, dateError }) {
  const { username, status, startDate, endDate, branch, issuedBy } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);
  if (username && username.trim()) {
    inputData = inputData.filter(
      (item) =>
        (item.customer.firstName + ' ' + item.customer.middleName + ' ' + item.customer.lastName)
          .toLowerCase()
          .includes(username.toLowerCase()) ||
        item.customer.firstName.toLowerCase().includes(username.toLowerCase()) ||
        item.customer.lastName.toLowerCase().includes(username.toLowerCase()) ||
        item.loanNo.toLowerCase().includes(username.toLowerCase()) ||
        item.customer.contact.toLowerCase().includes(username.toLowerCase())
    );
  }
  if (status && status !== 'All') {
    inputData = inputData.filter((item) => item.status === status);
  }
  if (branch) {
    inputData = inputData.filter((loan) => loan.customer.branch._id === branch._id);
  }
  if (issuedBy) {
    inputData = inputData.filter((item) => item?.issuedBy?._id === issuedBy?.value);
  }
  if (!dateError && startDate && endDate) {
    inputData = inputData.filter((loan) => isBetween(new Date(loan.issueDate), startDate, endDate));
  }

  return inputData;
}
