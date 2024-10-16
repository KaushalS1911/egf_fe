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

import LoanpayhistoryTableRow from '../loanpayhistory-table-row';
import LoanpayhistoryTableToolbar from '../loanpayhistory-table-toolbar';
import LoanpayhistoryTableFiltersResult from '../loanpayhistory-table-filters-result';
import {useGetEmployee} from 'src/api/employee'
import axios from 'axios';
import { useAuthContext } from '../../../auth/hooks';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Label from '../../../components/label';
import { useGetDisburseLoan } from '../../../api/disburseLoan';

// ----------------------------------------------------------------------



const TABLE_HEAD = [
  { id: '', label: '#' },
  { id: 'loanNo', label: 'Loan No.'},
  { id: 'customerName', label: 'Customer Name'},
  { id: 'contact', label: 'Mobile No.'},
  { id: 'interestLoanAmount', label: 'Interest Loan Amount'},
  { id: 'interestRate', label: 'Interest Rate'},
  { id: 'cashAmount', label: 'Cash Amount'},
  { id: 'bankAmount', label: 'Bank Amount'},
];

const defaultFilters = {
  username: '',
};
// ----------------------------------------------------------------------

export default function LoanpayhistoryListView() {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable();
  const {user} = useAuthContext();
  const { disburseLoan , mutate} = useGetDisburseLoan();
  const settings = useSettingsContext();
  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(disburseLoan);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: disburseLoan,
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
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/${user?.company}/employee`, {
        data: { ids: id },
      });
      confirm.onFalse();
      mutate();
      enqueueSnackbar(res.data.message);
    } catch (err) {
      enqueueSnackbar("Failed to delete Employee");
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
    const deleteRows = disburseLoan.filter((row) => table.selected.includes(row._id));
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
      router.push(paths.dashboard.loanPayHistory.edit(id));
    },
    [router]
  );


  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Loan Pay History"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Loan Pay History', href: paths.dashboard.loanPayHistory.root },
            { name: 'List' },
          ]}
          // action={
          //   <Button
          //     component={RouterLink}
          //     href={paths.dashboard.employee.new}
          //     variant="contained"
          //     startIcon={<Iconify icon="mingcute:add-line" />}
          //   >
          //     Add Loan
          //   </Button>
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
          {/*      iconPosition='end'*/}
          {/*      value={tab.value}*/}
          {/*      label={tab.label}*/}
          {/*      icon={*/}
          {/*        <>*/}
          {/*          <Label*/}
          {/*            style={{ margin: '5px' }}*/}
          {/*            variant={*/}
          {/*              ((tab.value === 'all' || tab.value == filters.isActive) && 'filled') || 'soft'*/}
          {/*            }*/}
          {/*            color={*/}
          {/*              (tab.value == 'true' && 'success') ||*/}
          {/*              (tab.value == 'false' && 'error') ||*/}
          {/*              'default'*/}
          {/*            }*/}
          {/*          >*/}
          {/*            {['false','true'].includes(tab.value)*/}
          {/*              ? property.filter((emp) => String(emp.isActive) == tab.value).length*/}
          {/*              : property.length}*/}
          {/*          </Label>*/}
          {/*        </>*/}
          {/*      }*/}
          {/*    />*/}
          {/*  ))}*/}
          {/*</Tabs>*/}
          <LoanpayhistoryTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <LoanpayhistoryTableFiltersResult
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
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row,index) => (
                      <LoanpayhistoryTableRow
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
            //
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
  const {  username } = filters;

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
        item.customer.lastName.toLowerCase().includes(username.toLowerCase())
    );
  }
  return inputData;
}
