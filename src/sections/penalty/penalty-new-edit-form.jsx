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

export default function PenaltyNewEditForm({ currentPenalty }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();


  const NewPenalty = Yup.object().shape({
    afterDueDateFromDate: Yup.number()
      .required('After Due Date From Date is required')
      .typeError('After Due Date From Date must be a number')
      .positive('After Due Date From Date must be greater than zero') ,
    afterDueDateToDate: Yup.number()
      .required('After Due Date To Date is required')
      .typeError('After Due Date To Date must be a number')
      .positive('After Due Date To Date must be greater than zero') ,
  });

  const defaultValues = useMemo(
    () => (

      {
        penaltyCode: currentPenalty?.penaltyCode || '',
        afterDueDateFromDate: currentPenalty?.afterDueDateFromDate || '',
        afterDueDateToDate: currentPenalty?.afterDueDateToDate || '',
        penaltyInterest: currentPenalty?. penaltyInterest || '',
        remark: currentPenalty?.remark || '',
        isActive: currentPenalty?.isActive || '',
      }),
    [currentPenalty],
  );

  const methods = useForm({
    resolver: yupResolver(NewPenalty),
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
      if (currentPenalty) {
        const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/${user?.company}/penalty/${currentPenalty._id}?branch=66ea5ebb0f0bdc8062c13a64`, data)
          router.push(paths.dashboard.penalty.list);
          enqueueSnackbar(res?.data.message);
          reset();
      } else {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/${user?.company}/penalty/?branch=66ea5ebb0f0bdc8062c13a64`, data)
          router.push(paths.dashboard.penalty.list);
          enqueueSnackbar(res?.data.message);
          reset();
      }
    } catch (error) {
      enqueueSnackbar(currentPenalty ? 'Failed To Edit penalty' :'Failed to create penalty');
      console.error(error);
    }
  });
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Penalty Info
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
              <RHFTextField name='afterDueDateFromDate' label='afterDueDateFromDate' req={'red'} />
              <RHFTextField name='afterDueDateToDate' label='afterDueDateToDate' req={'red'} />
              <RHFTextField name='penaltyInterest' label='Penalty Interest' req={'red'} />
              <RHFTextField name='remark' label='Remark' />
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              {
                currentPenalty &&
              <RHFSwitch name='isActive' label={'is Active'} sx={{ m: 0 }} />
              }

            </Box>
          </Card>
          <Stack alignItems='flex-end' sx={{ mt: 3 }}>
            <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
              {currentPenalty ? 'Save Changes' : 'Create Penalty'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

PenaltyNewEditForm.propTypes = {
  currentScheme: PropTypes.object,
};