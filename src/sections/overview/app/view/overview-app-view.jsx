import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useSettingsContext } from 'src/components/settings';
import AppAreaInstalled from '../app-area-installed';
import AppCurrentDownload from '../app-current-download';
import AnalyticsCurrentVisits from '../../analytics/analytics-current-visits.jsx';
import BankingBalanceStatistics from '../../banking/banking-balance-statistics.jsx';
import AnalyticsConversionRates from '../../analytics/analytics-conversion-rates.jsx';
import BookingCheckInWidgets from '../../booking/booking-check-in-widgets.jsx';
import AnalyticsWidgetSummary from '../../analytics/analytics-widget-summary.jsx';
import Box from '@mui/material/Box';
import AnalyticsTrafficBySite from '../../analytics/analytics-traffic-by-site.jsx';
import React, { useState } from 'react';
import EcommerceSaleByGender from '../../e-commerce/ecommerce-sale-by-gender.jsx';
import { Autocomplete, Grid } from '@mui/material';
import sbi from '../../../../assets/logo/download.png';
import Iconify from '../../../../components/iconify/index.js';
import { paths } from '../../../../routes/paths.js';
import {
  useGetCombinedLoanStats,
  useGetInquirySummary,
  useGetLoanChart,
  useGetOtherLoanChart,
  useGetPaymentInOutSummary,
  useGetPortfolioSummary,
  useGetReferenceAreaSummary,
  useGetSchemeLoanSummary,
} from '../../../../api/dashboard.js';
import { useGetCustomer } from '../../../../api/customer.js';
import { useGetLoanissue } from '../../../../api/loanissue.js';
import { useRouter } from '../../../../routes/hooks/index.js';
import TextField from '@mui/material/TextField';
import { useSnackbar } from 'notistack';

const timeRangeOptions = [
  { label: 'All', value: 'all' },
  { label: 'This Month', value: 'this_month' },
  { label: 'This Year', value: 'this_year' },
  { label: 'Last 2 Years', value: 'last_2_years' },
  { label: 'Last Year', value: 'last_year' },
  { label: 'Last 6 Months', value: 'last_6_months' },
  { label: 'Last 3 Months', value: 'last_3_months' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'This Week', value: 'this_week' },
];

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { customer } = useGetCustomer();
  const { Loanissue } = useGetLoanissue();
  const settings = useSettingsContext();
  const [ranges, setRanges] = useState({
    customerRange: 'this_year',
    areaRange: 'this_year',
    referenceRange: 'this_year',
    inquiryRange: 'this_year',
    schemeLoanSummaryRange: 'this_month',
    chargeRange: 'this_year',
    interestRange: 'this_year',
    paymentInRange: 'this_month',
    paymentOutRange: 'this_month',
    expenseRange: 'this_month',
    differenceRange: 'this_month',
  });

  const { SchemeLoanSummary } = useGetSchemeLoanSummary(ranges?.schemeLoanSummaryRange);
  const { InquirySummary } = useGetInquirySummary(ranges?.inquiryRange);
  const { PortfolioSummary } = useGetPortfolioSummary();
  const { OtherLoanChart } = useGetOtherLoanChart();
  const { LoanChart } = useGetLoanChart();

  const { ReferenceAreaSummary: customerData } = useGetReferenceAreaSummary(
    ranges?.customerRange,
    'customerstats',
  );

  const { ReferenceAreaSummary: areaData } = useGetReferenceAreaSummary(
    ranges?.areaRange,
    'areas',
  );

  const { ReferenceAreaSummary: referenceData } = useGetReferenceAreaSummary(
    ranges?.referenceRange,
    'references',
  );

  const { CombinedLoanStats: charges } = useGetCombinedLoanStats(
    ranges?.chargeRange,
    'charge',
  );

  const { CombinedLoanStats: interest } = useGetCombinedLoanStats(
    ranges?.interestRange,
    'interest',
  );

  const { PaymentInOutSummary: paymentIn } = useGetPaymentInOutSummary(
    ranges?.paymentInRange,
    'paymentintotal',
  );

  const { PaymentInOutSummary: paymentOut } = useGetPaymentInOutSummary(
    ranges?.paymentOutRange,
    'paymentouttotal',
  );

  const { PaymentInOutSummary: difference } = useGetPaymentInOutSummary(
    ranges?.differenceRange,
    'difference',
  );

  const { PaymentInOutSummary: expense } = useGetPaymentInOutSummary(
    ranges?.expenseRange,
    'totalexpense',
  );

  const renderStorageOverview = (
    <EcommerceSaleByGender
      chart={{
        series: [
          { label: 'Bank', value: 4000 },
          { label: 'Cash', value: 5000 },
        ],
      }}
      banks={[
        { name: 'SBI', amount: 11.18, logo: sbi },
        { name: 'Kotak', amount: 4.47, logo: sbi },
        { name: 'Axis Bank', amount: 4.47, logo: sbi },
        { name: 'IndusInd Bank', amount: 2.24, logo: sbi },
        { name: 'IndusInd Bank', amount: 2.24, logo: sbi },
        { name: 'IndusInd Bank', amount: 2.24, logo: sbi },
        { name: 'IndusInd Bank', amount: 2.24, logo: sbi },
        { name: 'IndusInd Bank', amount: 2.24, logo: sbi },
      ]}
    />
  );

  const analyticsData = [
    {
      label: 'Total Portfolio',
      value: PortfolioSummary?.data?.totalLoanPortfolio,
    },
    {
      label: 'Total close Loan',
      value: PortfolioSummary?.data?.totalClosedLoanAmount,
    },
    {
      label: 'This month Average',
      value: PortfolioSummary?.data?.monthlyAveragePortfolio,
    },
  ];

  const handleRangeChange = (rangeType, value) => {
    setRanges((prev) => ({
      ...prev,
      [rangeType]: value,
    }));
  };

  const customerOptions = customer.flatMap((cust) => {
    const options = [];
    if (cust.contact) {
      options.push({
        ...cust,
        label: cust.contact,
        uniqueKey: `${cust._id}-contact`,
      });
    }
    if (cust.otpContact && cust.otpContact !== cust.contact) {
      options.push({
        ...cust,
        label: cust.otpContact,
        uniqueKey: `${cust._id}-otp`,
      });
    }
    return options;
  });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}
               sx={{ bgcolor: '#eceaea', p: 5, borderRadius: '20px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Autocomplete
            sx={{
              'label': {
                mt: -0.8,
                fontSize: '14px',
              },
              '& .MuiInputLabel-shrink': {
                mt: 0,
              },
              'input': { height: 7 },
            }}
            options={customer || []}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onChange={(event, value) => {
              if (value) {
                const loanNumbers = Loanissue
                  ?.filter((loan) => loan?.customer?._id === value?._id && loan?.status !== 'Closed')
                  ?.map((loan) => loan?.loanNo) || [];

                if (loanNumbers.length === 0) {
                  enqueueSnackbar('No loan found for this customer.', {
                    variant: 'error',
                  });
                } else {
                  const dataStore = {
                    customer: value,
                    filteredLoanNo: loanNumbers,
                  };

                  sessionStorage.setItem('data', JSON.stringify(dataStore));
                  router.push(paths.dashboard.loanPayHistory.bulk);
                }
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label='Select Customer' placeholder='Choose a customer' />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Autocomplete
            sx={{
              'label': {
                mt: -0.8,
                fontSize: '14px',
              },
              '& .MuiInputLabel-shrink': {
                mt: 0,
              },
              'input': { height: 7 },
            }}
            options={Loanissue}
            getOptionLabel={(option) => option.loanNo}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onChange={(event, value) => {
              if (value) {
                router.push(paths.dashboard.loanPayHistory.edit(value._id));
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label='Search Loan No' placeholder='Choose a loan number' />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Autocomplete
            sx={{
              'label': {
                mt: -0.8,
                fontSize: '14px',
              },
              '& .MuiInputLabel-shrink': {
                mt: 0,
              },
              'input': { height: 7 },
            }}
            options={customerOptions}
            getOptionLabel={(option) => option.label || ''}
            isOptionEqualToValue={(option, value) => option.uniqueKey === value.uniqueKey}
            onChange={(event, value) => {
              if (value) {
                const customerId = value._id;

                const loanNumbers = Loanissue
                  ?.filter((loan) => loan?.customer?._id === customerId)
                  ?.map((loan) => loan?.loanNo) || [];

                if (loanNumbers.length === 0) {
                  enqueueSnackbar('No loan found for this customer.', {
                    variant: 'error',
                  });
                } else {
                  const dataStore = {
                    customer: value,
                    filteredLoanNo: loanNumbers,
                  };

                  sessionStorage.setItem('data', JSON.stringify(dataStore));
                  router.push(paths.dashboard.loanPayHistory.bulk);
                }
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Search Mobile No'
                placeholder='Choose a mobile number'
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.uniqueKey}>
                {option.label}
              </li>
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Button
            fullWidth
            variant='contained'
            color='primary'
            style={{ height: '100%' }}
            startIcon={<Iconify icon='mdi:calculator' width={24} />}
            href={paths.dashboard.goldLoanCalculator}
          >
            Calculator
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title='Expense'
            total={expense?.totalExpense}
            days={expense?.days}
            icon={<Iconify icon='arcticons:expense' width={30} />}
            filter='this_month'
            filterOptions={timeRangeOptions}
            onFilterChange={(val) => {
              console.log(val);
              handleRangeChange('expenseRange', val);
            }}
            color='error'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title='Payment In'
            total={paymentIn?.paymentInTotal}
            days={paymentIn?.days}
            icon={<Iconify icon='zondicons:arrow-thin-down'
                           width={30} />}
            filter='this_month'
            filterOptions={timeRangeOptions}
            onFilterChange={(val) => handleRangeChange('paymentInRange', val)}
            color='success'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title='Payment Out'
            total={paymentOut?.paymentOutTotal}
            days={paymentOut?.days}
            icon={<Iconify icon='zondicons:arrow-thin-up' width={30} />}
            filter='this_month'
            filterOptions={timeRangeOptions}
            onFilterChange={(val) => handleRangeChange('paymentOutRange', val)}
            color='warning'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title='Payment Diff'
            total={difference.difference}
            days={difference.days}
            icon={<Iconify icon='tabler:arrows-diff' width={30} />}
            filter='this_month'
            filterOptions={timeRangeOptions}
            onFilterChange={(val) => handleRangeChange('differenceRange', val)}
            color='secondary'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>{renderStorageOverview}</Box>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <BookingCheckInWidgets
                chartTitle={'Interest Summary'}
                chart={{
                  series: [
                    {
                      label: 'Interest In',
                      icon: <Iconify icon='mynaui:percentage-waves-solid' width={40} />,
                      total: interest?.interest?.interestInMain,
                    },
                    {
                      label: 'Interest Out',
                      icon: <Iconify icon='iconamoon:zoom-out-fill' width={40} />,
                      total: interest?.interest?.interestOutOther,
                    },
                    {
                      label: 'Differance',
                      icon: <Iconify icon='ph:scales-fill' width={40} />,
                      total: interest?.interest?.interestDifference,
                    },
                  ],
                }}
                timeRangeOptions={timeRangeOptions}
                onTimeRangeChange={(range) => {
                  handleRangeChange('interestRange', range);
                }}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <AnalyticsConversionRates
                title='Interest Rate'
                chart={{
                  series: [
                    {
                      name: 'Loan Amount',
                      data: SchemeLoanSummary?.chartData?.series?.[0]?.data || [],
                    },
                  ],
                  categories: SchemeLoanSummary?.chartData?.categories || [],
                }}
                footer={{
                  interestRate: `${SchemeLoanSummary?.global?.avgInterestRate?.toFixed(2) || '0.00'}%`,
                  amount: SchemeLoanSummary?.global?.totalLoanAmount?.toLocaleString('en-IN') || '0',
                }}
                timeRangeOptions={timeRangeOptions}
                onTimeRangeChange={(range) => handleRangeChange('schemeLoanSummaryRange', range)}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <AppCurrentDownload
                title='Inquiry'
                chart={{
                  series: InquirySummary?.data || [],
                  total: InquirySummary?.total,
                }}
                timeRangeOptions={timeRangeOptions}
                onTimeRangeChange={(range) => handleRangeChange('inquiryRange', range)}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <AppCurrentDownload
                title='Customer'
                chart={{
                  series: [
                    { label: 'New Customer', value: customerData?.customerStats?.newCustomerCount },
                    { label: 'Loan Active Customer', value: customerData?.customerStats?.activeLoanCustomerCount },
                  ],
                  total: customerData?.customerStats?.totalCustomerCount,
                }}
                timeRangeOptions={timeRangeOptions}
                onTimeRangeChange={(range) => handleRangeChange('customerRange', range)}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <AnalyticsCurrentVisits
                title='Current Customer References'
                chart={{
                  series: referenceData?.references,
                }}
                timeRangeOptions={timeRangeOptions}
                onTimeRangeChange={(range) => {
                  handleRangeChange('referenceRange', range);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <AnalyticsTrafficBySite title='Traffic by Site' list={analyticsData} />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <AppAreaInstalled
                title='Loan Graph'
                chart={LoanChart}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Stack spacing={3}>
                <BankingBalanceStatistics
                  title='Other Loan'
                  chart={OtherLoanChart}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <BookingCheckInWidgets
                chartTitle={'Charge Summary'}
                chart={{
                  series: [
                    {
                      label: 'Charge In',
                      icon: <Iconify icon='mynaui:percentage-waves-solid' width={40} />,
                      total: charges?.charge?.chargeIn,
                    },
                    {
                      label: 'Charge Out',
                      icon: <Iconify icon='iconamoon:zoom-out-fill' width={40} />,
                      total: charges?.charge?.chargeOut,
                    },
                    {
                      label: 'Differance',
                      icon: <Iconify icon='ph:scales-fill' width={40} />,
                      total: charges?.charge?.chargeDifference,
                    },
                  ],
                }}
                timeRangeOptions={timeRangeOptions}
                onTimeRangeChange={(range) => {
                  handleRangeChange('chargeRange', range);
                }}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <AnalyticsCurrentVisits
                title='Current Customer Area'
                chart={{
                  series: areaData?.areas,
                }}
                timeRangeOptions={timeRangeOptions}
                onTimeRangeChange={(range) => {
                  handleRangeChange('areaRange', range);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
