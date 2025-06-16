import { useMemo } from 'react';
import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useAuthContext } from '../../auth/hooks';
import { useGetConfigs } from '../../api/config';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  inquiry: <Iconify icon="heroicons-solid:newspaper" sx={{ width: 1, height: 1 }} />,
  customer: icon('ic_user'),
  employee: <Iconify icon="clarity:employee-solid" sx={{ width: 1, height: 1 }} />,
  scheme: <Iconify icon="bxs:offer" sx={{ width: 1, height: 1 }} />,
  carat: <Iconify icon="mdi:gold" sx={{ width: 1, height: 1 }} />,
  loanType: <Iconify icon="mdi:currency-usd-outline" sx={{ width: 1, height: 1 }} />,
  property: <Iconify icon="clarity:building-solid" sx={{ width: 1, height: 1 }} />,
  penalty: <Iconify icon="icon-park-outline:gavel" sx={{ width: 1, height: 1 }} />,
  loanissue: <Iconify icon="streamline:bank-solid" />,
  otherLoanIssue: <Iconify icon="mdi-light:bank" sx={{ width: '25px', height: '25px' }} />,
  disburse: <Iconify icon="mdi:bank-transfer-out" sx={{ width: '30px', height: '30px' }} />,
  reminder: <Iconify icon="carbon:reminder" sx={{ width: 1, height: 1 }} />,
  setting: <Iconify icon="solar:settings-bold-duotone" width={24} />,
  goldLoanCalculator: <Iconify icon="icon-park-solid:calculator" width={24} />,
  loanPayHistory: <Iconify icon="cuida:history-outline" width={24} />,
  otherPayHistory: <Iconify icon="solar:history-2-outline" width={24} />,
  reports: <Iconify icon="iconoir:reports" width={24} />,
  otherReports: <Iconify icon="mdi:report-box-multiple-outline" width={24} />,
  cashAndBank: <Iconify icon="fluent:building-bank-toolbox-20-regular" width={24} />,
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();

  const data = useMemo(
    () => [
      // MASTER
      // ----------------------------------------------------------------------
      {
        subheader: t('overview'),
        items: [
          {
            title: t('Dashboard'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
        ],
      },
      {
        subheader: t('Masters'),
        items: [
          {
            title: t('Inquiry'),
            path: paths.dashboard.inquiry.root,
            icon: ICONS.inquiry,
          },
          {
            title: t('Customer'),
            path: paths.dashboard.customer.root,
            icon: ICONS.customer,
          },
          {
            title: t('Employee'),
            path: paths.dashboard.employee.root,
            icon: ICONS.employee,
          },
          {
            title: t('scheme'),
            path: paths.dashboard.scheme.root,
            icon: ICONS.scheme,
          },
          {
            title: t('carat'),
            path: paths.dashboard.carat.root,
            icon: ICONS.carat,
          },
          {
            title: t('property'),
            path: paths.dashboard.property.root,
            icon: ICONS.property,
          },
          {
            title: t('penalty'),
            path: paths.dashboard.penalty.root,
            icon: ICONS.penalty,
          },
        ],
      },
      {
        subheader: t('loans'),
        items: [
          {
            title: t('Loan issue'),
            path: paths.dashboard.loanissue.root,
            icon: ICONS.loanissue,
          },

          {
            title: t('disburse'),
            path: paths.dashboard.disburse.root,
            icon: ICONS.disburse,
          },
          {
            title: t('loan pay history'),
            path: paths.dashboard.loanPayHistory.list,
            icon: ICONS.loanPayHistory,
          },
        ],
      },
      {
        subheader: t('other loans'),
        items: [
          {
            title: t('other loan issue'),
            path: paths.dashboard.other_loanissue.root,
            icon: ICONS.otherLoanIssue,
          },

          {
            title: t('other loan pay history'),
            path: paths.dashboard.other_loanPayHistory.list,
            icon: ICONS.otherPayHistory,
          },
        ],
      },
      {
        subheader: t('Loan Utilities'),
        items: [
          {
            title: t('reminder'),
            path: paths.dashboard.reminder.list,
            icon: ICONS.reminder,
          },
          {
            title: t('Gold Loan Calculator'),
            path: paths.dashboard.goldLoanCalculator,
            icon: ICONS.goldLoanCalculator,
          },
          {
            title: t('reports'),
            path: paths.dashboard.reports.root,
            icon: ICONS.reports,
            children: [
              {
                title: t('all branch loan summary'),
                path: paths.dashboard.reports['loan-list'],
              },
              {
                title: t('branch vise loan closing report'),
                path: paths.dashboard.reports['closed-loanList'],
              },
              {
                title: t('daily reports'),
                path: paths.dashboard.reports['daily-reports'],
              },
              {
                title: t('loan details'),
                path: paths.dashboard.reports['loan-details'],
              },
              {
                title: t('Interest Reports'),
                path: paths.dashboard.reports['interest-reports'],
              },
              {
                title: t('interest entry reports'),
                path: paths.dashboard.reports['interest-entry-reports'],
              },
              {
                title: t('customer statement'),
                path: paths.dashboard.reports['customer-statement'],
              },
              {
                title: t('customer refrance report'),
                path: paths.dashboard.reports['customer-refrance-report'],
              },
              {
                title: t('loan issue reports'),
                path: paths.dashboard.reports['loan-issue-reports'],
              },
            ],
          },
          {
            title: t('other reports'),
            path: paths.dashboard.otherReports.root,
            icon: ICONS.otherReports,
            children: [
              {
                title: t('other loan all branch reports'),
                path: paths.dashboard.otherReports['other-loan-all-branch-reports'],
              },
              {
                title: t('other loan close reports'),
                path: paths.dashboard.otherReports['other-loan-close-reports'],
              },
              {
                title: t('other loan interest'),
                path: paths.dashboard.otherReports['other-loan-interest-reports'],
              },
              {
                title: t('other interest entry reports'),
                path: paths.dashboard.otherReports['other-interest-entry-reports'],
              },
              {
                title: t('other loan daily reports'),
                path: paths.dashboard.otherReports['other-loan-daily-reports'],
              },
              {
                title: t('total all in out loan reports'),
                path: paths.dashboard.otherReports['total-all-in-out-loan-reports'],
              },
            ],
          },
        ],
      },
      {
        subheader: t('config'),
        items: [
          {
            title: t('Accounting'),
            path: paths.dashboard.cashAndBank.root,
            icon: ICONS.cashAndBank,
            children: [
              {
                title: t('cash in'),
                path: paths.dashboard.cashAndBank.cashIn,
              },
              {
                title: t('bank account'),
                path: paths.dashboard.cashAndBank.bankAccount,
              },
              {
                title: t('Expence'),
                path: paths.dashboard.cashAndBank.expense.list,
              },
              {
                title: t('payment in out'),
                path: paths.dashboard.cashAndBank['payment-in-out'].list,
              },
              {
                title: t('Charge in/out'),
                path: paths.dashboard.cashAndBank.chargeInOut.list,
              },
              {
                title: t('day book'),
                path: paths.dashboard.cashAndBank['day-book'].list,
              },{
                title: t('all transaction'),
                path: paths.dashboard.cashAndBank['all-transaction'].list,
              },
            ],
          },
          {
            title: t('setting'),
            path: paths.dashboard.setting,
            icon: ICONS.setting,
          },
        ],
      },
    ],
    [t]
  );

  const module =
    user?.role !== 'Admin' &&
    data
      ?.map((section) => {
        if (!section) return null;
        return {
          subheader: section.subheader,
          items: section.items
            ?.map((item) => {
              const hasPermission = configs?.permissions?.[user?.role]?.sections?.includes(
                item.title
              );

              if (item.children && configs?.permissions) {
                item.children = item.children.filter((child) => {
                  const childPermission =
                    configs?.permissions?.[user?.role]?.responsibilities[child.title];
                  return childPermission === true;
                });
              }

              return hasPermission || (item.children && item.children.length > 0) ? item : null;
            })
            .filter(Boolean),
        };
      })
      .filter(Boolean);
  const moduleFilter =
    user?.role !== 'Admin' && module?.filter((section) => section?.items?.length > 0);

  return user?.role === 'Admin' ? data : moduleFilter;
}
