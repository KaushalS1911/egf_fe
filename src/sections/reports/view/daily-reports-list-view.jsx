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
import NewGoldLoanTableRow from '../daily-reports/new-gold-loan-table-row';
import NewGoldLonListView from '../daily-reports/daily-reports-list-view/new-gold-lon-list-view';
import GoldLoanInterestListView from '../daily-reports/daily-reports-list-view/gold-loan-interest-list-view';
import { Box } from '@mui/system';
import GoldLoanPartPaymentListView from '../daily-reports/daily-reports-list-view/gold-loan-part-payment-list-view';
import GoldLoanUchakPaymentTableRow from '../daily-reports/gold-loan-uchak-payment-table-row';
import GoldLoanUchakPartListView from '../daily-reports/daily-reports-list-view/gold-loan-uchak-part-list-view';
import { useGetAllInterest } from '../../../api/interest-pay';
import DailyReportsTableToolbarTableToolbar from '../daily-reports/daily-reports-table-toolbar-table-toolbar';
import { useGetDailyReport } from '../../../api/daily-report';

// ----------------------------------------------------------------------


const STATUS_OPTIONS = [{ value: 'All', label: 'All' }, {
  value: 'Issued',
  label: 'Issued',
}, { value: 'Disbursed', label: 'Disbursed' }];
const defaultFilters = {
  username: '',
  status: 'All',
  startDate: new Date(),
  endDate: null,
  branch: '',

};

// ----------------------------------------------------------------------

export default function DailyReportsListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [filters, setFilters] = useState(defaultFilters);
  const params = new URLSearchParams();
  if(filters.branch._id) params.append('branch',filters.branch._id)
  if(filters.startDate) params.append('date',filters.startDate.toLocaleDateString())
  // if(filters.username) params.append('username',filters.username)
  const date = (filters.startDate).toLocaleDateString();
  const{report,reportLoading} = useGetDailyReport(params)
  const [tableData, setTableData] = useState(report);

  const dataFiltered = applyFilter({
    inputData: report ,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  // const dataInPage = dataFiltered.slice(
  //   table.page * table.rowsPerPage,
  //   table.page * table.rowsPerPage + table.rowsPerPage,
  // );

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
    [table],
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
  //   'Paying bankAmount': item.payingBankAmount,
  //   'Pending bankAmount': item.pendingBankAmount,
  // }));

  if (reportLoading) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Daily Reports'
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Reports', href: paths.dashboard.reports.root },
            { name: 'Daily Reports', href: paths.dashboard.reports.root },
            { name: ' List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card sx={{ pb: 3 }}>
          <DailyReportsTableToolbarTableToolbar filters={filters} onFilters={handleFilters}  dataFilter={dataFiltered} configs={configs}/>
          <Box>
             <NewGoldLonListView LoanIssue={dataFiltered?.loans} />
          </Box>
          <Box mt={2}>
            <GoldLoanInterestListView  interestDetail={report?.interestDetail}/>
          </Box>
          <Box mt={2}>
            <GoldLoanPartPaymentListView partPayment={report.partReleaseDetail} />
          </Box> <Box mt={2}>
          <GoldLoanUchakPartListView uchakPayment={report.uchakInterestDetail}/>
        </Box>
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
}

// ----------------------------------------------------------------------
function applyFilter({ inputData, comparator, filters, dateError }) {
  const { username, status, startDate, endDate, branch } = filters;

  // const stabilizedThis = inputData.map((el, index) => [el, index]);
  // stabilizedThis.sort((a, b) => {
  //   const order = comparator(a[0], b[0]);
  //   if (order !== 0) return order;
  //   return a[1] - b[1];
  // });
  // inputData = stabilizedThis.map((el) => el[0]);
  // if (username && username.trim()) {
  //   inputData = inputData.filter(
  //     (item) =>
  //       item.customer.firstName.toLowerCase().includes(username.toLowerCase()) ||
  //       item.customer.lastName.toLowerCase().includes(username.toLowerCase()) ||
  //       item.loanNo.toLowerCase().includes(username.toLowerCase()) ||
  //       item.customer.contact.toLowerCase().includes(username.toLowerCase()),
  //   );
  // }
  // if (status && status !== 'All') {
    // inputData = inputData.filter((item) => item.status === status);
  // }
  // if (branch) {
  //   inputData = inputData.filter((loan) => loan.customer.branch.name == branch.name);
  // }
  // if (!dateError && startDate && endDate) {
  //   inputData = inputData.filter((loan) =>
  //     isBetween(new Date(loan.issueDate), startDate, endDate),
  //   );
  // }

  return inputData;
}