import React, { useMemo } from 'react';
import { Page, View, Text, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { fDate } from 'src/utils/format-time.js';
import InvoiceHeader from '../../../components/invoise/invoice-header.jsx';

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        page: {
          fontFamily: 'Roboto',
          backgroundColor: '#ffff',
          fontSize: 8,
          position: 'relative',
        },
        subHeading: {
          fontWeight: 'bold',
          fontSize: 16,
          textAlign: 'center',
          marginTop: 10,
        },
        table: {
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderWidth: 1,
          borderColor: '#b1b0b0',
        },
        tableRow: {
          flexDirection: 'row',
          minHeight: 22,
          borderBottomWidth: 0.5,
          borderBottomColor: '#c7c6c6',
          pageBreakInside: 'avoid',
        },
        lastTableRow: {
          borderBottomWidth: 0,
        },
        tableHeader: {
          backgroundColor: '#5B9BD4',
          fontWeight: 'bold',
          color: '#000',
          textAlign: 'center',
        },
        tableCell: {
          padding: 5,
          borderRightWidth: 0.5,
          borderRightColor: '#b1b0b0',
          textAlign: 'center',
        },
        numericCell: {
          textAlign: 'right',
        },
        tableCellLast: {
          borderRightWidth: 0,
        },
        alternateRow: {
          backgroundColor: '#F2F2F2',
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
        row: {
          flexDirection: 'row',
          marginVertical: 1.5,
        },
        subHeading2: {
          fontWeight: '600',
          fontSize: 10,
        },
        colon: {
          fontSize: 10,
          fontWeight: '600',
          marginHorizontal: 3,
        },
        subText: {
          fontSize: 8,
          flex: 2,
        },
      }),
    []
  );

export default function SchemePdf({ configs, scheme }) {
  const styles = useStyles();

  const headers = [
    { label: '#', flex: 0.2 },
    { label: 'Name', flex: 0.6 },
    { label: 'Rate / gm', flex: 0.6 },
    { label: 'Int. Rate', flex: 0.5 },
    { label: 'Valuation (%)', flex: 0.5 },
    { label: 'Int. Period', flex: 0.8 },
    { label: 'Renewal Time', flex: 0.8 },
    { label: 'Min Loan Time', flex: 0.5 },
    { label: 'Type', flex: 0.8 },
    { label: 'Status', flex: 0.5 },
  ];

  const dataFilter = [{ value: fDate(new Date()), label: 'Date' }];

  const rowsPerPageFirst = 28;
  const rowsPerPageOther = 34;

  const remainingRows = scheme.length - rowsPerPageFirst;
  const additionalPages = Math.ceil(Math.max(0, remainingRows) / rowsPerPageOther);

  const pages = [];
  const renderRow = (row, index, isLastRow) => {
    const isAlternateRow = index % 2 !== 0;

    return (
      <View
        key={index}
        style={[
          styles.tableRow,
          isAlternateRow ? styles.alternateRow : {},
          isLastRow ? styles.lastTableRow : {},
        ]}
        wrap={false}
      >
        <Text style={[styles.tableCell, { flex: 0.2 }]}>{index + 1}</Text>
        <Text style={[styles.tableCell, { flex: 0.6 }]}>{row?.name || '-'}</Text>
        <Text style={[styles.tableCell, { flex: 0.6 }]}>{row?.ratePerGram || '-'}</Text>
        <Text style={[styles.tableCell, { flex: 0.5 }]}>{row?.interestRate || '-'}</Text>
        <Text style={[styles.tableCell, { flex: 0.5 }]}>{row?.valuation || '-'}</Text>
        <Text style={[styles.tableCell, { flex: 0.8 }]}>{row?.interestPeriod || '-'}</Text>
        <Text style={[styles.tableCell, { flex: 0.8 }]}>{row?.renewalTime || '-'}</Text>
        <Text style={[styles.tableCell, { flex: 0.5 }]}>{row?.minLoanTime || '-'}</Text>
        <Text style={[styles.tableCell, { flex: 0.8 }]}>{row?.schemeType || '-'}</Text>
        <Text style={[styles.tableCell, { flex: 0.5, borderRight: 0 }]}>
          {row?.isActive ? 'Active' : 'Inactive' || '-'}
        </Text>
      </View>
    );
  };

  const renderTableHeader = () => (
    <View style={[styles.tableRow, styles.tableHeader]}>
      {headers.map((header, i) => (
        <Text
          key={i}
          style={[
            styles.tableCell,
            { flex: header.flex },
            i === headers.length - 1 ? styles.tableCellLast : {},
          ]}
        >
          {header.label}
        </Text>
      ))}
    </View>
  );

  const firstPageRows = scheme
    .slice(0, rowsPerPageFirst)
    .map((row, index) =>
      renderRow(row, index, index === rowsPerPageFirst - 1 && scheme.length === rowsPerPageFirst)
    );

  // Add the first page
  pages.push(
    <Page key={0} size="A4" style={styles.page}>
      <InvoiceHeader configs={configs} />
      <View style={{ position: 'absolute', top: 20, right: 0, width: 100 }}>
        {dataFilter.map((item, idx) => (
          <View key={idx} style={styles.row}>
            <Text style={styles.subHeading2}>{item.label || '-'}</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.subText}>{item.value || '-'}</Text>
          </View>
        ))}
      </View>
      <View
        style={{
          textAlign: 'center',
          fontSize: 18,
          marginHorizontal: 15,
          marginTop: 10,
        }}
      >
        <Text style={styles.termsAndConditionsHeaders}>SCHEMES</Text>
      </View>

      <View style={{ flexGrow: 1, padding: '12px' }}>
        <View style={styles.table}>
          {renderTableHeader()}
          {firstPageRows}
        </View>
      </View>
    </Page>
  );

  if (scheme.length > rowsPerPageFirst) {
    for (let pageIndex = 0; pageIndex < additionalPages; pageIndex++) {
      const startIndex = rowsPerPageFirst + pageIndex * rowsPerPageOther;
      const endIndex = Math.min(startIndex + rowsPerPageOther, scheme.length);
      const isLastPage = endIndex === scheme.length;

      const pageRows = scheme.slice(startIndex, endIndex).map((row, index) => {
        const actualIndex = startIndex + index;
        return renderRow(row, actualIndex, actualIndex === scheme.length - 1);
      });

      pages.push(
        <Page key={pageIndex + 1} size="A4" style={styles.page}>
          <View style={{ flexGrow: 1, padding: '12px' }}>
            <View style={styles.table}>
              {renderTableHeader()}
              {pageRows}
            </View>
          </View>
        </Page>
      );
    }
  }

  return <Document>{pages}</Document>;
}
