import React, { useMemo, useState } from 'react';
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
          minHeight: 20,
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
          padding: '4px 6px',
          borderRightWidth: 0.5,
          borderRightColor: '#b1b0b0',
          textAlign: 'center',
          fontSize: 6.5,
          overflow: 'hidden',
        },
        numericCell: {
          textAlign: 'center',
        },
        textCell: {
          textAlign: 'left',
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
        mergedCell: {
          padding: '4px 6px',
          borderRightWidth: 0.5,
          borderRightColor: '#b1b0b0',
          textAlign: 'center',
          fontSize: 6.5,
          overflow: 'hidden',
          backgroundColor: '#F4F6F8',
          minHeight: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }),
    []
  );

export default function TotalInOutLoanReports({
  selectedBranch,
  configs,
  loans,
  filterData,
  total,
}) {
  const styles = useStyles();

  const {
    loanAmount,
    partLoanAmount,
    interestLoanAmount,
    totalWeight,
    netWeight,
    averageInterestRate,
    totalInterestAmount,
    otherLoanAmount,
    amount,
    grossWeight,
    averagePercentage,
    totalOtherInterestAmount,
    diffLoanAmount,
    diffInterestAmount,
  } = total;

  const headers = [
    { label: '#', flex: 0.1, width: 40 },
    { label: 'Loan No', flex: 2, width: 90 },
    { label: 'Issue date', flex: 1, width: 80 },
    { label: 'Customer name', flex: 2, width: 130 },
    { label: 'Total loan amt', flex: 1, width: 90 },
    { label: 'Part loan amt', flex: 1, width: 90 },
    { label: 'Int. loan amt', flex: 1, width: 90 },
    { label: 'Total wt', flex: 0.5, width: 70 },
    { label: 'Net wt', flex: 0.5, width: 70 },
    { label: 'Int. rate', flex: 0.4, width: 60 },
    { label: 'Total int.amt', flex: 1, width: 90 },
    { label: 'Other no', flex: 1.2, width: 90 },
    { label: 'Date', flex: 1, width: 80 },
    { label: 'Other name', flex: 0.4, width: 90 },
    { label: 'Other Loan amt', flex: 1, width: 90 },
    { label: 'Gross wt', flex: 0.5, width: 70 },
    { label: 'Net wt', flex: 0.5, width: 70 },
    { label: 'Other int(%)', flex: 0.5, width: 70 },
    { label: 'Other int amt', flex: 1, width: 90 },
    { label: 'Diff loan amt', flex: 1, width: 90 },
    { label: 'Diff int. amt', flex: 1, width: 90 },
  ];

  const dataFilter = [
    { value: fDate(filterData.startDate), label: 'Start Date' },
    { value: fDate(filterData.endDate), label: 'End Date' },
    { value: fDate(new Date()), label: 'Date' },
  ];

  const rowsPerPage = 18;
  const pages = [];
  let currentPageRows = [];
  let currentRowCount = 0;

  // Process each loan group
  Object.entries(loans).forEach(([loanId, otherLoans], loanIndex) => {
    const firstRow = otherLoans[0];
    const rowSpan = otherLoans.length;

    // Process each row in the loan group
    otherLoans.forEach((row, index) => {
      const isAlternateRow = currentRowCount % 2 !== 0;
      const isLastRow = currentRowCount === Object.values(loans).flat().length - 1;

      currentPageRows.push(
        <View
          key={`${loanId}-${index}`}
          style={[
            styles.tableRow,
            isAlternateRow ? styles.alternateRow : {},
            isLastRow ? styles.lastTableRow : {},
          ]}
          wrap={false}
        >
          {/* Initial loan details - show in first row, empty cells in subsequent rows */}
          {index === 0 ? (
            <>
              <Text style={[styles.tableCell, { flex: 0.1 }, styles.numericCell]}>
                {loanIndex + 1}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }, styles.textCell]}>
                {row.loan.loanNo}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }, styles.numericCell]}>
                {fDate(row.loan.issueDate)}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }, styles.textCell]}>
                {`${row.loan.customer.firstName} ${row.loan.customer.middleName} ${row.loan.customer.lastName}`}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }, styles.numericCell]}>
                {row.loan.loanAmount}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }, styles.numericCell]}>
                {(row.loan.loanAmount - row.loan.interestLoanAmount).toFixed(2)}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }, styles.numericCell]}>
                {row.loan.interestLoanAmount.toFixed(2)}
              </Text>
              <Text style={[styles.tableCell, { flex: 0.5 }, styles.numericCell]}>
                {row.loan.propertyDetails
                  .reduce((prev, next) => prev + (Number(next?.totalWeight) || 0), 0)
                  .toFixed(2)}
              </Text>
              <Text style={[styles.tableCell, { flex: 0.5 }, styles.numericCell]}>
                {row.loan.propertyDetails
                  .reduce((prev, next) => prev + (Number(next?.netWeight) || 0), 0)
                  .toFixed(2)}
              </Text>
              <Text style={[styles.tableCell, { flex: 0.4 }, styles.numericCell]}>
                {row.loan.scheme.interestRate.toFixed(2)}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }, styles.numericCell]}>
                {row.totalInterestAmount.toFixed(2)}
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.tableCell, { flex: 0.1, backgroundColor: '#F4F6F8' }]}> </Text>
              <Text style={[styles.tableCell, { flex: 2, backgroundColor: '#F4F6F8' }]}> </Text>
              <Text style={[styles.tableCell, { flex: 1, backgroundColor: '#F4F6F8' }]}> </Text>
              <Text style={[styles.tableCell, { flex: 2, backgroundColor: '#F4F6F8' }]}> </Text>
              <Text style={[styles.tableCell, { flex: 1, backgroundColor: '#F4F6F8' }]}> </Text>
              <Text style={[styles.tableCell, { flex: 1, backgroundColor: '#F4F6F8' }]}> </Text>
              <Text style={[styles.tableCell, { flex: 1, backgroundColor: '#F4F6F8' }]}> </Text>
              <Text style={[styles.tableCell, { flex: 0.5, backgroundColor: '#F4F6F8' }]}> </Text>
              <Text style={[styles.tableCell, { flex: 0.5, backgroundColor: '#F4F6F8' }]}> </Text>
              <Text style={[styles.tableCell, { flex: 0.4, backgroundColor: '#F4F6F8' }]}> </Text>
              <Text style={[styles.tableCell, { flex: 1, backgroundColor: '#F4F6F8' }]}> </Text>
            </>
          )}

          {/* Other loan details */}
          <Text style={[styles.tableCell, { flex: 1.2 }, styles.textCell]}>{row.otherNumber}</Text>
          <Text style={[styles.tableCell, { flex: 1 }, styles.numericCell]}>{fDate(row.date)}</Text>
          <Text style={[styles.tableCell, { flex: 0.4 }, styles.textCell]}>{row.otherName}</Text>
          <Text style={[styles.tableCell, { flex: 1 }, styles.numericCell]}>
            {Number(row.amount).toFixed(2)}
          </Text>
          <Text style={[styles.tableCell, { flex: 0.5 }, styles.numericCell]}>{row.grossWt}</Text>
          <Text style={[styles.tableCell, { flex: 0.5 }, styles.numericCell]}>{row.netWt}</Text>
          <Text style={[styles.tableCell, { flex: 0.5 }, styles.numericCell]}>
            {Number(row.percentage).toFixed(2)}
          </Text>
          <Text style={[styles.tableCell, { flex: 1 }, styles.numericCell]}>
            {Number(row.totalOtherInterestAmount).toFixed(2)}
          </Text>
          <Text style={[styles.tableCell, { flex: 1 }, styles.numericCell]}>
            {(row.amount - row.loan.interestLoanAmount).toFixed(2)}
          </Text>
          <Text style={[styles.tableCell, { flex: 1 }, styles.numericCell]}>
            {(row.totalInterestAmount - row.totalOtherInterestAmount).toFixed(2)}
          </Text>
        </View>
      );

      currentRowCount++;

      // Check if we need to create a new page
      if (
        currentRowCount % rowsPerPage === 0 ||
        currentRowCount === Object.values(loans).flat().length
      ) {
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
                    TOTAL ALL IN OUT LOAN REPORTS
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
                {currentRowCount === Object.values(loans).flat().length && (
                  <View
                    style={[
                      styles.tableRow,
                      { backgroundColor: '#e8f0fe', color: '#1a237e', fontWeight: 'bold' },
                    ]}
                  >
                    <Text style={[styles.tableCell, { flex: 0.1 }]}></Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>TOTAL</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}></Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{loanAmount.toFixed(0)}</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{partLoanAmount.toFixed(0)}</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      {interestLoanAmount.toFixed(2)}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 0.5 }]}>{totalWeight.toFixed(0)}</Text>
                    <Text style={[styles.tableCell, { flex: 0.5 }]}>{netWeight.toFixed(0)}</Text>
                    <Text style={[styles.tableCell, { flex: 0.4 }]}>
                      {averageInterestRate.toFixed(0)}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      {totalInterestAmount.toFixed(0)}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1.2 }]}></Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                    <Text style={[styles.tableCell, { flex: 0.4 }]}></Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      {otherLoanAmount.toFixed(0)}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 0.5 }]}>{grossWeight.toFixed(0)}</Text>
                    <Text style={[styles.tableCell, { flex: 0.5 }]}>{netWeight.toFixed(0)}</Text>
                    <Text style={[styles.tableCell, { flex: 0.5 }]}>
                      {averagePercentage.toFixed(0)}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      {totalOtherInterestAmount.toFixed(0)}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{diffLoanAmount.toFixed(0)}</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      {diffInterestAmount.toFixed(0)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Page>
        );
        currentPageRows = [];
      }
    });
  });

  return <Document>{pages}</Document>;
}
