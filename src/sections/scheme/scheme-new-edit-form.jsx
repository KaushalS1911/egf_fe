import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
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
  RHFAutocomplete, RHFSwitch,
  RHFTextField,
} from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { countries } from '../../assets/data';
import axios from 'axios';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

// ----------------------------------------------------------------------

export default function SchemeNewEditForm({ currentScheme }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [includeTaxes, setIncludeTaxes] = useState(false);

  const NewSchema = Yup.object().shape({
    schemeName: Yup.string().required('Scheme Name is required'),
    interestRate: Yup.string().required('Interest Rate name is required'),
    interestPeriod: Yup.string().required('Interest Period is required'),
    schemeType: Yup.string().required('Scheme Type is required'),
    valuation: Yup.string().required('Valuation is required'),
    renewalTime: Yup.string().required('Renewal Time field is required'),
    minimumLoanTime: Yup.string().required('Minimum Loan Time field is required'),
    ratePerGram: Yup.string().required('Rate per Gram is required'),
  });

  const defaultValues = useMemo(
    () => ({
      schemeName : currentScheme?.schemeName || '',
      interestRate: currentScheme?.interestRate || '',
      interestPeriod: currentScheme?.interestPeriod || '',
      schemeType: currentScheme?.schemeType || '',
      valuation: currentScheme?.valuation || '',
      renewalTime: currentScheme?.renewalTime || '',
      minimumLoanTime: currentScheme?.minimumLoanTime || '',
      ratePerGram: currentScheme?.ratePerGram || '',
      remark: currentScheme?.remark || '',
      // isActive: currentScheme?.include || true,
    }),
    [currentScheme]
  );
  const methods = useForm({
    resolver: yupResolver(NewSchema),
    defaultValues,
  });
  const handleChangeIncludeTaxes = useCallback((event) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    alert("raam")
    try {
      console.log('DATA', data);
      axios.post("https://egf-be.onrender.com/api/company/66ea4b784993e01af85bcfe3/scheme?branch=66ea5ebb0f0bdc8062c13a64",data).then((res)=> {
        router.push(paths.dashboard.scheme.list);
      enqueueSnackbar( 'Create success!');
      }).catch((err)=>enqueueSnackbar( 'err!'))
      reset();

    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Scheme Info
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
              <RHFTextField name="schemeName" label="Scheme Name" req={"red"}/>
              <RHFTextField name="interestRate" label="Interest Rate" req={"red"}/>
              <RHFAutocomplete
                name="interestPeriod"
                label="interestPeriod"
                req={"red"}
                fullWidth
                options={["fytfu","tfgu","uikhyui","gjytfytf"]}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              <RHFAutocomplete
                name="schemeType"
                label="Scheme Type"
                req={"red"}
                fullWidth
                options={["fytfu","tfgu","uikhyui","gjytfytf"]}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />              <RHFTextField name="valuation" label="Valuation %" req={"red"}/>

              <RHFAutocomplete
                name="renewalTime"
                label="Renewal Time"
                req={"red"}
                fullWidth
                options={["fytfu","tfgu","uikhyui","gjytfytf"]}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              /> <RHFAutocomplete
                name="minimumLoanTime"
                label="Minimum Loan Time "
                req={"red"}
                fullWidth
                options={["fytfu","tfgu","uikhyui","gjytfytf"]}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              <RHFTextField name="ratePerGram" label="Rate Per Gram" req={"red"}/>
              <RHFTextField name="remark" label="Remark"/>

            </Box>

            <Box  sx={{ mt: 3 ,display:"flex",justifyContent:"space-between"}}>
              <RHFSwitch name="isActive" label={"is Active"} sx={{ m: 0 }} />
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentScheme ? 'Create Scheme' : 'Save Changes'}
              </LoadingButton>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

SchemeNewEditForm.propTypes = {
  currentScheme: PropTypes.object,
};
