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
import { useAuthContext } from '../../../auth/hooks';
import { useGetConfigs } from '../../../api/config';
import { getResponsibilityValue } from '../../../permission/permission';
import Label from '../../../components/label';
import { fDate } from '../../../utils/format-time';
import moment from 'moment';

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
  } = row;
  const confirm = useBoolean();
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{index + 1}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {`${customer?.firstName || ''} ${customer?.middleName || ''} ${customer?.lastName || ''}`}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{customer?.contact}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{(scheme?.interestRate).toFixed(2)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{consultingCharge.toFixed(2)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(issueDate)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(lastInstallmentDate) || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{parseFloat((loanAmount - interestLoanAmount).toFixed(2))}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{interestLoanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(lastInstallmentDate) || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{totalPaidInterest.toFixed(2)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{day > 0 ? day : 0}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{Number(pendingInterest).toFixed(2) || 0}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(nextInstallmentDate) || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant='soft'
            color={
              (status === 'Closed' && 'warning') ||
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
};

BranchWiseLoanClosingTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
