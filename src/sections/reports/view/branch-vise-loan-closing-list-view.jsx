import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';
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
import { getResponsibilityValue } from '../../../permission/permission';

import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Label from '../../../components/label';
import BranchViseLoanClosingTableToolbar from '../branch-vise-loan-closing-table-toolbar';
import BranchViseLoanClosingFiltersResult from '../branch-vise-loan-closing-filters-result';
import BranchViseLoanClosingTableRow from '../branch-vise-loan-closing-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'index', label: '#' },
  { id: 'LoanNo', label: 'Loan No.'},
  { id: 'CustomerName', label: 'Customer name'},
  { id: 'ContactNo', label: 'Contact'},
  { id: 'int%', label: 'int (%)'},
  { id: 'OtherInt%', label: 'Other int (%)'},
  { id: 'int%', label: 'Issue date'},
  { id: 'LoanAmount', label: 'loan amt'},
  { id: 'LastAmtPayDate', label: 'Last amt. pay date'},
  { id: 'LoanAmountPay', label: 'loan amt pay'},
  { id: 'InterestLoanAmount', label: 'Int. loan amt'},
  { id: 'LastIntPayDate', label: 'Last int. pay date'},
  { id: 'TotalIntPay', label: 'Total int. pay '},
  { id: 'Day', label: ' Day '},
  { id: 'pendingAmt', label: ' Pending int. '},
  { id: 'nextIntPayDate', label: 'Next int. pay date'},
  { id: 'Status', label: 'Status'},
];

const defaultFilters = {
  username: '',
  status: 'All',
  startDate: null,
  endDate: null,
  branch: '',

};

// ----------------------------------------------------------------------

export default function BranchViseLoanClosingListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const { Loanissue, mutate, LoanissueLoading } = useGetLoanissue(false, false, false,true);
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [tableData, setTableData] = useState(Loanissue);
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: Loanissue,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
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
    [table],
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
    [handleFilters],
  );
  const handleDeleteRow = useCallback(
    (id) => {
      if (id) {
        handleDelete([id]);
        table.onUpdatePageDeleteRow(dataInPage.length);
      }
    },
    [dataInPage.length, enqueueSnackbar, table, tableData],
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = Loanissue.filter((row) => table.selected.includes(row._id));
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
    [router],
  );

  const handleClick = useCallback(
    (id) => {
      router.push(paths.dashboard.disburse.new(id));
    },
    [router],
  );

  const loans = Loanissue.map((item) => ({
    'Loan No': item.loanNo,
    'Customer Name': `${item.customer.firstName} ${item.customer.middleName} ${item.customer.lastName}`,
    'Contact': item.customer.contact,
    'OTP Contact': item.customer.otpContact,
    Email: item.customer.email,
    'Permanent address': `${item.customer.permanentAddress.street} ${item.customer.permanentAddress.landmark} ${item.customer.permanentAddress.city} , ${item.customer.permanentAddress.state} ${item.customer.permanentAddress.country} ${item.customer.permanentAddress.zipcode}`,
    'Issue date': item.issueDate,
    'Scheme': item.scheme.name,
    'Rate per gram': item.scheme.ratePerGram,
    'Interest rate': item.scheme.interestRate,
    valuation: item.scheme.valuation,
    'Interest period': item.scheme.interestPeriod,
    'Renewal time': item.scheme.renewalTime,
    'min loan time': item.scheme.minLoanTime,
    'Loan amount': item.loanAmount,
    'Next nextInstallment date': fDate(item.nextInstallmentDate),
    'Payment mode': item.paymentMode,
    'Paying cashAmount': item.payingCashAmount,
    'Pending cashAmount': item.pendingCashAmount,
    'Paying bankAmount': item.payingBankAmount,
    'Pending bankAmount': item.pendingBankAmount,
  }));

  if (LoanissueLoading) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Branch Vise Loan Closing Report'
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Branch Vise Loan Closing Report', href: paths.dashboard.reports.root },
            { name: ' List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>

          <BranchViseLoanClosingTableToolbar filters={filters} onFilters={handleFilters} loans={loans} />

          {canReset && (
            <BranchViseLoanClosingFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row._id),
                )
              }
              action={
                <Tooltip title='Delete'>
                  <IconButton color='primary' onClick={confirm.onTrue}>
                    <Iconify icon='solar:trash-bin-trash-bold' />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 2000 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}

                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage,
                    )
                    .map((row, index) => (
                      <BranchViseLoanClosingTableRow
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

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
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
        title='Delete'
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant='contained'
            color='error'
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
  const { username, status, startDate, endDate, branch } = filters;

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
        item.customer.firstName.toLowerCase().includes(username.toLowerCase()) ||
        item.customer.lastName.toLowerCase().includes(username.toLowerCase()) ||
        item.loanNo.toLowerCase().includes(username.toLowerCase()) ||
        item.customer.contact.toLowerCase().includes(username.toLowerCase()),
    );
  }
  if (status && status !== 'All') {
    inputData = inputData.filter((item) => item.status === status);
  }
  if (branch) {
    inputData = inputData.filter((loan) => loan.customer.branch.name == branch.name);
    console.log(inputData, 'llllllllllllllllllll');
  }
  if (!dateError && startDate && endDate) {
    inputData = inputData.filter((loan) =>
      isBetween(new Date(loan.issueDate), startDate, endDate),
    );
  }

  return inputData;
}