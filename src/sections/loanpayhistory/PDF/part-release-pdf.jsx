import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';
import logo from 'src/assets/logo/pdf-logo.png';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import InvoiceHeader from '../../../components/invoise/invoice-header';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' }, // Regular weight
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

// Register the NotoSansGujarati font family
Font.register({
  family: 'NotoSansGujarati',
  src: '/fonts/NotoSansGujarati-VariableFont_wdth,wght.ttf',
});
// Font.register();

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        col4: { width: '25%' },
        col8: { width: '75%' },
        col6: { width: '50%' },
        mb4: { marginBottom: 4 },
        fwBold: { fontWeight: 'bold' },
        my4: { marginBlock: 4 },
        mb8: { marginBottom: 8 },
        mb40: { marginBottom: 40 },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        subtitle2: { fontSize: 9, fontWeight: 700 },
        alignRight: { textAlign: 'right' },
        page: {
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          textTransform: 'capitalize',
        },
        pagePadding: {
          padding: '0px 24px 0px 24px',
          height:'68%'
        },
        gujaratiText: {
          fontFamily: 'NotoSansGujarati',
          fontSize: 12,
        },
        footer: {
          left: 0,
          right: 0,
          bottom: 0,
          padding: 24,
          margin: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          position: 'absolute',
          borderColor: '#DFE3E8',
        },
        gridContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        table: {
          display: 'flex',
          width: 'auto',
        },
        tableRow: {
          padding: '8px 0',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },

        logoContainer: {
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        },
        logo: {
          width: 80,
          height: 80,
          marginBottom: 8,
        },
        branchDetails: {
          color: '#FFFFFF',
          marginTop: 3,
          fontWeight: 'bold',
          fontSize: 10,
          textAlign: 'right',
        },
        noBorder: {
          paddingTop: 8,
          paddingBottom: 0,
          borderBottomWidth: 0,
        },
        noticeTitle: {
          width: '100%',
          marginTop: 35,
          marginBottom: 30,
          textDecoration: 'underline',
          fontSize: 23,
          fontFamily: 'NotoSansGujarati',
          textAlign: 'center',
        },
        topDetails: {
          fontSize: 11,
          textAlign: 'left',
          marginTop: 3,
          fontFamily: 'NotoSansGujarati',
          letterSpacing: 0.5,
        },
        bottomDetails: {
          fontSize: 14,
          marginTop: 3,
          fontFamily: 'NotoSansGujarati',
          letterSpacing: 0.5,
        },
        mainText: {
          fontSize: 14,
          fontFamily: 'Roboto',
        },
        wriitenBy: {
          fontSize: 14,
          width: '100%',
          textAlign: 'right',
          marginTop: 10,
          fontFamily: 'NotoSansGujarati',
          letterSpacing: 0.5,
        },
        write: {
          fontSize: 14,
          textAlign: 'left',
          marginTop: 3,
          fontFamily: 'NotoSansGujarati',
          letterSpacing: 0.5,
        },
        date: {
          width: '100%',
          textAlign: 'right',
          fontSize: 12,
        },
        tableCell_1: {
          width: '5%',
        },
        tableCell_2: {
          width: '50%',
          paddingRight: 16,
        },
        tableCell_3: {
          width: '15%',
        },
        subHeading: {
          fontWeight: 600,
          fontSize: 10,
        },
        subText: {
          fontSize: 10,
          lineHeight: 1.5
        },
        img: {
          borderRadius: 5,
          width: '100%',
          height: 148,
          objectFit: 'cover',
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

// ----------------------------------------------------------------------

export default function PartReleasePdf({ selectedRow,configs }) {
  const styles = useStyles();
  console.log(selectedRow,"ghfffkt");
  return (
    <>
      <Document>
        <Page size='A4' style={styles.page}>
          <InvoiceHeader selectedRow={selectedRow.loan} configs={configs}/>
          <View style={styles.pagePadding}>
            <View style={{ width: '100%', display: 'flex',justifyContent: 'space-between',flexDirection: 'row', marginTop: 10 }}>
              <View style={{width: '33%'}}>
                <Text style={{ marginTop: 10 }}>
                  <Text style={styles.subHeading}>Loan No : {' '}</Text>
                  <Text style={styles.subText}>{selectedRow.loan.loanNo}</Text>
                </Text>
                <Text style={{ marginTop: 10 }}>
                  <Text style={styles.subHeading}>Issue Date : {' '}</Text>
                  <Text style={styles.subText}>{fDate(selectedRow.loan.issueDate)}</Text>
                </Text>
                <Text style={{ marginTop: 10 }}>
                  <Text style={styles.subHeading}>Close Date : {' '}</Text>
                  <Text style={styles.subText}>27 Aug 2024</Text>
                </Text>
                <Text style={{ marginTop: 10 }}>
                  <Text style={styles.subHeading}>Loan Amount : {' '}</Text>
                  <Text style={styles.subText}>{selectedRow.loan.loanAmount}</Text>
                </Text>
                <Text style={{ marginTop: 10 }}>
                  <Text style={styles.subHeading}>Pay Amount : {' '}</Text>
                  <Text style={styles.subText}>{selectedRow.loan.amountPaid}</Text>
                </Text>
                <Text style={{ marginTop: 10 }}>
                  <Text style={styles.subHeading}>Int. Loan Amount : {' '}</Text>
                  <Text style={styles.subText}>{selectedRow.loan.interestLoanAmount}</Text>
                </Text>
              </View>
              <View  style={{width: '33%'}}>
                <Text style={{ marginTop: 10}}>
                  <Text style={styles.subHeading}>Customer Name : {' '}</Text>
                  <Text style={styles.subText}>{`${selectedRow.loan.customer.firstName} ${selectedRow.loan.customer.middleName} ${selectedRow.loan.customer.lastName}`}</Text>
                </Text>
                <Text style={{ marginTop: 10 }}>
                  <Text style={styles.subHeading}>Pan No : {' '}</Text>
                  <Text style={styles.subText}>{selectedRow.loan.customer.panCard}</Text>
                </Text>
                <Text style={{ marginTop: 10 }}>
                  <Text style={styles.subHeading}>Mobile No : {' '}</Text>
                  <Text style={styles.subText}>{selectedRow.loan.customer.contact}</Text>
                </Text>
                <Text style={{ marginTop: 10 }}>
                  <Text style={styles.subHeading}>Remark : {' '}</Text>
                  <Text style={styles.subText}>{selectedRow.remark}</Text>
                </Text>
              </View>
              <View  style={{width: '33%'}}>
                <Image src={selectedRow.propertyImage} style={styles.img}/>
              </View>
            </View>
            <Text style={{ marginTop: 10 }}>
              <Text style={styles.subHeading}>Accepted & Received Amount : {' '}</Text>
              <Text style={styles.subText}>{selectedRow.loan.amountPaid}</Text>
            </Text>
          </View>
            <View style={styles.d_flex}>
              <Text style={{ ...styles.signText ,marginLeft: 35 }}>Authority Sign</Text>
              <Text style={{ ...styles.signText , marginRight: 35 }}>Easy Gold FinCorp</Text>
            </View>
        </Page>
      </Document>
    </>
  );
}
