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
import IconButton from '@mui/material/IconButton';
import LetterOfAuthority from '../disburse/letter-of-authority';
import SansactionLetter from '../disburse/sansaction-letter';
import LoanIssueDetails from '../loanissue/view/loan-issue-details';


// ----------------------------------------------------------------------

export default function LoanpayhistoryTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, index }) {
  const { loanNo, customer, scheme, loanAmount, cashAmount, bankAmount, _id, status, srNo } = row;
  const confirm = useBoolean();
  const [nocData, setNocData] = useState();
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const view = useBoolean();
  const [dialogContent, setDialogContent] = useState(null);
  let color;
  switch (status){
    case 'Closed' : {
      color = '#FFF1D6'
      break;
    }
    case 'Overdue' : {
      color = '#FFE4DE'
      break;
    }
    default : {
      color = ''
    }
  }
  console.log(color)

  const handleDialogOpen = (content) => {
    setDialogContent(content);
    view.onTrue();
  };

  const renderDialogContent = () => {
    if (dialogContent === 'loanDetails') {
      return <LoanIssueDetails selectedRow={row} />;
    } if (dialogContent === 'sanction') {
      return <SansactionLetter sansaction={row} />;
    }
    if (dialogContent === 'authority') {
      return <LetterOfAuthority loan={row} />;
    }
    if (dialogContent === 'notice') {
      return <Notice noticeData={row} />;
    }
    if (dialogContent === 'noc') {
      return <Noc nocData={row} />;
    }

    return null;
  };
  return (
    <>
      <TableRow hover selected={selected} sx={{backgroundColor: color}}>
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
              (status === 'Disbursed' && 'info') ||
              (status === 'Closed' && 'warning') ||
              (status === 'Overdue' && 'error') ||
              (status === 'Regular' && 'success') ||
              'default'
            }
          >
            {status}
          </Label></TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>
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
            handleDialogOpen('loanDetails');
            popover.onClose();
          }}
        >
          <Iconify icon='clarity:details-line' />
          Loan Details
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDialogOpen('sanction');
            popover.onClose();
          }}
        >
          <Iconify icon='mdi:file-document-outline' />
          Sanction </MenuItem>
        <MenuItem
          onClick={() => {
            handleDialogOpen('authority');
            popover.onClose();
          }}
        >
          <Iconify icon='material-symbols:verified-user-outline' />
          Authority </MenuItem>
        {
          row.status === 'Closed' ?
            <MenuItem
              onClick={() => {
                handleDialogOpen('noc');
                popover.onClose();
              }}
            >
              <Iconify icon='mdi:certificate-outline' />
              NOC
            </MenuItem>
        :
            <MenuItem
              onClick={() => {
                handleDialogOpen('notice');
                popover.onClose();
              }}
            >
              <Iconify icon='gridicons:notice' />
              Notice
            </MenuItem>
        }
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
          <DialogActions sx={{ p: 1.5 }}>
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              {renderDialogContent()}
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
