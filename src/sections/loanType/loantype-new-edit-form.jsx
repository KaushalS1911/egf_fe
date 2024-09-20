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

export default function LoantypeNewEditForm({ currentLoan }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();


  const NewLoan = Yup.object().shape({
    loanType: Yup.string().required('loanType is required'),
  });

  const defaultValues = useMemo(
    () => (

      {
        loanType: currentLoan?.loanType || '',
        remark: currentLoan?.remark || '',
        isActive: currentLoan?.isActive || '',
      }),
    [currentLoan],
  );

  const methods = useForm({
    resolver: yupResolver(NewLoan),
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
      if (currentLoan) {
        const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/${user?.company}/loan/${currentLoan._id}?branch=66ea5ebb0f0bdc8062c13a64`, data)
          router.push(paths.dashboard.loan.list);
          enqueueSnackbar(res?.data.message);
          reset();
      } else {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/${user?.company}/loan/?branch=66ea5ebb0f0bdc8062c13a64`, data)
          router.push(paths.dashboard.loan.list);
          enqueueSnackbar(res?.data.message);
          reset();
      }
    } catch (error) {
      enqueueSnackbar(currentLoan ? 'Failed To Edit Loan Type' :'Failed to create Loan Type');
      console.error(error);
    }
  });
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Lon Type Info
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
              <RHFTextField name='loanType' label='loan' req={'red'} />
              <RHFTextField name='remark' label='Remark' />
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              {
               currentLoan &&
              <RHFSwitch name='isActive' label={'is Active'} sx={{ m: 0 }} />
              }

            </Box>
          </Card>
          <Stack alignItems='flex-end' sx={{ mt: 3 }}>
            <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
              {currentLoan ? 'Save Changes' : 'Add Loan Type'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

LoantypeNewEditForm.propTypes = {
  currentLoan: PropTypes.object,
};
