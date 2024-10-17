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

import { _roles, _userList, USER_STATUS_OPTIONS } from 'src/_mock';
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


import SchemeTableToolbar from '../scheme-table-toolbar';
import SchemeTableFiltersResult from '../scheme-table-filters-result';
import SchemeTableRow from '../scheme-table-row';
import { Box} from '@mui/material';
import Label from '../../../components/label';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
import { useGetScheme } from '../../../api/scheme';
import axios from 'axios';
import { useAuthContext } from '../../../auth/hooks';
import { useGetConfigs } from '../../../api/config';
import { LoadingScreen } from '../../../components/loading-screen';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, { value: 'true', label: 'Active' }, {
  value: 'false',
  label: 'Non Active',
}];

const TABLE_HEAD = [
  { id: 'scheme name', label: 'Scheme Name' },
  { id: 'rate per gram', label: 'Rate per Gram' },
  { id: 'interest rate', label: 'Interest Rate' },
  { id: 'valuation per%', label: 'Valuation per%' },
  { id: 'interest period', label: 'Interest Period' },
  { id: 'renewal time', label: 'Renewal Time' },
  { id: 'minimum loan time', label: 'Minimum Loan Time' },
  { id: 'scheme type', label: 'Scheme Type' },
  { id: 'active', label: 'Active' },
  { id: '', width: 88 },
];


const defaultFilters = {
  name: '',
  isActive: 'all',
};
// ----------------------------------------------------------------------

export default function SchemeListView() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const {scheme,mutate,schemeLoading} = useGetScheme()
  const { configs } = useGetConfigs();
  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();


  const [tableData, setTableData] = useState(scheme);

  const [filters, setFilters] = useState(defaultFilters);


  const dataFiltered = applyFilter({
    inputData: scheme,
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
  const
    handleFilters = useCallback(
    (name, value) => {
      console.log("name",value)
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
      const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/${user?.company}/scheme`, {
        data: { ids: id },
      });
      enqueueSnackbar(res.data.message);
      confirm.onFalse();
      mutate();
    } catch (err) {
      enqueueSnackbar("Failed to delete Scheme");
    }
  };
  const handleDeleteRow = useCallback(
    (id) => {
    handleDelete([id])

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData],
  );
  const handleDeleteRows = useCallback(() => {
    const deleteRows = scheme.filter((row) => table.selected.includes(row._id));
     const deleteIds = deleteRows.map((row) => row._id);
     handleDelete(deleteIds)
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.scheme.edit(id));
    },
    [router],
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('isActive', newValue);
    },
    [handleFilters],
  );
  if(schemeLoading){
    return (
      <LoadingScreen/>
    )
  }
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Scheme List'
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Scheme', href: paths.dashboard.scheme.root },
            { name: 'List' },
          ]}
          action={
            <Box>
              <Button
                component={RouterLink}
                href={paths.dashboard.scheme.goldpricelist}
                variant='contained'
                sx={{ mx: 2 }}
              >
                Gold Price change
              </Button>
              <Button
                component={RouterLink}
                href={paths.dashboard.scheme.new}
                variant='contained'
                startIcon={<Iconify icon='mingcute:add-line' />}
              >
                Create Scheme
              </Button>
            </Box>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          <Tabs
            value={filters.isActive}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition='end'
                value={tab.value}
                label={tab.label}
                icon={
                  <>
                    <Label
                      style={{ margin: '5px' }}
                      variant={
                        ((tab.value === 'all' || tab.value == filters.isActive) && 'filled') || 'soft'
                      }
                      color={
                        (tab.value == 'true' && 'success') ||
                        (tab.value == 'false' && 'error') ||
                        'default'
                      }
                    >
                      {['false','true'].includes(tab.value)
                        ? scheme.filter((emp) => String(emp.isActive) == tab.value).length
                        : scheme.length}
                    </Label>
                  </>
                }
              />
            ))}
          </Tabs>
          <SchemeTableToolbar
            filters={filters} onFilters={handleFilters}
          />

         {canReset && (
            <SchemeTableFiltersResult
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
                  ,
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
                      dataFiltered.map((row) => row._id),
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage,
                    )
                    .map((row) => (
                      <SchemeTableRow
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
};

// ----------------------------------------------------------------------
function applyFilter({ inputData, comparator, filters }) {
  const { isActive, name } = filters;

  // Sort input data based on the provided comparator (e.g., sorting by a column)
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  // Filter by scheme name if provided
  if (name && name.trim()) {
    inputData = inputData.filter(
      (sch) =>
        sch.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  if (isActive !== 'all') {
    inputData = inputData.filter((scheme) => scheme.isActive === (isActive == 'true'));
  }

  return inputData;
}
