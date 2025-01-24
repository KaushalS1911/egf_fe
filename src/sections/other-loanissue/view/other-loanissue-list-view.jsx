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
import LoanissueTableRow from '../other-loanissue-table-row';
import LoanissueTableToolbar from '../other-loanissue-table-toolbar';
import LoanissueTableFiltersResult from '../other-loanissue-table-filters-result';
import axios from 'axios';
import { useAuthContext } from '../../../auth/hooks';
import { useGetLoanissue } from '../../../api/loanissue';
import { LoadingScreen } from '../../../components/loading-screen';
import { fDate } from '../../../utils/format-time';
import { useGetConfigs } from '../../../api/config';
import { getResponsibilityValue } from '../../../permission/permission';
import OtherLoanissueTableFiltersResult from '../other-loanissue-table-filters-result';
import OtherLoanissueTableRow from '../other-loanissue-table-row';
import OtherLoanissueTableToolbar from '../other-loanissue-table-toolbar';
import { useGetOtherLoanissue } from '../../../api/other-loan-issue.js';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'otherLoanNo', label: 'Other Loan No.' },
  { id: 'LoanNo', label: 'Loan No.' },
  { id: 'CustomerName', label: 'Customer name' },
  { id: 'ContactNo', label: 'Contact' },
  { id: 'InterestLoanAmount', label: 'Int. loan amt' },
  { id: 'InterestRate', label: 'Int. rate' },
  { id: 'CashAmount', label: 'Cash amt' },
  { id: 'BankAmount', label: 'Bank amt' },
  { id: '', width: 88 },
];

const defaultFilters = {
  username: '',
};

// ----------------------------------------------------------------------

export default function OtherLoanissueListView() {
  const { otherLoanissue, otherLoanissueLoading, mutate } = useGetOtherLoanissue();
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [tableData, setTableData] = useState(otherLoanissue);
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: otherLoanissue,
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
    if (!getResponsibilityValue('delete_loanIssue', configs, user)) {
      enqueueSnackbar('You do not have permission to delete.', { variant: 'error' });
      return;
    }
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/${user?.company}/other-loans`,
        {
          data: { ids: id },
        }
      );
      enqueueSnackbar(res.data.message);
      confirm.onFalse();
      mutate();
    } catch (err) {
      enqueueSnackbar('Failed to delete Employee');
    }
  };

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
    const deleteRows = otherLoanissue.filter((row) => table.selected.includes(row._id));
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
      router.push(paths.dashboard.other_loanissue.edit(id));
    },
    [router]
  );

  const handleClick = useCallback(
    (id) => {
      router.push(paths.dashboard.disburse.new(id));
    },
    [router]
  );

  // const loans = otherLoanissue.map((item) => ({
  //   'Loan No': item.loan.loanNo,
  //   'Customer Name': `${item.loan.customer.firstName} ${item.loan.customer.middleName} ${item.loan.customer.lastName}`,
  //   Contact: item.loan.customer.contact,
  //   'OTP Contact': item.loan.customer.otpContact,
  //   Email: item.loan.customer.email,
  //   'Permanent address': `${item.loan.customer.permanentAddress.street} ${item.loan.customer.permanentAddress.landmark} ${item.loan.customer.permanentAddress.city} , ${item.loan.customer.permanentAddress.state} ${item.loan.customer.permanentAddress.country} ${item.loan.customer.permanentAddress.zipcode}`,
  //   'Issue date': item.loan.issueDate,
  //   Scheme: item.loan.scheme.name,
  //   'Rate per gram': item.loan.scheme.ratePerGram,
  //   'Interest rate': item.loan.scheme.interestRate,
  //   valuation: item.loan.scheme.valuation,
  //   'Interest period': item.loan.scheme.interestPeriod,
  //   'Renewal time': item.loan.scheme.renewalTime,
  //   'min loan time': item.loan.scheme.minLoanTime,
  //   'Loan amount': item.loan.loanAmount,
  //   'Next nextInstallment date': fDate(item.loan.nextInstallmentDate),
  //   'Payment mode': item.loan.paymentMode,
  //   'Paying cashAmount': item.loan.payingCashAmount,
  //   'Pending cashAmount': item.loan.pendingCashAmount,
  //   'Paying bankAmount': item.loan.payingBankAmount,
  //   'Pending bankAmount': item.loan.pendingBankAmount,
  // }));

  if (otherLoanissueLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Other Issued Loans"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Other Loan Issue', href: paths.dashboard.other_loanissue.root },
            { name: ' List' },
          ]}
          action={
            getResponsibilityValue('create_loanIssue', configs, user) && (
              <>
                <Button
                  component={RouterLink}
                  href={paths.dashboard.other_loanissue.new}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  Add Other Loan issue
                </Button>
              </>
            )
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          <OtherLoanissueTableToolbar filters={filters} onFilters={handleFilters} />
          {canReset && (
            <OtherLoanissueTableFiltersResult
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
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row._id)
                    )
                  }
                />
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <OtherLoanissueTableRow
                        key={row._id}
                        row={row}
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
function applyFilter({ inputData, comparator, filters }) {
  const { username } = filters;

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
        item.customer.middleName.toLowerCase().includes(username.toLowerCase()) ||
        item.customer.lastName.toLowerCase().includes(username.toLowerCase()) ||
        item.loanNo.toLowerCase().includes(username.toLowerCase()) ||
        item.customer.contact.toLowerCase().includes(username.toLowerCase())
    );
  }
  return inputData;
}
