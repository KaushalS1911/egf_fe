import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
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
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentCarat) {
        const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/${user?.company}/carat/${currentCarat._id}?branch=66ea5ebb0f0bdc8062c13a64`, data)
          router.push(paths.dashboard.carat.list);
          enqueueSnackbar(res?.data.message);
          reset();
      } else {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/${user?.company}/carat/?branch=66ea5ebb0f0bdc8062c13a64`, data)
          router.push(paths.dashboard.carat.list);
          enqueueSnackbar(res?.data.message);
          reset();
      }
    } catch (error) {
      enqueueSnackbar(currentCarat ? 'Failed To Edit Carat' :'Failed to create carat',{variant:'error'});
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
              <RHFTextField name='name' label='carat' req={'red'} />
              <RHFTextField name='caratPercentage' label='Carat%' req={'red'} />
              <RHFTextField name='remark' label='Remark' />
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              {
                currentCarat &&
              <RHFSwitch name='isActive' label={'is Active'} sx={{ m: 0 }} />
              }

            </Box>
          </Card>
          <Stack alignItems='flex-end' sx={{ mt: 3 }}>
            <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
              {currentCarat ? 'Save Changes' : 'Create Scheme'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

CaratNewEditForm.propTypes = {
  currentScheme: PropTypes.object,
};
