import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { paths } from 'src/routes/paths.js';
import { useRouter } from 'src/routes/hooks/index.js';
import { useSnackbar } from 'src/components/snackbar/index.js';
import FormProvider, {
  RHFAutocomplete,
  RHFSwitch,
  RHFTextField,
} from 'src/components/hook-form/index.js';
import axios from 'axios';
import { useAuthContext } from '../../../auth/hooks/index.js';
import { useGetConfigs } from '../../../api/config.js';
import { Button } from '@mui/material';
import { useGetBranch } from '../../../api/branch.js';
import RhfDatePicker from '../../../components/hook-form/rhf-date-picker.jsx';
import Iconify from '../../../components/iconify/index.js';
import { UploadBox } from '../../../components/upload/index.js';

// ----------------------------------------------------------------------

export default function ExpenseNewEditForm({ currentExpense }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const [paymentMode, setPaymentMode] = useState('');
  const { branch } = useGetBranch();
  const [file, setFile] = useState(currentExpense ? currentExpense?.invoice : null);
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
            cashAmount: Yup.number()
              .typeError('Cash Amount must be a valid number')
              .required('Cash Amount is required')
              .min(0, 'Cash Amount must be a positive number'),
          }
        : {
            cashAmount: Yup.number()
              .typeError('Cash Amount must be a valid number')
              .required('Cash Amount is required')
              .min(0, 'Cash Amount must be a positive number'),

            bankAmount: Yup.string()
              .required('Bank Amount is required')
              .test(
                'is-positive',
                'Bank Amount must be a positive number',
                (value) => parseFloat(value) >= 0
              ),
            account: Yup.object().required('Account is required'),
          };

  const NewSchema = Yup.object().shape({
    expenseType: Yup.string().required('Expense Type is required'),
    category: Yup.string().required('category  is required'),
    paymentMode: Yup.string().required('paymentMode  is required'),
    date: Yup.date().typeError('Please enter a valid date').required('Date is required'),
    ...paymentSchema,
  });
  const defaultValues = useMemo(
    () => ({
      expenseType: currentExpense?.expenseType || '',
      category: currentExpense?.category || '',
      date: currentExpense?.date ? new Date(currentExpense?.date) : new Date(),
      description: currentExpense?.description || '',
      paymentMode: currentExpense?.paymentDetails?.paymentMode || '',
      account: currentExpense?.paymentDetails?.account || null,
      cashAmount: currentExpense?.paymentDetails?.cashAmount || '',
      bankAmount: currentExpense?.paymentDetails?.bankAmount || '',
    }),
    [currentExpense]
  );

  const methods = useForm({
    resolver: yupResolver(NewSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (watch('paymentMode')) {
      setPaymentMode(watch('paymentMode'));
    }
  }, [watch('paymentMode')]);

  useEffect(() => {
    const valuation = watch('valuation');
    if (valuation) {
      const rpg = (configs.goldRate * valuation) / 100;
      setValue('ratePerGram', rpg);
    } else {
      setValue('ratePerGram', 0);
    }
  }, [watch('valuation'), configs.goldRate, setValue]);

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
        account: {
          ...data.account,
        },
        bankAmount: data.bankAmount,
      };
    } else if (data.paymentMode === 'Both') {
      paymentDetail = {
        ...paymentDetail,
        cashAmount: data.cashAmount,
        account: {
          ...data.account,
        },
        bankAmount: data.bankAmount,
      };
    }
    const formData = new FormData();

    formData.append('expenseType', data?.expenseType);
    formData.append('description', data?.description);
    formData.append('category', data?.category);
    formData.append('date', data?.date);

    for (const [key, value] of Object.entries(paymentDetail)) {
      if (key === 'account' && value) {
        formData.append('paymentDetails[account][_id]', value._id);
        formData.append('paymentDetails[account][bankName]', value.bankName);
        formData.append('paymentDetails[account][accountNumber]', value.accountNumber);
        formData.append('paymentDetails[account][branchName]', value.branchName);
      } else {
        formData.append(`paymentDetails[${key}]`, value);
      }
    }

    if (file) {
      formData.append('invoice', file);
    }

    try {
      if (currentExpense) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/${user?.company}/expense/${currentExpense._id}`,
          formData
        );
        router.push(paths.dashboard.cashAndBank.expense.list);
        enqueueSnackbar(res?.data.message);
        reset();
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/${user?.company}/expense`,
          formData
        );
        router.push(paths.dashboard.cashAndBank.expense.list);
        enqueueSnackbar(res?.data.message);
        reset();
      }
    } catch (error) {
      enqueueSnackbar(currentExpense ? 'Failed to update expense' : error.response.data.message, {
        variant: 'error',
      });
      console.error(error);
    }
  });

  const handleDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];

    if (uploadedFile) {
      uploadedFile.preview = URL.createObjectURL(uploadedFile);
      setFile(uploadedFile);
    }
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: '600' }}>
            Expense Info
          </Typography>
        </Grid>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFAutocomplete
                name="expenseType"
                label="Expense Type"
                req="red"
                fullWidth
                options={configs?.expenseType || []}
                getOptionLabel={(option) => option || ''}
                renderOption={(props, option, { index }) => (
                  <li {...props} key={index}>
                    {option}
                  </li>
                )}
              />

              <RHFTextField
                name="category"
                label="Category"
                req={'red'}
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
              <RhfDatePicker name="date" control={control} label="Date" req={'red'} />
              <RHFTextField name="description" label="Description" multiline />
            </Box>

            <UploadBox
              onDrop={handleDrop}
              placeholder={
                !file ? (
                  <Stack spacing={0.5} alignItems="center" sx={{ color: 'text.disabled' }}>
                    <Iconify icon="eva:cloud-upload-fill" width={40} />
                    <Typography variant="body2">Upload file</Typography>
                  </Stack>
                ) : (
                  <Box
                    sx={{
                      width: 200,
                      height: 200,
                      border: '1px solid #ccc',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    {file.type === 'application/pdf' ? (
                      <iframe
                        src={file.preview || currentExpense?.invoice}
                        width="100%"
                        height="100%"
                        title="pdf-preview"
                      />
                    ) : file.type?.startsWith('image/') ? (
                      <img
                        src={file.preview || currentExpense?.invoice}
                        alt={file.path}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <Typography variant="body2">{file.path}</Typography>
                    )}
                  </Box>
                )
              }
              sx={{
                mb: 3,
                py: 2.5,
                width: 'auto',
                height: '250px',
                borderRadius: 1.5,
                mt: 3,
              }}
            />

            <Typography variant="subtitle1" sx={{ my: 2, fontWeight: 600 }}>
              Payment Details
            </Typography>
            <Box>
              <Box>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(3, 1fr)',
                  }}
                  sx={{ mt: 1 }}
                >
                  <RHFAutocomplete
                    req={'red'}
                    name="paymentMode"
                    label="Payment Mode"
                    options={['Cash', 'Bank', 'Both']}
                    onChange={(event, value) => {
                      setValue('paymentMode', value);
                      const totalAmountPaid = parseFloat(watch('amountPaid')) || 0;

                      if (value === 'Cash') {
                        setValue('cashAmount', totalAmountPaid);
                        setValue('bankAmount', 0);
                      } else if (value === 'Bank') {
                        setValue('bankAmount', totalAmountPaid);
                        setValue('cashAmount', 0);
                      } else if (value === 'Both') {
                        const splitCash = totalAmountPaid * 0.5;
                        setValue('cashAmount', splitCash.toFixed(2));
                        setValue('bankAmount', (totalAmountPaid - splitCash).toFixed(2));
                      }
                    }}
                  />
                  {watch('paymentMode') === 'Cash' || watch('paymentMode') === 'Both' ? (
                    <Controller
                      name="cashAmount"
                      control={control}
                      render={({ field }) => (
                        <RHFTextField
                          {...field}
                          req={'red'}
                          label="Cash Amount"
                          inputProps={{ min: 0 }}
                          // onChange={(e) => {
                          //   field.onChange(e);
                          //   handleCashAmountChange(`e);
                          // }}
                        />
                      )}
                    />
                  ) : null}
                  {(watch('paymentMode') === 'Bank' || watch('paymentMode') === 'Both') && (
                    <>
                      <RHFAutocomplete
                        name="account"
                        label="Account"
                        req="red"
                        fullWidth
                        options={Array.from(
                          new Map(
                            branch
                              .flatMap((item) => item.company.bankAccounts)
                              .map((item) => [item.bankName + item.id, item]) // key includes ID to ensure uniqueness
                          ).values()
                        )}
                        getOptionLabel={(option) => option.bankName || ''}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id || option.bankName}>
                            {`${option.bankName}(${option.accountHolderName})`}
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
                            inputProps={{ min: 0 }}
                          />
                        )}
                      />
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Card>
          <Box xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
            <Button
              color="inherit"
              sx={{ margin: '0px 10px', height: '36px' }}
              variant="outlined"
              onClick={() => reset()}
            >
              Reset
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {currentExpense ? 'Save' : 'Submit'}
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
ExpenseNewEditForm.propTypes = {
  currentExpense: PropTypes.object,
};
