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
import axios from 'axios';
import {paths} from 'src/routes/paths';
import {useRouter} from 'src/routes/hooks';
import {RouterLink} from 'src/routes/components';

import {useBoolean} from 'src/hooks/use-boolean';
import {useGetInquiry} from 'src/api/inquiry'
import {_roles, _userList, USER_STATUS_OPTIONS} from 'src/_mock';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {useSnackbar} from 'src/components/snackbar';
import {ConfirmDialog} from 'src/components/custom-dialog';
import {useSettingsContext} from 'src/components/settings';
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
import {useAuthContext} from 'src/auth/hooks';
import InquiryTableRow from '../inquiry-table-row';
import InquiryTableToolbar from '../inquiry-table-toolbar';
import InquiryTableFiltersResult from '../inquiry-table-filters-result';
import {isAfter, isBetween} from '../../../utils/format-time';
import { LoadingScreen } from '../../../components/loading-screen';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{value: 'all', label: 'All'}, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  {id: 'date', label: 'Date'},
  {id: 'name', label: 'Name'},
  {id: 'contact', label: 'Contact No.'},
  {id: 'email', label: 'Email'},
  {id: 'inquiry for', label: 'Inquiry For'},
  {id: 'remark', label: 'Remark'},
  {id: '', width: 88},
];

const defaultFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};
// ----------------------------------------------------------------------

export default function InquiryListView() {
  const {enqueueSnackbar} = useSnackbar();
  const {inquiry, mutate , inquiryLoading} = useGetInquiry();
  const table = useTable();
  const {user} = useAuthContext();
  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(inquiry);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: inquiry,
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
  const dateError = isAfter(filters.startDate, filters.endDate);
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

  const handleDelete = (id) => {
    axios.delete(`${import.meta.env.VITE_BASE_URL}/${user.data?.company}/inquiry`, {
      data: {ids: id}
    }).then((res) => {
      enqueueSnackbar(res.data.message);
      confirm.onFalse();
      mutate();
    }).catch((err) => enqueueSnackbar("Failed to delete Inquiry"));
  }

  const handleDeleteRow = useCallback(
    (id) => {
      if (id) {
        handleDelete([id]);
        setTableData(deleteRow);

        table.onUpdatePageDeleteRow(dataInPage.length);
      }
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = inquiry.filter((row) => table.selected.includes(row._id));
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
      router.push(paths.dashboard.inquiry.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  if(inquiryLoading){
    return (
      <LoadingScreen/>
    )
  }
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Inquiry List"
          links={[
            {name: 'Dashboard', href: paths.dashboard.root},
            {name: 'Inquiry', href: paths.dashboard.inquiry.root},
            {name: 'List'},
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.inquiry.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line"/>}
            >
              New Inquiry
            </Button>
          }
          sx={{
            mb: {xs: 3, md: 5},
          }}
        />

        <Card>

          <InquiryTableToolbar
            filters={filters} onFilters={handleFilters} dateError={dateError}
          />

          {canReset && (
            <InquiryTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{p: 2.5, pt: 0}}
            />
          )}

          <TableContainer sx={{position: 'relative', overflow: 'unset'}}>
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
                    <Iconify icon="solar:trash-bin-trash-bold"/>
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{minWidth: 960}}>
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
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <InquiryTableRow
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
                   <TableNoData notFound={notFound}/>
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
function applyFilter({inputData, comparator, filters, dateError}) {
  const {startDate, endDate, status, name} = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  if (name && name.trim()) {
    inputData = inputData.filter(
      (inq) =>
        inq.firstName.toLowerCase().includes(name.toLowerCase()) ||
        inq.lastName.toLowerCase().includes(name.toLowerCase()) ||
        inq.contact.toLowerCase().includes(name)
    );
  }

  if (!dateError && startDate && endDate) {
    inputData = inputData.filter((order) =>
      isBetween(new Date(order.date), startDate, endDate)
    );
  }

  return inputData;
}
