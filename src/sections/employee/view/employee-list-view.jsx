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

import EmployeeTableRow from '../employee-table-row';
import EmployeeTableToolbar from '../employee-table-toolbar';
import EmployeeTableFiltersResult from '../employee-table-filters-result';
import { isAfter, isBetween } from '../../../utils/format-time';
import { alpha } from '@mui/material/styles';
import { Tab, Tabs } from '@mui/material';
import Label from '../../../components/label';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' },{value: 'active', label: 'Active' },{value: 'pending', label: 'Pending' },{value: 'banned', label: 'Banned' }];

const TABLE_HEAD = [
  { id: 'username', label: 'UserName' },
  { id: 'phoneNumber', label: 'Phone Number'},
  { id: 'employeeCode', label: 'Employee Code' },
  { id: 'idProofs', label: 'ID Proofs' },
  { id: 'joinDate', label: 'Join Date'},
  { id: 'role', label: 'Role'},
  { id: 'status', label: 'Status'},
  { id: '', width: 88 },
];
const dummyData = [
  {
    id: 1,
    userName: 'Aditi Devani',
    Email: 'aditi45@gmail.com',
    contact: '+91 48596 52632',
    employeeCode: 'EGF000001',
    idProofs: 'Driving License',
    joinDate: '12 Apr 2024',
    role: 'Director',
    status: "active",
  },
  {
    id: 2,
    userName: 'Rohan Patel',
    Email: 'rohan.patel@example.com',
    contact: '+91 98765 43210',
    employeeCode: 'EGF000002',
    idProofs: 'Passport',
    joinDate: '10 May 2023',
    role: 'MD',
    status: "pending",
  },
  {
    id: 3,
    userName: 'Priya Shah',
    email: 'priya.shah@example.com',
    contact: '+91 12345 67890',
    employeeCode: 'EGF000003',
    idProofs: 'Aadhaar Card',
    joinDate: '01 Mar 2024',
    role: 'Manager',
    status: "banned",
  },
  {
    id: 4,
    userName: 'Harsh Mehta',
    email: 'harsh.mehta@example.com',
    contact: '+91 55555 12345',
    employeeCode: 'EGF000004',
    idProofs: 'PAN Card',
    joinDate: '15 Jun 2023',
    role: 'Employee',
    status: "active",
  },
  {
    id: 5,
    userName: 'Sneha Desai',
    email: 'sneha.desai@example.com',
    contact: '+91 88888 99999',
    employeeCode: 'EGF000005',
    idProofs: 'Voter ID',
    joinDate: '20 Aug 2024',
    role: 'Employee',
    status: "active",
  },
  {
    id: 6,
    userName: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    contact: '+91 67678 90909',
    employeeCode: 'EGF000006',
    idProofs: 'Driving License',
    joinDate: '22 Feb 2024',
    role: 'Employee',
    status: "active",
  }
];

const defaultFilters = {
  userName: '',
  status: 'all',
};
// ----------------------------------------------------------------------

export default function EmployeeListView() {
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

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      enqueueSnackbar('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
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
      router.push(paths.dashboard.employee.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Employee List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Masters', href: paths.dashboard.employee.root },
            { name: 'Employee List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.employee.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Employee
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
            <Tabs
              value={filters.status}
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
                          ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                        }
                        color={
                          (tab.value === 'active' && 'success') ||
                          (tab.value === 'pending' && 'warning') ||
                          (tab.value === 'banned' && 'error') ||
                          'default'
                        }
                      >
                        {['active', 'pending', 'banned'].includes(tab.value)
                          ? dummyData.filter((emp) => emp.status === tab.value).length
                          : dummyData.length}
                      </Label>
                    </>
                  }
                />
              ))}
            </Tabs>
          <EmployeeTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <EmployeeTableFiltersResult
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
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <EmployeeTableRow
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
  const { status, userName } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);
  if (userName && userName.trim()) {
    inputData = inputData.filter(
      (inq) =>
        inq.userName.toLowerCase().includes(userName.toLowerCase())
        // inq.phoneNumber.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status && status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  return inputData;
}
