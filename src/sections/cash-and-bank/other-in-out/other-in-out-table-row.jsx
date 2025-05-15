import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { useBoolean } from 'src/hooks/use-boolean.js';
import Iconify from 'src/components/iconify/index.js';
import { ConfirmDialog } from 'src/components/custom-dialog/index.js';
import CustomPopover, { usePopover } from 'src/components/custom-popover/index.js';
import { useAuthContext } from '../../../auth/hooks/index.js';
import { useGetConfigs } from '../../../api/config.js';
import { fDate } from '../../../utils/format-time.js';
import { statusColorMap } from '../../../assets/data/index.js';
import { Box } from '@mui/system';
import React from 'react';
import Label from '../../../components/label/index.js';

// ----------------------------------------------------------------------

export default function OtherInOutTableRow({
                                              row,
                                              selected,
                                              onEditRow,
                                              onSelectRow,
                                              onDeleteRow,
                                            }) {
  const confirm = useBoolean();
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding='checkbox'>
          <TableCell sx={{ fontSize: '12px', textAlign: 'center' }}>
            <Box
              sx={{
                borderRadius: '50%',
                width: 8,
                height: 8,
                bgcolor: statusColorMap[row.status] || 'grey.400',
              }}
            />
          </TableCell>{' '}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.otherIncomeType}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.category}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {fDate(row.date)}
        </TableCell>
        <TableCell
          sx={{
            whiteSpace: 'nowrap',
            color: row.status === 'Payment In' ? 'success.main' : 'error.main',
          }}
        >
          {row?.paymentDetails?.cashAmount || 0}
        </TableCell>
        <TableCell
          sx={{
            whiteSpace: 'nowrap',
            color: row.status === 'Payment In' ? 'success.main' : 'error.main',
          }}
        >
          {row?.paymentDetails?.bankAmount || 0}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row?.paymentDetails?.account?.bankName || '-'}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={
              (row.status === 'Payment Out' && 'success') ||
              (row.status === 'Payment In' && 'error') ||
              'default'
            }
          >
            {row.status}
          </Label>
        </TableCell>
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
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon='solar:trash-bin-trash-bold' />
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon='solar:pen-bold' />
          Edit
        </MenuItem>
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
}

OtherInOutTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
