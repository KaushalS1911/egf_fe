import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormProvider, { RHFAutocomplete, RHFTextField } from '../../../components/hook-form';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Table from '@mui/material/Table';
import { TableHeadCustom, useTable } from '../../../components/table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { fDate } from '../../../utils/format-time';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Dialog, DialogActions, Grid, IconButton, Stack } from '@mui/material';
import { useGetPenalty } from '../../../api/penalty';
import { useParams } from 'react-router';
import axios from 'axios';
import { paths } from '../../../routes/paths';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from '../../../routes/hooks';
import { useAuthContext } from '../../../auth/hooks';
import { useGetAllInterest } from '../../../api/interest-pay';
import { useGetBranch } from '../../../api/branch';
import Button from '@mui/material/Button';
import RHFDatePicker from '../../../components/hook-form/rhf-.date-picker';
import Iconify from '../../../components/iconify';
import moment from 'moment';
import { PDFViewer } from '@react-pdf/renderer';
import Noc from '../PDF/noc';
import InterestPdf from '../PDF/interest-pdf';
import { useBoolean } from '../../../hooks/use-boolean';
import PartReleasePdf from '../PDF/part-release-pdf';
import { ConfirmDialog } from '../../../components/custom-dialog';
// import { useGetBranch } from '../../../api/branch';

const TABLE_HEAD = [
  { id: 'from', label: 'From Date' },
  { id: 'to', label: 'To Date' },
  { id: 'loanAmount', label: 'Loan Amt' },
  { id: 'interestRate', label: 'Interest Rate' },
  { id: 'consultantInterest', label: 'Consultant Int' },
  { id: 'totalInterest', label: 'Total Int' },
  { id: 'penaltyAmount', label: 'Penalty Amt' },
  { id: 'crDrAmt', label: 'CR/DR Amt' },
  { id: 'payAfterAdjust', label: 'Pay After Adjust' },
  { id: 'entryDate', label: 'Entry Date' },
  { id: 'days', label: 'Days' },
  { id: 'uchakAmt', label: 'Uchak Amt' },
  { id: 'totalPay', label: 'Total Pay Amt' },
  { id: 'action', label: 'Action' },
  { id: 'pdf', label: 'PDF' },
];

function InterestPayDetailsForm({ currentLoan, mutate }) {
  const { penalty } = useGetPenalty();
  const [paymentMode, setPaymentMode] = useState('');
  const [data, setData] = useState(null);
  const view = useBoolean();
  const { branch } = useGetBranch();
  const confirm = useBoolean();
  const [deleteId, setDeleteId] = useState('');
  const { loanInterest, refetchLoanInterest } = useGetAllInterest(currentLoan._id);
  const table = useTable();

  const paymentSchema = paymentMode === 'Bank' ? {
    account: Yup.object().required('Account is required').typeError('Account is required'),
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

  const NewInterestPayDetailsSchema = Yup.object().shape({
    from: Yup.string().required('From Date is required'),
    to: Yup.string().required('To Date is required'),
    days: Yup.string().required('Days is required'),
    amountPaid: Yup.string()
      .required('Total is required')
      .test('is-positive', 'Amount must be a positive number', value => parseFloat(value) >= 0),
    interestAmount: Yup.string().required('Interest is required'),
    consultingCharge: Yup.string().required('Consult Charge is required'),
    penalty: Yup.string().required('Penalty is required'),
    uchakAmount: Yup.string().required('Uchak Amount is required'),
    cr_dr: Yup.string().required('New CR/DR is required'),
    totalPay: Yup.string().required('Total Pay is required'),
    payAfterAdjusted1: Yup.string().required('Pay After Adjusted 1 is required'),
    oldCrDr: Yup.string().required('Old CR/DR is required'),
    paymentMode: Yup.string().required('Payment Mode is required'),
    ...paymentSchema,
  });

  const defaultValues = {
    from: (currentLoan?.issueDate && loanInterest?.length === 0) ? new Date(currentLoan.issueDate) : new Date(loanInterest[0]?.to).setDate(new Date(loanInterest[0]?.to).getDate() + 1),
    to: (new Date(currentLoan?.nextInstallmentDate) > new Date()) ? new Date(currentLoan.nextInstallmentDate) : new Date(),
    days: '',
    amountPaid: '',
    interestAmount: currentLoan?.scheme.interestRate || '',
    consultingCharge: currentLoan?.consultingCharge || 0,
    penalty: '',
    uchakAmount: currentLoan?.uchakInterestAmount || 0,
    cr_dr: '',
    totalPay: '',
    payAfterAdjusted1: '',
    oldCrDr: loanInterest[0]?.cr_dr || 0,
    paymentMode: '',
    account: '',
    cashAmount: '',
    bankAmount: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewInterestPayDetailsSchema),
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit, formState: { isSubmitting } } = methods;
  const from = watch('from');
  const to = watch('to');

  function calculatePenalty(interestLoanAmount, interestRate, differenceInDays) {
    const penalty = ((interestLoanAmount * interestRate) / 100) * (12 * differenceInDays) / 365;
    return penalty.toFixed(2);
  }

  useEffect(() => {
    if (loanInterest && currentLoan) {
      reset(defaultValues);
    }
  }, [loanInterest, currentLoan, setValue]);

  useEffect(() => {
    const endDate = new Date(to).setHours(0, 0, 0, 0);
    const differenceInDays = moment(to).startOf('day').diff(moment(from).startOf('day'), 'days', true) + 1;

    const nextInstallmentDate = moment(currentLoan.nextInstallmentDate);
    const differenceInDays2 = moment(to).startOf('day').diff(nextInstallmentDate.startOf('day'), 'days', true);
    setValue('days', differenceInDays.toString());
    let penaltyPer = 0;
    penalty.forEach(penaltyItem => {
      if (differenceInDays2 >= penaltyItem.afterDueDateFromDate && differenceInDays2 <= penaltyItem.afterDueDateToDate && penaltyItem.isActive === true && nextInstallmentDate < endDate) {
        penaltyPer = calculatePenalty(currentLoan.interestLoanAmount, penaltyItem.penaltyInterest, differenceInDays);
      }
    });
    setValue('interestAmount', (((currentLoan.interestLoanAmount * currentLoan?.scheme.interestRate) / 100) * (12 * differenceInDays) / 365).toFixed(2));
    setValue('penalty', penaltyPer);
    setValue('totalPay', ((Number(watch('interestAmount')) + Number(watch('penalty') - Number(watch('uchakAmount'))))).toFixed(2));
    setValue('payAfterAdjusted1', (Number(watch('totalPay')) + Number(watch('oldCrDr'))).toFixed(2));
    setValue('cr_dr', (Number(watch('payAfterAdjusted1')) - Number(watch('amountPaid'))).toFixed(2));
  }, [from, to, setValue, penalty, watch('amountPaid'), watch('oldCrDr')]);

  useEffect(() => {
    if (watch('paymentMode')) {
      setPaymentMode(watch('paymentMode'));
    }
  }, [watch('paymentMode')]);

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
        ...data.account,
        bankAmount: data.bankAmount,
      };



    }

    const payload = {
      to: new Date(data.to),
      adjustedPay: data.payAfterAdjusted1,
      days: data.days,
      uchakInterestAmount: data.uchakAmount,
      interestAmount: data.interestAmount,
      from:(currentLoan?.issueDate && loanInterest?.length === 0) ? new Date(watch('from')) :  new Date(Number(data.from)),
      amountPaid: data.amountPaid,
      penalty: data.penalty,
      cr_dr: data.cr_dr,
      paymentDetail,
    };

    try {
      const url = `${import.meta.env.VITE_BASE_URL}/loans/${currentLoan._id}/interest-payment`;
      const config = {
        method: 'post',
        url,
        data: payload,
      };
      const response = await axios(config);
      reset();
      mutate();
      refetchLoanInterest();
      enqueueSnackbar(response?.data.message);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to pay interest', { variant: 'error' });
    }

  });

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
  const handleDeleteInterest = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/loans/${currentLoan._id}/interest-payment/${id}`);
      setDeleteId(null)
      confirm.onFalse();
      refetchLoanInterest();
      mutate();
      enqueueSnackbar((response?.data.message),{variant: 'success'});
    } catch (err) {
      enqueueSnackbar('Failed to pay interest',{variant: 'error'});
    }
  };

  return (
    <Box sx={{ py: 0 }}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box
          rowGap={1.5}
          columnGap={1.5}
          display='grid'
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(6, 1fr)',
          }}
        >
          <RHFDatePicker
            name='from'
            control={control}
            label='From Date'
            req={'red'}
          />
          <RHFDatePicker
            name='to'
            control={control}
            label='To Date'
            req={'red'}
          />

          <RHFTextField name='days' label='Days' req={'red'} InputProps={{ readOnly: true }} />
          <RHFTextField name='interestAmount' label='Interest' req={'red'} InputProps={{ readOnly: true }} />
          <RHFTextField name='consultingCharge' label='Consult Charge' req={'red'} InputProps={{ readOnly: true }} />
          <RHFTextField name='uchakAmount' label='Uchak Amount' req={'red'} InputProps={{ readOnly: true }} />
          <RHFTextField name='penalty' label='Penalty' req={'red'} InputProps={{ readOnly: true }} />
          <RHFTextField name='totalPay' label='Total Pay' req={'red'} InputProps={{ readOnly: true }} />
          <RHFTextField name='oldCrDr' label='Old CR/DR' req={'red'} InputProps={{ readOnly: true }} />
          <RHFTextField name='payAfterAdjusted1' label='Pay After Adjusted 1' req={'red'}
                        InputProps={{ readOnly: true }} />
          <RHFTextField name='cr_dr' label='New CR/DR' req={'red'} InputProps={{ readOnly: true }} />
          <RHFTextField name='amountPaid' label='Total Pay Amount' req={'red'} onKeyPress={(e) => {
            if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
              e.preventDefault();
            }
          }} />
        </Box>
        <Typography variant='subtitle1' sx={{ mt: 1, fontWeight: 600 }}>
          Payment Details
        </Typography>
        <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <Box sx={{width:'90%'}}>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(6, 1fr)',
              }}
              sx={{ mt: 1 }}
            >
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

              {watch('paymentMode') === 'Cash' || watch('paymentMode') === 'Both' ? (
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
              ) : null}

              {(watch('paymentMode') === 'Bank' || watch('paymentMode') === 'Both') && (
                <>
                  <RHFAutocomplete
                    name='account'
                    label='Account'
                    req={'red'}
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
          </Box>
          <Box xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end',gap:1 }}>
            <Button color='inherit' sx={{ height: '36px' }}
                    variant='outlined' onClick={() => reset()}>Reset</Button>
            <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
              Submit
            </LoadingButton>
          </Box>
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
          <Table sx={{ borderRadius: '16px', mt: 2.5, minWidth: '1600px' }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              onSort={table.onSort}
            />
            <TableBody>
              {loanInterest.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ py: 0, px: 1, }}>{fDate(row.from)}</TableCell>
                  <TableCell sx={{ py: 0, px: 1, }}>{fDate(row.to)}</TableCell>
                  <TableCell sx={{ py: 0, px: 1, }}>{row.loan.loanAmount}</TableCell>
                  <TableCell sx={{
                    py: 0,
                    px: 1,

                  }}>{row.loan.scheme.interestRate > 1.5 ? 1.5 : row.loan.scheme.interestRate}</TableCell>
                  <TableCell sx={{ py: 0, px: 1, }}>{row.loan.consultingCharge}</TableCell>
                  <TableCell sx={{ py: 0, px: 1, }}>{row.interestAmount}</TableCell>
                  <TableCell sx={{ py: 0, px: 1, }}>{row.penalty}</TableCell>
                  <TableCell sx={{ py: 0, px: 1, }}>{row.cr_dr}</TableCell>
                  <TableCell sx={{ py: 0, px: 1, }}>{row.adjustedPay}</TableCell>
                  <TableCell sx={{ py: 0, px: 1, }}>{fDate(row.createdAt)}</TableCell>
                  <TableCell sx={{ py: 0, px: 1, }}>{row.days}</TableCell>
                  <TableCell sx={{ py: 0, px: 1, }}>{row.uchakInterestAmount || 0}</TableCell>
                  <TableCell sx={{ py: 0, px: 1, }}>{row.amountPaid}</TableCell>
                  <TableCell sx={{ py: 0, px: 1, }}>{
                    <IconButton color='error' onClick={() => {
                      if(index === 0){
                        confirm.onTrue();
                        setDeleteId(row?._id);
                      }
                    }} sx={{
                      cursor: index === 0 ? 'pointer' : 'default',
                      opacity: index === 0 ? 1 : 0.5,
                      pointerEvents: index === 0 ? 'auto' : 'none',
                    }}>
                      <Iconify icon='eva:trash-2-outline' />
                    </IconButton>
                  }</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer', py: 0, px: 1 }}>{
                    <Typography
                      onClick={() => {
                        view.onTrue();
                        setData(row);
                      }}
                      sx={{
                        cursor: 'pointer',
                        color: 'inherit',
                        pointerEvents: 'auto',
                      }}
                    >
                      <Iconify icon='basil:document-solid' />
                    </Typography>
                  }</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title='Delete'
        content='Are you sure want to delete?'
        action={
          <Button variant='contained' color='error' onClick={() => handleDeleteInterest(deleteId)}>
            Delete
          </Button>
        }
      />
      <Dialog fullScreen open={view.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color='inherit' variant='contained' onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width='100%' height='100%' style={{ border: 'none' }}>
              <InterestPdf data={data} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

export default InterestPayDetailsForm;
