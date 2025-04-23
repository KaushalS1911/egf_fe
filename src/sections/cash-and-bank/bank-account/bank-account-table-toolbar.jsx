import PropTypes from 'prop-types';
import { useCallback } from 'react';
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
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';

// ----------------------------------------------------------------------

export default function BankAccountTableToolbar({ filters, onFilters, schemes, accountDetails }) {
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  return (
    <>
      <Box sx={{p:2.5}}>
        <Typography sx={{color: 'text.secondary'}} variant="subtitle1"  component="p" >
          Bank Name : {accountDetails.bankName}
        </Typography>
        <Typography variant="subtitle1" sx={{color: 'text.secondary'}} component="p" >
          Account Number : {accountDetails.accountNumber}
        </Typography>
        <Typography variant="subtitle1" sx={{color: 'text.secondary'}} component="p">
          IFSC Code : {accountDetails.IFSC}
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
          px: 2.5,
          pb: 2
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
    </>
  );
}

BankAccountTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
