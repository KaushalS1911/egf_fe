import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
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
import IconButton from '@mui/material/IconButton';
import LetterOfAuthority from '../disburse/letter-of-authority';
import Sansaction11 from '../disburse/sansaction-11.jsx';
import LoanIssueDetails from '../loanissue/view/loan-issue-details';
import { fDate } from '../../utils/format-time';
import Sansaction8 from '../disburse/sansaction-8.jsx';
import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import axios from 'axios'; // Ensure this is properly imported

// ----------------------------------------------------------------------

export default function LoanpayhistoryTableRow({ row, selected, onDeleteRow, loanStatus }) {
  const {
    loanNo,
    customer,
    scheme,
    loanAmount,
    cashAmount,
    bankAmount,
    _id,
    status,
    srNo,
    issueDate,
    interestLoanAmount,
  } = row;
  const confirm = useBoolean();
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const view = useBoolean();
  const [dialogContent, setDialogContent] = useState(null);

  let color;
  switch (status) {
    case 'Closed': {
      color = (theme) => (theme.palette.mode === 'light' ? '#FFF1D6' : '#6f4f07');
      break;
    }
    case 'Overdue': {
      color = (theme) => (theme.palette.mode === 'light' ? '#FFE4DE' : '#611706');
      break;
    }
    case 'Regular': {
      color = (theme) => (theme.palette.mode === 'light' ? '#e4ffde' : '#0e4403');
      break;
    }
    default: {
      color = '';
    }
  }

  const sendPdfToWhatsApp = async () => {
    try {
      // Render PDF as Blob
      const blob = await pdf(<LoanIssueDetails selectedRow={row} configs={configs} />).toBlob();

      // Convert Blob to File
      const file = new File([blob], 'myDocument.pdf', { type: 'application/pdf' });
      console.log(file, 'Generated PDF file');
      // const payload = {
      //   authToken:
      //     'U2FsdGVkX1/A5yh36xRv8+RSCyChUwbiugqyv1HN6qGfe7PzwVW0tgW3wad4vwqvRjqqhjtqwncrksV3+oO7ECoB9P3HagZKrNMbJ9Bp2UjepZbeOpCoZIi5r/kA9nymUR9JHhkvbKpVCH2vUDiV0Hb1V4LSFd+uyIaHiP4VnU25o/8TXJ0YMBTZIQUJYIBP',
      //   name: 'ugh8',
      //   sendto: '919099257198',
      //   originWebsite: 'https://engees.in',
      //   templateName: 'issued_loan',
      //   language: 'en',
      //   myfile: file,
      //   'data[0]': 'darshil thummar',
      //   'data[1]': 'EGF00/21',
      //   'data[2]': '100000',
      //   'data[3]': '18',
      //   'data[4]': '08/01/2025',
      //   'data[5]': '08/02/2025',
      //   'data[6]': 'EGF',
      //   'data[7]': 'EGF',
      // };
      //
      // const formData = new FormData();
      //
      // Object.entries(payload).forEach(([key, value]) => {
      //   formData.append(key, value);
      // });
      //
      // axios
      //   .post('https://app.11za.in/apis/template/sendTemplate', formData)
      //   .then((response) => {
      //     console.log(response);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleDialogOpen = async (content) => {
    setDialogContent(content);

    if (content === 'loanDetails') {
      await sendPdfToWhatsApp();
    }

    view.onTrue();
  };

  const renderDialogContent = () => {
    if (dialogContent === 'loanDetails') {
      return <LoanIssueDetails selectedRow={row} configs={configs} />;
    }
    if (dialogContent === 'sanction-8') {
      return <Sansaction8 sansaction={row} configs={configs} />;
    }
    if (dialogContent === 'sanction-11') {
      return <Sansaction11 sansaction={row} configs={configs} />;
    }
    if (dialogContent === 'authority') {
      return <LetterOfAuthority loan={row} />;
    }
    if (dialogContent === 'notice') {
      return <Notice noticeData={row} configs={configs} />;
    }
    if (dialogContent === 'noc') {
      return <Noc nocData={row} configs={configs} />;
    }
    return null;
  };

  return (
    <>
      <TableRow
        hover
        selected={selected}
        sx={{ backgroundColor: loanStatus === status ? color : color }}
      >
        <TableCell>{srNo}</TableCell>
        {getResponsibilityValue('create_loanIssue', configs, user) ? (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {
              <Link
                to={paths.dashboard.loanPayHistory.edit(_id)}
                style={{
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  color: 'inherit',
                }}
              >
                {loanNo}
              </Link>
            }
          </TableCell>
        ) : (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanNo}</TableCell>
        )}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(issueDate)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {customer.firstName + ' ' + customer.middleName + ' ' + customer.lastName}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{customer.contact}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{interestLoanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanAmount - interestLoanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{scheme.interestRate}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{cashAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{bankAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={
              (status === 'Disbursed' && 'info') ||
              (status === 'Closed' && 'warning') ||
              (status === 'Overdue' && 'error') ||
              (status === 'Regular' && 'success') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleDialogOpen('loanDetails');
            popover.onClose();
          }}
        >
          <Iconify icon="clarity:details-line" />
          Loan Details
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDialogOpen('sanction-8');
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:file-document-outline" />
          Sanction-8{' '}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDialogOpen('sanction-11');
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:file-document-outline" />
          Sanction-11{' '}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDialogOpen('authority');
            popover.onClose();
          }}
        >
          <Iconify icon="material-symbols:verified-user-outline" />
          Authority{' '}
        </MenuItem>
        {row.status === 'Closed' ? (
          <MenuItem
            onClick={() => {
              handleDialogOpen('noc');
              popover.onClose();
            }}
          >
            <Iconify icon="mdi:certificate-outline" />
            NOC
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              handleDialogOpen('notice');
              popover.onClose();
            }}
          >
            <Iconify icon="gridicons:notice" />
            Notice
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
