import React, { useMemo } from 'react';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';
import logo from 'src/assets/logo/pdf-logo.png';
import { fDate } from 'src/utils/format-time';
import Qr from 'src/assets/icon/qr.png';
import InvoiceHeader from '../../../components/invoise/invoice-header';
import InvoiceFooter from '../../../components/invoise/invoice-footer.jsx';

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

Font.register({
  family: 'Poppins',
  src: '/fonts/Overpass-VariableFont_wght.ttf',
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
          border: '3px solid #000',
          padding: '1px',
        },
        pagePadding: {
          padding: '0px 24px 24px 24px',
          height: '75.8%',
        },
        pagePadding2: {
          padding: '0px 24px 24px 24px',
          height: '87.8%',
        },
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
          // marginTop: 5,
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
        row: {
          flexDirection: 'row',
          marginVertical: 2,
        },
        subHeading: {
          fontWeight: '600',
          fontSize: 10,
          flex: 1,
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
        spacing: {
          marginTop: 7,
        },
        img: {
          height: '72px',
          width: '72px',
          borderRadius: 5,
        },
        customerImg: {
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
          borderTop: '1px solid #232C4B',
          fontWeight: 'bold',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          paddingVertical: 8,
        },
        tableHeader: {
          backgroundColor: '#5B9BD4',
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
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16.9,
        },
        signText: {
          fontSize: 11,
          borderTop: '1px solid 232C4B',
          color: '#232C4B',
          paddingTop: 10,
          textAlign: 'center',
          width: '100px',
          fontWeight: 600,
        },
        detailsSpacing: {
          marginLeft: 20,
          fontSize: 10,
        },
      }),
    []
  );

// ----------------------------------------------------------------------

export default function LoanIssueDetails({ selectedRow, configs }) {
  const styles = useStyles();
  const renewDate = () => {
    if (!selectedRow?.issueDate) return null;
    const {
      issueDate,
      scheme: { renewalTime },
    } = selectedRow;
    const monthsToAdd =
      renewalTime === 'Monthly'
        ? 1
        : renewalTime === 'Yearly'
          ? 12
          : parseInt(renewalTime.split(' ')[0], 10) || 0;
    const renewedDate = new Date(
      new Date(issueDate).setMonth(new Date(issueDate).getMonth() + monthsToAdd)
    );
    return fDate(renewedDate);
  };

  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{ border: '1px solid #000' }}>
            <View style={styles.watermarkContainer}>
              <Image src={logo} style={styles.watermarkImage} />
            </View>
            <InvoiceHeader selectedRow={selectedRow} configs={configs} />
            <View style={styles.pagePadding}>
              <View
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  marginRight: 25,
                  marginBottom: 10,
                }}
              >
                <Text style={styles.termsAndConditionsHeaders}>SANCTION LETTER</Text>
              </View>
              <View style={{ ...styles.flexContainer, gap: 20 }}>
                <View style={{ width: '48%' }}>
                  <View style={styles.row}>
                    <Text style={styles.subHeading}>Loan No</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{selectedRow?.loanNo}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.subHeading}>Loan Type</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{selectedRow?.loanType}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.subHeading}>Name</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={{ ...styles.subText, wordWrap: 'break-word', textWrap: 'wrap' }}>
                      {`${selectedRow.customer.firstName || ''} ${selectedRow.customer.middleName || ''} ${selectedRow.customer.lastName || ''}`.trim()}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.subHeading}>Address</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text
                      style={{
                        ...styles.subText,
                        textWrap: 'wrap',
                        fontSize: 9,
                      }}
                    >{`${selectedRow.customer.permanentAddress.street} , ${selectedRow.customer.permanentAddress.landmark} , ${selectedRow.customer.permanentAddress.city} , ${selectedRow.customer.permanentAddress.zipcode}`}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.subHeading}>Pan No</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{selectedRow.customer.panCard}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.subHeading}>Aadhar Card No</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{selectedRow.customer.aadharCard}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.subHeading}>Mobile No</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{selectedRow.customer.contact}</Text>
                  </View>
                </View>
                <View style={{ width: '46%' }}>
                  <View style={styles.row}>
                    <Text style={{ ...styles.subHeading, flex: 2 }}>Loan Amount</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{selectedRow.loanAmount}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={{ ...styles.subHeading, flex: 2 }}>Interest Rate</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>
                      {selectedRow?.scheme.interestRate > 1.5
                        ? 1.5
                        : selectedRow?.scheme.interestRate}
                      %
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={{ ...styles.subHeading, flex: 2 }}>Consult Charge</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{selectedRow?.consultingCharge}%</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={{ ...styles.subHeading, flex: 2 }}>Approval Charge</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{selectedRow?.approvalCharge}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={{ ...styles.subHeading, flex: 2 }}>Loan Int Pay Schedule</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{selectedRow.scheme.interestPeriod}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={{ ...styles.subHeading, flex: 2 }}>Issue Date</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{fDate(selectedRow.issueDate)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={{ ...styles.subHeading, flex: 2 }}>Next Int Date</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{fDate(selectedRow.nextInstallmentDate)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={{ ...styles.subHeading, flex: 2 }}>Renew Date</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.subText}>{renewDate()}</Text>
                  </View>
                </View>
                <View style={{ marginRight: '24px' }}>
                  {/*<Text style={styles.propertyCellHeading}>Property Image</Text>*/}
                  <View>
                    <Image style={styles.propertyImage} src={selectedRow.customer.avatar_url} />
                  </View>
                  <View style={{ marginTop: 5 }}>
                    <Image style={styles.propertyImage} src={selectedRow.propertyImage} />
                  </View>
                </View>
              </View>
              <View style={{ position: 'absolute', top: -78, right: 30 }}>
                <View>
                  <Image style={styles.img} src={Qr} />
                </View>
              </View>
              <View style={{ ...styles.tableFlex, marginTop: -15 }}>
                <View style={styles.table}>
                  <View>
                    <Text style={styles.heading}>Property Details</Text>
                  </View>
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={[styles.tableCell, { minWidth: 100 }]}>Property Name</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>Qty</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>Total Wt</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>Net Wt</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>Net Amt</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>Part Close Date</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>Sign</Text>
                  </View>

                  {selectedRow.propertyDetails.map((row, index) => (
                    <View key={index} style={[styles.tableRow, styles.tableRowBorder]}>
                      <Text style={[styles.tableCell, { minWidth: 100 }]}>{row.type}</Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}>{row.pcs}</Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}>
                        {Number(row.totalWeight).toFixed(2)}
                      </Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}>
                        {Number(row.netWeight).toFixed(2)}
                      </Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}>{row.netAmount}</Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                    </View>
                  ))}

                  <View
                    style={{
                      ...styles.tableRow,
                      ...styles.tableFooter,
                      borderTopWidth: 3,
                      borderTopColor: '#000',
                      borderTopStyle: 'solid',
                    }}
                  >
                    <Text style={[styles.tableCell, { minWidth: 100 }]}>Total</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      {selectedRow.propertyDetails.reduce(
                        (prev, next) => prev + (Number(next?.pcs) || 0),
                        0
                      )}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      {selectedRow.propertyDetails
                        .reduce((prev, next) => prev + (Number(next?.totalWeight) || 0), 0)
                        .toFixed(2)}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      {selectedRow.propertyDetails
                        .reduce((prev, next) => prev + (Number(next?.netWeight) || 0), 0)
                        .toFixed(2)}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      {selectedRow.propertyDetails
                        .reduce((prev, next) => prev + (Number(next?.netAmount) || 0), 0)
                        .toFixed(2)}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                  </View>
                </View>
              </View>
            </View>{' '}
            <View style={styles.d_flex}>
              <Text style={{ ...styles.signText, marginLeft: 35 }}>Authority Sign</Text>{' '}
              <Text style={{ ...styles.signText, marginRight: 35 }}>Easy Gold FinCorp</Text>
            </View>
            <InvoiceFooter configs={configs} />
          </View>
        </Page>
        <Page size="A4" style={styles.page}>
          <View style={{ border: '1px solid #000' }}>
            <View style={styles.pagePadding2}>
              <view style={{ marginTop: 20 }}>
                <Text style={styles.termsAndConditionsHeaders}>Terms And Conditions</Text>
                <View style={{ marginTop: 10 }}>
                  {configs.exportPolicyConfig.map((item, index) => (
                    <View
                      key={index}
                      style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: '500', marginRight: 4 }}>•</Text>{' '}
                      <Text style={{ fontSize: 10, fontWeight: '500' }}>{item}</Text>{' '}
                    </View>
                  ))}
                </View>
              </view>
            </View>
            <View style={styles.d_flex}>
              <Text style={{ ...styles.signText, marginLeft: 35 }}>Authority Sign</Text>
              <Text style={{ ...styles.signText, marginRight: 35 }}>Easy Gold FinCorp</Text>
            </View>
            <InvoiceFooter configs={configs} />
          </View>
        </Page>
      </Document>
    </>
  );
}
