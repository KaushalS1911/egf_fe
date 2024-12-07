import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { RouterLink } from '../../routes/components';
import { useAuthContext } from '../../auth/hooks';
import { useGetConfigs } from '../../api/config';
import { getResponsibilityValue } from '../../permission/permission';
import { Box } from '@mui/system';
import { Dialog, DialogActions } from '@mui/material';
import { PDFViewer } from '@react-pdf/renderer';
import LetterOfAuthority from '../disburse/letter-of-authority';
import LoanInvoice from '../../components/invoise/invoice-header';
import { useState } from 'react';
import LoanIssueDetails from './view/loan-issue-details';
import { useViews } from '@mui/x-date-pickers/internals/hooks/useViews';


// ----------------------------------------------------------------------

export default function LoanissueTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, handleClick }) {
  const { loanNo, customer, loanAmount, scheme, cashAmount, bankAmount } = row;
  const confirm = useBoolean();
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const [selectedRow, setSelectedRow] = useState(null); // State to hold the selected row's data
  const view = useBoolean();
  const handleView = (row) => {
    setSelectedRow(row);
    view.onTrue();
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding='checkbox'>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanNo}</TableCell>
        <TableCell
          sx={{ whiteSpace: 'nowrap' }}>{customer?.firstName + ' ' + customer?.middleName + ' ' + customer?.lastName}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{customer?.contact}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{scheme?.interestRate}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{cashAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{bankAmount}</TableCell>
        <TableCell align='right' sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon='eva:more-vertical-fill' />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow='right-top'
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleView(row); // Pass the row data to the handleView function
            popover.onClose();
          }}>
          <Iconify icon='solar:printer-minimalistic-bold' />

          Print Details
        </MenuItem>

        {getResponsibilityValue('update_loanIssue', configs, user) && <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon='solar:pen-bold' />
          Edit
        </MenuItem>}
        {getResponsibilityValue('delete_loanIssue', configs, user) && <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon='solar:trash-bin-trash-bold' />
          Delete
        </MenuItem>}
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title='Delete'
        content='Are you sure want to delete?'
        action={
          <Button variant='contained' color='error' onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
      <Dialog fullScreen open={view.value} onClose={view.onFalse}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color='inherit' variant='contained' onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width='100%' height='100%' style={{ border: 'none' }}>
              {<LoanIssueDetails selectedRow={selectedRow} />}
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

LoanissueTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
