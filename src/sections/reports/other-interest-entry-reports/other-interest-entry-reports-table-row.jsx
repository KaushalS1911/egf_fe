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

export default function OtherInterestEntryReportsTableRow({ row }) {
  const { user, initialize } = useAuthContext();
  const { configs } = useGetConfigs();

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.otherLoan.otherLoanNumber}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.from)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.to)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.days > 0 ? row.days : 0}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.interestAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.charge}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {(Number(row.payAfterAdjust) - Number(row.charge || 0)).toFixed(2)}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.paymentDetail.cashAmount || 0}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.paymentDetail.bankAmount || 0}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.paymentDetail.bankName || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.createdAt)}</TableCell>
      </TableRow>
    </>
  );
}

OtherInterestEntryReportsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  loanStatus: PropTypes.string,
};
