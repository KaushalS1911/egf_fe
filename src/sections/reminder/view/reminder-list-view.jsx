import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';

import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';


import ReminderTableToolbar from '../reminder-table-toolbar';
import ReminderTableFiltersResult from '../reminder-table-filters-result';
import ReminderTableRow from '../reminder-table-row';
import { isAfter, isBetween } from '../../../utils/format-time';
import { LoadingScreen } from '../../../components/loading-screen';
import { useGetLoanissue } from '../../../api/loanissue';

// ----------------------------------------------------------------------



const TABLE_HEAD = [
  { id: '#', label: '#' },
  { id: 'loanNo', label: 'Loan No.' },
  { id: 'customerName', label: 'Customer Name' },
  { id: 'otpNo.', label: 'OTP No.' },
  { id: 'loanAmount', label: 'Loan Amount', },
  { id: 'days', label: 'Days' },
  { id: 'nextInterestPaydate', label: 'Next Interest Pay date'},
  { id: 'issueDate', label: 'Issue Date' },
  { id: 'lastInterestDate', label: 'Last Interest date' },
  { id: ''},
];


const defaultFilters = {
  name: '',
  startDate: null,
  endDate: null,
}

// ----------------------------------------------------------------------

export default function ReminderListView() {
  const loanPayHistory = false;
  const reminder = true;

  const {Loanissue,LoanissueLoading} = useGetLoanissue(loanPayHistory,reminder)

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();


  const [filters, setFilters] = useState(defaultFilters);


  const dataFiltered = applyFilter({
    inputData: Loanissue,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });
  const dateError = isAfter(filters.startDate, filters.endDate);
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

  const handleClick = useCallback(
    (id) => {
      router.push(paths.dashboard.reminder_details.list(id));
    },
    [router],
  );
  if(LoanissueLoading){
    return (
      <LoadingScreen/>
    )
  }
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Reminders'
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Reminder', href: paths.dashboard.reminder.list},
            { name: 'List' },
          ]}

          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          <ReminderTableToolbar
            filters={filters} onFilters={handleFilters}
          />
         {canReset && (
            <ReminderTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
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
                  {(filters.startDate && filters.endDate || filters.name) ? (
                    dataFiltered.length > 0 ? (
                      <>
                        {dataFiltered
                          .slice(
                            table.page * table.rowsPerPage,
                            table.page * table.rowsPerPage + table.rowsPerPage,
                          )
                          .map((row,index) => (
                            <ReminderTableRow
                              index={index + 1}
                              key={row._id}
                              row={row}
                              handleClick={() => handleClick(row._id)}
                            />
                          ))}
                        <TableEmptyRows
                          height={denseHeight}
                          emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                        />
                      </>
                    ) : (
                      <TableNoData notFound={notFound} />
                    )
                  ) : (
                    <TableNoData notFound={true} />
                  )}

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
    </>
  );
};

// ----------------------------------------------------------------------
function applyFilter({ inputData, comparator, filters ,dateError}) {
  const { startDate, endDate,name} = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  if (name && name.trim()) {
    inputData = inputData.filter(
      (rem) =>
        rem.customer.firstName.toLowerCase().includes(name.toLowerCase()),
    );
  }
    if (!dateError && startDate && endDate) {
      inputData = inputData.filter((order) =>
        isBetween(new Date(order.nextInstallmentDate), startDate, endDate),
      );
  }
  return inputData;
}
