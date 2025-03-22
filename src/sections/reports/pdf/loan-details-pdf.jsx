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
      padding: 5,
      borderRightWidth: 1,
      borderRightColor: '#000',
      textAlign: 'center',
      fontSize: 10,
    },
    lastCell: {
      borderRightWidth: 0,
    },
    strippedRow: {
      backgroundColor: '#F2F2F2',
    },
    lastRow: {
      borderBottomWidth: 0,
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

export default function LoanDetailsPdf({ selectedBranch, configs, data }) {
  const styles = useStyles();
  const { intDetails, partReleaseDetails, uchakPayDetails, partPaymentDetails, loanCloseDetails } =
    data;

  return (
    <Document>
      {/* Loan Interest Details Table */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <InvoiceHeader selectedBranch={selectedBranch} configs={configs} landscape />
        <View style={{ padding: '10px' }}>
          <View
            style={{
              textAlign: 'center',
              fontSize: 18,
            }}
          >
            <Text style={styles.termsAndConditionsHeaders}>LOAN INTEREST DETAILS</Text>
          </View>{' '}
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 0.2 }]}>#</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>From Date</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>To Date</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Loan Amt</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Interest Rate</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Consultant Int</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Total Int</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Penalty Amt</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>CR/OR Amt</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Uchak Amt</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Entry Date</Text>
              <Text style={[styles.tableCell, { flex: 0.5 }]}>Days</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Pay After Adjust</Text>
              <Text style={[styles.tableCell, { flex: 1.5, borderRightWidth: 0 }]}>
                Total Pay Amt
              </Text>
            </View>
            {intDetails?.map((item, index) => (
              <View
                style={[
                  styles.tableRow,
                  index % 2 !== 0 && styles.strippedRow,
                  index === intDetails.length - 1 && styles.lastRow,
                ]}
                key={index}
              >
                <Text style={[styles.tableCell, { flex: 0.2 }]}>{index + 1}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{fDate(item.from)}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{fDate(item.to)}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.loan.loanAmount}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.loan.scheme.interestRate}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.loan.consultingCharge}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.interestAmount}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.loan.penalty}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.cr_dr}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.uchakInterestAmount}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{fDate(item.createdAt)}</Text>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.days}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.adjustedPay}</Text>
                <Text style={[styles.tableCell, { flex: 1.5, borderRightWidth: 0 }]}>
                  {item.amountPaid}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>

      {/* Loan Part Release Details Table */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={{ padding: '10px' }}>
          <View
            style={{
              textAlign: 'center',
              fontSize: 18,
            }}
          >
            <Text style={styles.termsAndConditionsHeaders}>LOAN PART RELEASE DETAILS</Text>
          </View>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 0.1 }]}>#</Text>
              <Text style={[styles.tableCell, { flex: 2.5 }]}>Loan No</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Loan Amount</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Int. loan amt</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Pay Amount</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Pending Amount</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Pay Date</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Entry date</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Entry by</Text>
              <Text style={[styles.tableCell, { flex: 1.5, borderRightWidth: 0 }]}>Remarks</Text>
            </View>
            {partReleaseDetails?.map((item, index) => (
              <View
                style={[
                  styles.tableRow,
                  index % 2 !== 0 && styles.strippedRow,
                  index === partReleaseDetails.length - 1 && styles.lastRow,
                ]}
                key={index}
              >
                <Text style={[styles.tableCell, { flex: 0.1 }]}>{index + 1}</Text>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>{item.loan.loanNo}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.loan.loanAmount}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.interestLoanAmount}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.amountPaid}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.pendingLoanAmount}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{fDate(item.date) || '-'}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>
                  {fDate(item.createdAt) || '-'}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.entryBy}</Text>
                <Text style={[styles.tableCell, { flex: 1.5, borderRightWidth: 0 }]}>
                  {item.remark || '-'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>

      {/* Loan Uchak Pay Details Table */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={{ padding: '10px' }}>
          <View
            style={{
              textAlign: 'center',
              fontSize: 18,
            }}
          >
            <Text style={styles.termsAndConditionsHeaders}>LOAN UCHAK PAY DETAILS</Text>
          </View>{' '}
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 0.1 }]}>#</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Uchak Pay Date</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Uchak Int Amt</Text>
              <Text style={[styles.tableCell, { flex: 2, borderRightWidth: 0 }]}>Remarks</Text>
            </View>
            {uchakPayDetails?.map((item, index) => (
              <View
                style={[
                  styles.tableRow,
                  index % 2 !== 0 && styles.strippedRow,
                  index === uchakPayDetails.length - 1 && styles.lastRow,
                ]}
                key={index}
              >
                <Text style={[styles.tableCell, { flex: 0.1 }]}>{index + 1}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{fDate(item.date) || '-'}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{item.amountPaid}</Text>
                <Text style={[styles.tableCell, { flex: 2, borderRightWidth: 0 }]}>
                  {item.remark || '-'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>

      {/* Loan Part Payment Details Table */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={{ padding: '10px' }}>
          <View
            style={{
              textAlign: 'center',
              fontSize: 18,
            }}
          >
            <Text style={styles.termsAndConditionsHeaders}>LOAN PART PAYMENT DETAILS</Text>
          </View>{' '}
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 0.1 }]}>#</Text>
              <Text style={[styles.tableCell, { flex: 2.5 }]}>Loan no</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Loan Amount</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Int. Loan amt</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Pay Amount</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>InT Loan Amt</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Pay Date</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Entry Date</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Remarks</Text>
              <Text style={[styles.tableCell, { flex: 1.5, borderRightWidth: 0 }]}>Entry Date</Text>
            </View>
            {partPaymentDetails?.map((item, index) => (
              <View
                style={[
                  styles.tableRow,
                  index % 2 !== 0 && styles.strippedRow,
                  index === partPaymentDetails.length - 1 && styles.lastRow,
                ]}
                key={index}
              >
                <Text style={[styles.tableCell, { flex: 0.1 }]}>{index + 1}</Text>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>{item.loan.loanNo}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.loan.loanAmount}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.interestLoanAmount}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.amountPaid}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>
                  {item.loan.interestLoanAmount}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{fDate(item.date || '-')}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{fDate(item.createdAt)}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.entry}</Text>
                <Text style={[styles.tableCell, { flex: 1.5, borderRightWidth: 0 }]}>
                  {item.entry}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>

      {/* Loan Close Details Table */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={{ padding: '10px' }}>
          <View
            style={{
              textAlign: 'center',
              fontSize: 18,
            }}
          >
            <Text style={styles.termsAndConditionsHeaders}>LOAN CLOSE DETAILS</Text>
          </View>{' '}
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 0.1 }]}>#</Text>
              <Text style={[styles.tableCell, { flex: 2.5 }]}>Loan No</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Int. Loan No</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Total Loan Amt</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Paid Loan Amt</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Pay Date</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Pending Loan Amt</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Closing Charge</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Entry Date</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Net Amt</Text>
              <Text style={[styles.tableCell, { flex: 1.5, borderRightWidth: 0 }]}>Entry By</Text>
            </View>
            {loanCloseDetails?.map((item, index) => (
              <View
                style={[
                  styles.tableRow,
                  index % 2 !== 0 && styles.strippedRow,
                  index === loanCloseDetails.length - 1 && styles.lastRow,
                ]}
                key={index}
              >
                <Text style={[styles.tableCell, { flex: 0.1 }]}>{index + 1}</Text>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>{item.loan.loanNo}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.totalLoanAmount}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.interestLoanAmount}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>
                  {item.netAmount - item.closingCharge || 0}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{fDate(item.date)}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>
                  {item.totalLoanAmount - item.netAmount || 0}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.closingCharge || 0}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{fDate(item.createdAt) || 0}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.netAmount || '-'}</Text>
                <Text style={[styles.tableCell, { flex: 1.5, borderRightWidth: 0 }]}>
                  {item.entryBy || 0}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
