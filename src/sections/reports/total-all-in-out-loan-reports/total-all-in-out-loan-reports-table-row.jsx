import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useAuthContext } from '../../../auth/hooks';
import { useGetConfigs } from '../../../api/config';
import { getResponsibilityValue } from '../../../permission/permission';
import Label from '../../../components/label';
import { fDate } from '../../../utils/format-time';

// ----------------------------------------------------------------------

export default function TotalAllInOutLoanReportsTableRow({
  row,
  index,
  selected,
  onEditRow,
  onDeleteRow,
}) {
  const { loan, day, pendingInterest, otherNumber, otherName, rate, renewalDate, status } = row;
  const { loanNo, customer, loanAmount, scheme, issueDate, interestLoanAmount } = loan;

  const confirm = useBoolean();
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{index + 1}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{loanNo}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{fDate(issueDate)}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {`${customer?.firstName || ''} ${customer?.middleName || ''} ${customer?.lastName || ''}`}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{loanAmount}</TableCell>
        <TableCell
          sx={{
            fontSize: '12px',
            padding: '6px',
          }}
        >
          {parseFloat((loanAmount - interestLoanAmount).toFixed(2)) || 0}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{interestLoanAmount}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {loan.propertyDetails
            .reduce((prev, next) => prev + (Number(next?.totalWeight) || 0), 0)
            .toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {loan.propertyDetails
            .reduce((prev, next) => prev + (Number(next?.netWeight) || 0), 0)
            .toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{scheme.interestRate}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {(row.totalInterestAmount || 0).toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{otherNumber}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{fDate(new Date())}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{otherName}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{loanAmount}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {loan.propertyDetails
            .reduce((prev, next) => prev + (Number(next?.grossWeight) || 0), 0)
            .toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{scheme.interestRate}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {row.totalOtherInterestAmount.toFixed(2)}
        </TableCell>{' '}
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{'100000'}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{'100000'}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px', textAlign: 'center' }}>
          <Label
            variant="soft"
            color={
              (status === 'Disbursed' && 'info') ||
              (status === 'Issued' && 'secondary') ||
              (status === 'Closed' && 'warning') ||
              (status === 'Overdue' && 'error') ||
              (status === 'Regular' && 'success') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>
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

TotalAllInOutLoanReportsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
