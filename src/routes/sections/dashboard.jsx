import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomerCreateView, CustomerListView } from '../../sections/customer/view';
import { SettingsPage } from '../../sections/settings/view';
import CustomerEditView from '../../sections/customer/view/customer-edit-view';
import GoldLoanCalculator from '../../sections/goldloancalculator/gold-loan-calculator';
import Notice from '../../sections/reminder/view/notice';

// ----------------------------------------------------------------------

const ResetPassword = lazy(() => import('src/pages/auth/jwt/reset'));
// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// INQUIRY
const InquiryListView = lazy(() => import('../../sections/inquiry/view/inquiry-list-view'));
const InquiryCreateView = lazy(() => import('../../sections/inquiry/view/inquiry-create-view'));
const InquiryEditView = lazy(() => import('../../sections/inquiry/view/inquiry-edit-view'));
//EMPLOYEE
const EmployeeListView = lazy(() => import('../../sections/employee/view/employee-list-view'));
const EmployeeCreateView = lazy(() => import('../../sections/employee/view/employee-create-view'));
const EmployeeEditView = lazy(() => import('../../sections/employee/view/employee-edit-view'));
// SCHEME
const SchemeListView = lazy(() => import('../../sections/scheme/view/scheme-list-view'));
const SchemeCreateView = lazy(() => import('../../sections/scheme/view/scheme-create-view'));
const SchemeEditView = lazy(() => import('../../sections/scheme/view/scheme-edit-view'));
const GoldPriceListView = lazy(() => import('../../sections/scheme/goldprice/goldprice-list-view'));
// CARAT
const CaratListView = lazy(() => import('../../sections/carat/view/carat-list-view'));
const CaratCreateView = lazy(() => import('../../sections/carat/view/carat-create-view'));
const CaratEditView = lazy(() => import('../../sections/carat/view/carat-edit-view'));
//PROPERTY
const PropertyEditView = lazy(() => import('../../sections/property/view/property-edit-view'));
const PropertyCreateView = lazy(() => import('../../sections/property/view/property-create-view'));
const PropertyListView = lazy(() => import('../../sections/property/view/property-list-view'));
//LOAN PAY HISTORY
const LoanpayhistoryListView = lazy(
  () => import('../../sections/loanpayhistory/view/loanpayhistory-list-view')
);
const LoanpayhistoryCreateView = lazy(
  () => import('../../sections/loanpayhistory/view/loanpayhistory-create-view')
);
const BulkInterestPay = lazy(
  () => import('../../sections/loanpayhistory/bulk-interest-pay/bulk-interest-pay')
);
//LOAN PAY HISTORY
const OtherLoanpayhistoryListView = lazy(
  () => import('../../sections/other-loanpayhistory/view/other-loanpayhistory-list-view')
);
const OtherLoanpayhistoryCreateView = lazy(
  () => import('../../sections/other-loanpayhistory/view/other-loanpayhistory-create-view')
);
const OtherBulkInterestPay = lazy(
  () => import('../../sections/other-loanpayhistory/bulk-interest-pay/bulk-interest-pay')
);
// PENALTY
const PenaltyListView = lazy(() => import('../../sections/penalty/view/penalty-list-view'));
const PenaltyCreateview = lazy(() => import('../../sections/penalty/view/penalty-create-view'));
const PenaltyEditView = lazy(() => import('../../sections/penalty/view/penalty-edit-view'));
// DISBURSE
const DisburseCreateView = lazy(() => import('../../sections/disburse/view/disburse-create-view'));
const DisburseEditView = lazy(() => import('../../sections/disburse/view/disburse-edit-view.jsx'));
const DisburseListView = lazy(() => import('../../sections/disburse/view/disburse-list-view'));
// REMINDER
const ReminderListView = lazy(() => import('../../sections/reminder/view/reminder-list-view'));
// LOAN ISSUE
const LoanissueEditView = lazy(() => import('../../sections/loanissue/view/loanissue-edit-view'));
const LoanissueCreateView = lazy(
  () => import('../../sections/loanissue/view/loanissue-create-view')
);
const LoanissueListView = lazy(() => import('../../sections/loanissue/view/loanissue-list-view'));
// OTHER LOAN ISSUE
const OtherLoanissueEditView = lazy(
  () => import('../../sections/other-loanissue/view/other-loanissue-edit-view')
);
const OtherLoanissueCreateView = lazy(
  () => import('../../sections/other-loanissue/view/other-loanissue-create-view')
);
const OtherLoanissueListView = lazy(
  () => import('../../sections/other-loanissue/view/other-loanissue-list-view')
);
// REMINDER-DETAILS
const ReminderDetailsListView = lazy(
  () => import('../../sections/reminder/view/reminder-details-list-view')
);
//REPORTS
const AllBranchLoanSummaryListView = lazy(
  () => import('../../sections/reports/view/all-branch-loan-summary-list-view')
);
const BranchViseLoanClosingListView = lazy(
  () => import('../../sections/reports/view/branch-vise-loan-closing-list-view')
);
const DailyReportsListView = lazy(
  () => import(`../../sections/reports/view/daily-reports-list-view`)
);
const LoanDetailListView = lazy(() => import('../../sections/reports/view/loan-details-list-view'));
//MYPROFILE
const MyProfile = lazy(() => import('src/sections/settings/view/my-profile-create-view'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      {
        path: 'inquiry',
        children: [
          { element: <InquiryListView />, index: true },
          { path: 'list', element: <InquiryListView /> },
          { path: 'new', element: <InquiryCreateView /> },
          { path: ':id/edit', element: <InquiryEditView /> },
        ],
      },
      {
        path: 'scheme',
        children: [
          { element: <SchemeListView />, index: true },
          { path: 'list', element: <SchemeListView /> },
          { path: 'goldpricelist', element: <GoldPriceListView /> },
          { path: 'new', element: <SchemeCreateView /> },
          { path: ':id/edit', element: <SchemeEditView /> },
          { path: ':id/edit', element: <InquiryEditView /> },
        ],
      },
      {
        path: 'carat',
        children: [
          { element: <CaratListView />, index: true },
          { path: 'list', element: <CaratListView /> },
          { path: 'new', element: <CaratCreateView /> },
          { path: ':id/edit', element: <CaratEditView /> },
        ],
      },
      {
        path: 'property',
        children: [
          { element: <PropertyListView />, index: true },
          { path: 'list', element: <PropertyListView /> },
          { path: 'new', element: <PropertyCreateView /> },
          { path: ':id/edit', element: <PropertyEditView /> },
        ],
      },
      {
        path: 'penalty',
        children: [
          { element: <PenaltyListView />, index: true },
          { path: 'list', element: <PenaltyListView /> },
          { path: 'new', element: <PenaltyCreateview /> },
          { path: ':id/edit', element: <PenaltyEditView /> },
        ],
      },
      {
        path: 'disburse',
        children: [
          { element: <DisburseListView />, index: true },
          { path: 'list', element: <DisburseListView /> },
          { path: ':id/new', element: <DisburseCreateView /> },
          { path: ':id/edit', element: <DisburseEditView /> },
        ],
      },
      {
        path: 'reminder',
        children: [
          { path: 'list', element: <ReminderListView /> },
          { path: 'notice', element: <Notice /> },
        ],
      },
      {
        path: 'reminder-details',
        children: [
          { element: <ReminderDetailsListView />, index: true },
          { path: ':id/list', element: <ReminderDetailsListView /> },
        ],
      },
      {
        path: 'employee',
        children: [
          { element: <EmployeeListView />, index: true },
          { path: 'list', element: <EmployeeListView /> },
          { path: 'new', element: <EmployeeCreateView /> },
          { path: ':id/edit', element: <EmployeeEditView /> },
        ],
      },
      {
        path: 'loanissue',
        children: [
          { element: <LoanissueListView />, index: true },
          { path: 'list', element: <LoanissueListView /> },
          { path: 'new', element: <LoanissueCreateView /> },
          { path: ':id/edit', element: <LoanissueEditView /> },
        ],
      },
      {
        path: 'other-loanissue',
        children: [
          { element: <OtherLoanissueListView />, index: true },
          { path: 'list', element: <OtherLoanissueListView /> },
          { path: 'new', element: <OtherLoanissueCreateView /> },
          { path: ':id/edit', element: <OtherLoanissueEditView /> },
        ],
      },
      {
        path: 'loanpayhistory',
        children: [
          { element: <LoanpayhistoryListView />, index: true },
          { path: 'list', element: <LoanpayhistoryListView /> },
          { path: ':id/new', element: <LoanpayhistoryCreateView /> },
          { path: 'bulkInterest/new', element: <BulkInterestPay /> },
        ],
      },
      {
        path: 'other-loanPayHistory',
        children: [
          { element: <OtherLoanpayhistoryListView />, index: true },
          { path: 'list', element: <OtherLoanpayhistoryListView /> },
          { path: ':id/new', element: <OtherLoanpayhistoryCreateView /> },
          { path: 'bulkInterest/new', element: <OtherBulkInterestPay /> },
        ],
      },
      {
        path: 'customer',
        children: [
          { element: <CustomerListView />, index: true },
          { path: 'list', element: <CustomerListView /> },
          { path: 'new', element: <CustomerCreateView /> },
          { path: ':id/edit', element: <CustomerEditView /> },
          { path: 'profile', element: <MyProfile /> },
        ],
      },
      {
        path: 'reports',
        children: [
          { element: <AllBranchLoanSummaryListView />, index: true },
          { path: 'loan-list', element: <AllBranchLoanSummaryListView /> },
          { path: 'closed-loanList', element: <BranchViseLoanClosingListView /> },
          { path: 'daily-reports', element: <DailyReportsListView /> },
          { path: 'loan-details', element: <LoanDetailListView /> },
        ],
      },
      { path: 'setting', element: <SettingsPage /> },
      { path: 'goldLoanCalculator', element: <GoldLoanCalculator /> },
    ],
  },
  { path: 'jwt/reset-password/:token', element: <ResetPassword /> },
];
