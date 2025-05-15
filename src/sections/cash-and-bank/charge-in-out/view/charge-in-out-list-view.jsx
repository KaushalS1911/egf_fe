import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useState } from 'react';
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
import { RouterLink } from 'src/routes/components/index.js';
import { useBoolean } from 'src/hooks/use-boolean.js';
import Iconify from 'src/components/iconify/index.js';
import { useSnackbar } from 'src/components/snackbar/index.js';
import { ConfirmDialog } from 'src/components/custom-dialog/index.js';
import { useSettingsContext } from 'src/components/settings/index.js';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/index.js';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from 'src/components/table/index.js';
import ChargeInOutTableToolbar from '../charge-in-out-table-toolbar.jsx';
import ChargeInOutTableRow from '../charge-in-out-table-row.jsx';
import { Grid } from '@mui/material';
import { LoadingScreen } from '../../../../components/loading-screen/index.js';
import Typography from '@mui/material/Typography';
import { isBetween } from '../../../../utils/format-time.js';
import { useGetChargeInOut } from '../../../../api/charge-in-out.js';
import ChargeInOutTableFiltersResult from '../charge-in-out-table-filters-result.jsx';
import ChargeListView from '../charge/view/charge-list-view.jsx';
import axios from 'axios';
import { useAuthContext } from '../../../../auth/hooks/index.js';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '#', label: '' },
  { id: 'type', label: 'Type' },
  { id: 'category', label: 'Category' },
  { id: 'date', label: 'Date' },
  { id: 'Cash amt', label: 'Cash amt' },
  { id: 'Bank amt', label: 'Bank amt' },
  { id: 'Bank', label: 'Bank' },
  { id: 'status', label: 'status' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  category: '',
  startDate: null,
  endDate: null,
  chargeType: '',
};

// ----------------------------------------------------------------------

export default function ChargeInOutListView() {
  const { ChargeInOut, ChargeInOutLoading, mutate } = useGetChargeInOut();
  const { enqueueSnackbar } = useSnackbar();
  const [chargeDetails, setChargeDetails] = useState('');
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { user } = useAuthContext();
  const [tableData, setTableData] = useState(ChargeInOut);
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: ChargeInOut,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  useEffect(() => {
    setFilters({ ...defaultFilters, chargeType: chargeDetails });
  }, [chargeDetails]);

  const amount =
    dataFiltered
      ?.filter((e) => e.category === 'Payment In')
      ?.reduce((prev, next) => prev + (Number(next?.amount) || 0), 0) -
    dataFiltered
      ?.filter((e) => e.category === 'Payment Out')
      ?.reduce((prev, next) => prev + (Number(next?.amount) || 0), 0);

  const dataInPage = dataFiltered?.slice(
    table.page * table?.rowsPerPage,
    table.page * table?.rowsPerPage + table?.rowsPerPage,
  );

  const denseHeight = table?.dense ? 56 : 56 + 20;
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

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
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/${user?.company}/charge/${id}`,
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
    [dataInPage.length, enqueueSnackbar, table, tableData],
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.cashAndBank.chargeInOut.edit(id));
    },
    [router],
  );

  if (ChargeInOutLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={
            <Typography variant='h4' gutterBottom>
              Charge In/Out
            </Typography>
          }
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.cashAndBank.chargeInOut.new}
              variant='contained'
              startIcon={<Iconify icon='mingcute:add-line' />}
            >
              Add Charge in-out
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 1 },
          }}
        />
        <Card sx={{ p: 2 }}>
          <Grid container>
            <Grid md={3}>
              <Card sx={{ height: '100%', p: 2, mr: 2 }}>
                <ChargeListView
                  setChargeDetails={setChargeDetails}
                  chargeDetails={chargeDetails}
                />
              </Card>
            </Grid>
            <Grid md={9}>
              <Card>
                <ChargeInOutTableToolbar
                  filters={filters}
                  onFilters={handleFilters}
                  chargeDetails={chargeDetails}
                />
                {canReset && (
                  <ChargeInOutTableFiltersResult
                    filters={filters}
                    onFilters={handleFilters}
                    onResetFilters={handleResetFilters}
                    results={dataFiltered.length}
                    setChargeDetails={setChargeDetails}
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
                        zIndex: 1000,
                        backgroundColor: '#2f3944',
                      }}
                    />
                    <TableBody>
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage,
                        )
                        .map((row) => (
                          <ChargeInOutTableRow
                            key={row._id}
                            row={row}
                            selected={table.selected.includes(row._id)}
                            onSelectRow={() => table.onSelectRow(row._id)}
                            onEditRow={() => handleEditRow(row._id)}
                            onDeleteRow={() => handleDeleteRow(row._id)}
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
            </Grid>
          </Grid>
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
  const { name, chargeType, category, startDate, endDate } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis?.map((el) => el[0]);

  if (name && name.trim()) {
    inputData = inputData.filter(
      (sch) =>
        sch?.chargeType?.toLowerCase().includes(name?.toLowerCase()) ||
        sch?.detail?.toLowerCase().includes(name?.toLowerCase()),
    );
  }
  if (category) {
    inputData = inputData.filter((item) => item.status === category);
  }
  if (chargeType) {
    inputData = inputData?.filter((item) => chargeType === item.chargeType);
  }
  if (!dateError && startDate && endDate) {
    inputData = inputData.filter((item) => isBetween(new Date(item.date), startDate, endDate));
  }
  return inputData;
}
