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
          // padding: 40, // Add some padding to the page
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

export default function AllBranchLoanSummaryPdf({ selectedBranch, configs, loans, filterData }) {
  const styles = useStyles();
  const headers = [
    { label: '#', flex: 0.3 },
    { label: 'Loan No', flex: 2.5 },
    { label: 'Customer Name', flex: 4.5 },
    { label: 'Contact', flex: 1.4 },
    { label: 'Int%', flex: 0.5 },
    { label: 'Other Int%', flex: 0.8 },
    { label: 'Issue Date', flex: 1.5 },
    { label: 'Loan Amt', flex: 1 },
    { label: 'Last Amt Pay Date', flex: 1.3 },
    { label: 'Loan Amt Pay', flex: 1 },
    { label: 'Loan Int. Amt', flex: 1 },
    { label: 'Last Int. Pay Date', flex: 1.3 },
    { label: 'Total Pay Int.', flex: 1.5 },
    { label: 'Day', flex: 0.5 },
    { label: 'Pending Int.', flex: 1 },
    { label: 'Next Int. Pay Date', flex: 1.3 },
  ];
  const dataFilter = [
    { value: filterData.issuedBy.name, label: 'Issued By' },
    { value: filterData.branch.name, label: 'Branch' },
    { value: fDate(filterData.startDate), label: 'Start Date' },
    { value: fDate(filterData.endDate), label: 'End Date' },
    { value: fDate(new Date()), label: 'Date' },
  ];
  const rowsPerPage = 18;
  const pages = [];
  let currentPageRows = [];
  console.log(dataFilter);
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
        <Text style={[styles.tableCell, { flex: 0.3 }]}>{index + 1}</Text>
        <Text style={[styles.tableCell, { flex: 2.5 }]}>{row.loanNo}</Text>
        <Text style={[styles.tableCell, { flex: 4.5, fontSize: 7, padding: 5 }]}>
          {`${row.customer.firstName} ${row.customer.middleName} ${row.customer.lastName}`}
        </Text>
        <Text style={[styles.tableCell, { flex: 1.4 }]}>{row.customer.contact}</Text>
        <Text style={[styles.tableCell, { flex: 0.5 }]}>{row.scheme.interestRate}</Text>
        <Text style={[styles.tableCell, { flex: 0.8 }]}>{row.consultingCharge}</Text>
        <Text style={[styles.tableCell, { flex: 1.5 }]}>{fDate(row.issueDate)}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{row.loanAmount}</Text>
        <Text style={[styles.tableCell, { flex: 1.3 }]}>
          {fDate(row.lastInstallmentDate) || '-'}
        </Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>
          {row.loanAmount - row.interestLoanAmount || '-'}
        </Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{row.interestLoanAmount || '-'}</Text>
        <Text style={[styles.tableCell, { flex: 1.3 }]}>
          {fDate(row.lastInstallmentDate) || '-'}
        </Text>
        <Text style={[styles.tableCell, { flex: 1.5 }]}>Total Pay Int.</Text>
        <Text style={[styles.tableCell, { flex: 0.5 }]}>113</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>947.34</Text>
        <Text style={[styles.tableCell, styles.tableCellLast, { flex: 1.3 }]}>
          {fDate(row.nextInstallmentDate)}
        </Text>
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
                <Text style={styles.termsAndConditionsHeaders}>
                  BRANCH WISE LOAN CLOSING REPORT{' '}
                </Text>
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
