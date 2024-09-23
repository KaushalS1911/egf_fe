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
import { useGetLoan } from '../../api/loantype';

// ----------------------------------------------------------------------

export default function PropertyNewEditForm({ currentProperty }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { loan } = useGetLoan();

  const NewSchemaProperty = Yup.object().shape({
    propertyType: Yup.string().required('Property is required'),
    loanType: Yup.string().required('Loan Type is required'),
    remark: Yup.string(),
  });

  const defaultValues = useMemo(
    () => (
      {
        propertyType: currentProperty?.propertyType || '',
        loanType: currentProperty?.loanType || null,
        remark: currentProperty?.remark || '',
        isActive: currentProperty?.isActive || true,
        isQtyEdit: currentProperty?.isQtyEdit || true,
      }),
    [currentProperty],
  );

  const methods = useForm({
    resolver: yupResolver(NewSchemaProperty),
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
      if (currentProperty) {
        const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/${user?.company}/property/${currentProperty._id}?branch=66ea5ebb0f0bdc8062c13a64`, data);
        router.push(paths.dashboard.property.list);
        enqueueSnackbar(res?.data.message);
        reset();
      } else {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/${user?.company}/property/?branch=66ea5ebb0f0bdc8062c13a64`, data);
        router.push(paths.dashboard.property.list);
        enqueueSnackbar(res?.data.message);
        reset();
      }
    } catch (error) {
      enqueueSnackbar(currentProperty ? 'Failed To Edit Property' : 'Failed to create Property');
      console.error(error);
    }
  });
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Property Info
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
              <RHFTextField name='propertyType' label='Property' req={'red'} />
              <RHFAutocomplete
                name='loanType'
                label='Loan Type'
                options={loan.map((item) => item.loanType)}
                getOptionLabel={(option) => option}
                req={'red'}
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              <RHFTextField name='remark' label='Remark' />
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              {
                currentProperty &&
                <RHFSwitch name='isActive' label={'Is Active'} sx={{ m: 0 }} />
              }

            </Box>
            <RHFSwitch name='isQtyEdit' label={'Is Qty Edit'} sx={{ m: 0 }} />
          </Card>
          <Stack alignItems='flex-end' sx={{ mt: 3 }}>
            <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
              {currentProperty ? 'Save Changes' : 'Create Property'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

PropertyNewEditForm.propTypes = {
  currentProperty: PropTypes.object,
};
