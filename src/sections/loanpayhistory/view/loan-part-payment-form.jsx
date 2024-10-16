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
import { useGetBranch } from '../../../api/branch';
const TABLE_HEAD = [
  { id: 'loanAmount', label: 'Loan Amount' },
  { id: 'payAmount', label: 'Pay Amount' },
  { id: 'payDate', label: 'Pay Date' },
  { id: 'entryDate', label: 'Entry Date' },
  { id: 'remarks', label: 'Remarks' },
];

function LoanPartPaymentForm() {
  const {id} = useParams();
  const {branch} = useGetBranch();
  const { partPayment , mutate} = useGetAllPartPayment(id);

  const NewPartPaymentSchema = Yup.object().shape({
    date: Yup.date().nullable().required('Uchak Pay date is required'),
    amountPaid: Yup.number()
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
    date: null,
    amountPaid: '',
    remark: '',
    paymentMode: '',
    cashAmount: '',
    account: '',
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
