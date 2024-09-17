import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
} from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// ----------------------------------------------------------------------

export default function InquiryNewEditForm({ currentInquiry }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    contact: Yup.string().required('Contact is required'),
    email: Yup.string().email('Email must be valid').required('Email is required'),
    date: Yup.string().required('Date is required'),
    inquiryFor: Yup.string().required('Inquiry field is required'),
    other: Yup.string().required('Other field is required'),
    remark: Yup.string().required('Remark is required'),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: currentInquiry?.firstName || '',
      lastName: currentInquiry?.lastName || '',
      contact: currentInquiry?.contact || '',
      email: currentInquiry?.email || '',
      date: currentInquiry?.date || '',
      inquiryFor: currentInquiry?.inquiryFor || '',
      other: currentInquiry?.other || '',
      remark: currentInquiry?.remark || ''
    }),
    [currentInquiry]
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
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentInquiry ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.inquiry.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Inquiry Details
          </Typography>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="firstName" label="First Name" req={"red"}/>
              <RHFTextField name="lastName" label="Last Name" req={"red"}/>
              <RHFTextField name="contact" label="Mobile No." req={"red"}/>
              <RHFTextField name="email" label="Email" req={"red"}/>

              <Controller
                name="date"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Date"
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                        className: `req`,
                      },
                    }}
                  />
                )}
              />

              <RHFTextField name="inquiryFor" label="Inquiry For" req={"red"}/>
              <RHFTextField name="other" label="Other" req={"red"}/>
              <RHFTextField name="remark" label="Remark" req={"red"}/>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentInquiry ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

InquiryNewEditForm.propTypes = {
  currentInquiry: PropTypes.object,
};
