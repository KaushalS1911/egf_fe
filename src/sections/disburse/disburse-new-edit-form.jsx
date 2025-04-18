import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useGetBranch } from '../../api/branch';
import CardContent from '@mui/material/CardContent';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import axios from 'axios';
import { paths } from '../../routes/paths';
import RhfDatePicker from '../../components/hook-form/rhf-date-picker.jsx';
import { TableHeadCustom, useTable } from '../../components/table';
import { useAuthContext } from '../../auth/hooks/index.js';
import { pdf } from '@react-pdf/renderer';
import LoanPartPaymentDetailsPdf from '../loanpayhistory/PDF/loan-part-payment-details-pdf.jsx';
import LoanIssueDetails from '../loanissue/view/loan-issue-details.jsx';
import Sansaction11 from './sansaction-11.jsx';
import { value } from 'lodash/seq.js';
import { useGetConfigs } from '../../api/config.js';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'propertyName', label: 'Property Name' },
  { id: 'ornaments', label: 'Ornament' },
  { id: 'totalWeight', label: 'Total Weight' },
  { id: 'loseWeight', label: 'Lose Weight' },
  { id: 'grossWeight', label: 'Gross Weight' },
  { id: 'netWeight', label: 'Net Weight' },
  { id: 'loanApplicableAmount', label: 'Loan Applicable amount', width: 200 },
];

export default function DisburseNewEditForm({ currentDisburse, mutate }) {
  const router = useRouter();
  const table = useTable();
  const { enqueueSnackbar } = useSnackbar();
  const { branch } = useGetBranch();
  const { configs } = useGetConfigs();
  const [cashPendingAmt, setCashPendingAmt] = useState(0);
  const [bankPendingAmt, setBankPendingAmt] = useState(0);
  const { user } = useAuthContext();
  const paymentSchema =
    currentDisburse.paymentMode === 'Bank'
      ? {
          bankNetAmount: Yup.number().required('Bank Net Amount is required'),
          payingBankAmount: Yup.string().required('Bank Paying Amount is required'),
          bankPendingAmount: Yup.number().required('Bank Pending Amount is required'),
          companyBankDetail: Yup.object().shape({
            account: Yup.object().required('Account is required'),
          }),
        }
      : currentDisburse.paymentMode === 'Cash'
        ? {
            cashNetAmount: Yup.number().required('Cash Net Amount is required'),
            payingCashAmount: Yup.string().required('Cash Paying Amount is required'),
            cashPendingAmount: Yup.number().required('Cash Pending Amount is required'),
          }
        : {
            cashNetAmount: Yup.number().required('Cash Net Amount is required'),
            payingCashAmount: Yup.string().required('Cash Paying Amount is required'),
            cashPendingAmount: Yup.number().required('Cash Pending Amount is required'),
            bankNetAmount: Yup.number().required('Bank Net Amount is required'),
            payingBankAmount: Yup.string().required('Bank Paying Amount is required'),
            bankPendingAmount: Yup.number().required('Bank Pending Amount is required'),
            companyBankDetail: Yup.object().shape({
              account: Yup.object().required('Account is required'),
            }),
          };

  const NewDisburse = Yup.object().shape({
    loanNo: Yup.string().required('Loan No is required'),
    customerName: Yup.string().required('Customer Name is required'),
    loanAmount: Yup.string().required('Loan Amount is required'),
    interest: Yup.string().required('Interest is required'),
    scheme: Yup.string().required('Scheme Name is required'),
    address: Yup.string().required('Address is required'),
    branch: Yup.string().required('Branch is required'),
    ...paymentSchema,
  });

  const defaultValues = useMemo(
    () => ({
      loanNo: currentDisburse?.loanNo || '',
      customerName: `${currentDisburse?.customer?.firstName || ''} ${currentDisburse?.customer?.middleName || ''} ${currentDisburse?.customer?.lastName || ''}`,
      loanAmount: currentDisburse?.loanAmount || '',
      interest: currentDisburse?.scheme?.interestRate || '',
      scheme: currentDisburse?.scheme?.name || '',
      valuation: currentDisburse?.valuation || '',
      address: currentDisburse?.customer?.permanentAddress?.street || '',
      branch: currentDisburse?.customer?.branch?.name || '',
      approvalCharge: currentDisburse?.approvalCharge || 0,
      bankNetAmount: currentDisburse?.bankAmount || 0,
      payingBankAmount: currentDisburse?.payingBankAmount || '',
      bankPendingAmount: currentDisburse?.bankPendingAmount || 0,
      bankDate: currentDisburse?.issueDate ? new Date(currentDisburse.issueDate) : new Date(),
      cashNetAmount: currentDisburse?.cashAmount || 0,
      payingCashAmount: currentDisburse?.payingCashAmount || '',
      cashPendingAmount: currentDisburse?.cashPendingAmount || 0,
      cashDate: currentDisburse?.date ? new Date(currentDisburse.issueDate) : new Date(),
      issueDate: currentDisburse?.issueDate ? new Date(currentDisburse.issueDate) : new Date(),
      items:
        currentDisburse?.propertyDetails?.map((item) => ({
          propertyName: item.type || '',
          pcs: item.pcs || '',
          totalWeight: item.totalWeight || '',
          loseWeight: item.lossWeight || '',
          grossWeight: item.grossWeight || '',
          netWeight: item.netWeight || '',
          loanApplicableAmount: item.netAmount || '',
        })) || [],
      companyBankDetail: {
        account: currentDisburse?.companyBankDetail?.account || null,
      },
    }),
    [currentDisburse]
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
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    setCashPendingAmt(watch('cashNetAmount') - watch('payingCashAmount'));
  }, [watch('cashNetAmount'), watch('payingCashAmount')]);

  useEffect(() => {
    setBankPendingAmt(watch('bankNetAmount') - watch('payingBankAmount'));
  }, [watch('bankNetAmount'), watch('payingBankAmount')]);

  console.log(currentDisburse.scheme);
  const sendPdfToWhatsApp = async (item) => {
    try {
      // Generate the first PDF
      const blob1 = await pdf(<LoanIssueDetails selectedRow={item} configs={configs} />).toBlob();
      const file1 = new File([blob1], `LoanIssueDetailsPdf.pdf`, { type: 'application/pdf' });


      const payload = {
        firstName: item.customer.firstName,
        middleName: item.customer.middleName,
        lastName: item.customer.lastName,
        contact: item.customer.contact,
        loanNo: item.loanNo,
        loanAmount: item.loanAmount,
        interestRate: Math.min(item.scheme.interestRate, 1.5),
        consultingCharge: item.consultingCharge,
        issueDate: item.issueDate,
        nextInstallmentDate: item.nextInstallmentDate,
        companyName: item.company.name,
        companyEmail: item.company.email,
        companyContact: item.company.contact,
        branchContact: item.customer.branch.contact,
        company: user.company,

        file: file1,
        type: 'loan_details',
      };

      const formData1 = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData1.append(key, value);
      });

      // Send the first PDF
      await axios.post(`https://egf-be.onrender.com/api/whatsapp-notification`, formData1);
      console.log('First PDF sent successfully');

      // Generate the second PDF
      // const blob2 = await pdf(<Sansaction11 sansaction={item} configs={configs} />).toBlob();
      // const file2 = new File([blob2], `Sansaction11.pdf`, { type: 'application/pdf' });
      //
      // const formData2 = new FormData();
      // formData2.append('type', 'sanction_letter_11');
      // formData2.append('file', file2);
      // formData2.append('contact', item.customer.contact);
      //
      // // Send the second PDF
      // await axios.post(`https://egf-be.onrender.com/api/whatsapp-notification`, formData2);
      // console.log('Second PDF sent successfully');
    } catch (error) {
      console.error('Error generating or sending PDFs:', error);
    }
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
        payingCashAmount: data.payingCashAmount,
        approvalCharge: data.approvalCharge,
        issueDate: data.issueDate,
      };

      const url =
        currentDisburse.status === 'Disbursed'
          ? `${import.meta.env.VITE_BASE_URL}/${user?.company}/loans/${currentDisburse?._id}`
          : `${import.meta.env.VITE_BASE_URL}/disburse-loan`;

      const requestMethod = currentDisburse.status === 'Disbursed' ? axios.put : axios.post;

      requestMethod(url, payload)
        .then((res) => {
          router.push(paths.dashboard.disburse.list);
          enqueueSnackbar(res?.data?.message);
          if (currentDisburse.status !== 'Disbursed') {
            sendPdfToWhatsApp(res.data.data);
          }
        })
        .catch((err) => enqueueSnackbar(err.response?.data?.message));

      if (currentDisburse.status === 'Disbursed') {
        mutate();
      }

      reset();
    } catch (error) {
      enqueueSnackbar(currentDisburse ? 'Failed to update disbursed' : 'Failed to disburse loan');
      console.error('Error:', error);
    }
  });

  const handleCashAmountChange = (event) => {
    const cashPayingAmount = parseFloat(event.target.value) || '';
    // const cashNetAmount = parseFloat(watch('cashNetAmount') - watch('approvalCharge'));

    if (cashPayingAmount > cashNetAmount) {
      setValue('payingCashAmount', cashNetAmount);
      enqueueSnackbar('Cash paying amount cannot be greater than the Net Amount.', {
        variant: 'warning',
      });
    }
  };

  const handleBankAmountChange = (event) => {
    const bankPayingAmount = parseFloat(event.target.value) || '';
    // const bankNetAmount = parseFloat(watch('bankNetAmount') - watch('approvalCharge')) || '';

    if (bankPayingAmount > bankNetAmount) {
      setValue('payingBankAmount', bankNetAmount);
      enqueueSnackbar('Bank paying amount cannot be greater than the Net Amount.', {
        variant: 'warning',
      });
    }
  };

  const calculateTotal = (field) => {
    if (!currentDisburse?.propertyDetails || currentDisburse.propertyDetails.length === 0) return 0;

    const total = currentDisburse.propertyDetails.reduce(
      (prev, next) => prev + (Number(next?.[field]) || 0),
      0
    );

    return total.toFixed(2); // Apply toFixed(2) only at the end
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: '600' }}>
              Loan Disburse
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(4, 1fr)',
              }}
            >
              <RHFTextField name="loanNo" label="Loan No" req={'red'} />
              <RHFTextField name="customerName" label="Customer Name" req={'red'} />
              <RHFTextField name="loanAmount" label="Loan Amount" req={'red'} />
              <RHFTextField name="interest" label="Interest" req={'red'} />
              <RHFTextField name="scheme" label="Scheme Name" req={'red'} />
              <RHFTextField name="address" label="Address" req={'red'} />
              <RHFTextField name="branch" label="Branch" req={'red'} />
              <RHFTextField name="approvalCharge" label="Approval Charge" req={'red'} />
              <RhfDatePicker name="issueDate" control={control} label="issueDate" />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: '600' }}>
                Property Details
              </Typography>
              <TableContainer>
                <Table>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    onSort={table.onSort}
                  />
                  <TableBody>
                    {fields.map((row, index) => (
                      <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: 'inherit' } }}>
                        <TableCell sx={{ px: 0.5 }}>
                          <RHFTextField
                            name={`propertyDetails.${index}.propertyName`}
                            label="Property Name"
                            defaultValue={row.propertyName || ''}
                            disabled={true}
                          />
                        </TableCell>
                        <TableCell sx={{ px: 0.5 }}>
                          <RHFTextField
                            name={`propertyDetails.${index}.pcs`}
                            label="Ornament"
                            defaultValue={row.pcs || ''}
                            disabled={true}
                          />
                        </TableCell>
                        <TableCell sx={{ px: 0.5 }}>
                          <RHFTextField
                            name={`propertyDetails.${index}.totalWeight`}
                            label="Total Weight"
                            defaultValue={(parseFloat(row.totalWeight) || 0.0).toFixed(2)}
                            disabled={true}
                          />
                        </TableCell>
                        <TableCell sx={{ px: 0.5 }}>
                          <RHFTextField
                            name={`propertyDetails.${index}.loseWeight`}
                            label="Lose Weight"
                            defaultValue={(parseFloat(row.loseWeight) || 0).toFixed(2)}
                            disabled={true}
                          />
                        </TableCell>
                        <TableCell sx={{ px: 0.5 }}>
                          <RHFTextField
                            name={`propertyDetails.${index}.grossWeight`}
                            label="Gross Weight"
                            defaultValue={(parseFloat(row.grossWeight) || 0.0).toFixed(2)}
                            disabled={true}
                          />
                        </TableCell>
                        <TableCell sx={{ px: 0.5 }}>
                          <RHFTextField
                            name={`propertyDetails.${index}.netWeight`}
                            label="Net Weight"
                            defaultValue={(parseFloat(row.netWeight) || 0.0).toFixed(2)}
                            disabled={true}
                          />
                        </TableCell>
                        <TableCell sx={{ px: 0.5 }}>
                          <RHFTextField
                            name={`propertyDetails.${index}.loanApplicableAmount`}
                            label="Loan Applicable Amount"
                            defaultValue={(parseFloat(row.loanApplicableAmount) || 0.0).toFixed(2)}
                            disabled={true}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow
                      sx={{
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'light' ? '#e0f7fa' : '#2f3944',
                      }}
                    >
                      <TableCell
                        sx={{
                          padding: '8px',
                        }}
                      >
                        <strong>Total:</strong>
                      </TableCell>
                      <TableCell sx={{ padding: '8px 18px' }}>{calculateTotal('pcs')}</TableCell>
                      <TableCell sx={{ padding: '8px 18px' }}>
                        {calculateTotal('totalWeight')}
                      </TableCell>
                      <TableCell sx={{ padding: '8px 18px' }}>
                        {calculateTotal('lossWeight')}
                      </TableCell>
                      <TableCell sx={{ padding: '8px 18px' }}>
                        {calculateTotal('grossWeight')}
                      </TableCell>
                      <TableCell sx={{ padding: '8px 18px' }}>
                        {calculateTotal('netWeight')}
                      </TableCell>
                      <TableCell sx={{ padding: '8px 18px' }}>
                        {calculateTotal('netAmount')}
                      </TableCell>
                      <TableCell sx={{ padding: '8px 18px' }}></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={12}>
          <Card>
            <Stack spacing={3} sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: '600' }}>
                Transaction Type
              </Typography>
              {(currentDisburse.paymentMode === 'Bank' ||
                currentDisburse.paymentMode === 'Both') && (
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: '600' }}>
                    Bank Amount
                  </Typography>
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(4, 1fr)',
                    }}
                  >
                    <RHFTextField
                      name="bankNetAmount"
                      label="Net Amount"
                      req={'red'}
                      // value={watch('bankNetAmount') - watch('approvalCharge') || 0}
                      onKeyPress={(e) => {
                        if (
                          !/[0-9.]/.test(e.key) ||
                          (e.key === '.' && e.target.value.includes('.'))
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <Controller
                      name="payingBankAmount"
                      control={control}
                      render={({ field }) => (
                        <RHFTextField
                          {...field}
                          label="Paying Amount"
                          req={'red'}
                          inputProps={{ min: 0 }}
                          onChange={(e) => {
                            field.onChange(e);
                            handleBankAmountChange(e);
                          }}
                          onKeyPress={(e) => {
                            if (
                              !/[0-9.]/.test(e.key) ||
                              (e.key === '.' && e.target.value.includes('.'))
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      )}
                    />
                    <RHFTextField
                      name="bankPendingAmount"
                      label="Pending Amount"
                      req={'red'}
                      value={watch('bankNetAmount') - watch('payingBankAmount') || 0}
                      InputLabelProps={{ shrink: true }}
                    />
                    <RHFAutocomplete
                      name="companyBankDetail.account"
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
                      onChange={(event, value) => {
                        setValue('companyBankDetail.account', value);
                      }}
                    />
                    <RhfDatePicker
                      name="bankDate"
                      control={control}
                      label="Bank Date"
                      req={'red'}
                    />
                  </Box>
                </>
              )}
              {(currentDisburse.paymentMode === 'Cash' ||
                currentDisburse.paymentMode === 'Both') && (
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: '600' }}>
                    Cash Amount
                  </Typography>
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(4, 1fr)',
                    }}
                  >
                    <RHFTextField
                      name="cashNetAmount"
                      label="Net Amount"
                      req={'red'}
                      // value={watch('cashNetAmount') - watch('approvalCharge') || 0}
                      onKeyPress={(e) => {
                        if (
                          !/[0-9.]/.test(e.key) ||
                          (e.key === '.' && e.target.value.includes('.'))
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <Controller
                      name="payingCashAmount"
                      control={control}
                      render={({ field }) => (
                        <RHFTextField
                          {...field}
                          label="Paying Amount"
                          req={'red'}
                          inputProps={{ min: 0 }}
                          onChange={(e) => {
                            field.onChange(e);
                            handleCashAmountChange(e);
                          }}
                          onKeyPress={(e) => {
                            if (
                              !/[0-9.]/.test(e.key) ||
                              (e.key === '.' && e.target.value.includes('.'))
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      )}
                    />
                    <RHFTextField
                      name="cashPendingAmount"
                      label="Pending Amount"
                      req={'red'}
                      value={parseFloat(watch('cashNetAmount') - watch('payingCashAmount') || 0)}
                      InputLabelProps={{ shrink: true }}
                      onKeyPress={(e) => {
                        if (
                          !/[0-9.]/.test(e.key) ||
                          (e.key === '.' && e.target.value.includes('.'))
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <RhfDatePicker name="cashDate" control={control} label="Date" />
                  </Box>
                </>
              )}
            </Stack>
          </Card>
          {currentDisburse.status === 'Issued' || currentDisburse.status === 'Disbursed' ? (
            <Stack alignItems={'end'} mt={3}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {currentDisburse.status === 'Disbursed' ? 'Save' : 'Submit'}
              </LoadingButton>
            </Stack>
          ) : null}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

DisburseNewEditForm.propTypes = {
  currentScheme: PropTypes.object,
};
