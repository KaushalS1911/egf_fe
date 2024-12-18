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

export default function AllBranchLoanSummaryPdf({ branch , configs }) {
  const styles = useStyles();

  return (
    <>
      <Document>
        <Page size='A4' style={styles.page}>
          <View style={styles.watermarkContainer}>
            <Image src={logo} style={styles.watermarkImage} />
          </View>
          <InvoiceHeader branch={branch} configs={configs}/>

        </Page>
      </Document>
    </>
  );
}
