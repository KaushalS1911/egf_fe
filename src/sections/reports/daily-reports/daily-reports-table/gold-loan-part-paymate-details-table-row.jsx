import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useAuthContext } from '../../../../auth/hooks';
import { useGetConfigs } from '../../../../api/config';
import { getResponsibilityValue } from '../../../../permission/permission';
import { fDate } from '../../../../utils/format-time';

// ----------------------------------------------------------------------

export default function GoldLoanPartPaymateDetailsTableRow({
  row,
  index,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  handleClick,
}) {
  const { loan, amountPaid } = row;
  const { loanNo, customer, loanAmount, issueDate, interestLoanAmount, scheme } = loan;
  const confirm = useBoolean();
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ padding: '6px' }}>{index + 1}</TableCell>
        <TableCell
          sx={{
            padding: '6px',
          }}
        >
          {loanNo}
        </TableCell>
        <TableCell sx={{ padding: '6px' }}>
          {`${customer?.firstName || ''} ${customer?.middleName || ''} ${customer?.lastName || ''}`}
        </TableCell>
        <TableCell sx={{ padding: '6px' }}>{loanAmount}</TableCell>
        <TableCell sx={{ padding: '6px' }}>{scheme.interestRate}</TableCell>
        <TableCell sx={{ padding: '6px' }}>{fDate(issueDate)}</TableCell>
        <TableCell sx={{ padding: '6px' }}>{interestLoanAmount.toFixed(2)}</TableCell>
        <TableCell sx={{ padding: '6px' }}>{amountPaid}</TableCell>
        <TableCell sx={{ padding: '6px' }}>{fDate(row.createdAt)}</TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {getResponsibilityValue('update_loanIssue', configs, user) && (
          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        )}
        {getResponsibilityValue('delete_loanIssue', configs, user) && (
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
        )}
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

GoldLoanPartPaymateDetailsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
