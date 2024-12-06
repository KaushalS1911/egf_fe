import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useRouter } from '../../routes/hooks';
import { paths } from '../../routes/paths';
import { Link } from 'react-router-dom';
import Label from '../../components/label';
import { useAuthContext } from '../../auth/hooks';
import { useGetConfigs } from '../../api/config';
import { getResponsibilityValue } from '../../permission/permission';
import { Box, Dialog, DialogActions, Typography } from '@mui/material';
import { PDFViewer } from '@react-pdf/renderer';
import Notice from '../reminder/view/notice';
import Noc from './PDF/noc';
import { useState } from 'react';


// ----------------------------------------------------------------------

export default function LoanpayhistoryTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, index }) {
  const { loanNo, customer, scheme, loanAmount, cashAmount, bankAmount, _id, status, srNo } = row;
  const confirm = useBoolean();
  const [nocData, setNocData] = useState();
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const view = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          {srNo}
        </TableCell>
        {getResponsibilityValue('create_loanIssue', configs, user) ? <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {<Link to={paths.dashboard.loanPayHistory.edit(_id)} style={{
              textDecoration: 'none',
              fontWeight: 'bold',
              color: 'inherit',
            }}>{loanNo}</Link>}
          </TableCell> :
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {loanNo}
          </TableCell>}
        <TableCell
          sx={{ whiteSpace: 'nowrap' }}>{customer.firstName + ' ' + customer.middleName + ' ' + customer.lastName}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{customer.contact}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{scheme.interestRate}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{cashAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{bankAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant='soft'
            color={
              (status === 'Disbursed' && 'success') ||
              (status === 'Closed' && 'error') ||
              'default'
            }
          >
            {status}
          </Label></TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>{
          <Typography onClick={() => {
            if (row.status === 'Closed') {
              view.onTrue();
              setNocData(row);
            }
          }} sx={{
            cursor: row.status !== 'Closed' ? 'not-allowed' : 'pointer',
            color: row.status !== 'Closed' ? 'grey.500' : 'inherit',
            pointerEvents: row.status !== 'Closed' ? 'none' : 'auto',
          }}>
            <Iconify icon='basil:document-solid' />
          </Typography>
        }</TableCell>
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

      <Dialog fullScreen open={view.value}>
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
              <Noc nocData={nocData} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
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
