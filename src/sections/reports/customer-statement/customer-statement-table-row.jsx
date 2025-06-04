import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  IconButton,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { differenceInDays } from 'date-fns';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useAuthContext } from '../../../auth/hooks';
import { useGetConfigs } from '../../../api/config';
import { getResponsibilityValue } from '../../../permission/permission';
import { fDate } from '../../../utils/format-time';
import Notice from '../../loanpayhistory/PDF/notice.jsx';
import { paths } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function CustomerStatementTableRow({ row }) {
  const {
    loanNo,
    customerName,
    loanAmount,
    interestLoanAmount,
    partLoanAmount,
    amount,
    createdAt,
  } = row;

  const { user, initialize } = useAuthContext();
  const { configs } = useGetConfigs();

  // Calculate totals
  const totals = row.statements?.reduce(
    (acc, item) => {
      acc.credit += Number(item.credit) || 0;
      acc.debit += Number(item.debit) || 0;
      acc.balance += Number(item.balance) || 0;
      return acc;
    },
    { credit: 0, debit: 0, balance: 0 }
  );
  const statusColors = {
    'Loan Close': (theme) => (theme.palette.mode === 'light' ? '#FFE4DE' : '#611706'),
  };

  return (
    <>
      {/* Parent Loan Row */}
      <TableRow hover>
        <TableCell>{row.srNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>{loanNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}></TableCell>
        <TableCell colSpan={4} />
      </TableRow>

      {/* Show only if there are statements */}
      {row.statements?.length > 0 && (
        <>
          {/* Statement Rows */}
          {row.statements.map((item, index) => (
            <TableRow key={index} sx={{ backgroundColor: statusColors[item.detail] || '' }}>
              <TableCell />
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{item.detail}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(item.date)}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{item.credit || 0}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{item.debit || 0}</TableCell>
            </TableRow>
          ))}

          {/* Totals Row */}
          <TableRow
            sx={{
              background: (theme) => (theme.palette.mode === 'light' ? '#E3E7EA' : ''),
            }}
          >
            <TableCell />
            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
              Total
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>{totals.credit.toFixed(2)}</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>{totals.debit.toFixed(2)}</TableCell>
          </TableRow>
        </>
      )}
    </>
  );
}

CustomerStatementTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  loanStatus: PropTypes.string,
};
