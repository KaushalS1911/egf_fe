import React, { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import FormProvider, { RHFTextField } from '../../components/hook-form';
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
              <Grid item xs={12} md={12}>
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
                  <RHFTextField name="loanNo" label="Loan No." InputProps={{ readOnly: true }} />
                  <RHFTextField
                    name="customerName"
                    label="Customer Name"
                    InputProps={{ readOnly: true }}
                  />
                  <RHFTextField
                    name="schemeName"
                    label="Scheme Name"
                    InputProps={{ readOnly: true }}
                    inputProps={{ minLength: 10, maxLength: 10 }}
                  />
                  <RHFTextField
                    name="IntPeriodTime"
                    label="Interest Period Time"
                    InputProps={{ readOnly: true }}
                  />
                  <RHFDatePicker
                    name="nextInterestPayDate"
                    control={control}
                    label="Next Interest Pay Date"
                  />
                  <RHFTextField
                    name="approvalCharge"
                    label="Approval Charge"
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <RHFTextField
                    name="loanAmount"
                    label="Loan Amount"
                    InputProps={{ readOnly: true }}
                  />
                  <RHFTextField name="address" label="Address" InputProps={{ readOnly: true }} />
                  <RHFTextField
                    name="interest"
                    label="Interest %"
                    InputProps={{ readOnly: true }}
                    inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <RHFTextField
                    name="loanPeriod"
                    label="Loan Period (Month)"
                    InputProps={{ readOnly: true }}
                  />
                  <RHFDatePicker
                    name="lastInterestPayDate"
                    control={control}
                    label="Last Interest Pay Date"
                  />
                  <RHFTextField
                    name="createdBy"
                    label="Created By"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                  />
                  <RHFTextField
                    name="interestLoanAmount"
                    label="Interest Loan Amount"
                    InputProps={{ readOnly: true }}
                  />
                  <RHFTextField
                    name="contact"
                    label="Mobile No."
                    InputProps={{ readOnly: true }}
                    inputProps={{ maxLength: 16 }}
                  />
                  <RHFTextField
                    name="consultCharge"
                    label="Consult Charge %"
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <RHFDatePicker name="issueDate" control={control} label="Issue Date" />
                  <RHFDatePicker name="renewDate" control={control} label="Renew Date" />
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
                </Box>
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
