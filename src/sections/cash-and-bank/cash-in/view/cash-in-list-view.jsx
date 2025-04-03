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
import { paths } from 'src/routes/paths.js';
import { useRouter } from 'src/routes/hooks/index.js';
import { RouterLink } from 'src/routes/components/index.js';
import { useBoolean } from 'src/hooks/use-boolean.js';
import Iconify from 'src/components/iconify/index.js';
import Scrollbar from 'src/components/scrollbar/index.js';
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
import CashInTableToolbar from '../cash-in-table-toolbar.jsx';
import CashInTableFiltersResult from '../cash-in-table-filters-result.jsx';
import CashInTableRow from '../cash-in-table-row.jsx';
import { Box } from '@mui/material';
import Label from '../../../../components/label/index.js';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
import { useGetScheme } from '../../../../api/scheme.js';
import axios from 'axios';
import { useAuthContext } from '../../../../auth/hooks/index.js';
import { useGetConfigs } from '../../../../api/config.js';
import { LoadingScreen } from '../../../../components/loading-screen/index.js';
import { getResponsibilityValue } from '../../../../permission/permission.js';

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
  { id: 'type', label: 'Type' },
  { id: 'name', label: 'Name' },
  { id: 'date', label: 'Date' },
  { id: 'Amount', label: 'Amount' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  isActive: 'all',
};

const data = [
  {
    type: 'Payment-in',
    name: 'Heet kumar timbadiya',
    date: '01/04/2025',
    amount: 50000,
  },
  {
    type: 'Payment-Out',
    name: 'sujal kumar paghdal',
    date: '01/04/2025',
    amount: 50000,
  },
  {
    type: 'Payment-Out',
    name: 'Darshil kumar Thummar',
    date: '01/04/2025',
    amount: 50000,
  },
  {
    type: 'Payment-in',
    name: 'kaushal kumar Sojitra',
    date: '01/04/2025',
    amount: 50000,
  },
  {
    type: 'Payment-Out',
    name: 'Monil kumar kakadiya',
    date: '01/04/2025',
    amount: 50000,
  },
];

// ----------------------------------------------------------------------

export default function CashInListView() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { scheme, mutate, schemeLoading } = useGetScheme();
  const { configs } = useGetConfigs();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [tableData, setTableData] = useState(data);
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: data,
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
      const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/${user?.company}/scheme`, {
        data: { ids: id },
      });
      enqueueSnackbar(res.data.message);
      confirm.onFalse();
      mutate();
    } catch (err) {
      enqueueSnackbar('Failed to delete Scheme');
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
      router.push(paths.dashboard.scheme.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('isActive', newValue);
    },
    [handleFilters]
  );

  const schemes = scheme.map((item) => ({
    Name: item.name,
    'Rate per gram': item.ratePerGram,
    'Interest rate': item.interestRate,
    valuation: item.valuation,
    'Interest period': item.interestPeriod,
    'Renewal time': item.renewalTime,
    'min loan time': item.minLoanTime,
    Type: item.schemeType,
    remark: item.remark,
    Status: item.isActive === true ? 'Active' : 'inActive',
  }));

  if (schemeLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Cash In"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Cash in', href: paths.dashboard.scheme.root },
            { name: 'List' },
          ]}
          // action={
          //   <Box>
          //     {getResponsibilityValue('print_gold_price_change', configs, user) && (
          //       <Button
          //         component={RouterLink}
          //         href={paths.dashboard.scheme.goldpricelist}
          //         variant="contained"
          //         sx={{ mx: 2 }}
          //       >
          //         Gold Price change
          //       </Button>
          //     )}
          //     {getResponsibilityValue('create_scheme', configs, user) && (
          //       <Button
          //         component={RouterLink}
          //         href={paths.dashboard.scheme.new}
          //         variant="contained"
          //         startIcon={<Iconify icon="mingcute:add-line" />}
          //       >
          //         Add Scheme
          //       </Button>
          //     )}
          //   </Box>
          // }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          {/*<Tabs*/}
          {/*  value={filters.isActive}*/}
          {/*  onChange={handleFilterStatus}*/}
          {/*  sx={{*/}
          {/*    px: 2.5,*/}
          {/*    boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,*/}
          {/*  }}*/}
          {/*>*/}
          {/*  {STATUS_OPTIONS.map((tab) => (*/}
          {/*    <Tab*/}
          {/*      key={tab.value}*/}
          {/*      iconPosition="end"*/}
          {/*      value={tab.value}*/}
          {/*      label={tab.label}*/}
          {/*      icon={*/}
          {/*        <>*/}
          {/*          <Label*/}
          {/*            style={{ margin: '5px' }}*/}
          {/*            variant={*/}
          {/*              ((tab.value === 'all' || tab.value == filters.isActive) && 'filled') ||*/}
          {/*              'soft'*/}
          {/*            }*/}
          {/*            color={*/}
          {/*              (tab.value == 'true' && 'success') ||*/}
          {/*              (tab.value == 'false' && 'error') ||*/}
          {/*              'default'*/}
          {/*            }*/}
          {/*          >*/}
          {/*            {['false', 'true'].includes(tab.value)*/}
          {/*              ? scheme.filter((emp) => String(emp.isActive) == tab.value).length*/}
          {/*              : scheme.length}*/}
          {/*          </Label>*/}
          {/*        </>*/}
          {/*      }*/}
          {/*    />*/}
          {/*  ))}*/}
          {/*</Tabs>*/}
          <CashInTableToolbar filters={filters} onFilters={handleFilters} schemes={schemes} />
          {canReset && (
            <CashInTableFiltersResult
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
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row._id)
                  )
                }
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
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <CashInTableRow
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
function applyFilter({ inputData, comparator, filters }) {
  const { isActive, name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  if (name && name.trim()) {
    inputData = inputData.filter((sch) => sch.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (isActive !== 'all') {
    inputData = inputData.filter((scheme) => scheme.isActive === (isActive == 'true'));
  }

  return inputData;
}
