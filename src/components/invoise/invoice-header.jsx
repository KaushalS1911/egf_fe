import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import contact from 'src/assets/icon/icons8-phone-50.png';
import mail from 'src/assets/icon/icons8-letter-50.png';
import website from 'src/assets/icon/icons8-website-50.png';
import branchHeader from 'src/assets/icon/icons8-company-30.png';
import branchCodeHeader from 'src/assets/icon/icons8-branch-50.png';
import address from 'src/assets/icon/icons8-location-50.png';
import {
  Page,
  View,
  Text,
  Image,
  Document,
  StyleSheet,
  Font,
  Link,
} from '@react-pdf/renderer';
import logo from 'src/assets/logo/Logo Png.png';
import { useGetConfigs } from '../../api/config';
import { useSelector } from 'react-redux';

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
          height: '126px',
          fontFamily: 'Roboto',
          position: 'relative',
          overflow: 'hidden',
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
        },
        logoParent: {
          height: 94,
          width: 94,
          margin: '0px 0px 0px 5px ',
        },
        logo: {
          height: '100%',
          width: '100%',
          borderRadius: '5px',
          objectFit: 'contain',
          marginTop: 10,
        },
        // headerText: {
        //   color: '#fff',
        //   fontSize: '24px',
        //   // marginLeft: '10px',
        //   fontWeight: 'bold',
        // },
        headerText: {
          color: '#fff',
          fontWeight: 'bold',
          flexShrink: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
          fontSize: '24px', // Default font size
        },

        dynamicHeaderText: {
          color: '#fff',
          fontWeight: 'bold',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
          textAlign: 'left',
        },

        companyNameContainer: {
          flex: 1.5,
          // marginLeft: 10,
          justifyContent: 'center',
          alignItems: 'center',
        },
        headerSubText: {
          color: '#fff',
          fontSize: '10px',
          fontWeight: 'bold',
          marginLeft: 5, // Spacing between icon and text
          marginRight: 5, // Optional, for alignment
        },
        headerDetailsParent: {
          margin: '60px 30px',
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
          gap: 2,
          marginBottom: 8,
        },
        flexContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        },
        separator: {
          marginHorizontal: 2,
          color: '#fff',
          fontSize: '10px',
          fontWeight: '400',
        },
      }),
    [],
  );

export default function InvoiceHeader({configs}) {
  console.log(configs,"uhuh");
  const styles = useStyles();
  const logo = configs?.company?.logo_url;
  const branch = configs?.headersConfig?.branch;
  const company = configs?.headersConfig?.companyDetail;
  const branchAddress = branch ? `${branch.address.street}, ${branch.address.landmark}, ${branch.address.city}, ${branch.address.zipcode}` : '';
  const branchName = branch?.name || 'Branch Name Not Available';
  const branchCode = branch?.branchCode || 'Branch Code Not Available';
  const branchEmail = branch?.email || 'Email Not Available';
  const branchContact = branch?.contact || 'Contact Not Available';

  return (
    <View style={styles.header}>
      {/* Header Box 1 */}
      <View style={styles.headerbox1}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center', // Center vertically
          }}
        >
          {/* Logo Section */}
          <View style={styles.logoParent}>
            <Image style={styles.logo} src={logo} />
          </View>

          {/* Company Name and Address Section */}
          <View
            style={{
              flex: 1,
              marginLeft: 0,
              display: 'flex',
              flexDirection: 'column', // Stack vertically
              justifyContent: 'center', // Align content vertically in the available space
              padding: ' 0px 0px 0px 5px',
            }}
          >
            {/* Company Name */}
            <Text
              style={{
                ...styles.dynamicHeaderText,
                fontSize: company?.name?.length > 20 ? '18px' : '24px',
                marginTop: 60,
              }}
            >
              {company?.name || 'Company Name'}
            </Text>

            {/* Address */}
            <View
              style={{
                flexDirection: 'row',
                textWrap:'wrap',
                paddingRight:10,
              }}
            >
              <Image style={styles.icon} src={address} />
              <Text style={styles.separator}>|</Text>
              <Text style={styles.headerSubText}>{branchAddress}</Text>
            </View>
          </View>
        </View>
      </View>


      {/* Header Box 2 */}
      <View style={styles.headerbox2}>
        <View style={styles.headerDetailsParent}>
          <View style={styles.flexContainer}>a
            {/* Column 1 */}
            <View style={{ width: 'auto' }}>
              <View style={styles.rowContainer}>
                <Image style={styles.icon} src={branchHeader} />
                <Text style={styles.separator}>|</Text>
                <Text style={styles.headerDetails}>{branchName}</Text>
              </View>
              <View style={{ ...styles.rowContainer, marginTop: 15 }}>
                <Image style={styles.icon} src={branchCodeHeader} />
                <Text style={styles.separator}>|</Text>
                <Text style={styles.headerDetails}>{branchCode}</Text>
              </View>
            </View>

            {/* Column 2 */}
            <View style={{ width: 'auto' }}>
              <View style={styles.rowContainer}>
                <Image style={styles.icon} src={mail || 'default_mail_icon'} />
                <Text style={styles.separator}>|</Text>
                <Text style={{ ...styles.headerDetails, textTransform: 'lowercase' }}>{branchEmail}</Text>
              </View>
              <View style={{ ...styles.rowContainer, marginTop: 15 }}>
                <Image style={styles.icon} src={website || 'default_website_icon'} />
                <Text style={styles.separator}>|</Text>
                <Text style={{ ...styles.headerDetails, textTransform: 'lowercase' }}>
                  <Link src='https://www.easygoldfincorp.com/' style={{ textDecoration: 'none', color: '#fff' }}>
                    www.easygoldfincorp.com
                  </Link>
                </Text>
              </View>
            </View>

            {/* Column 3 */}
            <View style={{ width: 'auto' }}>
              <View style={styles.rowContainer}>
                <Image style={styles.icon} src={contact || 'default_contact_icon'} />
                <Text style={styles.separator}>|</Text>
                <Text style={styles.headerDetails}>{branchContact}</Text>
              </View>
              <View style={{ ...styles.rowContainer, marginTop: 15 }}>
                <Image style={styles.icon} src={contact || 'default_contact_icon'} />
                <Text style={styles.separator}>|</Text>
                <Text style={styles.headerDetails}>{company?.contact || 'Company Contact'}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
