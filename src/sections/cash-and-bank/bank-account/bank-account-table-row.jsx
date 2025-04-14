import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { useBoolean } from 'src/hooks/use-boolean.js';
import Label from 'src/components/label/index.js';
import Iconify from 'src/components/iconify/index.js';
import { ConfirmDialog } from 'src/components/custom-dialog/index.js';
import CustomPopover, { usePopover } from 'src/components/custom-popover/index.js';
import { useAuthContext } from '../../../auth/hooks/index.js';
import { useGetConfigs } from '../../../api/config.js';
import { getResponsibilityValue } from '../../../permission/permission.js';
import { fDate } from '../../../utils/format-time.js';

// ----------------------------------------------------------------------

export default function BankAccountTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const {
    name,
    ratePerGram,
    interestRate,
    valuation,
    interestPeriod,
    renewalTime,
    minLoanTime,
    schemeType,
    isActive,
  } = row;
  const confirm = useBoolean();
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <TableCell sx={{ fontSize: '12px', textAlign: 'center' }}>
            <Label
              variant="soft"
              sx={{
                borderRadius: '100%',
                height: 12,
                minWidth: 10,
                backgroundColor:
                  (row.status === 'Loan issued' && 'red') ||
                  (row.status === 'Customer Interest' && 'secondary') ||
                  (row.status === 'Part Release' && 'warning') ||
                  (row.status === 'Payment In' && 'error') ||
                  (row.status === 'Loan Part Payment' && 'success') ||
                  (row.status === 'Uchak Interest' && 'success') ||
                  (row.status === 'Uchak Interest' && 'success') ||
                  (row.status === 'Customer Loan Close' && 'success') ||
                  (row.status === 'Other Loan Issued' && 'success') ||
                  (row.status === 'Other Loan Interest' && 'success') ||
                  (row.status === 'Other Loan Close' && 'success') ||
                  'default',
              }}
            ></Label>
          </TableCell>{' '}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.category}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{`${row.detail} (${row.status})`}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.date)}</TableCell>
        <TableCell
          sx={{ whiteSpace: 'nowrap', color: row.category === 'Payment Out' ? 'red' : 'green' }}
        >
          {row.amount}
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          {getResponsibilityValue('delete_scheme', configs, user) ||
          getResponsibilityValue('update_scheme', configs, user) ? (
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          ) : (
            ''
          )}
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {getResponsibilityValue('delete_scheme', configs, user) && (
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
        {getResponsibilityValue('update_scheme', configs, user) && (
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

BankAccountTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
