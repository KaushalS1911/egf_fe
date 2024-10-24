import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  Grid,
  Typography,
  IconButton,
  Switch,
  Divider,
  CardContent,
  Stack,
} from '@mui/material';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { LoadingButton } from '@mui/lab';
import { RHFTextField, RHFAutocomplete, RHFSwitch } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Iconify from 'src/components/iconify';
import countrystatecity from '../../../_mock/map/csc.json';
import { useGetBranch } from '../../../api/branch';

const validationSchema = yup.object().shape({
  name: yup.string().required('Branch Name is required'),
  email: yup.string().email('Invalid email address').nullable(),
  contact: yup.string().nullable(),
  address: yup.object().shape({
    street: yup.string().required('Street is required'),
    landmark: yup.string().required('Landmark is required'),
    country: yup.string().required('Country is required'),
    state: yup.string().required('State is required'),
    city: yup.string().required('City is required'),
    zipcode: yup.string().required('Zipcode is required'),
  }),
  isActive: yup.boolean(),
  branchCode: yup.string().nullable(),
});

export default function BranchCreateView() {
  const { branch, mutate } = useGetBranch();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const defaultValues = useMemo(() => ({
    name: '',
    email: '',
    contact: '',
    address: {
      street: '',
      landmark: '',
      country: 'India',
      state: 'Gujarat',
      city: 'Surat',
      zipcode: '',
    },
    isActive: false,
    branchCode: '',
  }), []);

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { reset, handleSubmit, watch } = methods;

  const onSubmitBranchDetails = async (data) => {
    setLoading(true);

    const payload = {
      company: user?.company,
      name: data.name,
      email: data.email || null,
      contact: data.contact || null,
      address: {
        street: data.address.street,
        landmark: data.address.landmark,
        country: data.address.country,
        state: data.address.state,
        city: data.address.city,
        zipcode: data.address.zipcode,
      },
      isActive: data.isActive,
      ...(editingBranch && { branchCode: data.branchCode || null }),
    };

    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/branch`;

    try {
      if (editingBranch) {
        await axios.put(`${URL}/${editingBranch._id}`, payload);
        enqueueSnackbar('Branch updated successfully', { variant: 'success' });
        mutate();
      } else {
        await axios.post(URL, payload);
        mutate();
        enqueueSnackbar('Branch added successfully', { variant: 'success' });
      }

      reset(defaultValues);
      setEditingBranch(null);
      setLoading(false);
    } catch (error) {
      console.error('Error updating branch:', error);
      enqueueSnackbar('An error occurred while updating branch', { variant: 'error' });
      setLoading(false);
    }
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    reset(branch);
  };

  const handleDeleteBranches = async (ids) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/${user?.company}/branch`, {
        data: { ids: ids },
      });
      enqueueSnackbar(response.data.message);
      mutate();
    } catch (error) {
      enqueueSnackbar(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider methods={methods}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' gutterBottom>
          Manage Branches
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title='Branch Details' />
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name='name' label='Branch Name' fullWidth sx={{ mb: 2 }} />
                </Grid>
                {editingBranch && (
                  <Grid item xs={12} sm={6}>
                    <RHFTextField
                      name='branchCode'
                      label='Branch Code'
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        readOnly: true,
                      }} />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <RHFTextField name='email' label='Email' fullWidth sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name='contact' label='Phone Number' fullWidth sx={{ mb: 2 }}
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFAutocomplete
                    name='address.country'
                    label='Country'
                    placeholder='Choose a country'
                    options={countrystatecity.map((country) => country.name)}
                    isOptionEqualToValue={(option, value) => option === value}
                    sx={{ mb: 2 }}
                    defaultValue='India'
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFAutocomplete
                    name='address.state'
                    label='State'
                    placeholder='Choose a state'
                    options={
                      watch('address.country')
                        ? countrystatecity.find((country) => country.name === watch('address.country'))
                        ?.states.map((state) => state.name) || []
                        : []
                    }
                    isOptionEqualToValue={(option, value) => option === value}
                    sx={{ mb: 2 }}
                    defaultValue='Gujarat'
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFAutocomplete
                    name='address.city'
                    label='City'
                    placeholder='Choose a city'
                    options={
                      watch('address.state')
                        ? countrystatecity.find((country) => country.name === watch('address.country'))
                        ?.states.find((state) => state.name === watch('address.state'))
                        ?.cities.map((city) => city.name) || []
                        : []
                    }
                    isOptionEqualToValue={(option, value) => option === value}
                    sx={{ mb: 2 }}
                    defaultValue='Surat'
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name='address.street' label='Street' fullWidth sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name='address.landmark' label='Landmark' fullWidth sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFTextField
                    name='address.zipcode'
                    label='Zipcode'
                    fullWidth
                    sx={{ mb: 2 }}
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      maxLength: 6,
                    }}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                  />
                </Grid>
                {editingBranch && (
                  <Grid item xs={12}>
                    <RHFSwitch name='isActive' label='Is Active' />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <LoadingButton
                    variant='contained'
                    type='submit'
                    onClick={handleSubmit(onSubmitBranchDetails)}
                    loading={loading}
                  >
                    {editingBranch ? 'Update Branch' : 'Add Branch'}
                  </LoadingButton>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {branch.map((branch) => (
            <Grid item xs={12} md={12} mb={2} key={branch.id} mx={1}>
              <Card>
                <CardHeader
                  title={branch.name}
                  sx={{ mb: 2.5 }}
                  action={
                    <>
                      <IconButton color='primary' onClick={() => handleEditBranch(branch)}>
                        <Iconify icon='eva:edit-fill' />
                      </IconButton>
                      <IconButton color='error' onClick={() => handleDeleteBranches([branch._id])}>
                        <Iconify icon='eva:trash-2-outline' />
                      </IconButton>
                    </>
                  }
                />
                <Divider />
                <Box sx={{ p: 3 }}>
                  <Stack spacing={1.5} sx={{ typography: 'body2' }}>
                    <Stack direction='row' alignItems='center'>
                      <Box component='span' sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
                        Email
                      </Box>
                      {branch.email}
                    </Stack>
                    <Stack direction='row' alignItems='center'>
                      <Box component='span' sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
                        Contact
                      </Box>
                      {branch.contact}
                    </Stack>
                    <Stack direction='row' alignItems='center'>
                      <Box component='span' sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
                        Address
                      </Box>
                      {branch.address.street}, {branch.address.city}, {branch.address.state}, {branch.address.country}, {branch.address.zipcode}
                    </Stack>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Grid>
    </FormProvider>
  );
}
