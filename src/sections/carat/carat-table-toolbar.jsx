import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
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
import { Box, Dialog, DialogActions } from '@mui/material';
import Button from '@mui/material/Button';
import { PDFViewer } from '@react-pdf/renderer';
import SchemePdf from '../scheme/view/scheme-pdf.jsx';
import CaratPdf from './view/carat-pdf.jsx';
import { useBoolean } from '../../hooks/use-boolean.js';

// ----------------------------------------------------------------------

export default function CaratTableToolbar({ filters, onFilters, carats, caratData }) {
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const popover = usePopover();
  const view = useBoolean();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
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
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 'auto' }}
      >
        {getResponsibilityValue('print_carat_detail', configs, user) && (
          <>
            {' '}
            <MenuItem
              onClick={() => {
                view.onTrue();
                popover.onClose();
              }}
            >
              <Iconify icon="solar:printer-minimalistic-bold" />
              Print
            </MenuItem>
            <MenuItem>
              <RHFExportExcel data={carats} fileName="InquiryData" sheetName="InquiryDetails" />
            </MenuItem>
          </>
        )}
      </CustomPopover>
      <Dialog fullScreen open={view.value} onClose={view.onFalse}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions sx={{ p: 1.5 }}>
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <CaratPdf carat={caratData} configs={configs} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

CaratTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
