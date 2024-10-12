import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
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


export default function LoanpayhistoryNewEditForm({ currentEmployee }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(null);

  const NewLoanPayHistorySchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    middleName: Yup.string().required('Middle name is required'),
    lastName: Yup.string().required('Last name is required'),
    drivingLicense: Yup.string(),
    panCard: Yup.string().required('PAN No. is required'),
    voterCard: Yup.string(),
    aadharCard: Yup.string().required('Aadhar Card is required'),
    contact: Yup.string()
      .required('Mobile number is required')
      .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
    dob: Yup.date()
      .required('Date of Birth is required')
      .nullable()
      .typeError('Date of Birth is required'),
    remark: Yup.string(),

    role: Yup.string().required('Role is required'),
    reportingTo: Yup.object().required('Reporting to is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: currentEmployee
      ? Yup.string()
      : Yup.string().required('Password is required'),
    joiningDate: Yup.date()
      .required('Joining date is required')
      .nullable()
      .typeError('Joining date is required'),
    leaveDate: Yup.string().typeError('Enter a valid date').nullable(),

    permanentStreet: Yup.string().required('Permanent Address is required'),
    permanentLandmark: Yup.string(),
    permanentCountry: Yup.string().required('Country is required'),
    permanentState: Yup.string().required('State is required'),
    permanentCity: Yup.string().required('City is required'),
    permanentZipcode: Yup.string().required('Zipcode is required'),

    tempStreet: Yup.string(),
    tempLandmark: Yup.string(),
    tempCountry: Yup.string(),
    tempState: Yup.string(),
    tempCity: Yup.string(),
    tempZipcode: Yup.string(),
  });

  const defaultValues = useMemo(() => ({
    profile_pic: currentEmployee?.user.avatar_url || '',
    firstName: currentEmployee?.user.firstName || '',
    middleName: currentEmployee?.user.middleName || '',
    lastName: currentEmployee?.user.lastName || '',
    drivingLicense: currentEmployee?.drivingLicense || '',
    voterCard: currentEmployee?.voterCard || '',
    panCard: currentEmployee?.panCard || '',
    aadharCard: currentEmployee?.aadharCard || '',
    contact: currentEmployee?.user.contact || '',
    dob: new Date(currentEmployee?.dob) || new Date(),
    remark: currentEmployee?.remark || '',
    role: currentEmployee?.user.role || '',
    reportingTo: currentEmployee?.reportingTo || null,
    email: currentEmployee?.user.email || '',
    password: '',
    joiningDate: new Date(currentEmployee?.joiningDate) || new Date(),
    leaveDate: new Date(currentEmployee?.leaveDate) || new Date(),
    permanentStreet: currentEmployee?.permanentAddress.street || '',
    permanentLandmark: currentEmployee?.permanentAddress.landmark || '',
    permanentCountry: currentEmployee?.permanentAddress.country || '',
    permanentState: currentEmployee?.permanentAddress.state || '',
    permanentCity: currentEmployee?.permanentAddress.city || '',
    permanentZipcode: currentEmployee?.permanentAddress.zipcode || '',
    tempStreet: currentEmployee?.temporaryAddress.street || '',
    tempLandmark: currentEmployee?.temporaryAddress.landmark || '',
    tempCountry: currentEmployee?.temporaryAddress.country || '',
    tempState: currentEmployee?.temporaryAddress.state || '',
    tempCity: currentEmployee?.temporaryAddress.city || '',
    tempZipcode: currentEmployee?.temporaryAddress.zipcode || '',
  }), [currentEmployee]);

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
              First Part
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
              <RHFTextField name='loanNo' label='Loan No.'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
              <RHFTextField name='customerName' req={'red'} label='Customer Name'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
              <RHFTextField name='address' label='Address' req={'red'}
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
              <RHFTextField
                name='contact'
                label='Mobile No.'
                sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }}
                inputProps={{ maxLength: 16 }}
              />
              <Controller
                name='issueDate'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label='Issue Date'
                    sx={{
                      ':not(:focus-within) label ~ div:first-of-type': {
                        outline: '1px solid black',
                        borderRadius: '8px',
                      },
                    }}
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
              <RHFTextField
                name='schemeName'
                label='Scheme Name'
                sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }}
                inputProps={{ minLength: 10, maxLength: 10 }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  methods.setValue('panCard', value, { shouldValidate: true });
                }} />
              <RHFTextField name='closedBy' label='Closed by'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
              <RHFTextField
                name='oldLoanNo'
                label='Old Loan No'
                sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }}
                inputProps={{ maxLength: 12, pattern: '[0-9]*' }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
              />
            </Box>
            <Box variant='div' sx={{ mt: 2.5, fontSize: '18px', fontWeight: '700' }}>
              Second Part
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
                sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }}
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

              <RHFTextField name='consultCharge' label='Consult Charge %'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
              <RHFTextField name='loanAmount' label='Loan Amount'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
              <RHFTextField name='interestLoanAmount' label='Interest Loan Amt'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
              <RHFTextField name='loanPeriod' label='Loan Period (Month)'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
              <RHFTextField name='IntPeriodTime' label='INT. Period Time'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
            </Box>
            <Box variant='div' sx={{ mt: 2.5, fontSize: '18px', fontWeight: '700' }}>
              Third Part
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
              <RHFTextField name='witnessName' label='Witness Name'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
              <RHFTextField name='witnessMobileNo' label='Witness Mobile No.'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
              <Controller
                name='nextInterestPayDate'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label='Next Interest Pay Date'
                    sx={{
                      ':not(:focus-within) label ~ div:first-of-type': {
                        outline: '1px solid black',
                        borderRadius: '8px',
                      },
                    }}
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
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
                    label='Last Interest Pay Date'
                    sx={{
                      ':not(:focus-within) label ~ div:first-of-type': {
                        outline: '1px solid black',
                        borderRadius: '8px',
                      },
                    }}
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
              <RHFTextField name='review' label='Review'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
              <RHFTextField name='createdBy' label='Created By'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
            </Box>
          </Card>
    </FormProvider>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title='Property Images' />
            <CardContent>
              <Upload file={file} onDrop={handleDropSingleFile} onDelete={() => setFile(null)} />
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
            {activeTab === 0 && <InterestPayDetailsForm />}
            {activeTab === 1 && <PartReleaseForm />}
            {activeTab === 2 && <UchakInterestPayForm />}
            {activeTab === 3 && <LoanPartPaymentForm />}
            {activeTab === 4 && <LoanCloseForm />}
          </Card>
        </Grid>
      </Grid>

    </>
  );
}

LoanpayhistoryNewEditForm.propTypes = {
  currentEmployee: PropTypes.object,
};
