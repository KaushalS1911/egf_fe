import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from 'react';
import countrystatecity from '../../_mock/map/csc.json';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
  RHFUploadAvatar,
} from 'src/components/hook-form';
import { Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// ----------------------------------------------------------------------

export default function CustomerNewEditForm({ currentCustomer }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const [profilePic, setProfilePic] = useState(null);

  const NewProductSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    middleName: Yup.string(),
    lastName: Yup.string().required('Last Name is required'),
    contact: Yup.string().required('Contact number is required').max(10),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    dob: Yup.date().required('Date of Birth is required'),
    drivingLicense: Yup.string().required('Driving License is required'),
    customerCode: Yup.string().required('Customer Code is required'),
    landline: Yup.string(),
    panCard: Yup.string().required('PAN Card number is required'),
    joiningDate: Yup.date().required('Joining Date is required'),
    aadharCard: Yup.string().required('Aadhar Card number is required'),
    otpContact: Yup.string().required('OTP Contact number is required'),
    businessType: Yup.object().required('Business Type is required'),
    loanType: Yup.object().required('Loan Type is required'),
    remark: Yup.string(),
    PerStreet: Yup.string().required('Address Line 1 is required'),
    PerLandmark: Yup.string(),
    PerCountry: Yup.string().required('Country is required'),
    PerState: Yup.string().required('State is required'),
    PerCity: Yup.string().required('City is required'),
    PerZipcode: Yup.string().required('Pincode is required'),
    TemStreet: Yup.string().required('Address Line 1 is required'),
    TemLandmark: Yup.string(),
    TemCountry: Yup.string().required('Country is required'),
    TemState: Yup.string().required('State is required'),
    TemCity: Yup.string().required('City is required'),
    TemZipcode: Yup.string().required('Pincode is required'),
    // accountName: Yup.string().required('Account Name is required'),
    // accountNo: Yup.string().required('Account Number is required'),
    // accountType: Yup.string().required('Account Type is required'),
    // ifscCode: Yup.string().required('IFSC Code is required'),
    // bankName: Yup.string().required('Bank Name is required'),
  });


  const defaultValues = useMemo(
    () => ({
      images: currentCustomer?.images || '',
      firstName: currentCustomer?.firstName || '',
      middleName: currentCustomer?.middleName || '',
      lastName: currentCustomer?.lastName || '',
      contact: currentCustomer?.contact || '',
      email: currentCustomer?.email || '',
      dob: currentCustomer?.dob || null,
      drivingLicense: currentCustomer?.drivingLicense || '',
      customerCode: currentCustomer?.customerCode || '',
      landline: currentCustomer?.landline || '',
      panCard: currentCustomer?.panCard || '',
      joiningDate: currentCustomer?.joiningDate || null,
      aadharCard: currentCustomer?.aadharCard || '',
      otpContact: currentCustomer?.otpContact || '',
      businessType: currentCustomer?.businessType || '',
      loanType: currentCustomer?.loanType || '',
      remark: currentCustomer?.remark || '',
      PerStreet: currentCustomer?.permanentAddress?.street || '',
      PerLandmark: currentCustomer?.permanentAddress?.landmark || '',
      PerCountry: currentCustomer?.permanentAddress?.country || '',
      PerState: currentCustomer?.permanentAddress?.state || '',
      PerCity: currentCustomer?.permanentAddress?.city || '',
      PerZipcode: currentCustomer?.permanentAddress?.zipcode || '',
      TemStreet: currentCustomer?.permanentAddress?.street || '',
      TemLandmark: currentCustomer?.permanentAddress?.landmark || '',
      TemCountry: currentCustomer?.permanentAddress?.country || '',
      TemState: currentCustomer?.permanentAddress?.state || '',
      TemCity: currentCustomer?.permanentAddress?.city || '',
      TemZipcode: currentCustomer?.permanentAddress?.zipcode || '',
      accountName: currentCustomer?.accountName || '',
      accountNo: currentCustomer?.accountNo || '',
      accountType: currentCustomer?.accountType || '',
      ifscCode: currentCustomer?.ifscCode || '',
      bankName: currentCustomer?.bankName || '',
    }),
    [currentCustomer],
  );

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentCustomer) {
      reset(defaultValues);
    }
  }, [currentCustomer, defaultValues, reset]);


  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        'profile-pic': profilePic,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        contact: data.contact,
        email: data.email,
        dob: data.dob,
        drivingLicense: data.drivingLicense,
        customerCode: data.customerCode,
        landline: data.landline,
        panCard: data.panCard,
        joiningDate: data.joiningDate,
        aadharCard: data.aadharCard,
        otpContact: data.otpContact,
        businessType: data.businessType.value,
        loanType: data.loanType.value,
        remark: data.remark,
        permanentAddress: {
          street: data.PerStreet,
          landmark: data.PerLandmark,
          country: data.PerCountry,
          state: data.PerState,
          city: data.PerCity,
          zipcode: data.PerZipcode,
        },
        temporaryAddress: {
          street: data.TemStreet,
          landmark: data.TemLandmark,
          country: data.TemCountry,
          state: data.TemState,
          city: data.TemCity,
          zipcode: data.TemZipcode,
        },
      };
      if (currentCustomer) {
        await axios.put(
          `https://egf-be.onrender.com/api/company/${currentCustomer.companyId}/branch/${currentCustomer.branchId}/customer/${currentCustomer._id}`,
          payload,
        );
        enqueueSnackbar('Update success!');
      } else {
        await axios.post(
          `https://egf-be.onrender.com/api/company/${companyId}/branch/${branchId}/customer`,
          payload,
        );
        enqueueSnackbar('Create success!');
      }
      reset();
      router.push(paths.dashboard.customer.root);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      setProfilePic(file);
      methods.setValue('profile_pic', newFile, { shouldValidate: true });
    }
  }, []);

  const PersonalDetails = (
    <>
      <Grid item md={4} xs={12}>
        <Card sx={{ pt: 5, px: 3, mt: 5 }}>
          <Box sx={{ mb: 5 }}>
            <RHFUploadAvatar name='profile_pic' onDrop={handleDrop} />
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title='Personal Details' />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name='firstName'
                label='First Name'
                inputProps={{ style: { textTransform: 'uppercase' } }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  methods.setValue('firstName', value, { shouldValidate: true });
                }}
              />
              <RHFTextField
                name='middleName'
                label='Middle Name'
                inputProps={{ style: { textTransform: 'uppercase' } }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  methods.setValue('middleName', value, { shouldValidate: true });
                }}
              />
              <RHFTextField
                name='lastName'
                label='Surname'
                inputProps={{ style: { textTransform: 'uppercase' } }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  methods.setValue('lastName', value, { shouldValidate: true });
                }}
              />
              <RHFTextField
                name='contact'
                label='Contact'
              />
              <RHFTextField
                name='email'
                label='Email'
              />
              <Controller
                name='dob'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label='Date of Birth'
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
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
                name='drivingLicense'
                label='Driving License'
              />
              <RHFTextField
                name='customerCode'
                label='Customer Code'
              />
              <RHFTextField
                name='landline'
                label='Phone(landline)'
              />
              <RHFTextField
                name='panCard'
                label='PAN No.'
              />
              <Controller
                name='joiningDate'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label='joining Date'
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
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
                name='aadharCard'
                label='Aadhar Card'
              />
              <RHFTextField
                name='otpContact'
                label='OTP Mobile'
              />
              <RHFAutocomplete
                name='businessType'
                label='Business Type'
                placeholder='Choose Business Type'
                options={[
                  { label: 'Business One', value: 'business_one' },
                  { label: 'Business Two', value: 'business_two' },
                ]}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />
              <RHFAutocomplete
                name='loanType'
                label='Loan Type'
                placeholder='Choose Loan Type'
                options={[
                  { label: 'Gold Loan', value: 'gold_loan' },
                ]}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />
              <RHFTextField
                name='remark'
                label='Remark'
              />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const addressDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Address Details
          </Typography>
        </Grid>
      )}
      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title='Properties' />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant='p' sx={{ mb: 0.5 }}>
              Permanent Address
            </Typography>
            <Box
              columnGap={2}
              rowGap={3}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name='PerStreet' label='Street' />
              <RHFTextField name='PerLandmark' label='landmark' />
              <RHFAutocomplete
                name='PerCountry'
                label='Country'
                placeholder='Choose a country'
                options={countrystatecity.map((country) => country.name)}
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFAutocomplete
                name='PerState'
                label='State'
                placeholder='Choose a State'
                options={
                  watch('PerCountry')
                    ? countrystatecity
                    .find((country) => country.name === watch('PerCountry'))
                    ?.states.map((state) => state.name) || []
                    : []
                }
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFAutocomplete
                name='PerCity'
                label='City'
                placeholder='Choose a City'
                options={
                  watch('PerState')
                    ? countrystatecity
                    .find((country) => country.name === watch('PerCountry'))
                    ?.states.find((state) => state.name === watch('PerState'))
                    ?.cities.map((city) => city.name) || []
                    : []
                }
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFTextField name='PerZipcode' label='Zipcode' />
            </Box>
          </Stack>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant='p' sx={{ mb: 0.5, fontWeight: '500' }}>
              Temporary Address
            </Typography>
            <Box
              columnGap={2}
              rowGap={3}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name='TemStreet' label='Street' />
              <RHFTextField name='TemLandmark' label='landmark' />
              <RHFAutocomplete
                name='TemCountry'
                label='Country'
                placeholder='Choose a country'
                options={countrystatecity.map((country) => country.name)}
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFAutocomplete
                name='TemState'
                label='State'
                placeholder='Choose a State'
                options={
                  watch('TemCountry')
                    ? countrystatecity
                    .find((country) => country.name === watch('TemCountry'))
                    ?.states.map((state) => state.name) || []
                    : []
                }
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFAutocomplete
                name='TemCity'
                label='City'
                placeholder='Choose a City'
                options={
                  watch('TemState')
                    ? countrystatecity
                    .find((country) => country.name === watch('TemCountry'))
                    ?.states.find((state) => state.name === watch('TemState'))
                    ?.cities.map((city) => city.name) || []
                    : []
                }
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFTextField name='TemZipcode' label='Zipcode' />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const bankDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Bank Account Details
          </Typography>
        </Grid>
      )}
      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title='Pricing' />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name='accountName'
                label='Account Name'
              />
              <RHFTextField
                name='accountNo'
                label='Account Number'
              />
              <RHFTextField
                name='accountType'
                label='Account Type'
              />
              <RHFTextField
                name='ifscCode'
                label='IFSC Code'
              />
              <RHFTextField
                name='bankName'
                label='Bank Name'
                inputProps={{ style: { textTransform: 'uppercase' } }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  methods.setValue('bankName', value, { shouldValidate: true });
                }}
              />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end' }}>
        <Button color='inherit' sx={{ margin: '0px 10px' }}
                variant='contained' onClick={() => reset()}>Reset</Button>
        <LoadingButton type='submit' variant='contained' size='large' loading={isSubmitting}>
          {!currentCustomer ? 'Submit' : 'Update Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {PersonalDetails}
        {addressDetails}
        {bankDetails}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}

CustomerNewEditForm.propTypes = {
  currentCustomer: PropTypes.object,
};
