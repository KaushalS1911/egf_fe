import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, IconButton, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
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
import Iconify from '../../../components/iconify';
import { ConfirmDialog } from '../../../components/custom-dialog';
import { usePopover } from '../../../components/custom-popover';
import { useBoolean } from '../../../hooks/use-boolean';

const TABLE_HEAD = [
  { id: 'loanAmount', label: 'Loan Amount' },
  { id: 'payAmount', label: 'Pay Amount' },
  { id: 'intLoanAmount', label: 'INT Loan Amt' },
  { id: 'payDate', label: 'Pay Date' },
  { id: 'entryDate', label: 'Entry Date' },
  { id: 'remarks', label: 'Remarks' },
  { id: 'action', label: 'Action' },
];

function LoanPartPaymentForm({ currentLoan, mutate }) {
  const { branch } = useGetBranch();
  const { partPayment, refetchPartPayment } = useGetAllPartPayment(currentLoan._id);
  const confirm = useBoolean();
  const popover = usePopover();
  const [deleteId, setDeleteId] = useState('');
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
    date: new Date(),
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
      expectPaymentMode: data.expectPaymentMode,
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
      refetchPartPayment();
      mutate();
      reset();
      enqueueSnackbar(response?.data.message);
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    if (watch('paymentMode')) {
      setPaymentMode(watch('paymentMode'));
      setValue('paymentMode', watch('paymentMode'));
    }
  }, [watch('paymentMode')]);

  const handleDeletePartPayment = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/loans/${currentLoan._id}/part-payment/${id}`);
      refetchPartPayment();
      mutate();
      confirm.onFalse();
      enqueueSnackbar((response?.data.message));
    } catch (err) {
      enqueueSnackbar('Failed to pay interest');
    }
  };

  const handleCashAmountChange = (event) => {
    const newCashAmount = parseFloat(event.target.value) || '';
    const currentLoanAmount = parseFloat(watch('amountPaid')) || '';

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

  function intAmtCalculation(loanAmt, IntAmt, index) {
    const totalPartPay = partPayment.reduce((acc, curr, i) => {
      return i <= index ? acc + curr.amountPaid : acc;
    }, 0);
    return loanAmt - totalPartPay;
  }

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{display:'flex' ,gap:4,mb:1.5}}>
          <Typography variant='body1' gutterBottom sx={{ fontWeight: '700' }}>
            Cash Amount : {currentLoan.cashAmount || 0}
          </Typography>
          <Typography variant='body1' gutterBottom sx={{ fontWeight: '700' }}>
            Bank Amount : {currentLoan.bankAmount || 0}
          </Typography>
        </Box>
        <Grid container rowSpacing={3} columnSpacing={2}>
          <Grid item xs={3}>
            <RHFDatePicker
              name='date'
              control={control}
              label='Pay date'
              req={'red'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <RHFTextField name='amountPaid' label='Pay Amount' req='red' fullWidth onKeyPress={(e) => {
              if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                e.preventDefault();
              }
            }} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <RHFTextField name='remark' label='Remark' fullWidth />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <RHFAutocomplete
              name='expectPaymentMode'
              label='Expected Payment Mode'
              req='red'
              options={['Cash', 'Bank', 'Both']}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
            />
          </Grid>


        </Grid>
        <Grid spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant='subtitle1' my={1}>
              Payment Details
            </Typography>
            <Box sx={{display: 'flex', justifyContent: 'space-between',alignItems:'center'}}>
            <Box
              width={"100%"}
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(5, 1fr)',
              }}>

              <RHFAutocomplete
                name='paymentMode'
                label='Payment Mode'
                req='red'
                options={['Cash', 'Bank', 'Both']}
                getOptionLabel={(option) => option}
                onChange={(event, value) => {
                  setValue('paymentMode', value);
                  handleLoanAmountChange({ target: { value: watch('amountPaid') } });
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
            </Box>
          </Grid>
        </Grid>



      </FormProvider>
      <Table sx={{ borderRadius: '8px', overflow: 'hidden', mt: 2.5 }}>
        <TableHeadCustom headLabel={TABLE_HEAD} />
        <TableBody>
          {partPayment.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ whiteSpace: 'nowrap' ,py: 0, px: 1,}}>{row.loan.loanAmount}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' ,py: 0, px: 1,}}>{row.amountPaid}</TableCell>
              <TableCell
                sx={{ whiteSpace: 'nowrap',py: 0, px: 1, }}>{intAmtCalculation(row.loan.loanAmount, row.loan.interestLoanAmount, index)}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap',py: 0, px: 1, }}>{fDate(row.date)}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap',py: 0, px: 1, }}>{fDate(row.createdAt)}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap',py: 0, px: 1, }}>{row.remark}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap',py: 0, px: 1, }}>{
                <IconButton color='error' onClick={() => {
                  confirm.onTrue();
                  popover.onClose();
                  setDeleteId(row?._id);
                }
                }>
                  <Iconify icon='eva:trash-2-outline' />
                </IconButton>
              }
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title='Delete'
        content='Are you sure want to delete?'
        action={
          <Button variant='contained' color='error' onClick={() => handleDeletePartPayment(deleteId)}>
            Delete
          </Button>
        }
      />
    </>
  );
}

export default LoanPartPaymentForm;
