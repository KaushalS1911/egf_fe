import React, { useMemo } from 'react';
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import logo from '../../../assets/logo/pdf-logo.png';
import { fDate } from '../../../utils/format-time';
import { margin } from '@mui/system';
import InvoiceHeader from '../../../components/invoise/invoice-header';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' }, // Regular weight
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});


const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        col4: { width: '25%' },
        col8: { width: '75%' },
        col6: { width: '50%' },
        mb4: { marginBottom: 4 },
        my4: { marginBlock: 4 },
        mb8: { marginBottom: 8 },
        mt8: { marginTop: 10 },
        mt90: { marginTop: 90 },
        mb40: { marginBottom: 40 },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        d_inline: { fontSize: 9 },
        fw: { fontWeight: 600 },
        d_flex: {
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          marginTop: 90,
          alignItems: 'center',
          justifyContent: 'space-between'
        },
        nocTitle: {
          width: '100%',
          marginTop: 20,
          marginBottom: 18,
          fontWeight: 600,
          fontSize: 16,
          textAlign: 'center',
        },
        signText: {
          fontSize: 11,
          borderTop: '1px solid black',
          paddingTop: 10,
          textAlign: 'center',
          width: '100px',
          fontWeight: 600
        },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        subtitle2: { fontSize: 9, fontWeight: 700 },
        alignRight: { textAlign: 'right' },
        page: {
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
        },
        pagePadding: {
          padding: '0px 24px 0px 24px',
          height: '68%'

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
        headerContainer: {
          backgroundColor: '#FF7F27', // Orange color
          padding: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
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
        headerText2: {
          color: '#FFFFFF',
          fontSize: 20,
          letterSpacing: 1,
          marginTop: -10,
          fontWeight: 500,
        },
        headerText: {
          color: '#FFFFFF',
          fontSize: 36,
          letterSpacing: 1,
          fontWeight: 'bold',
        },
        // subText: {
        //   color: '#FFFFFF',
        //   fontSize: 10,
        //   marginBottom: 2,
        //   marginTop: 10,
        //   fontWeight: 'bold',
        //   marginLeft: -145,
        //   width: '40%',
        // },
        branchDetails: {
          color: '#FFFFFF',
          marginTop: 3,
          fontWeight: 'bold',
          textTransform: 'lowercase',
          fontSize: 10,
          textAlign: 'right',
        },
        noBorder: {
          paddingTop: 8,
          paddingBottom: 0,
          borderBottomWidth: 0,
        },
        topDetails: {
          fontSize: 10,
          textAlign: 'left',
          marginTop: 3,
        },
        bottomDetails: {
          fontSize: 10,
          marginTop: 3,
        },
        mainText: {
          fontSize: 14,
        },
        wriitenBy: {
          fontSize: 14,
          width: '100%',
          textAlign: 'right',
          marginTop: 10,
        },
        write: {
          fontSize: 14,
          textAlign: 'left',
          marginTop: 3,
        },
        date: {
          marginTop: 25,
          width: '100%',
          textAlign: 'right',
          fontSize: 10,
        },
        tableCell_1: {
          width: '5%',
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
        tableCell_2: {
          width: '50%',
          paddingRight: 16,
        },
        tableCell_3: {
          width: '15%',
        },
      }),
    [],
  );

function Noc({ nocData ,configs}) {
  const styles = useStyles();
  return (
    <>
      <Document>
        <Page size='A4' style={styles.page}>
          <View style={styles.watermarkContainer}>
            <Image src={logo} style={styles.watermarkImage} />
          </View>
          {/*<View style={styles.headerContainer}>*/}
          {/*  <Image source={logo} style={styles.logo} />*/}
          {/*  <View style={styles.logoContainer}>*/}
          {/*    <Text style={styles.headerText}>EASY GOLD</Text>*/}
          {/*    <Text style={styles.headerText2}>F I N C O R P</Text>*/}
          {/*    <Text style={styles.subText}>*/}
          {/*      Shop No.-3, First Floor, Shree Hari Complex, Yogi Chowk, Surat*/}
          {/*    </Text>*/}
          {/*  </View>*/}
          {/*  <View style={styles.my4}>*/}
          {/*    <Text*/}
          {/*      style={styles.branchDetails}>Branch: {nocData.customer.branch.address.street + ' ' + nocData.customer.branch.address.landmark}</Text>*/}
          {/*    <Text style={styles.branchDetails}>Branch code: {nocData.customer.branch.branchCode}</Text>*/}
          {/*    <Text style={styles.branchDetails}>Website: easygoldfincorp.com</Text>*/}
          {/*    <Text style={styles.branchDetails}>Email:{nocData.customer.branch.email}</Text>*/}
          {/*    <Text style={styles.branchDetails}>Mobile: {nocData.customer.branch.contact}</Text>*/}
          {/*  </View>*/}
          {/*</View>*/}
          <InvoiceHeader selectedRow={nocData} configs={configs}/>
          <View style={{... styles.pagePadding,lineHeight: 1.6,fontSize:9 }}>
            <View>
              <Text style={[styles.date, styles.fw]}>{fDate(new Date())}</Text>
            </View>
            <View>
              <Text style={[styles.topDetails, styles.fw]}>To,</Text>
              <Text
                style={styles.topDetails}>{`${nocData.customer.firstName} ${nocData.customer.middleName} ${nocData.customer.lastName}`}</Text>
              <Text
                style={styles.topDetails}>{`${nocData.customer.permanentAddress.street} ${nocData.customer.permanentAddress.landmark} ,${nocData.customer.permanentAddress.city}-${nocData.customer.permanentAddress.zipcode} ,${nocData.customer.permanentAddress.state}`}</Text>
              <Text style={styles.topDetails}>{nocData.customer.contact}</Text>
            </View>
            <View>
              <Text style={styles.nocTitle}>Subject: No Objection Certificate (NOC) for Closure of Gold Loan </Text>
            </View>
            <View style={styles.bottomDetails}>
              <Text style={styles.topDetails}>Dear,</Text>
              <Text
                style={styles.topDetails}>{`${nocData.customer.firstName} ${nocData.customer.middleName} ${nocData.customer.lastName}`}</Text>
              <Text style={styles.mt8}>
                <Text style={styles.bottomDetails}>This is to certify that the gold loan account bearing account number{' '}</Text>
                <Text style={[styles.fw, styles.bottomDetails]}>{nocData.customer.bankDetails.accountNumber}</Text>, held by{' '}
                <Text style={[styles.fw, styles.bottomDetails]}>{`${nocData.customer.firstName} ${nocData.customer.middleName} ${nocData.customer.lastName}`}</Text> with{' '}
                <Text style={[styles.fw, styles.bottomDetails]}>Easy Gold FinCorp</Text>, has been successfully closed
                as of{' '}
                <Text style={[styles.fw, styles.bottomDetails]}>{fDate(nocData.closingDate)}</Text>
                <Text style={styles.bottomDetails}> All outstanding dues and obligations related to the aforementioned
                  gold loan account have been duly settled.</Text>
              </Text>
            </View>
            <View style={styles.mt8}>
              <Text style={[styles.fw, styles.bottomDetails, styles.my4]}>Details of the closed gold loan
                account:</Text>
              <Text style={styles.bottomDetails}>- Loan Account Number: {nocData.customer.bankDetails.accountNumber}</Text>
              <Text style={styles.bottomDetails}>- Customer Name: {`${nocData.customer.firstName} ${nocData.customer.middleName} ${nocData.customer.lastName}`}</Text>
              <Text style={styles.bottomDetails}>- Loan Amount: {nocData.loanAmount}</Text>
              <Text style={styles.bottomDetails}>- Closing Charge: {nocData.closingCharge}</Text>
              <Text style={styles.bottomDetails}>- Date of Loan Disbursement: {fDate(nocData.issueDate)}</Text>
              <Text style={styles.bottomDetails}>- Closure Date: {fDate(nocData.closingDate)}</Text>
            </View>
            <View style={styles.mt8}>
              <Text style={styles.bottomDetails}>As a result, we hereby issue this No Objection Certificate (NOC),
                confirming that Easy Gold FinCorp has no objection or claims against {`${nocData.customer.firstName} ${nocData.customer.middleName} ${nocData.customer.lastName}`} regarding the closed gold loan account.</Text>
              <Text style={styles.bottomDetails}>Please note that this NOC is issued in good faith and in accordance
                with our internal procedures. It is provided solely for your records and future
                reference.
              </Text>
              <Text style={styles.bottomDetails}>Thank you for choosing Easy Gold FinCorp for your financial needs. We
                appreciate your continued trust and patronage.</Text>
            </View>
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

export default Noc;
