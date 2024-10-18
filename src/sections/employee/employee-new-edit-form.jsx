import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
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
import { Autocomplete, Button, TextField } from '@mui/material';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useGetAllUser } from 'src/api/user';
import { useGetConfigs } from '../../api/config';
import { useGetBranch } from '../../api/branch';

// ----------------------------------------------------------------------

export default function EmployeeNewEditForm({ currentEmployee }) {
  const router = useRouter();
  const allUser = useGetAllUser();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const { enqueueSnackbar } = useSnackbar();
  const { branch } = useGetBranch();
  const storedBranch = sessionStorage.getItem('selectedBranch');

  const NewEmployeeSchema = Yup.object().shape({
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
    branchId: currentEmployee ? {
      label: currentEmployee?.branch?.name,
      value: currentEmployee?.branch?._id,
    } : null,
    profile_pic: currentEmployee?.user.avatar_url || '',
    firstName: currentEmployee?.user.firstName || '',
    middleName: currentEmployee?.user.middleName || '',
    lastName: currentEmployee?.user.lastName || '',
    drivingLicense: currentEmployee?.drivingLicense || '',
    voterCard: currentEmployee?.voterCard || '',
    panCard: currentEmployee?.panCard || '',
    aadharCard: currentEmployee?.aadharCard || '',
    contact: currentEmployee?.user.contact || '',
    dob: new Date(currentEmployee?.dob) || '',
    remark: currentEmployee?.remark || '',
    role: currentEmployee?.user.role || '',
    reportingTo: currentEmployee?.reportingTo || null,
    email: currentEmployee?.user.email || '',
    password: '',
    joiningDate: currentEmployee ? new Date(currentEmployee?.joiningDate) : new Date(),
    leaveDate: new Date(currentEmployee?.leaveDate) || '',
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
    resolver: yupResolver(NewEmployeeSchema),
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

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const onSubmit = handleSubmit(async (data) => {
    let payload;
    const permanentAddress = {
      street: data.permanentStreet || '',
      landmark: data.permanentLandmark || '',
      country: data.permanentCountry || '',
      state: data.permanentState || '',
      city: data.permanentCity || '',
      zipcode: data.permanentZipcode || '',
    };

    const temporaryAddress = {
      street: data.tempStreet || '',
      landmark: data.tempLandmark || '',
      country: data.tempCountry || '',
      state: data.tempState || '',
      city: data.tempCity || '',
      zipcode: data.tempZipcode || '',
    };

    if (currentEmployee) {
      payload = {
        ...data,
        reportingTo: data.reportingTo?._id || '',
        permanentAddress,
        temporaryAddress,
        branch: '66ea5ebb0f0bdc8062c13a64',
      };
    } else {
      const formData = new FormData();
      const fields = [
        'firstName', 'middleName', 'lastName', 'drivingLicense', 'voterCard', 'panCard',
        'aadharCard', 'contact', 'dob', 'remark', 'role', 'reportingTo',
        'email', 'password', 'joiningDate', 'leaveDate',
      ];

      fields.forEach(field => {
        if (field === 'reportingTo') {
          formData.append(field, data[field]?._id || '');
        } else {
          formData.append(field, data[field] || '');
        }
      });

      if (data.profile_pic && data.profile_pic.path) {
        formData.append('profile-pic', data.profile_pic);
      }

      formData.append('branch', '66ea5ebb0f0bdc8062c13a64');
      const addressFields = ['street', 'landmark', 'country', 'state', 'city', 'zipcode'];

      addressFields.forEach(field => {
        formData.append(`permanentAddress[${field}]`, data[`permanent${capitalize(field)}`] || '');
        formData.append(`temporaryAddress[${field}]`, data[`temp${capitalize(field)}`] || '');
      });
      payload = formData;
    }
    try {
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

      const url = currentEmployee
        ? `${import.meta.env.VITE_BASE_URL}/${user?.company}/employee/${currentEmployee._id}?${branchQuery}`
        : `${import.meta.env.VITE_BASE_URL}/${user?.company}/employee?${branchQuery}`;
      const config = {
        method: currentEmployee ? 'put' : 'post',
        url,
        data: payload,
      };
      if (!currentEmployee) {
        config.headers = {
          'Content-Type': 'multipart/form-data',
        };
      }
      const response = await axios(config);
      enqueueSnackbar(response?.data.message);
      router.push(paths.dashboard.employee.list);
      reset();
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
        if (currentEmployee) {
          const formData = new FormData();
          formData.append('profile-pic', file);
          axios.put(`${import.meta.env.VITE_BASE_URL}/${user?.company}/user/${currentEmployee.user._id}/profile`, formData).then((res) => console.log(res)).catch((err) => console.log(err));
        }
      }
    },
    [setValue],
  );

  const checkZipcode = async (zipcode, type = 'permanent') => {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${zipcode}`);
      const data = response.data[0];

      if (data.Status === 'Success') {
        if (type === 'permanent') {
          setValue('permanentCountry', data.PostOffice[0]?.Country, { shouldValidate: true });
          setValue('permanentState', data.PostOffice[0]?.Circle, { shouldValidate: true });
        } else if (type === 'temporary') {
          setValue('tempCountry', data.PostOffice[0]?.Country, { shouldValidate: true });
          setValue('tempState', data.PostOffice[0]?.Circle, { shouldValidate: true });
        }
      } else {
        if (type === 'permanent') {
          setValue('permanentCountry', '', { shouldValidate: true });
          setValue('permanentState', '', { shouldValidate: true });
        } else if (type === 'temporary') {
          setValue('tempCountry', '', { shouldValidate: true });
          setValue('tempState', '', { shouldValidate: true });
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

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name='profile_pic'
                maxSize={3145728}
                onDrop={handleDrop}
              />
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
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
              <RHFTextField name='firstName' label='First Name' req={'red'} />
              <RHFTextField name='middleName' label='Middle Name' req={'red'} />
              <RHFTextField name='lastName' label='Last Name' req={'red'} />
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
                label='Pan No.'
                req={'red'}
                inputProps={{ minLength: 10, maxLength: 10 }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  methods.setValue('panCard', value, { shouldValidate: true });
                }} />
              <RHFTextField name='voterCard' label='Voter ID'
                            onInput={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                            }} />
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
                name='contact'
                label='Mobile'
                req={'red'}
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
              <Controller
                name='dob'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label='Date of Birth'
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
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
              <RHFTextField name='remark' label='Remark' />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Official Info
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              {configs.roles && <RHFAutocomplete
                name='role'
                label='Role'
                req={'red'}
                fullWidth
                options={configs?.roles?.map((item) => item)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />}
              {allUser?.user && <RHFAutocomplete
                name='reportingTo'
                label='Reporting to'
                req={'red'}
                fullWidth
                options={allUser?.user?.map((item) => item)}
                getOptionLabel={(option) => option.firstName + ' ' + option.lastName}
                renderOption={(props, option) => (
                  <li {...props} key={option} value={option._id}>
                    {option.firstName + ' ' + option.lastName}
                  </li>
                )}
              />}
              <RHFTextField name='email' label='Email' req={'red'} />
              {!currentEmployee && <RHFTextField name='password' label='Password' req={'red'} />}
              <Controller
                name='joiningDate'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label='Join Date'
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
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

              <Controller
                name='leaveDate'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label='Leave Date'
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
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Address Details
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography gutterBottom sx={{ mb: 2, fontSize: '17px', fontWeight: '700' }}>
              Permanent Address
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name='permanentStreet' label='Address' req={'red'} />
              <RHFTextField name='permanentLandmark' label='Landmark' />
              <RHFTextField
                name='permanentZipcode'
                label={
                  <span>
      Zipcode<span style={{ color: 'red' }}>*</span>
    </span>
                }
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
                name='permanentCountry'
                label='Country'
                req={'red'}
                fullWidth
                options={countrystatecity.map((country) => country.name)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              <RHFAutocomplete
                name='permanentState'
                label='State'
                req={'red'}
                fullWidth
                options={
                  watch('permanentCountry')
                    ? countrystatecity
                    .find((country) => country.name === watch('permanentCountry'))
                    ?.states.map((state) => state.name) || []
                    : []
                }
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              <RHFAutocomplete
                name='permanentCity'
                label='City'
                req={'red'}
                fullWidth
                options={
                  watch('permanentState')
                    ? countrystatecity
                    .find((country) => country.name === watch('permanentCountry'))
                    ?.states.find((state) => state.name === watch('permanentState'))
                    ?.cities.map((city) => city.name) || []
                    : []
                }
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            </Box>
            <Typography gutterBottom sx={{ mt: 3, mb: 2, fontSize: '17px', fontWeight: '700' }}>
              Temporary Address
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name='tempStreet' label='Address' />
              <RHFTextField name='tempLandmark' label='Landmark' />
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
              <Controller
                name='tempCountry'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={countrystatecity.map((country) => country.name)}
                    onChange={(event, value) => field.onChange(value)}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <TextField {...params} label='Country' variant='outlined' />
                    )}
                  />
                )}
              />
              <Controller
                name='tempState'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={
                      watch('tempCountry')
                        ? countrystatecity
                        .find((country) => country.name === watch('tempCountry'))
                        ?.states.map((state) => state.name) || []
                        : []
                    }
                    onChange={(event, value) => field.onChange(value)}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <TextField {...params} label='State' variant='outlined' />
                    )}
                  />
                )}
              />
              <Controller
                name='tempCity'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={
                      watch('tempState')
                        ? countrystatecity
                        .find((country) => country.name === watch('tempCountry'))
                        ?.states.find((state) => state.name === watch('tempState'))
                        ?.cities.map((city) => city.name) || []
                        : []
                    }
                    onChange={(event, value) => field.onChange(value)}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <TextField {...params} label='City' variant='outlined' />
                    )}
                  />
                )}
              />
            </Box>
          </Card>
        </Grid>

      </Grid>
      <Box xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end' ,mt:3}}>
        <Button color='inherit' sx={{ margin: '0px 10px',height:"36px"}}
                variant='outlined' onClick={() => reset()}>Reset</Button>
        <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
          {!currentEmployee ? 'Submit' : 'Save'}
        </LoadingButton>
      </Box>
    </FormProvider>
  );
}

EmployeeNewEditForm.propTypes = {
  currentEmployee: PropTypes.object,
};
