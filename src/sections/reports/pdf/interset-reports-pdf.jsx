import React, { useMemo } from 'react';
import { Page, View, Text, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { fDate } from 'src/utils/format-time.js';
import InvoiceHeader from '../../../components/invoise/invoice-header.jsx';
import { TableCell } from '@mui/material';
import { differenceInDays } from 'date-fns';

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        page: {
          fontFamily: 'Roboto',
          backgroundColor: '#ffff',
          fontSize: 8,
        },
        subHeading: {
          fontWeight: 'bold',
          fontSize: 16,
          textAlign: 'center',
          marginTop: 10,
        },
        table: {
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderWidth: 1,
          borderColor: '#b1b0b0',
        },
        tableRow: {
          flexDirection: 'row',
          minHeight: 22,
          borderBottomWidth: 0.5,
          borderBottomColor: '#c7c6c6',
          pageBreakInside: 'avoid',
        },
        lastTableRow: {
          borderBottomWidth: 0,
        },
        tableHeader: {
          backgroundColor: '#5B9BD4',
          fontWeight: 'bold',
          color: '#000',
          textAlign: 'center',
        },
        tableCell: {
          padding: 5,
          borderRightWidth: 0.5,
          borderRightColor: '#b1b0b0',
          textAlign: 'center',
        },
        numericCell: {
          textAlign: 'right',
        },
        tableCellLast: {
          borderRightWidth: 0,
        },
        alternateRow: {
          backgroundColor: '#F2F2F2',
        },
        termsAndConditionsHeaders: {
          color: '#232C4B',
          borderBottom: '1px solid #232C4B',
          fontWeight: 'bold',
          textWrap: 'nowrap',
          fontSize: '12px',
          textAlign: 'center',
          paddingVertical: 5,
        },
        row: {
          flexDirection: 'row',
          marginVertical: 2,
        },
        subHeading2: {
          fontWeight: '600',
          fontSize: 10,
          flex: 0.7,
        },
        colon: {
          fontSize: 10,
          fontWeight: '600',
          marginHorizontal: 3,
        },
        subText: {
          fontSize: 10,
          flex: 2,
        },
      }),
    []
  );

export default function IntersetReportsPdf({ selectedBranch, configs, data, filterData }) {
  const styles = useStyles();
  const headers = [
    { label: '#', flex: 0.3 },
    { label: 'Loan No', flex: 2.5 },
    { label: 'Customer Name', flex: 5 },
    { label: 'Loan Amt', flex: 1 },
    { label: 'Part Loan Amt ', flex: 1.2 },
    { label: 'Int. Loan Amt', flex: 1.2 },
    { label: 'Rate', flex: 0.5 },
    { label: 'con. Charge', flex: 0.5 },
    { label: 'Int. Amt', flex: 1.2 },
    { label: 'Con. Amt', flex: 1 },
    { label: 'Penalty', flex: 1.1 },
    { label: 'Total Int. Amt', flex: 1.2 },
    { label: 'Last Int. Pay Date', flex: 1.2 },
    { label: 'Pending Day', flex: 0.6 },
    { label: 'pending Int. Amt', flex: 1.2 },
  ];

  const rowsPerPage = 18;
  const pages = [];
  let currentPageRows = [];
  data.forEach((row, index) => {
    const isAlternateRow = index % 2 !== 0;
    const isLastRow = index === data.length - 1;

    currentPageRows.push(
      <View
        key={index}
        style={[
          styles.tableRow,
          isAlternateRow ? styles.alternateRow : {},
          isLastRow ? styles.lastTableRow : {},
        ]}
        wrap={false}
      >
        <Text style={[styles.tableCell, { flex: 0.3 }]}>{index + 1}</Text>
        <Text style={[styles.tableCell, { flex: 2.5 }]}>{row.loanDetails.loanNo}</Text>
        <Text
          style={[styles.tableCell, { flex: 5, fontSize: 7 }]}
        >{`${row.loanDetails.customer.firstName} ${row.loanDetails.customer.middleName} ${row.loanDetails.customer.lastName} `}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{row.loanDetails.loanAmount}</Text>
        <Text style={[styles.tableCell, { flex: 1.2 }]}>
          {(row.loanDetails.loanAmount - row.loanDetails.interestLoanAmount).toFixed(2)}
        </Text>
        <Text style={[styles.tableCell, { flex: 1.2 }]}>
          {row.loanDetails.interestLoanAmount.toFixed(2)}
        </Text>
        <Text style={[styles.tableCell, { flex: 0.5 }]}>
          {row.loanDetails.scheme.interestRate > 1.5 ? 1.5 : row.loanDetails.scheme.interestRate}
        </Text>
        <Text style={[styles.tableCell, { flex: 0.5 }]}>{row.loanDetails.consultingCharge}</Text>
        <Text style={[styles.tableCell, { flex: 1.2 }]}>
          {row.totalConsultingCharge.toFixed(2)}
        </Text>
        <Text style={[styles.tableCell, { flex: 1.1 }]}>{row.totalPenalty.toFixed(2)}</Text>
        <Text style={[styles.tableCell, { flex: 1.2 }]}>{row.totalInterestAmount.toFixed(2)}</Text>
        <Text style={[styles.tableCell, { flex: 1.2 }]}>
          {fDate(row.loanDetails.lastInstallmentDate)}
        </Text>
        <Text style={[styles.tableCell, { flex: 0.6 }]}>
          {row.loanDetails.lastInstallmentDate
            ? Math.max(
                0,
                differenceInDays(new Date(), new Date(row.loanDetails.lastInstallmentDate))
              )
            : '-'}
        </Text>
        <Text style={[styles.tableCell, { flex: 1.2 }]}>Pen int am</Text>
      </View>
    );

    if ((index + 1) % rowsPerPage === 0 || index === data.length - 1) {
      const isFirstPage = pages.length === 0;
      pages.push(
        <Page key={pages.length} size="A4" style={styles.page} orientation={'landscape'}>
          {isFirstPage && (
            <>
              <InvoiceHeader selectedBranch={selectedBranch} configs={configs} landscape={true} />
              <View
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  marginHorizontal: 15,
                }}
              >
                <Text style={styles.termsAndConditionsHeaders}>STATEMENT </Text>
              </View>{' '}
            </>
          )}
          <View style={{ padding: '12px' }}>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                {headers.map((header, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.tableCell,
                      { flex: header.flex },
                      i === headers.length - 1 ? styles.tableCellLast : {},
                    ]}
                  >
                    {header.label}
                  </Text>
                ))}
              </View>
              {currentPageRows}
            </View>
          </View>
        </Page>
      );
      currentPageRows = [];
    }
  });

  return <Document>{pages}</Document>;
}
