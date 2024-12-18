import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Document, StyleSheet } from '@react-pdf/renderer';
import InvoiceHeader from '../../../components/invoise/invoice-header';
import { fDate } from '../../../utils/format-time';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf' },
  ],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        page: {
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
        },
        pagePadding: {
          padding: '0px 24px 0px 24px',
          height:'68%'
        },
        headerText2: {
          fontSize: 14,
          fontWeight: 'bold',
          marginBottom: 16,
        },
        subHeading: {
          fontWeight: 600,
          fontSize: 10,
        },
        subText: {
          fontSize: 10,
          fontWeight: 'medium',
        },
        spacing: {
          marginTop: 7,
        },
        table: {
          width: 'auto',
          marginTop: 10,
          borderRadius: 10,

        },
        tableHeader: {
          color: '#fff',
          backgroundColor: '#232C4B',
          fontWeight: 'bold',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
        tableFooter: {
          color: '#fff',
          backgroundColor: '#232C4B',
          fontWeight: 'bold',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        },
        tableRow: {
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#F0F0F0',
          paddingVertical: 8,
        },
        tableCell: {
          flex: 1,
          fontSize: 10,
          paddingHorizontal: 4,
          textAlign: 'center',
        },
        d_flex: {
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          marginTop: 90,
          alignItems: 'center',
          justifyContent: 'space-between'
        },
        signText: {
          fontSize: 11,
          borderTop: '1px solid black',
          paddingTop: 10,
          textAlign: 'center',
          width: '100px',
          fontWeight: 600
        },
      }),
    [],
  );

export default function InterestPdf({ data ,configs}) {
  const styles = useStyles();
  return (
    <Document>
      <Page  size="A4" style={styles.page}>
        <InvoiceHeader selectedRow={data.loan} configs={configs} />
        <View style={styles.pagePadding}>
          <Text style={{ ...styles.headerText2,marginTop: 25 }}>Interest Pay Slip</Text>
          <View style={{ width: '100%', display: 'flex', alignItems: 'center',flexDirection: 'row' }}>
            <View>
              <Text style={styles.spacing}>
                <Text style={styles.subHeading}>Loan No : {' '}</Text>
                <Text style={styles.subText}>{data.loan.loanNo} </Text>
              </Text>
              <Text style={styles.spacing}>
                <Text style={styles.subHeading}>Issue Date : {' '}</Text>
                <Text style={styles.subText}>{fDate(data.loan.issueDate)}</Text>
              </Text>
              <Text style={styles.spacing}>
                <Text style={styles.subHeading}>Next Interest Date : {' '}</Text>
                <Text style={styles.subText}>{fDate(data.loan.nextInstallmentDate)}</Text>
              </Text>
            </View>
            <View style={{marginLeft: 75}}>
              <Text style={styles.spacing}>
                <Text style={styles.subHeading}>Customer Name : {' '}</Text>
                <Text style={styles.subText}>{`${data.loan.customer.firstName} ${data.loan.customer.middleName} ${data.loan.customer.lastName}`}</Text>
              </Text>
              <Text style={styles.spacing}>
                <Text style={styles.subHeading}>Pan No  : {' '}</Text>
                <Text style={styles.subText}>{data.loan.customer.panCard}</Text>
              </Text>
              <Text style={styles.spacing}>
                <Text style={styles.subHeading}>Mobile No : {' '}</Text>
                <Text style={styles.subText}>{data.loan.customer.contact}</Text>
              </Text>
            </View>
          </View>
          <View>
            <Text style={{ ...styles.headerText2,marginTop: 30,marginBottom: 25 }}>Interest Details</Text>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>From Date</Text>
              <Text style={styles.tableCell}>To Date</Text>
              <Text style={styles.tableCell}>Loan Amt</Text>
              <Text style={styles.tableCell}>Int. Loan Amt</Text>
              <Text style={styles.tableCell}>Total Interest</Text>
              <Text style={styles.tableCell}>Uchak Amt</Text>
              <Text style={styles.tableCell}>Pay Amt</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{fDate(data.from)}</Text>
              <Text style={styles.tableCell}>{fDate(data.to)}</Text>
              <Text style={styles.tableCell}>{data.loan.loanAmount}</Text>
              <Text style={styles.tableCell}>{data.loan.interestLoanAmount}</Text>
              <Text style={styles.tableCell}>{data.interestAmount}</Text>
              <Text style={styles.tableCell}>{data.uchakInterestAmount || 0}</Text>
              <Text style={styles.tableCell}>{data.amountPaid}</Text>
            </View>
          </View>
        </View>
        <View style={styles.d_flex}>
          <Text style={{ ...styles.signText ,marginLeft: 35 }}>Authority Sign</Text>
        </View>
      </Page>
    </Document>
  );
}

InterestPdf.propTypes = {
  data: PropTypes.object,
  dynamicTableData: PropTypes.arrayOf(
    PropTypes.shape({
      column1: PropTypes.string,
      column2: PropTypes.string,
      column3: PropTypes.string,
      column4: PropTypes.string,
    }),
  ),
};
