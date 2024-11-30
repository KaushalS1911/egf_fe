import PropTypes from 'prop-types';

import { useState } from 'react'; // Import useState
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
import { paths } from '../../routes/paths';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../auth/hooks';
import { useGetConfigs } from '../../api/config';
import { getResponsibilityValue } from '../../permission/permission';

import { Box } from '@mui/system';
import { Dialog, DialogActions } from '@mui/material';
import { PDFViewer } from '@react-pdf/renderer';
import LetterOfAuthority from './letter-of-authority';

// ----------------------------------------------------------------------

export default function DisburseTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { loanNo, customer, loanAmount, scheme, cashAmount, bankAmount, _id } = row;
  const confirm = useBoolean();
  const popover = usePopover();
  const view = useBoolean(); // Boolean for handling dialog visibility
  const [selectedRow, setSelectedRow] = useState(null); // State to hold the selected row's data

  const handleView = (row) => {
    setSelectedRow(row);
    view.onTrue();
  };
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
        {getResponsibilityValue('delete_disburse', configs, user) && <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon='solar:trash-bin-trash-bold' />
          Delete
        </MenuItem>}

        {getResponsibilityValue('update_disburse', configs, user) && <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon='solar:pen-bold' />
          Edit
        </MenuItem>}

        <MenuItem
          onClick={() => {
            handleView(row); // Pass the row data to the handleView function
            popover.onClose();
          }}
        >
          <Iconify icon='mdi:eye' />
          View
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

      <Dialog fullScreen open={view.value} onClose={view.onFalse}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color='inherit' variant='contained' onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width='100%' height='100%' style={{ border: 'none' }}>
              {selectedRow && <LetterOfAuthority loan={selectedRow} />}
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
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
