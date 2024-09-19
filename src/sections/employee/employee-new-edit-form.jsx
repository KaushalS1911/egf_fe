import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useGetAllUser } from 'src/api/user';

// ----------------------------------------------------------------------

export default function EmployeeNewEditForm({ currentEmployee }) {
  const router = useRouter();
  const allUser = useGetAllUser();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const NewEmployeeSchema = Yup.object().shape({

    firstName: Yup.string().required('First name is required'),
    middleName: Yup.string().required('Middle name is required'),
    lastName: Yup.string().required('lastName is required'),
    drivingLicense: Yup.string(),
    panCard: Yup.string().required('PAN No. is required'),
    voterCard: Yup.string(),
    aadharCard: Yup.string().required('Aadhar Card is required'),
    contact: Yup.string().required('Mobile number is required'),
    dob: Yup.string().required('Date of Birth is required'),
    remark: Yup.string(),


    role: Yup.string().required('Role is required'),
    reportingTo: Yup.object().required('Reporting to is required'),
    // branch: Yup.string().required('Branch is required'),
    email: Yup.string().required('Email is required'),
    password: currentEmployee ? Yup.string() : Yup.string().required('Password is required'),
    joiningDate: Yup.string().required('Join date is required'),
    leaveDate: Yup.string(),

    // Permanent Address Info
    permanentStreet: Yup.string().required('Permanent Address is required'),
    permanentLandmark: Yup.string(),
    permanentCountry: Yup.string().required('Country is required'),
    permanentState: Yup.string().required('State is required'),
    permanentCity: Yup.string().required('City is required'),
    permanentZipcode: Yup.string().required('Zipcode is required'),

    // Temporary Address Info
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
    dob: new Date(currentEmployee?.dob) || '',
    remark: currentEmployee?.remark || '',
    role: currentEmployee?.user.role || '',
    reportingTo: currentEmployee?.reportingTo || null,
    email: currentEmployee?.user.email || '',
    password: '',
    joiningDate: new Date(currentEmployee?.joiningDate) || '',
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

    // Create permanent and temporary address objects
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

      if (data.profile_pic && typeof data.profile_pic !== 'string') {
        formData.append('profile-pic', data.profile_pic);
      }

      formData.append('branch', '66ea5ebb0f0bdc8062c13a64');
      formData.append('permanentAddress', JSON.stringify(permanentAddress));
      formData.append('temporaryAddress', JSON.stringify(temporaryAddress));

      payload = formData;
    }
    try {
      const url = currentEmployee
        ? `${import.meta.env.VITE_BASE_URL}/${user?.company}/employee/${currentEmployee._id}?branch=66ea5ebb0f0bdc8062c13a64`
        : `${import.meta.env.VITE_BASE_URL}/${user?.company}/employee?branch=66ea5ebb0f0bdc8062c13a64`;
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
        if(currentEmployee){
          const formData = new FormData();
          formData.append("profile-pic",file)
          axios.put(`${import.meta.env.VITE_BASE_URL}/${user?.company}/user/${currentEmployee.user._id}/profile`,formData).then((res) => console.log(res)).catch((err) => console.log(err))
        }
      }
    },
    [setValue],
  );

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
              <RHFTextField name='firstName' label='First Name' req={'red'} />
              <RHFTextField name='middleName' label='Middle Name' req={'red'} />
              <RHFTextField name='lastName' label='Last Name' req={'red'} />
              <RHFTextField name='drivingLicense' label='Driving License' />
              <RHFTextField name='panCard' label='Pan No.' req={'red'} />
              <RHFTextField name='voterCard' label='Voter ID' />
              <RHFTextField name='aadharCard' label='Aadhar Card' req={'red'} />
              <RHFTextField name='contact' label='Mobile' req={'red'} />
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
              <RHFTextField name='role' label='Role' req={'red'} />
              {/*<RHFTextField name="reportingTo" label="Reporting to" req={"red"}/>*/}
              <RHFAutocomplete
                name='reportingTo'
                label='Reporting to'
                req={'red'}
                fullWidth
                options={allUser.user.map((item) => item)}
                getOptionLabel={(option) => option.firstName + ' ' + option.lastName}
                renderOption={(props, option) => (
                  <li {...props} key={option} value={option._id}>
                    {option.firstName + ' ' + option.lastName}
                  </li>
                )}
              />
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
              {/*<RHFTextField name="permanentCountry" label="Country" />*/}
              <Controller
                name='permanentCountry'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    sx={{ borderLeft: '2px solid red', borderRadius: '8px' }}
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
                name='permanentState'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    sx={{ borderLeft: '2px solid red', borderRadius: '8px' }}
                    options={
                      watch('permanentCountry')
                        ? countrystatecity
                        .find((country) => country.name === watch('permanentCountry'))
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
                name='permanentCity'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    sx={{ borderLeft: '2px solid red', borderRadius: '8px' }}
                    options={
                      watch('permanentState')
                        ? countrystatecity
                        .find((country) => country.name === watch('permanentCountry'))
                        ?.states.find((state) => state.name === watch('permanentState'))
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
              <RHFTextField name='permanentZipcode' label='Zipcode' req={'red'} />
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
              {/*<RHFTextField name="tempCountry" label="Country" />*/}
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
              {/*<RHFTextField name="tempState" label="State" />*/}
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
              <RHFTextField name='tempZipcode' label='Zipcode' />
            </Box>
          </Card>
        </Grid>

      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
        <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
          {!currentEmployee ? 'Create Employee' : 'Save Changes'}
        </LoadingButton>
      </Box>
    </FormProvider>
  );
}

EmployeeNewEditForm.propTypes = {
  currentEmployee: PropTypes.object,
};
