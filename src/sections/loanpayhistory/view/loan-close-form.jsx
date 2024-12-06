import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormProvider, { RHFAutocomplete, RHFTextField } from '../../../components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { TableHeadCustom } from '../../../components/table';
import { fDate } from '../../../utils/format-time';
import { useAuthContext } from '../../../auth/hooks';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useGetBranch } from '../../../api/branch';
import Button from '@mui/material/Button';

function LoanCloseForm({ currentLoan, mutate }) {
  const { user } = useAuthContext();
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

  const NewLoanCloseSchema = Yup.object().shape({
    totalLoanAmount: Yup.number()
      .min(1, 'Total Loan Amount must be greater than 0')
      .required('Total Loan Amount is required')
      .typeError('Total Loan Amount must be a number'),
    pendingLoanAmount: Yup.number()
      .min(0, 'Pending Loan Amount must be 0 or greater')
      .required('Pending Loan Amount is required')
      .typeError('Pending Loan Amount must be a number'),
    closingCharge: Yup.number()
      .min(0, 'Closing Charge must be 0 or greater')
      .required('Closing Charge is required')
      .typeError('Closing Charge must be a number'),
    paymentMode: Yup.string().required('Payment Mode is required'),
    ...paymentSchema,
  });
  const defaultValues = {
    totalLoanAmount: currentLoan?.loanAmount || '',
    paidLoanAmount: (currentLoan?.loanAmount - currentLoan?.interestLoanAmount) || '',
    pendingLoanAmount: currentLoan?.interestLoanAmount || '',
    closingCharge: '',
    closeRemarks: '',
    paymentMode: '',
    cashAmount: '',
    account: null,
    bankAmount: null,
  };

  const methods = useForm({
    resolver: yupResolver(NewLoanCloseSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;
  useEffect(() => {
    if(watch('paymentMode')){
      setPaymentMode(watch('paymentMode'));
      setValue('paymentMode', watch('paymentMode'));
    }
  },[watch('paymentMode')])

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
        bankAmount: data.bankAmount,
        ...data.account,
      };
    }

    const payload = {
      totalLoanAmount: data.totalLoanAmount,
      closingCharge: data.closingCharge,
      remark: data.remark,
      paymentDetail: paymentDetail,
      closedBy: user._id,
    };
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/loans/${currentLoan._id}/loan-close`;

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
      enqueueSnackbar('Failed to close Loan', { variant: 'error' });
    }
  });
  const handleCashAmountChange = (event) => {
    const newCashAmount = parseFloat(event.target.value) || '';
    const currentLoanAmount = parseFloat(watch('paidLoanAmount')) || '';

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
        <Grid  rowSpacing={3} columnSpacing={2}>
          <Box
            rowGap={3}
            columnGap={2}
            display='grid'
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(5, 1fr)',
            }}
          >
            <RHFTextField name='totalLoanAmount' label='Total Loan Amount' req={'red'} onKeyPress={(e) => {
              if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                e.preventDefault();
              }
            }} />
            <RHFTextField name='paidLoanAmount' label='Paid Loan Amount' InputProps={{ readOnly: true }}/>
            <RHFTextField name='pendingLoanAmount' label='Pending Loan Amount' req={'red'} onKeyPress={(e) => {
              if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                e.preventDefault();
              }
            }} />
            <RHFTextField name='closingCharge' label='Closing Charge' req={'red'} onKeyPress={(e) => {
              if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                e.preventDefault();
              }
            }} />
            <RHFTextField name='closeRemarks' label='Close Remarks' />
          </Box>
        </Grid>
        <Grid>
          <Grid item xs={4}>
            <Typography variant='h6'my={1.5}>

              Payment Details
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(4, 1fr)',
              }}
            >
            <RHFAutocomplete
              name='paymentMode'
              label='Payment Mode'
              req='red'
              options={['Cash', 'Bank', 'Both']}
              getOptionLabel={(option) => option}
              onChange={(event, value) => {
                setValue('paymentMode', value);
                handleLoanAmountChange({ target: { value: watch('paidLoanAmount') } });
              }}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
            />
              {(watch('paymentMode') === 'Cash' || watch('paymentMode') === 'Both') && (

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
              )}
              {(watch('paymentMode') === 'Bank' || watch('paymentMode') === 'Both') && (

                <>
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
                </>
          )}
            </Box>
          </Grid>
        </Grid>
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

export default LoanCloseForm;
