import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import countrystatecity from '../../_mock/map/csc.json';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useSnackbar } from 'src/components/snackbar';
import { Autocomplete, Tab, Tabs, TextField } from '@mui/material';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useGetAllUser } from 'src/api/user';
import { useGetConfigs } from '../../api/config';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Upload } from '../../components/upload';
import Table from '@mui/material/Table';
import { TableHeadCustom } from '../../components/table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import Iconify from '../../components/iconify';
import { fDate } from '../../utils/format-time';
import InterestPayDetailsForm from './view/interest-pay-details-form';
import PartReleaseForm from './view/part-release-form';
import UchakInterestPayForm from './view/uchak-interest-pay-form';
import LoanPartPaymentForm from './view/loan-part-payment-form';
import LoanCloseForm from './view/loan-close-form';

// ----------------------------------------------------------------------


export default function LoanpayhistoryNewEditForm({ currentLoan , mutate }) {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuthContext();
  const [file, setFile] = useState(currentLoan.propertyImage);
  const NewLoanPayHistorySchema = Yup.object().shape({
    loanNo: Yup.string().required('Loan No. is required'),
    customerName: Yup.string().required('Customer Name is required'),
    address: Yup.string().required('Address is required'),
    contact: Yup.string()
      .required('Mobile number is required')
      .matches(/^\d{10,16}$/, 'Mobile number must be between 10 and 16 digits'),
    issueDate: Yup.date()
      .required('Issue Date is required')
      .nullable()
      .typeError('Invalid Issue Date'),
    schemeName: Yup.string()
      .required('Scheme Name is required')
      .max(10, 'Scheme Name must be exactly 10 characters'),
    closedBy: Yup.string().required('Closed By is required'),
    oldLoanNo: Yup.string()
      .matches(/^[0-9]*$/, 'Old Loan No must be numeric')
      .max(12, 'Old Loan No must be 12 digits or less'),
    interest: Yup.number()
      .required('Interest is required')
      .typeError('Interest must be a number')
      .max(100, 'Interest cannot exceed 100%'),
    consultCharge: Yup.number().required('Consult Charge is required'),
    loanAmount: Yup.number().required('Loan Amount is required'),
    interestLoanAmount: Yup.number().required('Interest Loan Amount is required'),
    loanPeriod: Yup.number().required('Loan Period is required'),
    IntPeriodTime: Yup.number().required('Interest Period Time is required'),
    nextInterestPayDate: Yup.date()
      .nullable()
      .required('Next Interest Pay Date is required')
      .typeError('Invalid Next Interest Pay Date'),
    lastInterestPayDate: Yup.date()
      .nullable()
      .required('Last Interest Pay Date is required')
      .typeError('Invalid Last Interest Pay Date'),
  });
  const defaultValues = useMemo(() => ({
    loanNo: currentLoan?.loanNo || '',
    customerName: currentLoan?.customer.firstName + ' ' + currentLoan?.customer.lastName || '',
    address: `${currentLoan.customer.permanentAddress.street || ''}, ${currentLoan.customer.permanentAddress.landmark || ''}, ${currentLoan.customer.permanentAddress.city || ''}, ${currentLoan.customer.permanentAddress.state || ''}, ${currentLoan.customer.permanentAddress.zipcode || ''}, ${currentLoan.customer.permanentAddress.country || ''}` || '',
    contact: currentLoan?.customer.contact || '',
    issueDate: currentLoan?.issueDate ? new Date(currentLoan?.issueDate) : new Date(),
    schemeName: currentLoan?.scheme.name || '',
    closedBy: currentLoan.closedBy ? (currentLoan?.closedBy?.firstName + ' ' + currentLoan?.closedBy?.lastName) :  null,
    oldLoanNo: currentLoan?.oldLoanNo || '',
    interest: currentLoan?.scheme.interestRate || '',
    consultCharge: currentLoan?.consultingCharge || '',
    loanAmount: currentLoan?.loanAmount || '',
    interestLoanAmount: currentLoan?.interestLoanAmount || '',
    loanPeriod: currentLoan?.scheme.renewalTime || '',
    IntPeriodTime: currentLoan?.scheme.interestPeriod || '',
    createdBy: (user?.firstName + ' ' + user?.lastName) || null,
    renewDate: currentLoan?.issueDate ? new Date(new Date(currentLoan.issueDate).setMonth(new Date(currentLoan.issueDate).getMonth() + 6)) : null,
    nextInterestPayDate: currentLoan?.nextInstallmentDate ? new Date(currentLoan?.nextInstallmentDate) : new Date(),
    lastInterestPayDate: currentLoan?.lastInstallmentDate ? new Date(currentLoan?.lastInstallmentDate) : null,
  }), [currentLoan]);
  const methods = useForm({
    resolver: yupResolver(NewLoanPayHistorySchema),
    defaultValues,
  });


  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentLoan) {
      reset(defaultValues);
    }
  }, [currentLoan, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
  });

  const handleDropSingleFile = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setFile(
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        }),
      );
    }
  }, []);
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
    <FormProvider methods={methods} onSubmit={onSubmit}>
          <Card sx={{ p: 3 }}>
            <Box variant='div' sx={{ mb: 2.5, fontSize: '18px', fontWeight: '700' }}>
              Customer details
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name='loanNo' label='Loan No.' InputProps={{ readOnly: true }} />
              <RHFTextField name='customerName' label='Customer Name' InputProps={{ readOnly: true }} />
              <RHFTextField name='address' label='Address' InputProps={{ readOnly: true }} />
              <RHFTextField
                name='contact'
                label='Mobile No.'
                InputLabelProps={{readOnly: true }}
                inputProps={{ maxLength: 16 }}
              />
              <Controller
                name='issueDate'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label='Issue Date'
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        InputProps:{readOnly: true },
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
              <RHFTextField
                name='schemeName'
                label='Scheme Name'
                InputProps={{ readOnly: true }}
                inputProps={{ minLength: 10, maxLength: 10 }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  methods.setValue('panCard', value, { shouldValidate: true });
                }} />
              <RHFTextField name='closedBy' label='Closed by' InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
              <RHFTextField
                name='oldLoanNo'
                label='Old Loan No'
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true,readOnly: true }}
                inputProps={{ maxLength: 12, pattern: '[0-9]*' }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
              />
            </Box>
            <Box variant='div' sx={{ mt: 2.5, fontSize: '18px', fontWeight: '700' }}>
              Loan Details
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              sx={{ py: 3 }}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField
                name='interest'
                label='Interest %'
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  maxLength: 10,
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                }}
                rules={{
                  required: 'OTP is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit OTP',
                  },
                }}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }} />

              <RHFTextField name='consultCharge'  InputProps={{ readOnly: true }} label='Consult Charge %' InputLabelProps={{ shrink: true }} />
              <RHFTextField name='loanAmount' label='Loan Amount'  InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
              <RHFTextField name='interestLoanAmount' label='Interest Loan Amt'  InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
              <RHFTextField name='loanPeriod' label='Loan Period (Month)'  InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
              <RHFTextField name='IntPeriodTime' label='INT. Period Time'  InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
              <Controller
                name='nextInterestPayDate'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    readOnly={true}
                    label='Next Interest Pay Date'
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        InputLabelProps:{ shrink: true },
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
              <Controller
                name='lastInterestPayDate'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    readOnly={true}
                    label='Last Interest Pay Date'
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        InputLabelProps:{ shrink: true },
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
              <Controller
                name='renewDate'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    readOnly={true}
                    label='Renew Date'
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        InputLabelProps:{ shrink: true },
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
              <RHFTextField name='createdBy' label='Created By' InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} />
            </Box>
          </Card>
    </FormProvider>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title='Property Images' />
            <CardContent>
              <Upload file={file} onDrop={handleDropSingleFile} onDelete={() => setFile(null)} InputProps={{ readOnly: true }} />
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Loan Pay Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Tabs value={activeTab} onChange={handleChange} variant='scrollable' scrollButtons='auto' sx={{ mb: 3 }}>
              <Tab label='Interest Pay Details' />
              <Tab label='Part Release' />
              <Tab label='Uchak Interest Pay Details' />
              <Tab label='Loan Part Payment' />
              <Tab label='Loan Close' />
            </Tabs>
            {(activeTab === 0 && currentLoan) && <InterestPayDetailsForm  currentLoan={currentLoan} mutate={mutate}/>}
            {(activeTab === 1 && currentLoan) && <PartReleaseForm  currentLoan={currentLoan} mutate={mutate}/>}
            {(activeTab === 2 && currentLoan) && <UchakInterestPayForm currentLoan={currentLoan} mutate={mutate}/>}
            {(activeTab === 3 && currentLoan) && <LoanPartPaymentForm  currentLoan={currentLoan} mutate={mutate}/>}
            {(activeTab === 4 && currentLoan) && <LoanCloseForm  currentLoan={currentLoan} mutate={mutate}/>}
          </Card>
        </Grid>
      </Grid>

    </>
  );
}

LoanpayhistoryNewEditForm.propTypes = {
  currentLoan: PropTypes.object,
};
