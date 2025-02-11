import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import { IconButton, MenuItem } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useAuthContext } from '../../auth/hooks';
import { useGetConfigs } from '../../api/config';
import { getResponsibilityValue } from '../../permission/permission';

// ----------------------------------------------------------------------

export default function ReminderTableToolbar({ filters, onFilters, dateError, exportToExcel }) {
  const popover = usePopover();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  // const [filters.day, setDay] = useState('Next Week');
  // const days = ['Next Day', 'Next Week', 'Next Month'];
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  useEffect(() => {
    onFilters('day', 'Next Month');
  }, []);

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  useEffect(() => {
    const lastDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    onFilters('endDay', lastDate);
  }, []);
  // const dayManage = (day) => {
  //   const currentDate = new Date();
  //   const nextDay = new Date(new Date().setDate(new Date().getDate() + 1));
  //   const nextWeek = new Date(new Date().setDate(new Date().getDate() + 7));

  // if (day === 'Next Day') {
  //   onFilters('startDay', currentDate);
  //   onFilters('endDay', nextDay);
  // }
  // if (day === 'Next Week') {
  //   onFilters('startDay', currentDate);
  //   onFilters('endDay', nextWeek);
  // }
  // if (day === 'Next Month') {
  // onFilters('startDay', currentDate);
  // }
  // };

  // useEffect(() => {
  //   if (filters.day !== '') {
  //     dayManage(filters.day);
  //   }
  // }, [filters.day]);

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

  const handleFilterDays = useCallback(
    (event) => {
      onFilters('day', event.target.value);
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
          {/*<FormControl*/}
          {/*  sx={{*/}
          {/*    flexShrink: 0,*/}
          {/*    width: { xs: 1, sm: 200 },*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <InputLabel sx={{*/}
          {/*    mt: -1, '&.MuiInputLabel-shrink': {*/}
          {/*      mt: 0,*/}
          {/*    },*/}
          {/*  }}>Filter by Day</InputLabel>*/}
          {/*  <Select*/}
          {/*    value={filters.day}*/}
          {/*    onChange={handleFilterDays}*/}
          {/*    input={<OutlinedInput label='Filter by Day' sx={{ height: '40px' }} />}*/}
          {/*    MenuProps={{*/}
          {/*      PaperProps: {*/}
          {/*        sx: {*/}
          {/*          maxHeight: 240,*/}
          {/*          '&::-webkit-scrollbar': {*/}
          {/*            width: '5px',*/}
          {/*          },*/}
          {/*          '&::-webkit-scrollbar-track': {*/}
          {/*            backgroundColor: '#f1f1f1',*/}
          {/*          },*/}
          {/*          '&::-webkit-scrollbar-thumb': {*/}
          {/*            backgroundColor: '#888',*/}
          {/*            borderRadius: '4px',*/}
          {/*          },*/}
          {/*          '&::-webkit-scrollbar-thumb:hover': {*/}
          {/*            backgroundColor: '#555',*/}
          {/*          },*/}
          {/*        },*/}
          {/*      },*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    {days.map((option) => (*/}
          {/*      <MenuItem key={option} value={option}>*/}
          {/*        {option}*/}
          {/*      </MenuItem>*/}
          {/*    ))}*/}
          {/*  </Select>*/}
          {/*</FormControl>*/}
          <DatePicker
            label="Start date"
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
          {getResponsibilityValue('print_reminder_detail', configs, user) && (
            <>
              {' '}
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
              <MenuItem
                onClick={() => {
                  popover.onClose();
                  exportToExcel();
                }}
              >
                <Iconify icon="icon-park-outline:excel" />
                Export To Excel
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

ReminderTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
  dateError: PropTypes.bool,
};
