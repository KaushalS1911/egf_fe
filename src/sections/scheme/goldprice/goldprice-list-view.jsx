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
import { useGetScheme } from '../../../api/scheme';
import axios from 'axios';
import { useAuthContext } from '../../../auth/hooks';
import GoldpriceTableRow from './goldprice-table-row';
import { useGetConfigs } from '../../../api/config';
import GoldpriceTableToolbar from './goldprice-table-toolbar';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'index', label: '#' },
  { id: 'scheme name', label: 'Scheme Name' },
  { id: 'interest rate', label: 'Interest Rate' },
  { id: 'valuation per%', label: 'Valuation per%' },
  { id: 'rate per gram', label: 'Rate per Gram' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export default function GoldpriceListView() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const table = useTable();
  const {configs} = useGetConfigs()
const defaultFilters = {
  name: '',
  isActive: 'all',
};

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const {scheme,mutate} = useGetScheme()

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
const handleDelete = (id) =>{
  axios.delete(`${import.meta.env.VITE_BASE_URL}/${user?.company}/scheme/?branch=66ea5ebb0f0bdc8062c13a64`, { data: { ids: id } })
    .then((res)=> {
      mutate();
      confirm.onFalse();
      enqueueSnackbar(res.data.message)
    }).catch((err)=>enqueueSnackbar("Failed To Delete Scheme"))
}
  const handleDeleteRow = useCallback(
    (id) => {
    handleDelete([id])
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData],
  );
  const handleDeleteRows = useCallback(() => {
    const deleteRows = scheme.filter((row) => table.selected.includes(row._id));
     const deleteIds = deleteRows.map((row) => row._id);
    console.log("yhbjuyh",deleteIds);
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

  const handleSave = async ()=>{
    const payload = dataFiltered.map((item) => ({...item, ratePerGram: parseFloat(item.valuation) * parseFloat(filters.name)/100}));
    try {
    const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`,{goldRate : filters.name})
    const resScheme = await axios.put(`${import.meta.env.VITE_BASE_URL}/${user?.company}/update-schemes?branch=66ea5ebb0f0bdc8062c13a64`,{schemes:payload})
      enqueueSnackbar(resScheme?.data.message);
    router.push(paths.dashboard.scheme.list);

    }
    catch (error) {
      enqueueSnackbar("Failed to Update schemes",{variant:'error'});
    }
  }
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Change Golg Price'
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Scheme', href: paths.dashboard.scheme.root },
            { name: 'List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          <GoldpriceTableToolbar
            filters={filters} onFilters={handleFilters} goldRate={configs?.goldRate}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id),
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

                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage,
                    )
                    .map((row,index) => (
                      <GoldpriceTableRow
                        goldRate = {filters.name}
                        key={row._id}
                        index={index}
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
        <Stack  alignItems="flex-end" sx={{mt:3}}>
          <LoadingButton type='submit' variant='contained' onClick={handleSave}>
            Save
          </LoadingButton>
        </Stack>
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

  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);


  return inputData;
}

