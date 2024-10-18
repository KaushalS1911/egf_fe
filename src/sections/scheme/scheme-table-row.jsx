import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';


// ----------------------------------------------------------------------

export default function SchemeTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const {name,ratePerGram,interestRate,valuation,interestPeriod,renewalTime,minLoanTime,schemeType,isActive} = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{ratePerGram}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{interestRate}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{valuation}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{interestPeriod}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{renewalTime}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{minLoanTime}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{schemeType}</TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={
              (isActive == true && 'success' ) ||
              (isActive == false && 'error') ||
              'default'
            }
          >
            {isActive?"Active":"In Active"}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
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
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

SchemeTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
