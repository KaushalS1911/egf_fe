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
import { useAuthContext } from '../../../../auth/hooks/index.js';
import { useGetConfigs } from '../../../../api/config.js';
import { getResponsibilityValue } from '../../../../permission/permission.js';
import { grey } from '../../../../theme/palette.js';

// ----------------------------------------------------------------------

export default function AccountsTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  setAccountDetails,
  accountDetails,
}) {
  // const {
  //   name,
  //   ratePerGram,
  //   interestRate,
  //   valuation,
  //   interestPeriod,
  //   renewalTime,
  //   minLoanTime,
  //   schemeType,
  //   isActive,
  // } = row;
  const confirm = useBoolean();
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  return (
    <>
      <TableRow
        hover
        selected={selected}
        sx={{ cursor:"pointer", backgroundColor: row?._id === accountDetails?._id ? grey[400] : '' }}
        onClick={() => setAccountDetails(row)}
      >
        {/*<TableCell padding="checkbox">*/}
        {/*  <Checkbox checked={selected} onClick={onSelectRow} />*/}
        {/*</TableCell>*/}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.bankName}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.balance}</TableCell>
        {/*<TableCell sx={{ whiteSpace: 'nowrap' }}>{row.date}</TableCell>*/}
        {/*<TableCell sx={{ whiteSpace: 'nowrap' }}>{row.amount}</TableCell>*/}
        {/*<TableCell>*/}
        {/*  <Label*/}
        {/*    variant="soft"*/}
        {/*    color={(isActive == true && 'success') || (isActive == false && 'error') || 'default'}*/}
        {/*  >*/}
        {/*    {isActive ? 'Active' : 'In Active'}*/}
        {/*  </Label>*/}
        {/*</TableCell>*/}
        {/*<TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>*/}
        {/*  {getResponsibilityValue('delete_scheme', configs, user) ||*/}
        {/*  getResponsibilityValue('update_scheme', configs, user) ? (*/}
        {/*    <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>*/}
        {/*      <Iconify icon="eva:more-vertical-fill" />*/}
        {/*    </IconButton>*/}
        {/*  ) : (*/}
        {/*    ''*/}
        {/*  )}*/}
        {/*</TableCell>*/}
      </TableRow>
      {/*<CustomPopover*/}
      {/*  open={popover.open}*/}
      {/*  onClose={popover.onClose}*/}
      {/*  arrow="right-top"*/}
      {/*  sx={{ width: 140 }}*/}
      {/*>*/}
      {/*  {getResponsibilityValue('delete_scheme', configs, user) && (*/}
      {/*    <MenuItem*/}
      {/*      onClick={() => {*/}
      {/*        confirm.onTrue();*/}
      {/*        popover.onClose();*/}
      {/*      }}*/}
      {/*      sx={{ color: 'error.main' }}*/}
      {/*    >*/}
      {/*      <Iconify icon="solar:trash-bin-trash-bold" />*/}
      {/*      Delete*/}
      {/*    </MenuItem>*/}
      {/*  )}*/}
      {/*  {getResponsibilityValue('update_scheme', configs, user) && (*/}
      {/*    <MenuItem*/}
      {/*      onClick={() => {*/}
      {/*        onEditRow();*/}
      {/*        popover.onClose();*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <Iconify icon="solar:pen-bold" />*/}
      {/*      Edit*/}
      {/*    </MenuItem>*/}
      {/*  )}*/}
      {/*</CustomPopover>*/}
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

AccountsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
