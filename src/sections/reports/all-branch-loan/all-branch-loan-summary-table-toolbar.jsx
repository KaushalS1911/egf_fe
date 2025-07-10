import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import moment from 'moment';
import Stack from '@mui/material/Stack';
import Iconify from 'src/components/iconify';
import { fDate } from '../../../utils/format-time';
import { Box, Button, Dialog, DialogActions, IconButton, MenuItem } from '@mui/material';
import CustomPopover, { usePopover } from '../../../components/custom-popover';
import RHFExportExcel from '../../../components/hook-form/rhf-export-excel';
import { useAuthContext } from '../../../auth/hooks';
import { getResponsibilityValue } from '../../../permission/permission';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useGetBranch } from '../../../api/branch';
import { useBoolean } from '../../../hooks/use-boolean';
import { PDFViewer } from '@react-pdf/renderer';
import AllBranchLoanSummaryPdf from '../pdf/all-branch-loan-summary-pdf.jsx';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

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
  const [selectedBranch, setSelectedBranch] = useState([]);
  const view = useBoolean();

  const filterData = {
    startDate: filters.startDate,
    endDate: filters.endDate,
    issuedBy: filters.issuedBy,
    branch: filters.branch,
  };

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

  const handleFilterEndDate = useCallback(
    (newValue) => {
      if (!newValue) {
        onFilters('endDate', null);
        return;
      }
      const date = moment(newValue);
      onFilters('endDate', date.isValid() ? date.toDate() : null);
    },
    [onFilters]
  );

  const handleFilterIssuedBy = useCallback(
    (event) => {
      onFilters('issuedBy', event.target.value);
    },
    [onFilters]
  );

  const handleFilterBranch = useCallback(
    (event) => {
      const value = event.target.value;
      setSelectedBranch(value);
      onFilters('branch', value);
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
          <Autocomplete
            value={filters.issuedBy || null}
            onChange={(event, newValue) => handleFilterIssuedBy({ target: { value: newValue } })}
            options={options}
            getOptionLabel={(option) => option?.name || ''}
            isOptionEqualToValue={(option, value) => option?.name === value?.name}
            renderInput={(params) => (
              <TextField {...params} label="Issued By" className={'custom-textfield'} />
            )}
            sx={{ width: { xs: '100%', sm: 800 } }}
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
            value={filters.endDate}
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
          <MenuItem
            onClick={() => {
              popover.onClose();
              view.onTrue();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>
          <MenuItem>
            <RHFExportExcel
              data={dataFilter?.map((row, index) => ({
                'Sr No': index + 1,
                'Loan No.': row.loanNo,
                'Customer Name': `${row.customer?.firstName || ''} ${row.customer?.middleName || ''} ${row.customer?.lastName || ''}`,
                'Contact': row.customer?.contact,
                'Interest Rate (%)': Number(row.scheme?.interestRate > 1.5 ? 1.5 : row.scheme?.interestRate).toFixed(2),
                'Other Interest (%)': Number(row.consultingCharge).toFixed(2) || 0,
                'Issue Date': fDate(row.issueDate),
                'Loan Amount': row.loanAmount,
                'Last Amount Pay Date': fDate(row.lastAmtPayDate) || '-',
                'Loan Amount Pay': parseFloat((row.loanAmount - row.interestLoanAmount).toFixed(2)),
                'Interest Loan Amount': row.interestLoanAmount,
                'Last Interest Pay Date': fDate(row.lastInstallmentDate) || '-',
                'Days': row.day > 0 ? row.day : 0,
                'Total Interest Pay': row.totalPaidInterest.toFixed(2),
                'Pending Days': row.pendingDays > 0 ? row.pendingDays : 0,
                'Pending Interest': Number(row.pendingInterest).toFixed(2) || 0,
                'Next Interest Pay Date': fDate(row.nextInstallmentDate) || '-',
                'Approval Charge': row.approvalCharge || 0,
                'Status': row.status
              })) || []}
              fileName="AllBranchLoanSummary"
              sheetName="AllBranchLoanSummarySheet"
            />
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
  dateError: PropTypes.bool,
  dataFilter: PropTypes.array,
  configs: PropTypes.object,
  options: PropTypes.array,
  total: PropTypes.number,
};
