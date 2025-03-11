import isEqual from 'lodash/isEqual';
import React, { useState, useCallback, useEffect } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useTable, getComparator } from 'src/components/table';
import { useAuthContext } from '../../../auth/hooks';
import { useGetConfigs } from '../../../api/config';
import { Box } from '@mui/system';
import LoanInterestDetailsListView from '../loan-details/loan-details-list-view/loan-interest-details-list-view';
import LoanPartReleaseDetailsListView from '../loan-details/loan-details-list-view/loan-part-release-details-list-view';
import LoanUchakPayDetailsListView from '../loan-details/loan-details-list-view/loan-uchakPay-details-list-view';
import LoanPartPaymentDetailsListView from '../loan-details/loan-details-list-view/loan-part-payment-details-list-view';
import LoanCloseDetailsListView from '../loan-details/loan-details-list-view/loan-close-details-list-view';
import { useGetSingleLoan } from '../../../api/single-loan-details';
import LoanDetailTableToolbarTableToolbar from '../loan-details/loan-details-table/loan-detail-table-toolbar-table-toolbar';
import { LoadingScreen } from '../../../components/loading-screen/index.js';
import Grid from '@mui/material/Unstable_Grid2';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import NewGoldLonListView from '../daily-reports/daily-reports-list-view/new-gold-lon-list-view.jsx';
import GoldLoanInterestListView from '../daily-reports/daily-reports-list-view/gold-loan-interest-list-view.jsx';
import GoldLoanPartPaymentListView from '../daily-reports/daily-reports-list-view/gold-loan-part-payment-list-view.jsx';
import GoldLoanUchakPartListView from '../daily-reports/daily-reports-list-view/gold-loan-uchak-part-list-view.jsx';
import axios from 'axios';

// ----------------------------------------------------------------------

const defaultFilters = {
  username: '',
  status: 'All',
  startDate: null,
  endDate: null,
  branch: '',
  loan: '',
};

// ----------------------------------------------------------------------

export default function LoanDetailsListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [filters, setFilters] = useState(defaultFilters);
  const loan = filters?.loan;
  const params = new URLSearchParams();
  // if (filters.branch._id) params.append('branch', filters.branch._id);
  // if (filters.startDate) params.append('date', filters.startDate.toLocaleDateString());
  // if(filters.username) params.append('username',filters.username)
  // const { report, reportLoading } = useGetDailyReport(params);
  const [activeTab, setActiveTab] = useState(0);
  const [loanDetail, setLoanDetail] = useState({});
  const [loanDetailLoading, setLoanDetailLoading] = useState(false);
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const fetchReports = async () => {
    if (!filters.loan) return;

    try {
      setLoanDetailLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/${user?.company}/loan-detail/${loan}`
      );

      setLoanDetail(res?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoanDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filters.loan]);

  const dataFiltered = applyFilter({
    inputData: loanDetail,
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
    [table]
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

  if (loanDetailLoading) {
    return <LoadingScreen />;
  }

  const data = {
    intDetails: loanDetail?.interestDetail,
    partReleaseDetails: loanDetail?.partReleaseDetail,
    uchakPayDetails: loanDetail?.uchakInterestDetail,
    partPaymentDetails: loanDetail?.partPaymentDetail,
    loanCloseDetails: loanDetail?.loanCloseDetail,
  };
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Loan Details"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Reports', href: paths.dashboard.reports.root },
            { name: 'Loan details', href: paths.dashboard.reports.root },
            { name: ' List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card sx={{ pb: 3 }}>
          <LoanDetailTableToolbarTableToolbar
            filters={filters}
            onFilters={handleFilters}
            dataFilter={dataFiltered}
            configs={configs}
            data={data}
          />
          <Box></Box>
          <Box mt={2}></Box>
          <Box mt={2}></Box>
          <Box mt={2}></Box>
          <Box mt={2}></Box>
          <Grid container spacing={3} sx={{ mt: 1.5 }}>
            <Grid item xs={12} P={0}>
              <Tabs
                value={activeTab}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ px: 3, mb: 1.5, '.css-1obiyde-MuiTabs-indicator': { bottom: 8 } }}
              >
                <Tab label="Loan Interest Details" />
                <Tab label="Loan part Release Details" />
                <Tab label="Loan Uchak Pay Details" />
                <Tab label="Loan part Payment Details" />
                <Tab label="Loan Close Details" />
              </Tabs>
              {activeTab === 0 && (
                <LoanInterestDetailsListView
                  interestDetail={loanDetail?.interestDetail || []}
                  dataFilters={filters}
                />
              )}
              {activeTab === 1 && (
                <LoanPartReleaseDetailsListView
                  partReleaseDetail={loanDetail?.partReleaseDetail || []}
                  dataFilters={filters}
                />
              )}
              {activeTab === 2 && (
                <LoanUchakPayDetailsListView
                  uchakInterestDetail={loanDetail?.uchakInterestDetail || []}
                  dataFilters={filters}
                />
              )}
              {activeTab === 3 && (
                <LoanPartPaymentDetailsListView
                  partPaymentDetail={loanDetail?.partPaymentDetail || []}
                  dataFilters={filters}
                />
              )}{' '}
              {activeTab === 4 && (
                <LoanCloseDetailsListView
                  loanCloseDetail={loanDetail?.loanCloseDetail || []}
                  dataFilters={filters}
                />
              )}
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
