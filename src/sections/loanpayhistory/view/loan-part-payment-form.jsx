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
const TABLE_HEAD = [
  { id: 'loanAmount', label: 'Loan Amount' },
  { id: 'payAmount', label: 'Pay Amount' },
  { id: 'payDate', label: 'Pay Date' },
  { id: 'entryDate', label: 'Entry Date' },
  { id: 'remarks', label: 'Remarks' },
];

const dummyTableData = [
  {
    loanAmount: '05 Aug 2024',
    payAmount: '05 Aug 2024',
    payDate: '05 Jul 2024',
    entryDate: '05 Jul 2024',
    remarks: '1 Chain close',
  },
  {
    loanAmount: '15 Sep 2024',
    payAmount: '15 Sep 2024',
    payDate: '14 Aug 2024',
    entryDate: '14 Aug 2024',
    remarks: '2 Chain open',
  },
  {
    loanAmount: '20 Oct 2024',
    payAmount: '20 Oct 2024',
    payDate: '19 Sep 2024',
    entryDate: '19 Sep 2024',
    remarks: '1 Chain ongoing',
  },
];

function LoanPartPaymentForm() {
  const NewPartPaymentSchema = Yup.object().shape({
    date: Yup.date().nullable().required('Uchak Pay date is required'),
    amountPaid: Yup.number()
      .min(1, 'Uchak Interest Pay Amount must be greater than 0')
      .required('Uchak Interest Pay Amount is required')
      .typeError('Uchak Interest Pay Amount must be a number'),
    remark: Yup.string().required('Remark is required'),
    paymentMode: Yup.string().required('Payment Mode is required'),
  });

  const defaultValues = {
    date: null,
    amountPaid: 0,
    remark: '',
    paymentMode: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewPartPaymentSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('DATAAAAAAAAAAA : ', data);
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

export default LoanPartPaymentForm;
