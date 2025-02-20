import React, { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import FormProvider, { RHFAutocomplete, RHFTextField } from '../../components/hook-form';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../auth/hooks';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFDatePicker from '../../components/hook-form/rhf-.date-picker';
import Typography from '@mui/material/Typography';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import Image from '../../components/image';

// ----------------------------------------------------------------------

function OtherLoanpayhistoryNewEditForm({ currentOtherLoan, mutate }) {
  const { user } = useAuthContext();
  const [file, setFile] = useState(currentOtherLoan?.loan?.propertyImage);
  const lightbox = useLightBox(file);

  const renewDate = () => {
    if (!currentOtherLoan?.loan?.issueDate) return null;

    const {
      issueDate,
      scheme: { renewalTime },
    } = currentOtherLoan?.loan;
    const monthsToAdd =
      renewalTime === 'Monthly'
        ? 1
        : renewalTime === 'yearly'
          ? 12
          : parseInt(renewalTime.split(' ')[0], 10) || 0;
    return new Date(new Date(issueDate).setMonth(new Date(issueDate).getMonth() + monthsToAdd));
  };

  const NewLoanPayHistorySchema = Yup.object().shape({
    loanNo: Yup.string().required('Loan No. is required'),
    customerName: Yup.string().required('Customer Name is required'),
    address: Yup.string().required('Address is required'),
    contact: Yup.string()
      .required('Mobile number is required')
      .matches(/^\d{10,16}$/, 'Mobile number must be between 10 and 16 digits'),
    issueDate: Yup.date()
      .required('Issue Date is required')
      .nullable()
      .typeError('Invalid Issue Date'),
    schemeName: Yup.string()
      .required('Scheme Name is required')
      .max(10, 'Scheme Name must be exactly 10 characters'),
    closedBy: Yup.string().required('Closed By is required'),
    interest: Yup.number()
      .required('Interest is required')
      .typeError('Interest must be a number')
      .max(100, 'Interest cannot exceed 100%'),
    consultCharge: Yup.number().required('Consult Charge is required'),
    loanAmount: Yup.number().required('Loan Amount is required'),
    interestLoanAmount: Yup.number().required('Interest Loan Amount is required'),
    loanPeriod: Yup.number().required('Loan Period is required'),
    IntPeriodTime: Yup.number().required('Interest Period Time is required'),
    nextInterestPayDate: Yup.date()
      .nullable()
      .required('Next Interest Pay Date is required')
      .typeError('Invalid Next Interest Pay Date'),
    lastInterestPayDate: Yup.date()
      .nullable()
      .required('Last Interest Pay Date is required')
      .typeError('Invalid Last Interest Pay Date'),
  });

  const defaultValues = useMemo(
    () => ({
      loanNo: currentOtherLoan?.loan?.loanNo || '',
      customerName:
        currentOtherLoan?.loan?.customer.firstName +
          ' ' +
          currentOtherLoan?.loan?.customer.middleName +
          ' ' +
          currentOtherLoan?.loan?.customer.lastName || '',
      address:
        `${currentOtherLoan?.loan.customer.permanentAddress.street || ''} ${currentOtherLoan?.loan.customer.permanentAddress.landmark || ''}, ${currentOtherLoan?.loan.customer.permanentAddress.city || ''}, ${currentOtherLoan?.loan.customer.permanentAddress.state || ''}, ${currentOtherLoan?.loan.customer.permanentAddress.zipcode || ''}, ${currentOtherLoan?.loan.customer.permanentAddress.country || ''}` ||
        '',
      contact: currentOtherLoan?.loan?.customer.contact || '',
      issueDate: currentOtherLoan?.loan?.issueDate
        ? new Date(currentOtherLoan?.loan?.issueDate)
        : new Date(),
      schemeName: currentOtherLoan?.loan?.scheme.name || '',
      closedBy: currentOtherLoan?.loan.closedBy
        ? currentOtherLoan?.loan?.closedBy?.firstName +
          ' ' +
          currentOtherLoan?.loan?.closedBy?.lastName
        : null,
      interest:
        currentOtherLoan?.loan?.scheme.interestRate > 1.5
          ? 1.5
          : currentOtherLoan?.loan?.scheme.interestRate,
      consultCharge: currentOtherLoan?.loan?.consultingCharge || '',
      loanAmount: currentOtherLoan?.loan?.loanAmount || '',
      interestLoanAmount: currentOtherLoan?.loan?.interestLoanAmount || '',
      loanPeriod: currentOtherLoan?.loan?.scheme.renewalTime || '',
      IntPeriodTime: currentOtherLoan?.loan?.scheme.interestPeriod || '',
      createdBy: user?.firstName + ' ' + user?.lastName || null,
      renewDate: currentOtherLoan?.loan?.issueDate ? renewDate() : null,
      nextInterestPayDate: currentOtherLoan?.loan?.nextInstallmentDate
        ? new Date(currentOtherLoan?.loan?.nextInstallmentDate)
        : new Date(),
      approvalCharge: currentOtherLoan?.loan?.approvalCharge || 0,
      lastInterestPayDate: currentOtherLoan?.loan?.lastInstallmentDate
        ? new Date(currentOtherLoan?.loan?.lastInstallmentDate)
        : null,
      totalLoanAmount: currentOtherLoan?.loan?.loanAmount || '',
      partLoanAmount:
        currentOtherLoan?.loan?.loanAmount - currentOtherLoan?.loan?.interestLoanAmount || '',
      intLoanAmount: currentOtherLoan?.loan?.interestLoanAmount || '',
      intRate:
        currentOtherLoan?.loan?.scheme.interestRate >= 1.5
          ? 1.5
          : currentOtherLoan?.loan?.scheme.interestRate || '',
      otherName: currentOtherLoan?.otherName || '',
      otherNumber: currentOtherLoan?.otherNumber || '',
      amount: currentOtherLoan?.amount || '',
      percentage: currentOtherLoan?.percentage || '',
      date: new Date(currentOtherLoan?.date) || '',
      grossWt: currentOtherLoan?.grossWt || '',
      netWt: currentOtherLoan?.netWt || '',
      rate: currentOtherLoan?.rate || '',
      month: currentOtherLoan?.month || '',
      renewalDate: new Date(currentOtherLoan?.renewalDate) || '',
      closeDate: new Date(currentOtherLoan?.closeDate) || '',
      otherCharge: currentOtherLoan?.otherCharge || '',
      remark: currentOtherLoan?.remark || '',
      ornamentDetail: currentOtherLoan?.ornamentDetail || '',
      totalOrnament: currentOtherLoan?.totalOrnament || '',
    }),
    [currentOtherLoan?.loan]
  );

  const methods = useForm({
    resolver: yupResolver(NewLoanPayHistorySchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentOtherLoan?.loan) {
      reset(defaultValues);
    }
  }, [currentOtherLoan?.loan, reset, defaultValues, mutate]);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
  });

  return (
    <>
      <Box>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Card sx={{ p: 2 }}>
            <Grid container spacing={3}>
              {/*<Grid item xs={12} md={12}>*/}
              {/*  <Box*/}
              {/*    rowGap={1.5}*/}
              {/*    columnGap={1.5}*/}
              {/*    display="grid"*/}
              {/*    gridTemplateColumns={{*/}
              {/*      xs: 'repeat(1, 1fr)',*/}
              {/*      sm: 'repeat(3, 1fr)',*/}
              {/*      md: 'repeat(6, 1fr)',*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    <RHFTextField name="loanNo" label="Loan No." InputProps={{ readOnly: true }} />*/}
              {/*    <RHFTextField*/}
              {/*      name="customerName"*/}
              {/*      label="Customer Name"*/}
              {/*      InputProps={{ readOnly: true }}*/}
              {/*    />*/}
              {/*    <RHFTextField*/}
              {/*      name="schemeName"*/}
              {/*      label="Scheme Name"*/}
              {/*      InputProps={{ readOnly: true }}*/}
              {/*      inputProps={{ minLength: 10, maxLength: 10 }}*/}
              {/*    />*/}
              {/*    <RHFTextField*/}
              {/*      name="IntPeriodTime"*/}
              {/*      label="Interest Period Time"*/}
              {/*      InputProps={{ readOnly: true }}*/}
              {/*    />*/}
              {/*    <RHFDatePicker*/}
              {/*      name="nextInterestPayDate"*/}
              {/*      control={control}*/}
              {/*      label="Next Interest Pay Date"*/}
              {/*    />*/}
              {/*    <RHFTextField*/}
              {/*      name="approvalCharge"*/}
              {/*      label="Approval Charge"*/}
              {/*      InputProps={{ readOnly: true }}*/}
              {/*      InputLabelProps={{ shrink: true }}*/}
              {/*    />*/}
              {/*    <RHFTextField*/}
              {/*      name="loanAmount"*/}
              {/*      label="Loan Amount"*/}
              {/*      InputProps={{ readOnly: true }}*/}
              {/*    />*/}
              {/*    <RHFTextField name="address" label="Address" InputProps={{ readOnly: true }} />*/}
              {/*    <RHFTextField*/}
              {/*      name="interest"*/}
              {/*      label="Interest %"*/}
              {/*      InputProps={{ readOnly: true }}*/}
              {/*      inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}*/}
              {/*      onKeyPress={(e) => {*/}
              {/*        if (!/[0-9]/.test(e.key)) {*/}
              {/*          e.preventDefault();*/}
              {/*        }*/}
              {/*      }}*/}
              {/*    />*/}
              {/*    <RHFTextField*/}
              {/*      name="loanPeriod"*/}
              {/*      label="Loan Period (Month)"*/}
              {/*      InputProps={{ readOnly: true }}*/}
              {/*    />*/}
              {/*    <RHFDatePicker*/}
              {/*      name="lastInterestPayDate"*/}
              {/*      control={control}*/}
              {/*      label="Last Interest Pay Date"*/}
              {/*    />*/}
              {/*    <RHFTextField*/}
              {/*      name="createdBy"*/}
              {/*      label="Created By"*/}
              {/*      InputLabelProps={{ shrink: true }}*/}
              {/*      InputProps={{ readOnly: true }}*/}
              {/*    />*/}
              {/*    <RHFTextField*/}
              {/*      name="interestLoanAmount"*/}
              {/*      label="Interest Loan Amount"*/}
              {/*      InputProps={{ readOnly: true }}*/}
              {/*    />*/}
              {/*    <RHFTextField*/}
              {/*      name="contact"*/}
              {/*      label="Mobile No."*/}
              {/*      InputProps={{ readOnly: true }}*/}
              {/*      inputProps={{ maxLength: 16 }}*/}
              {/*    />*/}
              {/*    <RHFTextField*/}
              {/*      name="consultCharge"*/}
              {/*      label="Consult Charge %"*/}
              {/*      InputProps={{ readOnly: true }}*/}
              {/*      InputLabelProps={{ shrink: true }}*/}
              {/*    />*/}
              {/*    <RHFDatePicker name="issueDate" control={control} label="Issue Date" />*/}
              {/*    <RHFDatePicker name="renewDate" control={control} label="Renew Date" />*/}
              {/*    <Box pb={0}>*/}
              {/*      <Box*/}
              {/*        sx={{*/}
              {/*          display: 'flex',*/}
              {/*          justifyContent: 'space-between',*/}
              {/*          alignItems: 'center',*/}
              {/*          padding: 0,*/}
              {/*          pb: 0,*/}
              {/*        }}*/}
              {/*      >*/}
              {/*        <Box>*/}
              {/*          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>*/}
              {/*            Property Image*/}
              {/*          </Typography>*/}
              {/*        </Box>*/}
              {/*        <Box>*/}
              {/*          <Image*/}
              {/*            key={file}*/}
              {/*            src={file}*/}
              {/*            alt={file}*/}
              {/*            ratio="1/1"*/}
              {/*            onClick={() => lightbox.onOpen(file)}*/}
              {/*            sx={{*/}
              {/*              cursor: 'zoom-in',*/}
              {/*              height: '36px',*/}
              {/*              width: '36px',*/}
              {/*              borderRadius: '20%',*/}
              {/*            }}*/}
              {/*          />*/}
              {/*        </Box>*/}
              {/*      </Box>*/}
              {/*    </Box>*/}
              {/*  </Box>*/}
              {/*</Grid>*/}
              <Grid xs={12} md={12}>
                <Card sx={{ p: 2 }}>
                  <Box
                    rowGap={1.5}
                    columnGap={1.5}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(3, 1fr)',
                      md: 'repeat(6, 1fr)',
                    }}
                  >
                    <RHFTextField
                      name="loanNo"
                      label="Loan No."
                      InputProps={{ readOnly: true }}
                      disabled
                    />
                    <RHFDatePicker name="issueDate" control={control} label="Issue Date" disabled />
                    <RHFTextField
                      name="totalLoanAmount"
                      label="Total Loan Amount"
                      InputProps={{ readOnly: true }}
                      disabled
                    />
                    <RHFTextField
                      name="partLoanAmount"
                      label="Part Loan Amount"
                      InputProps={{ readOnly: true }}
                      disabled
                    />
                    <RHFTextField
                      name="intLoanAmount"
                      label="Int. Loan Amount"
                      InputProps={{ readOnly: true }}
                      disabled
                    />
                    <RHFTextField
                      name="intRate"
                      label="Int. Rate"
                      InputProps={{ readOnly: true }}
                      disabled
                    />
                    <RHFTextField
                      name="consultingCharge"
                      label="Consulting Charge"
                      InputProps={{ readOnly: true }}
                      disabled
                    />
                    <RHFTextField name="approvalCharge" label="Approval Charge" disabled />
                    {/*<RHFAutocomplete*/}
                    {/*  name="scheme"*/}
                    {/*  label="Scheme"*/}
                    {/*  req="red"*/}
                    {/*  disabled*/}
                    {/*  fullWidth*/}
                    {/*  options={scheme?.filter((item) => item.isActive)}*/}
                    {/*  getOptionLabel={(option) => option?.name || ''}*/}
                    {/*  renderOption={(props, option) => (*/}
                    {/*    <li {...props} key={option?.id}>*/}
                    {/*      {option?.name}*/}
                    {/*    </li>*/}
                    {/*  )}*/}
                    {/*  onChange={(e, selectedScheme) => {*/}
                    {/*    setValue('scheme', selectedScheme);*/}
                    {/*    const schemedata = selectedScheme;*/}
                    {/*    if (schemedata?.ratePerGram) {*/}
                    {/*      fields.forEach((_, index) => {*/}
                    {/*        const totalWeight =*/}
                    {/*          parseFloat(getValues(`propertyDetails[${index}].totalWeight`)) || 0;*/}
                    {/*        const lossWeight =*/}
                    {/*          parseFloat(getValues(`propertyDetails[${index}].lossWeight`)) || 0;*/}
                    {/*        const caratValue =*/}
                    {/*          carat?.find(*/}
                    {/*            (item) =>*/}
                    {/*              item?.name ===*/}
                    {/*              parseFloat(getValues(`propertyDetails[${index}].carat`))*/}
                    {/*          ) || {};*/}
                    {/*        const caratPercentage = caratValue?.caratPercentage || 100;*/}
                    {/*        const grossWeight = totalWeight - lossWeight;*/}
                    {/*        const netWeight = grossWeight * (caratPercentage / 100);*/}
                    {/*        const grossAmount = grossWeight * schemedata?.ratePerGram;*/}
                    {/*        const netAmount = netWeight * schemedata?.ratePerGram;*/}
                    {/*        if (!isNaN(grossWeight))*/}
                    {/*          setValue(`propertyDetails[${index}].grossWeight`, grossWeight.toFixed(2));*/}
                    {/*        if (!isNaN(netWeight))*/}
                    {/*          setValue(`propertyDetails[${index}].netWeight`, netWeight.toFixed(2));*/}
                    {/*        if (!isNaN(grossAmount))*/}
                    {/*          setValue(`propertyDetails[${index}].grossAmount`, grossAmount.toFixed(2));*/}
                    {/*        if (!isNaN(netAmount))*/}
                    {/*          setValue(`propertyDetails[${index}].netAmount`, netAmount.toFixed(2));*/}
                    {/*      });*/}
                    {/*    }*/}
                    {/*  }}*/}
                    {/*/>*/}
                    {/*<RHFTextField*/}
                    {/*  name="interestRate"*/}
                    {/*  label="InstrestRate"*/}
                    {/*  InputProps={{ readOnly: true }}*/}
                    {/*  disabled*/}
                    {/*/>*/}
                    {/*<Controller*/}
                    {/*  name="consultingCharge"*/}
                    {/*  control={control}*/}
                    {/*  render={({ field }) => (*/}
                    {/*    <RHFTextField*/}
                    {/*      {...field}*/}
                    {/*      disabled={true}*/}
                    {/*      label="Consulting Charge"*/}
                    {/*      req={'red'}*/}
                    {/*    />*/}
                    {/*  )}*/}
                    {/*/>*/}

                    {/*<RHFTextField*/}
                    {/*  name="periodTime"*/}
                    {/*  label="INT. Period Time"*/}
                    {/*  InputProps={{ readOnly: true }}*/}
                    {/*  disabled*/}
                    {/*/>*/}
                    {/*<RHFTextField*/}
                    {/*  name="renewalTime"*/}
                    {/*  label="Renewal Time"*/}
                    {/*  InputProps={{ readOnly: true }}*/}
                    {/*  disabled*/}
                    {/*/>*/}
                    {/*<RHFTextField*/}
                    {/*  name="loanCloseTime"*/}
                    {/*  label="Minimun Loan Close Time"*/}
                    {/*  InputProps={{ readOnly: true }}*/}
                    {/*  disabled*/}
                    {/*/>*/}
                    {/*{currentOtherLoanIssue && (*/}
                    {/*  <RHFTextField*/}
                    {/*    name="loanAmount"*/}
                    {/*    label="Loan AMT."*/}
                    {/*    req={'red'}*/}
                    {/*    disabled*/}
                    {/*    type="number"*/}
                    {/*    inputProps={{ min: 0 }}*/}
                    {/*  />*/}
                    {/*)}*/}
                    {/*{currentOtherLoanIssue && (*/}
                    {/*  <RHFDatePicker*/}
                    {/*    name="nextInstallmentDate"*/}
                    {/*    control={control}*/}
                    {/*    label="Next Installment Date"*/}
                    {/*    req={'red'}*/}
                    {/*    disabled*/}
                    {/*  />*/}
                    {/*)}*/}
                    {/*<RHFTextField name="jewellerName" label="JewellerName" req={'red'} disabled />*/}
                    {/*<RHFAutocomplete*/}
                    {/*  disabled*/}
                    {/*  name="loanType"*/}
                    {/*  label="Loan Type"*/}
                    {/*  req="red"*/}
                    {/*  fullWidth*/}
                    {/*  options={*/}
                    {/*    configs?.loanTypes?.length > 0*/}
                    {/*      ? configs.loanTypes.map((loan) => loan.loanType)*/}
                    {/*      : []*/}
                    {/*  }*/}
                    {/*  getOptionLabel={(option) => option || ''}*/}
                    {/*  onChange={(event, value) => setValue('loanType', value || '')}*/}
                    {/*  renderOption={(props, option) => (*/}
                    {/*    <li {...props} key={option}>*/}
                    {/*      {option}*/}
                    {/*    </li>*/}
                    {/*  )}*/}
                    {/*/>*/}
                    <RHFTextField
                      name="otherName"
                      label="otherName"
                      disabled
                      onKeyPress={(e) => {
                        if (
                          !/[0-9.]/.test(e.key) ||
                          (e.key === '.' && e.target.value.includes('.'))
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <RHFTextField
                      name="otherNumber"
                      label="Other Number"
                      disabled
                      inputProps={{
                        maxLength: 10,
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                      }}
                      rules={{
                        required: 'Contact number is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Please enter a valid 10-digit contact number',
                        },
                      }}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <RHFTextField
                      name="amount"
                      label="Amount"
                      disabled
                      onKeyPress={(e) => {
                        if (
                          !/[0-9.]/.test(e.key) ||
                          (e.key === '.' && e.target.value.includes('.'))
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <RHFTextField
                      name="percentage"
                      label="Percentage"
                      disabled
                      onKeyPress={(e) => {
                        if (
                          !/[0-9.]/.test(e.key) ||
                          (e.key === '.' && e.target.value.includes('.'))
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <RHFDatePicker name="date" control={control} label="Date" disabled />
                    <RHFTextField
                      name="grossWt"
                      label="Gross Wt"
                      disabled
                      onKeyPress={(e) => {
                        if (
                          !/[0-9.]/.test(e.key) ||
                          (e.key === '.' && e.target.value.includes('.'))
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <RHFTextField name="netWt" label="Net Wt" disabled />
                    <RHFTextField name="rate" label="Rate" disabled />
                    <RHFTextField name="month" label="Month" disabled />
                    <RHFDatePicker
                      name="renewalDate"
                      control={control}
                      label="Renewal Date"
                      disabled
                    />
                    <RHFDatePicker name="closeDate" control={control} label="Close Date" disabled />
                    <RHFTextField name="otherCharge" label="Other Charge" disabled />
                    <RHFTextField name="remark" label="Remark" disabled />
                    <Box pb={0}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: 0,
                          pb: 0,
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Property Image
                          </Typography>
                        </Box>
                        <Box>
                          <Image
                            key={file}
                            src={file}
                            alt={file}
                            ratio="1/1"
                            onClick={() => lightbox.onOpen(file)}
                            sx={{
                              cursor: 'zoom-in',
                              height: '36px',
                              width: '36px',
                              borderRadius: '20%',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    <RHFTextField
                      name="ornamentDetail"
                      label="Ornament Detail"
                      InputProps={{ readOnly: true }}
                      disabled
                    />
                    <RHFTextField
                      name="totalOrnament"
                      label="Total Ornament"
                      InputProps={{ readOnly: true }}
                      disabled
                    />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Card>
        </FormProvider>
        <Lightbox image={file} open={lightbox.open} close={lightbox.onClose} />
      </Box>
    </>
  );
}

export default OtherLoanpayhistoryNewEditForm;
