import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import { Box, Dialog, DialogActions, IconButton, MenuItem } from '@mui/material';
import CustomPopover, { usePopover } from '../../../../components/custom-popover';
import RHFExportExcel from '../../../../components/hook-form/rhf-export-excel';
import { useAuthContext } from '../../../../auth/hooks';
import { getResponsibilityValue } from '../../../../permission/permission';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useGetBranch } from '../../../../api/branch';
import { useBoolean } from '../../../../hooks/use-boolean';
import Button from '@mui/material/Button';
import { PDFViewer } from '@react-pdf/renderer';
import DailyReportPdf from '../../pdf/daily-report-pdf.jsx';
import Autocomplete from '@mui/material/Autocomplete';

export default function DailyReportsTableToolbar({
  filters,
  onFilters,
  dateError,
  dataFilter,
  configs,
  data,
}) {
  const popover = usePopover();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const { user } = useAuthContext();
  const { branch } = useGetBranch();
  const [selectedBranch, setSelectedBranch] = useState(filters.branch || []);
  const view = useBoolean();
  const filterData = {
    branch: selectedBranch,
    date: filters.startDate,
  };

  const handleFilterName = useCallback(
    (event) => {
      onFilters('username', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      if (!newValue) {
        onFilters('startDate', null);
        return;
      }
      const date = moment(newValue);
      onFilters('startDate', date.isValid() ? date.toDate() : null);
    },
    [onFilters]
  );

  const customStyle = {
    minWidth: { md: 200 },
    label: {
      mt: -0.8,
      fontSize: '14px',
    },
    '& .MuiInputLabel-shrink': {
      mt: 0,
    },
    input: { height: 7 },
  };

  const handleFilterBranch = useCallback(
    (event, newValue) => {
      setSelectedBranch(newValue);
      onFilters('branch', newValue);
    },
    [onFilters]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
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
            value={filters.username}
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

          {/*<Autocomplete*/}
          {/*  options={branch}*/}
          {/*  value={selectedBranch}*/}
          {/*  onChange={handleFilterBranch}*/}
          {/*  getOptionLabel={(option) => option.name || ''}*/}
          {/*  isOptionEqualToValue={(option, value) => option._id === value._id}*/}
          {/*  renderInput={(params) => (*/}
          {/*    <TextField*/}
          {/*      {...params}*/}
          {/*      label="Branch"*/}
          {/*      placeholder="Select Branches"*/}
          {/*      sx={customStyle}*/}
          {/*    />*/}
          {/*  )}*/}
          {/*  sx={{ flexShrink: 0, width: { xs: 1, sm: 450 } }}*/}
          {/*/>*/}

          <DatePicker
            label="Date"
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
            sx={customStyle}
          />

          {getResponsibilityValue('print_daily_reports', configs, user) && (
            <IconButton onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
        </Stack>

        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          arrow="right-top"
          sx={{ width: 'auto' }}
        >
          <MenuItem
            onClick={() => {
              view.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>
        </CustomPopover>
      </Stack>

      <Dialog fullScreen open={view.value} onClose={view.onFalse}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions sx={{ p: 1.5 }}>
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <DailyReportPdf
                data={data}
                selectedBranch={selectedBranch}
                configs={configs}
                filterData={filterData}
              />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

DailyReportsTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
  dateError: PropTypes.bool,
  dataFilter: PropTypes.object,
  configs: PropTypes.object,
  data: PropTypes.array,
};
