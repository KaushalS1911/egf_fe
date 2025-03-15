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
          fontSize: 6.5,
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

export default function TotalInOutLoanReports({ selectedBranch, configs, loans, filterData }) {
  const styles = useStyles();
  const headers = [
    { label: '#', flex: 0.2 },
    { label: 'Loan No', flex: 2 },
    { label: 'Issue date', flex: 1 },
    { label: 'Customer name', flex: 3 },
    { label: 'Total loan amt', flex: 1 },
    { label: 'Part loan amt', flex: 1 },
    { label: 'Int. loan amt', flex: 1 },
    { label: 'Total wt', flex: 0.5 },
    { label: 'Net wt', flex: 0.5 },
    { label: 'Int. rate', flex: 0.4 },
    { label: 'Total int.amt', flex: 1 },
    { label: 'Other no', flex: 1 },
    { label: 'Date', flex: 1 },
    { label: 'Other name', flex: 0.6 },
    { label: 'Other Loan amt', flex: 1 },
    { label: 'Gross wt', flex: 1 },
    { label: 'Other int(%)', flex: 1 },
    { label: 'Other int amt', flex: 1 },
    { label: 'Diff loan amt', flex: 1 },
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
        <Text style={[styles.tableCell, { flex: 0.2 }]}>{index + 1}</Text>
        <Text style={[styles.tableCell, { flex: 2 }]}>{row.loan.loanNo}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(row.loan.issueDate)}</Text>
        <Text
          style={[styles.tableCell, { flex: 3, fontSize: 6, padding: 5 }]}
        >{`${row.loan.customer.firstName} ${row.loan.customer.middleName} ${row.loan.customer.lastName}`}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>
          {Number(row.loan.loanAmount).toFixed(2)}
        </Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>
          {Number(row.loan.loanAmount - row.loan.interestLoanAmount).toFixed(2)}
        </Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>
          {Number(row.loan.interestLoanAmount).toFixed(2)}
        </Text>
        <Text style={[styles.tableCell, { flex: 0.5 }]}>
          {row.loan.propertyDetails
            .reduce((prev, next) => prev + (Number(next?.totalWeight) || 0), 0)
            .toFixed(2)}
        </Text>
        <Text style={[styles.tableCell, { flex: 0.5 }]}>
          {row.loan.propertyDetails
            .reduce((prev, next) => prev + (Number(next?.netWeight) || 0), 0)
            .toFixed(2)}
        </Text>
        <Text style={[styles.tableCell, { flex: 0.4 }]}>
          {Number(row.loan.scheme.interestRate).toFixed(2)}
        </Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>
          {Number(row.totalOtherInterestAmount).toFixed(2)}
        </Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{row.otherNumber}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(new Date())}</Text>
        <Text style={[styles.tableCell, { flex: 0.6 }]}>{row.otherName}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>
          {Number(row.loan.loanAmount).toFixed(2)}
        </Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>
          {row.loan.propertyDetails
            .reduce((prev, next) => prev + (Number(next?.grossWeight) || 0), 0)
            .toFixed(2)}
        </Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{Number(row.rate).toFixed(2)}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>
          {Number(row.totalOtherInterestAmount).toFixed(2)}
        </Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{Number(100000).toFixed(2)}</Text>
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
                <Text style={styles.termsAndConditionsHeaders}>TOTAL ALL IN OUT LOAN REPORTS</Text>
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
