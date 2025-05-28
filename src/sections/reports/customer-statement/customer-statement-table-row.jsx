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

  return (
    <>
      <TableRow hover>
        <TableCell>{row.srNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{customerName}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{partLoanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{interestLoanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{amount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(createdAt)}</TableCell>
      </TableRow>
    </>
  );
}

CustomerStatementTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  loanStatus: PropTypes.string,
};
