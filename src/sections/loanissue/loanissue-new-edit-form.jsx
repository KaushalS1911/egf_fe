import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
import { useForm, Controller, useFieldArray, useFormContext } from 'react-hook-form';
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
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useGetAllUser } from 'src/api/user';
import { useGetConfigs } from '../../api/config';
import { useGetScheme } from '../../api/scheme';
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
import { _roles } from '../../_mock';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'type', label: 'Type' },
  { id: 'carat', label: 'Carat', align: 'right' },
  { id: 'Pcs', label: 'Pcs', align: 'right' },
  { id: 'totalWeight', label: 'Total Weight', align: 'right' },
  { id: 'lossWeight', label: 'Loss Weight', align: 'right' },
  { id: 'grossWeight', label: 'Gross Weight', align: 'right' },
  { id: 'Net Amount', label: 'Net Amount', align: 'right' },
  { id: '', label: '', align: 'right' },
];

export default function LoanissueNewEditForm({ currentLoanIssue }) {
  const router = useRouter();
  const allUser = useGetAllUser();

  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const [file, setFile] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { scheme, mutate } = useGetScheme();

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
    password: currentLoanIssue ? Yup.string() : Yup.string().required('Password is required'),
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
    items: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          title: Yup.string().required('Title is required'),
          service: Yup.string().required('Service is required'),
          quantity: Yup.number()
            .required('Quantity is required')
            .min(1, 'Quantity must be more than 0'),
        }),
      ),
    ),
  });

  const defaultValues = useMemo(() => ({
    profile_pic: currentLoanIssue?.user.avatar_url || '',
    firstName: currentLoanIssue?.user.firstName || '',
    middleName: currentLoanIssue?.user.middleName || '',
    lastName: currentLoanIssue?.user.lastName || '',
    drivingLicense: currentLoanIssue?.drivingLicense || '',
    voterCard: currentLoanIssue?.voterCard || '',
    panCard: currentLoanIssue?.panCard || '',
    aadharCard: currentLoanIssue?.aadharCard || '',
    contact: currentLoanIssue?.user.contact || '',
    dob: new Date(currentLoanIssue?.dob) || new Date(),
    remark: currentLoanIssue?.remark || '',
    role: currentLoanIssue?.user.role || '',
    reportingTo: currentLoanIssue?.reportingTo || null,
    email: currentLoanIssue?.user.email || '',
    password: '',
    joiningDate: new Date(currentLoanIssue?.joiningDate) || new Date(),
    leaveDate: new Date(currentLoanIssue?.leaveDate) || new Date(),
    permanentStreet: currentLoanIssue?.permanentAddress.street || '',
    permanentLandmark: currentLoanIssue?.permanentAddress.landmark || '',
    permanentCountry: currentLoanIssue?.permanentAddress.country || '',
    permanentState: currentLoanIssue?.permanentAddress.state || '',
    permanentCity: currentLoanIssue?.permanentAddress.city || '',
    permanentZipcode: currentLoanIssue?.permanentAddress.zipcode || '',
    tempStreet: currentLoanIssue?.temporaryAddress.street || '',
    tempLandmark: currentLoanIssue?.temporaryAddress.landmark || '',
    tempCountry: currentLoanIssue?.temporaryAddress.country || '',
    tempState: currentLoanIssue?.temporaryAddress.state || '',
    tempCity: currentLoanIssue?.temporaryAddress.city || '',
    tempZipcode: currentLoanIssue?.temporaryAddress.zipcode || '',
    items: currentLoanIssue?.items || [
      {
        title: '',
        description: '',
        service: '',
        quantity: 1,
        price: 0,
        total: 0,
      },
    ],
  }), [currentLoanIssue]);

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const handleAdd = () => {
    append({
      title: '',
      description: '',
      service: '',
      quantity: 1,
      price: 0,
      total: 0,
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const onSubmit = handleSubmit(async (data) => {
    let payload;
    console.log(data);
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

    if (currentLoanIssue) {
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
      const url = currentLoanIssue
        ? `${import.meta.env.VITE_BASE_URL}/${user?.company}/employee/${currentLoanIssue._id}?branch=66ea5ebb0f0bdc8062c13a64`
        : `${import.meta.env.VITE_BASE_URL}/${user?.company}/employee?branch=66ea5ebb0f0bdc8062c13a64`;
      const config = {
        method: currentLoanIssue ? 'put' : 'post',
        url,
        data: payload,
      };
      if (!currentLoanIssue) {
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
        if (currentLoanIssue) {
          const formData = new FormData();
          formData.append('profile-pic', file);
          axios.put(`${import.meta.env.VITE_BASE_URL}/${user?.company}/user/${currentLoanIssue.user._id}/profile`, formData).then((res) => console.log(res)).catch((err) => console.log(err));
        }
      }
    },
    [setValue],
  );

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

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 3 }}>
            Customer Details
          </Typography>
          <Card sx={{ pt: 6, pb: 2 }}>
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
              <RHFTextField name='customerCode' label='Customer Code'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
              <RHFTextField name='customerName' label='Customer Name'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
              <RHFTextField name='customerAddress' label='Customer Address'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
              <RHFTextField name='contact' label='Mobile No.'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
              <RHFTextField name='contactOtp' label='OTP Mobile No.'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
              <RHFTextField name='voterCard' label='OTP Loan No.'
                            sx={{ ' input': { outline: '1px solid black', borderRadius: '8px' } }} />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 3 }}>
            Loan Scheme Details
          </Typography>
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
              <RHFTextField name='loanNo' label='Loan No.' />
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
                        helperText: error?.message,
                        className: 'req',
                      },
                    }}
                  />
                )}
              />
              <RHFAutocomplete
                name='scheme'
                label='Scheme'
                req={'red'}
                fullWidth
                options={scheme?.map((item) => item.name)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              <RHFTextField name='interestRate' label='Instrest Rate' req={'red'} />
              <RHFTextField name='lastName' label='Consulting Charge' req={'red'} />
              <RHFTextField name='periodTime' label='INT. Period Time' req={'red'} />
              <RHFTextField name='renewalTime' label='Renewal Time' req={'red'} />
              <RHFTextField name='loanCloseTime' label='Minimun Loan Close Time' req={'red'} />
              <RHFTextField name='aadharCard' label='Loan AMT.' req={'red'} />
              <Controller
                name='intDate'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label='Next INT.Date'
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
              <RHFTextField name='jewelersName' label='Jewelers Name' req={'red'} />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Property Details
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title='Property Images' />
            <CardContent>
              <Upload file={file} onDrop={handleDropSingleFile} onDelete={() => setFile(null)} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <Table sx={{ minWidth: 800, borderRadius: '16px' }}>
              <TableHeadCustom headLabel={TABLE_HEAD} />
              <TableBody>
                {fields.map((row, index) => (
                  <TableRow key={row.name}>
                    <TableCell><RHFAutocomplete
                      name="goldType"
                      autoHighlight
                      options={['sa','as','yu'].map((option) => option)}
                      getOptionLabel={(option) => option}
                      renderOption={(props, option) => (
                        <li {...props} key={option}>
                          {option}
                        </li>
                      )}
                    /></TableCell>
                    <TableCell align='right'><RHFTextField name={""} /></TableCell>
                    <TableCell align='right'>sasasa</TableCell>
                    <TableCell align='right'>sasas</TableCell>
                    <TableCell align='right'>sasasa</TableCell>
                    <TableCell align='right'>
                      <Button
                        size='small'
                        color='error'
                        startIcon={<Iconify icon='solar:trash-bin-trash-bold' />}
                        onClick={() => handleRemove(index)}
                      >
                        Remove
                      </Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <Button
            size='small'
            color='primary'
            startIcon={<Iconify icon='mingcute:add-line' />}
            onClick={handleAdd}
            sx={{ flexShrink: 0 }}
          >
            Add Item
          </Button>
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
              {/*<Controller*/}
              {/*  name='permanentCountry'*/}
              {/*  control={control}*/}
              {/*  render={({ field }) => (*/}
              {/*    <Autocomplete*/}
              {/*      {...field}*/}
              {/*      sx={{ borderLeft: '2px solid red', borderRadius: '8px' }}*/}
              {/*      options={countrystatecity.map((country) => country.name)}*/}
              {/*      onChange={(event, value) => field.onChange(value)}*/}
              {/*      isOptionEqualToValue={(option, value) => option === value}*/}
              {/*      renderInput={(params) => (*/}
              {/*        <TextField {...params} label='Country' variant='outlined' />*/}
              {/*      )}*/}
              {/*    />*/}
              {/*  )}*/}
              {/*/>*/}
              {/*<Controller*/}
              {/*  name='permanentState'*/}
              {/*  control={control}*/}
              {/*  render={({ field }) => (*/}
              {/*    <Autocomplete*/}
              {/*      {...field}*/}
              {/*      sx={{ borderLeft: '2px solid red', borderRadius: '8px' }}*/}
              {/*      options={*/}
              {/*        watch('permanentCountry')*/}
              {/*          ? countrystatecity*/}
              {/*          .find((country) => country.name === watch('permanentCountry'))*/}
              {/*          ?.states.map((state) => state.name) || []*/}
              {/*          : []*/}
              {/*      }*/}
              {/*      onChange={(event, value) => field.onChange(value)}*/}
              {/*      isOptionEqualToValue={(option, value) => option === value}*/}
              {/*      renderInput={(params) => (*/}
              {/*        <TextField {...params} label='State' variant='outlined' />*/}
              {/*      )}*/}
              {/*    />*/}
              {/*  )}*/}
              {/*/>*/}
              {/*<Controller*/}
              {/*  name='permanentCity'*/}
              {/*  control={control}*/}
              {/*  render={({ field }) => (*/}
              {/*    <Autocomplete*/}
              {/*      {...field}*/}
              {/*      sx={{ borderLeft: '2px solid red', borderRadius: '8px' }}*/}
              {/*      options={*/}
              {/*        watch('permanentState')*/}
              {/*          ? countrystatecity*/}
              {/*          .find((country) => country.name === watch('permanentCountry'))*/}
              {/*          ?.states.find((state) => state.name === watch('permanentState'))*/}
              {/*          ?.cities.map((city) => city.name) || []*/}
              {/*          : []*/}
              {/*      }*/}
              {/*      onChange={(event, value) => field.onChange(value)}*/}
              {/*      isOptionEqualToValue={(option, value) => option === value}*/}
              {/*      renderInput={(params) => (*/}
              {/*        <TextField {...params} label='City' variant='outlined' />*/}
              {/*      )}*/}
              {/*    />*/}
              {/*  )}*/}
              {/*/>*/}
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
              {/*<Controller*/}
              {/*  name='tempCountry'*/}
              {/*  control={control}*/}
              {/*  render={({ field }) => (*/}
              {/*    <Autocomplete*/}
              {/*      {...field}*/}
              {/*      options={countrystatecity.map((country) => country.name)}*/}
              {/*      onChange={(event, value) => field.onChange(value)}*/}
              {/*      isOptionEqualToValue={(option, value) => option === value}*/}
              {/*      renderInput={(params) => (*/}
              {/*        <TextField {...params} label='Country' variant='outlined' />*/}
              {/*      )}*/}
              {/*    />*/}
              {/*  )}*/}
              {/*/>*/}
              {/*/!*<RHFTextField name="tempState" label="State" />*!/*/}
              {/*<Controller*/}
              {/*  name='tempState'*/}
              {/*  control={control}*/}
              {/*  render={({ field }) => (*/}
              {/*    <Autocomplete*/}
              {/*      {...field}*/}
              {/*      options={*/}
              {/*        watch('tempCountry')*/}
              {/*          ? countrystatecity*/}
              {/*          .find((country) => country.name === watch('tempCountry'))*/}
              {/*          ?.states.map((state) => state.name) || []*/}
              {/*          : []*/}
              {/*      }*/}
              {/*      onChange={(event, value) => field.onChange(value)}*/}
              {/*      isOptionEqualToValue={(option, value) => option === value}*/}
              {/*      renderInput={(params) => (*/}
              {/*        <TextField {...params} label='State' variant='outlined' />*/}
              {/*      )}*/}
              {/*    />*/}
              {/*  )}*/}
              {/*/>*/}
              {/*<Controller*/}
              {/*  name='tempCity'*/}
              {/*  control={control}*/}
              {/*  render={({ field }) => (*/}
              {/*    <Autocomplete*/}
              {/*      {...field}*/}
              {/*      options={*/}
              {/*        watch('tempState')*/}
              {/*          ? countrystatecity*/}
              {/*          .find((country) => country.name === watch('tempCountry'))*/}
              {/*          ?.states.find((state) => state.name === watch('tempState'))*/}
              {/*          ?.cities.map((city) => city.name) || []*/}
              {/*          : []*/}
              {/*      }*/}
              {/*      onChange={(event, value) => field.onChange(value)}*/}
              {/*      isOptionEqualToValue={(option, value) => option === value}*/}
              {/*      renderInput={(params) => (*/}
              {/*        <TextField {...params} label='City' variant='outlined' />*/}
              {/*      )}*/}
              {/*    />*/}
              {/*  )}*/}
              {/*/>*/}
              <RHFTextField name='tempZipcode' label='Zipcode' />
            </Box>
          </Card>
        </Grid>

      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
        <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
          {!currentLoanIssue ? 'Create Employee' : 'Save Changes'}
        </LoadingButton>
      </Box>
    </FormProvider>
  );
}

LoanissueNewEditForm.propTypes = {
  currentLoanIssue: PropTypes.object,
};
