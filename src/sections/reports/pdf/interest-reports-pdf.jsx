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
          fontSize: 7,
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

export default function InterestReportsPdf({ selectedBranch, configs, data, filterData }) {
  const styles = useStyles();
  const headers = [
    { label: '#', flex: 0.2 },
    { label: 'Loan No', flex: 2.2 },
    { label: 'Customer Name', flex: 5 },
    { label: 'Issue Date', flex: 1.2 },
    { label: 'Loan Amt', flex: 1 },
    { label: 'Part Loan Amt ', flex: 1.2 },
    { label: 'Int. Loan Amt', flex: 1.2 },
    { label: 'Rate', flex: 0.4 },
    { label: 'con.', flex: 0.5 },
    { label: 'Int. Amt', flex: 1.2 },
    { label: 'Con. Amt', flex: 1 },
    { label: 'Penalty', flex: 1.1 },
    { label: 'Day', flex: 0.5 },
    { label: 'Total Int. Amt', flex: 1.2 },
    { label: 'Last Int. Pay Date', flex: 1.2 },
    { label: 'Pen. Day', flex: 0.5 },
    { label: 'pending Int. Amt', flex: 1.2 },
  ];
  const dataFilter = [
    // { value: filterData.issuedBy.name, label: 'Issued By' },
    { value: filterData.branch.name, label: 'Branch' },
    { value: fDate(filterData.startDate), label: 'Start Date' },
    { value: fDate(filterData.endDate), label: 'End Date' },
    { value: fDate(new Date()), label: 'Date' },
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
        <Text style={[styles.tableCell, { flex: 0.2 }]}>{index + 1}</Text>

        <Text style={[styles.tableCell, { flex: 2.2 }]}>{row.loanNo}</Text>

        <Text
          style={[styles.tableCell, { flex: 5, fontSize: 7 }]}
        >{`${row.customer.firstName} ${row.customer.middleName} ${row.customer.lastName} `}</Text>

        <Text style={[styles.tableCell, { flex: 1.2 }]}>{fDate(row.issueDate)}</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>{row.loanAmount}</Text>

        <Text style={[styles.tableCell, { flex: 1.2 }]}>
          {(row.loanAmount - row.interestLoanAmount).toFixed(2)}
        </Text>

        <Text style={[styles.tableCell, { flex: 1.2 }]}>
          {(row.interestLoanAmount || 0).toFixed(2)}
        </Text>

        <Text style={[styles.tableCell, { flex: 0.4 }]}>
          {row.scheme.interestRate > 1.5 ? 1.5 : row.scheme.interestRate}
        </Text>

        <Text style={[styles.tableCell, { flex: 0.5 }]}>
          {(row.consultingCharge || 0).toFixed(2)}
        </Text>
        <Text style={[styles.tableCell, { flex: 1.2 }]}>
          {(row.interestAmount || 0).toFixed(2)}
        </Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>
          {(row.consultingAmount || 0).toFixed(2)}
        </Text>

        <Text style={[styles.tableCell, { flex: 1.1 }]}>{(row.penaltyAmount || 0).toFixed(2)}</Text>
        <Text style={[styles.tableCell, { flex: 0.5 }]}>{row.day > 0 ? row.day : '-'}</Text>
        <Text style={[styles.tableCell, { flex: 1.2 }]}>
          {(row.totalPaidInterest || 0).toFixed(2)}
        </Text>
        <Text style={[styles.tableCell, { flex: 1.2 }]}>{fDate(row.lastInstallmentDate)}</Text>
        <Text style={[styles.tableCell, { flex: 0.5 }]}>
          {row.pendingDays > 0 ? row.pendingDays : '-'}
        </Text>
        <Text style={[styles.tableCell, { flex: 1.2 }]}>
          {(row.pendingInterest || 0).toFixed(2)}
        </Text>
      </View>
    );

    if ((index + 1) % rowsPerPage === 0 || index === data.length - 1) {
      const isFirstPage = pages.length === 0;
      pages.push(
        <Page
          key={pages.length}
          size="A4"
          style={{ ...styles.page, position: 'relative' }}
          orientation={'landscape'}
        >
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
                }}
              >
                <Text style={styles.termsAndConditionsHeaders}>INTEREST REPORTS </Text>
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
