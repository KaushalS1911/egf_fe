import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomerCreateView, CustomerListView } from '../../sections/customer/view';
import { SettingsPage } from '../../sections/settings/view';
import CustomerEditView from '../../sections/customer/view/customer-edit-view';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// ORDER
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// INVOICE
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// INQUIRY
const InquiryListView = lazy(() => import('../../sections/inquiry/view/inquiry-list-view'));
const InquiryCreateView = lazy(() => import('../../sections/inquiry/view/inquiry-create-view'));
const InquiryEditView = lazy(() => import('../../sections/inquiry/view/inquiry-edit-view'));
//EMPLOYEE
const EmployeeListView = lazy(() => import('../../sections/employee/view/employee-list-view'));
const EmployeeCreateView = lazy(() => import('../../sections/employee/view/employee-create-view'));
const EmployeeEditView = lazy(() => import('../../sections/employee/view/employee-edit-view'));
// SCHEME
const SchemeListView = lazy(()=>import('../../sections/scheme/view/scheme-list-view'))
const SchemeCreateView = lazy(() => import('../../sections/scheme/view/scheme-create-view'));
const SchemeEditView = lazy(()=>import('../../sections/scheme/view/scheme-edit-view'))
const GoldPriceListView = lazy(()=>import('../../sections/scheme/goldprice/goldprice-list-view'))
// CARAT
const CaratListView = lazy(()=> import('../../sections/carat/view/carat-list-view'));
const CaratCreateView = lazy(()=>import('../../sections/carat/view/carat-create-view'))
const CaratEditView = lazy(()=>import('../../sections/carat/view/carat-edit-view'))
//PROPERTY
const  PropertyEditView = lazy(()=>import('../../sections/property/view/property-edit-view'))
const  PropertyCreateView = lazy(()=>import('../../sections/property/view/property-create-view'))
const  PropertyListView = lazy(()=>import('../../sections/property/view/property-list-view'))

// PENALTY
const PenaltyListView = lazy(()=>import('../../sections/penalty/view/penalty-list-view'))
const PenaltyCreateview = lazy(()=>import('../../sections/penalty/view/penalty-create-view'))
const PenaltyEditView = lazy(()=>import('../../sections/penalty/view/penalty-edit-view'))
// DISBURSE
const DisbursecreateView = lazy(()=>import('../../sections/disburse/view/disburse-create-view'))

// LOAN ISSUE
const LoanissueEditView = lazy(()=>import('../../sections/loanissue/view/loanissue-edit-view'))
const LoanissueCreateView = lazy(()=>import('../../sections/loanissue/view/loanissue-create-view'))
const LoanissueListView = lazy(()=>import('../../sections/loanissue/view/loanissue-list-view'))

// BLOG
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// JOB
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// TOUR
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// FILE MANAGER
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// APP
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));


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
          // { path: 'cards', element: <UserCardsPage /> },
          // { path: 'list', element: <InquiryListView /> },
          { path: 'new', element: <InquiryCreateView /> },
          { path: ':id/edit', element: <InquiryEditView /> },
          // { path: 'account', element: <UserAccountPage /> },
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
          { element: <CaratListView/>, index: true },
          { path: 'list', element: <CaratListView/> },
          { path: 'new', element: <CaratCreateView/> },
          { path: ':id/edit', element: <CaratEditView /> },
          // { path: ':id/edit', element: <InquiryEditView /> },
        ],
      },

      {
        path: 'property',
        children: [
          { element: <PropertyListView />, index: true },
          { path: 'list', element: <PropertyListView /> },
          { path: 'new', element: <PropertyCreateView /> },
          { path: ':id/edit', element: <PropertyEditView /> },
          // { path: ':id/edit', element: <InquiryEditView /> },
        ],
      },
      {
        path: 'penalty',
        children: [
          { element: <PenaltyListView/>, index: true },
          { path: 'list', element: <PenaltyListView/> },
          { path: 'new', element: <PenaltyCreateview/> },
          { path: ':id/edit', element: <PenaltyEditView /> },
        ],
      },
      {
        path: 'disburse',
        children: [
          // { element: <PenaltyListView/>, index: true },
          // { path: 'list', element: <PenaltyListView/> },
          { path: 'new', element: <DisbursecreateView/> },
          // { path: ':id/edit', element: <PenaltyEditView /> },
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
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'customer',
        children: [
          { element: <CustomerListView />, index: true },
          { path: 'list', element: <CustomerListView /> },
          { path: 'new', element: <CustomerCreateView /> },
          { path: ':id/edit', element: <CustomerEditView /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'job',
        children: [
          { element: <JobListPage />, index: true },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      {
        path: 'tour',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'setting', element: <SettingsPage /> },
    ],
  },
];
