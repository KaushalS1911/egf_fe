import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import { FormControl, Grid, IconButton, MenuItem } from '@mui/material';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import { getResponsibilityValue } from '../../permission/permission';
import { useGetConfigs } from '../../api/config';
import { useAuthContext } from '../../auth/hooks';
import RHFExportExcel from '../../components/hook-form/rhf-export-excel';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import RhfDatePicker from '../../components/hook-form/rhf-date-picker.jsx';

// ----------------------------------------------------------------------

export default function InquiryTableToolbar({
  filters,
  onFilters,
  options,
  roleOptions,
  dateError,
  inquiries,
}) {
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [startRecallingDateOpen, setStartRecallingDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [endRecallingDateOpen, setEndRecallingDateOpen] = useState(false);
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
  const handleFilterEndRecallingDate = useCallback(
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        onFilters('endRecallingDate', null);
        return;
      }
      const date = moment(newValue);
      if (date.isValid()) {
        onFilters('endRecallingDate', date.toDate());
      } else {
        console.warn('Invalid date selected');
        onFilters('endRecallingDate', null);
      }
    },
    [onFilters]
  );
  const handleFilterStartRecallingDate = useCallback(
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        onFilters('startRecallingDate', null);
        return;
      }
      const date = moment(newValue);
      if (date.isValid()) {
        onFilters('startRecallingDate', date.toDate());
      } else {
        console.warn('Invalid date selected');
        onFilters('startRecallingDate', null);
      }
    },
    [onFilters]
  );

  const handleFilterAssignTo = useCallback(
    (event) => {
      onFilters('assignTo', typeof event.target.value === 'object' && event.target.value);
    },
    [onFilters]
  );
  const handleFilterInquiryFor = useCallback(
    (event) => {
      onFilters('inquiryFor', event.target.value);
    },
    [onFilters]
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
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1, pr: 1.5 }}
        >
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
              width: { xs: 1, sm: 200 },
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
              Assign To
            </InputLabel>

            <Select
              value={filters.assignTo}
              onChange={handleFilterAssignTo}
              input={<OutlinedInput label="Assign To" sx={{ height: '40px' }} />}
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
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>{' '}
          <FormControl
            sx={{
              flexShrink: 0,
              width: { xs: 1, sm: 200 },
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
              Inquiry For
            </InputLabel>

            <Select
              value={filters.inquiryFor}
              onChange={handleFilterInquiryFor}
              input={<OutlinedInput label="Inquiry For" sx={{ height: '40px' }} />}
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
              {options[0]?.inquiryFor?.map((option) => (
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
            sx={{
              maxWidth: { md: 200 },
              label: {
                mt: -0.8,
                fontSize: '14px',
              },
              '& .MuiInputLabel-shrink': {
                mt: 0,
              },
              input: { height: 7 },
            }}
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
            sx={{
              maxWidth: { md: 200 },
              [`& .${formHelperTextClasses.root}`]: {
                position: { md: 'absolute' },
                bottom: { md: -40 },
              },
              label: {
                mt: -0.8,
                fontSize: '14px',
              },
              '& .MuiInputLabel-shrink': {
                mt: 0,
              },
              input: { height: 7 },
            }}
          />{' '}
          <DatePicker
            label="Start recalling date"
            value={filters.startRecallingDate ? moment(filters.startRecallingDate).toDate() : null}
            open={startRecallingDateOpen}
            onClose={() => setStartRecallingDateOpen(false)}
            onChange={handleFilterStartRecallingDate}
            format="dd/MM/yyyy"
            slotProps={{
              textField: {
                onClick: () => setStartRecallingDateOpen(true),
                fullWidth: true,
              },
            }}
            sx={{
              maxWidth: { md: 200 },
              label: {
                mt: -0.8,
                fontSize: '14px',
              },
              '& .MuiInputLabel-shrink': {
                mt: 0,
              },
              input: { height: 7 },
            }}
          />
          <DatePicker
            label="End recalling date"
            value={filters.endRecallingDate}
            open={endRecallingDateOpen}
            onClose={() => setEndRecallingDateOpen(false)}
            onChange={handleFilterEndRecallingDate}
            format="dd/MM/yyyy"
            slotProps={{
              textField: {
                onClick: () => setEndRecallingDateOpen(true),
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
              label: {
                mt: -0.8,
                fontSize: '14px',
              },
              '& .MuiInputLabel-shrink': {
                mt: 0,
              },
              input: { height: 7 },
            }}
          />
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
          {getResponsibilityValue('print_inquiry_detail', configs, user) && (
            <>
              <MenuItem
                onClick={() => {
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
                <RHFExportExcel
                  data={inquiries}
                  fileName="InquiryData"
                  sheetName="InquiryDetails"
                />
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
      </Stack>
    </>
  );
}

InquiryTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
