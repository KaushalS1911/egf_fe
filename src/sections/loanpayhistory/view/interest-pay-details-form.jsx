import React, { useEffect, useState } from 'react';
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
import { Card, Grid, Stack } from '@mui/material';
import { useGetPenalty } from '../../../api/penalty';
import { useParams } from 'react-router';
import axios from 'axios';
import { paths } from '../../../routes/paths';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from '../../../routes/hooks';
import { useAuthContext } from '../../../auth/hooks';
import { useGetAllInterest } from '../../../api/interest-pay';
// import { useGetBranch } from '../../../api/branch';

const TABLE_HEAD = [
  { id: 'from', label: 'From Date' },
  { id: 'to', label: 'To Date' },
  { id: 'loanAmount', label: 'Loan Amount' },
  { id: 'interestRate', label: 'Interest Rate' },
  { id: 'totalInterest', label: 'Total Interest' },
  { id: 'penaltyAmount', label: 'Penalty Amount' },
  // { id: 'payInterest', label: 'Pay Interest' },
  { id: 'entryDate', label: 'Entry Date' },
  { id: 'consultantInterest', label: 'Consultant Interest' },
  { id: 'days', label: 'Days' },
  { id: 'crDrAmount', label: 'CR/DR Amount' },
  { id: 'totalPay', label: 'Total Pay' },
  { id: 'adjustedPay', label: 'Adjusted Pay' },
];
function InterestPayDetailsForm({ currentLoan }) {
  const { penalty } = useGetPenalty();
  const {id} = useParams();
  const [interests,setInterests] = useState([]);

  const {loanInterest , mutate} = useGetAllInterest(id);
  const { user } = useAuthContext();
  const router = useRouter();


  const NewInterestPayDetailsSchema = Yup.object().shape({
    from: Yup.date().required('From Date is required'),
    to: Yup.date().required('To Date is required'),
    days: Yup.string().required('Days is required'),
    amountPaid: Yup.string().required('Total is required'),
    interestAmount: Yup.string().required('Interest is required'),
    consultingCharge: Yup.string().required('Consult Charge is required'),
    penalty: Yup.string().required('Penalty is required'),
    uchakAmount: Yup.string().required('Uchak Amount is required'),
    cr_dr: Yup.string().required('New CR/DR is required'),
    totalPay: Yup.string().required('Total Pay is required'),
    payAfterAdjusted1: Yup.string().required('Pay After Adjusted 1 is required'),
    oldCrDr: Yup.string().required('Old CR/DR is required'),
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
      'Cash Amount is required',
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
    from: (currentLoan?.issueDate && loanInterest?.length === 0) ? new Date(currentLoan.issueDate) : new Date(loanInterest[0].to),
    to: currentLoan?.nextInstallmentDate ? new Date(currentLoan.nextInstallmentDate) : new Date(),
    days: '',
    amountPaid: '',
    interestAmount: currentLoan?.scheme.interestRate || '',
    consultingCharge: currentLoan?.consultingCharge || '',
    penalty: '',
    uchakAmount: 0,
    cr_dr: '',
    totalPay: '',
    payAfterAdjusted1: '',
    oldCrDr: 0,
    paymentMode: '',
    accountName: '',
    accountNo: '',
    accountType: '',
    IFSC: '',
    bankName: '',
    cashAmount: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewInterestPayDetailsSchema),
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit, formState: { isSubmitting } } = methods;

  const from = watch('from');
  const to = watch('to');

  function calculatePenalty(loanAmount, interestRate) {
    let dayDifference = 0;
    if (watch('to') && currentLoan.nextInstallmentDate) {
      const nextInstallmentDate = new Date(currentLoan.nextInstallmentDate);
      const to = new Date(watch('to'));
      const timeDifference = to.getTime() - nextInstallmentDate.getTime();
      dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      dayDifference = Math.abs(dayDifference);
    }
    const monthlyInterest = (loanAmount * interestRate) / 100;
    const penalty = (dayDifference / 30) * monthlyInterest;
    return penalty.toFixed(2);
  }


  useEffect(() => {
    const startDate = new Date(from);
    const endDate = new Date(to);
    const differenceInTime = Math.abs(endDate - startDate);
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    const nextInstallmentDate = new Date(currentLoan.nextInstallmentDate);
    const differenceInTime2 = Math.abs(new Date(to) - nextInstallmentDate);
    const differenceInDays2 = Math.floor(differenceInTime2 / (1000 * 3600 * 24));

    setValue('days', differenceInDays.toString());

    let penaltyPer = 0;
    penalty.forEach(penaltyItem => {
      if (differenceInDays2 >= penaltyItem.afterDueDateFromDate && differenceInDays2 <= penaltyItem.afterDueDateToDate) {
        penaltyPer = calculatePenalty(currentLoan.loanAmount, penaltyItem.penaltyInterest);
      }
    });

    setValue('interestAmount', (currentLoan?.scheme.interestRate * currentLoan.loanAmount / 100 * differenceInDays / 30).toFixed(2));
    setValue('penalty', penaltyPer);
    setValue('totalPay', (
      Number(watch('interestAmount')) +
      Number(watch('consultingCharge')) +
      Number(watch('penalty')) -
      Number(watch('uchakAmount'))
    ).toFixed(2));
    setValue('payAfterAdjusted1', (Number(watch('totalPay')) + Number(watch('oldCrDr'))).toFixed(2));
    setValue('cr_dr', (Number(watch('payAfterAdjusted1')) - Number(watch('amountPaid'))).toFixed(2));
  }, [from, to, setValue, penalty, watch('amountPaid'), watch('oldCrDr')]);



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
      to: data.to,
      adjustedPay: data.payAfterAdjusted1,
      days: data.days,
      interestAmount: data.interestAmount,
      from: data.from,
      amountPaid: data.amountPaid,
      penalty: data.penalty,
      cr_dr: data.cr_dr,
      paymentDetail
    };
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/loans/${id}/interest-payment`;

      const config = {
        method: 'post',
        url,
        data: payload,
      };

      const response = await axios(config);
      reset();
      mutate();
      enqueueSnackbar(response?.data.message);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to pay interest",{variant: "error"});
    }

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
            name='from'
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
            name='to'
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
          <RHFTextField name='uchakAmount' label='Uchak Amount' req={'red'} />
          <RHFTextField name='interestAmount' label='Interest' req={'red'} />
          <RHFTextField name='consultingCharge' label='Consult Charge' req={'red'} />
          <RHFTextField name='penalty' label='Penalty' req={'red'} />
          <RHFTextField name='totalPay' label='Total Pay' req={'red'} />
          <RHFTextField name='oldCrDr' label='Old CR/DR' req={'red'} />
          <RHFTextField name='payAfterAdjusted1' label='Pay After Adjusted 1' req={'red'} />
          <RHFTextField name='cr_dr' label='New CR/DR' req={'red'} />
          <RHFTextField name='amountPaid' label='Total' req={'red'} />
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
            options={['Cash', 'Bank','Both']}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
          />
        </Box>
        <Box sx={{mt:8}}>
          {(watch('paymentMode') === 'Cash' || watch('paymentMode') === 'Both') && (
            <>
              <RHFTextField name='cashAmount' label='Cash Amount'  sx={{ width: '25%' }} InputLabelProps={{ shrink: true,readOnly: true }}/>
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
              {loanInterest.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.from)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.to)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.loan.loanAmount}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.loan.scheme.interestRate}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.interestAmount}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.penalty}</TableCell>
                  {/*<TableCell sx={{ whiteSpace: 'nowrap' }}>{row.interestAmount}</TableCell>*/}
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.createdAt)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.loan.consultingCharge}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.days}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.cr_dr}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.amountPaid}</TableCell>
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
