import * as Yup from 'yup';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormProvider, { RHFAutocomplete, RHFTextField, RHFUpload, RHFUploadAvatar } from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSnackbar } from 'src/components/snackbar';
import {
  CardActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useGetScheme } from '../../api/scheme';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Iconify from '../../components/iconify';
import { useGetCustomer } from '../../api/customer';
import { ACCOUNT_TYPE_OPTIONS, paymentMethods } from '../../_mock';
import { useGetAllProperty } from '../../api/property';
import { useGetCarat } from '../../api/carat';
import { useGetConfigs } from '../../api/config';
import { useRouter } from '../../routes/hooks';
import { paths } from '../../routes/paths';
import { useGetBranch } from '../../api/branch';

// ----------------------------------------------------------------------

export default function LoanissueNewEditForm({ currentLoanIssue }) {
  const router = useRouter();
  const [customerId, setCustomerID] = useState();
  const [customerData, setCustomerData] = useState();
  const [schemeId, setSchemeID] = useState();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const { branch } = useGetBranch();
  const { customer } = useGetCustomer();
  const { scheme } = useGetScheme();
  const { property } = useGetAllProperty();
  const { carat } = useGetCarat();
  const { enqueueSnackbar } = useSnackbar();
  const [multiSchema, setMultiSchema] = useState([]);
  const [isFieldsEnabled, setIsFieldsEnabled] = useState(false);
  const [totalWeightError, setTotalWeightError] = useState('');
  const [lossWeightError, setLossWeightError] = useState('');
  const storedBranch = sessionStorage.getItem('selectedBranch');

  useEffect(() => {
    setMultiSchema(scheme);
  }, [scheme]);

  const NewLoanissueSchema = Yup.object().shape({
    customer: Yup.object().required('Customer is required'),
    scheme: Yup.object().required('Scheme is required'),
    issueDate: Yup.date().required('Issue Date is required'),
    jewellerName: Yup.string().required('Jeweller Name is required'),
    loanAmount: Yup.number().required('Loan Amount is required'),
    paymentMode: Yup.string().required('Payment Mode is required'),
    cashAmount: Yup.number().required('Cash Amount is required'),
  });

  const defaultValues = useMemo(() => {
    const baseValues = {
      customer_url: '',
      customerCode: '',
      customerName: null,
      customerAddress: null,
      contact: '',
      contactOtp: '',
      interestRate: '',
      periodTime: '',
      renewalTime: '',
      loanCloseTime: '',
      property_image: currentLoanIssue?.propertyImage || '',
      customer: currentLoanIssue ? {
        id: currentLoanIssue?.customer?._id,
        name: currentLoanIssue?.customer?.firstName + ' ' + currentLoanIssue?.customer?.lastName,
      } : null,
      scheme: currentLoanIssue ? currentLoanIssue?.scheme : null,
      loanNo: currentLoanIssue?.loanNo || '',
      issueDate: currentLoanIssue ? new Date(currentLoanIssue?.issueDate) : null,
      consultingCharge: currentLoanIssue?.consultingCharge || 200,
      nextInstallmentDate: currentLoanIssue ? new Date(currentLoanIssue?.nextInstallmentDate) : null,
      jewellerName: currentLoanIssue?.jewellerName || '',
      loanAmount: currentLoanIssue?.loanAmount || '',
      paymentMode: currentLoanIssue?.paymentMode || '',
      cashAmount: currentLoanIssue?.cashAmount || '',
      bankAmount: currentLoanIssue?.bankAmount || 0,
      accountNumber: currentLoanIssue?.customerBankDetail?.accountNumber || '',
      accountType: currentLoanIssue?.customerBankDetail?.accountType || '',
      accountHolderName: currentLoanIssue?.customerBankDetail?.accountHolderName || '',
      IFSC: currentLoanIssue?.customerBankDetail?.IFSC || '',
      bankName: currentLoanIssue?.customerBankDetail?.bankName || '',
      branchName: currentLoanIssue?.customerBankDetail?.branchName || null,
      propertyDetails: currentLoanIssue?.propertyDetails || [
        {
          type: '',
          carat: '',
          pcs: '',
          totalWeight: '',
          lossWeight: '',
          grossWeight: '',
          netWeight: '',
          grossAmount: '',
          netAmount: '',
        },
      ],
    };
    return baseValues;
  }, [currentLoanIssue]);

  const methods = useForm({
    resolver: yupResolver(NewLoanissueSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'propertyDetails',
  });

  const handleAdd = () => {
    append({
      type: '',
      carat: '',
      pcs: '',
      totalWeight: '',
      lossWeight: '',
      grossWeight: '',
      netWeight: '',
      grossAmount: '',
      netAmount: '',
    });
  };

  const handleReset = (index) => {
    methods.setValue(`propertyDetails[${index}]`, {
      type: '',
      carat: '',
      pcs: '',
      totalWeight: '',
      lossWeight: '',
      grossWeight: '',
      netWeight: '',
      grossAmount: '',
      netAmount: '',
    });
  };

  const handleRemove = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const propertyDetails = watch('propertyDetails');
    const payload = new FormData();
    payload.append('company', user.company);
    payload.append('customer', data.customer.id);
    payload.append('scheme', currentLoanIssue ? data.scheme._id : data.scheme.id);
    payload.append('loanNo', data.loanNo);
    payload.append('issueDate', data.issueDate);
    payload.append('nextInstallmentDate', data.nextInstallmentDate);
    payload.append('consultingCharge', data.consultingCharge);
    payload.append('jewellerName', data.jewellerName);

    propertyDetails.forEach((field, index) => {
      payload.append(`propertyDetails[${index}][type]`, field.type);
      payload.append(`propertyDetails[${index}][carat]`, field.carat);
      payload.append(`propertyDetails[${index}][pcs]`, field.pcs);
      payload.append(`propertyDetails[${index}][totalWeight]`, field.totalWeight);
      payload.append(`propertyDetails[${index}][lossWeight]`, field.lossWeight);
      payload.append(`propertyDetails[${index}][grossWeight]`, field.grossWeight);
      payload.append(`propertyDetails[${index}][netWeight]`, field.netWeight);
      payload.append(`propertyDetails[${index}][grossAmount]`, field.grossAmount);
      payload.append(`propertyDetails[${index}][netAmount]`, field.netAmount);
    });

    if (data.property_image) {
      payload.append('property-image', data.property_image);
    }

    payload.append('loanAmount', parseFloat(data.loanAmount));
    payload.append('interestLoanAmount', parseFloat(data.loanAmount));
    payload.append('paymentMode', data.paymentMode);
    payload.append('cashAmount', parseFloat(data.cashAmount));
    payload.append('bankAmount', parseFloat(data.bankAmount));
    payload.append('issuedBy', user._id);

    if (['Bank', 'Both'].includes(watch('paymentMode'))) {
      payload.append('customerBankDetail[accountNumber]', data.accountNumber);
      payload.append('customerBankDetail[accountType]', data.accountType);
      payload.append('customerBankDetail[accountHolderName]', data.accountHolderName);
      payload.append('customerBankDetail[IFSC]', data.IFSC);
      payload.append('customerBankDetail[bankName]', data.bankName);
      payload.append('customerBankDetail[branchName]', data.branchName);
    }

    try {
      const url = currentLoanIssue
        ? `${import.meta.env.VITE_BASE_URL}/${user?.company}/loans/${currentLoanIssue?._id}`
        : `${import.meta.env.VITE_BASE_URL}/${user?.company}/issue-loan`;

      const response = currentLoanIssue ? await axios.put(url, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }) : await axios.post(url, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      enqueueSnackbar('Loan processed successfully!', { variant: 'success' });
      router.push(paths.dashboard.loanissue.root);
      reset();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to process loan.', { variant: 'error' });
    }
  });

  const handleDropSingleFile = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (newFile) {
        setValue('property_image', newFile, { shouldValidate: true });
      }
    },
    [setValue],
  );

  const handleCustomerSelect = (selectedCustomer) => {
    if (selectedCustomer) {
      setIsFieldsEnabled(true);
    } else {
      setIsFieldsEnabled(false);
    }
  };

  useEffect(() => {
    const customer = watch('customer');
    const scheme = watch('scheme');
    if (customer) {
      handleCustomerSelect(customer);
      setCustomerID(customer);
    } else {
      setCustomerID(null);
    }
    if (scheme) {
      setSchemeID(scheme);
    } else {
      setSchemeID(null);
    }
  }, [watch('customer'), watch('scheme'), currentLoanIssue]);

  useEffect(() => {
    const findedCus = customer?.find((item) => item?._id === customerId?.id);
    setCustomerData(findedCus);
    if (findedCus) {
      setValue('customerCode', findedCus?.customerCode);
      setValue('customerName', `${findedCus?.firstName} ${findedCus?.lastName}`);
      setValue('customerAddress', `${findedCus?.permanentAddress?.street} ${findedCus?.permanentAddress?.landmark} ${findedCus.permanentAddress?.city}`);
      setValue('contact', findedCus?.contact);
      setValue('contactOtp', findedCus?.otpContact);
      setValue('customer_url', findedCus?.avatar_url);
      if (!currentLoanIssue) {
        setValue('accountNumber', findedCus?.bankDetails?.accountNumber);
        setValue('accountType', findedCus?.bankDetails?.accountType);
        setValue('accountHolderName', findedCus?.bankDetails?.accountHolderName);
        setValue('IFSC', findedCus?.bankDetails?.IFSC);
        setValue('bankName', findedCus?.bankDetails?.bankName);
        setValue('branchName', findedCus?.bankDetails?.branchName);
      }
    } else {
      setValue('customerCode', '');
      setValue('customerName', '');
      setValue('customerAddress', '');
      setValue('contact', '');
      setValue('contactOtp', '');
      setValue('customer_url', '');
      if (!currentLoanIssue) {
        setValue('accountNumber', '');
        setValue('accountType', '');
        setValue('accountHolderName', '');
        setValue('IFSC', '');
        setValue('bankName', '');
        setValue('branchName', '');
      }
    }
  }, [customerId, customer, setValue]);

  useEffect(() => {
      if (scheme && scheme.length > 0 && schemeId) {
        const findedSch = currentLoanIssue ? scheme?.find((item) => item?._id === schemeId._id) : scheme?.find((item) => item?._id === schemeId.id);
        if (findedSch) {
          setValue('interestRate', findedSch.interestRate);
          setValue('periodTime', findedSch.interestPeriod);
          setValue('renewalTime', findedSch.renewalTime);
          setValue('loanCloseTime', findedSch.minLoanTime);
        } else {
          setValue('interestRate', '');
          setValue('periodTime', '');
          setValue('renewalTime', '');
          setValue('loanCloseTime', '');
        }
      }
    },
    [schemeId, scheme, setValue, reset, getValues],
  );

  const calculateTotal = (field) => {
    const propertyDetails = useWatch({ name: 'propertyDetails', control: methods.control });
    if (!propertyDetails || propertyDetails.length === 0) return 0;
    return propertyDetails
      .reduce((total, item) => {
        const value = parseFloat(item?.[field]) || 0;
        return total + value;
      }, 0)
      .toFixed(field === 'pcs' ? 0 : 2);
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
      setValue('cashAmount', newLoanAmount / 2);
      setValue('bankAmount', newLoanAmount / 2);
    }
  };

  const handleCashAmountChange = (event) => {
    const newCashAmount = parseFloat(event.target.value) || '';
    const currentLoanAmount = parseFloat(getValues('loanAmount')) || '';

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

  const saveCustomerBankDetails = async () => {
    const payload = {
      bankDetails: {
        branchName: watch('branchName'),
        accountHolderName: watch('accountHolderName'),
        accountNumber: watch('accountNumber'),
        accountType: watch('accountType'),
        IFSC: watch('IFSC'),
        bankName: watch('bankName'),
      },
    };

    const mainbranchid = branch?.find((e) => e?._id === customerData?.branch?._id);
    let parsedBranch = storedBranch;

    if (storedBranch !== 'all') {
      try {
        parsedBranch = JSON.parse(storedBranch);
      } catch (error) {
        console.error('Error parsing storedBranch:', error);
      }
    }

    const branchQuery = parsedBranch && parsedBranch === 'all'
      ? `&branch=${mainbranchid?._id}`
      : `&branch=${parsedBranch}`;

    try {
      const url = `${import.meta.env.VITE_BASE_URL}/${user?.company}/customer/${customerData?._id}?${branchQuery}`;
      const response = await axios.put(url, JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      enqueueSnackbar('Save Customer Bank Details successfully!', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to process loan.', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 3 }}>
            Fetch Customer
          </Typography>
        </Grid>
        <Grid xs={12} md={8}><Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display='grid'
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFAutocomplete
              name='customer'
              label='Select Customer'
              req={'red'}
              fullWidth
              options={customer?.map((item) => ({
                id: item._id,
                name: item.firstName + ' ' + item.lastName,
              }))}
              getOptionLabel={(option) => option.name}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )}
            />
            <Button
              variant='contained'
              startIcon={<Iconify icon='mingcute:add-line' />}
              onClick={handleAdd}
              href={paths.dashboard.customer.new}
            >
              Add Customer
            </Button>
          </Box>
        </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 3 }}>
            Customer Details
          </Typography>
          <Card sx={{ pt: 6, pb: 2 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                disabled={true}
                name='customer_url'
                maxSize={3145728}
              />
            </Box>
          </Card>
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
              <RHFTextField name='customerCode' InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }}
                            label={'Customer Code'} />
              <RHFTextField name='customerName'
                            InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }}
                            label={'Customer Name'} />
              <RHFTextField name='customerAddress'
                            InputProps={{ readOnly: true }} label={'Customer Address'}
                            InputLabelProps={{ shrink: true }} />
              <RHFTextField name='contact' InputProps={{ readOnly: true }} label={'Mobile No.'}
                            InputLabelProps={{ shrink: true }} />
              <RHFTextField name='contactOtp' InputProps={{ readOnly: true }} label={'OTP Mobile No.'}
                            InputLabelProps={{ shrink: true }} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 3 }}>
            Loan Scheme Details
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
              <RHFTextField
                name='loanNo'
                label='Loan No.'
                req={'red'}
                InputProps={{ readOnly: true }}
                disabled
              />
              <Controller
                name='issueDate'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label='Issue Date'
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                        className: 'req',
                        disabled: !isFieldsEnabled,
                      },
                    }}
                  />
                )}
              />
              <RHFAutocomplete
                name='scheme'
                label='Scheme'
                req={'red'}
                disabled={!isFieldsEnabled}
                fullWidth
                options={scheme?.map((item) => ({
                  id: item?._id,
                  name: item?.name,
                }))}
                getOptionLabel={(option) => option?.name}
                renderOption={(props, option) => (
                  <li {...props} key={option?.id}>
                    {option?.name}
                  </li>
                )}
              />
              <RHFTextField name='interestRate' label='Instrest Rate' InputProps={{ readOnly: true }} />
              <Controller
                name='consultingCharge'
                control={control}
                render={({ field }) => (
                  <RHFTextField
                    {...field}
                    disabled={!isFieldsEnabled}
                    label='Consulting Charge'
                    req={'red'}
                  />
                )}
              />
              <RHFTextField name='periodTime' label='INT. Period Time' InputProps={{ readOnly: true }} />
              <RHFTextField name='renewalTime' label='Renewal Time' InputProps={{ readOnly: true }} />
              <RHFTextField name='loanCloseTime' label='Minimun Loan Close Time'
                            InputProps={{ readOnly: true }} />
              {currentLoanIssue && <RHFTextField
                name='loanAmount'
                label='Loan AMT.'
                req={'red'}
                disabled={!isFieldsEnabled}
                type='number'
                inputProps={{ min: 0 }}
              />}
              <Controller
                name='nextInstallmentDate'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    readOnly={true}
                    label='Next INT.Date'
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                        className: 'req',
                        disabled: true,
                      },
                    }}
                  />
                )}
              />
              <RHFTextField name='jewellerName' label='Jeweller Name' req={'red'} disabled={!isFieldsEnabled} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Property Details
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title={'Property Images'} />
            <CardContent>
              <RHFUpload
                name='property_image'
                maxSize={3145728}
                sx={{ objectFit: 'contain' }}
                onDrop={handleDropSingleFile}
                disabled={!isFieldsEnabled}
                onDelete={() => setValue('property_image', null, { shouldValidate: true })}
              />
            </CardContent>
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
                      <TableCell><strong>Type</strong></TableCell>
                      <TableCell><strong>Carat</strong></TableCell>
                      <TableCell><strong>Pcs</strong></TableCell>
                      <TableCell><strong>Total Wt</strong></TableCell>
                      <TableCell><strong>Loss Wt</strong></TableCell>
                      <TableCell><strong>Gross Wt</strong></TableCell>
                      <TableCell><strong>Net Wt</strong></TableCell>
                      <TableCell><strong>Gross Amt</strong></TableCell>
                      <TableCell><strong>Net Amt</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((row, index) => (
                      <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: 'inherit' } }}>
                        <TableCell>
                          <RHFAutocomplete
                            name={`propertyDetails[${index}].type`}
                            label='Type'
                            autoHighlight
                            disabled={!isFieldsEnabled}
                            options={property?.map((e) => e?.propertyType)}
                            getOptionLabel={(option) => option}
                            renderOption={(props, option) => (
                              <li {...props} key={option}>{option}</li>
                            )}
                            onChange={(event, value) => {
                              if (value === null) {
                                handleReset(index);
                              }
                              setValue(`propertyDetails[${index}].type`, value);
                              if (!watch(`propertyDetails[${index}].pcs`)) {
                                setValue(`propertyDetails[${index}].pcs`, 1);
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <RHFAutocomplete
                            name={`propertyDetails[${index}].carat`}
                            label='Carat'
                            autoHighlight
                            disabled={!isFieldsEnabled || watch(`propertyDetails[${index}].type`) === ''}
                            options={carat?.map((e) => e?.name)}
                            getOptionLabel={(option) => option}
                            renderOption={(props, option) => (
                              <li {...props} key={option}>{option}</li>
                            )}
                            onChange={(event, value) => {
                              if (value === null) {
                                handleReset(index);
                              }

                              const gw = parseFloat(watch(`propertyDetails[${index}].grossWeight`)) || 0;
                              const caratValue = parseFloat(value) || 0;
                              setValue(`propertyDetails[${index}].carat`, caratValue);
                              const netWeight = gw * caratValue;
                              setValue(`propertyDetails[${index}].netWeight`, netWeight);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <RHFTextField
                            name={`propertyDetails[${index}].pcs`}
                            label='Pcs'
                            disabled={!isFieldsEnabled || watch(`propertyDetails[${index}].carat`) === ''}
                            onChange={(e) => {
                              if (e.target.value === '') {
                                handleReset(index);
                              }

                              const pcs = parseFloat(e.target.value) || 0;
                              setValue(`propertyDetails[${index}].pcs`, pcs);

                              const grossWeight = parseFloat(watch(`propertyDetails[${index}].grossWeight`)) || 0;
                              const grossAmount = grossWeight * pcs * configs.goldRate;
                              setValue(`propertyDetails[${index}].grossAmount`, grossAmount);

                              const netWeight = parseFloat(watch(`propertyDetails[${index}].netWeight`)) || 0;
                              const netAmount = netWeight * pcs * configs.goldRate;
                              setValue(`propertyDetails[${index}].netAmount`, netAmount);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <RHFTextField
                            name={`propertyDetails[${index}].totalWeight`}
                            label='TW'
                            type='number'
                            step='0.01'
                            disabled={!isFieldsEnabled}
                            helperText={totalWeightError}
                            error={!!totalWeightError}
                            onChange={(e) => {
                              const inputValue = e.target.value;

                              if (inputValue === '') {
                                setTotalWeightError('Total weight cannot be empty.');
                                setValue(`propertyDetails[${index}].totalWeight`, '');
                                return;
                              } else {
                                setTotalWeightError('');
                              }

                              if (/^-?\d*\.?\d*$/.test(inputValue)) {
                                const totalWeight = parseFloat(inputValue);
                                setValue(`propertyDetails[${index}].totalWeight`, inputValue);

                                if (!isNaN(totalWeight) && totalWeight >= 0) {
                                  const lossWeight = parseFloat(watch(`propertyDetails[${index}].lossWeight`)) || 0;

                                  if (lossWeight > totalWeight) {
                                    setTotalWeightError('Loss weight cannot be greater than total weight.');
                                  } else {
                                    const grossWeight = totalWeight - lossWeight;
                                    setValue(`propertyDetails[${index}].grossWeight`, grossWeight);
                                    const caratValue = carat?.find((item) => item.name == parseFloat(watch(`propertyDetails[${index}].carat`))) || 0;
                                    const netWeight = grossWeight * (caratValue.caratPercentage / 100);
                                    setValue(`propertyDetails[${index}].netWeight`, netWeight);
                                    const pcs = parseFloat(watch(`propertyDetails[${index}].pcs`)) || 0;
                                    const grossAmount = grossWeight * pcs * configs.goldRate * caratValue.caratPercentage / 100;
                                    setValue(`propertyDetails[${index}].grossAmount`, grossAmount);
                                    const netAmount = netWeight * pcs * configs.goldRate * caratValue.caratPercentage / 100;
                                    setValue(`propertyDetails[${index}].netAmount`, netAmount);
                                    setTotalWeightError('');
                                  }
                                }
                              } else {
                                setTotalWeightError('Please enter a valid number for total weight.');
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <RHFTextField
                            name={`propertyDetails[${index}].lossWeight`}
                            label='LW'
                            type='number'
                            step='0.01'
                            disabled={!isFieldsEnabled}
                            helperText={lossWeightError}
                            error={!!lossWeightError}
                            onChange={(e) => {
                              const inputValue = e.target.value;

                              if (inputValue === '') {
                                setLossWeightError('Loss weight cannot be empty.');
                                setValue(`propertyDetails[${index}].lossWeight`, '');
                                return;
                              } else {
                                setLossWeightError('');
                              }

                              if (/^-?\d*\.?\d*$/.test(inputValue)) {
                                const lossWeight = parseFloat(inputValue);
                                setValue(`propertyDetails[${index}].lossWeight`, inputValue);
                                const totalWeight = parseFloat(watch(`propertyDetails[${index}].totalWeight`)) || 0;

                                if (lossWeight > totalWeight) {
                                  setLossWeightError('Loss weight cannot be greater than total weight.');
                                } else {
                                  const grossWeight = totalWeight - lossWeight;
                                  setValue(`propertyDetails[${index}].grossWeight`, grossWeight);
                                  const caratValue = carat?.find((item) => item.name == parseFloat(watch(`propertyDetails[${index}].carat`))) || 0;
                                  const netWeight = grossWeight * (caratValue.caratPercentage / 100);
                                  setValue(`propertyDetails[${index}].netWeight`, netWeight);
                                  const pcs = parseFloat(getValues(`propertyDetails[${index}].pcs`)) || 0;
                                  const grossAmount = grossWeight * pcs * configs.goldRate * caratValue.caratPercentage / 100;
                                  setValue(`propertyDetails[${index}].grossAmount`, grossAmount);
                                  const netAmount = netWeight * pcs * configs.goldRate * caratValue.caratPercentage / 100;
                                  setValue(`propertyDetails[${index}].netAmount`, netAmount);
                                  setLossWeightError('');
                                }
                              } else {
                                setLossWeightError('Please enter a valid number for loss weight.');
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <RHFTextField
                            name={`propertyDetails[${index}].grossWeight`}
                            label='GW'
                            disabled={true}
                            value={getValues(`propertyDetails[${index}].grossWeight`) || ''}
                          />
                        </TableCell>
                        <TableCell>
                          <RHFTextField
                            name={`propertyDetails[${index}].netWeight`}
                            label='NW'
                            disabled={true}
                            value={getValues(`propertyDetails[${index}].netWeight`) || ''}
                          />
                        </TableCell>
                        <TableCell>
                          <RHFTextField
                            name={`propertyDetails[${index}].grossAmount`}
                            label='GA'
                            disabled={true}
                          />
                        </TableCell>
                        <TableCell>
                          <RHFTextField
                            name={`propertyDetails[${index}].netAmount`}
                            label='NA'
                            disabled={true}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleReset(index)} disabled={!isFieldsEnabled}>
                            <Iconify icon='ic:baseline-refresh' />
                          </IconButton>
                          <IconButton
                            color='error'
                            onClick={() => handleRemove(index)}
                            disabled={!isFieldsEnabled || fields.length === 1}
                          >
                            <Iconify icon='solar:trash-bin-trash-bold' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ backgroundColor: '#e0f7fa' }}>
                      <TableCell colSpan={2}><strong>Total:</strong></TableCell>
                      <TableCell>{calculateTotal('pcs')}</TableCell>
                      <TableCell>{calculateTotal('totalWeight')}</TableCell>
                      <TableCell>{calculateTotal('lossWeight')}</TableCell>
                      <TableCell>{calculateTotal('grossWeight')}</TableCell>
                      <TableCell>{calculateTotal('netWeight')}</TableCell>
                      <TableCell>{calculateTotal('grossAmount')}</TableCell>
                      <TableCell>{calculateTotal('netAmount')}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <CardActions sx={{ margin: '10px 16px 10px 16px', justifyContent: 'flex-end' }}>
              <Button
                size='small'
                disabled={!isFieldsEnabled}
                variant='contained'
                color='primary'
                startIcon={<Iconify icon='mingcute:add-line' />}
                onClick={handleAdd}
              >
                Add Property
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Payment Details
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
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
              <Controller
                name='loanAmount'
                control={control}
                render={({ field }) => (
                  <RHFTextField
                    {...field}
                    label='Loan Amount'
                    req={'red'}
                    disabled={!isFieldsEnabled}
                    type='number'
                    inputProps={{ min: 0 }}
                    onChange={(e) => {
                      field.onChange(e);
                      handleLoanAmountChange(e);
                    }}
                  />
                )}
              />
              <RHFAutocomplete
                name='paymentMode'
                label='Payment Mode'
                req={'red'}
                disabled={!isFieldsEnabled}
                fullWidth
                options={['Cash', 'Bank', 'Both']}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                onChange={(event, value) => {
                  setValue('paymentMode', value);
                  handleLoanAmountChange({ target: { value: getValues('loanAmount') } });
                }}
              />
              {watch('paymentMode') === 'Cash' && (
                <Controller
                  name='cashAmount'
                  control={control}
                  render={({ field }) => (
                    <RHFTextField
                      {...field}
                      label='Cash Amount'
                      req={'red'}
                      disabled={!isFieldsEnabled}
                      type='number'
                      inputProps={{ min: 0 }}
                      onChange={(e) => {
                        field.onChange(e);
                        handleCashAmountChange(e);
                      }}
                    />
                  )}
                />
              )}
              {watch('paymentMode') === 'Bank' && (
                <Controller
                  name='bankAmount'
                  control={control}
                  render={({ field }) => (
                    <RHFTextField
                      {...field}
                      label='Bank Amount'
                      req={'red'}
                      disabled={!isFieldsEnabled}
                      type='number'
                      inputProps={{ min: 0 }}
                    />
                  )}
                />
              )}
              {watch('paymentMode') === 'Both' && (
                <>
                  <Controller
                    name='cashAmount'
                    control={control}
                    render={({ field }) => (
                      <RHFTextField
                        {...field}
                        label='Cash Amount'
                        req={'red'}
                        disabled={!isFieldsEnabled}
                        type='number'
                        inputProps={{ min: 0 }}
                        onChange={(e) => {
                          field.onChange(e);
                          handleCashAmountChange(e);
                        }}
                      />
                    )}
                  />
                  <Controller
                    name='bankAmount'
                    control={control}
                    render={({ field }) => (
                      <RHFTextField
                        {...field}
                        label='Bank Amount'
                        req={'red'}
                        disabled
                        type='number'
                        inputProps={{ min: 0 }}
                      />
                    )}
                  />
                </>
              )}
            </Box>
          </Card>
        </Grid>
        {['Bank', 'Both'].includes(watch('paymentMode')) && <>
          <Grid item xs={12} md={4}>
            <Typography variant='h6' sx={{ mb: 0.5 }}>
              Account Details
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
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
                <RHFTextField name='accountNumber' label='Account No.' req={'red'} disabled={!isFieldsEnabled}
                              type='number'
                              inputProps={{ min: 0 }} />
                <RHFAutocomplete
                  name='accountType'
                  label='Account Type'
                  req={'red'}
                  disabled={!isFieldsEnabled}
                  fullWidth
                  options={ACCOUNT_TYPE_OPTIONS?.map((item) => item)}
                  getOptionLabel={(option) => option}
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  )}
                />
                <RHFTextField name='accountHolderName' label='Account Holder Name' disabled={!isFieldsEnabled}
                              req={'red'} />
                <RHFTextField
                  name='IFSC'
                  inputProps={{ maxLength: 11, pattern: '[A-Za-z0-9]*' }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase(); // Allows only alphanumeric and converts to uppercase
                  }}
                  label='IFSC Code'
                  req={'red'}
                  disabled={!isFieldsEnabled}
                />
                <RHFTextField name='bankName' label='Bank Name' req={'red'} disabled={!isFieldsEnabled} />
                <RHFTextField name='branchName' label='Branch Name' req={'red'} disabled={!isFieldsEnabled} />
                <Box></Box>
                <Box sx={{ justifyContent: 'end', display: 'flex' }}>
                  <Button disabled={!isFieldsEnabled} variant='contained' onClick={() => saveCustomerBankDetails()}>
                    Save Customer Bank
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid></>}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
        <LoadingButton disabled={!isFieldsEnabled} type='submit' variant='contained' loading={isSubmitting}>
          {!currentLoanIssue ? 'issue Loan' : 'Save Changes'}
        </LoadingButton>
      </Box>
    </FormProvider>
  );
}

LoanissueNewEditForm.propTypes = {
  currentLoanIssue: PropTypes.object,
};
