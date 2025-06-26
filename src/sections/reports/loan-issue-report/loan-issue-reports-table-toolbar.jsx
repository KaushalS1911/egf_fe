import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import { Autocomplete, FormControl, IconButton, MenuItem } from '@mui/material';
import CustomPopover, { usePopover } from '../../../components/custom-popover';
import { getResponsibilityValue } from '../../../permission/permission';
import { useAuthContext } from '../../../auth/hooks';
import { useGetConfigs } from '../../../api/config';
import moment from 'moment/moment.js';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useGetBranch } from '../../../api/branch.js';
import RHFExportExcel from '../../../components/hook-form/rhf-export-excel';
import { fDate } from '../../../utils/format-time.js';

// ----------------------------------------------------------------------

export default function LoanIssueReportsTableToolbar({ filters, onFilters, dateError, data }) {
  const popover = usePopover();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const { branch } = useGetBranch();
  const handleFilterName = useCallback(
    (event) => {
      onFilters('username', event.target.value);
    },
    [onFilters]
  );
  console.log(filters);
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

  const handleFilterBranch = useCallback(
    (event) => {
      onFilters(
        'branch',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const customStyle = {
    maxWidth: { md: 350 },
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
          <FormControl sx={{ flexShrink: 0, width: { xs: 1, sm: 300 } }}>
            <Autocomplete
              options={branch}
              getOptionLabel={(option) => option?.name || ''}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              value={branch.find((b) => b._id === filters.branch) || null}
              onChange={(event, newValue) => onFilters('branch', newValue ? newValue._id : null)}
              renderInput={(params) => (
                <TextField {...params} label="Branch" className={'custom-textfield'} />
              )}
            />
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
          {getResponsibilityValue('print_loanPayHistory_detail', configs, user) && (
            <>
              {' '}
              <MenuItem
                onClick={() => {
                  popover.onClose();
                }}
              >
                <Iconify icon="solar:printer-minimalistic-bold" />
                Print
              </MenuItem>
              <MenuItem>
                <RHFExportExcel
                  data={(data || []).map((row) => ({
                    'Sr No': row.srNo,
                    'Loan No.': row.loanNo,
                    'Issue Date': fDate(row.issueDate),
                    'Customer Name': `${row.customer?.firstName} ${row.customer?.middleName} ${row.customer?.lastName}`,
                    'Contact': row.customer?.contact,
                    'Loan Amount': Number(row.loanAmount).toFixed(2),
                    'Interest Loan Amount': Number(row.interestLoanAmount).toFixed(2),
                    'Net Amount': Number(row.loanAmount - row.interestLoanAmount).toFixed(2),
                    'Interest Rate (%)': row.scheme?.interestRate,
                    'Cash Amount': Number(row.cashAmount).toFixed(2),
                    'Bank Amount': Number(row.bankAmount).toFixed(2),
                    'Status': row.status,
                  }))}
                  fileName="LoanIssueReport"
                  sheetName="LoanIssueReportSheet"
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
    </>
  );
}

LoanIssueReportsTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
  data: PropTypes.array,
};
