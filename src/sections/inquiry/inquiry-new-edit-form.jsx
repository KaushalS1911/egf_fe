import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { useAuthContext } from 'src/auth/hooks';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useGetConfigs } from '../../api/config';
import { useGetBranch } from '../../api/branch';
import { Button } from '@mui/material';
import RHFDatePicker from '../../components/hook-form/rhf-.date-picker';
import { useGetEmployee } from '../../api/employee';
import { indexof } from 'stylis';
import { mutate } from 'swr';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Responded', label: 'Responded' },
  { value: 'Not Responded', label: 'Not Responded' },
];

export default function InquiryNewEditForm({ currentInquiry , inquiry}) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { branch } = useGetBranch();
  const { employee } = useGetEmployee();
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

  function checkremark(val) {
    const isLoanValue = configs?.remarks?.find((item) => item === val);
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
    address: Yup.string().required('Address is required'),
    email: Yup.string().email('Email must be valid').required('Email is required'),
    date: Yup.date()
      .required('Date is required')
      .nullable()
      .typeError('Date is required'),
    inquiryFor: Yup.string().required('Inquiry field is required'),
    branchId: Yup.object()
      .shape({
        label: Yup.string().required('Branch name is required'),
        value: Yup.string().required('Branch ID is required'),
      })
      .nullable()
      .required('Branch selection is required'),
  });

  const defaultValues = useMemo(
    () => ({
      branchId: currentInquiry ? {
        label: currentInquiry?.branch?.name,
        value: currentInquiry?.branch?._id,
      } : null,
      assignTo: currentInquiry ? {
        label: currentInquiry?.assignTo?.user?.firstName + ' ' + currentInquiry?.assignTo?.user?.lastName,
        value: currentInquiry?.assignTo?._id,
      } : null,
      response: currentInquiry?.response || 'Active',
      firstName: currentInquiry?.firstName || '',
      lastName: currentInquiry?.lastName || '',
      contact: currentInquiry?.contact || '',
      email: currentInquiry?.email || '',
      date: currentInquiry ? new Date(currentInquiry?.date) : new Date(),
      recallingDate: currentInquiry ? new Date(currentInquiry?.recallingDate) : null,
      inquiryFor: (currentInquiry && checkInquiryFor(currentInquiry?.inquiryFor) ? 'Other' : currentInquiry?.inquiryFor) || '',
      other: checkInquiryFor(currentInquiry?.inquiryFor) ? currentInquiry?.inquiryFor : null || '',
      remark: (currentInquiry && checkremark(currentInquiry?.remark) ? 'Other' : currentInquiry?.remark) || '',
      otherRemark: checkremark(currentInquiry?.remark) ? currentInquiry?.remark : null || '',
      address: currentInquiry?.address || '',
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
      recallingDate: data.recallingDate,
      inquiryFor: data.inquiryFor === 'Other' ? data.other : data.inquiryFor,
      remark: data.remark === 'Other' ? data?.otherRemark : data?.remark,
      response: data.response,
      address: data.address,
      assignTo: data.assignTo.value,
    };

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

    const employeeQuery = user?.role === 'Admin'
      ? `&assignTo=${data?.assignTo?.value}`
      : ``;

    const queryString = `${branchQuery}${employeeQuery}`;

    try {
      if (currentInquiry) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/${user?.company}/inquiry/${currentInquiry._id}?${queryString}`,
          payload,
        );
        enqueueSnackbar(res?.data?.message);
        router.push(paths.dashboard.inquiry.list);
        reset();
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/${user?.company}/inquiry?${queryString}`,
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
  const fetchNextInquiry = () => {
    const nextInquiryIndex = inquiry.indexOf(currentInquiry) + 1;
    const nextInquiry = inquiry[nextInquiryIndex];

    if (nextInquiry) {
      router.push(paths.dashboard.inquiry.edit(nextInquiry._id));
      reset({
        branchId: nextInquiry.branch
          ? {
            label: nextInquiry.branch.name,
            value: nextInquiry.branch._id,
          }
          : null,
        assignTo: nextInquiry.assignTo
          ? {
            label: `${nextInquiry.assignTo.user.firstName} ${nextInquiry.assignTo.user.lastName}`,
            value: nextInquiry.assignTo._id,
          }
          : null,
        response: nextInquiry.response || 'Active',
        firstName: nextInquiry.firstName || '',
        lastName: nextInquiry.lastName || '',
        contact: nextInquiry.contact || '',
        email: nextInquiry.email || '',
        date: nextInquiry.date ? new Date(nextInquiry.date) : new Date(),
        recallingDate: nextInquiry.recallingDate ? new Date(nextInquiry.recallingDate) : null,
        inquiryFor: checkInquiryFor(nextInquiry.inquiryFor)
          ? 'Other'
          : nextInquiry.inquiryFor || '',
        other: checkInquiryFor(nextInquiry.inquiryFor) ? nextInquiry.inquiryFor : null || '',
        remark: checkremark(nextInquiry.remark) ? 'Other' : nextInquiry.remark || '',
        otherRemark: checkremark(nextInquiry.remark) ? nextInquiry.remark : null || '',
        address: nextInquiry.address || '',
      });
    } else {
      enqueueSnackbar('No more inquiries available', { variant: 'info' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Typography variant='subtitle1' sx={{ mb: 0.5, fontWeight: '600' }}>
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
              {user?.role === 'Admin' && employee && (
                <RHFAutocomplete
                  name='assignTo'
                  req={'red'}
                  label='Employee'
                  placeholder='Choose a Branch'
                  options={employee?.map((employeeitem) => ({
                    label: employeeitem?.user?.firstName + ' ' + employeeitem?.user?.lastName,
                    value: employeeitem?._id,
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
              <RHFDatePicker
                name='date'
                control={control}
                label='Date'
                req={'red'}
              />
              <RHFDatePicker
                name='recallingDate'
                control={control}
                label='Recalling Date'
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
              <RHFAutocomplete
                name='response'
                req={'red'}
                label='Status'
                placeholder='Choose a Status'
                options={STATUS_OPTIONS.map((item) => item.value)}
                onChange={(e, value) => {
                  methods.setValue('response', value);
                  if (value === 'Responded') {
                    setDialogOpen(true);
                  }
                }}
              />
              <RHFTextField name='address' label='Address' req={'red'} />
              <RHFAutocomplete
                name='remark'
                req='red'
                label='Remark'
                placeholder='Choose a Remark'
                options={[...configs?.remarks || [], 'Other']}
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              {watch('remark') === 'Other' && (
                <RHFTextField
                  name='otherRemark'
                  label='Other Remark'
                  req={'red'}
                  placeholder='Enter other remark'
                />
              )}
            </Box>
          </Card>
          <Box xs={12} md={8} sx={{ display: 'flex', justifyContent: currentInquiry ? 'space-between' : 'end', mt: 3 }}>
            {
              currentInquiry &&
              <LoadingButton variant='contained' onClick={fetchNextInquiry}>
                Next
              </LoadingButton>
            }
            <Box>
              <Button color='inherit' sx={{ margin: '0px 10px', height: '36px' }}
                      variant='outlined' onClick={() => reset()}>Reset</Button>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                {!currentInquiry ? 'Submit' : 'Save'}
              </LoadingButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

InquiryNewEditForm.propTypes = {
  currentInquiry: PropTypes.object,
};
