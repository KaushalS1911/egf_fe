import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFAutocomplete, RHFSelect, RHFSwitch,
  RHFTextField,
} from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useGetBranch } from '../../api/branch';
import Iconify from '../../components/iconify';
import CardContent from '@mui/material/CardContent';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { paths } from '../../routes/paths';
import { useGetScheme } from '../../api/scheme';

// ----------------------------------------------------------------------

export default function DisburseNewEditForm({ currentDisburse }) {

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { branch } = useGetBranch();
  const NewDisburse = Yup.object().shape({
    loanNo: Yup.string().required('Loan No is required'),
    customerName: Yup.string().required('Customer Name is required'),
    loanAmount: Yup.string().required('Loan Amount is required'),
    interest: Yup.string().required('Interest is required'),
    scheme: Yup.string().required('Scheme Name is required'),
    valuation: Yup.string().required('Valuation is required'),
    address: Yup.string().required('Address is required'),
    branch: Yup.string().required('Branch is required'),
    bankNetAmount: Yup.number().required('Bank Net Amount is required'),
    bankPayingAmount: Yup.number().required('Bank Paying Amount is required'),
    bankPendingAmount: Yup.number().required('Bank Pending Amount is required'),
    cashNetAmount: Yup.number().required('Cash Net Amount is required'),
    cashPayingAmount: Yup.number().required('Cash Paying Amount is required'),
    cashPendingAmount: Yup.number().required('Cash Pending Amount is required'),
    items: Yup.array().of(
      Yup.object().shape({
        propertyName: Yup.string().required('Property Name is required'),
        totalWeight: Yup.string().required('Total Weight is required'),
        loseWeight: Yup.string().required('Lose Weight is required'),
        grossWeight: Yup.string().required('Gross Weight is required'),
        netWeight: Yup.string().required('Net Weight is required'),
        loanApplicableAmount: Yup.string().required('Loan Applicable Amount is required'),
      }),
    ).required('At least one item is required'),
    companyBankDetail: Yup.object().shape({
      account: Yup.string().required('Account Number is required'),
      transactionID: Yup.string().required('Transaction ID is required'),
    }),

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
        branch: currentDisburse?.branch || '',
        bankNetAmount: currentDisburse?.bankAmount || 0,
        bankPayingAmount: currentDisburse?.bankPayingAmount || 0,
        bankPendingAmount: currentDisburse?.pendingAmount || 0,
        bankDate: currentDisburse?.issueDate ? new Date(currentDisburse.issueDate) : new Date(),
        cashNetAmount: currentDisburse?.cashAmount || 0,
        cashPayingAmount: currentDisburse?.cashPayingAmount || 0,
        cashPendingAmount: currentDisburse?.pendingAmount || 0,
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
          account: currentDisburse?.account || null,
          transactionID: currentDisburse?.transactionID || '',
        },
      }
    ),
    [currentDisburse],
  );

  const methods = useForm({
    // resolver: yupResolver(NewDisburse),
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
        customer: currentDisburse.customer._id,
        pendingBankAmount: data.bankPendingAmount,
        pendingCashAmount: data.cashPendingAmount,
        loanAmount: data.loanAmount,
        interest: data.interest,
        scheme: data.scheme,
        address: data.address,
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
              {/*<RHFAutocomplete*/}
              {/*  name='scheme'*/}
              {/*  label='Scheme Name'*/}
              {/*  req={'red'}*/}
              {/*  fullWidth*/}
              {/*  options={scheme?.map((item) => item.name)}*/}
              {/*  getOptionLabel={(option) => option}*/}
              {/*  renderOption={(props, option) => (*/}
              {/*    <li {...props} key={option}>*/}
              {/*      {option}*/}
              {/*    </li>*/}
              {/*  )}*/}
              {/*/>*/}
              <RHFTextField name='address' label='Address' req={'red'} />
              <RHFAutocomplete
                name='branch'
                label='Branch'
                req={'red'}
                fullWidth
                options={branch.map((item) => item.name)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            </Box>
          </Card>
        </Grid>

        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }} py={2}>
            <Typography variant='h6' gutterBottom>
              Property Details
            </Typography>
            <Button
              size='small'
              variant='contained'
              color='primary'
              startIcon={<Iconify icon='mingcute:add-line' />}
              onClick={handleAdd}
            >
              Add Property
            </Button>

          </Box>
          <TableContainer>

            <Table>
              <TableHead>
                <TableRow sx={{ '&:hover': { backgroundColor: 'inherit' } }}>
                  <TableCell><strong>Property Name</strong></TableCell>
                  <TableCell><strong>Total Weight</strong></TableCell>
                  <TableCell><strong>Lose Weight</strong></TableCell>
                  <TableCell><strong>Gross Weight</strong></TableCell>
                  <TableCell><strong>Net Weight</strong></TableCell>
                  <TableCell><strong>Loan Applicable amount</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
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
                        defaultValue={row.totalWeight || ''}
                        disabled={true}
                      />
                    </TableCell>
                    <TableCell>
                      <RHFTextField
                        name={`propertyDetails.${index}.loseWeight`}
                        label='Lose Weight'
                        defaultValue={row.loseWeight || ''}
                        disabled={true}
                      />
                    </TableCell>
                    <TableCell>
                      <RHFTextField
                        name={`propertyDetails.${index}.grossWeight`}
                        label='Gross Weight'
                        defaultValue={row.grossWeight || ''}
                        disabled={true}
                      />
                    </TableCell>
                    <TableCell>
                      <RHFTextField
                        name={`propertyDetails.${index}.netWeight`}
                        label='Net Weight'
                        defaultValue={row.netWeight || ''}
                        disabled={true}
                      />
                    </TableCell>
                    <TableCell>
                      <RHFTextField
                        name={`propertyDetails.${index}.loanApplicableAmount`}
                        label='Loan Applicable Amount'
                        defaultValue={row.loanApplicableAmount || ''}
                        disabled={true}

                      />
                    </TableCell>
                    <TableCell>
                      {/*<IconButton onClick={() => handleReset(index)}>*/}
                      {/*  <Iconify icon='ic:baseline-refresh' />*/}
                      {/*</IconButton>*/}
                      <IconButton
                        color='error'
                        onClick={() => handleRemove(index)}
                      >
                        <Iconify icon='solar:trash-bin-trash-bold' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
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
                    <RHFTextField name='bankPayingAmount' label='Paying Amount' req={'red'} onKeyPress={(e) => {
                      if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                        e.preventDefault();
                      }
                    }} />
                    <RHFTextField name='bankPendingAmount' label='Pending Amount' req={'red'}
                                  value={watch('bankNetAmount') - watch('bankPayingAmount') || 0}
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
                    <RHFTextField name='cashPayingAmount' label='Paying Amount' req={'red'}
                                  onKeyPress={(e) => {
                                    if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                                      e.preventDefault();
                                    }
                                  }}
                    />
                    <RHFTextField name='cashPendingAmount' label='Pending Amount' req={'red'}
                                  value={parseFloat(watch('cashNetAmount') - watch('cashPayingAmount') || 0)}
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
          <Stack alignItems='flex-end' sx={{ mt: 3 }}>
            <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
              {currentDisburse ? 'Save Disburse' : 'Create Disburse'}
            </LoadingButton>
          </Stack>
        </Grid>

      </Grid>
    </FormProvider>
  );
}

DisburseNewEditForm.propTypes = {
  currentScheme: PropTypes.object,
};
