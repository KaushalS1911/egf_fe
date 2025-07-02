import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { fDate } from 'src/utils/format-time';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import {
  Box,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuthContext } from '../../auth/hooks';
import { useGetBranch } from '../../api/branch';
import { useSnackbar } from 'notistack';
import Label from '../../components/label';
import { useGetConfigs } from '../../api/config';
import { getResponsibilityValue } from '../../permission/permission';

export default function InquiryTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  mutate,
}) {
  const { date, firstName, lastName, contact, inquiryFor, remark, _id } = row;
  const { configs } = useGetConfigs();
  const [attempts, setAttempts] = useState(row?.attempts || []);
  const [openResponseDialog, setOpenResponseDialog] = useState(false);
  const [responseDate, setResponseDate] = useState(new Date().toISOString().split('T')[0]);
  const [responseRemark, setResponseRemark] = useState('');
  const { user } = useAuthContext();
  const { branch } = useGetBranch();
  const confirm = useBoolean();
  const collapse = useBoolean();
  const popover = usePopover();
  const storedBranch = sessionStorage.getItem('selectedBranch');
  const { enqueueSnackbar } = useSnackbar();

  const handleRespondedClick = () => {
    setOpenResponseDialog(true);
  };

  const handleCloseResponseDialog = () => {
    setOpenResponseDialog(false);
    setResponseDate(new Date().toISOString().split('T')[0]);
    setResponseRemark('');
  };

  const handleAddResponse = () => {
    const newResponse = { date: responseDate, remark: responseRemark };
    setAttempts((prev) => [...prev, newResponse]);
    setResponseDate(new Date().toISOString().split('T')[0]);
    setResponseRemark('');
  };

  const handleSaveResponses = async () => {
    try {
      const payload = { attempts };
      const mainbranchid = branch?.find((e) => e?._id === row?.branch?._id);
      let parsedBranch = storedBranch;

      if (storedBranch !== 'all') {
        try {
          parsedBranch = JSON.parse(storedBranch);
        } catch (error) {
          console.error('Error parsing storedBranch:', error);
        }
      }

      const branchQuery =
        parsedBranch && parsedBranch === 'all'
          ? `branch=${mainbranchid?._id}`
          : `branch=${parsedBranch}`;
      const employeeQuery = user?.role === 'Admin' ? `&assignTo=${row?.assignTo?._id}` : ``;
      const queryString = `${branchQuery}${employeeQuery}`;

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/${user?.company}/inquiry/${_id}?${queryString}`,
        payload
      );

      enqueueSnackbar('Responses saved successfully!', { variant: 'success' });
      setAttempts(response?.data?.data?.attempts);
      mutate();
      handleCloseResponseDialog();
    } catch (error) {
      console.error('Error saving attempts:', error);
      enqueueSnackbar('Error saving responses. Please try again.', { variant: 'error' });
    }
  };

  const isRecentlyUpdated = () => {
    if (!row?.updatedAt || row?.updatedAt === row?.createdAt) return false; // Only apply if updatedAt is different from createdAt
    const updatedAtDate = new Date(row.updatedAt);
    const currentTime = new Date();
    const timeDiff = currentTime - updatedAtDate;
    return timeDiff <= 24 * 60 * 60 * 1000;
  };

  return (
    <>
      <TableRow
        hover
        selected={selected}
        sx={{
          backgroundColor: isRecentlyUpdated() ? '#F6F7F8' : 'inherit',
        }}
      >
        {' '}
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(date) || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {`${row.assignTo.user.firstName} ${row.assignTo.user.middleName} ${row.assignTo.user.lastName}`}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{firstName + ' ' + lastName}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{firstName + ' ' + lastName}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{contact || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{inquiryFor || '-'}</TableCell>
        <TableCell sx={{ width: 350 }}>{remark || '-'}</TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={
              (row?.status === 'Completed' && 'success') ||
              (row?.status === 'Responded' && 'warning') ||
              (row?.status === 'Active' && 'info') ||
              (row?.status === 'Not Responded' && 'error') ||
              'default'
            }
          >
            {row?.status}
          </Label>
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          {row?.attempts && (
            <IconButton
              color={collapse.value ? 'inherit' : 'default'}
              onClick={collapse.onToggle}
              sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
            >
              <Iconify icon="eva:arrow-ios-downward-fill" />
            </IconButton>
          )}
          {getResponsibilityValue('inquiry_follow_Up', configs, user) && (
            <IconButton onClick={handleRespondedClick}>
              <Iconify icon="eva:edit-fill" />
            </IconButton>
          )}
          {getResponsibilityValue('delete_inquiry', configs, user) ||
          getResponsibilityValue('update_inquiry', configs, user) ? (
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          ) : (
            ''
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ p: 0, border: 'none' }} colSpan={9}>
          <Collapse
            in={collapse.value}
            timeout="auto"
            unmountOnExit
            sx={{ bgcolor: 'background.neutral' }}
          >
            <Stack component={Paper} sx={{ m: 1.5 }}>
              {attempts?.map((item, index) => (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  sx={{
                    px: 1,
                    p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                    '&:not(:last-of-type)': {
                      borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                    },
                  }}
                >
                  <TableCell sx={{ mr: 3 }}>{index + 1}</TableCell>
                  <TableCell>
                    <Box>{item?.date}</Box>
                  </TableCell>
                  <TableCell>
                    <Box>{item?.remark}</Box>
                  </TableCell>
                </Stack>
              ))}
            </Stack>
          </Collapse>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {getResponsibilityValue('delete_inquiry', configs, user) && (
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
        {getResponsibilityValue('update_inquiry', configs, user) && (
          <MenuItem
            onClick={() => {
              onEditRow(_id);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        )}
      </CustomPopover>
      <Dialog open={openResponseDialog} onClose={handleCloseResponseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Add Response</DialogTitle>
        <DialogContent dividers>
          {attempts.map((attempt, index) => (
            <Stack
              key={index}
              spacing={1.5}
              sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                Response {index + 1}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextField
                  label="Date"
                  type="date"
                  value={attempt.date}
                  onChange={(e) => {
                    const newAttempts = [...attempts];
                    newAttempts[index].date = e.target.value;
                    setAttempts(newAttempts);
                  }}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  sx={{ px: 1 }}
                  label="Remark"
                  value={attempt.remark}
                  onChange={(e) => {
                    const newAttempts = [...attempts];
                    newAttempts[index].remark = e.target.value;
                    setAttempts(newAttempts);
                  }}
                  multiline
                  rows={1}
                  placeholder="Add a remark"
                  fullWidth
                />
              </Box>
            </Stack>
          ))}
          <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 1 }}>
            <Button
              onClick={handleAddResponse}
              variant="outlined"
              sx={{ borderColor: 'primary.main', color: 'primary.main' }}
            >
              Add Another Response
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseResponseDialog}>Cancel</Button>
          <Button onClick={handleSaveResponses} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

InquiryTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
