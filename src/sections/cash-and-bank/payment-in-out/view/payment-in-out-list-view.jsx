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
import PaymentInOutTableToolbar from '../payment-in-out-table-toolbar.jsx';
import PaymentInOutTableRow from '../payment-in-out-table-row.jsx';
import { Box, Grid } from '@mui/material';
import { LoadingScreen } from '../../../../components/loading-screen/index.js';
import Typography from '@mui/material/Typography';
import { useGetBankTransactions } from '../../../../api/bank-transactions.js';
import { isBetween } from '../../../../utils/format-time.js';
import PartiesListView from '../parties/view/parties-list-view.jsx';
import CustomPopover, { usePopover } from '../../../../components/custom-popover/index.js';
import ReminderRecallingForm from '../../../reminder/reminder-recalling-form.jsx';
import PartyNewEditForm from '../parties/party-new-edit-form.jsx';
import RouterLink from '../../../../routes/components/router-link.jsx';
import { useGetPayment } from '../../../../api/payment-in-out.js';
import axiosInstance from 'src/utils/axios.js';
import { useAuthContext } from 'src/auth/hooks';
import BankAccountTableFiltersResult from '../../bank-account/bank-account-table-filters-result.jsx';
import PaymentInOutTableFiltersResult from '../payment-in-out-table-filters-result.jsx';
import { useGetParty } from '../../../../api/party.js';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '#', label: '' },
  { id: 'party', label: 'party' },
  { id: 'receiptNo', label: 'Receipt no' },
  { id: 'date', label: 'Date' },
  { id: 'paymentMode', label: 'Payment mode' },
  { id: 'cashAmount', label: 'Cash amt' },
  { id: 'bankAmount', label: 'Bank amt' },
  { id: 'bank', label: 'Bank' },
  { id: 'status', label: 'satus' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  category: '',
  startDate: null,
  endDate: null,
  party: {},
};

// ----------------------------------------------------------------------

export default function PaymentInOutListView() {
  const { enqueueSnackbar } = useSnackbar();
  const [partyDetails, setPartyDetails] = useState({});
  const { payment, mutate, paymentLoading } = useGetPayment();
  const { party, mutate: mutateParty, partyLoading } = useGetParty();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [filters, setFilters] = useState(defaultFilters);
  const partyPopover = usePopover();
  const [open, setOpen] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    setFilters({ ...defaultFilters, party: partyDetails });
  }, [partyDetails]);

  const dataFiltered = applyFilter({
    inputData: payment,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const receivableAmt = party.reduce(
    (prev, next) => prev + (Number(next.amount >= 0 && next?.amount) || 0),
    0
  );

  const payAbleAmt = party.reduce(
    (prev, next) => prev + (Number(next.amount <= 0 && next?.amount) || 0),
    0
  );

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

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.cashAndBank['payment-in-out'].edit(id));
    },
    [router]
  );

  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(
        `${import.meta.env.VITE_BASE_URL}/${user?.company}/payment/${id}`
      );
      enqueueSnackbar(res.data.message);
      confirm.onFalse();
      mutate();
    } catch (err) {
      enqueueSnackbar('Failed to delete Payment');
    }
  };

  const handleDeleteRow = useCallback(
    (id) => {
      handleDelete(id);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = dataFiltered.filter((row) => table.selected.includes(row._id));
    const deleteIds = deleteRows.map((row) => row._id);

    deleteIds.forEach((id) => handleDelete(id));

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered, dataInPage.length, table]);

  if (paymentLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={
            <Typography variant="h4" gutterBottom>
              Payment In/Out :{' '}
              <strong style={{ marginLeft: 200 }}>
                Receivable : -
                <span style={{ color: 'green', marginLeft: 10 }}>{receivableAmt.toFixed(2)}</span>
              </strong>
              <strong style={{ marginLeft: 20 }}>
                Payable : -
                <span style={{ color: 'red', marginLeft: 10 }}>
                  {Math.abs(payAbleAmt).toFixed(2)}
                </span>
              </strong>
            </Typography>
          }
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Payment in/out' },
            { name: 'List' },
          ]}
          action={
            <>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => setOpen(true)}
              >
                Add Party
              </Button>{' '}
              <Button
                component={RouterLink}
                href={paths.dashboard.cashAndBank['payment-in-out'].new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Add Payment
              </Button>
            </>
          }
          sx={{
            mb: { xs: 3, md: 1 },
          }}
        />
        <Card sx={{ p: 2 }}>
          <Grid container>
            <Grid md={3}>
              <Card sx={{ height: '100%', p: 2, mr: 2 }}>
                <PartiesListView
                  setPartyDetails={setPartyDetails}
                  partyDetails={partyDetails}
                  party={party}
                  mutateParty={mutateParty}
                  partyLoading={partyLoading}
                />
              </Card>
            </Grid>
            <Grid md={9}>
              <PartyNewEditForm open={open} setOpen={setOpen} mutate={mutateParty} />
              <Card>
                <PaymentInOutTableToolbar
                  filters={filters}
                  onFilters={handleFilters}
                  partyDetails={partyDetails}
                  mutate={mutate}
                />
                {canReset && (
                  <PaymentInOutTableFiltersResult
                    filters={filters}
                    onFilters={handleFilters}
                    onResetFilters={handleResetFilters}
                    results={dataFiltered.length}
                    setPartyDetails={setPartyDetails}
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
                          <PaymentInOutTableRow
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
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRows}>
            Delete
          </Button>
        }
      />
      {/*<CustomPopover*/}
      {/*  open={partyPopover.open}*/}
      {/*  onClose={partyPopover.onClose}*/}
      {/*  arrow="right-top"*/}
      {/*  sx={{ width: 400 }}*/}
      {/*>*/}
      {/*  /!*<PartyNewEditForm onClose={partyPopover.onClose} />*!/*/}
      {/*</CustomPopover>*/}
    </>
  );
}

// ----------------------------------------------------------------------
function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, party, category, startDate, endDate } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis?.map((el) => el[0]);

  if (name && name?.trim()) {
    inputData = inputData.filter(
      (sch) =>
        sch?.party.name?.toLowerCase().includes(name?.toLowerCase()) ||
        sch?.receiptNo?.toLowerCase().includes(name?.toLowerCase())
    );
  }
  if (category) {
    inputData = inputData.filter((item) => item.status === category);
  }
  if (Object.keys(party).length) {
    console.log(party, '00000');
    inputData = inputData?.filter((item) => party._id === item.party._id);
  }
  if (!dateError && startDate && endDate) {
    inputData = inputData.filter((item) => isBetween(new Date(item.date), startDate, endDate));
  }
  return inputData;
}
