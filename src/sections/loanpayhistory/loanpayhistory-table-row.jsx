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
import { useRouter } from '../../routes/hooks';
import { paths } from '../../routes/paths';


// ----------------------------------------------------------------------

export default function LoanpayhistoryTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow ,index}) {
  const {loanNumber , customerID , contact , interestRate ,loanAmount, loanBalance , totalPayable } = row;
  const confirm = useBoolean();
  const router = useRouter();
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected} sx={{cursor: "pointer"}} onClick={() => router.push(paths.dashboard.loanPayHistory.new)}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

          <TableCell>
            {index + 1}
          </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanNumber}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{customerID}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{contact}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{interestRate}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanBalance}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{totalPayable}</TableCell>

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

LoanpayhistoryTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
