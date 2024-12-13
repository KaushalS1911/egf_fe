import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBoolean } from 'src/hooks/use-boolean';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Box, Dialog, DialogActions } from '@mui/material';
import { PDFViewer } from '@react-pdf/renderer';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { paths } from '../../routes/paths';
import { useAuthContext } from '../../auth/hooks';
import { useGetConfigs } from '../../api/config';
import { getResponsibilityValue } from '../../permission/permission';
import LetterOfAuthority from './letter-of-authority';
import SansactionLetter from './sansaction-letter';
import { useRouter } from '../../routes/hooks';

export default function DisburseTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { loanNo, customer, loanAmount, scheme, cashAmount, bankAmount, _id } = row;
  const confirm = useBoolean();
  const view = useBoolean();
  const popover = usePopover();
  const router = useRouter();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();




  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding='checkbox'>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Link
            to={paths.dashboard.disburse.new(_id)}
            style={{ textDecoration: 'none', fontWeight: 'bold', color: 'inherit' }}
          >
            {loanNo}
          </Link>
        </TableCell>
        <TableCell
          sx={{ whiteSpace: 'nowrap' }}>{customer?.firstName + ' ' + customer?.middleName + ' ' + customer?.lastName}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{customer?.contact}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{scheme?.interestRate}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{cashAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{bankAmount}</TableCell>
        {getResponsibilityValue('create_disburse', configs, user) && <Button
          onClick={() => router.push(paths.dashboard.disburse.new(row._id))}
          sx={{ my: 2, textWrap: 'nowrap', fontSize: '11px' }}
          variant='outlined'
          disabled={row?.status !== 'Issued'}
          startIcon={<Iconify sx={{ width: '15px' }} icon='mingcute:add-line' />}
        >
          Loan Disburse
        </Button> || '-'}
        <TableCell align='right' sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon='eva:more-vertical-fill' />
          </IconButton>
        </TableCell>
      </TableRow>



      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
        {getResponsibilityValue('delete_disburse', configs, user) && (
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
        {getResponsibilityValue('update_disburse', configs, user) && (
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

DisburseTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
