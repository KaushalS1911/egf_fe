import React, { useCallback, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import CompanyProfile from './company-profile-create-view';
import PermissionView from './permission-view';
import Rolescreatepage from './roles-crete-view';
import BusinessTypeCreteView from './business-type-crete-view';
import BranchCreateView from './branch-create-view';
import LoanTypeView from './loan-type-view';
import RemarkCreateView from './remark-create-view';
import PolicyConfigCreateView from './policy-config-create-view';
import MonthCreateView from './month-create-view.jsx';
import OtherNameCreateView from './other-name-create-view.jsx';
import WhatsappConfigs from './whatsapp-configs.jsx';
import ExpenseTypeCreteView from './expense-type-crete-view.jsx';
import ChargeTypeView from './charge-type-view.jsx';
import DeviceAccessView from './device-access-view.jsx';
import AreaCreteView from './area-crete-view.jsx';
import PercentageCreateView from './percentage-create-view.jsx';

const TABS = [
  {
    value: 'Company Profile',
    label: 'Company Profile',
    icon: <Iconify icon="mdi:company" width={24} />,
  },
  {
    value: 'Roles',
    label: 'Roles',
    icon: <Iconify icon="oui:app-users-roles" width={24} />,
  },
  {
    value: 'Permission',
    label: 'Permission',
    icon: <Iconify icon="mdi:eye-lock" width={24} />,
  },
  {
    value: 'Branch',
    label: 'Branch',
    icon: <Iconify icon="carbon:branch" width={24} />,
  },
  {
    value: 'Business type',
    label: 'Business type',
    icon: <Iconify icon="material-symbols:add-business" width={24} />,
  },
  {
    value: 'Loan type',
    label: 'Loan type',
    icon: <Iconify icon="mdi:cash-sync" width={24} />,
  },
  {
    value: 'Percentage',
    label: 'Percentage',
    icon: <Iconify icon="mdi:cash-sync" width={24} />,
  },
  {
    value: 'Expense type',
    label: 'Expense type',
    icon: <Iconify icon="arcticons:expense-manager-2" width={24} sx={{ color: '#000' }} />,
  },
  {
    value: 'Charge type',
    label: 'Charge type',
    icon: <Iconify icon="qlementine-icons:money-16" width={20} />,
  },
  {
    value: 'Remark type',
    label: 'Remark type',
    icon: <Iconify icon="subway:mark-1" width={18} />,
  },
  {
    value: 'Export Policy Config',
    label: 'Export Policy Config',
    icon: <Iconify icon="icon-park-outline:agreement" width={20} />,
  },
  {
    value: 'Other Name',
    label: 'Other Name',
    icon: <Iconify icon="icon-park-solid:edit-name" width={20} />,
  },
  {
    value: 'Month',
    label: 'Month',
    icon: <Iconify icon="tabler:calendar-month-filled" width={20} />,
  },
  {
    value: 'WhatsApp Configs',
    label: 'WhatsApp Configs',
    icon: <Iconify icon="ic:baseline-whatsapp" width={20} />,
  },
  {
    value: 'Device Access',
    label: 'Device Access',
    icon: <Iconify icon="rivet-icons:device" width={18} sx={{ color: 'gray' }} />,
  },
  {
    value: 'Area',
    label: 'Area',
    icon: <Iconify icon="majesticons:map-marker-area-line" width={18} sx={{ color: 'gray' }} />,
  },
];

export default function SettingsPage() {
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState('Company Profile');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Settings"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Settings' }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>
        {currentTab === 'Company Profile' && <CompanyProfile />}
        {currentTab === 'Roles' && <Rolescreatepage setTab={setCurrentTab} />}
        {currentTab === 'Permission' && <PermissionView />}
        {currentTab === 'Business type' && <BusinessTypeCreteView />}
        {currentTab === 'Loan type' && <LoanTypeView />}
        {currentTab === 'Percentage' && <PercentageCreateView />}
        {currentTab === 'Expense type' && <ExpenseTypeCreteView />}
        {currentTab === 'Charge type' && <ChargeTypeView />}
        {currentTab === 'Branch' && <BranchCreateView />}
        {currentTab === 'Remark type' && <RemarkCreateView />}
        {currentTab === 'Export Policy Config' && <PolicyConfigCreateView />}
        {currentTab === 'Other Name' && <OtherNameCreateView />}
        {currentTab === 'Month' && <MonthCreateView />}
        {currentTab === 'WhatsApp Configs' && <WhatsappConfigs />}
        {currentTab === 'Device Access' && <DeviceAccessView />}
        {currentTab === 'Area' && <AreaCreteView />}
      </Container>
    </>
  );
}
