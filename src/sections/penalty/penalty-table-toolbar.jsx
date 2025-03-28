import PropTypes from 'prop-types';
import { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { IconButton } from '@mui/material';
import RHFExportExcel from '../../components/hook-form/rhf-export-excel';
import { useAuthContext } from '../../auth/hooks';
import { useGetConfigs } from '../../api/config';
import { getResponsibilityValue } from '../../permission/permission';

// ----------------------------------------------------------------------

export default function PenaltyTableToolbar({
                                              filters,
                                              onFilters, penalties,
                                            }) {
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();

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
        }}
      >
        <Stack direction='row' alignItems='center' spacing={2} flexGrow={1} sx={{ width: 1 }}>
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
          <IconButton onClick={popover.onOpen}>
            <Iconify icon='eva:more-vertical-fill' />
          </IconButton>
        </Stack>
      </Stack>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow='right-top'
        sx={{ width: 155 }}
      >
        {getResponsibilityValue('print_penalty_detail', configs, user) && (<>  <MenuItem
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
          >
            <RHFExportExcel
              data={penalties}
              fileName='PenaltyData'
              sheetName='PenaltyDetails'
            />
          </MenuItem></>)}
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

PenaltyTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
