import isEqual from 'lodash/isEqual';
import React, { useState, useCallback } from 'react';
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
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import axios from 'axios';
import { useAuthContext } from '../../../../auth/hooks';
import { isBetween } from '../../../../utils/format-time';
import AllBranchLoanSummaryTableFiltersResult from '../../all-branch-loan/all-branch-loan-summary-table-filters-result';
import GoldLoanUchakPaymentTableRow from '../daily-reports-table/gold-loan-uchak-payment-table-row';
import { TableCell, TableRow, Typography } from '@mui/material';
import LoanCloseTableRow from '../daily-reports-table/loan-close-table-row.jsx';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'index', label: '#' },
  { id: 'loan.loanNo', label: 'Loan no.' },
  { id: 'CustomerName', label: 'Customer name' },
  { id: 'totalLoanAmount', label: 'Total loan amt' },
  { id: 'paidLoanAmount', label: 'Paid Loan amt' },
  { id: 'pendingLoanAmount', label: 'pending loan amt' },
  { id: 'date', label: 'Pay date' },
  { id: 'closing date', label: 'Closing date' },
  { id: 'closingCharge', label: 'Closing charge' },
  { id: 'netAmount', label: 'Net amt' },
  { id: 'entryBy', label: ' Entry by' },
];

const defaultFilters = {
  username: '',
  status: 'All',
  startDate: null,
  endDate: null,
  branch: '',
};

// ----------------------------------------------------------------------

export default function LoanCloseListView({ closedLoans }) {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const { user } = useAuthContext();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [tableData, setTableData] = useState(closedLoans);
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: closedLoans,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const int = dataFiltered.reduce(
    (prev, next) =>
      prev +
      (Number(next?.loan.scheme.interestRate > 1.05 ? 1.5 : next?.loan.scheme.interestRate) || 0),
    0
  );
  const totalLoanAmt = dataFiltered.reduce(
    (prev, next) => prev + (Number(next?.totalLoanAmount) || 0),
    0
  );
  const closingCharge = dataFiltered.reduce(
    (prev, next) => prev + (Number(next?.closingCharge) || 0),
    0
  );
  const netAmt = dataFiltered.reduce((prev, next) => prev + (Number(next?.netAmount) || 0), 0);

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
    [router]
  );

  const handleClick = useCallback(
    (id) => {
      router.push(paths.dashboard.disburse.new(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Typography sx={{ fontSize: 22, fontWeight: 600 }}> Loan uchak part Details</Typography>
        <Card>
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
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 'auto' }}>
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
                  zIndex: 1,
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
                    <LoanCloseTableRow
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
                {dataFiltered.length == 0 && (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ p: 1, fontWeight: 500 }}>
                      No Data Available
                    </TableCell>
                  </TableRow>
                )}
                <TableRow
                  sx={{
                    backgroundColor: '#F4F6F8',
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 1000,
                    boxShadow: '0px 2px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}>
                    TOTAL
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}>
                    {totalLoanAmt.toFixed(0)}
                  </TableCell>{' '}
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}>
                    {(netAmt - closingCharge).toFixed()}
                  </TableCell>{' '}
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}>
                    {(totalLoanAmt - (netAmt - closingCharge)).toFixed(0)}
                  </TableCell>{' '}
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}>
                    {closingCharge.toFixed(0)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}>
                    {netAmt.toFixed(0)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
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
    inputData = inputData.filter((loan) => loan.customer.branch.name == branch.name);
  }

  if (!dateError && startDate && endDate) {
    inputData = inputData.filter((loan) => isBetween(new Date(loan.issueDate), startDate, endDate));
  }

  return inputData;
}
