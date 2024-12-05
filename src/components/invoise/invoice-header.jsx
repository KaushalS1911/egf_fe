import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import contact from 'src/assets/icon/icons8-phone-50.png';
import mail from 'src/assets/icon/icons8-letter-50.png';
import website from 'src/assets/icon/icons8-website-50.png';
import branch from 'src/assets/icon/icons8-company-30.png';
import {
  Page,
  View,
  Text,
  Image,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import logo from 'src/assets/logo/logo.png'; // Correct path to your logo

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        page: {
          padding: 40,
          fontSize: 10,
          fontFamily: 'Roboto',
        },
        header: {
          width: '100%',
          height: '150px',
          fontFamily: 'Roboto',
          position: 'relative',
        },
        headerbox1: {
          width: '65%',
          height: '126px',
          backgroundColor: '#FF7F27',
          borderTopRightRadius: '50%',
          borderBottomRightRadius: '50%',
        },
        headerbox2: {
          position: 'absolute',
          top: '-45px',
          right: 0,
          width: '80%',
          height: '100px',
          backgroundColor: '#232C4B',
          borderTopLeftRadius: '50%',
          borderBottomLeftRadius: '50%',
          textTransform: 'lowercase',
        },
        logo: {
          height: '38px',
          width: '38px',
          margin: 10,
          backgroundColor: '#fff',
          borderRadius: '5px',
        },
        headerText: {
          color: '#fff',
          marginLeft: '10px',
          fontWeight: 'bold',
        },
        headerSubText: {
          color: '#fff',
          fontSize: '10px',
          fontWeight: 'bold',
          margin: '5px 10px',
        },
        headerDetailsParent: {
          margin: '55px 20px',
          color: '#fff',
        },
        headerDetails: {
          color: '#fff',
          fontSize: 11,
        },
        icon: {
          height: '12px',
          width: '12px',
        },
        rowContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2, // Controls space between the image and text
        },
        flexContainer: {
          marginLeft: '20px',
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '80%',
          columnGap: '20px',
          rowGap: '10px',
        },
        separator: {
          marginHorizontal: 2,
          color: '#fff',
          fontSize: '10px',
          fontWeight: '400',
        }
      }),
    [],
  );

export default function InvoiceHeader({ selectedRow }) {
  const styles = useStyles();

  return (
    <View style={styles.header}>
      <View style={styles.headerbox1}>
        <Image style={styles.logo} src={logo} />
        <Text style={styles.headerText}>EASY GOLD FINCORP</Text>
        <Text style={styles.headerSubText}>GSTIN : 24DMMUPK1478K12E</Text>
        <Text style={styles.headerSubText}>
          Address: Shop No.-3, First Floor, Shree Hari Complex, Yogi Chowk, Surat
        </Text>
      </View>

      <View style={styles.headerbox2}>
        <View style={styles.headerDetailsParent}>
          <View style={styles.flexContainer}>
            {/* Phone */}
            <View style={styles.rowContainer}>
              <Image style={styles.icon} src={contact} />
              <Text style={styles.separator}>|</Text> {/* Separator */}
              <Text style={styles.headerDetails}>8160059100</Text>
            </View>

            <View style={styles.rowContainer}>
              <Image style={styles.icon} src={mail} />
              <Text style={styles.separator}>|</Text> {/* Separator */}
              <Text style={styles.headerDetails}>{selectedRow.customer.branch.email}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Image style={styles.icon} src={website} />
              <Text style={styles.separator}>|</Text>
              <Text style={styles.headerDetails} href={'easygoldfncorp.com'}>easygoldfncorp.com</Text>
            </View>
            <View style={styles.rowContainer}>
              <Image style={styles.icon} src={contact} />
              <Text style={styles.separator}>|</Text> {/* Separator */}
              <Text style={styles.headerDetails}>{selectedRow.customer.branch.branchCode}</Text>
            </View>
            <View style={styles.rowContainer}>
              <Image style={styles.icon} src={branch} />
              <Text style={styles.separator}>|</Text> {/* Separator */}
              <Text
                style={styles.headerDetails}>{selectedRow.customer.branch.address.street + ' ' + selectedRow.customer.branch.address.landmark}</Text>
            </View>

          </View>
        </View>
      </View>
    </View>
  );
}
