import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Iconify from 'src/components/iconify';
import {
  Box,
  Dialog,
  DialogActions,
  FormControl,
  MenuItem,
  Autocomplete,
  IconButton,
  Button,
} from '@mui/material';
import CustomPopover, { usePopover } from '../../../components/custom-popover';
import { useAuthContext } from '../../../auth/hooks';
import { useGetBranch } from '../../../api/branch';
import { useBoolean } from '../../../hooks/use-boolean';
import { PDFViewer } from '@react-pdf/renderer';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AllBranchLoanSummaryPdf from '../pdf/all-branch-loan-summary-pdf.jsx';
import BranchWiseLoanClosingPdf from '../pdf/branch-wise-loan-closing-pdf.jsx';
import { getResponsibilityValue } from '../../../permission/permission';

export default function BranchWiseLoanClosingTableToolbar({
  filters,
  onFilters,
  dateError,
  dataFilter,
  configs,
  options,
  total,
}) {
  const popover = usePopover();
  const view = useBoolean();
  const { user } = useAuthContext();
  const { branch } = useGetBranch();

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startCloseDateOpen, setStartCloseDateOpen] = useState(false);
  const [endCloseDateOpen, setEndCloseDateOpen] = useState(false);

  const filterData = {
    startDate: filters.startDate,
    endDate: filters.endDate,
    closedBy: filters.closedBy,
    branch: filters.branch,
  };

  // --- Handler Functions ---
  const handleFilterIssuedBy = useCallback(
    (event, newValue) => {
      onFilters('closedBy', newValue);
    },
    [onFilters]
  );

  const handleFilterBranch = useCallback(
    (event, newValue) => {
      onFilters('branch', newValue);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onFilters('startDate', newValue ? moment(newValue).toDate() : null);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('endDate', newValue ? moment(newValue).toDate() : null);
    },
    [onFilters]
  );

  const handleFilterStartCloseDate = useCallback(
    (newValue) => {
      onFilters('startCloseDate', newValue ? moment(newValue).toDate() : null);
    },
    [onFilters]
  );

  const handleFilterEndCloseDate = useCallback(
    (newValue) => {
      onFilters('endCloseDate', newValue ? moment(newValue).toDate() : null);
    },
    [onFilters]
  );

  const customStyle = {
    minWidth: { md: 100 },
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
          sx={{ width: '100%', pr: 1.5 }}
        >
          <Autocomplete
            options={options}
            getOptionLabel={(option) => option?.name || ''}
            value={filters.closedBy || null}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            onChange={handleFilterIssuedBy}
            renderInput={(params) => (
              <TextField {...params} label="Closed By" className={'custom-textfield'} />
            )}
            sx={{ width: 200 }}
          />

          <Autocomplete
            options={branch}
            getOptionLabel={(option) => option?.name || ''}
            value={filters.branch || null}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            onChange={handleFilterBranch}
            renderInput={(params) => (
              <TextField {...params} label="Branch" className={'custom-textfield'} />
            )}
            sx={{ width: 200 }}
          />

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
              },
            }}
            sx={{ ...customStyle }}
          />

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
                error: dateError,
                helperText: dateError && 'End date must be later than start date',
              },
            }}
            sx={{ ...customStyle }}
          />

          <DatePicker
            label="Start close date"
            value={filters.startCloseDate ? moment(filters.startCloseDate).toDate() : null}
            open={startCloseDateOpen}
            onClose={() => setStartCloseDateOpen(false)}
            onChange={handleFilterStartCloseDate}
            format="dd/MM/yyyy"
            slotProps={{
              textField: {
                onClick: () => setStartCloseDateOpen(true),
              },
            }}
            sx={{ ...customStyle }}
          />

          <DatePicker
            label="End close date"
            value={filters.endCloseDate ? moment(filters.endCloseDate).toDate() : null}
            open={endCloseDateOpen}
            onClose={() => setEndCloseDateOpen(false)}
            onChange={handleFilterEndCloseDate}
            format="dd/MM/yyyy"
            slotProps={{
              textField: {
                onClick: () => setEndCloseDateOpen(true),
                error: dateError,
                helperText: dateError && 'End date must be later than start date',
              },
            }}
            sx={{ ...customStyle }}
          />

          {getResponsibilityValue('print_branch_vise_loan_closing_report', configs, user) && (
            <IconButton onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
        </Stack>

        {/* Popover */}
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

      {/* PDF Viewer */}
      <Dialog fullScreen open={view.value} onClose={view.onFalse}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions sx={{ p: 1.5 }}>
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <BranchWiseLoanClosingPdf
                loans={dataFilter}
                configs={configs}
                filterData={filterData}
                total={total}
              />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

BranchWiseLoanClosingTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  dateError: PropTypes.bool,
  dataFilter: PropTypes.array,
  configs: PropTypes.object,
  options: PropTypes.array,
  total: PropTypes.number,
};
