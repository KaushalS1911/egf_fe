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
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useParams } from 'react-router';
import { useGetAllPartPayment } from '../../../api/part-payment';
import { useGetBranch } from '../../../api/branch';
import Button from '@mui/material/Button';
import RHFDatePicker from '../../../components/hook-form/rhf-.date-picker';

const TABLE_HEAD = [
  { id: 'loanAmount', label: 'Loan Amount' },
  { id: 'payAmount', label: 'Pay Amount' },
  { id: 'payDate', label: 'Pay Date' },
  { id: 'entryDate', label: 'Entry Date' },
  { id: 'remarks', label: 'Remarks' },
];

function LoanPartPaymentForm({ currentLoan, mutate }) {
  const { branch } = useGetBranch();
  const { partPayment, refetchPartPayment } = useGetAllPartPayment(currentLoan._id);
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

  const NewPartPaymentSchema = Yup.object().shape({
    date: Yup.date().nullable().required('Uchak Pay date is required'),
    expectPaymentMode: Yup.string().required('Expected Payment Mode is required'),
    amountPaid: Yup.number()
      .min(1, 'Uchak Interest Pay Amount must be greater than 0')
      .required('Uchak Interest Pay Amount is required')
      .typeError('Uchak Interest Pay Amount must be a number'),
    paymentMode: Yup.string().required('Payment Mode is required'),
    ...paymentSchema,
  });

  const defaultValues = {
    date: null,
    amountPaid: '',
    remark: '',
    paymentMode: '',
    cashAmount: '',
    account: null,
    bankAmount: null,
    expectPaymentMode: null,
  };

  const methods = useForm({
    resolver: yupResolver(NewPartPaymentSchema),
    defaultValues,
  });

  const {
    control,
    watch,
    reset,
    handleSubmit,
    setValue,
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
      remark: data.remark,
      expectPaymentMode: data.expectPaymentMode,
      date: data.date,
      amountPaid: data.amountPaid,
      paymentDetail: paymentDetail,
    };
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/loans/${currentLoan._id}/part-payment`;

      const config = {
        method: 'post',
        url,
        data: payload,
      };

      const response = await axios(config);
      mutate();
      refetchPartPayment();
      reset();
      enqueueSnackbar(response?.data.message);
    } catch (error) {
      console.error(error);
    }
  });
  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="body1" gutterBottom sx={{fontWeight: "700"}}>
            Cash Amount : {currentLoan.cashAmount || 0}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{fontWeight: "700"}}>
            Bank Amount : {currentLoan.bankAmount || 0}
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ p: { xs: 2, md: 3 } }}>
          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name='date'
        <Grid container rowSpacing={3} sx={{ p: 3 }} columnSpacing={2}>
          <Grid item xs={4}>
            <RHFDatePicker
              name="date"
              control={control}
              label="Pay date"
              req={"red"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <RHFTextField name='amountPaid' label='Pay Amount' req='red' fullWidth />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <RHFTextField name='remark' label='Remark' fullWidth />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <RHFAutocomplete
              name='expectPaymentMode'
              label='Expected Payment Mode'
              req='red'
              options={['Cash', 'Bank', 'Both']}
              onChange={(event, newValue) => {
                setPaymentMode(newValue);
                setValue('expectPaymentMode', newValue);
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
        <Grid container spacing={2} sx={{ p: { xs: 2, md: 3 } }}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant='h6' sx={{ mt: 5, mb: 2 }}>
              Payment Details
            </Typography>
            <RHFAutocomplete
              name='paymentMode'
              label='Payment Mode'
              req='red'
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
        <Box sx={{ p: 3 }}>
          {(watch('paymentMode') === 'Cash' || watch('paymentMode') === 'Both') && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <RHFTextField name='cashAmount' label='Cash Amount' req='red' fullWidth />
              </Grid>
            </Grid>
          )}

          {(watch('paymentMode') === 'Bank' || watch('paymentMode') === 'Both') && (
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12} sm={6} md={4}>
                <RHFAutocomplete
                  name='account'
                  label='Account'
                  req='red'
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
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <RHFTextField name='bankAmount' label='Bank Amount' req='red' fullWidth />
              </Grid>
            </Grid>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            color='inherit'
            sx={{ margin: '0px 10px', height: '36px' }}
            variant='outlined'
            onClick={() => reset()}
          >
            Reset
          </Button>
          <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Box>
      </FormProvider>
      <Table sx={{ borderRadius: '8px', overflow: 'hidden', mt: 8 }}>
        <TableHeadCustom headLabel={TABLE_HEAD} />
        <TableBody>
          {partPayment.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.loan.loanAmount}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.amountPaid}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.date)}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.createdAt)}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.remark}</TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
    </>
  );
}

export default LoanPartPaymentForm;
