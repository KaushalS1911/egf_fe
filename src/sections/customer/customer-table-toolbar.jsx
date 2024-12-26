import PropTypes from 'prop-types';
import { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import RHFExportExcel from '../../components/hook-form/rhf-export-excel';
import { getResponsibilityValue } from '../../permission/permission';
import { useAuthContext } from '../../auth/hooks';
import { useGetConfigs } from '../../api/config';

// ----------------------------------------------------------------------

export default function CustomerTableToolbar({
                                               filters,
                                               onFilters,
                                               customers,
                                             }) {
  const popover = usePopover();
  const { configs } = useGetConfigs();
  const { user } = useAuthContext();

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
        sx={{ width: 'auto' }}
      >
        {getResponsibilityValue('print_customer', configs, user) && (<>   <MenuItem
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
              <RHFExportExcel
                data={customers}
                fileName='CustomerData'
                sheetName='CustomerDetails'
              />
            </MenuItem>
          </>
        )}
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

CustomerTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
