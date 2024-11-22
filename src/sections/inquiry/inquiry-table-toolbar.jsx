import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import { Grid, IconButton, MenuItem } from '@mui/material';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import { MobileDatePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import { getResponsibilityValue } from '../../permission/permission';
import { useGetConfigs } from '../../api/config';
import { useAuthContext } from '../../auth/hooks';
import RHFExportExcel from '../../components/hook-form/rhf-export-excel';

// ----------------------------------------------------------------------

export default function InquiryTableToolbar({ filters, onFilters, roleOptions, dateError, inquiries }) {
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
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
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <Stack
          direction='row'
          alignItems='center'
          spacing={2}
          flexGrow={1}
          sx={{ width: 1, pr: 1.5 }}
        >
          <TextField
            sx={{ 'input': { height: 7 } }}
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
          <DatePicker
            label='Start date'
            value={filters.startDate ? moment(filters.startDate).toDate() : null}
            open={startDateOpen}
            onClose={() => setStartDateOpen(false)}
            onChange={handleFilterStartDate}
            slotProps={{
              textField: {
                onClick: () => setStartDateOpen(true),
                fullWidth: true,
              },
            }}
            sx={{
              maxWidth: { md: 200 },
              'label': {
                mt: -0.8,
                fontSize: '14px',
              },
              '& .MuiInputLabel-shrink': {
                mt: 0,
              },
              'input': { height: 7 },
            }}
          />
          <DatePicker
            label='End date'
            value={filters.endDate}
            open={endDateOpen}
            onClose={() => setEndDateOpen(false)}
            onChange={handleFilterEndDate}
            slotProps={{
              textField: {
                onClick: () => setEndDateOpen(true),
                fullWidth: true,
                error: dateError,
                helperText: dateError && 'End date must be later than start date',
              },
            }}
            sx={{
              maxWidth: { md: 200 },
              [`& .${formHelperTextClasses.root}`]: {
                position: { md: 'absolute' },
                bottom: { md: -40 },
              },
              'label': {
                mt: -0.8,
                fontSize: '14px',
              },
              '& .MuiInputLabel-shrink': {
                mt: 0,
              },
              'input': { height: 7 },
            }}
          />
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
          {getResponsibilityValue('print_inquiry_detail', configs, user)
          && <>
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
            <MenuItem
            >
              <RHFExportExcel
                data={inquiries}
                fileName='InquiryData'
                sheetName='InquiryDetails'
              />
            </MenuItem>
          </>}
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon='ic:round-whatsapp' />
            whatsapp share
          </MenuItem>
        </CustomPopover>
      </Stack>
    </>
  );
}

InquiryTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
