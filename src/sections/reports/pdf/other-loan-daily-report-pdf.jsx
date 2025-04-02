import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { fDate } from '../../../utils/format-time.js';
import InvoiceHeader from '../../../components/invoise/invoice-header.jsx';

const useStyles = () =>
  StyleSheet.create({
    page: {
      fontFamily: 'Roboto',
      backgroundColor: '#FFFFFF',
      fontSize: 9,
    },
    subHeading: {
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
      marginVertical: 5,
    },
    table: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderWidth: 1,
      borderColor: '#000',
      marginBottom: 10,
    },
    tableRow: {
      flexDirection: 'row',
      display: 'flex',
      minHeight: 22,
      borderBottomWidth: 1,
      borderBottomColor: '#000',
    },
    tableHeader: {
      backgroundColor: '#5B9BD4',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    tableCell: {
      flex: 1,
      padding: 5,
      borderRightWidth: 1,
      borderRightColor: '#000',
      textAlign: 'center',
      fontSize: 8,
    },
    lastCell: {
      borderRightWidth: 0,
    },
    strippedRow: {
      backgroundColor: '#F2F2F2', // Light gray background for stripped rows
    },
    lastRow: {
      borderBottomWidth: 0, // Remove border for the last row
    },
    termsAndConditionsHeaders: {
      color: '#232C4B',
      borderBottom: '1px solid #232C4B',
      fontWeight: 'bold',
      textWrap: 'nowrap',
      fontSize: '12px',
      textAlign: 'center',
      paddingVertical: 5,
      marginBottom: 10,
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
  });

export default function OtherDailyReportPdf({ selectedBranch, configs, data, filterData }) {
  const styles = useStyles();
  const { loanDetails, loanIntDetails, closedLoanDetails } = data;
  const dataFilter = [
    { value: fDate(filterData.date), label: 'Report Date' },
    { value: fDate(new Date()), label: 'Date' },
  ];
  return (
    <Document>
      {/* New Gold Loan Details Table */}
      <Page size="A4" orientation="landscape" style={{ ...styles.page, position: 'relative' }}>
        <InvoiceHeader selectedBranch={selectedBranch} configs={configs} landscape />
        <View style={{ position: 'absolute', top: 20, right: -40, width: 250 }}>
          {dataFilter.map((item, index) => (
            <View style={styles.row}>
              <Text style={styles.subHeading2}>{item.label || '-'}</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.subText}>{item.value || '-'}</Text>
            </View>
          ))}
        </View>
        <View style={{ padding: '10px' }}>
          {loanDetails && (
            <>
              <View
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  marginTop: 10,
                }}
              >
                <Text style={styles.termsAndConditionsHeaders}>NEW GOLD LOAN DETAILS</Text>
              </View>{' '}
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, { flex: 0.2 }]}>#</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>Open Date</Text>
                  <Text style={[styles.tableCell, { flex: 1.8 }]}>Loan No</Text>
                  <Text style={[styles.tableCell, { flex: 2.2 }]}>Customer Name</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>Other Name</Text>
                  <Text style={[styles.tableCell, { flex: 1.3 }]}>Other Loan No</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>Rate</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>Gross Wt</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>Net Wt</Text>
                  <Text style={[styles.tableCell, { flex: 0.6 }]}>Charge</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>Cash Amt</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>Bank Amt</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>Other Amt</Text>
                  <Text style={[styles.tableCell, { flex: 0.9 }]}>Entry Date</Text>
                </View>
                {loanDetails.map((item, index) => (
                  <View
                    style={[
                      styles.tableRow,
                      index % 2 !== 0 && styles.strippedRow, // Apply stripped row style
                      index === loanDetails.length - 1 && styles.lastRow, // Remove border for the last row
                    ]}
                    key={index}
                  >
                    <Text style={[styles.tableCell, { flex: 0.2 }]}>{index + 1}</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(item.date)}</Text>
                    <Text style={[styles.tableCell, { flex: 1.8 }]}>{item?.loan.loanNo}</Text>
                    <Text style={[styles.tableCell, { flex: 2.2 }]}>
                      {`${item?.loan?.customer?.firstName} ${item?.loan?.customer?.middleName} ${item?.loan?.customer?.lastName}`}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.otherName}</Text>
                    <Text style={[styles.tableCell, { flex: 1.3 }]}>{item.otherNumber}</Text>
                    <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.percentage}</Text>
                    <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.grossWt}</Text>
                    <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.netWt}</Text>
                    <Text style={[styles.tableCell, { flex: 0.6 }]}>{item.otherCharge}</Text>
                    <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.cashAmount}</Text>
                    <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.bankAmount}</Text>
                    <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.amount}</Text>
                    <Text style={[styles.tableCell, { flex: 0.9 }]}>{fDate(item.createdAt)}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </Page>

      {/* Gold Loan Interest Details Table */}
      {loanIntDetails && loanIntDetails.length > 0 && (
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={{ padding: '10px' }}>
            <View
              style={{
                textAlign: 'center',
                fontSize: 18,
                marginTop: 10,
              }}
            >
              <Text style={styles.termsAndConditionsHeaders}>GOLD LOAN INTEREST DETAILS</Text>
            </View>

            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { flex: 0.2 }]}>#</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Open Date</Text>
                <Text style={[styles.tableCell, { flex: 1.8 }]}>Loan No</Text>
                <Text style={[styles.tableCell, { flex: 2.2 }]}>Customer Name</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Other Name</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>Other Loan No</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Other Amt</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Rate</Text>
                <Text style={[styles.tableCell, { flex: 0.9 }]}>From Date</Text>
                <Text style={[styles.tableCell, { flex: 0.9 }]}>To Date</Text>
                <Text style={[styles.tableCell, { flex: 0.6 }]}>Day</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Cash Amt</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Bank Amt</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Int Amt</Text>
                <Text style={[styles.tableCell, { flex: 0.9 }]}>Entry Date</Text>
              </View>
              {loanIntDetails.map((item, index) => (
                <View
                  style={[
                    styles.tableRow,
                    index % 2 !== 0 && styles.strippedRow,
                    index === loanIntDetails.length - 1 && styles.lastRow,
                  ]}
                  key={index}
                >
                  <Text style={[styles.tableCell, { flex: 0.2 }]}>{index + 1}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(item.otherLoan.date)}</Text>
                  <Text style={[styles.tableCell, { flex: 1.8 }]}>
                    {item?.otherLoan?.loan.loanNo}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 2.2 }]}>
                    {`${item?.otherLoan?.loan?.customer?.firstName} ${item?.otherLoan?.loan?.customer?.middleName} ${item?.otherLoan?.loan?.customer?.lastName}`}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.otherLoan.otherName}</Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>
                    {item.otherLoan.otherNumber}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.otherLoan.amount}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.otherLoan.percentage}</Text>
                  <Text style={[styles.tableCell, { flex: 0.9 }]}>{fDate(item.from)}</Text>
                  <Text style={[styles.tableCell, { flex: 0.9 }]}>{fDate(item.to)}</Text>
                  <Text style={[styles.tableCell, { flex: 0.6 }]}>{item.days}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.otherLoan.cashAmount}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.otherLoan.bankAmount}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.amountPaid}</Text>
                  <Text style={[styles.tableCell, { flex: 0.9 }]}>
                    {fDate(item.otherLoan.createdAt)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      )}

      {/* Gold Loan Part Close/Payment Details Table */}
      {closedLoanDetails && closedLoanDetails.length > 0 && (
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={{ padding: '10px' }}>
            <View
              style={{
                textAlign: 'center',
                fontSize: 18,
                marginTop: 10,
              }}
            >
              <Text style={styles.termsAndConditionsHeaders}>GOLD LOAN CLOSE </Text>
            </View>{' '}
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { flex: 0.2 }]}>#</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Open Date</Text>
                <Text style={[styles.tableCell, { flex: 1.8 }]}>Loan No</Text>
                <Text style={[styles.tableCell, { flex: 2.2 }]}>Customer Name</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Other Name</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>Other Loan No</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Rate</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Charge</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Cash Amt</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Bank Amt</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Pay Amt</Text>
                <Text style={[styles.tableCell, { flex: 0.9 }]}>Close Date</Text>
                <Text style={[styles.tableCell, { flex: 0.9 }]}>Entry Date</Text>
              </View>
              {closedLoanDetails.map((item, index) => (
                <View
                  style={[
                    styles.tableRow,
                    index % 2 !== 0 && styles.strippedRow, // Apply stripped row style
                    index === closedLoanDetails.length - 1 && styles.lastRow, // Remove border for the last row
                  ]}
                  key={index}
                >
                  <Text style={[styles.tableCell, { flex: 0.2 }]}>{index + 1}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(item.otherLoan.date)}</Text>
                  <Text style={[styles.tableCell, { flex: 1.8 }]}>
                    {item?.otherLoan?.loan.loanNo}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 2.2 }]}>
                    {`${item?.otherLoan?.loan?.customer?.firstName} ${item?.otherLoan?.loan?.customer?.middleName} ${item?.otherLoan?.loan?.customer?.lastName}`}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.otherLoan.otherName}</Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>
                    {item.otherLoan.otherNumber}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.otherLoan.percentage}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>
                    {item.otherLoan.otherCharge}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.otherLoan.cashAmount}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.otherLoan.bankAmount}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>
                    {item.otherLoan.closingAmount}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 0.9 }]}>
                    {fDate(item.otherLoan.closeDate)}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 0.9 }]}>
                    {fDate(item.otherLoan.createdAt)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      )}
    </Document>
  );
}
