import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Card, CardHeader, Grid, Typography, IconButton } from '@mui/material';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { Stack } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { RHFAutocomplete, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useResponsive } from '../../../hooks/use-responsive';
import Iconify from 'src/components/iconify';
import { useGetCompanyDetails } from '../../../api/company_details';
import { ACCOUNT_TYPE_OPTIONS } from '../../../_mock';

const validationSchema = yup.object().shape({
  logo_url: yup.mixed().required('Logo is required'),
  name: yup.string().required('Company Name is required'),
  email: yup.string().email('Invalid email address').required('Email Address is required'),
  contact: yup.string().required('Phone Number is required'),
  accountNumber: yup.string().required('Account Number is required'),
  accountType: yup.string().required('Account Type is required'),
  accountHolderName: yup.string().required('Account Holder Name is required'),
  bankName: yup.string().required('Bank Name is required'),
  IFSC: yup.string().required('IFSC Code is required'),
  branchName: yup.string().required('Branch Name is required'),
});

export default function CompanyProfile() {
  const { user } = useAuthContext();
  const { companyDetail, mutate } = useGetCompanyDetails();
  const [profilePic, setProfilePic] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const mdUp = useResponsive('up', 'md');
  const [loading, setLoading] = useState(false);
  const [editingBankDetail, setEditingBankDetail] = useState(null);

  const defaultValues = useMemo(() => ({
    logo_url: companyDetail?.logo_url || '',
    name: companyDetail?.name || '',
    email: companyDetail?.email || '',
    contact: companyDetail?.contact || '',
    accountNumber: editingBankDetail?.accountNumber || '',
    accountType: editingBankDetail?.accountType || '',
    accountHolderName: editingBankDetail?.accountHolderName || '',
    bankName: editingBankDetail?.bankName || '',
    IFSC: editingBankDetail?.IFSC || '',
    branchName: editingBankDetail?.branchName || '',
  }), [companyDetail, editingBankDetail]);

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { reset, setValue, handleSubmit } = methods;

  useEffect(() => {
    if (companyDetail) {
      reset({
        logo_url: companyDetail.logo_url || '',
        name: companyDetail.name || '',
        email: companyDetail.email || '',
        contact: companyDetail.contact || '',
        accountNumber: editingBankDetail?.accountNumber || '',
        accountType: editingBankDetail?.accountType || '',
        accountHolderName: editingBankDetail?.accountHolderName || '',
        bankName: editingBankDetail?.bankName || '',
        IFSC: editingBankDetail?.IFSC || '',
        branchName: editingBankDetail?.branchName || '',
      });
    }
  }, [companyDetail, editingBankDetail, reset]);

  const onSubmitPersonalDetails = async (data) => {
    setLoading(true);
    const payload = {
      name: data.name,
      email: data.email,
      contact: data.contact,
    };

    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}`;
    try {
      await axios.put(URL, payload);
      mutate();
      enqueueSnackbar('Personal details updated successfully', { variant: 'success' });
    } catch (err) {
      console.error('Update error:', err);
      enqueueSnackbar(err.response?.data?.message || 'An error occurred', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitBankDetails = async (data) => {
    setLoading(true);
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
      mutate();
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
      mutate();
      enqueueSnackbar(editingBankDetail ? 'Bank details updated successfully' : 'Bank details added successfully', { variant: 'success' });
      reset();
      setEditingBankDetail(null);
    } catch (err) {
      console.error('Update error:', err);
      enqueueSnackbar(err.response?.data?.message || 'An error occurred', { variant: 'error' });
    } finally {
      setLoading(false);
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
        setValue('logo_url', newFile, { shouldValidate: true });
      }
    },
    [setValue],
  );

  const handleEditBankDetail = (detail) => {
    setEditingBankDetail(detail);
    setValue('accountNumber', detail.accountNumber || '');
    setValue('accountType', detail.accountType || '');
    setValue('accountHolderName', detail.accountHolderName || '');
    setValue('bankName', detail.bankName || '');
    setValue('IFSC', detail.IFSC || '');
    setValue('branchName', detail.branchName || '');
  };

  const handleDeleteBankDetail = async (detail) => {
    setLoading(true);
    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}`;
    try {
      const response = await axios.get(URL);
      const existingBankAccounts = response.data.data.bankAccounts || [];

      const updatedBankAccounts = existingBankAccounts.filter(account => account._id !== detail._id);

      await axios.put(URL, { bankAccounts: updatedBankAccounts });

      mutate();

      enqueueSnackbar('Bank details deleted successfully', { variant: 'success' });
    } catch (err) {
      console.error('Delete error:', err);
      enqueueSnackbar(err.response?.data?.message || 'An error occurred', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormProvider methods={methods}>
        <Grid container spacing={3}>
          <Grid item md={4} xs={12}>
            <Card sx={{ pt: 5, px: 3 }}>
              <Box sx={{ mb: 5 }}>
                <RHFUploadAvatar name='logo_url' onDrop={handleDrop} />
              </Box>
            </Card>
          </Grid>

          <Grid item sx={{ my: 'auto' }} xs={12} md={8}>
            <Typography variant='h6' sx={{ mb: 0.5 }}>
              Comapany Details
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Basic info, profile pic, role, qualification...
            </Typography>
            <Card>
              {!mdUp && <Typography variant='h6' sx={{ p: 2 }}>Personal Details</Typography>}
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
                  <RHFTextField name='contact' label='Phone Number' />
                </Box>
              </Stack>
            </Card>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton onClick={handleSubmit(onSubmitPersonalDetails)} variant='contained' loading={loading}>
                Save Personal Details
              </LoadingButton>
            </Box>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CardHeader title='Bank Details' />
              <Typography variant='body2' sx={{ color: 'text.secondary', px: 3 }}>
                Bank info...
              </Typography>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box sx={{ width: '100%', maxWidth: '600px', marginBottom: '10px', padding: '10px' }}>
                <Box display='flex' flexDirection='column' gap={2}>
                  <RHFTextField name='accountNumber' label='Account Number' />
                  <RHFAutocomplete
                    name='accountType'
                    label='Account Type'
                    placeholder='Choose Account Type'
                    options={ACCOUNT_TYPE_OPTIONS}
                    isOptionEqualToValue={(option, value) => option === value}
                  />
                  <RHFTextField name='accountHolderName' label='Account Holder Name' />
                  <RHFTextField name='bankName' label='Bank Name' />
                  <RHFTextField name='IFSC' label='IFSC Code' />
                  <RHFTextField name='branchName' label='Branch Name' />
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'end' }}>
                    <LoadingButton onClick={handleSubmit(onSubmitBankDetails)} variant='contained' loading={loading}>
                      {editingBankDetail ? 'Update Bank Details' : 'Add Bank Details'}
                    </LoadingButton>
                    <LoadingButton
                      sx={{ margin: '0px 5px' }}
                      variant='contained'
                      onClick={() => {
                        reset({
                          accountNumber: '',
                          accountType: '',
                          accountHolderName: '',
                          bankName: '',
                          IFSC: '',
                          branchName: '',
                        });
                        setEditingBankDetail(null);
                      }}
                      disabled={loading}
                    >
                      Reset
                    </LoadingButton>
                  </Box>

                </Box>
              </Box>
            </Grid>
            <Grid item xs={8}>
              {companyDetail?.bankAccounts?.map((account) => (
                <Card sx={{ margin: '10px 0px' }}>
                  <Stack sx={{ p: 3 }}>
                    <Box key={account._id}
                         sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant='body2'
                                  sx={{ fontWeight: '600', fontSize: '17px' }}>{account.bankName}({account.accountType})</Typography>
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
        </Grid>
      </FormProvider>
    </>
  );
}