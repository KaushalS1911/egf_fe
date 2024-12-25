import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useRef, useState } from 'react';
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
import { Autocomplete, Button, Dialog, TextField } from '@mui/material';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useGetAllUser } from 'src/api/user';
import { useGetConfigs } from '../../api/config';
import { useGetBranch } from '../../api/branch';
import RHFDatePicker from '../../components/hook-form/rhf-.date-picker';
import ReactCrop from 'react-image-crop';
import DialogTitle from '@mui/material/DialogTitle';
import Webcam from 'react-webcam';
import DialogActions from '@mui/material/DialogActions';

// ----------------------------------------------------------------------

export default function EmployeeNewEditForm({ currentEmployee }) {
  const router = useRouter();
  const allUser = useGetAllUser();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const { enqueueSnackbar } = useSnackbar();
  const { branch } = useGetBranch();
  const storedBranch = sessionStorage.getItem('selectedBranch');
  const webcamRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 50 });
  const [completedCrop, setCompletedCrop] = useState(null);

  const NewEmployeeSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    middleName: Yup.string().required('Middle name is required'),
    lastName: Yup.string().required('Last name is required'),
    drivingLicense: Yup.string(),
    panCard: Yup.string().required('PAN No. is required'),
    voterCard: Yup.string(),
    aadharCard: Yup.string().required('Aadhar Card is required'),
    profile_pic: Yup.mixed().required('A property picture is required'),
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
      label: currentEmployee?.user?.branch?.name,
      value: currentEmployee?.user?.branch?._id,
    } : null,
    profile_pic: currentEmployee?.user.avatar_url || null,
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

      if (capturedImage) {
        const base64Data = capturedImage.split(',')[1];
        const binaryData = atob(base64Data);
        const arrayBuffer = new Uint8Array(binaryData.length);

        for (let i = 0; i < binaryData.length; i++) {
          arrayBuffer[i] = binaryData.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: 'image/jpeg' }); // Create a Blob

        formData.append('profile-pic', blob, 'customer-image.jpg');
      } else {
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
      const mainbranchid = branch?.find((e) => e?._id === data?.branchId?.value) || branch?.[0];
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
      enqueueSnackbar(currentEmployee ? 'Failed To update employee' : error.response.data.message, { variant: 'error' });

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
          setValue('permanentCity', data.PostOffice[0]?.District, { shouldValidate: true });
        } else if (type === 'temporary') {
          setValue('tempCountry', data.PostOffice[0]?.Country, { shouldValidate: true });
          setValue('tempState', data.PostOffice[0]?.Circle, { shouldValidate: true });
          setValue('tempCity', data.PostOffice[0]?.District, { shouldValidate: true });
        }
      } else {
        if (type === 'permanent') {
          setValue('permanentCountry', '', { shouldValidate: true });
          setValue('permanentState', '', { shouldValidate: true });
          setValue('permanentCity', '', { shouldValidate: true });
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

  const videoConstraints = {
    width: 640,
    height: 360,
    facingMode: 'user',
  };

  const handleDropSingleFile = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setFile(file);
        resetCrop();
      };
      reader.readAsDataURL(file);
    }
  }, []);
  const resetCrop = () => {
    setCrop({ unit: '%', width: 50, aspect: 1 });
    setCompletedCrop(null);
  };
  const handleCancel = () => {
    setImageSrc(null);
    setCapturedImage(null)
    setOpen(false)
  };
  const showCroppedImage = async () => {
    try {
      if (!completedCrop || !completedCrop.width || !completedCrop.height) {
        if (file || capturedImage) {
          const imageToUpload = file || capturedImage; // Use capturedImage if available
          setCroppedImage(typeof imageToUpload === 'string' ? imageToUpload : URL.createObjectURL(imageToUpload));
          setValue('profile_pic', imageToUpload);

          if (currentEmployee) {
            const formData = new FormData();
            if (typeof imageToUpload === 'string') {
              // If capturedImage is a base64 string, convert it to a blob
              const response = await fetch(imageToUpload);
              const blob = await response.blob();
              formData.append('profile-pic', blob, 'captured-image.jpg');
            } else {
              // Otherwise, upload the file directly
              formData.append('profile-pic', imageToUpload);
            }

            await axios
              .put(
                `${import.meta.env.VITE_BASE_URL}/${user?.company}/user/${currentEmployee.user._id}/profile`,
                formData,
              )
              .then((res) => {
                console.log('Profile updated successfully:', res.data);
              })
              .catch((err) => {
                console.error('Error uploading original image:', err);
              });
          }

          setOpen(false);
          setImageSrc(null);
        }
        return;
      }

      // Handle cropping logic if completedCrop exists
      const canvas = document.createElement('canvas');
      const image = document.getElementById('cropped-image');

      if (!image) {
        console.error('Image element not found!');
        return;
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height,
      );

      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error('Failed to create blob');
          return;
        }

        const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });

        setCroppedImage(URL.createObjectURL(croppedFile));
        setFile(croppedFile);
        setValue('profile_pic', croppedFile);

        if (currentEmployee) {
          const formData = new FormData();
          formData.append('profile-pic', croppedFile);

          await axios
            .put(
              `${import.meta.env.VITE_BASE_URL}/${user?.company}/user/${currentEmployee.user._id}/profile`,
              formData,
            )
            .then((res) => {
              console.log('Profile updated successfully:', res.data);
            })
            .catch((err) => {
              console.error('Error uploading cropped image:', err);
            });
        }
        setOpen(false);
        setImageSrc(null);
      }, 'image/jpeg');
    } catch (e) {
      console.error('Error cropping and uploading image:', e);
    }
  };
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc); // Set captured image
        setValue('profile_pic', imageSrc);
        setOpen2(false); // Close the ca
        setOpen(true); // Close the ca
      }
    }
  }, [webcamRef, setCapturedImage, setValue, setOpen2, user, currentEmployee]);
  return (
    <>
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3} p={0}>
          {/*<Card >*/}
            <Box sx={{ pt:2, px: 3 }}>
              <RHFUploadAvatar
                name='profile_pic'
                camera={true}
                setOpen2={setOpen2}
                setOpen={setOpen}
                setImageSrc={setImageSrc}
                setFile={setFile}
                file={ croppedImage || imageSrc || capturedImage || currentEmployee?.user?.avatar_url}
                maxSize={3145728}
                accept='image/*'
                onDrop={handleDropSingleFile}
              />
              <Dialog open={Boolean(open)} onClose={handleCancel}>
                {/*{imageSrc.length || capturedImage && (*/}
                {console.log(imageSrc,"/./././././././././././.")}
                <ReactCrop
                  crop={crop}
                  onChange={(newCrop) => setCrop(newCrop)}
                  onComplete={(newCrop) =>
                    setCompletedCrop(newCrop)}
                  aspect={1}
                >
                  <img
                    id='cropped-image'
                    src={imageSrc || capturedImage}
                    alt='Crop preview'
                    onLoad={resetCrop}
                  />
                </ReactCrop>
                {/*)}*/}
                <div style={{
                  display: 'flex', justifyContent:
                    'space-between', padding: '1rem',
                }}>
                  <Button variant='outlined' onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant='contained' color='primary'
                          onClick={showCroppedImage}>
                    Save Image
                  </Button>
                </div>
              </Dialog>
            </Box>
          {/*</Card>*/}
        </Grid>
        <Grid xs={12} md={9}>
          <Card sx={{ p: 2 }}>
            <Box
              rowGap={1.5}
              columnGap={1.5}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(4, 1fr)',
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
                name='firstName'
                label='First Name'
                req={'red'}
                inputProps={{ style: { textTransform: 'uppercase' } }}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  methods.setValue('firstName', e.target.value);
                }}
              />

              <RHFTextField
                name='middleName'
                label='Middle Name'
                req={'red'}
                inputProps={{ style: { textTransform: 'uppercase' } }}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  methods.setValue('middleName', e.target.value);
                }}
              />

              <RHFTextField
                name='lastName'
                label='Last Name'
                req={'red'}
                inputProps={{ style: { textTransform: 'uppercase' } }}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  methods.setValue('lastName', e.target.value);
                }}
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
              <RHFDatePicker
                name='dob'
                control={control}
                label='Date of Birth'
                req={'red'}
              />
              <RHFTextField name='remark' label='Remark' />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant='subtitle1' sx={{ mb: 1.5, fontWeight: 600 }}>
              Official Info
            </Typography>

            <Box
              rowGap={1.5}
              columnGap={1.5}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(6, 1fr)',
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
              <RHFDatePicker
                name='joiningDate'
                control={control}
                label='Join Date'
                req={'red'}
              />
              <RHFDatePicker
                name='leaveDate'
                control={control}
                label='Leave Date'
                req={'red'}
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant='subtitle1' sx={{ mb: 1.5, fontWeight: 600 }}>
              Permanent Address
            </Typography>
            <Box
              rowGap={1.5}
              columnGap={1.5}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(6, 1fr)',
              }}
            >
              <RHFTextField name='permanentStreet' label='Address' req={'red'} />
              <RHFTextField name='permanentLandmark' label='Landmark' req={'red'} />
              <RHFTextField
                name='permanentZipcode'
                label={
                  <span>
      Zipcode
    </span>
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
            <Typography variant='subtitle1' sx={{ my: 1.5, fontWeight: '600' }}>
              Temporary Address
            </Typography>
            <Box
              rowGap={1.5}
              columnGap={1.5}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(6, 1fr)',
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
                      <TextField {...params} label='Country' variant='outlined'
                                 sx={{
                                   ' label': { mt: -0.8, fontSize: '14px' },
                                   ' input': { height: 7 },
                                 }}
                      />
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
                      <TextField {...params} label='State' variant='outlined' sx={{
                        ' label': { mt: -0.8, fontSize: '14px' },
                        ' input': { height: 7 },
                      }} />
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
                      <TextField {...params} label='City' variant='outlined' sx={{
                        ' label': { mt: -0.8, fontSize: '14px' },
                        ' input': { height: 7 },
                      }} />
                    )}
                  />
                )}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Box xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
        <Button color='inherit' sx={{ margin: '0px 10px', height: '36px' }}
                variant='outlined' onClick={() => reset()}>Reset</Button>
        <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
          {!currentEmployee ? 'Submit' : 'Save'}
        </LoadingButton>
      </Box>
    </FormProvider>
      <Dialog
        fullWidth
        maxWidth={false}
        open={open2}
        onClose={() => setOpen2(false)}
        PaperProps={{
          sx: { maxWidth: 720 },
        }}
      >
        <DialogTitle>Camera</DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat='image/jpeg'
            width={'90%'}
            height={'100%'}
            videoConstraints={videoConstraints}
          />
        </Box>
        <DialogActions>
          <Button variant='outlined' onClick={capture}>
            Capture Photo
          </Button>
          <Button variant='contained' onClick={() => setOpen2(false)}>
            Close Camera
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

EmployeeNewEditForm.propTypes = {
  currentEmployee: PropTypes.object,
};
