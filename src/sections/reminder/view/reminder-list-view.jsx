import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
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
import { fDate, isAfter, isBetween } from '../../../utils/format-time';
import { LoadingScreen } from '../../../components/loading-screen';
import { useGetLoanissue } from '../../../api/loanissue';
import { useGetReminder } from '../../../api/reminder';
import * as XLSX from 'xlsx';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '#', label: '#' },
  { id: 'loanNo', label: 'Loan no.' },
  { id: 'customerName', label: 'Customer name' },
  { id: 'otpNo.', label: 'OTP no.' },
  { id: 'loanAmount', label: 'Loan amt' },
  { id: 'days', label: 'Days' },
  { id: 'nextInterestPaydate', label: 'Next int. pay date' },
  { id: 'issueDate', label: 'Issue date' },
  { id: 'lastInterestDate', label: 'Last int. date' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  day: '',
  startDate: null,
  endDate: null,
  nextInstallmentDay: [],
  startDay: null,
  endDay: null,
};

// ----------------------------------------------------------------------

export default function ReminderListView() {
  const loanPayHistory = false;
  const Reminder = true;
  const { reminder, mutate } = useGetReminder();
  const { Loanissue, LoanissueLoading } = useGetLoanissue(loanPayHistory, Reminder);
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: Loanissue,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dateError = isAfter(filters.startDate, filters.endDate);
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
    setFilters({ ...defaultFilters, day: '' });
  }, []);

  const handleClick = useCallback(
    (id) => {
      router.push(paths.dashboard.reminder_details.list(id));
    },
    [router]
  );

  if (LoanissueLoading) {
    return <LoadingScreen />;
  }

  const exportToExcel = () => {
    const groupedData = dataFiltered.reduce((acc, loan) => {
      const customerId = loan?.customer?._id;
      if (!acc[customerId]) {
        acc[customerId] = {
          customer: loan?.customer,
          loans: [],
        };
      }
      acc[customerId].loans.push(loan);
      return acc;
    }, {});

    const exportData = Object.values(groupedData).flatMap((group, customerIndex) => {
      const { customer, loans } = group;

      return loans.flatMap((loan, loanIndex) => {
        const baseRow = {
          '#': loanIndex === 0 ? customerIndex + 1 : '',
          'Customer Name':
            loanIndex === 0
              ? `${customer?.firstName} ${customer?.middleName || ''} ${customer?.lastName}`
              : '',
          'Customer Contact': loanIndex === 0 ? customer?.contact || '' : '',
          'Loan No.': loan?.loanNo || '',
          'Loan Amount': loan?.loanAmount || '',
          'Next Interest Pay Date': fDate(loan?.nextInstallmentDate) || '',
          'Issue Date': fDate(loan?.issueDate) || '',
          'Last Interest Date': fDate(loan?.lastInstallmentDate) || '',
          'Next Recalling Date': '',
          Remark: '',
        };

        const relatedReminders = reminder.filter(
          (r) => r?.loan?.customer?._id === loan?.customer?._id && r?.loan?._id === loan?._id
        );

        const reminderRows = relatedReminders.map((reminderData, idx) => {
          if (idx === 0) {
            baseRow['Next Recalling Date'] = fDate(reminderData?.nextRecallingDate) || '';
            baseRow.Remark = reminderData?.remark || '';
            return null;
          }
          return {
            '#': '',
            'Customer Name': '',
            'Customer Contact': '',
            'Loan No.': '',
            'Loan Amount': '',
            'Next Interest Pay Date': '',
            'Issue Date': '',
            'Last Interest Date': '',
            'Next Recalling Date': fDate(reminderData?.nextRecallingDate) || '',
            Remark: reminderData?.remark || '',
          };
        });

        const filteredReminderRows = reminderRows.filter((row) => row !== null);
        return [baseRow, ...filteredReminderRows];
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reminders');
    XLSX.writeFile(workbook, 'Reminders.xlsx');
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Reminders"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Reminder', href: paths.dashboard.reminder.list },
            { name: 'List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          <ReminderTableToolbar
            filters={filters}
            onFilters={handleFilters}
            exportToExcel={exportToExcel}
          />
          {/*{canReset && (*/}
          {/*  <ReminderTableFiltersResult*/}
          {/*    filters={filters}*/}
          {/*    onFilters={handleFilters}*/}
          {/*    onResetFilters={handleResetFilters}*/}
          {/*    results={dataFiltered.length}*/}
          {/*    sx={{ p: 2.5, pt: 0 }}*/}
          {/*  />*/}
          {/*)}*/}
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
                  {(filters.startDate && filters.endDate) || filters.name || filters.endDay ? (
                    dataFiltered.length > 0 ? (
                      <>
                        {dataFiltered
                          .slice(
                            table.page * table.rowsPerPage,
                            table.page * table.rowsPerPage + table.rowsPerPage
                          )
                          .map((row, index) => (
                            <ReminderTableRow
                              index={index + 1}
                              key={row._id}
                              row={row}
                              handleClick={() => handleClick(row._id)}
                              mutate={mutate}
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
}

// ----------------------------------------------------------------------
function applyFilter({ inputData, comparator, filters, dateError }) {
  const { startDate, endDate, name, nextInstallmentDay, startDay, endDay } = filters;
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
        rem.customer.firstName.toLowerCase().includes(name.toLowerCase()) ||
        rem.customer.lastName.toLowerCase().includes(name.toLowerCase())
    );
  }
  if (nextInstallmentDay.length) {
    inputData = inputData.filter((rem) => nextInstallmentDay.includes(rem.nextInstallmentDate));
  }
  if (!dateError) {
    if (endDay) {
      inputData = inputData.filter((rem) => new Date(rem.nextInstallmentDate) <= new Date(endDay));
    }
  }
  if (!dateError && startDate && endDate) {
    inputData = inputData.filter((order) =>
      isBetween(new Date(order.nextInstallmentDate), startDate, endDate)
    );
  }
  return inputData;
}
