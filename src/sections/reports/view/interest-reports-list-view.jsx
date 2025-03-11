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
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
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
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Label from '../../../components/label';
import { LoadingScreen } from '../../../components/loading-screen';
import { useGetLoanissue } from '../../../api/loanissue';
import { useGetConfigs } from '../../../api/config';
import InterestReportsTableRow from '../interest-reports/interest-reports-table-row.jsx';
import InterestReportsTableFiltersResult from '../interest-reports/interest-reports-table-filters-result.jsx';
import InterestReportsTableToolbar from '../interest-reports/interest-reports-table-toolbar.jsx';
import { useAuthContext } from '../../../auth/hooks/index.js';
import { useGetInterestReports } from '../../../api/interest-reports.js';
import { isBetween } from '../../../utils/format-time.js';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', label: '#' },
  { id: 'loanNo', label: 'Loan no.' },
  { id: 'customerName', label: 'Customer name' },
  { id: 'loanAmt', label: 'Loan amt' },
  { id: 'partLoanAmt', label: 'Part loan amt' },
  { id: 'InterestLoanAmount', label: 'Int. loan amt' },
  { id: 'InterestRate', label: 'Rate' },
  { id: 'consultingCharge', label: 'Consulting Charge' },
  { id: 'intamt', label: 'int. amt' },
  { id: 'conamt', label: 'Con. amt' },
  { id: 'penalty', label: 'Penalty' },
  { id: 'totalPayIntAmt', label: 'Total Int. amt' },
  { id: 'lastInterestPayDate', label: 'Last Int. pay date' },
  { id: 'pendingDay', label: 'Pending day' },
  { id: 'pendingIntAmt', label: 'Pending Int. amt' },
];

const defaultFilters = {
  username: '',
  branch: '',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function InterestReportsListView() {
  const table = useTable();
  const { Loanissue, LoanissueLoading } = useGetInterestReports();
  const settings = useSettingsContext();
  const confirm = useBoolean();
  const [srData, setSrData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    const updatedData = Loanissue.map((item, index) => ({
      ...item,
      srNo: index + 1,
    }));
    setSrData(updatedData);
  }, [Loanissue]);

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

  if (LoanissueLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Interest Reports"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Interest Reports' }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          <InterestReportsTableToolbar
            filters={filters}
            onFilters={handleFilters}
            data={Loanissue}
          />
          {canReset && (
            <InterestReportsTableFiltersResult
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
                  backgroundColor: 'white',
                  zIndex: 1000,
                  boxShadow: '0px 2px 2px rgba(0,0,0,0.1)',
                }}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <InterestReportsTableRow key={row?._id} index={index} row={row} />
                  ))}
                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />
                <TableNoData notFound={notFound} />
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
        item.customer.firstName.toLowerCase().includes(username.toLowerCase()) ||
        item.customer.middleName.toLowerCase().includes(username.toLowerCase()) ||
        item.customer.lastName.toLowerCase().includes(username.toLowerCase()) ||
        item.loanNo.toLowerCase().includes(username.toLowerCase()) ||
        item.customer.contact.toLowerCase().includes(username.toLowerCase())
    );
  }
  if (branch) {
    inputData = inputData.filter((item) => item.customer.branch._id === branch._id);
  }

  if (!dateError && startDate && endDate) {
    inputData = inputData.filter((item) =>
      isBetween(new Date(item?.lastInstallmentDate), startDate, endDate)
    );
  }

  return inputData;
}
