import isEqual from 'lodash/isEqual';
import React, { useState, useCallback } from 'react';
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
import {
  useTable,
  getComparator,
} from 'src/components/table';
import { LoadingScreen } from '../../../components/loading-screen';
import { useGetConfigs } from '../../../api/config';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Unstable_Grid2';
import OtherNewGoldLonListView from '../other-loan-daily-reports/other-daily-reports-list-view/new-other-gold-lon-list-view';
import OtherGoldLoanInterestListView from '../other-loan-daily-reports/other-daily-reports-list-view/other-gold-loan-interest-list-view';
import OtherGoldLoanCloseListView from '../other-loan-daily-reports/other-daily-reports-list-view/other-gold-loan-close-list-view';
import { useGetOtherDailyReport } from 'src/api/other-loan-daily-report';
import OtherDailyReportsTableToolbar from '../other-loan-daily-reports/other-daily-reports-table/other-daily-reports-table-toolbar';

// ----------------------------------------------------------------------

const defaultFilters = {
  username: '',
  status: 'All',
  startDate: new Date(),
  endDate: null,
  branch: '',
};

// ----------------------------------------------------------------------

export default function OtherDailyReportsListView() {
  const table = useTable();
  const { configs } = useGetConfigs();
  const settings = useSettingsContext();
  const confirm = useBoolean();
  const [filters, setFilters] = useState(defaultFilters);
  const params = new URLSearchParams();
  if (filters.branch._id) params.append('branch', filters.branch._id);
  if (filters.startDate) params.append('date', filters.startDate.toLocaleDateString());
  // if(filters.username) params.append('username',filters.username)
  const date = filters.startDate.toLocaleDateString();
  const { report, reportLoading } = useGetOtherDailyReport(params);
  const [tableData, setTableData] = useState(report);
  const [activeTab, setActiveTab] = useState(0);
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const dataFiltered = applyFilter({
    inputData: report,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });
  // const dataInPage = dataFiltered.slice(
  //   table.page * table.rowsPerPage,
  //   table.page * table.rowsPerPage + table.rowsPerPage,
  // );

  const canReset = !isEqual(defaultFilters, filters);

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

  if (reportLoading) {
    return <LoadingScreen />;
  }

  const data = {
    LoanIssue: report?.loans,
    partPayment: report?.closedLoanDetails,
    interestDetail: report?.interestDetail,
    loanDetails: report?.loans,
    loanIntDetails: report?.interestDetail,
    closedLoanDetails: report?.closedLoanDetails,
  };
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Other Loan Daily Reports"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Reports', href: paths.dashboard.reports.root },
            { name: 'Other Loan Daily Reports', href: paths.dashboard.reports.root },
            { name: ' List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card sx={{ pb: 3 }}>
          <OtherDailyReportsTableToolbar
            filters={filters}
            onFilters={handleFilters}
            dataFilter={dataFiltered}
            configs={configs}
            data={data}
          />
          <Grid container spacing={3} sx={{ mt: 1.5 }}>
            <Grid item xs={12} P={0}>
              <Tabs
                value={activeTab}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ px: 3, mb: 1.5, '.css-1obiyde-MuiTabs-indicator': { bottom: 8 } }}
              >
                <Tab
                  label={
                    <>
                      New Gold Loan{' '}
                      <strong style={{ marginLeft: '8px' }}>({report?.loans.length || 0})</strong>
                    </>
                  }
                />
                <Tab
                  label={
                    <>
                      Gold Loan Interest{' '}
                      <strong style={{ marginLeft: '8px' }}>
                        ({report?.interestDetail.length || 0})
                      </strong>
                    </>
                  }
                />{' '}
                <Tab
                  label={
                    <>
                      Gold Loan Close{' '}
                      <strong style={{ marginLeft: '8px' }}>
                        ({report?.closedLoanDetails.length || 0})
                      </strong>
                    </>
                  }
                />{' '}
              </Tabs>

              {activeTab === 0 && <OtherNewGoldLonListView LoanIssue={report?.loans} />}
              {activeTab === 1 && (
                <OtherGoldLoanInterestListView interestDetail={report?.interestDetail} />
              )}
              {activeTab === 2 && (
                <OtherGoldLoanCloseListView partPayment={report?.closedLoanDetails} />
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
