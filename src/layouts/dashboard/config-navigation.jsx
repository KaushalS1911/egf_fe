import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
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
  loanissue: <Iconify icon='streamline:bank-solid' sx={{ width: 1, height: 1 }} />, // Loan Issue icon (bank transfer symbol for issuing loans)
  reminder: <Iconify icon='carbon:reminder' sx={{ width: 1, height: 1 }} />, // Loan Issue icon (bank transfer symbol for issuing loans)
  setting: <Iconify icon='solar:settings-bold-duotone' width={24} />,
  goldLoanCalculator: <Iconify icon='icon-park-solid:calculator' width={24} />,
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      // {
      //   subheader: t('overview'),
      //   items: [
      //     {
      //       title: t('app'),
      //       path: paths.dashboard.root,
      //       icon: ICONS.dashboard,
      //     },
      //     {
      //       title: t('ecommerce'),
      //       path: paths.dashboard.general.ecommerce,
      //       icon: ICONS.ecommerce,
      //     },
      //     {
      //       title: t('analytics'),
      //       path: paths.dashboard.general.analytics,
      //       icon: ICONS.analytics,
      //     },
      //     {
      //       title: t('banking'),
      //       path: paths.dashboard.general.banking,
      //       icon: ICONS.banking,
      //     },
      //     {
      //       title: t('booking'),
      //       path: paths.dashboard.general.booking,
      //       icon: ICONS.booking,
      //     },
      //     {
      //       title: t('file'),
      //       path: paths.dashboard.general.file,
      //       icon: ICONS.file,
      //     },
      //   ],
      // },

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

          // PRODUCT
          // {
          //   title: t('product'),
          //   path: paths.dashboard.product.root,
          //   icon: ICONS.product,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.product.root },
          //     {
          //       title: t('details'),
          //       path: paths.dashboard.product.demo.details,
          //     },
          //     { title: t('create'), path: paths.dashboard.product.new },
          //     { title: t('edit'), path: paths.dashboard.product.demo.edit },
          //   ],
          // },
          //
          // // ORDER
          // {
          //   title: t('order'),
          //   path: paths.dashboard.order.root,
          //   icon: ICONS.order,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.order.root },
          //     { title: t('details'), path: paths.dashboard.order.demo.details },
          //   ],
          // },
          //
          // // INVOICE
          // {
          //   title: t('invoice'),
          //   path: paths.dashboard.invoice.root,
          //   icon: ICONS.invoice,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.invoice.root },
          //     {
          //       title: t('details'),
          //       path: paths.dashboard.invoice.demo.details,
          //     },
          //     { title: t('create'), path: paths.dashboard.invoice.new },
          //     { title: t('edit'), path: paths.dashboard.invoice.demo.edit },
          //   ],
          // },
          //
          // // BLOG
          // {
          //   title: t('blog'),
          //   path: paths.dashboard.post.root,
          //   icon: ICONS.blog,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.post.root },
          //     { title: t('details'), path: paths.dashboard.post.demo.details },
          //     { title: t('create'), path: paths.dashboard.post.new },
          //     { title: t('edit'), path: paths.dashboard.post.demo.edit },
          //   ],
          // },
          //
          // // JOB
          // {
          //   title: t('job'),
          //   path: paths.dashboard.job.root,
          //   icon: ICONS.job,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.job.root },
          //     { title: t('details'), path: paths.dashboard.job.demo.details },
          //     { title: t('create'), path: paths.dashboard.job.new },
          //     { title: t('edit'), path: paths.dashboard.job.demo.edit },
          //   ],
          // },
          //
          // // TOUR
          // {
          //   title: t('tour'),
          //   path: paths.dashboard.tour.root,
          //   icon: ICONS.tour,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.tour.root },
          //     { title: t('details'), path: paths.dashboard.tour.demo.details },
          //     { title: t('create'), path: paths.dashboard.tour.new },
          //     { title: t('edit'), path: paths.dashboard.tour.demo.edit },
          //   ],
          // },
          //
          // // FILE MANAGER
          // {
          //   title: t('file_manager'),
          //   path: paths.dashboard.fileManager,
          //   icon: ICONS.folder,
          // },
          //
          // // MAIL
          // {
          //   title: t('mail'),
          //   path: paths.dashboard.mail,
          //   icon: ICONS.mail,
          //   info: <Label color='error'>+32</Label>,
          // },
          //
          // // CHAT
          // {
          //   title: t('chat'),
          //   path: paths.dashboard.chat,
          //   icon: ICONS.chat,
          // },

          // CALENDAR
          // {
          //   title: t('calendar'),
          //   path: paths.dashboard.calendar,
          //   icon: ICONS.calendar,
          // },

          // KANBAN
          // {
          //   title: t('kanban'),
          //   path: paths.dashboard.kanban,
          //   icon: ICONS.kanban,
          // },

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
            icon: ICONS.user,
          },
          // REMINDER
          {
            title: t('reminder'),
            path: paths.dashboard.reminder.list,
            icon: ICONS.reminder,
          },
          // LOAN PAY HISTORY
          {
            title: t('Loan Pay History'),
            path: paths.dashboard.loanPayHistory.list,
            icon: ICONS.user,
          },
          // GOLD LOAN CALCULATOR
          {
            title: t('Gold Loan Calculator'),
            path: paths.dashboard.goldLoanCalculator,
            icon: ICONS.goldLoanCalculator,
          },
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

  return data;
}
