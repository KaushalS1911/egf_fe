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
import { useAuthContext } from '../../../auth/hooks';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

function LoanCloseForm({currentLoan}) {
  const {user} = useAuthContext();
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
    closeRemarks: Yup.string().required('Close Remarks are required'),
    paymentMode: Yup.string().required('Payment Mode is required'),
  });
  const defaultValues = {
    totalLoanAmount: currentLoan?.loanAmount || '',
    paidLoanAmount: (currentLoan?.loanAmount - currentLoan?.interestLoanAmount) || '',
    pendingLoanAmount: currentLoan?.interestLoanAmount || '',
    closingCharge: '',
    closeRemarks: '',
    paymentMode: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewLoanCloseSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
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
        accountName: data.accountName,
        accountNo: data.accountNo,
        accountType: data.accountType,
        IFSC: data.IFSC,
        bankName: data.bankName,
      };
    } else if (data.paymentMode === 'Both') {
      paymentDetail = {
        ...paymentDetail,
        cashAmount: data.cashAmount,
        accountName: data.accountName,
        accountNo: data.accountNo,
        accountType: data.accountType,
        IFSC: data.IFSC,
        bankName: data.bankName,
      };
    }

    const payload = {
      totalLoanAmount: data.totalLoanAmount,
      paidLoanAmount: data.amountPaid,
      closingCharge : data.closingCharge,
      remark: data.remark,
      paymentDetail : paymentDetail,
      closedBy: user._id,
    }
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/loans/${currentLoan._id}/loan-close`;

      const config = {
        method: 'post',
        url,
        data: payload,
      };

      const response = await axios(config);
      reset();
      enqueueSnackbar(response?.data.message);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to close Loan',{variant: "error"});
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
            <RHFTextField name='closeRemarks' label='Close Remarks' req={'red'} />
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
        <Box sx={{ mt: 8}}>
          {(watch('paymentMode') === 'Cash' || watch('paymentMode') === 'Both') && (
            <>
              <RHFTextField name='cashAmount' label='Cash Amount' sx={{ width: '25%' }}
                            InputLabelProps={{ shrink: true, readOnly: true }} />
            </>
          )}
          {(watch('paymentMode') === 'Bank' || watch('paymentMode') === 'Both') && (
            <Grid container sx={{ mt: 8 }}>
              <Grid item xs={12} md={4}>
                <Typography variant='h6' sx={{ mb: 0.5 }}>
                  Bank Account Details
                </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display='grid'
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFTextField name='accountName' label='Account Name' req={'red'} />
                  <RHFTextField name='accountNo' label='Account No.' req={'red'} />
                  <RHFAutocomplete
                    name='accountType'
                    label='Account Type'
                    req={'red'}
                    options={['Saving', 'Current']}
                    getOptionLabel={(option) => option}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {option}
                      </li>
                    )}
                  />
                  <RHFTextField name='IFSC' label='IFSC Code' req={'red'} />
                  <RHFTextField name='bankName' label='Bank Name' req={'red'} />
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
          <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Box>
      </FormProvider>
    </>
  );
}

export default LoanCloseForm;
