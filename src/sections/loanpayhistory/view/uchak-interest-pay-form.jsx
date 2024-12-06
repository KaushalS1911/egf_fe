import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, Typography } from '@mui/material';
import FormProvider, { RHFAutocomplete, RHFTextField } from '../../../components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useGetBranch } from '../../../api/branch';
import RHFDatePicker from '../../../components/hook-form/rhf-.date-picker';

function UchakInterestPayForm({ currentLoan, mutate }) {
  const { branch } = useGetBranch();
  const [paymentMode, setPaymentMode] = useState('');

  const paymentSchema = paymentMode === 'Bank' ? {
    account: Yup.object().required('Account is required'),
    bankAmount: Yup.string()
      .required('Bank Amount is required')
      .test('is-positive', 'Bank Amount must be a positive number', value => parseFloat(value) >= 0),
  } : paymentMode === 'Cash' ? {
    cashAmount: Yup.string()
      .required('Cash Amount is required')
      .test('is-positive', 'Cash Amount must be a positive number', value => parseFloat(value) >= 0),

  } : {
    cashAmount: Yup.string()
      .required('Cash Amount is required')
      .test('is-positive', 'Cash Amount must be a positive number', value => parseFloat(value) >= 0),

    bankAmount: Yup.string()
      .required('Bank Amount is required')
      .test('is-positive', 'Bank Amount must be a positive number', value => parseFloat(value) >= 0),
    account: Yup.object().required('Account is required'),
  };

  const NewUchakSchema = Yup.object().shape({
    uchakPayDate: Yup.date().nullable().required('Uchak Pay date is required'),
    uchakInterestAmount: Yup.number()
      .min(1, 'Uchak Interest Pay Amount must be greater than 0')
      .required('Uchak Interest Pay Amount is required')
      .typeError('Uchak Interest Pay Amount must be a number'),
    paymentMode: Yup.string().required('Payment Mode is required'),
    ...paymentSchema,
  });

  const defaultValues = {
    uchakPayDate: new Date(),
    uchakInterestAmount: null,
    remark: '',
    paymentMode: '',
    cashAmount: '',
    bankAmount: null,
    account: null,
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

  useEffect(() => {
    if (watch('paymentMode')) {
      setPaymentMode(watch('paymentMode'));
    }
  }, [watch('paymentMode')]);

  const onSubmit = handleSubmit(async (data) => {
    let paymentDetail = {
      paymentMode: data.paymentMode,
    };

    if (data.paymentMode === 'Cash') {
      paymentDetail = {
        ...paymentDetail,
        cashAmount: data.cashAmount,
      };
    } else if (data.paymentMode === 'Bank') {
      paymentDetail = {
        ...paymentDetail,
        ...data.account,
        bankAmount: data.bankAmount,
      };
    } else if (data.paymentMode === 'Both') {
      paymentDetail = {
        ...paymentDetail,
        cashAmount: data.cashAmount,
        ...data.account,
        bankAmount: data.bankAmount,
      };
    }

    const payload = {
      remark: data.remark,
      date: data.uchakPayDate,
      amountPaid: data.uchakInterestAmount,
      paymentDetail: paymentDetail,
    };
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/loans/${currentLoan._id}/uchak-interest-payment`;

      const config = {
        method: 'post',
        url,
        data: payload,
      };

      const response = await axios(config);
      reset();
      mutate();
      enqueueSnackbar(response?.data.message, { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to uchak interest pay', { variant: 'error' });
    }
  });

  const handleCashAmountChange = (event) => {
    const newCashAmount = parseFloat(event.target.value) || '';
    const currentLoanAmount = parseFloat(watch('uchakInterestAmount')) || '';

    if (newCashAmount > currentLoanAmount) {
      setValue('cashAmount', currentLoanAmount);
      enqueueSnackbar('Cash amount cannot be greater than the loan amount.', { variant: 'warning' });
    } else {
      setValue('cashAmount', newCashAmount);
    }
    if (watch('paymentMode') === 'Both') {
      const calculatedBankAmount = currentLoanAmount - newCashAmount;
      setValue('bankAmount', calculatedBankAmount >= 0 ? calculatedBankAmount : '');
    }
  };

  const handleLoanAmountChange = (event) => {
    const newLoanAmount = parseFloat(event.target.value) || '';
    setValue('loanAmount', newLoanAmount);
    const paymentMode = watch('paymentMode');

    if (paymentMode === 'Cash') {
      setValue('cashAmount', newLoanAmount);
      setValue('bankAmount', 0);
    } else if (paymentMode === 'Bank') {
      setValue('bankAmount', newLoanAmount);
      setValue('cashAmount', 0);
    } else if (paymentMode === 'Both') {
      setValue('cashAmount', newLoanAmount);
      setValue('bankAmount', 0);
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container rowSpacing={3} sx={{ p: 3 }} columnSpacing={2}>
          <Grid item xs={4}>
            <RHFDatePicker
              name='uchakPayDate'
              control={control}
              label='Uchak Pay date'
              req={'red'}
            />
          </Grid>
          <Grid item xs={4}>
            <RHFTextField name='uchakInterestAmount' label='Uchak Interest Amount' req={'red'} onKeyPress={(e) => {
              if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                e.preventDefault();
              }
            }} />
          </Grid>
          <Grid item xs={4}>
            <RHFTextField name='remark' label='Remark' />
          </Grid>
          <Grid item xs={4}>
            <Typography variant='h6' sx={{ mt: 5, mb: 2 }}>
              Payment Details
            </Typography>
            <RHFAutocomplete
              name='paymentMode'
              label='Payment Mode'
              req='red'
              options={['Cash', 'Bank', 'Both']}
              getOptionLabel={(option) => option}
              onChange={(event, value) => {
                setValue('paymentMode', value);
                handleLoanAmountChange({ target: { value: watch('uchakInterestAmount') } });
              }}
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
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              }}>
              <Controller
                name='cashAmount'
                control={control}
                render={({ field }) => (
                  <RHFTextField
                    {...field}
                    label='Cash Amount'
                    req={'red'}
                    type='number'
                    inputProps={{ min: 0 }}
                    onChange={(e) => {
                      field.onChange(e);
                      handleCashAmountChange(e);
                    }}
                  />
                )}
              />
            </Box>
          )}
          {(watch('paymentMode') === 'Bank' || watch('paymentMode') === 'Both') && (
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
              sx={{ mt: 3 }}
            >
              <Box>
                <RHFAutocomplete
                  name='account'
                  label='Account'
                  req={'red'}
                  fullWidth
                  options={branch.flatMap((item) => item.company.bankAccounts)}
                  getOptionLabel={(option) => option.bankName || ''}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id || option.bankName}>
                      {option.bankName}
                    </li>
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box>
              <Box>
                <Controller
                  name='bankAmount'
                  control={control}
                  render={({ field }) => (
                    <RHFTextField
                      {...field}
                      label='Bank Amount'
                      req={'red'}
                      disabled={watch('paymentMode') === 'Bank' ? false : true}
                      type='number'
                      inputProps={{ min: 0 }}
                    />
                  )}
                />
              </Box>
            </Box>
          )}
        </Box>
        <Box xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
          <Button color='inherit' sx={{ margin: '0px 10px', height: '36px' }}
                  variant='outlined' onClick={() => reset()}>Reset</Button>
          <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Box>
      </FormProvider>
    </>
  );
}

export default UchakInterestPayForm;
