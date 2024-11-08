import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import React, { useMemo, useEffect, useCallback } from 'react';
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
  RHFUploadAvatar, RHFRadioGroup,
} from 'src/components/hook-form';
import { Button } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useAuthContext } from '../../auth/hooks';
import { useGetBranch } from '../../api/branch';
import { useGetConfigs } from '../../api/config';
import { ACCOUNT_TYPE_OPTIONS } from '../../_mock';
import RHFDatePicker from '../../components/hook-form/rhf-.date-picker';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'In Active', label: 'In Active' },
  { value: 'Blocked', label: 'Blocked' }];

const INQUIRY_REFERENCE_BY = [
  { value: 'Google', label: 'Google' },
  { value: 'Just Dial', label: 'Just Dial' },
  { value: 'Social Media', label: 'Social Media' },
  { value: 'Board Banner', label: 'Board Banner' },
  { value: 'Brochure', label: 'Brochure' },
  { value: 'Other', label: 'Other' },
];

export default function CustomerNewEditForm({ currentCustomer }) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { branch } = useGetBranch();
  const { configs, mutate } = useGetConfigs();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const storedBranch = sessionStorage.getItem('selectedBranch');
  const condition = INQUIRY_REFERENCE_BY.find((item) => item?.label == currentCustomer?.referenceBy)
    ? currentCustomer.referenceBy
    : 'Other';

  const NewCustomerSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    middleName: Yup.string().required('Middle Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    contact: Yup.string().required('Contact number is required').max(10),
    dob: Yup.date().required('Date of Birth is required'),
    panCard: Yup.string().required('PAN Card number is required').max(10).min(10),
    branchId: Yup.object()
      .shape({
        label: Yup.string().required('Branch name is required'),
        value: Yup.string().required('Branch ID is required'),
      })
      .nullable()
      .required('Branch selection is required'),
    aadharCard: Yup.string()
      .required('Aadhar Card number is required')
      .matches(/^\d{12}$/, 'Aadhar Card must be exactly 12 digits and should not contain alphabetic characters'),
    otpContact: Yup.string().required('OTP Contact number is required').max(10).min(10),
    loanType: Yup.string().required('Loan Type is required'),
    PerStreet: Yup.string().required('Address Line 1 is required'),
    PerLandmark: Yup.string().required('Landmark 1 is required'),
    PerCountry: Yup.string().required('Country is required'),
    PerState: Yup.string().required('State is required'),
    PerCity: Yup.string().required('City is required'),
    PerZipcode: Yup.string().required('Pincode is required'),
  });

  const defaultValues = useMemo(() => ({
    branchId: currentCustomer ? {
      label: currentCustomer?.branch?.name,
      value: currentCustomer?.branch?._id,
    } : null,
    status: currentCustomer?.status || '',
    profile_pic: currentCustomer?.avatar_url || '',
    firstName: currentCustomer?.firstName || '',
    middleName: currentCustomer?.middleName || '',
    lastName: currentCustomer?.lastName || '',
    contact: currentCustomer?.contact || '',
    email: currentCustomer?.email || '',
    dob: new Date(currentCustomer?.dob) || null,
    panCard: (currentCustomer?.panCard || '').toUpperCase(),
    aadharCard: currentCustomer?.aadharCard || '',
    otpContact: currentCustomer?.otpContact || '',
    loanType: currentCustomer?.loanType || '',
    remark: currentCustomer?.remark || '',
    customerCode: currentCustomer?.customerCode || '',
    drivingLicense: currentCustomer?.drivingLicense || '',
    referenceBy: currentCustomer ? condition : '',
    otherReferenceBy: currentCustomer ? currentCustomer?.referenceBy : '',
    joiningDate: currentCustomer ? new Date(currentCustomer?.joiningDate) : new Date(),
    businessType: currentCustomer?.businessType || '',
    PerStreet: currentCustomer?.permanentAddress?.street || '',
    PerLandmark: currentCustomer?.permanentAddress?.landmark || '',
    PerCountry: currentCustomer?.permanentAddress?.country || '',
    PerState: currentCustomer?.permanentAddress?.state || '',
    PerCity: currentCustomer?.permanentAddress?.city || '',
    PerZipcode: currentCustomer?.permanentAddress?.zipcode || '',
    tempStreet: currentCustomer?.temporaryAddress?.street || '',
    tempLandmark: currentCustomer?.temporaryAddress?.landmark || '',
    tempCountry: currentCustomer?.temporaryAddress?.country || '',
    tempState: currentCustomer?.temporaryAddress?.state || '',
    tempCity: currentCustomer?.temporaryAddress?.city || '',
    tempZipcode: currentCustomer?.temporaryAddress?.zipcode || '',
    bankName: currentCustomer?.bankDetails?.bankName || '',
    IFSC: currentCustomer?.bankDetails?.IFSC || '',
    accountType: currentCustomer?.bankDetails?.accountType || '',
    accountNumber: currentCustomer?.bankDetails?.accountNumber || '',
    accountHolderName: currentCustomer?.bankDetails?.accountHolderName || '',
    branchName: currentCustomer?.bankDetails?.branchName || '',
  }), [currentCustomer, branch]);

  const methods = useForm({
    resolver: yupResolver(NewCustomerSchema),
    defaultValues,
  });

  const { reset, watch, control, handleSubmit, setValue, formState: { isSubmitting } } = methods;

  useEffect(() => {
    if (currentCustomer) {
      reset(defaultValues);
    }
  }, [currentCustomer, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        status: data.status,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        contact: data.contact,
        email: data.email,
        dob: data.dob,
        joiningDate: data.joiningDate,
        drivingLicense: data.drivingLicense,
        panCard: data.panCard,
        aadharCard: data.aadharCard,
        otpContact: data.otpContact,
        businessType: data.businessType,
        loanType: data.loanType,
        remark: data.remark,
        referenceBy: watch('referenceBy') !== 'Other' ? data?.referenceBy : data?.otherReferenceBy,
        permanentAddress: {
          street: data.PerStreet,
          landmark: data.PerLandmark,
          country: data.PerCountry,
          state: data.PerState,
          city: data.PerCity,
          zipcode: data.PerZipcode,
        },
        temporaryAddress: {
          street: data.tempStreet,
          landmark: data.tempLandmark,
          country: data.tempCountry,
          state: data.tempState,
          city: data.tempCity,
          zipcode: data.tempZipcode,
        },
        bankDetails: {
          branchName: data.branchName,
          accountHolderName: data.accountHolderName,
          accountNumber: data.accountNumber,
          accountType: data.accountType,
          IFSC: data.IFSC,
          bankName: data.bankName,
        },
      };

      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        if (typeof payload[key] === 'object') {
          if (key == 'dob' || key == 'joiningDate') {
            formData.append(key, payload[key]);
          }
          Object.keys(payload[key]).forEach((subKey) => {
            formData.append(`${key}[${subKey}]`, payload[key][subKey]);
          });
        } else {
          formData.append(key, payload[key]);
        }
      });

      if (data.profile_pic) {
        formData.append('profile-pic', data.profile_pic);
      }

      const mainbranchid = branch?.find((e) => e?._id === data?.branchId?.value);
      let parsedBranch = storedBranch;

      if (storedBranch !== 'all') {
        try {
          parsedBranch = JSON.parse(storedBranch);
        } catch (error) {
          console.error('Error parsing storedBranch:', error);
        }
      }

      const branchQuery = parsedBranch && parsedBranch === 'all'
        ? `branch=${mainbranchid?._id}`
        : `branch=${parsedBranch}`;

      const url = `${import.meta.env.VITE_BASE_URL}/${user?.company}/customer?${branchQuery}`;

      await (currentCustomer
        ? axios.put(`${import.meta.env.VITE_BASE_URL}/${user?.company}/customer/${currentCustomer?._id}?${branchQuery}`, payload)
        : axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } }));

      enqueueSnackbar(currentCustomer ? 'Update success!' : 'Create success!');
      reset();
      mutate();
      router.push(paths.dashboard.customer.root);
    } catch (error) {
      enqueueSnackbar(currentCustomer ? 'Failed To update customer' : error.response.data.message, { variant: 'error' });
      console.error(error);
    }
  });

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, { preview: URL.createObjectURL(file) });
    if (file) {
      setValue('profile_pic', newFile, { shouldValidate: true });
      if (currentCustomer) {
        const formData = new FormData();
        formData.append('profile-pic', file);
        axios.put(`${import.meta.env.VITE_BASE_URL}/${user?.company}/customer/${currentCustomer?._id}/profile`, formData)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }
    }
  }, [setValue]);

  const checkZipcode = async (zipcode, type = 'permanent') => {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${zipcode}`);
      const data = response.data[0];

      if (data.Status === 'Success') {
        if (type === 'permanent') {
          setValue('PerCountry', data.PostOffice[0]?.Country, { shouldValidate: true });
          setValue('PerState', data.PostOffice[0]?.Circle, { shouldValidate: true });
          setValue('PerCity', data.PostOffice[0]?.District, { shouldValidate: true });
        } else if (type === 'temporary') {
          setValue('tempCountry', data.PostOffice[0]?.Country, { shouldValidate: true });
          setValue('tempState', data.PostOffice[0]?.Circle, { shouldValidate: true });
          setValue('tempCity', data.PostOffice[0]?.District, { shouldValidate: true });
        }
      } else {
        if (type === 'permanent') {
          setValue('PerCountry', '', { shouldValidate: true });
          setValue('PerState', '', { shouldValidate: true });
          setValue('PerCity', '', { shouldValidate: true });
        } else if (type === 'temporary') {
          setValue('tempCountry', '', { shouldValidate: true });
          setValue('tempState', '', { shouldValidate: true });
          setValue('tempCity', '', { shouldValidate: true });
        }
        enqueueSnackbar('Invalid Zipcode. Please enter a valid Indian Zipcode.', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error fetching country and state:', error);

      if (type === 'permanent') {
        setValue('PerCountry', '', { shouldValidate: true });
        setValue('PerState', '', { shouldValidate: true });
      } else if (type === 'temporary') {
        setValue('tempCountry', '', { shouldValidate: true });
        setValue('tempState', '', { shouldValidate: true });
      }

      enqueueSnackbar('Failed to fetch country and state details.', { variant: 'error' });
    }
  };

  const checkIFSC = async (ifscCode) => {
    if (ifscCode.length === 11) {
      try {
        const response = await axios.get(`https://ifsc.razorpay.com/${ifscCode}`);
        if (response.data) {
          setValue('branchName', response?.data?.BRANCH || '', { shouldValidate: true });
          enqueueSnackbar('IFSC code is valid and branch details fetched.', { variant: 'success' });
        }
      } catch (error) {
        setValue('branchName', '', { shouldValidate: true });
        enqueueSnackbar('Invalid IFSC code. Please check and enter a valid IFSC code.', { variant: 'error' });
      }
    } else {
      enqueueSnackbar('IFSC code must be exactly 11 characters.', { variant: 'warning' });
    }
  };

  const PersonalDetails = (
    <>
      <Grid item md={3} xs={12}>
        <Card sx={{ pt: 5, px: 3, mt: 5 }}>
          <Box sx={{ mb: 5 }}>
            <RHFUploadAvatar
              name='profile_pic'
              maxSize={3145728}
              onDrop={handleDrop}
            />
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} md={9}>
        <Card>
          {!mdUp && <CardHeader title='Personal Details' />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
            >
              {user?.role === 'Admin' && branch && storedBranch === 'all' && (
                <RHFAutocomplete
                  name='branchId'
                  req={'red'}
                  label='Branch'
                  placeholder='Choose a Branch'
                  options={branch?.map((branchItem) => ({
                    label: branchItem?.name,
                    value: branchItem?._id,
                  })) || []}
                  isOptionEqualToValue={(option, value) => option?.value === value?.value}
                />
              )}
              <RHFTextField
                name='customerCode'
                label='Customer Code'
                InputProps={{
                  disabled: true,
                }}
              />
              <RHFDatePicker
                name='joiningDate'
                control={control}
                label='Joining Date'
                req={'red'}
              />
              <RHFTextField
                name='firstName'
                label='First Name'
                inputProps={{ style: { textTransform: 'uppercase' } }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  methods.setValue('firstName', value, { shouldValidate: true });
                }}
                req={'red'}
              />
              <RHFTextField
                name='middleName'
                label='Middle Name'
                inputProps={{ style: { textTransform: 'uppercase' } }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  methods.setValue('middleName', value, { shouldValidate: true });
                }}
                req={'red'}
              />
              <RHFTextField
                name='lastName'
                label='Last Name'
                inputProps={{ style: { textTransform: 'uppercase' } }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  methods.setValue('lastName', value, { shouldValidate: true });
                }}
                req={'red'}
              />
              <RHFTextField
                name='contact'
                label='Contact'
                inputProps={{
                  maxLength: 10,
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                }}
                rules={{
                  required: 'Contact number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit contact number',
                  },
                }}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                req={'red'}
              />
              <RHFTextField
                name='otpContact'
                label='OTP Mobile'
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
                }}
                req={'red'}
              />
              <RHFTextField
                name='drivingLicense'
                label='Driving License'
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
                inputProps={{ maxLength: 16 }}
              />
              <RHFTextField
                name='panCard'
                label='PAN No.'
                req={'red'}
                inputProps={{ minLength: 10, maxLength: 10 }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  methods.setValue('panCard', value, { shouldValidate: true });
                }}
              />
              <RHFTextField
                name='aadharCard'
                label='Aadhar Card'
                req={'red'}
                inputProps={{ maxLength: 12, pattern: '[0-9]*' }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
              />
              {configs?.businessTypes && (
                <RHFAutocomplete
                  name='businessType'
                  label='Business Type'
                  placeholder='Choose Business Type'
                  options={configs?.businessTypes?.length > 0 ? configs.businessTypes.map((type) => type) : []}
                  isOptionEqualToValue={(option, value) => option === value}
                />
              )}
              <RHFTextField name='email' label='Email' />
              <RHFDatePicker
                name='dob'
                control={control}
                label='Date of Birth'
                req={'red'}
              />
              <RHFAutocomplete
                name='loanType'
                label='Loan Type'
                req={'red'}
                placeholder='Choose Loan Type'
                options={configs?.loanTypes?.length > 0 ? configs.loanTypes.map((loan) => loan) : []}
                isOptionEqualToValue={(option, value) => option?.value === value?.value}
              />
              <RHFTextField name='remark' label='Remark' />
              {currentCustomer && (
                <RHFAutocomplete
                  name='status'
                  req={'red'}
                  label='Status'
                  placeholder='Choose a Status'
                  options={STATUS_OPTIONS.map((item) => item.value)}
                  isOptionEqualToValue={(option, value) => option?.value === value?.value}
                />
              )}
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const addressDetails = (
    <>
      <Grid xs={12} md={12}>
        <Card>
          {!mdUp && <CardHeader title='Properties' />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant='subtitle1' sx={{ mb: 0.5, fontWeight: '600' }}>
              Permanent Address
            </Typography>
            <Box
              columnGap={2}
              rowGap={3}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(6, 1fr)',
              }}
            >
              <RHFTextField name='PerStreet' label='Street' req={'red'} />
              <RHFTextField name='PerLandmark' label='landmark' req={'red'} />
              <RHFTextField
                name='PerZipcode'
                label={
                  <span>Zipcode</span>
                }
                req={'red'}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  maxLength: 6,
                }}
                rules={{
                  required: 'Zipcode is required',
                  minLength: {
                    value: 6,
                    message: 'Zipcode must be exactly 6 digits',
                  },
                  maxLength: {
                    value: 6,
                    message: 'Zipcode cannot be more than 6 digits',
                  },
                }}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onBlur={(event) => {
                  const zip = event.target.value;
                  if (zip.length === 6) {
                    checkZipcode(zip);
                  }
                }}
              />
              <RHFAutocomplete
                name='PerCountry'
                req={'red'}
                label='Country'
                placeholder='Choose a country'
                options={countrystatecity.map((country) => country.name)}
                isOptionEqualToValue={(option, value) => option === value}
                defaultValue='India'
              />
              <RHFAutocomplete
                name='PerState'
                req={'red'}
                label='State'
                placeholder='Choose a State'
                options={
                  watch('PerCountry')
                    ? countrystatecity
                    .find((country) => country.name === watch('PerCountry'))
                    ?.states.map((state) => state.name) || []
                    : []
                }
                defaultValue='Gujarat'
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFAutocomplete
                name='PerCity'
                label='City'
                req={'red'}
                placeholder='Choose a City'
                options={
                  watch('PerState')
                    ? countrystatecity
                    .find((country) => country.name === watch('PerCountry'))
                    ?.states.find((state) => state.name === watch('PerState'))
                    ?.cities.map((city) => city.name) || []
                    : []
                }
                defaultValue='Surat'
                isOptionEqualToValue={(option, value) => option === value}
              />
            </Box>
          </Stack>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant='subtitle1' sx={{ mb: 0.5, fontWeight: '600' }}>
              Temporary Address
            </Typography>
            <Box
              columnGap={2}
              rowGap={3}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(6, 1fr)',
              }}
            >
              <RHFTextField name='tempStreet' label='Street' />
              <RHFTextField name='tempLandmark' label='landmark' />
              <RHFTextField
                name='tempZipcode'
                label='Zipcode'
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  maxLength: 6,
                }}
                rules={{
                  required: 'Zipcode is required',
                  minLength: {
                    value: 6,
                    message: 'Zipcode must be at least 6 digits',
                  },
                  maxLength: {
                    value: 6,
                    message: 'Zipcode cannot be more than 6 digits',
                  },
                }}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onBlur={(event) => {
                  const zip = event.target.value;
                  if (zip.length === 6) {
                    checkZipcode(zip, 'temporary');
                  }
                }}
              />
              <RHFAutocomplete
                name='tempCountry'
                label='Country'
                placeholder='Choose a country'
                options={countrystatecity.map((country) => country.name)}
                isOptionEqualToValue={(option, value) => option === value}
                defaultValue='India'
              />
              <RHFAutocomplete
                name='tempState'
                label='State'
                placeholder='Choose a State'
                options={
                  watch('TemCountry')
                    ? countrystatecity
                    .find((country) => country.name === watch('TemCountry'))
                    ?.states.map((state) => state.name) || []
                    : []
                }
                defaultValue='Gujarat'
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFAutocomplete
                name='tempCity'
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
                defaultValue='Surat'
                isOptionEqualToValue={(option, value) => option === value}
              />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const referenceDetails = (
    <>
      {mdUp && (
        <Grid md={12}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Other Details
          </Typography>
        </Grid>
      )}
      <Grid xs={12} md={12}>
        <Card>
          <Box columnGap={2}
               rowGap={3}
               display='grid'
               gridTemplateColumns={{
                 xs: 'repeat(1, 1fr)',
                 md: 'repeat(1, 1fr)',
               }}>
            {!mdUp && <CardHeader title='Properties' />}
            <Stack spacing={3} sx={{ p: 3 }}>
              <Typography variant='subtitle2'>How did you come to know about us?</Typography>
              <Stack spacing={2}>
                <RHFRadioGroup
                  row
                  spacing={4}
                  sx={{ display: 'flex' }}
                  name='referenceBy'
                  options={INQUIRY_REFERENCE_BY}
                />
              </Stack>
            </Stack>
            <Stack spacing={2} sx={{
              p: watch('referenceBy') === 'Other' ? 3 : 0,
            }} justifyContent={'end'}>
              {watch('referenceBy') === 'Other' && (
                <Stack spacing={1}>
                  <Typography variant='subtitle2'>Write other reference name</Typography>
                  <RHFTextField name='otherReferenceBy' label='Reference By' />
                </Stack>
              )}
            </Stack>
          </Box>
        </Card>
      </Grid>
    </>
  );

  const BankDetails = (
    <>
      <Grid xs={12} md={12}>
        <Card>
          {!mdUp && <CardHeader title='Bank Accounts' />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant='subtitle1' sx={{ my: 2, fontWeight: '600' }}>
                Bank Account Details
              </Typography>
              <Box
                columnGap={2}
                rowGap={3}
                display='grid'
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(6, 1fr)',
                }}
              >
                <RHFTextField name='accountHolderName' label='Account Holder Name' />
                <RHFTextField
                  name='accountNumber'
                  label='Account Number'
                  type='number'
                  inputProps={{ min: 0 }}
                />
                <RHFAutocomplete
                  name='accountType'
                  label='Account Type'
                  placeholder='Choose account type'
                  options={ACCOUNT_TYPE_OPTIONS}
                  isOptionEqualToValue={(option, value) => option === value}
                />
                <RHFTextField
                  name='IFSC'
                  label='IFSC Code'
                  inputProps={{ maxLength: 11, pattern: '[A-Za-z0-9]*' }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                  }}
                  onBlur={(e) => checkIFSC(e.target.value)}
                />
                <RHFTextField name='bankName' label='Bank Name' />
                <RHFTextField name='branchName' label='Branch Name' />
              </Box>
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
        <Button color='inherit' sx={{ margin: '0px 10px', height: '36px' }}
                variant='outlined' onClick={() => reset()}>Reset</Button>
        <LoadingButton type='submit' variant='contained' size='large' loading={isSubmitting} sx={{ height: '36px' }}>
          {!currentCustomer ? 'Submit' : 'Save'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {PersonalDetails}
        {addressDetails}
        {referenceDetails}
        {BankDetails}
        {renderActions}
      </Grid>
    </FormProvider>
  );
};

CustomerNewEditForm.propTypes = {
  currentCustomer: PropTypes.object,
};
