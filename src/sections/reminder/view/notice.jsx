import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';
import logo from 'src/assets/logo/pdf-logo.png';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import LoanInvoice from '../../../components/invoise/invoice-header';
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
          padding: '0px 24px 24px 24px',
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

        subText: {
          color: '#FFFFFF',
          fontSize: 10,
          marginBottom: 2,
          marginTop: 10,
          fontWeight: 'bold',
          marginLeft: -145,
          width: '40%',
        },
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

// ----------------------------------------------------------------------

export default function Notice({noticeData ,configs}) {
  const styles = useStyles();
  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.watermarkContainer}>
            <Image src={logo} style={styles.watermarkImage} />
          </View>
          <InvoiceHeader selectedRow={noticeData} configs={configs}/>
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
          {/*    <Text style={styles.branchDetails}>Branch: {noticeData.customer.branch.address.street + " " + noticeData.customer.branch.address.landmark}</Text>*/}
          {/*    <Text style={styles.branchDetails}>Branch code: {noticeData.customer.branch.branchCode}</Text>*/}
          {/*    <Text style={styles.branchDetails}>Website: easygoldfincorp.com</Text>*/}
          {/*    <Text style={styles.branchDetails}>Email:*/}
          {/*      {noticeData.customer.branch.email}</Text>*/}
          {/*    <Text style={styles.branchDetails}>Mobile: {noticeData.customer.branch.contact}</Text>*/}
          {/*  </View>*/}
          {/*</View>*/}
          <View style={styles.pagePadding}>
            <View>
              <Text style={styles.noticeTitle}>નોટીસ</Text>
              <Text style={styles.date}>{fDate(new Date())}</Text>
            </View>
            <View>
              <Text style={styles.topDetails}>{`${noticeData.customer.firstName} ${noticeData.customer.middleName} ${noticeData.customer.lastName}`}</Text>
              <Text style={styles.topDetails}>{`${noticeData.customer.permanentAddress.street} ${noticeData.customer.permanentAddress.landmark} ,${noticeData.customer.permanentAddress.city}-${noticeData.customer.permanentAddress.zipcode} ,${noticeData.customer.permanentAddress.state}`}</Text>
              <Text style={styles.topDetails}>{noticeData.customer.contact}</Text>
            </View>
            <View>
              <Text style={styles.noticeTitle}>વિષય : ગોલ્ડ જપ્ત કરવા બાબત</Text>
            </View>
            <View style={styles.bottomDetails}>
              <Text style={styles.bottomDetails}>આદરણીય શ્રી,</Text>
              <Text style={styles.bottomDetails}>આથી, જણાવવાનું કે તમે આ EASY GOLD FINCORP માંથી તારીખ {fDate(noticeData.issueDate)} ના રોજ લીધેલી ગોલ્ડ લોન અકે રૂપિયા {noticeData.loanAmount}.00/- નું વ્યાજ કંપનીના નિયમ પ્રમાણે મુદત સુધીમાં ભરપાય કરેલ નથી. આથી નોટીસ આપવામાં આવે છે કે તારીખ {fDate(noticeData.nextInstallmentDate)} સુધીમાં બાકી નીકળતી વ્યાજની રકમ ભરપાય કરી જવી. જો કંપનીએ આપેલી મુદત સુધીમાં તમે હાજર ન થતા કંપની પોતાના ધારા-ધોરણ પ્રમાણે તમારા ગોલ્ડની હરાજી કરશે અને બદલામાં મળેલ જે-તે રકમ તમારા ખાતે જમા કે ઉધાર કરી બાકી નીકળતી રકમની લેવડ-દેવડ કાયદેસરની કાર્યવાહી કરવામાં આવશે. જેની દરેકે ખાતરીપૂર્વક નોંધ લેવી. નિયત મુદત સુધીમાં મળવા ન આવનાર વ્યક્તિઓએ ગોલ્ડ બાબતની કોઈ પણ પ્રકારની તકરાર કરવી નહિ તેમજ એના માટે EASY GOLD FINCORP જવાબદાર રહેશે નહિ તેની દરેક ગ્રાહક મિત્રએ ખાસ નોંધ લેવી.</Text>
              <Text style={styles.wriitenBy}>લી. મેનેજમેન્ટ</Text>
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
}
