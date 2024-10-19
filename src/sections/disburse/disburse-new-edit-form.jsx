import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFAutocomplete,
  RHFTextField,
} from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useGetBranch } from '../../api/branch';
import CardContent from '@mui/material/CardContent';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import { paths } from '../../routes/paths';
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

export default function DisburseNewEditForm({ currentDisburse }) {
  const [cashPendingAmt,setCashPendingAmt] = useState(0)
  const [bankPendingAmt,setBankPendingAmt] = useState(0)

  const paymentSchema = currentDisburse.paymentMode === 'Bank' ? {
    bankNetAmount: Yup.number().required('Bank Net Amount is required'),
    payingBankAmount: Yup.string().required('Bank Paying Amount is required'),
    bankPendingAmount: Yup.number().required('Bank Pending Amount is required'),
    companyBankDetail: Yup.object().shape({
      account: Yup.object().required('Account is required'),
      transactionID: Yup.string().required('Transaction ID is required'),
    }),
  } : currentDisburse.paymentMode === 'Cash' ? {
    cashNetAmount: Yup.number().required('Cash Net Amount is required'),
    payingCashAmount: Yup.string().required('Cash Paying Amount is required'),
    cashPendingAmount: Yup.number().required('Cash Pending Amount is required'),
  } : {
    cashNetAmount: Yup.number().required('Cash Net Amount is required'),
    payingCashAmount: Yup.string().required('Cash Paying Amount is required'),
    cashPendingAmount: Yup.number().required('Cash Pending Amount is required'),
    bankNetAmount: Yup.number().required('Bank Net Amount is required'),
    payingBankAmount: Yup.string().required('Bank Paying Amount is required'),
    bankPendingAmount: Yup.number().required('Bank Pending Amount is required'),
    companyBankDetail: Yup.object().shape({
      account: Yup.object().required('Account is required'),
      transactionID: Yup.string().required('Transaction ID is required'),
    }),
  };
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { branch } = useGetBranch();
  const NewDisburse = Yup.object().shape({
    loanNo: Yup.string().required('Loan No is required'),
    customerName: Yup.string().required('Customer Name is required'),
    loanAmount: Yup.string().required('Loan Amount is required'),
    interest: Yup.string().required('Interest is required'),
    scheme: Yup.string().required('Scheme Name is required'),
    address: Yup.string().required('Address is required'),
    branch: Yup.string().required('Branch is required'),
    ...paymentSchema
  });

  const defaultValues = useMemo(
    () => (
      {
        loanNo: currentDisburse?.loanNo || '',
        customerName: `${currentDisburse?.customer?.firstName || ''} ${currentDisburse?.customer?.lastName || ''}`,
        loanAmount: currentDisburse?.loanAmount || '',
        interest: currentDisburse?.scheme?.interestRate || '',
        scheme: currentDisburse?.scheme?.name || '',
        valuation: currentDisburse?.valuation || '',
        address: currentDisburse?.customer?.permanentAddress?.street || '',
        branch: currentDisburse?.customer?.branch?.name || '',
        bankNetAmount: currentDisburse?.bankAmount || 0,
        payingBankAmount: currentDisburse?.payingBankAmount || 0,
        bankPendingAmount: currentDisburse?.bankPendingAmount || 0,
        bankDate: currentDisburse?.issueDate ? new Date(currentDisburse.issueDate) : new Date(),
        cashNetAmount: currentDisburse?.cashAmount || 0,
        payingCashAmount: currentDisburse?.payingCashAmount || 0,
        cashPendingAmount: currentDisburse?.cashPendingAmount || 0,
        cashDate: currentDisburse?.date ? new Date(currentDisburse.issueDate) : new Date(),
        items: currentDisburse?.propertyDetails?.map(item => ({
          propertyName: item.type || '',
          totalWeight: item.totalWeight || '',
          loseWeight: item.lossWeight || '',
          grossWeight: item.grossWeight || '',
          netWeight: item.netWeight || '',
          loanApplicableAmount: item.netAmount || '',
        })) || [],
        companyBankDetail: {
          account: currentDisburse?.companyBankDetail?.account || null,
          transactionID: currentDisburse?.companyBankDetail?.transactionID || '',
        },
      }
    ),
    [currentDisburse],
  );

  const methods = useForm({
    resolver: yupResolver(NewDisburse),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
    getValues,
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    setCashPendingAmt(watch('cashNetAmount') - watch('payingCashAmount'))
  },[watch('cashNetAmount') , watch('payingCashAmount')])
  useEffect(() => {
    setBankPendingAmt(watch('bankNetAmount') - watch('payingBankAmount'))
  },[watch('bankNetAmount') , watch('payingBankAmount')])
  console.log();
  const handleRemove = (index) => {
    remove(index);
  };
  const handleAdd = () => {
    append({
      propertyName: '',
      totalWeight: '',
      loseWeight: '',
      grossWeight: '',
      netWeight: '',
      loanApplicableAmount: '',
    });
  };
  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        loan: currentDisburse._id,
        companyBankDetail: data.companyBankDetail,
        bankAmount: data.bankAmount,
        cashAmount: data.cashAmount,
        pendingBankAmount: bankPendingAmt,
        pendingCashAmount: cashPendingAmt,
        payingBankAmount: data.payingBankAmount,
        payingCashAmount:data.payingCashAmount,

      };
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/disburse-loan`, payload);
      router.push(paths.dashboard.disburse.list);
      enqueueSnackbar(res?.data.message);
      reset();

    } catch (error) {
      enqueueSnackbar(currentDisburse ? 'Failed To update scheme' : 'Failed to create Scheme');
      console.error(error, 'ree');
    }
  });
  const handleCashAmountChange = (event) => {
    const cashPayingAmount = parseFloat(event.target.value) || '';
    const cashNetAmount = parseFloat(getValues('cashNetAmount')) || '';

    if (cashPayingAmount > cashNetAmount) {
      setValue('payingCashAmount', cashNetAmount);
      enqueueSnackbar('Cash paying amount cannot be greater than the Net Amount.', { variant: 'warning' });
    }
  };
  const handleBankAmountChange = (event) => {
    const bankPayingAmount = parseFloat(event.target.value) || '';
    const bankNetAmount = parseFloat(getValues('bankNetAmount')) || '';

    if (bankPayingAmount > bankNetAmount) {
      setValue('payingBankAmount', bankNetAmount);
      enqueueSnackbar('Bank paying amount cannot be greater than the Net Amount.', { variant: 'warning' });
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Loan Disburse
          </Typography>
        </Grid>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name='loanNo' label='Loan No' req={'red'} />
              <RHFTextField name='customerName' label='Customer Name' req={'red'} />
              <RHFTextField name='loanAmount' label='Loan Amount' req={'red'} />
              <RHFTextField name='interest' label='Interest' req={'red'} />
              <RHFTextField name='scheme' label='Scheme Name' req={'red'} />
              <RHFTextField name='address' label='Address' req={'red'} />
              <RHFTextField name='branch' label='Branch' req={'red'} />

            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={12}>
          <Card
            sx={{ margin: '0px 0px 20px 0px' }}
          >
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Property Details
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ '&:hover': { backgroundColor: 'inherit' } }}>
                      <TableCell><strong>Property Name</strong></TableCell>
                      <TableCell><strong>Total Weight</strong></TableCell>
                      <TableCell><strong>Lose Weight</strong></TableCell>
                      <TableCell><strong>Gross Weight</strong></TableCell>
                      <TableCell><strong>Net Weight</strong></TableCell>
                      <TableCell width={200}><strong>Loan Applicable amount</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((row, index) => (
                      <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: 'inherit' } }}>
                        <TableCell>
                          <RHFTextField
                            name={`propertyDetails.${index}.propertyName`}
                            label='Property Name'
                            defaultValue={row.propertyName || ''}
                            disabled={true}
                          />
                        </TableCell>
                        <TableCell>
                          <RHFTextField
                            name={`propertyDetails.${index}.totalWeight`}
                            label='Total Weight'
                            defaultValue={(parseFloat(row.totalWeight) || 0.00).toFixed(2)}
                            disabled={true}
                          />
                        </TableCell>
                        <TableCell>
                          <RHFTextField
                            name={`propertyDetails.${index}.loseWeight`}
                            label='Lose Weight'
                            defaultValue={(parseFloat(row.loseWeight) || 0.00).toFixed(2)}
                            disabled={true}
                          />
                        </TableCell>
                        <TableCell>
                          <RHFTextField
                            name={`propertyDetails.${index}.grossWeight`}
                            label='Gross Weight'
                            defaultValue={(parseFloat(row.grossWeight) || 0.00).toFixed(2)}
                            disabled={true}
                          />
                        </TableCell>
                        <TableCell>
                          <RHFTextField
                            name={`propertyDetails.${index}.netWeight`}
                            label='Net Weight'
                            defaultValue={(parseFloat(row.netWeight) || 0.00).toFixed(2)}
                            disabled={true}
                          />
                        </TableCell>
                        <TableCell>
                          <RHFTextField
                            name={`propertyDetails.${index}.loanApplicableAmount`}
                            label='Loan Applicable Amount'
                            defaultValue={(parseFloat(row.loanApplicableAmount) || 0.00).toFixed(2)}
                            disabled={true}

                          />
                        </TableCell>
                        <TableCell>


                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={4} py={5}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Transaction Type
          </Typography>
        </Grid>
        <Grid xs={12} md={8} py={5}>
          <Card>
            <Stack spacing={3} sx={{ p: 3 }}>
              {(currentDisburse.paymentMode === 'Bank' || currentDisburse.paymentMode === 'Both') && (
                <>
                  <Typography my={2} sx={{ display: 'inline-block' }}>
                    Bank Amount
                  </Typography>
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display='grid'
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                    }}
                  >
                    <RHFTextField name='bankNetAmount' label='Net Amount' req={'red'} onKeyPress={(e) => {
                      if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                        e.preventDefault();
                      }
                    }} />
                    <Controller
                      name='payingBankAmount'
                      control={control}
                      render={({ field }) => (
                        <RHFTextField
                          {...field}
                          label='Paying Amount'
                          req={'red'}
                          type='number'
                          inputProps={{ min: 0 }}
                          onChange={(e) => {
                            field.onChange(e);
                            handleBankAmountChange(e);
                          }}
                          onKeyPress={(e) => {
                            if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                              e.preventDefault();
                            }
                          }}
                        />
                      )}
                    />
                    <RHFTextField name='bankPendingAmount' label='Pending Amount' req={'red'}
                                  value={watch('bankNetAmount') - watch('payingBankAmount') || 0}
                                  InputLabelProps={{ shrink: true }} />
                    <RHFAutocomplete
                      name='companyBankDetail.account'
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
                      onChange={(event, value) => {
                        setValue('companyBankDetail.account', value);
                      }}
                    />
                    <RHFTextField name='companyBankDetail.transactionID' label='Transaction ID' req={'red'} />
                    <Controller
                      name='bankDate'
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          label='Date'
                          value={field.value}
                          onChange={(newValue) => field.onChange(newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!error,
                              helperText: error?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                </>
              )}

              {(currentDisburse.paymentMode === 'Cash' || currentDisburse.paymentMode === 'Both') && (
                <>
                  <Typography my={2} sx={{ display: 'inline-block' }}>
                    Cash Amount
                  </Typography>
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display='grid'
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                    }}
                  >

                    <RHFTextField name='cashNetAmount' label='Net Amount' req={'red'}
                                  onKeyPress={(e) => {
                                    if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                                      e.preventDefault();
                                    }
                                  }}
                    />
                    <Controller
                      name='payingCashAmount'
                      control={control}
                      render={({ field }) => (
                        <RHFTextField
                          {...field}
                          label='Paying Amount'
                          req={'red'}
                          type='number'
                          inputProps={{ min: 0 }}
                          onChange={(e) => {
                            field.onChange(e);
                            handleCashAmountChange(e);
                          }}
                          onKeyPress={(e) => {
                            if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                              e.preventDefault();
                            }
                          }}
                        />
                      )}
                    />

                    <RHFTextField name='cashPendingAmount' label='Pending Amount' req={'red'}
                                  value={parseFloat(watch('cashNetAmount') - watch('payingCashAmount') || 0)}
                                  InputLabelProps={{ shrink: true }}
                                  onKeyPress={(e) => {
                                    if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                                      e.preventDefault();
                                    }
                                  }}
                    />
                    <Controller
                      name='cashDate'
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          label='Date'
                          value={field.value}
                          onChange={(newValue) => field.onChange(newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!error,
                              helperText: error?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                </>
              )}
            </Stack>
          </Card>
          {
            currentDisburse.status !== "Disbursed" &&
          <Stack alignItems={"end"} mt={3}>
            <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
              Submit
            </LoadingButton>
          </Stack>
          }
        </Grid>
      </Grid>
    </FormProvider>
  );
}

DisburseNewEditForm.propTypes = {
  currentScheme: PropTypes.object,
};
