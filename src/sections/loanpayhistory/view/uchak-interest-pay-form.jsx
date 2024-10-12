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
  const NewUchakSchema = Yup.object().shape({
    uchakPayDate: Yup.date().nullable().required('Uchak Pay date is required'),
    uchakInterestAmount: Yup.number()
      .min(1, 'Uchak Interest Pay Amount must be greater than 0')
      .required('Uchak Interest Pay Amount is required')
      .typeError('Uchak Interest Pay Amount must be a number'),
    remark: Yup.string().required('Remark is required'),
    paymentMode: Yup.string().required('Payment Mode is required'),
    accountName: Yup.string().required('Account name is required'),
    accountNo: Yup.string().required('Account number is required'),
    accountType: Yup.string().required('Account type is required'),
    IFSC: Yup.string().required('IFSC code is required'),
    bankName: Yup.string().required('Bank name is required'),
  });

  const defaultValues = {
    uchakPayDate: null,
    uchakInterestAmount: 0,
    remark: '',
    paymentMode: '',
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
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      loan : 'adsdasdadsdadsdddw233e',
      remark: data.remark,
      date: data.uchakPayDate,
      InterestAmount: data.uchakInterestAmount,
      paymentDetail : {
        accountName: data.accountName,
        accountNo: data.accountNo,
        accountType: data.accountType,
        ifscCode: data.IFSC,
        bankName: data.bankName
      }
    }
    console.log('DATAAAAAAAAAAA : ', payload);
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
            options={['Cash', 'Check']}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
          />
        </Grid>
      </Grid>
      <Grid container sx={{ mt: 5,p:3 }}>
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
