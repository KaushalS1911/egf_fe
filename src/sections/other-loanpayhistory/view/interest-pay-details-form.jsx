import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Controller, useForm } from 'react-hook-form';
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
import { Dialog, DialogActions, IconButton } from '@mui/material';
import { useGetPenalty } from '../../../api/penalty';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useGetAllInterest } from '../../../api/interest-pay';
import { useGetBranch } from '../../../api/branch';
import Button from '@mui/material/Button';
import RHFDatePicker from '../../../components/hook-form/rhf-.date-picker';
import Iconify from '../../../components/iconify';
import moment from 'moment';
import { PDFViewer } from '@react-pdf/renderer';
import InterestPdf from '../PDF/interest-pdf';
import { useBoolean } from '../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../components/custom-dialog';
import { getResponsibilityValue } from '../../../permission/permission';
import { useAuthContext } from '../../../auth/hooks';
import { useGetOtherLoanInterestPay } from '../../../api/other-loan-interest-pay.js';

const TABLE_HEAD = [
  { id: 'from', label: 'From Date' },
  { id: 'to', label: 'To Date' },
  { id: 'days', label: 'Days' },
  { id: 'amountPaid', label: 'Amount Paid' },
  { id: 'EntryDate', label: 'Entry Date' },
  { id: 'action', label: 'Action' },
  { id: 'pdf', label: 'PDF' },
];

function InterestPayDetailsForm({ currentOtherLoan, mutate, configs }) {
  const { penalty } = useGetPenalty();
  const [paymentMode, setPaymentMode] = useState('');
  const [data, setData] = useState(null);
  const view = useBoolean();
  const { branch } = useGetBranch();
  const confirm = useBoolean();
  const [deleteId, setDeleteId] = useState('');
  const { otherLoanInterest, refetchOtherLoanInterest } = useGetOtherLoanInterestPay(
    currentOtherLoan._id
  );
  const table = useTable();
  const { user } = useAuthContext();
  const payAmt = otherLoanInterest.reduce(
    (prev, next) => prev + (Number(next?.payAfterAdjust) || 0),
    0
  );
  const day = otherLoanInterest.reduce((prev, next) => prev + (Number(next?.days) || 0), 0);
  const paymentSchema =
    paymentMode === 'Bank'
      ? {
          account: Yup.object().required('Account is required').typeError('Account is required'),
          bankAmount: Yup.string()
            .required('Bank Amount is required')
            .test(
              'is-positive',
              'Bank Amount must be a positive number',
              (value) => parseFloat(value) >= 0
            ),
        }
      : paymentMode === 'Cash'
        ? {
            cashAmount: Yup.string()
              .required('Cash Amount is required')
              .test(
                'is-positive',
                'Cash Amount must be a positive number',
                (value) => parseFloat(value) >= 0
              ),
          }
        : {
            cashAmount: Yup.string()
              .required('Cash Amount is required')
              .test(
                'is-positive',
                'Cash Amount must be a positive number',
                (value) => parseFloat(value) >= 0
              ),

            bankAmount: Yup.string()
              .required('Bank Amount is required')
              .test(
                'is-positive',
                'Bank Amount must be a positive number',
                (value) => parseFloat(value) >= 0
              ),
            account: Yup.object().required('Account is required'),
          };

  const NewInterestPayDetailsSchema = Yup.object().shape({
    from: Yup.string().required('From Date is required'),
    to: Yup.string().required('To Date is required'),
    days: Yup.string().required('Days is required'),

    paymentMode: Yup.string().required('Payment Mode is required'),
    payAfterAdjusted: Yup.string().required('pay After Adjusted is required'),
    ...paymentSchema,
  });
  const defaultValues = {
    from: currentOtherLoan?.date
      ? otherLoanInterest?.[0]?.to
        ? new Date(otherLoanInterest[0].to)
        : new Date(currentOtherLoan.date)
      : new Date(),

    to: new Date(currentOtherLoan?.renewalDate)
      ? new Date(currentOtherLoan?.renewalDate)
      : new Date(),
    days: '',
    amountPaid: '',
    interest: currentOtherLoan?.percentage,
    interestAmount: '',
    payAfterAdjusted: '',
    cr_dr: '',
    totalPay: '',
    paymentMode: '',
    account: '',
    cashAmount: '',
    bankAmount: '',
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
  useEffect(() => {
    if (currentOtherLoan.status !== 'Closed') {
      const days = watch('days');
      const totalLoanAmount = (
        (((currentOtherLoan.amount * currentOtherLoan.percentage) / 100) * (12 * days)) /
        365
      ).toFixed(2);
      setValue('interestAmount', totalLoanAmount);
    }
  }, [currentOtherLoan.amount, currentOtherLoan.percentage, watch('days')]);

  useEffect(() => {
    const toDate = watch('to');
    const fromDate = watch('from');

    if (toDate && fromDate) {
      const diffTime = new Date(toDate) - new Date(fromDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setValue('days', diffDays);
    } else {
      setValue('days', 0);
    }
  }, [watch('to'), watch('from')]);

  useEffect(() => {
    if (otherLoanInterest && currentOtherLoan) {
      reset(defaultValues);
    }
  }, [otherLoanInterest, currentOtherLoan?.loan, setValue]);

  useEffect(() => {
    const loanAmount = currentOtherLoan?.amount;
    const interestAmount = watch('interestAmount');
    const totalAmount = Number(loanAmount) + Number(interestAmount);
    setValue('amountPaid', totalAmount);
  }, [currentOtherLoan?.amount, watch('interestAmount')]);

  // useEffect(() => {
  //   const endDate = new Date(to).setHours(0, 0, 0, 0);
  //   const differenceInDays =
  //     moment(to).startOf('day').diff(moment(from).startOf('day'), 'days', true) + 1;
  //   const nextInstallmentDate = moment(currentOtherLoan?.loan?.nextInstallmentDate);
  //   const differenceInDays2 = moment(to)
  //     .startOf('day')
  //     .diff(nextInstallmentDate.startOf('day'), 'days', true);
  //   setValue('days', differenceInDays.toString());
  //   let penaltyPer = 0;
  //   penalty.forEach((penaltyItem) => {
  //     if (
  //       differenceInDays2 >= penaltyItem.afterDueDateFromDate &&
  //       differenceInDays2 <= penaltyItem.afterDueDateToDate &&
  //       penaltyItem.isActive === true &&
  //       nextInstallmentDate < endDate
  //     ) {
  //       penaltyPer = calculatePenalty(
  //         currentOtherLoan?.loan?.interestLoanAmount,
  //         penaltyItem.penaltyInterest,
  //         differenceInDays
  //       );
  //     }
  //   });
  // setValue(
  //   'interestAmount',
  //   (
  //     (((currentOtherLoan?.loan?.interestLoanAmount *
  //       currentOtherLoan?.loan?.scheme.interestRate) /
  //       100) *
  //       (12 * differenceInDays)) /
  //     365
  //   ).toFixed(2)
  // );
  //   setValue('penalty', penaltyPer);
  //   setValue(
  //     'totalPay',
  //     (
  //       Number(watch('interestAmount')) + Number(watch('penalty') - Number(watch('uchakAmount')))
  //     ).toFixed(2)
  //   );
  //   setValue(
  //     'payAfterAdjusted1',
  //     (Number(watch('totalPay')) + Number(watch('oldCrDr'))).toFixed(2)
  //   );
  //   setValue(
  //     'cr_dr',
  //     (Number(watch('payAfterAdjusted1')) - Number(watch('amountPaid'))).toFixed(2)
  //   );
  // }, [from, to, setValue, penalty, watch('amountPaid'), watch('oldCrDr')]);
  const updateRenewalDate = (id) => {
    const date = currentOtherLoan.date;
    const fromDate = watch('from');
    const month = currentOtherLoan.month;

    const monthsToAdd =
      month === 'MONTHLY' ? 1 : month === 'YEARLY' ? 12 : parseInt(month.split(' ')[0], 10) || 0;

    const calculatedDate = new Date(date);
    const calculatedDateRenewalDate = new Date(fromDate);
    if (id) {
      calculatedDateRenewalDate.setMonth(calculatedDateRenewalDate.getMonth() - monthsToAdd);
    } else {
      calculatedDateRenewalDate.setMonth(calculatedDateRenewalDate.getMonth() + monthsToAdd);
    }

    if (calculatedDate && calculatedDateRenewalDate) {
      const payload = {
        ...currentOtherLoan,
        date: calculatedDate,
        renewalDate: calculatedDateRenewalDate,
      };
      axios
        .put(
          `${import.meta.env.VITE_BASE_URL}/${user?.company}/other-loans/${currentOtherLoan?._id}`,
          payload
        )
        .then((response) => {
          console.log(response);
          mutate();
          refetchOtherLoanInterest();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

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
      from: new Date(data.from),
      days: data.days,
      amountPaid: data.amountPaid,
      interestAmount: data.interestAmount,
      payAfterAdjust: data.payAfterAdjusted,
      remark: data.remark,
      paymentDetail,
    };

    try {
      const url = `${import.meta.env.VITE_BASE_URL}/${user._id}/other-loans/${currentOtherLoan?._id}/interest`;
      const config = {
        method: 'post',
        url,
        data: payload,
      };
      const response = await axios(config);
      reset();
      mutate();
      refetchOtherLoanInterest();
      enqueueSnackbar(response?.data.message);
      updateRenewalDate();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to pay interest', { variant: 'error' });
    }
  });

  const handleCashAmountChange = (event) => {
    const newCashAmount = parseFloat(event.target.value) || '';
    const currentOtherLoanAmount = parseFloat(watch('payAfterAdjusted')) || '';

    if (newCashAmount > currentOtherLoanAmount) {
      setValue('cashAmount', currentOtherLoanAmount);
      enqueueSnackbar('Cash amount cannot be Pay after adjusted than the loan amount.', {
        variant: 'warning',
      });
    } else {
      setValue('cashAmount', newCashAmount);
    }
    if (watch('paymentMode') === 'Both') {
      const calculatedBankAmount = currentOtherLoanAmount - newCashAmount;
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
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/${user._id}/other-loans/${currentOtherLoan._id}/interest/${id}`
      );
      setDeleteId(null);
      confirm.onFalse();
      updateRenewalDate(id);
      refetchOtherLoanInterest();
      mutate();
      enqueueSnackbar(response?.data.message, { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Failed to pay interest', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ py: 0 }}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box
          rowGap={1.5}
          columnGap={1.5}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(7, 1fr)',
          }}
        >
          <RHFDatePicker name="from" control={control} label="From Date" req={'red'} />
          <RHFDatePicker name="to" control={control} label="To Date" req={'red'} />
          <RHFTextField name="days" label="Days" req={'red'} InputProps={{ readOnly: true }} />
          <RHFTextField name="interest" label="Interest" req={'red'} />
          {/*<RHFTextField name='consultingCharge' label='Consult Charge' req={'red'} InputProps={{ readOnly: true }} />*/}
          {/*<RHFTextField name='uchakAmount' label='Uchak Amount' req={'red'} InputProps={{ readOnly: true }} />*/}
          {/*<RHFTextField name='penalty' label='Penalty' req={'red'} InputProps={{ readOnly: true }} />*/}
          {/*<RHFTextField name='totalPay' label='Total Pay' req={'red'} InputProps={{ readOnly: true }} />*/}
          {/*<RHFTextField name='oldCrDr' label='Old CR/DR' req={'red'} InputProps={{ readOnly: true }} />*/}
          {/*<RHFTextField name='cr_dr' label='New CR/DR' req={'red'} InputProps={{ readOnly: true }} />*/}
          <RHFTextField
            name="interestAmount"
            label="Interest Amount"
            req={'red'}
            disabled
            onKeyPress={(e) => {
              if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                e.preventDefault();
              }
            }}
          />
          <RHFTextField
            name="amountPaid"
            label="Total Pay Amount"
            req={'red'}
            disabled
            onKeyPress={(e) => {
              if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                e.preventDefault();
              }
            }}
          />
          <RHFTextField name="payAfterAdjusted" label="Pay After Adjusted" req={'red'} />
        </Box>
        <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
          Payment Details
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ width: '90%' }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
              sx={{ mt: 1 }}
            >
              <RHFAutocomplete
                name="paymentMode"
                label="Payment Mode"
                req="red"
                options={['Cash', 'Bank', 'Both']}
                getOptionLabel={(option) => option}
                onChange={(event, value) => {
                  setValue('paymentMode', value);
                  handleLoanAmountChange({ target: { value: watch('payAfterAdjusted') } });
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              {watch('paymentMode') === 'Cash' || watch('paymentMode') === 'Both' ? (
                <Controller
                  name="cashAmount"
                  control={control}
                  render={({ field }) => (
                    <RHFTextField
                      {...field}
                      label="Cash Amount"
                      req={'red'}
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
                    name="account"
                    label="Account"
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
                    name="bankAmount"
                    control={control}
                    render={({ field }) => (
                      <RHFTextField
                        {...field}
                        label="Bank Amount"
                        req={'red'}
                        disabled={watch('paymentMode') === 'Bank' ? false : true}
                        inputProps={{ min: 0 }}
                      />
                    )}
                  />
                </>
              )}
            </Box>
          </Box>
          {currentOtherLoan.status !== 'Closed' && (
            <Box xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end', gap: 1 }}>
              <Button
                color="inherit"
                sx={{ height: '36px' }}
                variant="outlined"
                onClick={() => reset()}
              >
                Reset
              </Button>
              {getResponsibilityValue('update_loanPayHistory', configs, user) && (
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Submit
                </LoadingButton>
              )}
            </Box>
          )}
        </Box>
      </FormProvider>
      <Box>
        <Box
          sx={{
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
          }}
        >
          <Table sx={{ borderRadius: '16px', my: 2.5, minWidth: '1500px' }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              onSort={table.onSort}
            />
            <TableBody>
              {otherLoanInterest.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ py: 0, px: 2 }}>{fDate(row.from)}</TableCell>
                  <TableCell sx={{ py: 0, px: 2 }}>{fDate(row.to)}</TableCell>
                  <TableCell sx={{ py: 0, px: 2 }}>{row.days}</TableCell>
                  <TableCell sx={{ py: 0, px: 2 }}>{row.payAfterAdjust}</TableCell>
                  <TableCell sx={{ py: 0, px: 2 }}>{fDate(row.createdAt)}</TableCell>
                  <TableCell sx={{ py: 0, px: 2 }}>
                    {
                      <IconButton
                        color="error"
                        onClick={() => {
                          if (index === 0) {
                            confirm.onTrue();
                            setDeleteId(row?._id);
                          }
                        }}
                        sx={{
                          cursor: index === 0 ? 'pointer' : 'default',
                          opacity: index === 0 ? 1 : 0.5,
                          pointerEvents: index === 0 ? 'auto' : 'none',
                        }}
                      >
                        <Iconify icon="eva:trash-2-outline" />
                      </IconButton>
                    }
                  </TableCell>
                  {getResponsibilityValue('print_loanPayHistory_detail', configs, user) ? (
                    <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer', py: 0, px: 1 }}>
                      {
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
                          <Iconify icon="basil:document-solid" />
                        </Typography>
                      }
                    </TableCell>
                  ) : (
                    <TableCell>'-'</TableCell>
                  )}
                </TableRow>
              ))}
              <TableRow sx={{ backgroundColor: '#F4F6F8' }}>
                {/*<TableCell padding="checkbox" />*/}
                <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}>
                  TOTAL
                </TableCell>
                <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}></TableCell>
                <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}>
                  {day}
                </TableCell>
                <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}>
                  {payAmt}
                </TableCell>
                <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}></TableCell>
                <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}></TableCell>
                <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 2 }}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Box>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={() => handleDeleteInterest(deleteId)}>
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
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <InterestPdf data={data} configs={configs} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

export default InterestPayDetailsForm;
