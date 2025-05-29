import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify/index.js';
import CustomPopover, { usePopover } from 'src/components/custom-popover/index.js';
import RHFExportExcel from '../../../components/hook-form/rhf-export-excel.jsx';
import { getResponsibilityValue } from '../../../permission/permission.js';
import { useAuthContext } from '../../../auth/hooks/index.js';
import { useGetConfigs } from '../../../api/config.js';
import moment from 'moment/moment.js';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Dialog, DialogActions, FormControl } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import { PDFViewer } from '@react-pdf/renderer';
import InqiryPdf from '../../inquiry/view/inqiry-pdf.jsx';
import { useBoolean } from '../../../hooks/use-boolean.js';
import CashInPdf from './view/cash-in-pdf.jsx';

// ----------------------------------------------------------------------

export default function CashInTableToolbar({
  filters,
  onFilters,
  schemes,
  dateError,
  options,
  cashData,
  totalAmount,
}) {
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const view = useBoolean();

  const filterData = {
    startDate: filters.startDate,
    endDate: filters.endDate,
    category: filters.category,
    status: filters.status,
  };

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        onFilters('startDate', null);
        return;
      }
      const date = moment(newValue);
      if (date.isValid()) {
        onFilters('startDate', date.toDate());
      } else {
        console.warn('Invalid date selected');
        onFilters('startDate', null);
      }
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        onFilters('endDate', null);
        return;
      }
      const date = moment(newValue);
      if (date.isValid()) {
        onFilters('endDate', date.toDate());
      } else {
        console.warn('Invalid date selected');
        onFilters('endDate', null);
      }
    },
    [onFilters]
  );
  const handleFilterCategory = useCallback(
    (event) => {
      onFilters('category', event.target.value);
    },
    [onFilters]
  );
  const handleFilterStatus = useCallback(
    (event) => {
      onFilters('status', event.target.value);
    },
    [onFilters]
  );
  const customStyle = {
    maxWidth: { md: 350 },
    label: {
      mt: -0.8,
      fontSize: '14px',
    },
    '& .MuiInputLabel-shrink': {
      mt: 0,
    },
    input: { height: 7 },
  };
  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            sx={{ input: { height: 7 } }}
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl
            sx={{
              flexShrink: 0,
              width: { xs: 1, sm: 250 },
            }}
          >
            <InputLabel
              sx={{
                mt: -0.8,
                '&.MuiInputLabel-shrink': {
                  mt: 0,
                },
              }}
            >
              Category
            </InputLabel>
            <Select
              value={filters.category}
              onChange={handleFilterCategory}
              input={<OutlinedInput label="Category" sx={{ height: '40px' }} />}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 240,
                    '&::-webkit-scrollbar': {
                      width: '5px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f1f1f1',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#888',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: '#555',
                    },
                  },
                },
              }}
            >
              {['Payment In', 'Payment Out'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>{' '}
          <FormControl
            sx={{
              flexShrink: 0,
              width: { xs: 1, sm: 250 },
            }}
          >
            <InputLabel
              sx={{
                mt: -0.8,
                '&.MuiInputLabel-shrink': {
                  mt: 0,
                },
              }}
            >
              Type
            </InputLabel>
            <Select
              value={filters.status}
              onChange={handleFilterStatus}
              input={<OutlinedInput label="Type" sx={{ height: '40px' }} />}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 240,
                    '&::-webkit-scrollbar': {
                      width: '5px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f1f1f1',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#888',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: '#555',
                    },
                  },
                },
              }}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DatePicker
            label="Start date"
            value={filters.startDate ? moment(filters.startDate).toDate() : null}
            open={startDateOpen}
            onClose={() => setStartDateOpen(false)}
            onChange={handleFilterStartDate}
            format="dd/MM/yyyy"
            slotProps={{
              textField: {
                onClick: () => setStartDateOpen(true),
                fullWidth: true,
              },
            }}
            sx={{ ...customStyle }}
          />
          <DatePicker
            label="End date"
            value={filters.endDate}
            open={endDateOpen}
            onClose={() => setEndDateOpen(false)}
            onChange={handleFilterEndDate}
            format="dd/MM/yyyy"
            slotProps={{
              textField: {
                onClick: () => setEndDateOpen(true),
                fullWidth: true,
                error: dateError,
                helperText: dateError && 'End date must be later than start date',
              },
            }}
            sx={{ ...customStyle }}
          />
        </Stack>
        <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 'auto' }}
      >
        {getResponsibilityValue('print_scheme_detail', configs, user) && (
          <>
            <MenuItem
              onClick={() => {
                view.onTrue();
                popover.onClose();
              }}
            >
              <Iconify icon="solar:printer-minimalistic-bold" />
              Print
            </MenuItem>
            <MenuItem
              onClick={() => {
                popover.onClose();
              }}
            >
              <Iconify icon="ant-design:file-pdf-filled" />
              PDF
            </MenuItem>
            <MenuItem>
              <RHFExportExcel data={schemes} fileName="SchemeData" sheetName="SchemeDetails" />
            </MenuItem>
          </>
        )}
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="ic:round-whatsapp" />
          whatsapp share
        </MenuItem>
      </CustomPopover>
      <Dialog fullScreen open={view.value} onClose={view.onFalse}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions sx={{ p: 1.5 }}>
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <CashInPdf cashData={cashData} configs={configs} filterData={filterData} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

CashInTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
