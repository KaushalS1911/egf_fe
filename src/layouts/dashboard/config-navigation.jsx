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
  inquiry: <Iconify icon='heroicons-solid:newspaper' sx={{ width: 1, height: 1 }} />,
  customer: icon('ic_user'), // Customer icon (more unique icon with a hat for distinctiveness)
  employee: <Iconify icon='clarity:employee-solid' sx={{ width: 1, height: 1 }} />, // Employee icon (briefcase with person for professionalism)
  scheme: <Iconify icon='bxs:offer' sx={{ width: 1, height: 1 }} />, // Scheme icon (lightbulb to represent innovative ideas)
  carat: <Iconify icon='mdi:gold' sx={{ width: 1, height: 1 }} />, // Carat icon (cleaner diamond representation)
  loanType: <Iconify icon='mdi:currency-usd-outline' sx={{ width: 1, height: 1 }} />, // Loan Type icon (dollar currency symbol)
  property: <Iconify icon='clarity:building-solid' sx={{ width: 1, height: 1 }} />, // Property icon (cityscape for real estate/property)
  penalty: <Iconify icon='icon-park-outline:gavel' sx={{ width: 1, height: 1 }} />, // Penalty icon (justice scale for penalties and fines)
  loanissue: <Iconify icon='streamline:bank-solid' />, // Loan Issue icon (bank transfer symbol for issuing loans)
  disburse: <Iconify icon='mdi:bank-transfer-out' sx={{ width: '30px', height: '30px' }} />, // Loan Issue icon (bank transfer symbol for issuing loans)
  reminder: <Iconify icon='carbon:reminder' sx={{ width: 1, height: 1 }} />, // Loan Issue icon (bank transfer symbol for issuing loans)
  setting: <Iconify icon='solar:settings-bold-duotone' width={24} />,
  goldLoanCalculator: <Iconify icon='icon-park-solid:calculator' width={24} />,
  loanPayHistory: <Iconify icon='cuida:history-outline' width={24} />,
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();
  const { user } = useAuthContext();

  const data = useMemo(
    () => [

      // MASTER
      // ----------------------------------------------------------------------
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

          // SCHEME
          {
            title: t('scheme'),
            path: paths.dashboard.scheme.root,
            icon: ICONS.scheme,
          },
          // CREATE
          {
            title: t('carat'),
            path: paths.dashboard.carat.root,
            icon: ICONS.carat,
          },


          // PROPERTY
          {
            title: t('property'),
            path: paths.dashboard.property.root,
            icon: ICONS.property,
          },
          // PENALTY
          {
            title: t('penalty'),
            path: paths.dashboard.penalty.root,
            icon: ICONS.penalty,
          },

        ],
      },
      {
        subheader: t('Transaction'),
        items: [
          {
            title: t('Loan issue'),
            path: paths.dashboard.loanissue.root,
            icon: ICONS.loanissue,
          },

          // DISBURSE
          {
            title: t('disburse'),
            path: paths.dashboard.disburse.root,
            icon: ICONS.disburse,
          },
          // LOAN PAY HISTORY
          {
            title: t('Loan Pay History'),
            path: paths.dashboard.loanPayHistory.list,
            icon: ICONS.loanPayHistory,
          },
        ],
      }, {
        subheader: t('Loan Utilities'),
        items: [

          // REMINDER
          {
            title: t('reminder'),
            path: paths.dashboard.reminder.list,
            icon: ICONS.reminder,
          },

          // GOLD LOAN CALCULATOR
          {
            title: t('Gold Loan Calculator'),
            path: paths.dashboard.goldLoanCalculator,
            icon: ICONS.goldLoanCalculator,
          },
          // {
          //   title: t('Reports'),
          //   path: paths.dashboard.loanissue.root,
          //   icon: ICONS.user,
          //   children: [
          //     { title: t('all branch loan summary'), path: paths.dashboard.loanissue.root },
          //     { title: t('branch vise loan closing report'), path: paths.dashboard.loanissue.new },
          //     // { title: t('daily report'), path: paths.dashboard.loanissue.edit(id) },
          //   ],
          // },
        ],

      },
      {
        subheader: t('config'),
        items: [
          {
            title: t('setting'),
            path: paths.dashboard.setting,
            icon: ICONS.setting,
          },
        ],
      },
    ],
    [t],
  );
  const data1 = useMemo(
    () => [

      // MASTER
      // ----------------------------------------------------------------------
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

          // SCHEME
          {
            title: t('scheme'),
            path: paths.dashboard.scheme.root,
            icon: ICONS.scheme,
          },
          // CREATE
          {
            title: t('carat'),
            path: paths.dashboard.carat.root,
            icon: ICONS.carat,
          },


          // PROPERTY
          {
            title: t('property'),
            path: paths.dashboard.property.root,
            icon: ICONS.property,
          },
          // PENALTY
          {
            title: t('penalty'),
            path: paths.dashboard.penalty.root,
            icon: ICONS.penalty,
          },

        ],
      },
      {
        subheader: t('Transaction'),
        items: [
          {
            title: t('Loan issue'),
            path: paths.dashboard.loanissue.root,
            icon: ICONS.loanissue,
          },

          // DISBURSE
          {
            title: t('disburse'),
            path: paths.dashboard.disburse.root,
            icon: ICONS.disburse,
          },
          // LOAN PAY HISTORY
          {
            title: t('Loan Pay History'),
            path: paths.dashboard.loanPayHistory.list,
            icon: ICONS.loanPayHistory,
          },
        ],
      }, {
        subheader: t('Loan Utilities'),
        items: [

          // REMINDER
          {
            title: t('reminder'),
            path: paths.dashboard.reminder.list,
            icon: ICONS.reminder,
          },

          // GOLD LOAN CALCULATOR
          {
            title: t('Gold Loan Calculator'),
            path: paths.dashboard.goldLoanCalculator,
            icon: ICONS.goldLoanCalculator,
          },
        ],
      },
    ],
    [t],
  );

  return user?.role === 'Admin' ? data : data1;
}
