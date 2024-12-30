import PropTypes from 'prop-types';

import Button from '@mui/material/Button';

import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useAuthContext } from '../../../../auth/hooks';
import { useGetConfigs } from '../../../../api/config';
import { getResponsibilityValue } from '../../../../permission/permission';
import Label from '../../../../components/label';
import { fDate } from '../../../../utils/format-time';


// ----------------------------------------------------------------------

export default function LoanCloseDetailsTableRow({ row,index, selected, onEditRow, onSelectRow, onDeleteRow, handleClick }) {
  const {from,to,penalty,days,loan,amountPaid,totalLoanAmount,closingCharge,netAmount} = row;
  const {loanNo,customer,loanAmount,  scheme, issueDate,interestLoanAmount,}=loan
  const confirm = useBoolean();
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const calculateDateDifference = (date1, date2) => {
    const diffTime = Math.abs(new Date(date1) - new Date(date2));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  };
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{index + 1}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{totalLoanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{totalLoanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{netAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{closingCharge}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{netAmount}</TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow='right-top'
        sx={{ width: 140 }}
      >


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

    </>
  );
}

LoanCloseDetailsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
