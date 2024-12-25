import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Card, CardHeader, Grid, Typography, IconButton } from '@mui/material';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { Stack } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { RHFAutocomplete, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useResponsive } from '../../../hooks/use-responsive';
import Iconify from 'src/components/iconify';
import { useGetCompanyDetails } from '../../../api/company_details';
import { ACCOUNT_TYPE_OPTIONS } from '../../../_mock';
import { useDispatch } from 'react-redux';
import { updateConfigs } from '../slices/configSlice';
import { useGetConfigs } from '../../../api/config';
import { useGetBranch } from '../../../api/branch';

const personalDetailsSchema = yup.object().shape({
  logo_url: yup.mixed().required('Logo is required'),
  name: yup.string().required('Company Name is required'),
  email: yup.string().email('Invalid email address').required('Email Address is required'),
  contact: yup.string().required('Phone Number is required'),
});

const bankDetailsSchema = yup.object().shape({
  accountNumber: yup.string().required('Account Number is required'),
  accountType: yup.string().required('Account Type is required'),
  accountHolderName: yup.string().required('Account Holder Name is required'),
  bankName: yup.string().required('Bank Name is required'),
  IFSC: yup.string().required('IFSC Code is required'),
  branchName: yup.string().required('Branch Name is required'),
});

export default function CompanyProfile() {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const { companyDetail, companyMutate } = useGetCompanyDetails();
  const [profilePic, setProfilePic] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const mdUp = useResponsive('up', 'md');
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [editingBankDetail, setEditingBankDetail] = useState(null);
  const { branch } = useGetBranch();
  const { configs,mutate} = useGetConfigs();


  const personalDetailsMethods = useForm({
    defaultValues: {
      logo_url: companyDetail?.logo_url || '',
      name: companyDetail?.name || '',
      email: companyDetail?.email || '',
      contact: companyDetail?.contact || '',
      branch: configs?.headersConfig?.branch || null,
      webUrl: configs?.headersConfig?.companyDetail.webUrl || '',
    },
    resolver: yupResolver(personalDetailsSchema),
  });

  const bankDetailsMethods = useForm({
    defaultValues: {
      accountNumber: editingBankDetail?.accountNumber || '',
      accountType: editingBankDetail?.accountType || '',
      accountHolderName: editingBankDetail?.accountHolderName || '',
      bankName: editingBankDetail?.bankName || '',
      IFSC: editingBankDetail?.IFSC || '',
      branchName: editingBankDetail?.branchName || '',
    },
    resolver: yupResolver(bankDetailsSchema),
  });

  const { reset: resetPersonalDetails, handleSubmit: handleSubmitPersonalDetails } = personalDetailsMethods;
  const { reset: resetBankDetails, handleSubmit: handleSubmitBankDetails } = bankDetailsMethods;
  useEffect(() => {
    if (companyDetail && configs?.headersConfig?.branch) {
      resetPersonalDetails({
        logo_url: companyDetail.logo_url || '',
        name: companyDetail.name || '',
        email: companyDetail.email || '',
        contact: companyDetail.contact || '',
        branch: configs?.headersConfig?.branch || null,
        webUrl: configs?.headersConfig?.companyDetail.webUrl || '',
      });
    }
  }, [companyDetail, configs, resetPersonalDetails]);

  const onSubmitPersonalDetails = async (data) => {
    setLoading(true);
    const payload = {
      name: data.name,
      email: data.email,
      contact: data.contact,
      branch: data.branch,
      webUrl: data.webUrl
    };

    const details = {
      companyDetail: {
        name: data.name,
        email: data.email,
        contact: data.contact,
        webUrl:data.webUrl
      },
      branch: data.branch,
    };
    const payload2 = { ...configs, headersConfig: details };
    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}`;
    const URL2 = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    setLoading(true);

    try {
      await axios.put(URL, payload);
      await axios.put(URL2, payload2);
      companyMutate();
      mutate()
      enqueueSnackbar('Personal details updated successfully', { variant: 'success' });
      setLoading(false);
    } catch (err) {
      console.error('Update error:', err);
      enqueueSnackbar(err.response?.data?.message || 'An error occurred', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };
  const onSubmitBankDetails = async (data) => {
    setLoading2(true);
    const newBankAccount = {
      accountNumber: data.accountNumber,
      accountType: data.accountType,
      accountHolderName: data.accountHolderName,
      bankName: data.bankName,
      IFSC: data.IFSC,
      branchName: data.branchName,
    };

    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}`;

    try {
      const response = await axios.get(URL);
      const existingBankAccounts = response.data.data.bankAccounts || [];

      if (editingBankDetail) {
        const updatedBankAccounts = existingBankAccounts.map(account =>
          account._id === editingBankDetail._id ? newBankAccount : account,
        );
        await axios.put(URL, { bankAccounts: updatedBankAccounts });
      } else {
        const updatedBankAccounts = [...existingBankAccounts, newBankAccount];
        await axios.put(URL, { bankAccounts: updatedBankAccounts });
      }
      companyMutate();
      enqueueSnackbar(editingBankDetail ? 'Bank details updated successfully' : 'Bank details added successfully', { variant: 'success' });
      resetBankDetails();
      setEditingBankDetail(null);
    } catch (err) {
      console.error('Update error:', err);
      enqueueSnackbar(err.response?.data?.message || 'An error occurred', { variant: 'error' });
    } finally {
      setLoading2(false);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setProfilePic(file);
        personalDetailsMethods.setValue('logo_url', newFile, { shouldValidate: true });
        if (companyDetail) {
          const formData = new FormData();
          formData.append('company-logo', file);
          dispatch(updateConfigs({ companyId: user.company, payload: formData }));
        }
      }
    },
    [personalDetailsMethods],
  );

  const handleEditBankDetail = (detail) => {
    setEditingBankDetail(detail);
    bankDetailsMethods.setValue('accountNumber', detail.accountNumber || '');
    bankDetailsMethods.setValue('accountType', detail.accountType || '');
    bankDetailsMethods.setValue('accountHolderName', detail.accountHolderName || '');
    bankDetailsMethods.setValue('bankName', detail.bankName || '');
    bankDetailsMethods.setValue('IFSC', detail.IFSC || '');
    bankDetailsMethods.setValue('branchName', detail.branchName || '');
  };

  const handleDeleteBankDetail = async (detail) => {
    setLoading2(true);
    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}`;
    try {
      const response = await axios.get(URL);
      const existingBankAccounts = response.data.data.bankAccounts || [];

      const updatedBankAccounts = existingBankAccounts.filter(account => account._id !== detail._id);

      await axios.put(URL, { bankAccounts: updatedBankAccounts });

      companyMutate();

      enqueueSnackbar('Bank details deleted successfully', { variant: 'success' });
    } catch (err) {
      console.error('Delete error:', err);
      enqueueSnackbar(err.response?.data?.message || 'An error occurred', { variant: 'error' });
    } finally {
      setLoading2(false);
    }
  };

  return (
    <>
      <FormProvider methods={personalDetailsMethods}>
        <Grid container spacing={3}>
          <Grid item md={4} xs={12}>
            <Card sx={{ pt: 5, px: 3 }}>
              <Box sx={{ mb: 5 }}>
                <RHFUploadAvatar name='logo_url' onDrop={handleDrop} />
              </Box>
            </Card>
          </Grid>

          <Grid item sx={{ my: 'auto' }} xs={12} md={8}>
            <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 600 }}>

              Company Details
            </Typography>
            <Card>
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
                  <RHFTextField name='name' label='Company Name' />
                  <RHFTextField name='email' label='Email Address' />
                  <RHFTextField name='contact' label='Phone Number'
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }} />
                  <RHFAutocomplete
                    name='branch'
                    label='Branch'
                    fullWidth
                    options={branch?.map((item) => item)}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {option.name}
                      </li>
                    )}
                  />
                  <RHFTextField name='webUrl' label='Website url' />
                </Box>
              </Stack>
            </Card>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton onClick={handleSubmitPersonalDetails(onSubmitPersonalDetails)} variant='contained'
                             loading={loading}>
                Save Personal Details
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </FormProvider>

      <FormProvider methods={bankDetailsMethods}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 600, px: 3 }}>
              Bank Details
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary', px: 3 }}>
              Bank info...
            </Typography>
          </Grid>
          <Grid item md={4} xs={12}>
            <Box sx={{ width: '100%', maxWidth: '600px', marginBottom: '10px', padding: '10px' }}>
              <Box display='flex' flexDirection='column' gap={2}>
                <RHFTextField
                  name='accountNumber'
                  label='Account Number'
                  inputProps={{ inputMode: 'numeric' }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  }}
                  rules={{
                    required: 'Account Number is required',
                    pattern: {
                      value: /^[0-9]*$/,
                      message: 'Only numeric values are allowed',
                    },
                  }}
                />
                <RHFAutocomplete
                  name='accountType'
                  label='Account Type'
                  options={ACCOUNT_TYPE_OPTIONS}
                  isOptionEqualToValue={(option, value) => option === value}
                />
                <RHFTextField name='accountHolderName' label='Account Holder Name' />
                <RHFTextField name='bankName' label='Bank Name' />
                <RHFTextField
                  name='IFSC'
                  label='IFSC Code'
                  inputProps={{
                    style: { textTransform: 'uppercase' },
                  }}
                />

                <RHFTextField name='branchName' label='Branch Name' />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'end' }}>
                  <LoadingButton onClick={handleSubmitBankDetails(onSubmitBankDetails)} variant='contained'
                                 loading={loading2}>
                    {editingBankDetail ? 'Update Bank Details' : 'Add Bank Details'}
                  </LoadingButton>
                  <LoadingButton
                    sx={{ margin: '0px 5px' }}
                    variant='contained'
                    onClick={() => resetBankDetails()}
                    disabled={loading2}
                  >
                    Reset
                  </LoadingButton>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={8}>
            {companyDetail?.bankAccounts?.map((account) => (
              <Card sx={{ margin: '10px 0px' }} key={account._id}>
                <Stack sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                      {account.bankName} ({account.accountType})
                    </Typography>
                    <Box>
                      <IconButton onClick={() => handleEditBankDetail(account)}>
                        <Iconify icon={'eva:edit-fill'} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteBankDetail(account)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant='body2'>{account.IFSC}</Typography>
                  </Box>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
