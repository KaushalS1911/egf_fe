import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
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
import { useGetOtherLoanReports } from '../../../api/all-branch-other-loan-report.js';
import AllBranchOtherLoanSummaryTableToolbar from '../all-branch-other-loan/all-branch-other-loan-summary-table-toolbar.jsx';
import AllBranchOtherLoanSummaryTableFiltersResult from '../all-branch-other-loan/all-branch-other-loan-summary-table-filters-result.jsx';
import AllBranchOtherLoanSummaryTableRow from '../all-branch-other-loan/all-branch-other-loan-summary-table-row.jsx';
import OtherLonaInterestTableToolbar from '../other-loan-interest-reports/other-lona-interest-table-toolbar.jsx';
import OtherLonaInterestTableFiltersResult from '../other-loan-interest-reports/other-lona-interest-table-filters-result.jsx';
import OtherLonaInterestTableRow from '../other-loan-interest-reports/other-lona-interest-table-row.jsx';
import { TableCell, TableRow } from '@mui/material';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'index', label: '#' },
  { id: 'LoanNo', label: 'Loan no.' },
  { id: 'firstName', label: 'Customer name' },
  { id: 'otherName', label: 'Other name' },
  { id: 'otherNumber', label: 'Other no.' },
  { id: 'interestRate', label: 'int rate (%)' },
  { id: 'date', label: 'Open date' },
  { id: 'amount', label: 'Other loan amt' },
  { id: 'otherCharge', label: 'Charge' },
  { id: 'day', label: ' Day' },
  { id: 'int', label: 'Int.' },
  { id: 'lastintpaydate', label: 'Last int. pay date' },
  { id: 'pendingAmt', label: 'Pending int.' },
  { id: 'pendingDay', label: 'Pending day' },
  { id: 'nextointpaydayte', label: 'Next int. pay date' },
  { id: 'status', label: 'Status' },
];
const STATUS_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Issued', label: 'Issued' },

  { value: 'Regular', label: 'Regular' },
  {
    value: 'Overdue',
    label: 'Overdue',
  },
  {
    value: 'Closed',
    label: 'Closed',
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

export default function OtherLoanInterestListView() {
  const [options, setOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { otherLoanReports, otherLoanReportsLoading } = useGetOtherLoanReports();
  const table = useTable();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [tableData, setTableData] = useState(otherLoanReports);
  const [filters, setFilters] = useState(defaultFilters);

  const percentage = otherLoanReports.reduce(
    (prev, next) => prev + (Number(next?.percentage) || 0),
    0
  );
  const rate = otherLoanReports.reduce((prev, next) => prev + (Number(next?.rate) || 0), 0);
  const amount = otherLoanReports.reduce((prev, next) => prev + (Number(next?.amount) || 0), 0);
  const totalInterestAmt = otherLoanReports.reduce(
    (prev, next) => prev + (Number(next?.totalInterestAmt) || 0),
    0
  );
  const pendingInterest = otherLoanReports.reduce(
    (prev, next) => prev + (Number(next?.pendingInterest) || 0),
    0
  );
  const day = otherLoanReports.reduce(
    (prev, next) => prev + (Number(next?.day > 0 ? next.day : 0) || 0),
    0
  );
  const closeAmt = otherLoanReports.reduce(
    (prev, next) => prev + (Number(next?.closingAmount) || 0),
    0
  );
  const closingCharge = otherLoanReports.reduce(
    (prev, next) => prev + (Number(next?.closingCharge) || 0),
    0
  );

  // useEffect(() => {
  //   fetchStates();
  // }, [otherLoanReports]);
  const dataFiltered = applyFilter({
    inputData: otherLoanReports,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

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
    const deleteRows = otherLoanReports.filter((row) => table.selected.includes(row._id));
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

  if (otherLoanReportsLoading) {
    return <LoadingScreen />;
  }
  //
  // function fetchStates() {
  //   dataFiltered?.map((data) => {
  //     setOptions((item) => {
  //       if (!item.find((option) => option.value === data.issuedBy._id)) {
  //         return [
  //           ...item,
  //           {
  //             name: `${data.issuedBy.firstName} ${data.issuedBy.middleName} ${data.issuedBy.lastName}`,
  //             value: data.issuedBy._id,
  //           },
  //         ];
  //       } else {
  //         return item;
  //       }
  //     });
  //   });
  // }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Other Loan Interest Reports"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Reports', href: paths.dashboard.reports.root },
            {
              name: 'Other Loan Interest Reports',
              href: paths.dashboard.reports['other-loan-interest-reports'],
            },
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
                        (tab.value === 'Closed' && 'warning') ||
                        (tab.value === 'Issued' && 'secondary') ||
                        'default'
                      }
                    >
                      {['Issued', 'Regular', 'Overdue', 'Disbursed', 'Closed'].includes(tab.value)
                        ? otherLoanReports.filter((item) => item.status === tab.value).length
                        : otherLoanReports.length}
                    </Label>
                  </>
                }
              />
            ))}
          </Tabs>

          <OtherLonaInterestTableToolbar
            filters={filters}
            onFilters={handleFilters}
            dataFilter={dataFiltered}
            configs={configs}
            options={options}
          />

          {canReset && (
            <OtherLonaInterestTableFiltersResult
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
                }}
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <OtherLonaInterestTableRow
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
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}>
                    TOTAL
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}>
                    {(percentage / otherLoanReports.length).toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}>
                    {amount.toFixed(0)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}>
                    {closingCharge.toFixed(0)}
                  </TableCell>{' '}
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}>
                    {totalInterestAmt.toFixed(0)}
                  </TableCell>{' '}
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}>
                    {(day / otherLoanReports.length).toFixed(0)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}>
                    {pendingInterest.toFixed(0)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}></TableCell>
                  <TableCell
                    sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}
                  ></TableCell>{' '}
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
        (
          item.loan.customer.firstName +
          ' ' +
          item.loan.customer.middleName +
          ' ' +
          item.loan.customer.lastName
        )
          .toLowerCase()
          .includes(username.toLowerCase()) ||
        item.loan.customer.firstName.toLowerCase().includes(username.toLowerCase()) ||
        item.loan.customer.lastName.toLowerCase().includes(username.toLowerCase()) ||
        item.loan.loanNo.toLowerCase().includes(username.toLowerCase()) ||
        item.loan.customer.contact.toLowerCase().includes(username.toLowerCase())
    );
  }
  if (status && status !== 'All') {
    inputData = inputData.filter((item) => item.status === status);
  }
  if (branch) {
    inputData = inputData.filter((loan) => loan.loan.customer.branch._id === branch._id);
  }
  // if (issuedBy) {
  //   inputData = inputData.filter((item) => item?.issuedBy?._id === issuedBy?.value);
  // }
  if (!dateError && startDate && endDate) {
    inputData = inputData.filter((item) =>
      isBetween(new Date(item.loan.issueDate), startDate, endDate)
    );
  }

  return inputData;
}
