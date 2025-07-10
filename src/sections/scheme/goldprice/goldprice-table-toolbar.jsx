import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Box, Dialog, DialogActions } from '@mui/material';
import Button from '@mui/material/Button';
import { PDFViewer } from '@react-pdf/renderer';
import { useBoolean } from '../../../hooks/use-boolean.js';
import { useGetConfigs } from '../../../api/config.js';
import GoldpricePdf from './goldprice-pdf.jsx';
import IconButton from '@mui/material/IconButton';
import { useAuthContext } from '../../../auth/hooks/index.js';
import { getResponsibilityValue } from '../../../permission/permission.js';

// ----------------------------------------------------------------------

export default function GoldpriceTableToolbar({
  filters,
  onFilters,
  roleOptions,
  goldRate,
  schemeData,
}) {
  const { user } = useAuthContext();
  const popover = usePopover();
  const view = useBoolean();
  const { configs } = useGetConfigs();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
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
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            sx={{ input: { height: 7 } }}
            defaultValue={goldRate || ''}
            fullWidth
            value={filters.name}
            onChange={(e) => {
              const value = e.target.value;
              const numericValue = value.replace(/[^0-9]/g, '');
              handleFilterName({ target: { value: numericValue } });
            }}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />
        </Stack>
        <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>
      {getResponsibilityValue('gold_price_change_print', configs, user) && <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow='right-top'
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            view.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon='solar:printer-minimalistic-bold' />
          Print
        </MenuItem>
      </CustomPopover>}
      <Dialog fullScreen open={view.value} onClose={view.onFalse}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions sx={{ p: 1.5 }}>
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <GoldpricePdf scheme={schemeData} configs={configs} goldRate={goldRate} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

GoldpriceTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
