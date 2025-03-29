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
import axios from 'axios';
import { useAuthContext } from '../../../auth/hooks';
import { useGetLoanissue } from '../../../api/loanissue';
import { LoadingScreen } from '../../../components/loading-screen';
import { fDate, isBetween } from '../../../utils/format-time';
import { useGetConfigs } from '../../../api/config';
import AllBranchLoanSummaryTableRow from '../all-branch-loan/all-branch-loan-summary-table-row';
import AllBranchLoanSummaryTableToolbar from '../all-branch-loan/all-branch-loan-summary-table-toolbar';
import AllBranchLoanSummaryTableFiltersResult from '../all-branch-loan/all-branch-loan-summary-table-filters-result';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Label from '../../../components/label';
import { useGetAllLoanSummary } from '../../../api/all-branch-loan-summary';
import { useGetOtherLoanReports } from '../../../api/all-branch-other-loan-report.js';
import AllBranchOtherLoanSummaryTableToolbar from '../all-branch-other-loan/all-branch-other-loan-summary-table-toolbar.jsx';
import AllBranchOtherLoanSummaryTableFiltersResult from '../all-branch-other-loan/all-branch-other-loan-summary-table-filters-result.jsx';
import AllBranchOtherLoanSummaryTableRow from '../all-branch-other-loan/all-branch-other-loan-summary-table-row.jsx';
import OtherLonaInterestTableToolbar from '../other-loan-interest-reports/other-lona-interest-table-toolbar.jsx';
import OtherLonaInterestTableFiltersResult from '../other-loan-interest-reports/other-lona-interest-table-filters-result.jsx';
import OtherLonaInterestTableRow from '../other-loan-interest-reports/other-lona-interest-table-row.jsx';
import TotalAllInOutLoanReportsTableToolbar from '../total-all-in-out-loan-reports/total-all-in-out-loan-reports-table-toolbar.jsx';
import TotalAllInOutLoanReportsTableFiltersResult from '../total-all-in-out-loan-reports/total-all-in-out-loan-reports-table-filters-result.jsx';
import TotalAllInOutLoanReportsTableRow from '../total-all-in-out-loan-reports/total-all-in-out-loan-reports-table-row.jsx';
import { useGetTotalAllInoutLoanReports } from '../../../api/total-all-in-out-loan-reports.js';
import { TableCell, TableRow } from '@mui/material';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'index', label: '#', width: 40 },
  { id: `loan.LoanNo`, label: 'Loan no.', width: 90 },
  { id: 'issueDate', label: 'Issue date', width: 80 },
  { id: 'firstName', label: 'Customer name', width: 130 },
  { id: 'amount', label: 'total loan amt', width: 90 },
  { id: 'partLoanamt', label: 'part loan amt', width: 90 },
  { id: 'interestLoanAmount', label: 'Int. loan amt', width: 90 },
  { id: 'toralwt', label: 'Total wt', width: 70 },
  { id: 'netwt', label: 'net wt', width: 70 },
  { id: 'intrate', label: 'Int. rate', width: 70 },
  { id: 'totalInterestAmount', label: 'Total int.amt', width: 90 },
  { id: 'otherNumber', label: 'Other no', width: 80 },
  { id: 'date', label: 'Date', width: 80 },
  { id: 'otherName', label: 'Other name', width: 100 },
  { id: 'otherloanamt', label: 'Other Loan amt', width: 90 },
  { id: 'grossWt', label: 'Gross wt', width: 70 },
  { id: 'netWt', label: 'Net wt', width: 70 },
  { id: 'otherint', label: 'Other int(%)', width: 80 },
  { id: 'otherintamt', label: 'Other int amt', width: 90 },
  { id: 'diffloanamt', label: 'Diff loan amt', width: 90 },
  { id: 'diffintamt', label: 'Diff int amt', width: 90 },
  { id: 'status', label: 'Status', width: 80 },
];
const STATUS_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Issued', label: 'Issued' },
  { value: 'Regular', label: 'Regular' },
  {
    value: 'Overdue',
    label: 'Overdue',
  },
  {
    value: 'Closed',
    label: 'Closed',
  },
];
const defaultFilters = {
  username: '',
  status: 'All',
  startDate: null,
  endDate: null,
  branch: '',
  issuedBy: '',
};

// ----------------------------------------------------------------------

export default function OtherLonaInterestListView() {
  const [options, setOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { totalAllInoutLoanReports, totalAllInoutLoanReportsLoading } =
    useGetTotalAllInoutLoanReports();
  const table = useTable();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [tableData, setTableData] = useState(totalAllInoutLoanReports);
  const [filters, setFilters] = useState(defaultFilters);

  // const loanAmount = totalAllInoutLoanReports.reduce(
  //   (prev, next) => prev + (Number(next?.loan.loanAmount) || 0),
  //   0
  // );
  // const amount = totalAllInoutLoanReports.reduce(
  //   (prev, next) => prev + (Number(next?.amount) || 0),
  //   0
  // );

  const data = Object.values(totalAllInoutLoanReports);

  // const loanAmount = totalAllInoutLoanReports.reduce(
  //   (prev, next) => prev + (Number(next?.loan.loanAmount) || 0),
  //   0
  // );
  const amount = totalAllInoutLoanReports.reduce(
    (prev, next) => prev + (Number(next?.amount) || 0),
    0
  );

  // const intLoanAmount = totalAllInoutLoanReports.reduce(
  //   (prev, next) => prev + (Number(next?.loan.interestLoanAmount) || 0),
  //   0
  // );
  // const totalWt = totalAllInoutLoanReports?.reduce((prev, next) => {
  //   const propertyTotal =
  //     next?.loan?.propertyDetails?.reduce(
  //       (sum, item) => sum + (Number(item?.totalWeight) || 0),
  //       0
  //     ) || 0;

  //   return prev + propertyTotal;
  // }, 0);
  // const grossWt = totalAllInoutLoanReports?.reduce((prev, next) => {
  //   const propertyTotal =
  //     next?.loan?.propertyDetails?.reduce(
  //       (sum, item) => sum + (Number(item?.grossWeight) || 0),
  //       0
  //     ) || 0;

  //   return prev + propertyTotal;
  // }, 0);

  // const netWt = totalAllInoutLoanReports?.loan?.propertyDetails.reduce(
  //   (prev, next) => prev + (Number(next?.netWeight) || 0),
  //   0
  // );
  // const int = totalAllInoutLoanReports.reduce(
  //   (prev, next) => prev + (Number(next?.loan.scheme.interestRate) || 0),
  //   0
  // );
  // const totalInterestAmount = totalAllInoutLoanReports.reduce(
  //   (prev, next) => prev + (Number(next?.totalInterestAmount) || 0),
  //   0
  // );
  // const amt = totalAllInoutLoanReports.reduce(
  //   (prev, next) => prev + (Number(next?.amount) || 0),
  //   0
  // );
  // const otherGrossWT = totalAllInoutLoanReports.reduce(
  //   (prev, next) => prev + (Number(next?.grossWt) || 0),
  //   0
  // );
  // const otherNetWT = totalAllInoutLoanReports.reduce(
  //   (prev, next) => prev + (Number(next?.netWt) || 0),
  //   0
  // );
  // const otherInt = totalAllInoutLoanReports.reduce(
  //   (prev, next) => prev + (Number(next?.percentage) || 0),
  //   0
  // );
  // const intAmt = totalAllInoutLoanReports.reduce(
  //   (prev, next) => prev + (Number(next?.percentage) || 0),
  //   0
  // );
  // const totalOtherInterestAmount = totalAllInoutLoanReports.reduce(
  //   (prev, next) => prev + (Number(next?.totalOtherInterestAmount) || 0),
  //   0
  // );

  // useEffect(() => {
  //   fetchStates();
  // }, [totalAllInoutLoanReports]);

  const dataFiltered = applyFilter({
    inputData: totalAllInoutLoanReports,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  // Convert grouped data to array for pagination
  const flattenedData = Object.values(dataFiltered).flat();
  const dataInPage = flattenedData.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!flattenedData.length && canReset) || !flattenedData.length;

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
      const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/${user?.company}/loans`, {
        data: { ids: id },
      });
      enqueueSnackbar(res.data.message);
      confirm.onFalse();
      mutate();
    } catch (err) {
      enqueueSnackbar('Failed to delete Employee');
    }
  };
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );
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
    const deleteRows = totalAllInoutLoanReports.filter((row) => table.selected.includes(row._id));
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
      router.push(paths.dashboard.loanissue.edit(id));
    },
    [router]
  );

  const handleClick = useCallback(
    (id) => {
      router.push(paths.dashboard.disburse.new(id));
    },
    [router]
  );

  // const loans = Loanissue.map((item) => ({
  //   'Loan No': item.loanNo,
  //   'Customer Name': `${item.customer.firstName} ${item.customer.middleName} ${item.customer.lastName}`,
  //   'Contact': item.customer.contact,
  //   'OTP Contact': item.customer.otpContact,
  //   Email: item.customer.email,
  //   'Permanent address': `${item.customer.permanentAddress.street} ${item.customer.permanentAddress.landmark} ${item.customer.permanentAddress.city} , ${item.customer.permanentAddress.state} ${item.customer.permanentAddress.country} ${item.customer.permanentAddress.zipcode}`,
  //   'Issue date': item.issueDate,
  //   'Scheme': item.scheme.name,
  //   'Rate per gram': item.scheme.ratePerGram,
  //   'Interest rate': item.scheme.interestRate,
  //   valuation: item.scheme.valuation,
  //   'Interest period': item.scheme.interestPeriod,
  //   'Renewal time': item.scheme.renewalTime,
  //   'min loan time': item.scheme.minLoanTime,
  //   'Loan amount': item.loanAmount,
  //   'Next nextInstallment date': fDate(item.nextInstallmentDate),
  //   'Payment mode': item.paymentMode,
  //   'Paying cashAmount': item.payingCashAmount,
  //   'Pending cashAmount': item.pendingCashAmount,
  //   'Paying bankAmount': item.payingBankAmount,nasm
  //   'Pending bankAmount': item.pendingBankAmount,
  // }));

  if (totalAllInoutLoanReportsLoading) {
    return <LoadingScreen />;
  }
  //
  // function fetchStates() {
  //   dataFiltered?.map((data) => {
  //     setOptions((item) => {
  //       if (!item.find((option) => option.value === data.issuedBy._id)) {
  //         return [
  //           ...item,
  //           {
  //             name: `${data.issuedBy.firstName} ${data.issuedBy.middleName} ${data.issuedBy.lastName}`,
  //             value: data.issuedBy._id,
  //           },
  //         ];
  //       } else {
  //         return item;
  //       }
  //     });
  //   });
  // }
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Total All In Out Loan Reports"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Reports', href: paths.dashboard.reports.root },
            {
              name: 'Total All In Out Loan Reports',
              href: paths.dashboard.reports['total-all-in-out-loan-reports'],
            },
            { name: ' List' },
          ]}
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
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <>
                    <Label
                      style={{ margin: '5px' }}
                      variant={
                        ((tab.value === 'All' || tab.value == filters.status) && 'filled') || 'soft'
                      }
                      color={
                        (tab.value === 'Regular' && 'success') ||
                        (tab.value === 'Overdue' && 'error') ||
                        (tab.value === 'Closed' && 'warning') ||
                        (tab.value === 'Issued' && 'secondary') ||
                        'default'
                      }
                    >
                      {['Issued', 'Regular', 'Overdue', 'Closed'].includes(tab.value)
                        ? totalAllInoutLoanReports
                            .flat()
                            .filter((item) => item.status === tab.value).length
                        : totalAllInoutLoanReports.flat().length}
                    </Label>
                  </>
                }
              />
            ))}
          </Tabs>

          <TotalAllInOutLoanReportsTableToolbar
            filters={filters}
            onFilters={handleFilters}
            dataFilter={dataFiltered}
            configs={configs}
            options={options}
          />

          {canReset && (
            <TotalAllInOutLoanReportsTableFiltersResult
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
              '& .MuiTableCell-root': {
                borderRight: '1px solid rgba(224, 224, 224, 1)',
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                padding: '4px 6px',
                fontSize: '11px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '150px',
              },
              '& .MuiTableRow-root': {
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              },
              '& .MuiTable-root': {
                borderCollapse: 'separate',
                borderSpacing: 0,
                border: '1px solid rgba(224, 224, 224, 1)',
              },
              '& .MuiTableHead-root .MuiTableCell-root': {
                backgroundColor: '#F4F6F8',
                fontWeight: 600,
                color: '#637381',
                padding: '6px 4px',
              },
            }}
          >
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={flattenedData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  flattenedData.map((row) => row._id)
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

            <Table stickyHeader size="small">
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={flattenedData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1000,
                  '& .MuiTableCell-root': {
                    fontWeight: 600,
                    color: '#637381',
                    backgroundColor: '#2f3944',
                    padding: '6px 4px',
                    fontSize: '11px',
                  },
                }}
              />

              <TableBody>
                {Object.entries(dataFiltered).map(([loanId, otherLoans], loanIndex) => {
                  const firstRow = otherLoans[0];
                  const rowSpan = otherLoans.length;

                  return otherLoans.map((row, index) => (
                    <TableRow
                      key={row._id}
                      hover
                      sx={{
                        '&:last-child td': {
                          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                        },
                      }}
                    >
                      {/* Show these cells only for the first row of each loan group */}
                      {index === 0 && (
                        <>
                          <TableCell
                            sx={{
                              fontSize: '11px',
                              padding: '4px 6px',
                              textAlign: 'center',
                              backgroundColor: index === 0 ? 'rgba(244, 246, 248, 0.5)' : 'inherit',
                              width: TABLE_HEAD[0].width,
                            }}
                            rowSpan={rowSpan}
                          >
                            {loanIndex + 1}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: '11px',
                              padding: '4px 6px',
                              backgroundColor: index === 0 ? 'rgba(244, 246, 248, 0.5)' : 'inherit',
                              width: TABLE_HEAD[1].width,
                            }}
                            rowSpan={rowSpan}
                          >
                            {row.loan.loanNo}
                          </TableCell>

                          <TableCell
                            sx={{
                              fontSize: '11px',
                              padding: '4px 6px',
                              textAlign: 'center',
                              backgroundColor: index === 0 ? 'rgba(244, 246, 248, 0.5)' : 'inherit',
                              width: TABLE_HEAD[2].width,
                            }}
                            rowSpan={rowSpan}
                          >
                            {fDate(row.loan.issueDate)}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: '11px',
                              padding: '4px 6px',
                              backgroundColor: index === 0 ? 'rgba(244, 246, 248, 0.5)' : 'inherit',
                              width: TABLE_HEAD[3].width,
                            }}
                            rowSpan={rowSpan}
                          >
                            {`${row.loan.customer.firstName || ''} ${row.loan.customer.middleName || ''} ${row.loan.customer.lastName || ''}`}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: '11px',
                              padding: '4px 6px',
                              backgroundColor: index === 0 ? 'rgba(244, 246, 248, 0.5)' : 'inherit',
                              width: TABLE_HEAD[4].width,
                            }}
                            rowSpan={rowSpan}
                          >
                            {row.loan.loanAmount}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: '11px',
                              padding: '4px 6px',
                              backgroundColor: index === 0 ? 'rgba(244, 246, 248, 0.5)' : 'inherit',
                              width: TABLE_HEAD[5].width,
                            }}
                            rowSpan={rowSpan}
                          >
                            {parseFloat(
                              (row.loan.loanAmount - row.loan.interestLoanAmount).toFixed(2)
                            ) || 0}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: '11px',
                              padding: '4px 6px',
                              backgroundColor: index === 0 ? 'rgba(244, 246, 248, 0.5)' : 'inherit',
                              width: TABLE_HEAD[6].width,
                            }}
                            rowSpan={rowSpan}
                          >
                            {row.loan.interestLoanAmount}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: '11px',
                              padding: '4px 6px',
                              backgroundColor: index === 0 ? 'rgba(244, 246, 248, 0.5)' : 'inherit',
                              width: TABLE_HEAD[7].width,
                            }}
                            rowSpan={rowSpan}
                          >
                            {row.loan.propertyDetails
                              .reduce((prev, next) => prev + (Number(next?.totalWeight) || 0), 0)
                              .toFixed(2)}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: '11px',
                              padding: '4px 6px',
                              backgroundColor: index === 0 ? 'rgba(244, 246, 248, 0.5)' : 'inherit',
                              width: TABLE_HEAD[8].width,
                            }}
                            rowSpan={rowSpan}
                          >
                            {row.loan.propertyDetails
                              .reduce((prev, next) => prev + (Number(next?.netWeight) || 0), 0)
                              .toFixed(2)}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: '11px',
                              padding: '4px 6px',
                              backgroundColor: index === 0 ? 'rgba(244, 246, 248, 0.5)' : 'inherit',
                              width: TABLE_HEAD[9].width,
                            }}
                            rowSpan={rowSpan}
                          >
                            {row.loan.scheme.interestRate}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: '11px',
                              padding: '4px 6px',
                              backgroundColor: index === 0 ? 'rgba(244, 246, 248, 0.5)' : 'inherit',
                              width: TABLE_HEAD[10].width,
                            }}
                            rowSpan={rowSpan}
                          >
                            {(row.totalInterestAmount || 0).toFixed(2)}
                          </TableCell>
                        </>
                      )}
                      {/* Other Number cell */}
                      <TableCell
                        align="left"
                        sx={{
                          fontSize: '11px',
                          padding: '4px 6px',
                          width: TABLE_HEAD[11].width,
                        }}
                      >
                        {row.otherNumber}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: '11px',
                          padding: '4px 6px',
                          width: TABLE_HEAD[12].width,
                        }}
                      >
                        {fDate(row.date)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: '11px',
                          padding: '4px 6px',
                          width: TABLE_HEAD[13].width,
                        }}
                      >
                        {row.otherName}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: '11px',
                          padding: '4px 6px',
                          width: TABLE_HEAD[14].width,
                        }}
                      >
                        {row.amount}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: '11px',
                          padding: '4px 6px',
                          width: TABLE_HEAD[15].width,
                        }}
                      >
                        {row.grossWt}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: '11px',
                          padding: '4px 6px',
                          width: TABLE_HEAD[16].width,
                        }}
                      >
                        {row.netWt}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: '11px',
                          padding: '4px 6px',
                          width: TABLE_HEAD[17].width,
                        }}
                      >
                        {row.percentage}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: '11px',
                          padding: '4px 6px',
                          width: TABLE_HEAD[18].width,
                        }}
                      >
                        {row.totalOtherInterestAmount.toFixed(2)}
                      </TableCell>
                      {index === 0 && (
                        <>
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: '11px',
                              padding: '4px 6px',
                              width: TABLE_HEAD[19].width,
                            }}
                            rowSpan={rowSpan}
                          >
                            {(() => {
                              const totalOtherAmount = otherLoans.reduce(
                                (sum, loan) => sum + Number(loan.amount || 0),
                                0
                              );
                              const diffAmount = row.loan.loanAmount - totalOtherAmount;
                              return diffAmount.toFixed(2);
                            })()}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: '11px',
                              padding: '4px 6px',
                              width: TABLE_HEAD[20].width,
                            }}
                            rowSpan={rowSpan}
                          >
                            {(() => {
                              const totalOtherInterest = otherLoans.reduce(
                                (sum, loan) => sum + Number(loan.totalOtherInterestAmount || 0),
                                0
                              );
                              const diffInterest = row.totalInterestAmount - totalOtherInterest;
                              return diffInterest.toFixed(2);
                            })()}
                          </TableCell>
                        </>
                      )}
                      <TableCell
                        sx={{
                          fontSize: '11px',
                          padding: '4px 6px',
                          textAlign: 'center',
                          width: TABLE_HEAD[21].width,
                        }}
                      >
                        <Label
                          variant="soft"
                          color={
                            (row.status === 'Disbursed' && 'info') ||
                            (row.status === 'Issued' && 'secondary') ||
                            (row.status === 'Closed' && 'warning') ||
                            (row.status === 'Overdue' && 'error') ||
                            (row.status === 'Regular' && 'success') ||
                            'default'
                          }
                        >
                          {row.status}
                        </Label>
                      </TableCell>
                    </TableRow>
                  ));
                })}
                <TableNoData notFound={notFound} />
                <TableRow
                  sx={{
                    backgroundColor: '#F4F6F8',
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 1,
                    boxShadow: '0px 2px 2px rgba(0,0,0,0.1)',
                    '& .MuiTableCell-root': {
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#637381',
                      py: 1,
                      px: 1,
                    },
                  }}
                >
                  <TableCell>TOTAL</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    {Object.values(dataFiltered)
                      .reduce((sum, otherLoans) => {
                        const uniqueLoans = new Set(); // Track unique loan numbers
                        return (
                          sum +
                          otherLoans.reduce((loanSum, item) => {
                            const loanAmount = Number(item.loan.loanAmount) || 0;

                            // Add loanAmount only if the loanNo is not already counted
                            if (!uniqueLoans.has(item.loan.loanNo)) {
                              uniqueLoans.add(item.loan.loanNo);
                              return loanSum + loanAmount;
                            }
                            return loanSum;
                          }, 0)
                        );
                      }, 0)
                      .toFixed(0)}
                  </TableCell>
                  <TableCell>
                    {Object.values(dataFiltered)
                      .reduce((sum, otherLoans) => {
                        const uniqueLoans = new Set(); // Track unique loan numbers
                        return (
                          sum +
                          otherLoans.reduce((loanSum, item) => {
                            const loanNo = item.loan.loanNo;
                            const loanAmount = Number(item.loan.loanAmount) || 0;
                            const interestLoanAmount = Number(item.loan.interestLoanAmount) || 0;

                            // Add loanAmount - interestLoanAmount only if loanNo is not already counted
                            if (!uniqueLoans.has(loanNo)) {
                              uniqueLoans.add(loanNo);
                              return loanSum + (loanAmount - interestLoanAmount);
                            }
                            return loanSum;
                          }, 0)
                        );
                      }, 0)
                      .toFixed(0)}
                  </TableCell>
                  <TableCell>
                    {Object.values(dataFiltered)
                      .reduce((sum, otherLoans) => {
                        const uniqueLoans = new Set(); // Track unique loan numbers
                        return (
                          sum +
                          otherLoans.reduce((loanSum, item) => {
                            const loanNo = item.loan.loanNo;
                            const interestLoanAmount = Number(item.loan.interestLoanAmount) || 0;

                            // Add interestLoanAmount only if loanNo is not already counted
                            if (!uniqueLoans.has(loanNo)) {
                              uniqueLoans.add(loanNo);
                              return loanSum + interestLoanAmount;
                            }
                            return loanSum;
                          }, 0)
                        );
                      }, 0)
                      .toFixed(0)}
                  </TableCell>
                  <TableCell>
                    {Object.values(dataFiltered)
                      .reduce((sum, otherLoans) => {
                        const uniqueLoans = new Set(); // Track unique loan numbers
                        return (
                          sum +
                          otherLoans.reduce((loanSum, item) => {
                            if (!uniqueLoans.has(item.loan.loanNo)) {
                              uniqueLoans.add(item.loan.loanNo);

                              const propertyTotal =
                                item.loan.propertyDetails?.reduce(
                                  (sum, detail) => sum + (Number(detail.totalWeight) || 0),
                                  0
                                ) || 0;

                              return loanSum + propertyTotal;
                            }
                            return loanSum;
                          }, 0)
                        );
                      }, 0)
                      .toFixed(0)}
                  </TableCell>
                  <TableCell>
                    {Object.values(dataFiltered)
                      .reduce((sum, otherLoans) => {
                        const uniqueLoans = new Set(); // Track unique loan numbers
                        return (
                          sum +
                          otherLoans.reduce((loanSum, item) => {
                            if (!uniqueLoans.has(item.loan.loanNo)) {
                              uniqueLoans.add(item.loan.loanNo);

                              const propertyTotal =
                                item.loan.propertyDetails?.reduce(
                                  (sum, detail) => sum + (Number(detail.grossWeight) || 0),
                                  0
                                ) || 0;

                              return loanSum + propertyTotal;
                            }
                            return loanSum;
                          }, 0)
                        );
                      }, 0)
                      .toFixed(0)}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const uniqueLoans = new Set();
                      let totalInterestRate = 0;
                      let uniqueLoanCount = 0;

                      Object.values(dataFiltered).forEach((otherLoans) => {
                        otherLoans.forEach((item) => {
                          const loanNo = item.loan.loanNo;
                          const interestRate = Number(item.loan.scheme.interestRate) || 0;

                          // Count only unique loans
                          if (!uniqueLoans.has(loanNo)) {
                            uniqueLoans.add(loanNo);
                            totalInterestRate += interestRate;
                            uniqueLoanCount++;
                          }
                        });
                      });

                      return (
                        uniqueLoanCount > 0 ? totalInterestRate / uniqueLoanCount : 0
                      ).toFixed(2);
                    })()}
                  </TableCell>
                  <TableCell>
                    {Object.values(dataFiltered)
                      .reduce((sum, otherLoans) => {
                        const uniqueLoans = new Set(); // Track unique loan numbers
                        return (
                          sum +
                          otherLoans.reduce((loanSum, item) => {
                            const loanNo = item.loan.loanNo;
                            const totalInterestAmount = Number(item.totalInterestAmount) || 0;

                            // Add totalInterestAmount only if loanNo is not already counted
                            if (!uniqueLoans.has(loanNo)) {
                              uniqueLoans.add(loanNo);
                              return loanSum + totalInterestAmount;
                            }
                            return loanSum;
                          }, 0)
                        );
                      }, 0)
                      .toFixed(0)}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    {Object.values(dataFiltered)
                      .reduce(
                        (sum, otherLoans) =>
                          sum +
                          otherLoans.reduce(
                            (loanSum, item) => loanSum + (Number(item.amount) || 0),
                            0
                          ),
                        0
                      )
                      .toFixed(0)}
                  </TableCell>
                  <TableCell>
                    {Object.values(dataFiltered)
                      .reduce(
                        (sum, otherLoans) =>
                          sum +
                          otherLoans.reduce(
                            (loanSum, item) => loanSum + (Number(item.grossWt) || 0),
                            0
                          ),
                        0
                      )
                      .toFixed(0)}
                  </TableCell>
                  <TableCell>
                    {Object.values(dataFiltered)
                      .reduce(
                        (sum, otherLoans) =>
                          sum +
                          otherLoans.reduce(
                            (loanSum, item) => loanSum + (Number(item.netWt) || 0),
                            0
                          ),
                        0
                      )
                      .toFixed(0)}
                  </TableCell>
                  <TableCell>
                    {(
                      Object.values(dataFiltered).reduce(
                        (sum, otherLoans) =>
                          sum +
                          otherLoans.reduce(
                            (loanSum, item) => loanSum + (Number(item.percentage) || 0),
                            0
                          ),
                        0
                      ) /
                      Object.values(dataFiltered).reduce(
                        (sum, otherLoans) => sum + otherLoans.length,
                        0
                      )
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {Object.values(dataFiltered)
                      .reduce(
                        (sum, otherLoans) =>
                          sum +
                          otherLoans.reduce(
                            (loanSum, item) =>
                              loanSum + (Number(item.totalOtherInterestAmount) || 0),
                            0
                          ),
                        0
                      )
                      .toFixed(0)}
                  </TableCell>
                  <TableCell>
                    {Object.values(dataFiltered)
                      .reduce((sum, otherLoans) => {
                        const uniqueLoans = new Set(); // Track unique loan amounts
                        return (
                          sum +
                          otherLoans.reduce((loanSum, item) => {
                            const loanAmount = Number(item.loan.loanAmount);
                            const amount = Number(item.amount) || 0;

                            // Add loanAmount only if it's not already counted
                            if (!uniqueLoans.has(item.loan.loanNo)) {
                              uniqueLoans.add(item.loan.loanNo);
                              return loanSum + (loanAmount - amount);
                            }
                            return loanSum - amount;
                          }, 0)
                        );
                      }, 0)
                      .toFixed(0)}
                  </TableCell>
                  <TableCell>
                    {Object.values(dataFiltered)
                      .reduce((sum, otherLoans) => {
                        const uniqueLoans = new Set(); // Track unique loans
                        return (
                          sum +
                          otherLoans.reduce((loanSum, item) => {
                            const totalInterestAmount = Number(item.totalInterestAmount);
                            const totalOtherInterestAmount =
                              Number(item.totalOtherInterestAmount) || 0;

                            // Add totalInterestAmount only if it's not already counted
                            if (!uniqueLoans.has(item.loan.loanNo)) {
                              uniqueLoans.add(item.loan.loanNo);
                              return loanSum + (totalInterestAmount - totalOtherInterestAmount);
                            }
                            return loanSum - totalOtherInterestAmount;
                          }, 0)
                        );
                      }, 0)
                      .toFixed(0)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, flattenedData.length)}
                />
              </TableBody>
            </Table>
          </TableContainer>

          <TablePaginationCustom
            count={flattenedData.length}
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
function applyFilter({ inputData, comparator, filters, dateError }) {
  const { username, status, startDate, endDate, branch, issuedBy } = filters;

  // Convert inputData to array if it's an object
  const dataArray = Array.isArray(inputData) ? inputData : Object.values(inputData);

  // Flatten the data structure to get all other loan entries
  const flattenedData = dataArray.flatMap((loanGroup) =>
    Array.isArray(loanGroup) ? loanGroup : [loanGroup]
  );

  const stabilizedThis = flattenedData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  let filteredData = stabilizedThis.map((el) => el[0]);

  if (username && username.trim()) {
    filteredData = filteredData.filter(
      (item) =>
        (
          item.loan.customer.firstName +
          ' ' +
          item.loan.customer.middleName +
          ' ' +
          item.loan.customer.lastName
        )
          .toLowerCase()
          .includes(username.toLowerCase()) ||
        item.loan.customer.firstName.toLowerCase().includes(username.toLowerCase()) ||
        item.loan.customer.lastName.toLowerCase().includes(username.toLowerCase()) ||
        item.loan.loanNo.toLowerCase().includes(username.toLowerCase()) ||
        item.loan.customer.contact.toLowerCase().includes(username.toLowerCase())
    );
  }

  if (status && status !== 'All') {
    filteredData = filteredData.filter((item) => item.status === status);
  }

  if (branch) {
    filteredData = filteredData.filter((loan) => loan.loan.customer.branch._id === branch._id);
  }

  if (!dateError && startDate && endDate) {
    filteredData = filteredData.filter((item) =>
      isBetween(new Date(item.loan.issueDate), startDate, endDate)
    );
  }

  // Group the filtered data by loan ID
  const groupedData = filteredData.reduce((acc, item) => {
    const loanId = item.loan._id;
    if (!acc[loanId]) {
      acc[loanId] = [];
    }
    acc[loanId].push(item);
    return acc;
  }, {});

  return groupedData;
}
