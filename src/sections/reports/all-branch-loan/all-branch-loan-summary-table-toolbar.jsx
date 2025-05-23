import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import Stack from '@mui/material/Stack';
import Iconify from 'src/components/iconify';
import { Box, Dialog, DialogActions, FormControl, Grid, IconButton, MenuItem } from '@mui/material';
import CustomPopover, { usePopover } from '../../../components/custom-popover';
import RHFExportExcel from '../../../components/hook-form/rhf-export-excel';
import { useAuthContext } from '../../../auth/hooks';
import { getResponsibilityValue } from '../../../permission/permission';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import { useGetBranch } from '../../../api/branch';
import InputLabel from '@mui/material/InputLabel';
import { useBoolean } from '../../../hooks/use-boolean';
import Button from '@mui/material/Button';
import { PDFViewer } from '@react-pdf/renderer';
import AllBranchLoanSummaryPdf from '../pdf/all-branch-loan-summary-pdf.jsx';

// ----------------------------------------------------------------------

export default function AllBranchLoanSummaryTableToolbar({
  filters,
  onFilters,
  dateError,
  dataFilter,
  configs,
  options,
  total,
}) {
  const popover = usePopover();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const { user } = useAuthContext();
  const { branch } = useGetBranch();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const view = useBoolean();
  const filterData = {
    startDate: filters.startDate,
    endDate: filters.endDate,
    issuedBy: filters.issuedBy,
    branch: filters.branch,
  };
  const handleFilterName = useCallback(
    (event) => {
      onFilters('username', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        onFilters('startDate', null);
        return;
      }
      const date = moment(newValue);
      if (date.isValid()) {
        onFilters('startDate', date.toDate());
      } else {
        console.warn('Invalid date selected');
        onFilters('startDate', null);
      }
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        onFilters('endDate', null);
        return;
      }
      const date = moment(newValue);
      if (date.isValid()) {
        onFilters('endDate', date.toDate());
      } else {
        console.warn('Invalid date selected');
        onFilters('endDate', null);
      }
    },
    [onFilters]
  );

  const customStyle = {
    minWidth: { md: 350 },
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
    (event) => {
      setSelectedBranch(event.target.value);
      onFilters(
        'branch',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterIssuedBy = useCallback(
    (event) => {
      onFilters('issuedBy', typeof event.target.value === 'object' && event.target.value);
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
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: '100%', pr: 1.5 }}
        >
          <FormControl
            sx={{
              flexShrink: 0,
              width: { xs: 1, sm: 350 },
            }}
          >
            <InputLabel
              sx={{
                mt: -0.8,
                '&.MuiInputLabel-shrink': {
                  mt: 0,
                },
              }}
            >
              Issued By
            </InputLabel>
            <Select
              value={filters.issuedBy}
              onChange={handleFilterIssuedBy}
              input={<OutlinedInput label="Issued By" sx={{ height: '40px' }} />}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 240,
                    '&::-webkit-scrollbar': {
                      width: '5px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f1f1f1',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#888',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: '#555',
                    },
                  },
                },
              }}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            sx={{
              flexShrink: 0,
              width: { xs: 1, sm: 350 },
            }}
          >
            <InputLabel
              sx={{
                mt: -0.8,
                '&.MuiInputLabel-shrink': {
                  mt: 0,
                },
              }}
            >
              Branch
            </InputLabel>
            <Select
              value={filters.branch}
              onChange={handleFilterBranch}
              input={<OutlinedInput label="Branch" sx={{ height: '40px' }} />}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 240,
                    '&::-webkit-scrollbar': {
                      width: '5px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f1f1f1',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#888',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: '#555',
                    },
                  },
                },
              }}
            >
              {branch.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            sx={{ ...customStyle }}
          />
          <DatePicker
            label="End date"
            value={filters.endDate}
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
            sx={{ ...customStyle }}
          />
          {getResponsibilityValue('print_all_branch_loan_summary', configs, user) && (
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
          <>
            {' '}
            <MenuItem
              onClick={() => {
                popover.onClose();
                view.onTrue();
              }}
            >
              <Iconify icon="solar:printer-minimalistic-bold" />
              Print
            </MenuItem>
            {/*<MenuItem*/}
            {/*  onClick={() => {*/}
            {/*    popover.onClose();*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <Iconify icon="ant-design:file-pdf-filled" />*/}
            {/*  PDF*/}
            {/*</MenuItem>*/}
            {/*<MenuItem>*/}
            {/*  <RHFExportExcel fileName="LaonissueData" sheetName="LoanissueDetails" />*/}
            {/*</MenuItem>*/}
          </>
          {/*<MenuItem*/}
          {/*  onClick={() => {*/}
          {/*    popover.onClose();*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <Iconify icon="ic:round-whatsapp" />*/}
          {/*  whatsapp share*/}
          {/*</MenuItem>*/}
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
              <AllBranchLoanSummaryPdf
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

AllBranchLoanSummaryTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
