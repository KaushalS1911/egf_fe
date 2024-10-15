import React from 'react';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormProvider, { RHFAutocomplete, RHFTextField } from '../../../components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { TableHeadCustom } from '../../../components/table';
import { fDate } from '../../../utils/format-time';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useParams } from 'react-router';
import { useGetBranch } from '../../../api/branch';

function UchakInterestPayForm() {
  const { id } = useParams();
  const {branch} = useGetBranch();

  const NewUchakSchema = Yup.object().shape({
    uchakPayDate: Yup.date().nullable().required('Uchak Pay date is required'),
    uchakInterestAmount: Yup.number()
      .min(1, 'Uchak Interest Pay Amount must be greater than 0')
      .required('Uchak Interest Pay Amount is required')
      .typeError('Uchak Interest Pay Amount must be a number'),
    remark: Yup.string().required('Remark is required'),
    paymentMode: Yup.string().required('Payment Mode is required'),
    account: Yup.object().test(
      'accountRequired',
      'Account is required',
      function (value) {
        const { paymentMode } = this.parent;
        return paymentMode !== 'Bank' && paymentMode !== 'Both' ? true : !!value;
      }
    ),

    cashAmount: Yup.string().test(
      'cashAmountRequired',
      'Cash amount is required',
      function (value) {
        const { paymentMode } = this.parent;
        return paymentMode !== 'Cash' && paymentMode !== 'Both' ? true : !!value;
      }
    ),


  });

  const defaultValues = {
    uchakPayDate: null,
    uchakInterestAmount: 0,
    remark: '',
    paymentMode: '',
    cashAmount: '',
    account: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewUchakSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    let paymentDetail = {
      paymentMode: data.paymentMode
    };

    if (data.paymentMode === 'Cash') {
      paymentDetail = {
        ...paymentDetail,
        cashAmount: data.cashAmount,
      };
    } else if (data.paymentMode === 'Bank') {
      paymentDetail = {
        ...paymentDetail,
        ...data.account
      };
    } else if (data.paymentMode === 'Both') {
      paymentDetail = {
        ...paymentDetail,
        cashAmount: data.cashAmount,
        ...data.account
      };
    }

    const payload = {
      remark: data.remark,
      date: data.uchakPayDate,
      amountPaid: data.uchakInterestAmount,
      paymentDetail : paymentDetail,
    }
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/loans/${id}/uchak-interest-payment`;

      const config = {
        method: 'post',
        url,
        data: payload,
      };

      const response = await axios(config);
      reset();
      enqueueSnackbar(response?.data.message, { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to uchak interest pay", { variant: 'error' });
    }
  });
  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container rowSpacing={3} sx={{ p: 3 }} columnSpacing={2}>
        <Grid item xs={4}>
          <Controller
            name='uchakPayDate'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                label='Uchak Pay date'
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message,
                    className: 'req',
                  },
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <RHFTextField name='uchakInterestAmount' label='Uchak Interest Amount' req={'red'} />
        </Grid>
        <Grid item xs={4}>
          <RHFTextField name='remark' label='Remark' req={'red'} />
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' sx={{ mt: 5, mb: 2 }}>
            Payment Details
          </Typography>
          <RHFAutocomplete
            name='paymentMode'
            label='Payment Mode'
            req={'red'}
            options={['Cash', 'Bank','Both']}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
          />
        </Grid>
      </Grid>
        <Box sx={{ p: 3 }}>
          {(watch('paymentMode') === 'Cash' || watch('paymentMode') === 'Both') && (
            <>
              <RHFTextField name='cashAmount' label='Cash Amount' sx={{ width: '25%' }}
                            InputLabelProps={{ shrink: true, readOnly: true }} />
            </>
          )}
          {(watch('paymentMode') === 'Bank' || watch('paymentMode') === 'Both') && (
            <Box sx={{ mt: 8 }}>
              <RHFAutocomplete
                name='account'
                label='Account'
                req={'red'}
                fullWidth
                sx={{width: "25%"}}
                options={branch.flatMap((item) => item.company.bankAccounts)}
                getOptionLabel={(option) => option.bankName || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option.id || option.bankName}>
                    {option.bankName}
                  </li>
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) => {
                  setValue('account', value);
                }}
              />
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
          <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Box>
      </FormProvider>
    </>
  );
}

export default UchakInterestPayForm;
