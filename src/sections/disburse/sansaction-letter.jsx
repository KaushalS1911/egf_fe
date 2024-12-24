import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';
import logo from 'src/assets/logo/logo.png';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import InvoiceHeader from '../../components/invoise/invoice-header';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
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
          position: 'relative',
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
        pagePadding: {
          padding: '0px 24px 24px 24px',
          height: '78%',
        },
        gujaratiText: {
          fontFamily: 'NotoSansGujarati',
        },
        flexContainer: {
          flexDirection: 'row',
          marginTop: 10, justifyContent: 'space-between',
          alignItems: 'center',
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
        row: {
          flexDirection: 'row',
          marginVertical: 2,
        },
        subHeading: {
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
        spacing: {
          marginTop: 7,
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
          fontWeight: 600,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          textWrap: 'nowrap',
          paddingVertical: 6,
        },

        tableRow: {
          flexDirection: 'row',
          borderStyle: 'solid',
          paddingVertical: 10,
          textWrap: 'nowrap',
          fontWeight: 600,

        },
        tableRowBorder: {
          borderBottom: '1px solid #d9d9d9',
        },
        tableCell: {
          flex: 1,
          fontSize: 10,
          paddingHorizontal: 4,
          textAlign: 'center',
          fontWeight: 600,
          fontFamily: 'NotoSansGujarati',
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
        img: {
          height: '120px',
          width: '120px',
          borderRadius: 8,
        },
        tableFlex: {
          flexDirection: 'row',
          marginTop: 25,
          width: '100%',
        },
        termsAndConditionsHeaders: {
          color: '#232C4B',
          borderBottom: '1px solid #232C4B',
          textWrap: 'nowrap',
          fontSize: 12,
          textAlign: 'center',
          marginTop: 20,
        },
        d_flex: {
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
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
      }),
    [],
  );

// ----------------------------------------------------------------------

export default function SansactionLetter({ sansaction, configs }) {


  const styles = useStyles();
  const qty = sansaction.propertyDetails.reduce((prev, next) => prev + (Number(next?.pcs) || 0), 0);
  const totalWight = sansaction.propertyDetails.reduce((prev, next) => prev + (Number(next?.totalWeight) || 0), 0);
  const netWight = sansaction.propertyDetails.reduce((prev, next) => prev + (Number(next?.netWeight) || 0), 0);
  const amount = sansaction.loanAmount;

  function numberToWords(num) {
    if (num === 0) return 'Zero Rupees Only';

    const belowTwenty = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
    ];

    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const units = ['', 'Thousand', 'Lakh', 'Crore'];

    const convertBelowHundred = (n) => {
      if (n < 20) return belowTwenty[n];
      return tens[Math.floor(n / 10)] + (n % 10 > 0 ? ' ' + belowTwenty[n % 10] : '');
    };

    const convertBelowThousand = (n) => {
      if (n < 100) return convertBelowHundred(n);
      return belowTwenty[Math.floor(n / 100)] + ' Hundred' + (n % 100 > 0 ? ' ' + convertBelowHundred(n % 100) : '');
    };

    const handleWholeNumber = (num) => {
      let result = '';
      let unitIndex = 0;

      while (num > 0) {
        let part = num % (unitIndex === 0 ? 1000 : 100); // Take 3 digits for the first part, 2 digits after
        if (part > 0) {
          const unit = units[unitIndex] ? ' ' + units[unitIndex] : '';
          result = convertBelowThousand(part) + unit + (result ? ' ' + result : '');
        }
        num = Math.floor(num / (unitIndex === 0 ? 1000 : 100)); // Move to the next group
        unitIndex++;
      }

      return result.trim();
    };

    // Split integer and decimal parts
    const [integerPart, decimalPart] = num.toString().split('.');

    let words = handleWholeNumber(parseInt(integerPart)) + ' Rupees';

    // Handle decimal part
    if (decimalPart) {
      const decimalWords = handleWholeNumber(parseInt(decimalPart));
      words += ' and ' + decimalWords + ' Paise';
    }

    return words + ' Only,';
  }


  const netAmountInWords = numberToWords(amount);
  const rules = [
    {
      rule: `હું પોતે બાહેંધરી આપું છું કે મેં આજ રોજ તારીખ ${fDate(new Date())} ના રોજ ગિરવે મુકેલા ટોટલ ${qty} નંગ દાગીના નું ટોટલ વજન ${totalWight} અને નેટ વજન ${netWight} છે.જે મારી પોતાની માલિકી નું છે .જે મેં ${sansaction.jewellerName} જવેલર્સ માંથી બનાવેલ છે.જેની સંપૂર્ણં જવાબદારી મારી છે .`,
    }, {
      rule: `આ ગોલ્ડ પર બીજી કોઈ વ્યકતિ નો હક કે હિસ્સો નથી છતાં મેં પણ ગોલ્ડ લોન લીધા પછી ગોલ્ડ બાબતે કોઈપણ વ્યક્તિ નો હક કે હિસ્સો જાહેર થાય અથવા કોઈ પણ જાત ની તકરાર આવે તો મને લોન પેટે મળેલ રકમ રૂ .${amount} શબ્દોમાં ${netAmountInWords} હું મારી કોઈ પણ જાત ની કફોડી હાલત માં પણ ભરપાઈ કરવા માટે રાજીખુશી થી બંધાયેલો છું.જો ભરપાઈ ન કરી શકું તો કંપની મારી મિલકત પર દાવો માંડીને કાયદેસરની કાર્યવાહી કરી શકે છે.જે મને મંજુર છે .`,
    }, {
      rule: `મેં કંપની ના બધા નિયમો પુરા હોશ માં વાંચી જાગૃત મતે સમજેલ છે. જે મને (કબુલ) મંજુર છે.જેની હું બાહેંધરી આપું છું.`,
    },
  ];

  const rules2 = [
    {
      rule: `બેંક બંધના દિવસે દાગીના પરત મળશે નહિ`,
    }, {
      rule: `દર મહિને વ્યાજ ભરી જવું`,
    }, {
      rule: `આપેલ બિલ સાથે લેતા આવું`,
    }, {
      rule: `સરનામું બદલે ત્યારે ફેરફાર કરાવી જવું`,
    }, {
      rule: `દર રવિવારે ઓફિસ બંધ રહેશે`,
    }, {
      rule: `કરજ ની રકમ ભર્યા પછી જે વ્યકતિના નામનું બિલ હશે તે વ્યક્તિને જ દાગીના પરત મળશે `,
    }, {
      rule: `નક્કી કરેલી મુદત પુરી થયા બાદ નાણાં વસુલ આપનાર પાસે ચક્રવૃદ્ધિ વ્યાજ વસુલ કરવામાં આવશે `,
    }, {
      rule: `દાગીના શુરક્ષિત સ્થળે મુકેલા હોવાથી કરજ ની રકમ ભર્યા પછી બીજા દિવસે દાગીના પરત મળશે`,
    },
  ];

  const specification = [
    {
      heading: `ખેતી વિષયક કરજ`,
      specification: `પાકના વાવેતર, ઉત્પાદન અને ખેતી સાથે સંબંધ ધરાવતા હેતુઓ માટે ધીરેલું કરજ.`,
    }, {
      heading: `ઔદ્યોગિક કરજ`,
      specification: `માલ બનાવવાના હેતુઓ માટે ધીરેલું કરજ .`,
    }, {
      heading: `વેપારી કરજ`,
      specification: `વેપાર, મિલકત ખરીદ અને વેચાણ માટે ધીરેલુ કરજ .`,
    }, {
      heading: `અગત કરજ`,
      specification: ` લગ્નની વૃત્તિઓ , ધાર્મિક ક્રિયા , દેવા ભરપાઈ કરવા અને અગત જરૂરિયાતો માટે ધીરેલુ કરજ .`,
    }, {
      heading: `પ્રકીર્ણ  કરજ `,
      specification: `૧ થી ૪ માં સમાવેશ ન થયેલ હેતુઓ માટે ધીરેલુ કરજ.`,
    },
  ];
  return (
    <>
      <Document>
        <Page size='A4' style={styles.page}>
          {/* Watermark */}
          <View style={styles.watermarkContainer}>
            <Image src={logo} style={styles.watermarkImage} />
          </View>
          <InvoiceHeader selectedRow={sansaction} configs={configs} />
          <View style={styles.pagePadding}>
            <View style={styles.flexContainer}>
              <View style={{ width: '50%' }}>
                <View style={styles.row}>
                  <Text style={styles.subHeading}>Loan No{' '}</Text>
                  <Text style={styles.colon}>:</Text>
                  <Text style={styles.subText}>{sansaction.loanNo}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.subHeading}>Loan Type{' '}</Text>
                  <Text style={styles.colon}>:</Text>
                  <Text style={styles.subText}>{sansaction.loanType}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.subHeading}>Name{' '}</Text>
                  <Text style={styles.colon}>:</Text>
                  <Text
                    style={styles.subText}>{`${sansaction.customer.firstName} ${sansaction.customer.middleName} ${sansaction.customer.lastName}`}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.subHeading}>Address{' '}</Text>
                  <Text style={{
                    ...styles.subText,
                    textWrap: 'wrap',
                  }}>{`${sansaction.customer.permanentAddress.street} , ${sansaction.customer.permanentAddress.landmark} , ${sansaction.customer.permanentAddress.city} , ${sansaction.customer.permanentAddress.zipcode}`}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.subHeading}>Pan No{' '}</Text>
                  <Text style={styles.colon}>:</Text>
                  <Text style={styles.subText}>{sansaction.customer.panCard}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.subHeading}>Aadhar Card No{' '}
                  </Text> <Text style={styles.colon}>:</Text>
                  <Text style={styles.subText}>{sansaction.customer.aadharCard}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.subHeading}>Mobile No{' '}</Text>
                  <Text style={styles.colon}>:</Text>
                  <Text style={styles.subText}>{sansaction.customer.contact}</Text>
                </View>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image style={styles.img} src={sansaction.customer.avatar_url} />
                <Image style={styles.img} src={sansaction.propertyImage} />
              </View>
            </View>
            <View style={styles.tableFlex}>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={{ ...styles.tableCell, fontWight: 900 }}>તારીખ</Text>
                  <Text style={styles.tableCell}>અમોઉન્ટ</Text>
                  <Text style={styles.tableCell}>દાગીના</Text>
                  <Text style={styles.tableCell}>સહી</Text>
                  <Text style={styles.tableCell}>કસ્ટમર ની સહી</Text>
                  <Text style={styles.tableCell}>વિગત</Text>
                </View>
                <View>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <View key={index} style={[styles.tableRow, styles.tableRowBorder]}>
                      {Array.from({ length: 6 }).map((_, cellIndex) => (
                        <Text key={cellIndex}></Text>
                      ))}
                    </View>
                  ))}
                </View>

                <View>
                  <Text style={{ ...styles.gujaratiText, fontSize: 11, fontWight: 'bolder', marginTop: 20 }}>
                    ઉપરોકત દર્શાવેલ માહિતી પ્રમાણે
                    મેં અહીં ગીરવી મુકેલા દાગીનાઓમાંથી તમામ દાગીનાઓ મને કોઈ પણ જાતની છેડછાડ વગર પરિપૂર્ણ હાલતમાં મને મળી
                    ગયેલ છે.જેની હું આપને લેખિત માં બાહેંધરી આપું છું.</Text>
                </View>
                <View style={{ width: '80%', flexDirection: 'row', display: 'flex', justifyContent: 'flex-end' }}>
                  <Text style={{ ...styles.gujaratiText, fontSize: 12, fontWight: 600 }}>તારીખ :- </Text>
                </View>
                <view>
                  <Text style={[styles.termsAndConditionsHeaders, styles.gujaratiText]}>નમૂનો-૮ કરજ શરતોની વિગતો
                    દર્શાવતું વિવરણ પત્રક નિયમ -૧૬</Text>
                  <View style={{ marginTop: 10 }}>
                    {rules.map((item, index) => (
                      <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                        <Text style={{ ...styles.subText, marginRight: 4 }}>•</Text> {/* Bullet point */}
                        <Text style={{ ...styles.gujaratiText, fontSize: 11 }}>{item.rule}</Text> {/* Condition text */}
                      </View>
                    ))}
                  </View>
                </view>
              </View>
            </View>
          </View>
          <View style={styles.d_flex}>
            <Text style={{ ...styles.signText, marginLeft: 35 }}>Authority Sign</Text>
            <Text style={{ ...styles.signText, marginRight: 35 }}>Customer Sign</Text>
          </View>
        </Page>
        <Page size='A4' style={styles.page}>
          <View style={styles.watermarkContainer}>
            <Image src={logo} style={styles.watermarkImage} />
          </View>
          <InvoiceHeader selectedRow={sansaction} configs={configs} />
          <View style={styles.pagePadding}>
            <View> <Text style={[styles.termsAndConditionsHeaders, styles.gujaratiText]}>નમૂનો-૧૧ કરજ શરતોની વિગતો
              દર્શાવતું વિવરણ પત્રક નિયમ -૧૪</Text></View>
            <View style={{
              flexDirection: 'row',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginTop: 15,
            }}>
              <View style={{ width: '60%' }}>
                <Text style={styles.spacing}>
                  <Text style={{ ...styles.gujaratiText, fontSize: 11, fontWeight: 900 }}>
                    બિલ નં. : {' '}
                  </Text> <Text style={styles.subText}>{sansaction.loanNo}</Text>
                </Text>

                <Text style={styles.spacing}>
                  <Text style={{ ...styles.gujaratiText, fontSize: 11, fontWeight: 900 }}>૧. દેણદાર નું નામ
                    : {' '}</Text>
                  <Text
                    style={{
                      ...styles.gujaratiText,
                      fontSize: 11,
                      fontWeight: 900,
                    }}>{`${sansaction.customer.firstName} ${sansaction.customer.middleName} ${sansaction.customer.lastName}`}</Text>
                </Text>

                <Text style={styles.spacing}>
                  <Text style={{ ...styles.gujaratiText, fontSize: 11, fontWeight: 900 }}>૨. દેણદાર નું સરનામું
                    : {' '}</Text>
                  <Text style={{
                    ...styles.subText,
                    textWrap: 'wrap',
                  }}>{`${sansaction.customer.permanentAddress.street} , ${sansaction.customer.permanentAddress.landmark} , ${sansaction.customer.permanentAddress.city} , ${sansaction.customer.permanentAddress.zipcode}`}</Text>
                </Text>

                <Text style={styles.spacing}>
                  <Text style={{ ...styles.gujaratiText, fontSize: 11, fontWeight: 900 }}>૩. કરજ ની રકમ : {' '}</Text>
                  <Text style={styles.subText}>{sansaction.loanAmount}</Text>
                </Text>

                <Text style={styles.spacing}>
                  <Text style={{ ...styles.gujaratiText, fontSize: 11, fontWeight: 900 }}>૪. ધીયાં ની તારીખ
                    : {' '}</Text>
                  <Text style={styles.subText}>{fDate(sansaction.issueDate)}</Text>
                </Text>

                <Text style={styles.spacing}>
                  <Text style={{ ...styles.gujaratiText, fontSize: 11, fontWeight: 900 }}>૪-અ. કરજ ની પ્રકાર
                    : {' '}</Text>
                  <Text style={[styles.subText, styles.gujaratiText]}>ખેતી વિષયક,ઔદ્યોગિક વેપારી,અગત કે પ્રકીણ
                    કરજ</Text>
                </Text>

                <Text style={styles.spacing}>
                  <Text style={{ ...styles.gujaratiText, fontSize: 11, fontWeight: 900 }}>૫. કરજ પાકવાની મુદત માસ ૮ ની
                    છે .</Text>
                </Text>

                <Text style={styles.spacing}>
                  <Text style={{ ...styles.gujaratiText, fontSize: 11, fontWeight: 900 }}>૬. વાર્ષિક વ્યાજ
                    દર {((sansaction.scheme.interestRate) * 12).toFixed(2)} ટકા.
                  </Text>
                </Text>

                <Text style={styles.spacing}>
                  <Text style={{ ...styles.gujaratiText, fontSize: 11, fontWeight: 900 }}>૭. તારણ નો પ્રકાર
                  </Text>
                </Text>

                <Text style={styles.spacing}>
                  <Text style={{ ...styles.gujaratiText, fontSize: 11, fontWeight: 900 }}>સોનાના મુદ્દા
                  </Text>
                </Text>
              </View>
              <View style={{ width: '40%' }}>
                <View style={{ textAlign: 'center', marginBottom: 5 }}><Text style={{
                  fontWeight: '600',
                  fontSize: 10,
                }}><Text
                  style={{ ...styles.gujaratiText, fontSize: 10 }}>તા.</Text>{fDate(new Date())}</Text></View>
                <View style={{
                  flexDirection: 'row'
                  , display: 'flex', justifyContent: 'center',
                }}>
                  <Image style={styles.img} src={sansaction.propertyImage} />
                </View>
                <View style={{ textAlign: 'center', margin: '10px 0px 5px 0px', width: '100%' }}>
                  <Text style={{ ...styles.gujaratiText, fontSize: 12 }}>વજન તરણની અદાજેલી કિંમતી વ.</Text>
                </View>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.gujaratiText]}>ટોટલ વજન ગ્રા.</Text>
                  <Text style={styles.tableCell}>નેટ વજન ગ્રા.</Text>
                  <Text style={styles.tableCell}>ટોટલ નંગ </Text>
                </View>
                <View style={[{
                  ...styles.tableRow, paddingVertical: 5
                  , ...styles.tableRowBorder,
                }]}>
                  <Text style={styles.tableCell}>{totalWight}</Text>
                  <Text style={styles.tableCell}>{netWight}</Text>
                  <Text style={styles.tableCell}>{qty}</Text>
                </View>
              </View>
            </View>
            <View>
              <Text style={{ ...styles.gujaratiText, fontSize: 11, marginTop: 15, fontWeight: 'bold' }}>
                હું નીચે સહી
                કરનાર પ્રતિજ્ઞાપુર્વગ જાણવું છુકે આ દાગીના ચોરીના નથી મારી પોતાની માલિકીના છે.તેની સર્વ જવાબદારી મારી છે
                આ
                બિલની બધી જ શરતો મેં વાંચી છે,તે મને કાબુલ છે
              </Text>
            </View>

            <View>
              <Text style={{
                ...styles.gujaratiText,
                fontWight: 900,
                fontSize: 14,
                marginTop: 8,
                color: '#232C4B',
                textDecoration: 'underline',
                textDecorationColor: '#232C4B',
              }}>નિયમો :-</Text>
              <View style={{ marginTop: 8 }}>
                {rules2.map((item, index) => (
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3 }}>
                    <Text style={{ fontSize: 10, marginRight: 4 }}>•</Text> {/* Bullet point */}
                    <Text style={{
                      ...styles.gujaratiText,
                      fontSize: 11,
                      color: [1, 3, 7].includes(index) ? 'black' : 'black',
                    }}>{item.rule}</Text> {/* Condition text */}
                  </View>
                ))}
              </View>
            </View>

            <View>
              <Text style={{
                ...styles.gujaratiText,
                fontWeight: '900', // Fixed typo in 'fontWeight'
                fontSize: 14,
                marginTop: 8,
                color: '#232C4B',
                textDecoration: 'underline',
                textDecorationColor: '#232C4B',
              }}>સ્પષ્ટીકરણ :-</Text>
              <View style={{ marginTop: 8 }}>
                {specification.map((item, index) => (
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3 }}>
                    <Text style={{ fontSize: 10, marginRight: 4 }}>•</Text>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <Text style={{
                        ...styles.gujaratiText,
                        fontSize: 12,
                        fontWeight: '600', // Fixed typo in 'fontWeight'
                        width: 80, // Fixed width to align colons
                      }}>{item.heading}</Text>
                      <Text style={{
                        ...styles.gujaratiText,
                        fontSize: 12,
                      }}>:</Text>
                      <Text style={{
                        ...styles.gujaratiText,
                        fontSize: 11,
                        marginLeft: 4,
                      }}>{item.specification}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

          </View>
          <View style={styles.d_flex}>
            <Text style={{ ...styles.signText, marginLeft: 35 }}>Authority Sign</Text>
            <Text style={{ ...styles.signText, marginRight: 35 }}>Customer Sign</Text>
          </View>
        </Page>
      </Document>
    </>
  );
}
