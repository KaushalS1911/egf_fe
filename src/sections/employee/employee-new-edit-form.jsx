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
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Label from 'src/components/label';
import { fData } from 'src/utils/format-number';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useSnackbar } from 'src/components/snackbar';
import CountrySelect from '../../components/country-select';
import { countries } from '../../assets/data';
import { Autocomplete, TextField } from '@mui/material';

// ----------------------------------------------------------------------

export default function EmployeeNewEditForm({ currentEmployee }) {
  const router = useRouter();
  const [profilePic, setProfilePic] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const NewEmployeeSchema = Yup.object().shape({
    // Personal Info
    firstName: Yup.string().required('First name is required'),
    middleName: Yup.string().required('Middle name is required'),
    lastName: Yup.string().required('lastName is required'),
    drivingLicense: Yup.string(),
    panNo: Yup.string().required('PAN No. is required'),
    voterId: Yup.string(),
    aadharCard: Yup.string().required('Aadhar Card is required'),
    mobile: Yup.string().required('Mobile number is required'),
    dateOfBirth: Yup.string().required('Date of Birth is required'),
    remarks: Yup.string(),

    // Official Info
    role: Yup.string().required('Role is required'),
    workUnder: Yup.string().required('Work Under is required'),
    branch: Yup.string().required('Branch is required'),
    userName: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    joinDate: Yup.string().required('Join date is required'),
    leaveDate: Yup.string(),

    // Permanent Address Info
    permanentAddress: Yup.string().required('Permanent Address is required'),
    permanentLandmark: Yup.string(),
    permanentCountry: Yup.string().required('Country is required'),
    permanentState: Yup.string().required('State is required'),
    permanentCity: Yup.string().required('City is required'),
    permanentPincode: Yup.string().required('Pincode is required'),

    // Temporary Address Info
    tempAddress: Yup.string(),
    tempLandmark: Yup.string(),
    tempCountry: Yup.string(),
    tempState: Yup.string(),
    tempCity: Yup.string(),
    tempPincode: Yup.string(),
  });

  const defaultValues = useMemo(() => ({
    profile_pic: currentEmployee?.profile_pic || '',
    firstName: currentEmployee?.firstName || '',
    middleName: currentEmployee?.middleName || '',
    lastName: currentEmployee?.lastName || '',
    drivingLicense: currentEmployee?.drivingLicense || '',
    voterId: currentEmployee?.voterId || '',
    panNo: currentEmployee?.panNo || '',
    aadharCard: currentEmployee?.aadharCard || '',
    mobile: currentEmployee?.mobile || '',
    dateOfBirth: currentEmployee?.dateOfBirth || '',
    remarks: currentEmployee?.remarks || '',
    role: currentEmployee?.role || '',
    workUnder: currentEmployee?.workUnder || '',
    branch: currentEmployee?.branch || '',
    userName: currentEmployee?.userName || '',
    password: '',
    joinDate: currentEmployee?.joinDate || '',
    leaveDate: currentEmployee?.leaveDate || '',
    permanentAddress: currentEmployee?.permanentAddress || '',
    permanentLandmark: currentEmployee?.permanentLandmark || '',
    permanentCountry: currentEmployee?.permanentCountry || '',
    permanentState: currentEmployee?.permanentState || '',
    permanentCity: currentEmployee?.permanentCity || '',
    permanentPincode: currentEmployee?.permanentPincode || '',
    tempAddress: currentEmployee?.tempAddress || '',
    tempLandmark: currentEmployee?.tempLandmark || '',
    tempCountry: currentEmployee?.tempCountry || '',
    tempState: currentEmployee?.tempState || '',
    tempCity: currentEmployee?.tempCity || '',
    tempPincode: currentEmployee?.tempPincode || '',
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

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      profile_pic: data.profile_pic,
      firstName: data.firstName,
      surName: data.surName,
      middleName: data.middleName,
      drivingLicense: data.drivingLicense,
      voterId: data.voterId,
      panNo: data.panNo,
      aadharCard: data.aadharCard,
      mobile: data.mobile,
      dateOfBirth: data.dateOfBirth,
      remarks: data.remarks,
      role: data.role,
      workUnder: data.workUnder,
      branch: data.branch,
      userName: data.userName,
      password: data.password,
      joinDate: data.joinDate,
      leaveDate: data.leaveDate,
      permanentAddress: {
        address: data.permanentAddress,
        landmark: data.permanentLandmark,
        country: data.permanentCountry,
        state: data.permanentState,
        city: data.permanentCity,
        pincode: data.permanentPincode,
      },
      temporaryAddress: {
        address: data.tempAddress,
        landmark: data.tempLandmark,
        country: data.tempCountry,
        state: data.tempState,
        city: data.tempCity,
        pincode: data.tempPincode,
      },
    };
    console.log("payloadddddddddd : ",payload);
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   reset();
    //   enqueueSnackbar(currentEmployee ? 'Update success!' : 'Create success!');
    //   router.push(paths.dashboard.employee.list);
    // } catch (error) {
    //   console.error(error);
    // }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue('profile_pic', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="profile_pic"
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
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="firstName" label="First Name" req={"red"}/>
              <RHFTextField name="middleName" label="Middle Name" req={"red"}/>
              <RHFTextField name="lastName" label="Last Name" req={"red"}/>
              <RHFTextField name="drivingLicense" label="Driving License" />
              <RHFTextField name="panNo" label="Pan No." req={"red"}/>
              <RHFTextField name="voterId" label="Voter ID" />
              <RHFTextField name="aadharCard" label="Aadhar Card" req={"red"}/>
              <RHFTextField name="mobile" label="Mobile" req={"red"}/>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Date of Birth"
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                        className: "req"
                      },
                    }}
                  />
                )}
              />
              <RHFTextField name="remarks" label="Remarks" />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Official Info
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="role" label="Role" req={"red"}/>
              <RHFTextField name="workUnder" label="Work Under" req={"red"}/>
              <RHFTextField name="branch" label="Branch" req={"red"}/>
              <RHFTextField name="userName" label="Username" req={"red"}/>
              <RHFTextField name="password" label="Password" req={"red"}/>
              <Controller
                name="joinDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Join Date"
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                        className: "req"
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="leaveDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Leave Date"
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
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Address Details
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography gutterBottom sx={{ mb: 2,fontSize: "17px",fontWeight: "700" }}>
              Permanent Address
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="permanentAddress" label="Address" req={"red"}/>
              <RHFTextField name="permanentLandmark" label="Landmark" />
              {/*<RHFTextField name="permanentCountry" label="Country" />*/}
              <Controller
                name="permanentCountry"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    sx={{borderLeft: "2px solid red",borderRadius: "8px"}}
                    options={countrystatecity.map((country) => country.name)}
                    onChange={(event, value) => field.onChange(value)}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <TextField {...params} label="Country" variant="outlined" />
                    )}
                  />
                )}
              />
              <Controller
                name="permanentState"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    sx={{borderLeft: "2px solid red",borderRadius: "8px"}}
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
                      <TextField {...params} label="State" variant="outlined"/>
                    )}
                  />
                )}
              />
              {/*<RHFTextField name="permanentCity" label="City" />*/}
              <Controller
                name="permanentCity"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    sx={{borderLeft: "2px solid red",borderRadius: "8px"}}
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
                      <TextField {...params} label="City" variant="outlined" />
                    )}
                  />
                )}
              />
              <RHFTextField name="permanentPincode" label="Pincode" req={"red"}/>
            </Box>
            <Typography gutterBottom sx={{ mt:3 ,mb: 2,fontSize: "17px",fontWeight: "700" }}>
              Temporary Address
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="tempAddress" label="Address" />
              <RHFTextField name="tempLandmark" label="Landmark" />
              {/*<RHFTextField name="tempCountry" label="Country" />*/}
              <Controller
                name="tempCountry"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={countrystatecity.map((country) => country.name)}
                    onChange={(event, value) => field.onChange(value)}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <TextField {...params} label="Country" variant="outlined" />
                    )}
                  />
                )}
              />
              {/*<RHFTextField name="tempState" label="State" />*/}
              <Controller
                name="tempState"
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
                      <TextField {...params} label="State" variant="outlined" />
                    )}
                  />
                )}
              />
              {/*<RHFTextField name="tempCity" label="City" />*/}
              <Controller
                name="city"
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
                      <TextField {...params} label="City" variant="outlined" />
                    )}
                  />
                )}
              />
              <RHFTextField name="tempPincode" label="Pincode" />
            </Box>
          </Card>
        </Grid>

      </Grid>
            <Box sx={{display: "flex",justifyContent: "end",mt: 3}}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentEmployee ? 'Create Employee' : 'Save Changes'}
              </LoadingButton>
            </Box>
    </FormProvider>
  );
}

EmployeeNewEditForm.propTypes = {
  currentEmployee: PropTypes.object,
};
