import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';
import logo from 'src/assets/logo/pdf-logo.png';
import { fDate } from 'src/utils/format-time';
import Qr from 'src/assets/icon/qr.png';
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
Font.register({
  family: 'Poppins',
  src: '/fonts/Overpass-VariableFont_wght.ttf',
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
          position: 'relative',
        },
        pagePadding: {
          padding: '0px 24px 24px 24px',
        },
        pagePadding2: {
          padding: '0px 24px 24px 24px',
          height: '93%',
        },

        // footer: {
        //   left: 0,
        //   right: 0,
        //   bottom: 0,
        //   padding: 24,
        //   margin: 'auto',
        //   borderTopWidth: 1,
        //   borderStyle: 'solid',
        //   position: 'absolute',
        //   borderColor: '#DFE3E8',
        // },
        gridContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        logoContainer: {
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        },
        flexContainer: {
          flexDirection: 'row',
          marginTop: 5,
          justifyContent: 'space-between',
          alignItems: 'flex-start',
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
          fontFamily: 'Poppins',
          // width: "100%",
          // textAlign: 'right',
          // marginTop: 10,
          // fontFamily: 'NotoSansGujarati',
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

        subHeading: {
          fontWeight: 600,
          fontSize: 10,
        },
        subText: {
          fontSize: 10,
          fontWeight:'medium'
        },
        spacing: {
          marginTop: 7,
        },

        img: {
          height: '48px',
          width: '48px',
          borderRadius: 5,
        },
        customerImg:{
          height: '90px',
          width: '90px',
          borderRadius: 5,
        },
        table: {
          width: 'auto',
          borderRadius: 10,
          flex: 2,
        },
        tableFooter: {
          // color: '#fff',
          // backgroundColor: '#232C4B',
          borderTop: '1px solid #232C4B',
          fontWeight: 'bold',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          paddingVertical: 8,

        },
        tableHeader: {
          color: '#fff',
          backgroundColor: '#232C4B',
          fontWeight: 'bold',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          textWrap: 'nowrap',
          paddingVertical: 6,
        },

        tableRow: {
          flexDirection: 'row',
          borderStyle: 'solid',
          paddingVertical: 5,
          textWrap: 'nowrap',
        },
        tableRowBorder: {
          borderBottom: '1.5px solid gray',
        },
        tableCell: {
          flex: 1,
          fontSize: 10,
          paddingHorizontal: 4,
          textAlign: 'center',
        },
        heading: {
          fontSize: '13px',
          fontWeight: '500',
          marginBottom: 5,
        },

        propertyCellHeading: {
          fontSize: 12,
          fontWeight: '500',
          textAlign: 'center',
          marginBottom: 5,
          marginLeft: 18,
        },
        propertyImage: {
          height: '96px',
          width: '96px',
          borderRadius: 8,
        },
        tableFlex: {
          flexDirection: 'row',
          marginTop: 15,
          width: '100%',
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
        d_flex: {
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          // marginTop: 90,
          alignItems: 'center',
          justifyContent: 'space-between',
          // position:'fixed',
          // bottom:-50
        },
        signText: {
          fontSize: 11,
          borderTop: '1px solid 232C4B',
          color:'#232C4B',
          paddingTop: 10,
          textAlign: 'center',
          width: '100px',
          fontWeight: 600,

        },
      }),
    [],
  );

// ----------------------------------------------------------------------

export default function LoanIssueDetails({ selectedRow , configs }) {
  const styles = useStyles();
  const renewDate = () => {
    if (!selectedRow?.issueDate) return null;

    const { issueDate, scheme: { renewalTime } } = selectedRow;

    const monthsToAdd =
      renewalTime === 'Monthly' ? 1 :
        renewalTime === 'Yearly' ? 12 :
          parseInt(renewalTime.split(' ')[0], 10) || 0;

    const renewedDate = new Date(new Date(issueDate).setMonth(new Date(issueDate).getMonth() + monthsToAdd));
    return fDate(renewedDate);
  };

  return (
    <>
      <Document>
        <Page size='A4' style={styles.page}>
          <View style={styles.watermarkContainer}>
            <Image src={logo} style={styles.watermarkImage} />
          </View>
          <InvoiceHeader selectedRow={selectedRow} configs={configs}/>
          <View style={styles.pagePadding}>
            <View style={styles.flexContainer}>
              <View style={{ width: '40%' }}>
                <Text style={styles.spacing}>
                  <Text style={styles.subHeading}>Loan No : {' '}</Text>
                  <Text style={styles.subText}>{selectedRow.loanNo}</Text>
                </Text>
                <Text style={styles.spacing}>
                  <Text style={styles.subHeading}>Loan Type : {' '}</Text>
                  <Text style={styles.subText}>{selectedRow.loanType}</Text>
                </Text>
                <Text style={styles.spacing}>
                  <Text style={styles.subHeading}>Name : {' '}</Text>
                  <Text
                    style={styles.subText}>{`${selectedRow.customer.firstName} ${selectedRow.customer.middleName} ${selectedRow.customer.lastName}`}</Text>
                </Text>
                <Text style={styles.spacing}>
                  <Text style={styles.subHeading}>Address :{' '}</Text>
                  <Text
                    style={{
                      ...styles.subText,
                      textWrap: 'wrap',
                      fontSize:9
                    }}>{`${selectedRow.customer.permanentAddress.street} , ${selectedRow.customer.permanentAddress.landmark} , ${selectedRow.customer.permanentAddress.city} , ${selectedRow.customer.permanentAddress.zipcode}`}</Text>
                </Text>
                <Text style={styles.spacing}>
                  <Text style={styles.subHeading}>Pan No :{' '}</Text>
                  <Text style={styles.subText}>{selectedRow.customer.panCard}</Text>
                </Text>
                <Text style={styles.spacing}>
                  <Text style={styles.subHeading}>Aadhar Card No :{' '}</Text>
                  <Text style={styles.subText}>{selectedRow.customer.aadharCard}</Text>
                </Text>
                <Text style={styles.spacing}>
                  <Text style={styles.subHeading}>Mobile No :{' '}</Text>
                  <Text style={styles.subText}>{selectedRow.customer.contact}</Text>
                </Text>
              </View>
              <View>
                <Text style={styles.spacing}>
                  <Text style={styles.subHeading}>Loan Amount : {' '}</Text>
                  <Text style={styles.subText}>{selectedRow.loanAmount}</Text>
                </Text>
                <Text style={styles.spacing}>
                  <Text style={styles.subHeading}>Interest Rate : {' '}</Text>
                  <Text
                    style={styles.subText}>{selectedRow?.scheme.interestRate > 1.5 ? 1.5 : selectedRow?.scheme.interestRate}%</Text>
                </Text>
                <Text style={styles.spacing}>
                  <Text style={styles.subHeading}>Consult Charge : {' '}</Text>
                  <Text style={styles.subText}>{selectedRow?.consultingCharge}%</Text>
                </Text>
                <Text style={styles.spacing}>
                  <Text style={styles.subHeading}>Loan Int Pay Schedule
                    : {' '}</Text>
                  <Text style={styles.subText}>{selectedRow.scheme.interestPeriod}</Text>
                </Text>
                <Text style={styles.spacing}>
                  <Text style={styles.subHeading}>Issue Date : {' '}</Text>
                  <Text style={styles.subText}>{fDate(selectedRow.issueDate)}</Text>
                </Text>
                <Text style={styles.spacing}>
                  <Text style={styles.subHeading}>Next Int Date : {' '}</Text>
                  <Text style={styles.subText}>{fDate(selectedRow.nextInstallmentDate)}</Text>
                </Text>
                <Text style={styles.spacing}>
                  <Text style={styles.subHeading}>Renew Date : {' '}</Text>
                  <Text style={styles.subText}>{renewDate()}</Text>
                </Text>
              </View>
              <View style={{marginTop:-60}}>
                {/*<Text style={styles.propertyCellHeading}>Property Image</Text>*/}
                <View>
                  <Image style={styles.propertyImage} src={selectedRow.customer.avatar_url} />
                </View>
                <View style={{marginTop:5}}>
                  <Image style={styles.propertyImage} src={selectedRow.propertyImage} />
                </View>
              </View>
            </View>
            <View style={{ position: 'absolute', top: -68, right: 155 }}>
              <View>
                <Image style={styles.img} src={Qr} />
              </View>

            </View>

            <View style={styles.tableFlex}>
              <View style={styles.table}>
                <View><Text style={styles.heading}>Property Details</Text></View>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>Property Name</Text>
                  <Text style={styles.tableCell}>Qty</Text>
                  <Text style={styles.tableCell}>Total Wt</Text>
                  <Text style={styles.tableCell}>Net Wt</Text>
                  <Text style={styles.tableCell}>Net Amt</Text>
                  <Text style={styles.tableCell}>Part Close Date</Text>
                  <Text style={styles.tableCell}>Sign</Text>
                </View>

                {selectedRow.propertyDetails.map((row, index) => (
                  <View key={index} style={[styles.tableRow, styles.tableRowBorder]}>
                    <Text style={styles.tableCell}>{row.type}</Text>
                    <Text style={styles.tableCell}>{row.pcs}</Text>
                    <Text style={styles.tableCell}>{row.totalWeight}</Text>
                    <Text style={styles.tableCell}>{row.netWeight}</Text>
                    <Text style={styles.tableCell}>{row.netAmount}</Text>
                    <Text style={styles.tableCell}></Text>
                    <Text style={styles.tableCell}></Text>
                  </View>
                ))}

                <View style={[styles.tableRow, styles.tableFooter]}>
                  <Text style={styles.tableCell}>Total</Text>
                  <Text
                    style={styles.tableCell}> {selectedRow.propertyDetails.reduce((prev, next) => prev + (Number(next?.pcs) || 0), 0)}</Text>
                  <Text
                    style={styles.tableCell}> {selectedRow.propertyDetails.reduce((prev, next) => prev + (Number(next?.totalWeight) || 0), 0)}</Text>
                  <Text
                    style={styles.tableCell}> {selectedRow.propertyDetails.reduce((prev, next) => prev + (Number(next?.netWeight) || 0), 0)}</Text>
                  <Text
                    style={styles.tableCell}> {selectedRow.propertyDetails.reduce((prev, next) => prev + (Number(next?.netAmount) || 0), 0)}</Text>
                  <Text style={styles.tableCell}></Text>
                  <Text style={styles.tableCell}></Text>
                </View>
              </View>
            </View>

          </View>

        </Page>
        <Page size='A4' style={styles.page}>
          <View style={styles.pagePadding2}>
          <view style={{ marginTop: 20 }}>
            <Text style={styles.termsAndConditionsHeaders}>Terms And Conditions</Text>
            <View style={{ marginTop: 10 }}>
              {configs.exportPolicyConfig.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                  <Text style={{ ...styles.subText, marginRight: 4 }}>•</Text> {/* Bullet point */}
                  <Text style={{ ...styles.subText }}>{item}</Text> {/* Condition text */}
                </View>
              ))}
            </View>
          </view>
          </View>
          <View style={styles.d_flex}>
            <Text style={{ ...styles.signText, marginLeft: 35 }}>Authority Sign</Text>
            <Text style={{ ...styles.signText, marginRight: 35 }}>Easy Gold FinCorp</Text>
          </View>
        </Page>
      </Document>
    </>
  );
}
