import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';
import logo from 'src/assets/logo/pdf-logo.png'
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

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
          fontSize: 9,
          lineHeight: 1.6,
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
        subText: {
          color: '#FFFFFF',
          fontSize: 10,
          marginBottom: 2,
          marginTop: 10,
          fontWeight: 'bold',
          marginLeft: -145,
          width: '40%'
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
          textAlign: 'center'
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
        mainText:{
          fontSize: 14,
          fontFamily: 'Roboto',
          // width: "100%",
          // textAlign: 'right',
          // marginTop: 10,
          // fontFamily: 'NotoSansGujarati',
        },
        wriitenBy: {
          fontSize: 14,
          width: "100%",
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
          width: "100%",
          textAlign: "right",
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
      }),
    []
  );

// ----------------------------------------------------------------------

export default function Notice() {


  const styles = useStyles();

  return (
    <>
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Image source={logo} style={styles.logo} />
          <View style={styles.logoContainer}>
            <Text style={styles.headerText}>EASY GOLD</Text>
            <Text style={styles.headerText2}>F I N C O R P</Text>
            <Text style={styles.subText}>
              Shop No.-3, First Floor, Shree Hari Complex, Yogi Chowk, Surat
            </Text>
          </View>
          <View style={styles.my4}>
            <Text style={styles.branchDetails}>Branch: Yogi Chowk</Text>
            <Text style={styles.branchDetails}>Branch code: EGF1</Text>
            <Text style={styles.branchDetails}>Website: www.easygoldfincorp.com</Text>
            <Text style={styles.branchDetails}>Email: egfincorp2511@gmail.com</Text>
            <Text style={styles.branchDetails}>Mobile: 79900 28003</Text>
          </View>
        </View>
        <View style={styles.pagePadding}>
        <View>
            <Text style={styles.noticeTitle}>નોટીસ</Text>
            <Text style={styles.date}>27 Nov 2024</Text>
        </View>
        <View>
            <Text style={styles.topDetails}>RAJUBHAI POPATBHAI RADADIYA</Text>
            <Text style={styles.topDetails}>29-30, MANIBA PARK SOC, NEAR KAILASHDHAM, BAJRANG NAGAR, PUNAGAM, SURAT-395010</Text>
            <Text style={styles.topDetails}>9727020943</Text>
        </View>
        <View>
          <Text style={styles.noticeTitle}>વિષય : સોનું જપ્ત કરવા બાબત</Text>
        </View>
        <View style={styles.bottomDetails}>
          <Text style={styles.bottomDetails}>આદરણીય શ્રી,</Text>
          {/*<view><Text style={styles.wriitenBy}>આથી, જણાવવાનું કે તમે આ</Text>{' '} <Text style={styles.mainText}>EASY GOLD FINCORP</Text><Text style={styles.wriitenBy}>માંથી તારીખ 05 Jul 2024 ના રોજ લીધેલી ગોલ્ડ લોન અંકે રૂપિયા 205000.00/- નું વ્યાજ કંપનીના નિયમ પ્રમાણે મુદત સુધીમાં ભરપાય કરેલ નથી. આથી નોટીસ આપવામાં આવે છે કે તારીખ 07 Dec 2024 સુધીમાં બાકી નીકળતી વ્યાજની રકમ ભરપાય કરી જવી. જો કંપનીએ આપેલી મુદત સુધીમાં તમે હાજર ન થતા કંપની પોતાના ધારા-ધોરણ પ્રમાણે તમારા તમારા ગોલ્ડની હરાજી કરશે અને બદલામાં મળેલ જે-તે રકમ તમારા ખાતે જમા કે ઉધાર કરી બાકી નીકળતી રકમની લેવડ-દેવડ કાયદેસરની કાર્યવાહી કરવામાં આવશે. જેની દરેકે ખાતરીપૂર્વક નોંધ લેવી. નિયત મુદત સુધીમાં મળવા ન આવનાર વ્યક્તિઓએ ગોલ્ડ બાબતની કોઈ પણ પ્રકારની તકરાર કરવી નહિ તેમજ એના માટે</Text> {' '} <Text style={styles.mainText}>EASY GOLD FINCORP</Text><Text style={styles.wriitenBy}> જવાબદાર રહેશે નહિ તેની દરેક ગ્રાહક મિત્રએ ખાસ નોંધ લેવી.</Text></view>*/}
          <Text style={styles.bottomDetails}>આથી, જણાવવાનું કે તમે આ માંથી તારીખ 05 Jul 2024 ના રોજ લીધેલી ગોલ્ડ લોન અંકે રૂપિયા નું વ્યાજ કંપનીના નિયમ પ્રમાણે મુદત સુધીમાં ભરપાય કરેલ નથી. આથી નોટીસ આપવામાં આવે છે કે તારીખ 07 Dec 2024 સુધીમાં બાકી નીકળતી વ્યાજની રકમ ભરપાય કરી જવી. જો કંપનીએ આપેલી મુદત સુધીમાં તમે હાજર ન થતા કંપની પોતાના ધારા-ધોરણ પ્રમાણે તમારા તમારા ગોલ્ડની હરાજી કરશે અને બદલામાં મળેલ જે-તે રકમ તમારા ખાતે જમા કે ઉધાર કરી બાકી નીકળતી રકમની લેવડ-દેવડ કાયદેસરની કાર્યવાહી કરવામાં આવશે. જેની દરેકે ખાતરીપૂર્વક નોંધ લેવી. નિયત મુદત સુધીમાં મળવા ન આવનાર વ્યક્તિઓએ ગોલ્ડ બાબતની કોઈ પણ પ્રકારની તકરાર કરવી નહિ તેમજ એના માટે જવાબદાર રહેશે નહિ તેની દરેક ગ્રાહક મિત્રએ ખાસ નોંધ લેવી.</Text>
          <Text style={styles.wriitenBy}>લી. મેનેજમેન્ટ</Text>
        </View>
        </View>
    {/*    <View style={[styles.gridContainer, styles.mb40]}>*/}
    {/*      <View style={styles.col6}>*/}
    {/*        <Text style={[styles.subtitle2, styles.mb4]}>Invoice from</Text>*/}
    {/*        <Text style={styles.body2}>{invoiceFrom.name}</Text>*/}
    {/*        <Text style={styles.body2}>{invoiceFrom.fullAddress}</Text>*/}
    {/*        <Text style={styles.body2}>{invoiceFrom.phoneNumber}</Text>*/}
    {/*      </View>*/}

    {/*      <View style={styles.col6}>*/}
    {/*        <Text style={[styles.subtitle2, styles.mb4]}>Invoice to</Text>*/}
    {/*        <Text style={styles.body2}>{invoiceTo.name}</Text>*/}
    {/*        <Text style={styles.body2}>{invoiceTo.fullAddress}</Text>*/}
    {/*        <Text style={styles.body2}>{invoiceTo.phoneNumber}</Text>*/}
    {/*      </View>*/}
    {/*    </View>*/}

    {/*    <View style={[styles.gridContainer, styles.mb40]}>*/}
    {/*      <View style={styles.col6}>*/}
    {/*        <Text style={[styles.subtitle2, styles.mb4]}>Date create</Text>*/}
    {/*        <Text style={styles.body2}>{fDate(createDate)}</Text>*/}
    {/*      </View>*/}
    {/*      <View style={styles.col6}>*/}
    {/*        <Text style={[styles.subtitle2, styles.mb4]}>Due date</Text>*/}
    {/*        <Text style={styles.body2}>{fDate(dueDate)}</Text>*/}
    {/*      </View>*/}
    {/*    </View>*/}

    {/*    <Text style={[styles.subtitle1, styles.mb8]}>Invoice Details</Text>*/}

    {/*    <View style={styles.table}>*/}
    {/*      <View>*/}
    {/*        <View style={styles.tableRow}>*/}
    {/*          <View style={styles.tableCell_1}>*/}
    {/*            <Text style={styles.subtitle2}>#</Text>*/}
    {/*          </View>*/}

    {/*          <View style={styles.tableCell_2}>*/}
    {/*            <Text style={styles.subtitle2}>Description</Text>*/}
    {/*          </View>*/}

    {/*          <View style={styles.tableCell_3}>*/}
    {/*            <Text style={styles.subtitle2}>Qty</Text>*/}
    {/*          </View>*/}

    {/*          <View style={styles.tableCell_3}>*/}
    {/*            <Text style={styles.subtitle2}>Unit price</Text>*/}
    {/*          </View>*/}

    {/*          <View style={[styles.tableCell_3, styles.alignRight]}>*/}
    {/*            <Text style={styles.subtitle2}>Total</Text>*/}
    {/*          </View>*/}
    {/*        </View>*/}
    {/*      </View>*/}

    {/*      <View>*/}
    {/*        {items.map((item, index) => (*/}
    {/*          <View style={styles.tableRow} key={item.id}>*/}
    {/*            <View style={styles.tableCell_1}>*/}
    {/*              <Text>{index + 1}</Text>*/}
    {/*            </View>*/}

    {/*            <View style={styles.tableCell_2}>*/}
    {/*              <Text style={styles.subtitle2}>{item.title}</Text>*/}
    {/*              <Text>{item.description}</Text>*/}
    {/*            </View>*/}

    {/*            <View style={styles.tableCell_3}>*/}
    {/*              <Text>{item.quantity}</Text>*/}
    {/*            </View>*/}

    {/*            <View style={styles.tableCell_3}>*/}
    {/*              <Text>{item.price}</Text>*/}
    {/*            </View>*/}

    {/*            <View style={[styles.tableCell_3, styles.alignRight]}>*/}
    {/*              <Text>{fCurrency(item.price * item.quantity)}</Text>*/}
    {/*            </View>*/}
    {/*          </View>*/}
    {/*        ))}*/}

    {/*        <View style={[styles.tableRow, styles.noBorder]}>*/}
    {/*          <View style={styles.tableCell_1} />*/}
    {/*          <View style={styles.tableCell_2} />*/}
    {/*          <View style={styles.tableCell_3} />*/}
    {/*          <View style={styles.tableCell_3}>*/}
    {/*            <Text>Subtotal</Text>*/}
    {/*          </View>*/}
    {/*          <View style={[styles.tableCell_3, styles.alignRight]}>*/}
    {/*            <Text>{fCurrency(subTotal)}</Text>*/}
    {/*          </View>*/}
    {/*        </View>*/}

    {/*        <View style={[styles.tableRow, styles.noBorder]}>*/}
    {/*          <View style={styles.tableCell_1} />*/}
    {/*          <View style={styles.tableCell_2} />*/}
    {/*          <View style={styles.tableCell_3} />*/}
    {/*          <View style={styles.tableCell_3}>*/}
    {/*            <Text>Shipping</Text>*/}
    {/*          </View>*/}
    {/*          <View style={[styles.tableCell_3, styles.alignRight]}>*/}
    {/*            <Text>{fCurrency(-shipping)}</Text>*/}
    {/*          </View>*/}
    {/*        </View>*/}

    {/*        <View style={[styles.tableRow, styles.noBorder]}>*/}
    {/*          <View style={styles.tableCell_1} />*/}
    {/*          <View style={styles.tableCell_2} />*/}
    {/*          <View style={styles.tableCell_3} />*/}
    {/*          <View style={styles.tableCell_3}>*/}
    {/*            <Text>Discount</Text>*/}
    {/*          </View>*/}
    {/*          <View style={[styles.tableCell_3, styles.alignRight]}>*/}
    {/*            <Text>{fCurrency(-discount)}</Text>*/}
    {/*          </View>*/}
    {/*        </View>*/}

    {/*        <View style={[styles.tableRow, styles.noBorder]}>*/}
    {/*          <View style={styles.tableCell_1} />*/}
    {/*          <View style={styles.tableCell_2} />*/}
    {/*          <View style={styles.tableCell_3} />*/}
    {/*          <View style={styles.tableCell_3}>*/}
    {/*            <Text>Taxes</Text>*/}
    {/*          </View>*/}
    {/*          <View style={[styles.tableCell_3, styles.alignRight]}>*/}
    {/*            <Text>{fCurrency(taxes)}</Text>*/}
    {/*          </View>*/}
    {/*        </View>*/}

    {/*        <View style={[styles.tableRow, styles.noBorder]}>*/}
    {/*          <View style={styles.tableCell_1} />*/}
    {/*          <View style={styles.tableCell_2} />*/}
    {/*          <View style={styles.tableCell_3} />*/}
    {/*          <View style={styles.tableCell_3}>*/}
    {/*            <Text style={styles.h4}>Total</Text>*/}
    {/*          </View>*/}
    {/*          <View style={[styles.tableCell_3, styles.alignRight]}>*/}
    {/*            <Text style={styles.h4}>{fCurrency(totalAmount)}</Text>*/}
    {/*          </View>*/}
    {/*        </View>*/}
    {/*      </View>*/}
    {/*    </View>*/}

    {/*    <View style={[styles.gridContainer, styles.footer]} fixed>*/}
    {/*      <View style={styles.col8}>*/}
    {/*        <Text style={styles.subtitle2}>NOTES</Text>*/}
    {/*        <Text>*/}
    {/*          We appreciate your business. Should you need us to add VAT or extra notes let us know!*/}
    {/*        </Text>*/}
    {/*      </View>*/}
    {/*      <View style={[styles.col4, styles.alignRight]}>*/}
    {/*        <Text style={styles.subtitle2}>Have a Question?</Text>*/}
    {/*        <Text>support@abcapp.com</Text>*/}
    {/*      </View>*/}
    {/*    </View>*/}
      </Page>
    </Document>
    </>
  );
}
