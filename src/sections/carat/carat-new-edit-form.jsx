import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField } from 'src/components/hook-form';
import axios from 'axios';
import { useAuthContext } from '../../auth/hooks';
import { Button } from '@mui/material';

// ----------------------------------------------------------------------

export default function CaratNewEditForm({ currentCarat }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const NewCarat = Yup.object().shape({
    name: Yup.string().required('Scheme Name is required'),
    caratPercentage: Yup.string().required('Carat Percentagee is required'),
  });

  const defaultValues = useMemo(
    () => (
      {
        name: currentCarat?.name || '',
        caratPercentage: currentCarat?.caratPercentage || '',
        remark: currentCarat?.remark || '',
        isActive: currentCarat?.isActive || '',
      }),
    [currentCarat],
  );

  const methods = useForm({
    resolver: yupResolver(NewCarat),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentCarat) {
        const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/${user?.company}/carat/${currentCarat._id}?branch=66ea5ebb0f0bdc8062c13a64`, data);
        router.push(paths.dashboard.carat.list);
        enqueueSnackbar(res?.data.message);
        reset();
      } else {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/${user?.company}/carat/?branch=66ea5ebb0f0bdc8062c13a64`, data);
        router.push(paths.dashboard.carat.list);
        enqueueSnackbar(res?.data.message);
        reset();
      }
    } catch (error) {
      enqueueSnackbar(currentCarat ? 'Failed To update Carat' : error.response.data.message, { variant: 'error' });
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Typography variant='subtitle1' sx={{ mb: 0.5, fontWeight: '600' }}>
            Carat Info
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
              <RHFTextField name='name' label='carat' req={'red'}
                            onKeyPress={(e) => {
                              if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                                e.preventDefault();
                              }
                            }}
              />
              <RHFTextField name='caratPercentage' label='Carat%' req={'red'} onKeyPress={(e) => {
                if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                  e.preventDefault();
                }
              }} />
              <RHFTextField name='remark' label='Remark' />
            </Box>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              {
                currentCarat &&
                <RHFSwitch name='isActive' label={'is Active'} sx={{ m: 0 }} />
              }
            </Box>
          </Card>
          <Box xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
            <Button color='inherit' sx={{ margin: '0px 10px', height: '36px' }}
                    variant='outlined' onClick={() => reset()}>Reset</Button>
            <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
              {currentCarat ? 'Save' : 'Submit'}
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
CaratNewEditForm.propTypes = {
  currentScheme: PropTypes.object,
};
