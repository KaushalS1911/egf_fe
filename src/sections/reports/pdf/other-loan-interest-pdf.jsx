import React, { useMemo } from 'react';
import { Page, View, Text, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { fDate } from 'src/utils/format-time.js';
import InvoiceHeader from '../../../components/invoise/invoice-header.jsx';

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
          position: 'relative',
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

export default function OtherLoanInterestPdf({ selectedBranch, configs, loans, filterData }) {
  const styles = useStyles();
  const headers = [
    { label: '#', flex: 0.1 },
    { label: 'Loan No', flex: 2 },
    { label: 'Customer Name', flex: 3 },
    { label: 'Other name', flex: 1 },
    { label: 'Other no.', flex: 1.1 },
    { label: 'int rate', flex: 1 },
    { label: 'Open date', flex: 1 },
    { label: 'Open loan amt', flex: 1 },
    { label: 'charge', flex: 1 },
    { label: 'Day', flex: 0.3 },
    { label: 'Int.', flex: 0.3 },
    { label: 'Last int. pay date', flex: 1 },
    { label: 'Pen. day', flex: 0.3 },
    { label: 'Pending int.', flex: 1 },
    { label: 'Next int. pay date', flex: 1 },
  ];
  const dataFilter = [
    { value: fDate(filterData.startDate), label: 'Start Date' },
    { value: fDate(filterData.endDate), label: 'End Date' },
    { value: fDate(new Date()), label: 'Date' },
  ];
  const rowsPerPage = 18;
  const pages = [];
  let currentPageRows = [];

  loans.forEach((row, index) => {
    const isAlternateRow = index % 2 !== 0;
    const isLastRow = index === loans.length - 1;

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
        <Text style={[styles.tableCell, { flex: 0.1 }]}>{index + 1}</Text>
        <Text style={[styles.tableCell, { flex: 2 }]}>{row.loan.loanNo}</Text>
        <Text style={[styles.tableCell, { flex: 3, fontSize: 7, padding: 5 }]}>
          {`${row.loan.customer.firstName} ${row.loan.customer.middleName}\n ${row.loan.customer.lastName}`}
        </Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{row.otherName}</Text>
        <Text style={[styles.tableCell, { flex: 1.1 }]}>{row.otherNumber}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{row.percentage}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(row.date)}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{row.amount}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{(row.otherCharge || 0).toFixed(2)}</Text>
        <Text style={[styles.tableCell, { flex: 0.3 }]}>{row.day > 0 ? row.day : 0}</Text>
        <Text style={[styles.tableCell, { flex: 0.3 }]}>{row.loan.scheme.interestRate}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(row.loan.lastInterestPayDate)}</Text>
        <Text style={[styles.tableCell, { flex: 0.3 }]}>
          {row.pendingDay > 0 ? row.pendingDay : 0}
        </Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{(row.pendingInterest || 0).toFixed(2)}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(row.loan.nextInstallmentDate)}</Text>
      </View>
    );

    if ((index + 1) % rowsPerPage === 0 || index === loans.length - 1) {
      const isFirstPage = pages.length === 0;
      pages.push(
        <Page key={pages.length} size="A4" style={styles.page} orientation="landscape">
          {isFirstPage && (
            <>
              <InvoiceHeader selectedBranch={selectedBranch} configs={configs} landscape={true} />
              <View style={{ position: 'absolute', top: 20, right: 5, width: 200 }}>
                {dataFilter.map((item, index) => (
                  <View style={styles.row}>
                    <Text style={styles.subHeading2}>{item.label || '-'}</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{item.value || '-'}</Text>
                  </View>
                ))}
              </View>
              <View
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  marginHorizontal: 15,
                  marginTop: 10,
                }}
              >
                <Text style={styles.termsAndConditionsHeaders}>OTHER LOAN INTEREST REPORTS</Text>
              </View>{' '}
            </>
          )}
          <View style={{ flexGrow: 1, padding: '12px' }}>
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
