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

// ----------------------------------------------------------------------

export default function CustomerRefReportTableRow({ row }) {
  const { user, initialize } = useAuthContext();
  const { configs } = useGetConfigs();

  return (
    <>
      <TableRow hover>
        <TableCell>{row.srNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {`${row.firstName} ${row.middleName} ${row.lastName}`}
        </TableCell>{' '}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.contact}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.joiningDate) || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.referenceBy}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.permanentAddress.area}</TableCell>
      </TableRow>
    </>
  );
}

CustomerRefReportTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  loanStatus: PropTypes.string,
};
