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
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
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
import { LoadingScreen } from '../../../components/loading-screen';
import { useGetLoanIssueReport } from '../../../api/loan-issue-reports.js';
import LoanIssueReportsTableToolbar from '../loan-issue-report/loan-issue-reports-table-toolbar.jsx';
import LoanIssueReportsTableFiltersResult from '../loan-issue-report/loan-issue-reports-table-filters-result.jsx';
import LoanIssueReportsTableRow from '../loan-issue-report/loan-issue-reports-table-row.jsx';
import { isBetween } from '../../../utils/format-time.js';
import { TableCell, TableRow } from '@mui/material';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', label: '#' },
  { id: 'loanNo', label: 'Loan no.' },
  { id: 'issueDate', label: 'Issue date' },
  { id: 'firstName', label: 'Customer name' },
  { id: 'contact', label: 'Contact' },
  { id: 'loanAmount', label: 'Total loan amt' },
  { id: 'interestLoanAmount', label: 'Int. loan amt' },
  { id: 'PartLoanAmount', label: 'Part loan amt' },
  { id: 'InterestRate', label: 'Int. rate' },
  { id: 'cashAmount', label: 'Cash amt' },
  { id: 'bankAmount', label: 'Bank amt' },
  { id: 'status', label: 'Status' },
  { id: 'reports', label: 'Reports' },
];

const defaultFilters = {
  username: '',
  startDate: null,
  endDate: null,
  branch: null,
};

// ----------------------------------------------------------------------

export default function LoanIssueReportsListView() {
  const table = useTable();
  const { loanIssueReports, loanIssueReportsLoading } = useGetLoanIssueReport();
  const settings = useSettingsContext();
  const confirm = useBoolean();
  const [srData, setSrData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  const loanAmount = loanIssueReports.reduce(
    (prev, next) => prev + (Number(next?.loanAmount) || 0),
    0
  );
  const intLoanAmount = loanIssueReports.reduce(
    (prev, next) => prev + (Number(next?.interestLoanAmount) || 0),
    0
  );
  const cashAmt = loanIssueReports.reduce(
    (prev, next) => prev + (Number(next?.cashAmount) || 0),
    0
  );
  const bankAmt = loanIssueReports.reduce(
    (prev, next) => prev + (Number(next?.bankAmount) || 0),
    0
  );
  const int = loanIssueReports.reduce(
    (prev, next) => prev + (Number(next?.scheme.interestRate) || 0),
    0
  );

  useEffect(() => {
    const updatedData = loanIssueReports.map((item, index) => ({
      ...item,
      srNo: index + 1,
    }));
    setSrData(updatedData);
  }, [loanIssueReports]);

  const dataFiltered = applyFilter({
    inputData: srData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

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

  if (loanIssueReportsLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Loan Issue Reports"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Loan Issue Reports' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          <LoanIssueReportsTableToolbar filters={filters} onFilters={handleFilters} />
          {canReset && (
            <LoanIssueReportsTableFiltersResult
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
                  dataFiltered.map((row) => row.id)
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
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
                    <LoanIssueReportsTableRow key={row?._id} index={index} row={row} />
                  ))}
                <TableNoData notFound={notFound} />

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
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}>
                    {loanAmount.toFixed(0)}
                  </TableCell>{' '}
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}>
                    {intLoanAmount.toFixed(0)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}>
                    {(loanAmount - intLoanAmount).toFixed(0)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}>
                    {(int / loanIssueReports.length).toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}>
                    {cashAmt.toFixed(0)}
                  </TableCell>{' '}
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}>
                    {bankAmt.toFixed(0)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}></TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}></TableCell>
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
  const { username, startDate, endDate, branch } = filters;
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
        (item?.customer?.firstName + ' ' + item?.customer?.middleName + ' ' + item?.customer?.lastName)
          .toLowerCase()
          .includes(username.toLowerCase()) ||
        item?.customer?.firstName.toLowerCase().includes(username.toLowerCase()) ||
        item?.customer?.middleName.toLowerCase().includes(username.toLowerCase()) ||
        item?.customer?.lastName.toLowerCase().includes(username.toLowerCase()) ||
        item?.loanNo?.toLowerCase().includes(username.toLowerCase()) ||
        item?.customer?.contact.toLowerCase().includes(username.toLowerCase())
    );
  }
  if (branch) {
    inputData = inputData.filter((loan) => loan?.customer?.branch === branch);
  }
  if (!dateError && startDate && endDate) {
    inputData = inputData.filter((loan) => isBetween(new Date(loan.issueDate), startDate, endDate));
  }

  return inputData;
}
