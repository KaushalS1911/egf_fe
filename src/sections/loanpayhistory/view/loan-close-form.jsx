import React, { useState } from 'react';
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
    bankAmount: Yup.string().required('Bank Account is required'),
  } : paymentMode === 'Cash' ? {
    cashAmount: Yup.string().required('Cash Amount is required'),
  } : {
    cashAmount: Yup.string().required('Cash Amount is required'),
    account: Yup.object().required('Account is required'),
    bankAmount: Yup.string().required('Bank Account is required'),
  };

  const NewLoanCloseSchema = Yup.object().shape({
    totalLoanAmount: Yup.number()
      .min(1, 'Total Loan Amount must be greater than 0')
      .required('Total Loan Amount is required')
      .typeError('Total Loan Amount must be a number'),
    paidLoanAmount: Yup.number()
      .min(1, 'Paid Loan Amount must be greater than 0')
      .required('Paid Loan Amount is required')
      .typeError('Paid Loan Amount must be a number'),
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
      paidLoanAmount: data.amountPaid,
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
  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container rowSpacing={3} columnSpacing={2}>
          <Grid item xs={4}>
            <RHFTextField name='totalLoanAmount' label='Total Loan Amount' req={'red'} />
          </Grid>
          <Grid item xs={4}>
            <RHFTextField name='paidLoanAmount' label='Paid Loan Amount' req={'red'} />
          </Grid>
          <Grid item xs={4}>
            <RHFTextField name='pendingLoanAmount' label='Pending Loan Amount' req={'red'} />
          </Grid>
          <Grid item xs={4}>
            <RHFTextField name='closingCharge' label='Closing Charge' req={'red'} />
          </Grid>
          <Grid item xs={4}>
            <RHFTextField name='closeRemarks' label='Close Remarks' />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={4}>
            <Typography variant='h6' sx={{ mt: 5, mb: 2 }}>
              Payment Details
            </Typography>
            <RHFAutocomplete
              name='paymentMode'
              label='Payment Mode'
              req={'red'}
              options={['Cash', 'Bank', 'Both']}
              onChange={(event, newValue) => {
                setPaymentMode(newValue);
                setValue('paymentMode', newValue);
              }}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 8 }}>
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
              <RHFTextField name='cashAmount' label='Cash Amount' req={'red'} />
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
              sx={{mt : 3}}
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
                  onChange={(event, value) => {
                    setValue('account', value);
                  }}
                />
              </Box>
              <Box>
                <RHFTextField name='bankAmount' label='Bank Amount' req={'red'} />
              </Box>
            </Box>
          )}
        </Box>
        <Box xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end' ,mt:3}}>
          <Button color='inherit' sx={{ margin: '0px 10px',height:"36px"}}
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
