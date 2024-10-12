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
  { id: 'totalLoanAmount', label: 'Total Loan Amount' },
  { id: 'paidLoanAmount', label: 'Paid Loan Amount' },
  { id: 'pendingLoanAmount', label: 'Pending Loan Amount' },
  { id: 'closingCharge', label: 'Closing Charge' },
  { id: 'closeRemarks', label: 'Close Remarks' },
  { id: 'paymentMode', label: 'Payment Mode' },
];
const dummyTableData = [
  {
    totalLoanAmount: 50000,
    paidLoanAmount: 30000,
    pendingLoanAmount: 20000,
    closingCharge: 500,
    closeRemarks: 'Loan closing soon',
    paymentMode: 'Cash',
  },
  {
    totalLoanAmount: 75000,
    paidLoanAmount: 50000,
    pendingLoanAmount: 25000,
    closingCharge: 700,
    closeRemarks: 'Payment ongoing',
    paymentMode: 'Check',
  },
  {
    totalLoanAmount: 100000,
    paidLoanAmount: 80000,
    pendingLoanAmount: 20000,
    closingCharge: 1000,
    closeRemarks: 'Almost done',
    paymentMode: 'Cash',
  },
];

function LoanCloseForm() {
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
    totalLoanAmount: '',
    paidLoanAmount: '',
    pendingLoanAmount: '',
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
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {

    console.log('DATAAAAAAAAAAA : ', data);
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
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.totalLoanAmount}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.paidLoanAmount}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.pendingLoanAmount}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.closingCharge}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.closeRemarks}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.paymentMode}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default LoanCloseForm;
