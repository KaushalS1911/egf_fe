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
const dummyTableData = [
  {
    loanAmount: '5000 USD',
    payAmount: '1000 USD',
    payDate: '05 Aug 2024',
    entryDate: '05 Jul 2024',
    remarks: '1 Chain close',
  },
  {
    loanAmount: '8000 USD',
    payAmount: '1500 USD',
    payDate: '10 Aug 2024',
    entryDate: '10 Jul 2024',
    remarks: 'Partial payment',
  },
  {
    loanAmount: '6000 USD',
    payAmount: '1200 USD',
    payDate: '12 Aug 2024',
    entryDate: '12 Jul 2024',
    remarks: 'Overdue',
  },
  {
    loanAmount: '7000 USD',
    payAmount: '1400 USD',
    payDate: '15 Aug 2024',
    entryDate: '15 Jul 2024',
    remarks: 'Advance payment',
  },
  {
    loanAmount: '9000 USD',
    payAmount: '1600 USD',
    payDate: '18 Aug 2024',
    entryDate: '18 Jul 2024',
    remarks: 'Full settlement',
  }
];
const TABLE_HEAD = [
  { id: 'loanAmount', label: 'Loan Amount' },
  { id: 'payAmount', label: 'Pay Amount' },
  { id: 'payDate', label: 'Pay date' },
  { id: 'entryDate', label: 'Entry Date' },
  { id: 'remarks', label: 'Remarks' },
];

function UchakInterestPayForm() {
  const { id } = useParams();
  const NewUchakSchema = Yup.object().shape({
    uchakPayDate: Yup.date().nullable().required('Uchak Pay date is required'),
    uchakInterestAmount: Yup.number()
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
    uchakPayDate: null,
    uchakInterestAmount: 0,
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
    resolver: yupResolver(NewUchakSchema),
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
          {dummyTableData.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.loanAmount}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.payAmount}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.payDate)}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.entryDate)}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.remarks}</TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
    </>
  );
}

export default UchakInterestPayForm;
