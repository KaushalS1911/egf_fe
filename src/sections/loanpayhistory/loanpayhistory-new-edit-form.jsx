import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Upload } from '../../components/upload';
import { useAuthContext } from '../../auth/hooks';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Table from '@mui/material/Table';
import { TableHeadCustom } from '../../components/table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import Iconify from '../../components/iconify';
import { fDate } from '../../utils/format-time';
import InterestPayDetailsForm from './view/interest-pay-details-form';
import PartReleaseForm from './view/part-release-form';
import UchakInterestPayForm from './view/uchak-interest-pay-form';
import LoanPartPaymentForm from './view/loan-part-payment-form';
import LoanCloseForm from './view/loan-close-form';
import RHFDatePicker from '../../components/hook-form/rhf-.date-picker';
import Typography from '@mui/material/Typography';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import Image from '../../components/image';

// ----------------------------------------------------------------------

function LoanpayhistoryNewEditForm({ currentLoan, mutate }) {
  const { user } = useAuthContext();

  const [file, setFile] = useState(currentLoan.propertyImage);
  const lightbox = useLightBox(file);

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
    // oldLoanNo: Yup.string()
    //   .matches(/^[0-9]*$/, 'Old Loan No must be numeric')
    //   .max(12, 'Old Loan No must be 12 digits or less'),
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
  const defaultValues = useMemo(() => ({
      loanNo: currentLoan?.loanNo || '',
      customerName: currentLoan?.customer.firstName + ' ' + currentLoan?.customer.middleName + ' ' + currentLoan?.customer.lastName || '',
      address: `${currentLoan.customer.permanentAddress.street || ''} ${currentLoan.customer.permanentAddress.landmark || ''}, ${currentLoan.customer.permanentAddress.city || ''}, ${currentLoan.customer.permanentAddress.state || ''}, ${currentLoan.customer.permanentAddress.zipcode || ''}, ${currentLoan.customer.permanentAddress.country || ''}` || '',
      contact: currentLoan?.customer.contact || '',
      issueDate: currentLoan?.issueDate ? new Date(currentLoan?.issueDate) : new Date(),
      schemeName: currentLoan?.scheme.name || '',
      closedBy:
        currentLoan.closedBy ? (currentLoan?.closedBy?.firstName + ' ' + currentLoan?.closedBy?.lastName) : null,
      // oldLoanNo: currentLoan?.oldLoanNo || '',
      interest: currentLoan?.scheme.interestRate > 1.5 ? 1.5 : currentLoan?.scheme.interestRate,
      consultCharge: currentLoan?.consultingCharge || '',
      loanAmount: currentLoan?.loanAmount || '',
      interestLoanAmount: currentLoan?.interestLoanAmount || '',
      loanPeriod: currentLoan?.scheme.renewalTime || '',
      IntPeriodTime: currentLoan?.scheme.interestPeriod || '',
      createdBy: (user?.firstName + ' ' + user?.lastName) || null,
      renewDate: currentLoan?.issueDate ? new Date(new Date(currentLoan.issueDate).setMonth(new Date(currentLoan.issueDate).getMonth() + 6)) : null,
      nextInterestPayDate: currentLoan?.nextInstallmentDate ? new Date(currentLoan?.nextInstallmentDate) : new Date(),
      approvalCharge: currentLoan?.approvalCharge || 0,

      lastInterestPayDate: currentLoan?.lastInstallmentDate ? new Date(currentLoan?.lastInstallmentDate) : null,
    }),
    [currentLoan],
    )
  ;
  const methods = useForm({
    resolver: yupResolver(NewLoanPayHistorySchema),
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
    if (currentLoan) {
      reset(defaultValues);
    }
  }, [currentLoan, reset, defaultValues, mutate]);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
  });
  const handleDropSingleFile = useCallback((acceptedFiles) => {
    acceptedFiles.stopPropagation();
    if (true) return;
  }, []);

  const handleDeleteFile = () => {
    if (true) return;
  };
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
                  display='grid'
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(6, 1fr)',
                  }}>
                  <RHFTextField name='loanNo' label='Loan No.' InputProps={{ readOnly: true }} />
                  <RHFTextField name='customerName' label='Customer Name' InputProps={{ readOnly: true }} />
                  <RHFTextField
                    name='schemeName'
                    label='Scheme Name'
                    InputProps={{ readOnly: true }}
                    inputProps={{ minLength: 10, maxLength: 10 }}
                  />
                  <RHFTextField name='IntPeriodTime' label='Interest Period Time'
                                InputProps={{ readOnly: true }} /><RHFDatePicker
                  name='nextInterestPayDate'
                  control={control}
                  label='Next Interest Pay Date'
                />
                  <RHFTextField name='approvalCharge' label='Approval Charge' InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }}  />
                  <RHFTextField name='loanAmount' label='Loan Amount' InputProps={{ readOnly: true }} />
                  <RHFTextField name='address' label='Address' InputProps={{ readOnly: true }} />
                  <RHFTextField
                    name='interest'
                    label='Interest %'
                    InputProps={{ readOnly: true }}
                    inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <RHFTextField name='loanPeriod' label='Loan Period (Month)' InputProps={{ readOnly: true }} />
                  <RHFDatePicker
                    name='lastInterestPayDate'
                    control={control}
                    label='Last Interest Pay Date'
                  />
                  <RHFTextField name='createdBy' label='Created By' InputLabelProps={{ shrink: true }}
                                InputProps={{ readOnly: true }} />
                  <RHFTextField name='interestLoanAmount' label='Interest Loan Amount'
                                InputProps={{ readOnly: true }} />
                  <RHFTextField
                    name='contact'
                    label='Mobile No.'
                    InputProps={{ readOnly: true }}
                    inputProps={{ maxLength: 16 }}
                  />
                  <RHFTextField name='consultCharge' label='Consult Charge %' InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }} />
                  <RHFDatePicker
                    name='issueDate'
                    control={control}
                    label='Issue Date'
                  />

                  <RHFDatePicker
                    name='renewDate'
                    control={control}
                    label='Renew Date'
                  />
                  {/*{/<RHFTextField/}*/}
                  {/*/!*  name='oldLoanNo'*!/*/}
                  {/*/!*  label='Old Loan No'*!/*/}
                  {/*/!*  InputProps={{ readOnly: true }}*!/*/}
                  {/*/!*  inputProps={{ maxLength: 12, pattern: '[0-9]' }}/}*/}
                  {/*/!*  onInput={(e) => {*!/*/}
                  {/*/!*    e.target.value = e.target.value.replace(/[^0-9]/g, '');*!/*/}
                  {/*/!*  }}*!/*/}
                  {/*{//>/}*/}






                  {/*{/<RHFTextField name='closedBy' label='Closed By' InputProps={{ readOnly: true }} />/}*/}


                  <Box pb={0}>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 0,
                      pb: 0,
                    }}>
                      <Box>
                        <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                          Property Image
                        </Typography>
                      </Box>
                      <Box>
                        <Image
                          key={file}
                          src={file}
                          alt={file}
                          ratio='1/1'
                          onClick={() => lightbox.onOpen(file)}
                          sx={{ cursor: 'zoom-in', height: '36px', width: '36px', borderRadius: '20%' }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>


              {/*{/<Grid item xs={12} md={3}>/}*/}
              {/*  <Box>*/}
              {/*  </Box>*/}
              {/* */}
              {/*</Grid>*/}
            </Grid>
          </Card>
        </FormProvider>
        <Lightbox
          image={file}
          open={lightbox.open}
          close={lightbox.onClose}
        />
      </Box>
    </>
  );
}

export default LoanpayhistoryNewEditForm;
