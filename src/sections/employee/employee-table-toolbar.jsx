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
import RHFExportExcel from '../../components/hook-form/rhf-export-excel';

// ----------------------------------------------------------------------

export default function EmployeeTableToolbar({ filters, onFilters ,employees}) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
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
            sx={{"input": { height: 7 },}}

            fullWidth
            value={filters.userName}
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
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon='ic:round-whatsapp' />
            whatsapp share
          </MenuItem>
          <MenuItem
          >
            <RHFExportExcel
              data={employees}
              fileName='EmployeeData'
              sheetName='EmployeeDetails'
            />
          </MenuItem>
        </CustomPopover>
      </Stack>
    </>
  );
}

EmployeeTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
