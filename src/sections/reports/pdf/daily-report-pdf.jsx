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
  });

export default function DailyReportPdf({ selectedBranch, configs, data }) {
  const styles = useStyles();
  const { loanDetails, loanIntDetails, partReleaseDetails, uchakIntDetails } = data;

  return (
    <Document>
      {/* New Gold Loan Details Table */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <InvoiceHeader selectedBranch={selectedBranch} configs={configs} landscape />
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
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>Loan No</Text>
                  <Text style={[styles.tableCell, { flex: 4.8 }]}>Customer Name</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>Loan Amt</Text>
                  <Text style={[styles.tableCell, { flex: 0.4 }]}>Rate</Text>
                  <Text style={[styles.tableCell, { flex: 0.7 }]}>Issue Date</Text>
                  <Text style={[styles.tableCell, { flex: 3.5, borderRightWidth: 0 }]}>
                    Entry by
                  </Text>
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
                    <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.loanNo}</Text>
                    <Text style={[styles.tableCell, { flex: 4.8 }]}>
                      {`${item.customer.firstName} ${item.customer.middleName} ${item.customer.lastName}`}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.loanAmount}</Text>
                    <Text style={[styles.tableCell, { flex: 0.4 }]}>
                      {item.scheme.interestRate}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 0.7 }]}>{fDate(item.issueDate)}</Text>
                    <Text style={[styles.tableCell, { flex: 3.5, borderRightWidth: 0 }]}>
                      {`${item.issuedBy.firstName} ${item.issuedBy.middleName} ${item.issuedBy.lastName}`.toUpperCase()}
                    </Text>
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
                <Text style={[styles.tableCell, { flex: 0.3 }]}>#</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Loan No</Text>
                <Text style={[styles.tableCell, { flex: 5.2 }]}>Customer Name</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Loan Amt</Text>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>Rate</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Issue Date</Text>
                <Text style={[styles.tableCell, { flex: 1.3 }]}>Loan int. amt</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>From date</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>To date</Text>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>Days</Text>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>Int</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>penalty</Text>
                <Text style={[styles.tableCell, { flex: 1.5, borderRightWidth: 0 }]}>
                  Total Pay
                </Text>
              </View>
              {loanIntDetails.map((item, index) => (
                <View
                  style={[
                    styles.tableRow,
                    index % 2 !== 0 && styles.strippedRow, // Apply stripped row style
                    index === loanIntDetails.length - 1 && styles.lastRow, // Remove border for the last row
                  ]}
                  key={index}
                >
                  <Text style={[styles.tableCell, { flex: 0.3 }]}>{index + 1}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{item.loan.loanNo}</Text>
                  <Text style={[styles.tableCell, { flex: 5.2 }]}>
                    {`${item.loan.customer.firstName} ${item.loan.customer.middleName} ${item.loan.customer.lastName}`}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{item.loan.loanAmount}</Text>
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>
                    {item.loan.scheme.interestRate}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(item.loan.issueDate)}</Text>
                  <Text style={[styles.tableCell, { flex: 1.3 }]}>
                    {item.loan.interestLoanAmount}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(item.from)}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(item.to)}</Text>
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.days}</Text>
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>int</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.penalty}</Text>
                  <Text style={[styles.tableCell, { flex: 1.5, borderRightWidth: 0 }]}>
                    {item.amountPaid}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      )}

      {/* Gold Loan Part Close/Payment Details Table */}
      {partReleaseDetails && partReleaseDetails.length > 0 && (
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={{ padding: '10px' }}>
            <View
              style={{
                textAlign: 'center',
                fontSize: 18,
                marginTop: 10,
              }}
            >
              <Text style={styles.termsAndConditionsHeaders}>
                GOLD LOAN PART CLOSE/PAYMENT DETAILS{' '}
              </Text>
            </View>{' '}
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { flex: 0.25 }]}>#</Text>
                <Text style={[styles.tableCell, { flex: 1.8 }]}>Loan No</Text>
                <Text style={[styles.tableCell, { flex: 5 }]}>Customer Name</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Loan Amt</Text>
                <Text style={[styles.tableCell, { flex: 0.4 }]}>Rate</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Issue Date</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Loan int. amt</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Total pay amt</Text>
                <Text style={[styles.tableCell, { flex: 1.1, borderRightWidth: 0 }]}>
                  Entry date
                </Text>
              </View>
              {partReleaseDetails.map((item, index) => (
                <View
                  style={[
                    styles.tableRow,
                    index % 2 !== 0 && styles.strippedRow, // Apply stripped row style
                    index === partReleaseDetails.length - 1 && styles.lastRow, // Remove border for the last row
                  ]}
                  key={index}
                >
                  <Text style={[styles.tableCell, { flex: 0.25 }]}>{index + 1}</Text>
                  <Text style={[styles.tableCell, { flex: 1.8 }]}>{item.loan.loanNo}</Text>
                  <Text style={[styles.tableCell, { flex: 5 }]}>
                    {`${item.loan.customer.firstName} ${item.loan.customer.middleName} ${item.loan.customer.lastName}`}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{item.loan.loanAmount}</Text>
                  <Text style={[styles.tableCell, { flex: 0.4 }]}>
                    {item.loan.scheme.interestRate}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(item.loan.issueDate)}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {fDate(item.loan.interestLoanAmount)}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{item.amountPaid}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{fDate(item.createdAt)}</Text>
                  <Text style={[styles.tableCell, { flex: 1.1, borderRightWidth: 0 }]}>
                    {fDate(item.createdAt)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      )}

      {/* Gold Loan Uchak Part Details Table */}
      {uchakIntDetails && uchakIntDetails.length > 0 && (
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={{ padding: '10px' }}>
            <View
              style={{
                textAlign: 'center',
                fontSize: 18,
                marginTop: 10,
              }}
            >
              <Text style={styles.termsAndConditionsHeaders}>GOLD LOAN UCHAK PART DETAILS</Text>
            </View>{' '}
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { flex: 0.2 }]}>#</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>Loan No</Text>
                <Text style={[styles.tableCell, { flex: 5 }]}>Customer Name</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Loan Amt</Text>
                <Text style={[styles.tableCell, { flex: 0.3 }]}>Rate</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Issue Date</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Loan int. amt</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Uchak Amt</Text>
                <Text style={[styles.tableCell, { flex: 0.8, borderRightWidth: 0 }]}>
                  Entry date
                </Text>
              </View>
              {uchakIntDetails.map((item, index) => (
                <View
                  style={[
                    styles.tableRow,
                    index % 2 !== 0 && styles.strippedRow, // Apply stripped row style
                    index === uchakIntDetails.length - 1 && styles.lastRow, // Remove border for the last row
                  ]}
                  key={index}
                >
                  <Text style={[styles.tableCell, { flex: 0.2 }]}>{index + 1}</Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.loan.loanNo}</Text>
                  <Text style={[styles.tableCell, { flex: 5 }]}>
                    {`${item.loan.customer.firstName} ${item.loan.customer.middleName} ${item.loan.customer.lastName}`}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{item.loan.loanAmount}</Text>
                  <Text style={[styles.tableCell, { flex: 0.3 }]}>
                    {item.loan.scheme.interestRate}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(item.issueDate)}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {item.loan.interestLoanAmount}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{item.amountPaid}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8, borderRightWidth: 0 }]}>
                    {fDate(item.createdAt)}
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
