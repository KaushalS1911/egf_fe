import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormProvider, { RHFAutocomplete, RHFTextField } from '../../../components/hook-form';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Table from '@mui/material/Table';
import { TableHeadCustom } from '../../../components/table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { fDate } from '../../../utils/format-time';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card } from '@mui/material';
import { useGetPenalty } from '../../../api/penalty';

const TABLE_HEAD = [
  { id: 'fromDate', label: 'From Date' },
  { id: 'toDate', label: 'To Date' },
  { id: 'loanAmount', label: 'Loan Amount' },
  { id: 'interestRate', label: 'Interest Rate' },
  { id: 'totalInterest', label: 'Total Interest' },
  { id: 'penaltyAmount', label: 'Penalty Amount' },
  { id: 'payInterest', label: 'Pay Interest' },
  { id: 'entryDate', label: 'Entry Date' },
  { id: 'consultantInterest', label: 'Consultant Interest' },
  { id: 'days', label: 'Days' },
  { id: 'crDrAmount', label: 'CR/DR Amount' },
  { id: 'totalPay', label: 'Total Pay' },
  { id: 'adjustedPay', label: 'Adjusted Pay' },
];
const tableDummyData = [
  // {
  //   fromDate: '2024-10-01',
  //   toDate: '2024-10-10',
  //   loanAmount: '5000',
  //   interestRate: '5%',
  //   totalInterest: '250',
  //   penaltyAmount: '50',
  //   payInterest: '200',
  //   entryDate: '2024-09-30',
  //   consultantInterest: '100',
  //   days: '10',
  //   crDrAmount: '1000',
  //   totalPay: '8000',
  //   adjustedPay: '7800',
  // },
  // {
  //   fromDate: '2024-09-15',
  //   toDate: '2024-09-25',
  //   loanAmount: '10000',
  //   interestRate: '7%',
  //   totalInterest: '700',
  //   penaltyAmount: '75',
  //   payInterest: '600',
  //   entryDate: '2024-09-12',
  //   consultantInterest: '150',
  //   days: '15',
  //   crDrAmount: '2000',
  //   totalPay: '15000',
  //   adjustedPay: '14800',
  // },
  // {
  //   fromDate: '2024-08-05',
  //   toDate: '2024-08-20',
  //   loanAmount: '2000',
  //   interestRate: '3%',
  //   totalInterest: '60',
  //   penaltyAmount: '10',
  //   payInterest: '50',
  //   entryDate: '2024-08-01',
  //   consultantInterest: '20',
  //   days: '5',
  //   crDrAmount: '500',
  //   totalPay: '3000',
  //   adjustedPay: '2950',
  // },
];

function InterestPayDetailsForm({ currentLoan }) {
  const { penalty } = useGetPenalty();
  console.log('penalty : ', penalty);
  const NewInterestPayDetailsSchema = Yup.object().shape({
    fromDate: Yup.date().required('From Date is required'),
    toDate: Yup.date().required('To Date is required'),
    days: Yup.string().required('Days is required'),
    total: Yup.string().required('Total is required'),
    interest: Yup.string().required('Interest is required'),
    consultCharge: Yup.string().required('Consult Charge is required'),
    penalty: Yup.string().required('Penalty is required'),
    uchakAmount: Yup.string().required('Uchak Amount is required'),
    newCrDr: Yup.string().required('New CR/DR is required'),
    totalPay: Yup.string().required('Total Pay is required'),
    payAfterAdjusted1: Yup.string().required('Pay After Adjusted 1 is required'),
    oldCrDr: Yup.string().required('Old CR/DR is required'),
    paymentMode: Yup.string().required('Payment Mode is required'),
  });

  const defaultValues = {
    fromDate: (tableDummyData.length === 0 && currentLoan?.issueDate) ? new Date(currentLoan?.issueDate) : new Date(),//prev to date
    toDate: (new Date(currentLoan?.nextInstallmentDate) > new Date()) ? new Date(currentLoan?.nextInstallmentDate) : new Date(),
    days: '',
    total: '',
    interest: currentLoan?.scheme.interestRate || '',
    consultCharge: currentLoan?.consultingCharge || '',
    penalty: '',
    uchakAmount: '',
    newCrDr: '',
    totalPay: '',
    payAfterAdjusted1: '',
    oldCrDr: '',
    paymentMode: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewInterestPayDetailsSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const fromDate = watch('fromDate');
  const toDate = watch('toDate');

  function calculatePenalty(loanAmount, interestRate) {
    let dayDifference = 0;
    if (currentLoan?.nextInstallmentDate) {
      const nextInstallmentDate = new Date(currentLoan?.nextInstallmentDate);
      const today = new Date();
      const timeDifference = nextInstallmentDate.getTime() - today.getTime();
      dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      dayDifference = Math.abs(dayDifference);
    }
    const monthlyInterest = (loanAmount * interestRate) / 100;
    const penalty = (dayDifference / 30) * monthlyInterest;
    const total = loanAmount + penalty;
    return total.toFixed(2);
  }



  useEffect(() => {
    if (fromDate && toDate) {
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      const differenceInTime = Math.abs(endDate - startDate);
      const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
      setValue('days', differenceInDays.toString());

      let penaltyPer = 0;
      penalty.forEach(penaltyItem => {
        if (
          differenceInDays >= penaltyItem.afterDueDateFromDate &&
          differenceInDays <= penaltyItem.afterDueDateToDate
        ) {
          penaltyPer = calculatePenalty(currentLoan.loanAmount,penaltyItem.penaltyInterest)
        }
      });
      console.log("penaltyPer : ",penaltyPer)
      setValue('days', differenceInDays.toString());
      setValue('penalty', penaltyPer);
    }
  }, [fromDate, toDate, setValue, penalty]);


  const onSubmit = handleSubmit(async (data) => {
    console.log('DATA : ', data);
  });

  return (
    <Box sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box
          rowGap={3}
          columnGap={2}
          display='grid'
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
          }}
        >
          <Controller
            name='fromDate'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                label='From Date'
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

          <Controller
            name='toDate'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                label='To Date'
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

          <RHFTextField name='days' label='Days' req={'red'} InputProps={{ readOnly: true }} />
          <RHFTextField name='interest' label='Interest' req={'red'} />
          <RHFTextField name='consultCharge' label='Consult Charge' req={'red'} />
          <RHFTextField name='penalty' label='Penalty' req={'red'} />
          <RHFTextField name='uchakAmount' label='Uchak Amount' req={'red'} />
          <RHFTextField name='newCrDr' label='New CR/DR' req={'red'} />
          <RHFTextField name='totalPay' label='Total Pay' req={'red'} />
          <RHFTextField name='payAfterAdjusted1' label='Pay After Adjusted 1' req={'red'} />
          <RHFTextField name='oldCrDr' label='Old CR/DR' req={'red'} />
          <RHFTextField name='total' label='Total' req={'red'} />
        </Box>

        <Box>
          <Typography variant='h6' sx={{ mt: 8, mb: 2 }}>
            Payment Details
          </Typography>
          <RHFAutocomplete
            name='paymentMode'
            label='Payment Mode'
            req={'red'}
            sx={{ width: '25%' }}
            options={['Cash', 'Check']}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
          <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Box>
      </FormProvider>
      <Box>
        <Box sx={{
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: '5px',
            transition: 'opacity 0.3s ease',
          },
          '&:hover::-webkit-scrollbar-thumb': {
            visibility: 'visible',
            display: 'block',
          },
          '&::-webkit-scrollbar-thumb': {
            visibility: 'hidden',
            backgroundColor: '#B4BCC3',
            borderRadius: '4px',
          },
        }}>
          <Table sx={{ borderRadius: '16px', mt: 8, minWidth: '1600px' }}>
            <TableHeadCustom headLabel={TABLE_HEAD} />
            <TableBody>
              {tableDummyData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.fromDate)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.toDate)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.loanAmount}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.interestRate}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.totalInterest}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.penaltyAmount}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.payInterest}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.entryDate)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.consultantInterest}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.days}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.crDrAmount}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.totalPay}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.adjustedPay}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}

export default InterestPayDetailsForm;
