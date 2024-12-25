import PropTypes from 'prop-types';
import { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import { Grid, IconButton, MenuItem } from '@mui/material';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import RHFExportExcel from '../../components/hook-form/rhf-export-excel';
import { useAuthContext } from '../../auth/hooks';
import { useGetConfigs } from '../../api/config';
import { getResponsibilityValue } from '../../permission/permission';

// ----------------------------------------------------------------------

export default function LoanissueTableToolbar({ filters, onFilters, loans }) {
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('username', event.target.value);
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
            value={filters.username}
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
          {getResponsibilityValue('print_loanIssue_detail', configs, user) && (<>   <MenuItem
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
                data={loans}
                fileName='LaonissueData'
                sheetName='LoanissueDetails'
              />
            </MenuItem></>)}
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

LoanissueTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
