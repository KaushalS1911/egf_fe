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
import BankAccountTableToolbar from '../bank-account-table-toolbar.jsx';
import BankAccountTableFiltersResult from '../bank-account-table-filters-result.jsx';
import BankAccountTableRow from '../bank-account-table-row.jsx';
import { Box, Grid } from '@mui/material';
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
import Typography from '@mui/material/Typography';
import AccountsListView from '../accounts/view/accounts-list-view.jsx';
import { useGetBankTransactions } from '../../../../api/bank-transactions.js';

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
  { id: '#', label: '' },
  { id: 'type', label: 'Type' },
  { id: 'name', label: 'Detail' },
  { id: 'date', label: 'Date' },
  { id: 'Amount', label: 'Amount' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  isActive: 'all',
};

// ----------------------------------------------------------------------

export default function BankAccountListView() {
  const { bankTransactions, mutate, bankTransactionsLoading } = useGetBankTransactions();
  const { enqueueSnackbar } = useSnackbar();
  const [accountDetails, setAccountDetails] = useState({});
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [tableData, setTableData] = useState(bankTransactions);
  const [filters, setFilters] = useState({ ...defaultFilters, account: accountDetails });

  // useEffect(() => {
  //   setAccountDetails();
  // }, [bankTransactions]);

  useEffect(() => {
    if (bankTransactions?.bankBalances && bankTransactions?.bankBalances.length > 0) {
      setAccountDetails(
        bankTransactions?.bankBalances[Number(bankTransactions?.bankBalances?.length) - 1]
      );
    }
  }, [bankTransactions.bankBalances]);

  useEffect(() => {
    setFilters({ ...defaultFilters, account: accountDetails });
  }, [accountDetails]);
  const dataFiltered = applyFilter({
    inputData: bankTransactions?.transactions,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });
  const dataInPage = dataFiltered?.slice(
    table.page * table?.rowsPerPage,
    table.page * table?.rowsPerPage + table?.rowsPerPage
  );

  const denseHeight = table?.dense ? 56 : 56 + 20;
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

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

  const handleDeleteRow = useCallback(
    (id) => {
      handleDelete([id]);

      table.onUpdatePageDeleteRow(dataInPage?.length);
    },
    [dataInPage?.length, enqueueSnackbar, table, tableData]
  );

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

  if (bankTransactionsLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Bank Accounts"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Bank Accounts', href: paths.dashboard.scheme.root },
            { name: 'List' },
          ]}
          sx={{
            mb: { xs: 3, md: 1 },
          }}
        />
        <Card sx={{ p: 2 }}>
          <Grid container>
            <Grid md={3}>
              <Card sx={{ height: '100%', p: 2, mr: 2 }}>
                <AccountsListView
                  accounts={bankTransactions.bankBalances}
                  setAccountDetails={setAccountDetails}
                  accountDetails={accountDetails}
                />
              </Card>
            </Grid>
            <Grid md={9}>
              <Card>

                <BankAccountTableToolbar filters={filters} onFilters={handleFilters} accountDetails={accountDetails} />
                {/*{canReset && (*/}
                {/*  <BankAccountTableFiltersResult*/}
                {/*    filters={filters}*/}
                {/*    onFilters={handleFilters}*/}
                {/*    onResetFilters={handleResetFilters}*/}
                {/*    results={dataFiltered.length}*/}
                {/*    setAcc={setAccountDetails}*/}
                {/*    sx={{ p: 2.5, pt: 0 }}*/}
                {/*  />*/}
                {/*)}*/}
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
                          <BankAccountTableRow
                            key={row._id}
                            row={row}
                            selected={table.selected.includes(row._id)}
                            onSelectRow={() => table.onSelectRow(row._id)}
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
            </Grid>
          </Grid>
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
  const { isActive, name, account } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis?.map((el) => el[0]);

  if (name && name.trim()) {
    inputData = inputData.filter((sch) =>
      sch?.transitions?.details?.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (account) {
    inputData = inputData?.filter((acc) => account.bankName === acc.bankName);
  }

  return inputData;
}
