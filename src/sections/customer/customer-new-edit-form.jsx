import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
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
import { Autocomplete, Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useAuthContext } from '../../auth/hooks';
import { useGetBranch } from '../../api/branch';
import { useGetConfigs } from '../../api/config';
import { ACCOUNT_TYPE_OPTIONS } from '../../_mock';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'In Active', label: 'In Active' },
  { value: 'Blocked', label: 'Blocked' }];

export default function CustomerNewEditForm({ currentCustomer }) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { branch } = useGetBranch();
  const { configs, mutate } = useGetConfigs();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const [bankDetails, setBankDetails] = useState(currentCustomer?.bankDetails || []);

  const NewCustomerSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    middleName: Yup.string().required('Middle Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    contact: Yup.string().required('Contact number is required').max(10),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    dob: Yup.date().required('Date of Birth is required'),
    panCard: Yup.string().required('PAN Card number is required').max(10).min(10),
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

  const defaultValues = useMemo(
    () => ({
      branchId: currentCustomer?.branch?.name || '',
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
      landline: currentCustomer?.landline || '',
      joiningDate: new Date(currentCustomer?.joiningDate) || '',
      businessType: currentCustomer?.businessType || '',
      PerStreet: currentCustomer?.permanentAddress?.street || '',
      PerLandmark: currentCustomer?.permanentAddress?.landmark || '',
      PerCountry: currentCustomer?.permanentAddress?.country || 'India',
      PerState: currentCustomer?.permanentAddress?.state || 'Gujarat',
      PerCity: currentCustomer?.permanentAddress?.city || 'Surat',
      PerZipcode: currentCustomer?.permanentAddress?.zipcode || '',
      tempStreet: currentCustomer?.temporaryAddress?.street || '',
      tempLandmark: currentCustomer?.temporaryAddress?.landmark || '',
      tempCountry: currentCustomer?.temporaryAddress?.country || 'India',
      tempState: currentCustomer?.temporaryAddress?.state || 'Gujarat',
      tempCity: currentCustomer?.temporaryAddress?.city || 'Surat',
      tempZipcode: currentCustomer?.temporaryAddress?.zipcode || '',
      bankDetails: currentCustomer?.bankDetails || [],
    }),
    [currentCustomer, branch]
  );

  const methods = useForm({
    resolver: yupResolver(NewCustomerSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

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
        drivingLicense: data.drivingLicense,
        landline: data.landline,
        joiningDate: data.joiningDate,
        panCard: data.panCard,
        aadharCard: data.aadharCard,
        otpContact: data.otpContact,
        businessType: data.businessType,
        loanType: data.loanType,
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
          street: data.tempStreet,
          landmark: data.tempLandmark,
          country: data.tempCountry,
          state: data.tempState,
          city: data.tempCity,
          zipcode: data.tempZipcode,
        },
        bankDetails: data.bankDetails || [],
      };

      const formData = new FormData();
      [
        'status', 'firstName', 'middleName',
        'lastName', 'contact', 'email', 'dob', 'drivingLicense', 'landline', 'joiningDate',
        'panCard', 'aadharCard', 'otpContact', 'businessType',
        'loanType', 'remark',
      ].forEach(field => formData.append(field, data[field]));

      ['PerStreet', 'PerLandmark', 'PerCountry', 'PerState', 'PerCity', 'PerZipcode'].forEach(field =>
        formData.append(`permanentAddress[${field.replace('Per', '').toLowerCase()}]`, data[field]),
      );
      ['tempStreet', 'tempLandmark', 'tempCountry', 'tempState', 'tempCity', 'tempZipcode'].forEach(field =>
        formData.append(`temporaryAddress[${field.replace('temp', '').toLowerCase()}]`, data[field]),
      );

      data?.bankDetails?.forEach((detail, index) => {
        Object.keys(detail).forEach(key =>
          formData.append(`bankDetails[${index}][${key}]`, detail[key]),
        );
      });

      if (data.profile_pic) {
        formData.append('profile-pic', data.profile_pic);
      }

      const url = `${import.meta.env.VITE_BASE_URL}/${user?.company}/customer?branch=${user?.role === 'Admin' ? data?.branchId?.value : user?.branch}`;
      const mainbranchid = branch?.find((e) => e?.name === data?.branchId);
      await (currentCustomer
          ? axios.put(
            `${import.meta.env.VITE_BASE_URL}/${user?.company}/customer/${currentCustomer?._id}?branch=${user?.role === 'Admin' ? mainbranchid?._id : user?.branch}`,
            payload,
          )
          : axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      );

      enqueueSnackbar(currentCustomer ? 'Update success!' : 'Create success!');
      reset();
      mutate();
      router.push(paths.dashboard.customer.root);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue('profile_pic', newFile, { shouldValidate: true });
        if (currentCustomer) {
          const formData = new FormData();
          formData.append('profile-pic', file);
          axios.put(`${import.meta.env.VITE_BASE_URL}/${user?.company}/customer/${currentCustomer?._id}/profile`, formData).then((res) => console.log(res)).catch((err) => console.log(err));
        }
      }
    },
    [setValue],
  );

  const addBankDetail = () => {
    setBankDetails([...bankDetails, {
      branchName: '',
      accountHolderName: '',
      accountNumber: '',
      accountType: '',
      IFSC: '',
      bankName: '',
    }]);
  };

  const handleBankDetailChange = (index, field, value) => {
    const newBankDetails = [...bankDetails];
    newBankDetails[index][field] = value;
    setBankDetails(newBankDetails);
    methods.setValue('bankDetails', newBankDetails);
  };

  const removeBankDetail = (index) => {
    const newBankDetails = bankDetails?.filter((_, i) => i !== index);
    setBankDetails(newBankDetails);
    methods.setValue('bankDetails', newBankDetails);
  };

  const PersonalDetails = (
    <>
      <Grid item md={4} xs={12}>
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
              {user?.role === 'Admin' && branch && (
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
                label='Surname'
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
              <RHFTextField name='email' label='Email' req={'red'} />
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
                        className: 'req',
                      },
                    }}
                  />
                )}
              />
              <RHFTextField
                name='drivingLicense'
                label='Driving License'
                // inputProps={{
                //   maxLength: 16,
                //   pattern: '[A-Z]*',
                // }}
                // rules={{
                //   required: 'Driving license number is required',
                //   pattern: {
                //     value: /^[A-Z]{1,16}$/,
                //     message: 'Please enter a valid driving license number (16 uppercase letters max)',
                //   },
                // }}
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              <RHFTextField
                name='customerCode'
                label='Customer Code'
                req={'red'}
                InputProps={{
                  disabled: true,
                }}
              />
              <RHFTextField name='landline' label='Phone(landline)' inputProps={{
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
              <Controller
                name='joiningDate'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label='Joining Date'
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
                req={'red'}
                inputProps={{ maxLength: 12, pattern: '[0-9]*' }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
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
              {configs?.businessTypes && (
                <RHFAutocomplete
                  name='businessType'
                  label='Business Type'
                  placeholder='Choose Business Type'
                  options={configs?.businessTypes?.length > 0 ? configs.businessTypes.map((type) => type) : []}
                  isOptionEqualToValue={(option, value) => option === value}
                />
              )}
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
              <RHFTextField name='PerStreet' label='Street' req={'red'} />
              <RHFTextField name='PerLandmark' label='landmark' req={'red'} />
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
              <RHFTextField
                req={'red'}
                name='PerZipcode'
                label='Zipcode'
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />

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
              <RHFTextField name='tempStreet' label='Street' />
              <RHFTextField name='tempLandmark' label='landmark' />
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
              <RHFTextField
                name='tempZipcode'
                label='Zipcode'
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const BankDetails = (
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
          {!mdUp && <CardHeader title='Bank Accounts' />}
          <Stack spacing={3} sx={{ p: 3 }}>
            {bankDetails.map((bankDetail, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography variant='p' my={2} sx={{ display: 'inline-block' }}>
                  Bank Account {index + 1}
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
                  <RHFTextField
                    name={`bankDetails[${index}].accountHolderName`}
                    label='Account Holder Name'
                    value={bankDetail?.accountHolderName}
                    onChange={(e) => handleBankDetailChange(index, 'accountHolderName', e.target.value)}
                  />
                  <RHFTextField
                    name={`bankDetails[${index}].accountNumber`}
                    label='Account Number'
                    value={bankDetail?.accountNumber}
                    onChange={(e) => handleBankDetailChange(index, 'accountNumber', e.target.value)}
                  />
                  <Autocomplete
                    name={`bankDetails[${index}].accountType`}
                    value={bankDetail?.accountType || null}
                    options={ACCOUNT_TYPE_OPTIONS}
                    getOptionLabel={(option) => option || ''}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(event, newValue) => handleBankDetailChange(index, 'accountType', newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Account Type'
                        placeholder='Choose Account Type'
                        variant='outlined'
                      />
                    )}
                  />
                  <RHFTextField
                    name={`bankDetails[${index}].IFSC`}
                    label='IFSC Code'
                    value={bankDetail?.IFSC}
                    onChange={(e) => handleBankDetailChange(index, 'IFSC', e.target.value)}
                  />
                  <RHFTextField
                    name={`bankDetails[${index}].bankName`}
                    label='Bank Name'
                    value={bankDetail?.bankName}
                    onChange={(e) => handleBankDetailChange(index, 'bankName', e.target.value)}
                  />
                  <RHFTextField
                    name={`bankDetails[${index}].branchName`}
                    label='Branch Name'
                    value={bankDetail?.branchName}
                    onChange={(e) => handleBankDetailChange(index, 'branchName', e.target.value)}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                    <Button variant='outlined' color='error' onClick={() => removeBankDetail(index)}>
                      Remove Bank Account
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
            <Button variant='outlined' onClick={addBankDetail}>
              Add Bank Account
            </Button>
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
        {BankDetails}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}

CustomerNewEditForm.propTypes = {
  currentCustomer: PropTypes.object,
};
