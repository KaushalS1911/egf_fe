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
import { paths } from 'src/routes/paths.js';
import { useRouter } from 'src/routes/hooks/index.js';
import { useBoolean } from 'src/hooks/use-boolean.js';
import Iconify from 'src/components/iconify/index.js';
import { useSnackbar } from 'src/components/snackbar/index.js';
import { ConfirmDialog } from 'src/components/custom-dialog/index.js';
import { useSettingsContext } from 'src/components/settings/index.js';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/index.js';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table/index.js';
import OtherIncomeToolbar from '../other-income-toolbar.jsx';
import OtherIncomeTableFiltersResult from '../other-income-table-filters-result.jsx';
import OtherIncomeTableRow from '../other-income-table-row.jsx';
import axios from 'axios';
import { useAuthContext } from '../../../../auth/hooks/index.js';
import { useGetConfigs } from '../../../../api/config.js';
import { LoadingScreen } from '../../../../components/loading-screen/index.js';
import { getResponsibilityValue } from '../../../../permission/permission.js';
import { useGetCashTransactions } from '../../../../api/cash-transactions.js';
import { isBetween } from '../../../../utils/format-time.js';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { RouterLink } from '../../../../routes/components/index.js';
import { useGetOtherIncome } from '../../../../api/other-income.js';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'true', label: 'Active' },
  {
    value: 'false',
    label: 'In Active',
  },
];

const TABLE_HEAD = [
  { id: '#', label: '#' },
  { id: 'otherIncomeType', label: 'Expense Type' },
  { id: 'category', label: 'Category' },
  { id: 'date', label: 'Date' },
  { id: 'cashAmount', label: 'Cash amt' },
  { id: 'bankAmount', label: 'Bank amt' },
  { id: 'bank', label: 'Bank' },
  { id: 'description', label: 'Description' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function OtherIncomeListView() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { otherIncome, mutate, otherIncomeLoading } = useGetOtherIncome();
  const { configs } = useGetConfigs();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [tableData, setTableData] = useState(otherIncome);
  const [filters, setFilters] = useState(defaultFilters);
  const [srData, setSrData] = useState([]);

  const dataFiltered = applyFilter({
    inputData: srData,
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

  useEffect(() => {
    const updatedData = otherIncome.map((item, index) => ({
      ...item,
      srNo: index + 1,
    }));
    setSrData(updatedData);
  }, [otherIncome]);

  const handleFilters = useCallback(
    (name, value) => {
      console.log('name', value);
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
    if (!getResponsibilityValue('delete_scheme', configs, user)) {
      enqueueSnackbar('You do not have permission to delete.', { variant: 'error' });
      return;
    }
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/${user?.company}/other-income/${id}`
      );
      enqueueSnackbar(res.data.message);
      confirm.onFalse();
      mutate();
    } catch (err) {
      enqueueSnackbar('Failed to delete Expense');
    }
  };

  const handleDeleteRow = useCallback(
    (id) => {
      handleDelete([id]);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = scheme.filter((row) => table.selected.includes(row._id));
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
      router.push(paths.dashboard.cashAndBank.otherIncome.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('isActive', newValue);
    },
    [handleFilters]
  );

  if (otherIncomeLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Other Income"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: `Other Income`, href: paths.dashboard.cashAndBank.otherIncome },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.cashAndBank.otherIncome.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Income
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          <OtherIncomeToolbar filters={filters} onFilters={handleFilters} />
          {canReset && (
            <OtherIncomeTableFiltersResult
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
                  .map((row) => (
                    <OtherIncomeTableRow
                      key={row._id}
                      row={row}
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
  const { name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  if (name && name.trim()) {
    inputData = inputData.filter((sch) =>
      sch?.incomeType?.toLowerCase().includes(name.toLowerCase()) ||
      (sch?.amount).toString()?.includes(name)
    );
  }

  if (!dateError && startDate && endDate) {
    inputData = inputData.filter((item) => isBetween(new Date(item.date), startDate, endDate));
  }
  return inputData;
}
