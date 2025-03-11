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
import Notice from '../../reminder/view/notice';
import { paths } from '../../../routes/paths';
import LoanIssueDetails from '../../loanissue/view/loan-issue-details.jsx';

// ----------------------------------------------------------------------

export default function LoanIssueReportsTableRow({ row }) {
  const {
    loanNo,
    customer,
    scheme,
    loanAmount,
    cashAmount,
    bankAmount,
    _id,
    status,
    srNo,
    issueDate,
    interestLoanAmount,
    consultingCharge,
    nextInstallmentDate,
    company,
  } = row;

  const { user, initialize } = useAuthContext();
  const { configs } = useGetConfigs();
  const popover = usePopover();
  const view = useBoolean();

  return (
    <>
      <TableRow hover>
        <TableCell>{srNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(issueDate)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {`${customer.firstName} ${customer.middleName} ${customer.lastName}`}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{customer.contact}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{interestLoanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanAmount - interestLoanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{scheme.interestRate}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{cashAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{bankAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={
              (status === 'Disbursed' && 'info') ||
              (status === 'Closed' && 'warning') ||
              (status === 'Overdue' && 'error') ||
              (status === 'Regular' && 'success') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            view.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>
      </CustomPopover>{' '}
      <Dialog fullScreen open={view.value} onClose={view.onFalse}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions sx={{ p: 1.5 }}>
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <LoanIssueDetails selectedRow={row} configs={configs} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

LoanIssueReportsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  loanStatus: PropTypes.string,
};
