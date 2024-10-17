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
import ReminderRecallingForm from './reminder-recalling-form';
import { useState } from 'react';
import { fDate } from '../../utils/format-time';

export default function ReminderDetailsTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { loan, createdAt,nextRecallingDate,remark} = row;
  const [open, setOpen] = useState(false);
  const confirm = useBoolean();
  const popover = usePopover();
  const recallingPopover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding='checkbox'>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loan.loanNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(createdAt)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(nextRecallingDate)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{remark}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loan.customer.firstName + " " + loan.customer.lastName}</TableCell>

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
            popover.onClose();
            recallingPopover.onOpen(ReminderRecallingForm);
            setOpen(true);
          }}
        >
          <Iconify icon='solar:pen-bold' />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon='solar:trash-bin-trash-bold' />
          Delete
        </MenuItem>
      </CustomPopover>

      <CustomPopover
        open={recallingPopover.open}
        onClose={recallingPopover.onClose}
        arrow='right-top'
        sx={{ width: 400 }}
      >
        <ReminderRecallingForm onClose={recallingPopover.onClose} />
      </CustomPopover>
      <ReminderRecallingForm currentReminderDetails={row} open={open} setOpen={() => setOpen(false)} />
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

ReminderDetailsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
