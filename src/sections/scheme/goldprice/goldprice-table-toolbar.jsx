import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// ----------------------------------------------------------------------

export default function GoldpriceTableToolbar({
                                                filters,
                                                onFilters,
                                                //
                                                roleOptions,
                                                goldRate,
                                              }) {
  const popover = usePopover();
  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters],
  );
  useEffect(() => {
    onFilters('name', goldRate);
  }, [goldRate]);
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
        <Stack direction='row' alignItems='center' spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            defaultValue={goldRate || ''} // Ensures that defaultValue is handled properly
            fullWidth
            value={filters.name}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only digits (and optionally a decimal point)
              const numericValue = value.replace(/[^0-9]/g, ''); // Use /[^0-9.]/g if you want to allow decimals
              handleFilterName({ target: { value: numericValue } });
            }}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Restricts input to numbers
          />


          {/*<IconButton onClick={popover.onOpen}>*/}
          {/*  <Iconify icon="eva:more-vertical-fill" />*/}
          {/*</IconButton>*/}
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow='right-top'
        sx={{ width: 140 }}
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
          <Iconify icon='solar:import-bold' />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon='solar:export-bold' />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}

GoldpriceTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
