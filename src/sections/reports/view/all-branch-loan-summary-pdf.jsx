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
          position: "relative"
        },
        pagePadding: {
          padding: '15px',
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
          top:100,
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
          fontSize: 20,
          textAlign:'center',
          color:'#232C4B'
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
            width: '100%',
            borderRadius: 10,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: '#ddd',
            backgroundColor: '#fff',
          },
          tableHeader: {
            backgroundColor: '#232C4B',
            flexDirection: 'row',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingVertical: 10,
          },
          tableHeaderCell: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 8,
            textAlign: 'center',
            paddingHorizontal: 5,
            paddingVertical: 5,
          },
          tableRow: {
            flexDirection: 'row',
            paddingVertical: 8,
            backgroundColor: '#f9f9f9', // Alternating row background
          },
          tableRowAlt: {
            backgroundColor: '#fff', // Alternate row background
          },
          tableRowBorder: {
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
          },
          tableCell: {
            flex: 1,
            fontSize: 8,
            paddingHorizontal: 5,
            paddingVertical: 5,
            textAlign: 'center',
          },
          numericCell: {
            textAlign: 'right',
          },
          textCell: {
            textAlign: 'left',
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

export default function AllBranchLoanSummaryPdf({ selectedBranch , configs ,loans}) {
  const styles = useStyles();
  return (
    <>
      <Document>
        <Page size='A4' style={styles.page} orientation={'landscape'}>
          {/*<View style={styles.watermarkContainer}>*/}
          {/*  <Image src={logo} style={styles.watermarkImage} />*/}
          {/*</View>*/}
          <InvoiceHeader selectedBranch={selectedBranch} configs={configs}/>
          <View style={styles.pagePadding}>
            <View>
              <Text style={styles.subHeading}>All Branch Loan Summary</Text>
            </View>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 0.3 }]}>#</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 2.5 }]}>Loan No</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 3.5 }]}>Cus Name</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1 }]}>Mo No</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 0.5 }]}>Int%</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 0.6 }]}>Other Int%</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1.5 }]}>Issue Date</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1.2 }]}>Loan Amt</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 2 }]}>Last Amt Pay Date</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 2 }]}>Loan Amount Pay</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 2 }]}>Loan Int. Amt</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 2 }]}>Last Int. Pay Date</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1.5 }]}>Total Pay Int.</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 0.7 }]}>Day</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1.5 }]}>Pending Int.</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1.5 }]}>Next Int. Pay Date</Text>
              </View>

              {/* Table Rows */}
              {loans.map((row, index) => (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowAlt : null,
                    styles.tableRowBorder,
                  ]}
                >
                  <Text style={[styles.tableCell, styles.numericCell, { flex: 0.3 }]}>{index + 1}</Text>
                  <Text style={[styles.tableCell, { flex: 2.5 }]} numberOfLines={1} ellipsizeMode="tail">
                    {row.loanNo}
                  </Text>
                  <Text style={[styles.tableCell, styles.textCell, { flex: 3.5 }]} numberOfLines={1} ellipsizeMode="tail">
                    {`${row.customer.firstName} ${row.customer.middleName} ${row.customer.lastName}`}
                  </Text>
                  <Text style={[styles.tableCell, styles.numericCell, { flex: 1.5 }]}>{row.customer.contact}</Text>
                  <Text style={[styles.tableCell, styles.numericCell, { flex: 0.5 }]}>{row.scheme.interestRate}</Text>
                  <Text style={[styles.tableCell, styles.numericCell, { flex: 0.5 }]}>{row.consultingCharge}</Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>{fDate(row.issueDate)}</Text>
                  <Text style={[styles.tableCell, styles.numericCell, { flex: 1.5 }]}>₹{row.loanAmount}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{fDate(row.lastInstallmentDate) || '-'}</Text>
                  <Text style={[styles.tableCell, styles.numericCell, { flex: 2 }]}>
                    ₹{row.loanAmount - row.interestLoanAmount}
                  </Text>
                  <Text style={[styles.tableCell, styles.numericCell, { flex: 2 }]}>
                    ₹{row.interestLoanAmount}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{fDate(row.lastInstallmentDate) || '-'}</Text>
                  <Text style={[styles.tableCell, styles.numericCell, { flex: 1.5 }]}>₹{'Total Pay Int.'}</Text>
                  <Text style={[styles.tableCell, styles.numericCell, { flex: 1 }]}>113</Text>
                  <Text style={[styles.tableCell, styles.numericCell, { flex: 1.5 }]}>₹947.34</Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>{fDate(row.nextInstallmentDate)}</Text>
                </View>
              ))}
            </View>



          </View>
        </Page>
      </Document>
    </>
  );
}
