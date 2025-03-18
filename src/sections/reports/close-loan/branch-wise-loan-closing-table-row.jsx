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

export default function BranchWiseLoanClosingTableRow({
  row,
  index,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  handleClick,
}) {
  const {
    loanNo,
    customer,
    loanAmount,
    scheme,
    status,
    issueDate,
    lastInstallmentDate,
    nextInstallmentDate,
    interestLoanAmount,
    consultingCharge,
    totalPaidInterest,
    day,
    pendingInterest,
    closedBy,
    closeAmt,
    closedDate,
  } = row;
  const confirm = useBoolean();
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{index + 1}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{loanNo}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {`${customer?.firstName || ''} ${customer?.middleName || ''} ${customer?.lastName || ''}`}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{customer?.contact}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {Number(scheme?.interestRate).toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {consultingCharge.toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{fDate(issueDate)}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{loanAmount}</TableCell>{' '}
        <TableCell
          sx={{
            fontSize: '12px',
            padding: '6px',
          }}
        >
          {parseFloat((loanAmount - interestLoanAmount).toFixed(2))}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{interestLoanAmount}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {fDate(lastInstallmentDate) || '-'}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {Number(totalPaidInterest).toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{day > 0 ? day : 0}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{fDate(closedDate)}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{row.closeCharge || 0}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {(closeAmt - row.closeCharge).toFixed(2) || 0}
        </TableCell>
        <TableCell
          sx={{
            fontSize: '12px',
            padding: '6px',
          }}
        >
          {Number(pendingInterest).toFixed(2) || 0}
        </TableCell>
        <TableCell
          sx={{ fontSize: '12px', padding: '6px' }}
        >{`${closedBy.firstName} ${closedBy.middleName} ${closedBy.lastName} `}</TableCell>
        {/*<TableCell*/}
        {/*  sx={{ fontSize: '12px' ,padding: '6px'}}>{fDate(lastInstallmentDate) || '-'}</TableCell>*/}
        {/*<TableCell*/}
        {/*  sx={{ fontSize: '12px' ,padding: '6px'}}>{fDate(nextInstallmentDate) || '-'}</TableCell>*/}
        <TableCell sx={{ fontSize: '12px', width: '0%', padding: '6px' }}>
          <Label variant="soft" color={(status === 'Closed' && 'warning') || 'default'}>
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

BranchWiseLoanClosingTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
