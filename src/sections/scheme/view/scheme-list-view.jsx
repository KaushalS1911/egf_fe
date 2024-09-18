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


import { isAfter, isBetween } from '../../../utils/format-time';
import SchemeTableToolbar from '../scheme-table-toolbar';
import SchemeTableFiltersResult from '../scheme-table-filters-result';
import SchemeTableRow from '../scheme-table-row';
import { Box, CircularProgress } from '@mui/material';
import Label from '../../../components/label';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
import { valueToPercent } from '@mui/material/Slider/useSlider';

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
const dummyData = [
  {
    id: 1,
    schemeName: 'darshuil',
    ratePerGram: '3589.00',
    interestRate: '1.00%',
    valuationPer: '57.00%',
    interestPeriod: 'Monthly',
    renewalTime: 'Monthly',
    schemeType: 'Regular',
    isActive: false,
  }, {
    id: 2,
    schemeName: 'sujal',
    ratePerGram: '3589.00',
    interestRate: '1.00%',
    valuationPer: '57.00%',
    interestPeriod: 'Monthly',
    renewalTime: 'Monthly',
    schemeType: 'Regular',
    isActive: false,
  }, {
    id: 3,
    schemeName: 'dev',
    ratePerGram: '3589.00',
    interestRate: '1.00%',
    valuationPer: '57.00%',
    interestPeriod: 'Monthly',
    renewalTime: 'Monthly',
    schemeType: 'Regular',
    isActive: false,
  }, {
    id: 4,
    schemeName: 'EGF1M001',
    ratePerGram: '3589.00',
    interestRate: '1.00%',
    valuationPer: '57.00%',
    interestPeriod: 'Monthly',
    renewalTime: 'Monthly',
    schemeType: 'Regular',
    isActive: false,
  }, {
    id: 5,
    schemeName: 'EGF1M001',
    ratePerGram: '3589.00',
    interestRate: '1.00%',
    valuationPer: '57.00%',
    interestPeriod: 'Monthly',
    renewalTime: 'Monthly',
    schemeType: 'Regular',
    isActive: true,
  }, {
    id: 6,
    schemeName: 'EGF1M001',
    ratePerGram: '3589.00',
    interestRate: '1.00%',
    valuationPer: '57.00%',
    interestPeriod: 'Monthly',
    renewalTime: 'Monthly',
    schemeType: 'Regular',
    isActive: true,
  }, {
    id: 7,
    schemeName: 'EGF1M001',
    ratePerGram: '3589.00',
    interestRate: '1.00%',
    valuationPer: '57.00%',
    interestPeriod: 'Monthly',
    renewalTime: 'Monthly',
    schemeType: 'Regular',
    isActive: true,
  }, {
    id: 8,
    schemeName: 'EGF1M001',
    ratePerGram: '3589.00',
    interestRate: '1.00%',
    valuationPer: '57.00%',
    interestPeriod: 'Monthly',
    renewalTime: 'Monthly',
    schemeType: 'Regular',
    isActive: true,
  }, {
    id: 9,
    schemeName: 'EGF1M001',
    ratePerGram: '3589.00',
    interestRate: '1.00%',
    valuationPer: '57.00%',
    interestPeriod: 'Monthly',
    renewalTime: 'Monthly',
    schemeType: 'Regular',
    isActive: true,
  }, {
    id: 10,
    schemeName: 'EGF1M001',
    ratePerGram: '3589.00',
    interestRate: '1.00%',
    valuationPer: '57.00%',
    interestPeriod: 'Monthly',
    renewalTime: 'Monthly',
    schemeType: 'Regular',
    isActive: true,
  }, {
    id: 11,
    schemeName: 'EGF1M001',
    ratePerGram: '3589.00',
    interestRate: '1.00%',
    valuationPer: '57.00%',
    interestPeriod: 'Monthly',
    renewalTime: 'Monthly',
    schemeType: 'Regular',
    isActive: true,
  }, {
    id: 12,
    schemeName: 'heet',
    ratePerGram: '3589.00',
    interestRate: '1.00%',
    valuationPer: '57.00%',
    interestPeriod: 'Monthly',
    renewalTime: 'Monthly',
    schemeType: 'Regular',
    isActive: true,
  },

];

const defaultFilters = {
  schemeName: '',
  isActive: 'all',
};
// ----------------------------------------------------------------------

export default function InquiryListView() {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(dummyData);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
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

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      enqueueSnackbar('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData],
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router],
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('isActive', newValue);
    },
    [handleFilters],
  );

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
                href={paths.dashboard.scheme.new}
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
                        ? dummyData.filter((emp) => String(emp.isActive) == tab.value).length
                        : dummyData.length}
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
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id),
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
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
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
  const { isActive, schemeName } = filters;

  // Sort input data based on the provided comparator (e.g., sorting by a column)
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  // Filter by scheme name if provided
  if (schemeName && schemeName.trim()) {
    inputData = inputData.filter(
      (sch) =>
        sch.schemeName.toLowerCase().includes(schemeName.toLowerCase()),
    );
  }

  // Adjust the logic to filter based on the 'isActive' status
  if (isActive !== 'all') {
    inputData = inputData.filter((scheme) => scheme.isActive === (isActive == 'true'));
  }

  return inputData;
}

