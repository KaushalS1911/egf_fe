import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify/index.js';
import CustomPopover, { usePopover } from 'src/components/custom-popover/index.js';
import RHFExportExcel from '../../../components/hook-form/rhf-export-excel.jsx';
import moment from 'moment/moment.js';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, FormControl, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';

// ----------------------------------------------------------------------

export default function ChargeInOutTableToolbar({
                                                  filters,
                                                  onFilters,
                                                  schemes,
                                                  dateError,
                                                  chargeDetails,
                                                }) {
  const popover = usePopover();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters],
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
    [onFilters],
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
    [onFilters],
  );

  const handleFilterCategory = useCallback(
    (event) => {
      onFilters('category', event.target.value);
    },
    [onFilters],
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
      <Box sx={{ p: 2.5 }}>
        <Typography sx={{ color: 'text.secondary' }} variant='subtitle1' component='p'>
          Charge Name : {chargeDetails}
        </Typography>
      </Box>
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
        <Stack direction='row' alignItems='center' spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            sx={{ input: { height: 7 } }}
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder='Search...'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Iconify icon='eva:search-fill' sx={{ color: 'text.disabled' }} />
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
              Status
            </InputLabel>
            <Select
              value={filters.category}
              onChange={handleFilterCategory}
              input={<OutlinedInput label='Category' sx={{ height: '40px' }} />}
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
          </FormControl>
          <DatePicker
            label='Start date'
            value={filters.startDate ? moment(filters.startDate).toDate() : null}
            open={startDateOpen}
            onClose={() => setStartDateOpen(false)}
            onChange={handleFilterStartDate}
            format='dd/MM/yyyy'
            slotProps={{
              textField: {
                onClick: () => setStartDateOpen(true),
                fullWidth: true,
              },
            }}
            sx={{ ...customStyle }}
          />
          <DatePicker
            label='End date'
            value={filters.endDate}
            open={endDateOpen}
            onClose={() => setEndDateOpen(false)}
            onChange={handleFilterEndDate}
            format='dd/MM/yyyy'
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
          <Iconify icon='eva:more-vertical-fill' />
        </IconButton>
      </Stack>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow='right-top'
        sx={{ width: 'auto' }}
      >
        <>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon='solar:printer-minimalistic-bold' />
            Print
          </MenuItem>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon='ant-design:file-pdf-filled' />
            PDF
          </MenuItem>
          <MenuItem>
            <RHFExportExcel data={schemes} fileName='SchemeData' sheetName='SchemeDetails' />
          </MenuItem>
        </>
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon='ic:round-whatsapp' />
          whatsapp share
        </MenuItem>
      </CustomPopover>
    </>
  );
}

ChargeInOutTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
