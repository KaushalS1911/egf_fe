import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import { Box, Dialog, DialogActions, FormControl, Grid, IconButton, MenuItem } from '@mui/material';
import CustomPopover, { usePopover } from '../../../../components/custom-popover';
import RHFExportExcel from '../../../../components/hook-form/rhf-export-excel';
import { useAuthContext } from '../../../../auth/hooks';
import { useGetConfigs } from '../../../../api/config';
import { getResponsibilityValue } from '../../../../permission/permission';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import { useGetBranch } from '../../../../api/branch';
import InputLabel from '@mui/material/InputLabel';
import { useBoolean } from '../../../../hooks/use-boolean';
import Button from '@mui/material/Button';
import { PDFViewer } from '@react-pdf/renderer';
import AllBranchLoanSummaryPdf from '../../pdf/all-branch-loan-summary-pdf.jsx';
import { useGetLoanissue } from '../../../../api/loanissue';
import LoanDetailsPdf from '../../pdf/loan-details-pdf.jsx';
import DailyReportPdf from '../../pdf/daily-report-pdf.jsx';

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
  // const [selectedBranch,setSelectedBranch] = useState(null)
  const view = useBoolean();
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

  // const handleFilterEndDate = useCallback(
  //   (newValue) => {
  //     if (newValue === null || newValue === undefined) {
  //       onFilters('endDate', null);
  //       return;
  //     }
  //     const date = moment(newValue);
  //     if (date.isValid()) {
  //       onFilters('endDate', date.toDate());
  //     } else {
  //       console.warn('Invalid date selected');
  //       onFilters('endDate', null);
  //     }
  //   },
  //   [onFilters],
  // );
  const customStyle = {
    maxWidth: { md: 200 },
    label: {
      mt: -0.8,
      fontSize: '14px',
    },
    '& .MuiInputLabel-shrink': {
      mt: 0,
    },
    input: { height: 7 },
  };
  const handleFilterLoan = useCallback(
    (event) => {
      // Set the value as a string directly
      onFilters('loan', event.target.value);
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
          sx={{ width: 1, pr: 1.5, display: 'flex', justifyContent: 'space-between' }}
        >
          {/*<TextField*/}
          {/*  sx={{ 'input': { height: 7 } }}*/}
          {/*  fullWidth*/}
          {/*  value={filters.username}*/}
          {/*  onChange={handleFilterName}*/}
          {/*  placeholder='Search...'*/}
          {/*  InputProps={{*/}
          {/*    startAdornment: (*/}
          {/*      <InputAdornment position='start'>*/}
          {/*        <Iconify icon='eva:search-fill' sx={{ color: 'text.disabled' }} />*/}
          {/*      </InputAdornment>*/}
          {/*    ),*/}
          {/*  }}*/}
          {/*/>*/}
          <FormControl
            sx={{
              flexShrink: 0,
              width: { xs: 1, sm: 200 },
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
              Loan
            </InputLabel>

            <Select
              value={filters.loan}
              onChange={handleFilterLoan}
              input={<OutlinedInput label="Loan" sx={{ height: '40px' }} />}
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
              {Loanissue.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option?.loanNo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/*<DatePicker*/}
          {/*  label='Date'*/}
          {/*  value={filters.startDate ? moment(filters.startDate).toDate() : null}*/}
          {/*  open={startDateOpen}*/}
          {/*  onClose={() => setStartDateOpen(false)}*/}
          {/*  onChange={handleFilterStartDate}*/}
          {/*  slotProps={{*/}
          {/*    textField: {*/}
          {/*      onClick: () => setStartDateOpen(true),*/}
          {/*      fullWidth: true,*/}
          {/*    },*/}
          {/*  }}*/}
          {/*  sx={{...customStyle}}*/}
          {/*/>*/}

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
          {getResponsibilityValue('print_loanIssue_detail', configs, user) && (
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
              <MenuItem
                onClick={() => {
                  popover.onClose();
                }}
              >
                <Iconify icon="ant-design:file-pdf-filled" />
                PDF
              </MenuItem>
              <MenuItem>
                <RHFExportExcel
                  // data={loans}
                  fileName="LaonissueData"
                  sheetName="LoanissueDetails"
                />
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
              <LoanDetailsPdf data={data} configs={configs} />
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
