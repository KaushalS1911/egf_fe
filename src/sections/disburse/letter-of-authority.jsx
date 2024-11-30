import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';
import logo from 'src/assets/logo/logo.png';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
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
          padding: 60,
          fontSize: 12,
          fontFamily: 'Roboto',
          lineHeight: 1.5,
          position: 'relative',
        },
        header: {
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 20,
          fontWeight: 'bold',
          textTransform: 'uppercase',
        },
        address: {
          fontSize: 12,
          marginBottom: 20,
        },
        section: {
          marginBottom: 10,
        },
        bold: {
          fontWeight: 'bold',
        },
        signatureSection: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 40,
        },
        signatureBox: {
          textAlign: 'center',
          border: '1px solid black',
          width: '100%',
          height: '20%',
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
      }),
    [],
  );

// ----------------------------------------------------------------------

export default function LetterOfAuthority({ loan }) {
  console.log(loan, 'loan');
  const styles = useStyles();

  return (
    <>
      <Document>
        <Page size='A4' style={styles.page}>
          {/* Watermark */}
          <View style={styles.watermarkContainer}>
            <Image src={logo} style={styles.watermarkImage} />
          </View>

          {/* Header */}
          <Text style={styles.header}>Letter of Authority</Text>

          {/* From Section */}
          <View style={styles.section}>
            <Text>
              <Text style={styles.bold}>From:</Text>
            </Text>
            <Text>{`${loan.customer.firstName} ${loan.customer.middleName} ${loan.customer.lastName}`}</Text>
            <Text>PUNAGAM</Text>
          </View>

          {/* To Section */}
          <View style={styles.section}>
            <Text>
              <Text style={styles.bold}>To:</Text>
            </Text>
            <Text>EASY GOLD FINCORP</Text>
            <Text>Shop No.3, First Floor, Shree Hari Complex, Yogi Chowk, Surat</Text>
            <Text>Pin code - 395010</Text>
          </View>

          {/* Body */}
          <View style={styles.section}>
            <Text>Dear Sir,</Text>
            <Text style={{ marginTop: 10 }}>
              This has reference to the gold ornaments/articles pledged by me to you having a gross weight of{' '}
              <Text style={styles.bold}>
                {loan.propertyDetails.reduce((prev, next) => prev + (Number(next?.netWeight) || 0), 0)}
              </Text> for availing an advance of{' '}
              <Text
                style={styles.bold}>Rs {loan.propertyDetails.reduce((prev, next) => prev + (Number(next?.netAmount) || 0), 0)}
              </Text> from you. I/We hereby declare that
              the said gold ornaments/articles exclusively belong to me, and I have handed over possession to you as a
              pledgee of those ornaments.
            </Text>
            <Text style={{ marginTop: 10 }}>
              In the above respect, I/we agree and authorize you to apply for, obtain, and avail a loan from any bank or
              financial institution by a further pledge of the said gold ornaments/articles. I/we hereby give
              unconditional
              authority to you to offer the said gold ornaments/articles in your capacity as the ostensible owner of the
              same as security for such loans to be applied for/availed by you and to authorize such Bank/Financial
              Institution to sell the said pledged gold ornaments/articles in public auction or by way of private treaty
              to
              recover the amount of dues outstanding under such ledge/loan.
            </Text>
          </View>

          {/* Signature Section */}
          <View style={styles.signatureSection}>
            <View>
              <Text>Place:</Text>
              <Text style={{ marginTop: 10 }}>Date:</Text>
            </View>
            <View>
              <View style={styles.signatureBox}></View>
              <Text>Signature of the real/true owner</Text>
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
}
