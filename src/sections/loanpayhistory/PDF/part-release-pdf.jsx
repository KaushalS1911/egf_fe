import React, { useMemo } from 'react';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';
import logo from 'src/assets/logo/pdf-logo.png';
import { fDate } from 'src/utils/format-time';
import InvoiceHeader from '../../../components/invoise/invoice-header';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' }, // Regular weight
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

Font.register({
  family: 'NotoSansGujarati',
  src: '/fonts/NotoSansGujarati-VariableFont_wdth,wght.ttf',
});

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
          border: '3px solid #000',
          padding: '1px',
        },
        pagePadding: {
          padding: '0px 24px 0px 24px',
          height: '68%',
        },
        watermarkContainer: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        watermarkImage: {
          width: 400,
          opacity: 0.1,
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
        row: {
          flexDirection: 'row',
          marginVertical: 2,
        },
        subHeading: {
          fontWeight: '600',
          fontSize: 10,
          flex: 0.85,
        },
        subHeading2: {
          fontWeight: '600',
          fontSize: 10,
          flex: 0.8,
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
        img: {
          height: '96px',
          width: '96px',
          borderRadius: 8,
        },
        d_flex: {
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          marginTop: 90,
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        signText: {
          fontSize: 11,
          borderTop: '1px solid #232C4B',
          paddingTop: 10,
          textAlign: 'center',
          width: '100px',
          fontWeight: 600,
          color: '#232C4B',
        },
        termsAndConditionsHeaders: {
          color: '#232C4B',
          borderBottom: '1px solid #232C4B',
          fontWeight: 600,
          textWrap: 'nowrap',
          fontSize: '12px',
          textAlign: 'center',
          paddingVertical: 5,
        },
      }),
    []
  );

// ----------------------------------------------------------------------

export default function PartReleasePdf({ selectedRow, configs }) {
  const styles = useStyles();
  console.log(selectedRow, '111');
  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          {' '}
          <View style={{ border: '1px solid #000' }}>
            <View style={styles.watermarkContainer}>
              <Image src={logo} style={styles.watermarkImage} />
            </View>
            <InvoiceHeader selectedRow={selectedRow.loan} configs={configs} />
            <View style={styles.pagePadding}>
              <View
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  marginRight: 25,
                  marginBottom: 10,
                }}
              >
                <Text style={styles.termsAndConditionsHeaders}>PART RELEASE INVOICE</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  flexDirection: 'row',
                  marginTop: 20,
                  // gap: 10,
                }}
              >
                <View style={{ width: '50%' }}>
                  <View style={styles.row}>
                    <Text style={styles.subHeading}>Loan No </Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{selectedRow.loan.loanNo}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.subHeading}>Issue Date </Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{fDate(selectedRow.loan.issueDate)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.subHeading}>Close Date </Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{fDate(selectedRow.date)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.subHeading}>Loan Amount </Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{selectedRow.loan.loanAmount}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.subHeading}>Pay Amount </Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{selectedRow.adjustedAmount}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.subHeading}>Int. Loan Amount </Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{selectedRow.pendingLoanAmount}</Text>
                  </View>
                </View>
                <View style={{ width: '50%' }}>
                  <View style={styles.row}>
                    <Text style={styles.subHeading2}>Customer Name </Text>
                    <Text style={styles.colon}>:</Text>
                    <Text
                      style={styles.subText}
                    >{`${selectedRow.loan.customer.firstName} ${selectedRow.loan.customer.middleName} ${selectedRow.loan.customer.lastName}`}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.subHeading2}>Pan No </Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{selectedRow.loan.customer.panCard}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.subHeading2}>Mobile No </Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{selectedRow.loan.customer.contact}</Text>
                  </View>
                  {/*<View style={styles.row}>*/}
                  {/*  <Text style={styles.subHeading}>Remark </Text>*/}
                  {/*  <Text style={styles.colon}>:</Text>*/}
                  {/*  <Text style={styles.subText}>{selectedRow.remark}</Text>*/}
                  {/*</View>*/}
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginTop: 10,
                }}
              >
                <View>
                  <Text style={{ marginTop: 10 }}>
                    <Text style={styles.subHeading}>Remark </Text>
                    <Text style={styles.colon}> : </Text>
                    <Text style={styles.subText}>{selectedRow.remark}</Text>
                  </Text>
                </View>
                <View>
                  <Image src={selectedRow.propertyImage} style={styles.img} />
                </View>
              </View>
              <Text
                style={{
                  marginTop: 20,
                }}
              >
                <Text style={[styles.subHeading, { fontSize: 12 }]}>
                  Accepted & Received Amount
                </Text>
                <Text style={[styles.colon, { fontSize: 12 }]}> : </Text>
                <Text style={[styles.subText, { fontSize: 12, fontWeight: 'bold' }]}>
                  {selectedRow.adjustedAmount}
                </Text>
              </Text>
            </View>
            <View style={{ ...styles.d_flex, marginBottom: 52.5 }}>
              <Text style={{ ...styles.signText, marginLeft: 35 }}>Authority Sign</Text>
              <Text style={{ ...styles.signText, marginRight: 35 }}>Easy Gold FinCorp</Text>
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
}
