import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {  useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFAutocomplete, RHFSwitch,
  RHFTextField,
} from 'src/components/hook-form';
import axios from 'axios';
import { useAuthContext } from '../../auth/hooks';
import { useGetConfigs } from '../../api/config';

// ----------------------------------------------------------------------

export default function SchemeNewEditForm({ currentScheme }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();


  const NewSchema = Yup.object().shape({
    name: Yup.string().required('Scheme Name is required'),
    interestRate: Yup.number()
      .required('Interest Rate is required')
      .typeError('Interest Rate must be a number')
      .positive('Interest Rate must be greater than zero'),
    interestPeriod: Yup.string().required('Interest Period is required'),
    schemeType: Yup.string().required('Scheme Type is required'),
    valuation: Yup.number()
      .required('valuation is required')
      .typeError('valuation must be a number')
      .positive('valuation must be greater than zero') ,
    minLoanTime: Yup.number()
      .typeError('Minimum Loan Time must be a number')
      .required('Minimum Loan Time is required')
      .positive('Minimum Loan Time be greater than zero'),
    renewalTime: Yup.string().required('Renewal Time is required'),
    ratePerGram: Yup.number().required('Rate per Gram is required'),
  });

  const defaultValues = useMemo(
    () => (
      {
        name: currentScheme?.name || '',
        ratePerGram: currentScheme?.ratePerGram || 0,
        interestRate: currentScheme?.interestRate || 0,
        interestPeriod: currentScheme?.interestPeriod || '',
        schemeType: currentScheme?.schemeType || '',
        valuation: currentScheme?.valuation || '',
        renewalTime: currentScheme?.renewalTime || '',
        minLoanTime: currentScheme?.minLoanTime || '',
        remark: currentScheme?.remark || '',
        isActive: currentScheme?.isActive || '',
      }),
    [currentScheme],
  );

  const methods = useForm({
    resolver: yupResolver(NewSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;
  useEffect(() => {
    const interestRate = watch('interestRate');
    if (interestRate) {
      const rpg = (configs.goldRate * interestRate) / 100;
      setValue('ratePerGram', rpg);
    } else {
      setValue('ratePerGram', 0);
    }
  }, [watch('interestRate'), configs.goldRate, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentScheme) {
        const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/${user?.company}/scheme/${currentScheme._id}?branch=66ea5ebb0f0bdc8062c13a64`, data);
        router.push(paths.dashboard.scheme.list);
        enqueueSnackbar(res?.data.message);
        reset();
      } else {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/${user?.company}/scheme/?branch=66ea5ebb0f0bdc8062c13a64`, data);
        router.push(paths.dashboard.scheme.list);
        enqueueSnackbar(res?.data.message);
        reset();
      }
    } catch (error) {
      enqueueSnackbar(currentScheme ? 'Failed To update scheme' : 'Failed to create Scheme', { variant: 'error' });
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Scheme Info
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
              <RHFTextField name='name' label='Scheme Name' req={'red'} />
              <RHFTextField
                name='interestRate'
                label='Interest Rate'
                req={'red'}
                onKeyPress={(e) => {
                  if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                    e.preventDefault();
                  }
                }}
              />
              <RHFAutocomplete
                name='interestPeriod'
                label='interestPeriod'
                req={'red'}
                fullWidth
                options={['Monthly', '3 Months', '6 Months', '9 Months', 'Yearly']}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              <RHFAutocomplete
                name='schemeType'
                label='Scheme Type'
                req={'red'}
                fullWidth
                options={['Limited', 'Regular']}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              <RHFTextField
                name='valuation'
                label='Valuation %'
                req={'red'}
                onKeyPress={(e) => {
                  if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                    e.preventDefault();
                  }
                }}
              />

              <RHFAutocomplete
                name='renewalTime'
                label='Renewal Time'
                req={'red'}
                fullWidth
                options={['Monthly', '3 Months', '6 Months', '9 Months', 'Yearly']}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              <RHFAutocomplete
                name='minLoanTime'
                label='Minimum Loan Time '
                req={'red'}
                fullWidth
                options={[10, 45, 60]}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              <RHFTextField name='ratePerGram' label='Rate Per Gram' req={'red'} InputProps={{ readOnly: true }} />
              <RHFTextField name='remark' label='Remark' />

            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              {
                currentScheme &&
                <RHFSwitch name='isActive' label={'is Active'} sx={{ m: 0 }} />
              }

            </Box>
          </Card>
          <Stack alignItems='flex-end' sx={{ mt: 3 }}>
            <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
              {currentScheme ? 'Save Changes' : 'Create Scheme'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
SchemeNewEditForm.propTypes = {
  currentScheme: PropTypes.object,
};
