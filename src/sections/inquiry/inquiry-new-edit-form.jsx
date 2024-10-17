import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { useAuthContext } from 'src/auth/hooks';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useGetConfigs } from '../../api/config';
import { useGetBranch } from '../../api/branch';

// ----------------------------------------------------------------------

export default function InquiryNewEditForm({ currentInquiry }) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { branch } = useGetBranch();
  const { enqueueSnackbar } = useSnackbar();
  const { configs } = useGetConfigs();
  const storedBranch = sessionStorage.getItem('selectedBranch');

  function checkInquiryFor(val) {
    const isLoanValue = configs?.loanTypes?.find((item) => item === val);
    if (isLoanValue) {
      return false;
    } else {
      return true;
    }
  }

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    contact: Yup.string().required('Contact is required'),
    email: Yup.string().email('Email must be valid').required('Email is required'),
    date: Yup.date()
      .required('Date is required')
      .nullable()
      .typeError('Date is required'),
    inquiryFor: Yup.string().required('Inquiry field is required'),
  });

  const defaultValues = useMemo(
    () => ({
      branchId: currentInquiry ? {
        label: currentInquiry?.branch?.name,
        value: currentInquiry?.branch?._id,
      } : null,
      firstName: currentInquiry?.firstName || '',
      lastName: currentInquiry?.lastName || '',
      contact: currentInquiry?.contact || '',
      email: currentInquiry?.email || '',
      other: checkInquiryFor(currentInquiry?.inquiryFor) ? currentInquiry?.inquiryFor : null || '',
      date: new Date(currentInquiry?.date) || '',
      inquiryFor: (currentInquiry && checkInquiryFor(currentInquiry?.inquiryFor) ? 'Other' : currentInquiry?.inquiryFor) || '',
      remark: currentInquiry?.remark || '',
    }),
    [currentInquiry],
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      contact: data.contact,
      email: data.email,
      date: data.date,
      inquiryFor: data.inquiryFor === 'Other' ? data.other : data.inquiryFor,
      remark: data.remark,
    };

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
      ? `&branch=${mainbranchid?._id}`
      : `&branch=${parsedBranch}`;

    try {
      if (currentInquiry) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/${user?.company}/inquiry/${currentInquiry._id}?${branchQuery}`,
          payload,
        );
        enqueueSnackbar(res?.data?.message);
        router.push(paths.dashboard.inquiry.list);
        reset();
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/${user?.company}/inquiry?${branchQuery}`,
          payload,
        );
        enqueueSnackbar(res?.data?.message);
        router.push(paths.dashboard.inquiry.list);
        reset();
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Request failed';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      console.error(error);
    }

  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Inquiry Details
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
              <RHFTextField name='lastName' label='Last Name' req={'red'} />
              <RHFTextField
                name='contact'
                label='Mobile No.'
                req={'red'}
                inputProps={{
                maxLength: 10,
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
                rules={{
                  required: 'Mobile number is required',
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
              <RHFTextField name='email' label='Email' req={'red'} />

              <Controller
                name='date'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label='Date'
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                        className: `req`,
                      },
                    }}
                  />
                )}
              />
              {configs.loanTypes && <RHFAutocomplete
                name='inquiryFor'
                label={'Inquiry For'}
                autoHighlight
                options={[...configs?.loanTypes, 'Other']?.map((option) => option)}
                getOptionLabel={(option) => option}
                req={'red'}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />}
              {
                (watch('inquiryFor') === 'Other') &&
                <RHFTextField name='other' label='Other' req={'red'} />
              }
              <RHFTextField name='remark' label='Remark' />
            </Box>

            <Stack alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                {!currentInquiry ? 'Add Inquiry' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

InquiryNewEditForm.propTypes = {
  currentInquiry: PropTypes.object,
};
