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

export default function InterestEntryReportsTableRow({ row }) {
  const {
    loanNo,
    customer,
    scheme,
    loanAmount,
    _id,
    interestLoanAmount,
    consultingCharge,
    lastInstallmentDate,
    interestAmount,
    consultingAmount,
  } = row;

  const { user, initialize } = useAuthContext();
  const { configs } = useGetConfigs();

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.srNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.loan.loanNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.from)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.to)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.loan.loanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.interestLoanAmount?.toFixed(2)}</TableCell>
        <TableCell
          sx={{
            py: 0,
            px: 2,
          }}
        >
          {row.loan.scheme.interestRate}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{(row?.interestAmount).toFixed(2) || 0}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {Number(row?.consultingCharge).toFixed(2)}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.penalty}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {(row.interestAmount + row.penalty + row.consultingCharge).toFixed(2)}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.uchakInterestAmount || 0}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.old_cr_dr}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.adjustedPay}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.days}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.createdAt)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.paymentDetail.cashAmount || 0}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.paymentDetail.bankAmount || 0}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row?.paymentDetail?.account?.bankName || '-'}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.amountPaid}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.entryBy}</TableCell>
      </TableRow>
    </>
  );
}

InterestEntryReportsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  loanStatus: PropTypes.string,
};
