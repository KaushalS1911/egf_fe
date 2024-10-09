import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {  useEffect, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFAutocomplete, RHFSelect, RHFSwitch,
  RHFTextField,
} from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useAuthContext } from '../../auth/hooks';
import { useGetConfigs } from '../../api/config';
import { useGetBranch } from '../../api/branch';
import { useGetScheme } from '../../api/scheme';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function DisburseNewEditForm({ currentDisburse }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const {configs} = useGetConfigs()
  const {branch} = useGetBranch()
  const {scheme,mutate} = useGetScheme()


  const NewDisburse = Yup.object().shape({
    loanNo: Yup.string().required('Loan No is required'),
    customerName: Yup.string().required('Customer Name is required'),
    loanAmount: Yup.string().required('Loan Amount is required'),
    interest: Yup.string().required('Interest is required'),
    schemeName: Yup.string().required('Scheme Name is required'),
    valuation: Yup.string().required('Valuation is required'),
    address: Yup.string().required('Address is required'),
    branch: Yup.string().required('Branch is required'),

    items: Yup.array().of(
      Yup.object().shape({
        propertyName: Yup.string().required('Property Name is required'),
        totalWeight: Yup.string().required('Total Weight is required'),
        loseWeight: Yup.string().required('Lose Weight is required'),
        grossWeight: Yup.string().required('Gross Weight is required'),
        netWeight: Yup.string().required('Net Weight is required'),
        loanApplicableAmount: Yup.string().required('Loan Applicable Amount is required'),
      })
    ),

    netAmount: Yup.string().required('Net Amount is required'),
    PendingAmount: Yup.string().required('Pending Amount is required'),
    PayingAmount: Yup.string().required('Paying Amount is required'),
    accountNumber: Yup.string().required('Account Number is required'),
    transactionID: Yup.string().required('Transaction ID is required'),
    date: Yup.date().required('Date is required'),

  });

  const defaultValues = useMemo(
    () => (

      {
      loanNo: currentDisburse?.loanNo || '',
        customerName: currentDisburse?.customerName || '',
        loanAmount: currentDisburse?.loanAmount || '',
        interest: currentDisburse?.interest || '',
      schemeName: currentDisburse?.schemeName || '',
      valuation: currentDisburse?.valuation || '',
      address: currentDisburse?.address || '',
      branch: currentDisburse?.branch || '' ,
        items: currentDisburse?.items || [
          {
        propertyName: currentDisburse?.propertyName || '' ,
        totalWeight: currentDisburse?.totalWeight || '' ,
        loseWeight: currentDisburse?.loseWeight || '' ,
        grossWeight: currentDisburse?.grossWeight || '' ,
        netWeight: currentDisburse?.netWeight || '' ,
        loanApplicableAmount: currentDisburse?.loanApplicableAmount || '' ,
          },
        ],
        netAmount: currentDisburse?.netAmount || '' ,
        PendingAmount: currentDisburse?.PendingAmount || '' ,
        PayingAmount: currentDisburse?.PayingAmount || '' ,
        accountNumber: currentDisburse?.accountNumber || '' ,
        transactionID: currentDisburse?.transactionID || '' ,
        date: new Date(currentDisburse?.date) || new  Date()
    }),
    [currentDisburse],
  );

  const methods = useForm({
    resolver: yupResolver(NewDisburse),
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });
  const handleRemove = (index) => {
    remove(index);
  }; const handleAdd = () => {
    append({
      propertyName: '' ,
      totalWeight:  '' ,
      loseWeight: '' ,
      grossWeight:  '' ,
      netWeight: '' ,
      loanApplicableAmount:'' ,
    });
  };


  useEffect(() => {
    const interestRate = watch("interestRate");
    if (interestRate) {
      const rpg = (configs.goldRate * interestRate) / 100;
      setValue("ratePerGram", rpg);
    }
    else{
      setValue("ratePerGram", 0);
    }
  }, [watch("interestRate"), configs.goldRate, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentDisburse) {
        // const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/${user?.company}/scheme/${currentDisburse._id}?branch=66ea5ebb0f0bdc8062c13a64`, data)
        // router.push(paths.dashboard.scheme.list);
        // enqueueSnackbar(res?.data.message);
        // reset();
      } else {
        console.log(data);
        // const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/${user?.company}/scheme/?branch=66ea5ebb0f0bdc8062c13a64`, data)
        // router.push(paths.dashboard.scheme.list);
        // enqueueSnackbar(res?.data.message);
        // reset();
      }
    } catch (error) {
      enqueueSnackbar(currentDisburse ? 'Failed To update scheme' :'Failed to create Scheme');
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Loan Disburse
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
              <RHFTextField name='loanNo' label='Loan No' req={'red'} />
              <RHFTextField name='customerName' label='Customer Name' req={'red'} />
              <RHFTextField name='loanAmount' label='Loan Amount' req={'red'} />
              <RHFTextField name='interest' label='Interest' req={'red'} />
              <RHFAutocomplete
                name='schemeName'
                label='Scheme Name'
                req={'red'}
                fullWidth
                options={scheme?.map((item) => item.name)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              <RHFTextField name='address' label='Address' req={'red'} />
              <RHFAutocomplete
                name='branch'
                label='Branch'
                req={'red'}
                fullWidth
                options={branch.map((item)=>item.name)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={4} py={5}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Property Details
          </Typography>
        </Grid>
        <Grid xs={12} md={8} py={5}>
          <Stack alignItems={'end'} mb={1}>
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleAdd}
              sx={{ flexShrink: 0 }}
            >
              Add Item
            </Button>
          </Stack>
                <Card sx={{ p: 3 }}>
                  {fields.map((item, index) => (
                    <div key={item.id}> {/* Add a unique key for each item */}
                      <Box
                        rowGap={3}
                        columnGap={2}
                        display='grid'
                        gridTemplateColumns={{
                          xs: 'repeat(1, 1fr)',
                          sm: 'repeat(2, 1fr)',
                        }}
                      >
                        <RHFTextField name={`items.${index}.propertyName`} label='Property Name' req={'red'} />
                        <RHFTextField name={`items.${index}.totalWeight`} label='Total Weight' req={'red'} />
                        <RHFTextField name={`items.${index}.loseWeight`} label='Lose Weight' req={'red'} />
                        <RHFTextField name={`items.${index}.grossWeight`} label='Gross Weight' req={'red'} />
                        <RHFTextField name={`items.${index}.netWeight`} label='Net Weight' req={'red'} />
                        <RHFTextField name={`items.${index}.loanApplicableAmount`} label='Loan Applicable Amount' req={'red'} />
                      </Box>

                      <Box my={2}>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                          onClick={() => handleRemove(index)}
                        >
                          Remove
                        </Button>
                      </Box>
                    </div>
                  ))}
                </Card>
          </Grid>
        <Grid xs={12} md={4} py={5}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Transaction Type
          </Typography>
        </Grid>
        <Grid xs={12} md={8} py={5}>
          <Card>
            <Stack spacing={3} sx={{ p: 3 }}>
            <Typography my={2} sx={{ display: 'inline-block' }}>
              Bank Account
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name='netAmount' label='Net Amount' req={'red'} />
              <RHFTextField name='PendingAmount' label='Pending Amount' req={'red'} />
              <RHFTextField name='PayingAmount' label='Paying Amount' req={'red'} />
              <RHFTextField name='grossWeight' label='Gross Weight' req={'red'} />
              <RHFAutocomplete
                name='TransactionID'
                label='TransactionID'
                req={'red'}
                fullWidth
                options={scheme?.map((item) => item.name)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />

              <Controller
                name='date'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label='Date'
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />

            </Box>
            </Stack>
            <Stack spacing={3} sx={{ p: 3 }}>
              <Typography my={2} sx={{ display: 'inline-block' }}>
                Cash Amount
              </Typography>
              <Box
                rowGap={3}
                columnGap={2}
                display='grid'
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name='netAmount' label='Net Amount' req={'red'} />
                <RHFTextField name='PendingAmount' label='Pending Amount' req={'red'} />
                <RHFTextField name='PayingAmount' label='Paying Amount' req={'red'} />

                <Controller
                  name='date'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label='Date'
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />

              </Box>
            </Stack>

          </Card>
          <Stack  alignItems="flex-end" sx={{mt:3}}>
            <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
              {currentDisburse ? 'Save Disburse' : 'Create Disburse'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

DisburseNewEditForm.propTypes = {
  currentScheme: PropTypes.object,
};
