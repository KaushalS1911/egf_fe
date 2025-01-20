import React, { useMemo } from 'react';
import address from 'src/assets/icon/icons8-location-50.png';
import background from 'src/assets/icon/Frame 1.png';
import { Page, View, Text, Image, Document, StyleSheet, Font, Link } from '@react-pdf/renderer';

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
        // header: {
        //   width: '100%',
        //   height: '126px',
        //   fontFamily: 'Roboto',
        //   // position: 'relative',
        //   // overflow: 'hidden',
        // },
        // headerbox1: {
        //   width: '65%',
        //   height: '126px',
        //   backgroundColor: '#FF7F27',
        //   borderTopRightRadius: '50%',
        //   borderBottomRightRadius: '50%',
        // },
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
        // logoParent: {
        //   height: 94,
        //   width: 94,
        //   margin: '0px 0px 0px 5px ',
        // },
        // logo: {
        //   height: '100%',
        //   width: '100%',
        //   borderRadius: '5px',
        //   objectFit: 'contain',
        //   marginTop: 10,
        // },
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
        // headerSubText: {
        //   color: '#fff',
        //   fontSize: '10px',
        //   fontWeight: 'bold',
        //   marginLeft: 5,
        //   marginRight: 5,
        //   fontsize: 10,
        // },
        headerDetailsParent: {
          margin: '60px 30px',
          color: '#fff',
        },
        headerDetails: {
          color: '#fff',
          fontSize: 11,
        },
        icon: {
          height: '10px',
          width: '10px',
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
        header: {
          width: '100%',
          height: '120px',
          position: 'relative',
          overflow: 'hidden',
        },
        backgroundImage: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        },
        headerbox1Parent: {
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
        },
        headerbox1: {
          // flex: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 10,
        },
        logoParent: {
          height: 75,
          width: 75,
          borderRadius: '10px',
          overflow: 'hidden',
          marginRight: 10,
        },
        logo: {
          height: '100%',
          width: '100%',
          objectFit: 'contain',
        },
        companyName: {
          fontSize: 24,
          color: '#fff',
          fontWeight: 'bold',
          // textAlign: 'center',
          // flex: 1,
        },
        letterSpacingText: {
          letterSpacing: 18,
        },
      }),
    []
  );

export default function InvoiceHeader({ configs }) {
  const styles = useStyles();
  const logo = configs?.company?.logo_url;
  const branch = configs?.headersConfig?.branch;
  const company = configs?.headersConfig?.companyDetail;
  const webUrl = configs?.headersConfig?.companyDetail?.webUrl;
  const branchAddress = branch
    ? `${branch.address.street}, ${branch.address.landmark}, ${branch.address.city}`
    : '';
  const branchName = branch?.name || 'Branch Name Not Available';
  const branchCode = branch?.branchCode || 'Branch Code Not Available';
  const branchEmail = branch?.email || 'Email Not Available';
  const branchContact = branch?.contact || 'Contact Not Available';

  return (
    <View style={styles.header}>
      {/* Background Image */}
      <View style={styles.headerbox1Parent}>
        <Image style={styles.backgroundImage} src={background} />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 11,
          }}
        >
          <View style={styles.headerbox1}>
            {/* Left: Logo */}
            <View style={styles.logoParent}>
              <Image style={styles.logo} src={logo} />
            </View>

            {/* Center: Company Name */}
            <View style={{ marginTop: 5 }}>
              <Text
                style={{
                  ...styles.companyName,
                  fontSize: '34px',
                  width: 220,
                }}
              >
                {company?.name ? company.name.split(' ').slice(0, -1).join(' ') : 'EASY GOLD'}
              </Text>
              <Text
                style={{
                  ...styles.letterSpacingText,
                  fontSize: company?.name?.length > 17 ? '12px' : '14px',
                  color: '#fff',
                  marginLeft: 3,
                }}
              >
                {company?.name
                  ? company.name.split(' ').pop() // Show only the last word
                  : 'FINCORP'}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            textWrap: 'wrap',
            // paddingRight: 10,
            marginTop: 16,
            marginLeft: 5,
          }}
        >
          <Image style={styles.icon} src={address} />
          <Text style={styles.separator}>|</Text>
          <Text style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{branchAddress}</Text>
        </View>
      </View>

      {/* Header Box 1 */}
      {/*{/<View style={styles.headerbox1}>/}*/}
      {/*  <View*/}
      {/*    style={{*/}
      {/*      display: 'flex',*/}
      {/*      flexDirection: 'row',*/}
      {/*      alignItems: 'center', // Center vertically*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    /!* Logo Section !//}
      {/*    <View style={styles.logoParent}>*/}
      {/*      <Image style={styles.logo} src={logo} />*/}
      {/*    </View>*/}

      {/*    /!* Company Name and Address Section !//}
      {/*    <View*/}
      {/*      style={{*/}
      {/*        flex: 1,*/}
      {/*        marginLeft: 0,*/}
      {/*        display: 'flex',*/}
      {/*        flexDirection: 'column', // Stack vertically*/}
      {/*        justifyContent: 'center', // Align content vertically in the available space*/}
      {/*        padding: ' 0px 0px 0px 5px',*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      /!* Company Name !//}
      {/*      <Text*/}
      {/*        style={{*/}
      {/*          ...styles.dynamicHeaderText,*/}
      {/*          fontSize: company?.name?.length > 20 ? '18px' : '24px',*/}
      {/*          marginTop: 60,*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        {company?.name || 'Company Name'}*/}
      {/*      </Text>*/}

      {/*/!* Address !*/}

      {/*</View>*/}
      {/*// </View>*/}
      {/*// </View>*/}

      {/* Header Box 2 */}
      {/*{/<View style={styles.headerbox2}>/}*/}
      {/*  <View style={styles.headerDetailsParent}>*/}
      {/*    <View style={styles.flexContainer}>a*/}
      {/*      /!* Column 1 !//}
      {/*      <View style={{ width: 'auto' }}>*/}
      {/*        <View style={styles.rowContainer}>*/}
      {/*          <Image style={styles.icon} src={branchHeader} />*/}
      {/*          <Text style={styles.separator}>|</Text>*/}
      {/*          <Text style={styles.headerDetails}>{branchName}</Text>*/}
      {/*        </View>*/}
      {/*        <View style={{ ...styles.rowContainer, marginTop: 15 }}>*/}
      {/*          <Image style={styles.icon} src={branchCodeHeader} />*/}
      {/*          <Text style={styles.separator}>|</Text>*/}
      {/*          <Text style={styles.headerDetails}>{branchCode}</Text>*/}
      {/*        </View>*/}
      {/*      </View>*/}

      {/*      /!* Column 2 !//}
      {/*      <View style={{ width: 'auto' }}>*/}
      {/*        <View style={styles.rowContainer}>*/}
      {/*          <Image style={styles.icon} src={mail || 'default_mail_icon'} />*/}
      {/*          <Text style={styles.separator}>|</Text>*/}
      {/*          <Text style={{ ...styles.headerDetails, textTransform: 'lowercase' }}>{branchEmail}</Text>*/}
      {/*        </View>*/}
      {/*        <View style={{ ...styles.rowContainer, marginTop: 15 }}>*/}
      {/*          <Image style={styles.icon} src={website || 'default_website_icon'} />*/}
      {/*          <Text style={styles.separator}>|</Text>*/}
      {/*          <Text style={{ ...styles.headerDetails, textTransform: 'lowercase' }}>*/}
      {/*            <Link src={webUrl} style={{ textDecoration: 'none', color: '#fff' }}>*/}
      {/*              {webUrl}*/}
      {/*            </Link>*/}
      {/*          </Text>*/}
      {/*        </View>*/}
      {/*      </View>*/}

      {/*      /!* Column 3 !//}
      {/*      <View style={{ width: 'auto' }}>*/}
      {/*        <View style={styles.rowContainer}>*/}
      {/*          <Image style={styles.icon} src={contact || 'default_contact_icon'} />*/}
      {/*          <Text style={styles.separator}>|</Text>*/}
      {/*          <Text style={styles.headerDetails}>{branchContact}</Text>*/}
      {/*        </View>*/}
      {/*        <View style={{ ...styles.rowContainer, marginTop: 15 }}>*/}
      {/*          <Image style={styles.icon} src={contact || 'default_contact_icon'} />*/}
      {/*          <Text style={styles.separator}>|</Text>*/}
      {/*          <Text style={styles.headerDetails}>{company?.contact || 'Company Contact'}</Text>*/}
      {/*        </View>*/}
      {/*      </View>*/}
      {/*    </View>*/}
      {/*  </View>*/}
      {/*{/</View>/}*/}
    </View>
  );
}
