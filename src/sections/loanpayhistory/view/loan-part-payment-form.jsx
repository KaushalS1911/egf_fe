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
import { useGetAllPartPayment } from '../../../api/part-payment';
const TABLE_HEAD = [
  { id: 'loanAmount', label: 'Loan Amount' },
  { id: 'payAmount', label: 'Pay Amount' },
  { id: 'payDate', label: 'Pay Date' },
  { id: 'entryDate', label: 'Entry Date' },
  { id: 'remarks', label: 'Remarks' },
];

function LoanPartPaymentForm() {
  const {id} = useParams()
  const { partPayment , mutate} = useGetAllPartPayment(id);
  console.log("as",partPayment)
  const NewPartPaymentSchema = Yup.object().shape({
    date: Yup.date().nullable().required('Uchak Pay date is required'),
    amountPaid: Yup.number()
      .min(1, 'Uchak Interest Pay Amount must be greater than 0')
      .required('Uchak Interest Pay Amount is required')
      .typeError('Uchak Interest Pay Amount must be a number'),
    remark: Yup.string().required('Remark is required'),
    paymentMode: Yup.string().required('Payment Mode is required'),
    accountName: Yup.string().test(
      'accountNameRequired',
      'Account name is required',
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

    accountNo: Yup.string().test(
      'accountNoRequired',
      'Account number is required',
      function (value) {
        const { paymentMode } = this.parent;
        return paymentMode !== 'Bank' && paymentMode !== 'Both' ? true : !!value;
      }
    ),

    accountType: Yup.string().test(
      'accountTypeRequired',
      'Account type is required',
      function (value) {
        const { paymentMode } = this.parent;
        return paymentMode !== 'Bank' && paymentMode !== 'Both' ? true : !!value;
      }
    ),

    IFSC: Yup.string().test(
      'ifscRequired',
      'IFSC code is required',
      function (value) {
        const { paymentMode } = this.parent;
        return paymentMode !== 'Bank' && paymentMode !== 'Both' ? true : !!value;
      }
    ),

    bankName: Yup.string().test(
      'bankNameRequired',
      'Bank name is required',
      function (value) {
        const { paymentMode } = this.parent;
        return paymentMode !== 'Bank' && paymentMode !== 'Both' ? true : !!value;
      }
    ),
  });

  const defaultValues = {
    date: null,
    amountPaid: '',
    remark: '',
    paymentMode: '',
    cashAmount: '',
    accountName: '',
    accountNo: '',
    accountType: '',
    IFSC: '',
    bankName: '',
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
      remark: data.remark,
      date: data.date,
      amountPaid: data.amountPaid,
      paymentDetail : paymentDetail,
    }
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/loans/${id}/part-payment`;

      const config = {
        method: 'post',
        url,
        data: payload,
      };

      const response = await axios(config);
      mutate();
      reset();
      enqueueSnackbar(response?.data.message);
    } catch (error) {
      console.error(error);
    }
  });
  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container rowSpacing={3} sx={{ p: 3 }} columnSpacing={2}>
          <Grid item xs={4}>
            <Controller
              name='date'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label='Pay date'
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
            <RHFTextField name='amountPaid' label='Pay Amount' req={'red'} />
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
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
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
