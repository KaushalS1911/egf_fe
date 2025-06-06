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

export default function InterestReportsTableRow({ row }) {
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
        <TableCell>{row.srNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {`${customer.firstName} ${customer.middleName} ${customer.lastName}`}
        </TableCell>{' '}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.issueDate)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanAmount}</TableCell>
        {/*<TableCell sx={{ whiteSpace: 'nowrap' }}>{loanAmount - interestLoanAmount || 0}</TableCell>*/}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {interestLoanAmount ? interestLoanAmount : '0'}
        </TableCell>
        <TableCell sx b={{ whiteSpace: 'nowrap' }}>
          {scheme.interestRate <= 1.5 ? scheme.interestRate : 1.5}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{consultingCharge}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{(interestAmount || 0).toFixed(2)}</TableCell>{' '}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{(consultingAmount || 0).toFixed(2)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.penaltyAmount ? row.penaltyAmount : '0'}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.day > 0 ? row.day : 0}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.totalPaidInterest ? row.totalPaidInterest.toFixed(2) : '0'}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {lastInstallmentDate ? fDate(lastInstallmentDate) : '-'}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.createdAt) || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.pendingDays > 0 ? row.pendingDays : 0}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{(row.pendingInterest || 0).toFixed(2)}</TableCell>
      </TableRow>
    </>
  );
}

InterestReportsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  loanStatus: PropTypes.string,
};
