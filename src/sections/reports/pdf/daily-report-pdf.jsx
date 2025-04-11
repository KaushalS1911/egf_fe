import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { fDate } from '../../../utils/format-time.js';
import InvoiceHeader from '../../../components/invoise/invoice-header.jsx';
import TableCell from '@mui/material/TableCell';

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

export default function DailyReportPdf({ selectedBranch, configs, data, filterData }) {
  const styles = useStyles();
  const {
    loanDetails,
    loanIntDetails,
    partReleaseDetails,
    uchakIntDetails,
    partPaymentDetails,
    closedLoans,
  } = data;
  const dataFilter = [
    // { value: filterData.issuedBy.name, label: 'Issued By' },
    { value: filterData.branch.name, label: 'Branch' },
    { value: fDate(filterData.date), label: 'Report Date' },
    // { value: fDate(filterData.startDate), label: 'Start Date' },
    // { value: fDate(filterData.endDate), label: 'End Date' },
    { value: fDate(new Date()), label: 'Date' },
  ];
  return (
    <Document>
      {/* New Gold Loan Details Table */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <InvoiceHeader selectedBranch={selectedBranch} configs={configs} landscape />
        <View style={{ position: 'absolute', top: 20, right: 5, width: 250 }}>
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
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>Loan No</Text>
                  <Text style={[styles.tableCell, { flex: 4.8 }]}>Customer Name</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>Loan Amt</Text>
                  <Text style={[styles.tableCell, { flex: 0.4 }]}>Int. (%)</Text>
                  <Text style={[styles.tableCell, { flex: 0.4 }]}>Con. (%)</Text>
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
                      {item.scheme.interestRate > 1.5 ? 1.5 : item.scheme.interestRate}
                    </Text>{' '}
                    <Text style={[styles.tableCell, { flex: 0.4 }]}>{item.consultingCharge}</Text>
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
                <Text style={[styles.tableCell, { flex: 5 }]}>Customer Name</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Loan Amt</Text>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>Int. (%)</Text>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>Con. (%)</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Issue Date</Text>
                <Text style={[styles.tableCell, { flex: 1.3 }]}>Loan int. amt</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>From date</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>To date</Text>
                <Text style={[styles.tableCell, { flex: 0.4 }]}>Days</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Pay by</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Int</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>penalty</Text>
                <Text style={[styles.tableCell, { flex: 1, borderRightWidth: 0 }]}>Total Pay</Text>
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
                  <Text style={[styles.tableCell, { flex: 5 }]}>
                    {`${item.loan.customer.firstName} ${item.loan.customer.middleName} ${item.loan.customer.lastName}`}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{item.loan.loanAmount}</Text>
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>
                    {item.loan.scheme.interestRate > 1.5 ? 1.5 : item.loan.scheme.interestRate}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>
                    {item.loan.consultingCharge}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(item.loan.issueDate)}</Text>
                  <Text style={[styles.tableCell, { flex: 1.3 }]}>
                    {item.loan.interestLoanAmount}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(item.from)}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(item.to)}</Text>
                  <Text style={[styles.tableCell, { flex: 0.4 }]}>{item.days}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>
                    {item?.paymentDetail?.paymentMode}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{item?.interestAmount}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.penalty}</Text>
                  <Text style={[styles.tableCell, { flex: 1, borderRightWidth: 0 }]}>
                    {item.amountPaid}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      )}
      {/* Gold Loan Part Close Details Table */}
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
              <Text style={styles.termsAndConditionsHeaders}>GOLD LOAN PART CLOSE</Text>
            </View>{' '}
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { flex: 0.25 }]}>#</Text>
                <Text style={[styles.tableCell, { flex: 1.8 }]}>Loan No</Text>
                <Text style={[styles.tableCell, { flex: 5 }]}>Customer Name</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Loan Amt</Text>
                <Text style={[styles.tableCell, { flex: 0.4 }]}>Int (%)</Text>
                <Text style={[styles.tableCell, { flex: 0.4 }]}>Con (%)</Text>
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
                    index % 2 !== 0 && styles.strippedRow,
                    index === partReleaseDetails.length - 1 && styles.lastRow,
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
                    {item.loan.scheme.interestRate > 1.5 ? 1.5 : item.loan.scheme.interestRate}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 0.4 }]}>
                    {item.loan.consultingCharge}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(item.loan.issueDate)}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {fDate(item.loan.interestLoanAmount)}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{item.amountPaid}</Text>
                  <Text style={[styles.tableCell, { flex: 1.1, borderRightWidth: 0 }]}>
                    {fDate(item.createdAt)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      )}
      {/* Gold Loan Part Payment Details Table */}
      {partPaymentDetails && partPaymentDetails.length > 0 && (
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={{ padding: '10px' }}>
            <View
              style={{
                textAlign: 'center',
                fontSize: 18,
                marginTop: 10,
              }}
            >
              <Text style={styles.termsAndConditionsHeaders}>GOLD LOAN PART PAYMENT</Text>
            </View>{' '}
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { flex: 0.25 }]}>#</Text>
                <Text style={[styles.tableCell, { flex: 1.8 }]}>Loan No</Text>
                <Text style={[styles.tableCell, { flex: 5 }]}>Customer Name</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Loan Amt</Text>
                <Text style={[styles.tableCell, { flex: 0.4 }]}>Int. (%)</Text>
                <Text style={[styles.tableCell, { flex: 0.4 }]}>Con. (%)</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Issue Date</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Loan int. amt</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Total pay amt</Text>
                <Text style={[styles.tableCell, { flex: 1.1, borderRightWidth: 0 }]}>
                  Entry date
                </Text>
              </View>
              {partPaymentDetails.map((item, index) => (
                <View
                  style={[
                    styles.tableRow,
                    index % 2 !== 0 && styles.strippedRow,
                    index === partPaymentDetails.length - 1 && styles.lastRow,
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
                    {item.loan.scheme.interestRate > 1.5 ? 1.5 : item.loan.scheme.interestRate}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 0.4 }]}>
                    {item.loan.consultingCharge}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(item.loan.issueDate)}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {fDate(item.loan.interestLoanAmount)}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{item.amountPaid}</Text>
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
                <Text style={[styles.tableCell, { flex: 0.3 }]}>Int. (%)</Text>
                <Text style={[styles.tableCell, { flex: 0.3 }]}>Con. (%)</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Issue Date</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Loan int. amt</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Uchak Amt</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Pay date</Text>
                <Text style={[styles.tableCell, { flex: 0.8, borderRightWidth: 0 }]}>
                  Entry date
                </Text>
              </View>
              {uchakIntDetails.map((item, index) => (
                <View
                  style={[
                    styles.tableRow,
                    index % 2 !== 0 && styles.strippedRow,
                    index === uchakIntDetails.length - 1 && styles.lastRow,
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
                    {item.loan.scheme.interestRate > 1.5 ? 1.5 : item.loan.scheme.interestRate}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 0.3 }]}>
                    {item.loan.consultingCharge}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{fDate(item.issueDate)}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {item.loan.interestLoanAmount}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{item.amountPaid}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{fDate(item.date)}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8, borderRightWidth: 0 }]}>
                    {fDate(item.createdAt)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      )}{' '}
      {closedLoans && closedLoans.length > 0 && (
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={{ padding: '10px' }}>
            <View
              style={{
                textAlign: 'center',
                fontSize: 18,
                marginTop: 10,
              }}
            >
              <Text style={styles.termsAndConditionsHeaders}>LOAN CLOSE DETAILS</Text>
            </View>{' '}
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { flex: 0.1 }]}>#</Text>
                <Text style={[styles.tableCell, { flex: 1.7 }]}>Loan No</Text>
                <Text style={[styles.tableCell, { flex: 4 }]}>Customer Name</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Total loan amt</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Paid Loan amt</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>pending loan amt</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Pay date</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Closing date</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Closing charge</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Net amt</Text>
                <Text style={[styles.tableCell, { flex: 2, borderRightWidth: 0 }]}>Entry by</Text>
              </View>
              {closedLoans.map((item, index) => (
                <View
                  style={[
                    styles.tableRow,
                    index % 2 !== 0 && styles.strippedRow,
                    index === uchakIntDetails.length - 1 && styles.lastRow,
                  ]}
                  key={index}
                >
                  <Text style={[styles.tableCell, { flex: 0.1 }]}>{index + 1}</Text>
                  <Text style={[styles.tableCell, { flex: 1.7 }]}>{item.loan.loanNo}</Text>
                  <Text style={[styles.tableCell, { flex: 4 }]}>
                    {`${item.loan.customer.firstName} ${item.loan.customer.middleName} ${item.loan.customer.lastName}`}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{item.totalLoanAmount}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {(item.netAmount - item.closingCharge).toFixed(2)}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {item.totalLoanAmount - (item.netAmount - item.closingCharge)}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{fDate(item.date)}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{fDate(item.createdAt)}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.closingCharge}</Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.netAmount}</Text>
                  <Text style={[styles.tableCell, { flex: 2, borderRightWidth: 0, fontSize: 7 }]}>
                    {item.entryBy}
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
