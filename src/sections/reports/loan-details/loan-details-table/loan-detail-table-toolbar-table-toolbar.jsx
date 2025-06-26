import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import {
  Box,
  Dialog,
  DialogActions,
  FormControl,
  IconButton,
  Button,
  MenuItem,
} from '@mui/material';
import CustomPopover, { usePopover } from '../../../../components/custom-popover';
import RHFExportExcel from '../../../../components/hook-form/rhf-export-excel';
import { useAuthContext } from '../../../../auth/hooks';
import { useGetConfigs } from '../../../../api/config';
import { getResponsibilityValue } from '../../../../permission/permission';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useGetBranch } from '../../../../api/branch';
import { useBoolean } from '../../../../hooks/use-boolean';
import { PDFViewer } from '@react-pdf/renderer';
import AllBranchLoanSummaryPdf from '../../pdf/all-branch-loan-summary-pdf.jsx';
import { useGetLoanissue } from '../../../../api/loanissue';
import LoanDetailsPdf from '../../pdf/loan-details-pdf.jsx';
import DailyReportPdf from '../../pdf/daily-report-pdf.jsx';
import Autocomplete from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

export default function LoanDetailTableToolbarTableToolbar({
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
  const { Loanissue } = useGetLoanissue();
  const { branch } = useGetBranch();
  const view = useBoolean();

  const filterData = {
    loan: filters.loan,
    startDate: filters.startDate,
    endDate: filters.endDate,
    branch: filters.branch,
  };

  const handleFilterStartDate = useCallback(
    (newValue) => {
      if (!newValue) return onFilters('startDate', null);
      const date = moment(newValue);
      onFilters('startDate', date.isValid() ? date.toDate() : null);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      if (!newValue) return onFilters('endDate', null);
      const date = moment(newValue);
      onFilters('endDate', date.isValid() ? date.toDate() : null);
    },
    [onFilters]
  );

  const handleFilterBranch = useCallback(
    (event, newValue) => {
      const selectedIds = newValue.map((option) => option._id);
      onFilters('branch', selectedIds);
    },
    [onFilters]
  );

  const customStyle = {
    minWidth: { md: 355 },
    label: {
      mt: -0.8,
      fontSize: '14px',
    },
    '& .MuiInputLabel-shrink': {
      mt: 0,
    },
    input: { height: 7 },
  };

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
          {/* Loan Autocomplete */}
          <FormControl sx={{ flexShrink: 0, width: { xs: 1, sm: 355 } }}>
            <Autocomplete
              options={Loanissue}
              getOptionLabel={(option) => option?.loanNo || ''}
              value={Loanissue.find((item) => item._id === filters.loan) || null}
              onChange={(event, newValue) => onFilters('loan', newValue ? newValue._id : null)}
              renderInput={(params) => <TextField {...params} label="Loan" />}
              sx={customStyle}
            />
          </FormControl>

          {/* Branch Autocomplete (Multi-select) */}
          {/*<FormControl sx={{ flexShrink: 0, width: { xs: 1, sm: 350 } }}>*/}
          {/*  <Autocomplete*/}
          {/*    options={branch}*/}
          {/*    getOptionLabel={(option) => option?.name || ''}*/}
          {/*    value={branch.find((b) => b._id === filters.branch) || null}*/}
          {/*    onChange={(event, newValue) => onFilters('branch', newValue ? newValue._id : null)}*/}
          {/*    renderInput={(params) => <TextField {...params} label="Branch" />}*/}
          {/*    sx={customStyle}*/}
          {/*  />*/}
          {/*</FormControl>*/}

          {/* Start Date */}
          <DatePicker
            label="Start date"
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

          {/* End Date */}
          <DatePicker
            label="End date"
            value={filters.endDate ? moment(filters.endDate).toDate() : null}
            open={endDateOpen}
            onClose={() => setEndDateOpen(false)}
            onChange={handleFilterEndDate}
            format="dd/MM/yyyy"
            slotProps={{
              textField: {
                onClick: () => setEndDateOpen(true),
                fullWidth: true,
                error: dateError,
                helperText: dateError && 'End date must be later than start date',
              },
            }}
            sx={customStyle}
          />

          {/* Print Button */}
          {getResponsibilityValue('print_loan_details', configs, user) && (
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

      {/* PDF Viewer Dialog */}
      <Dialog fullScreen open={view.value} onClose={view.onFalse}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions sx={{ p: 1.5 }}>
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <LoanDetailsPdf data={data} configs={configs} filterData={filterData} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

LoanDetailTableToolbarTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
