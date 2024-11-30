import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid, Card, Dialog, Slider, IconButton,
} from '@mui/material';
import FormProvider, { RHFAutocomplete, RHFTextField, RHFUpload } from '../../../components/hook-form';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Upload } from '../../../components/upload';
import LoadingButton from '@mui/lab/LoadingButton';
import { TableHeadCustom } from '../../../components/table';
import { fDate } from '../../../utils/format-time';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useParams } from 'react-router';
import { useGetAllPartRelease } from '../../../api/part-release';
import { useGetBranch } from '../../../api/branch';
import RHFDatePicker from '../../../components/hook-form/rhf-.date-picker';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../../utils/canvasUtils';
import Iconify from '../../../components/iconify';

const tableHeaders = [
  { id: 'loanNo', label: 'Loan No.' },
  { id: 'propertyName', label: 'Property Name' },
  { id: 'carat', label: 'Carat' },
  { id: 'pcs', label: 'PCS' },
  { id: 'totalWeight', label: 'Total Weight' },
  { id: 'netWeight', label: 'Net Weight' },
  { id: 'grossAmount', label: 'Gross Amount'},
  { id: 'netAmount', label: 'Net Amount'},
];
const TABLE_HEAD = [
  { id: 'loanNo', label: 'Loan No.' },
  { id: 'loanAmount', label: 'Loan Amount' },
  { id: 'payAmount', label: 'Pay Amount' },
  { id: 'pendingAmount', label: 'Pending Amount' },
  { id: 'payDate', label: 'Pay Date' },
  { id: 'remarks', label: 'Remarks' },
  { id: 'action', label: 'Action' },
];

function PartReleaseForm({ currentLoan, mutate }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [file, setFile] = useState(null);
  const [paymentMode, setPaymentMode] = useState('');
  const [properties, setProperties] = useState([]);
  const { branch } = useGetBranch();
  const { partRelease, refetchPartRelease } = useGetAllPartRelease(currentLoan._id);
  const [open, setOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(null);

  useEffect(() => {
    if (currentLoan.propertyDetails) {
      setProperties(currentLoan.propertyDetails);
    }
  }, [currentLoan]);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        setAspectRatio(img.width / img.height);
      };
    }
  }, [imageSrc]);

  const paymentSchema = paymentMode === 'Bank' ? {
    account: Yup.object().required('Account is required'),
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

  const selectedTotals = useMemo(() => {
    return selectedRows.reduce(
      (totals, index) => {
        const row = currentLoan.propertyDetails[index];
        totals.pcs += Number(row.pcs) || 0;
        totals.totalWeight += Number(row.totalWeight) || 0;
        totals.netWeight += Number(row.netWeight) || 0;
        totals.grossAmount += Number(row.grossAmount) || 0;
        totals.netAmount += Number(row.netAmount) || 0;
        return totals;
      },
      { pcs: 0, totalWeight: 0, netWeight: 0, grossAmount: 0, netAmount: 0 },
    );
  }, [selectedRows, currentLoan.propertyDetails]);
  const NewPartReleaseSchema = Yup.object().shape({
    expectPaymentMode: Yup.string().required('Expected Payment Mode is required'),
    date: Yup.date().nullable().required('Pay date is required'),
    amountPaid: Yup.number()
      .min(1, 'Pay amount must be greater than 0')
      .required('Pay amount is required')
      .typeError('Pay amount must be a number'),
    paymentMode: Yup.string().required('Payment Mode is required'),
    ...paymentSchema,
  });
  const defaultValues = {
    date: new Date(),
    amountPaid: '',
    remark: '',
    paymentMode: '',
    cashAmount: '',
    bankAmount: null,
    account: null,
    expectPaymentMode: null,
  };

  const methods = useForm({
    resolver: yupResolver(NewPartReleaseSchema),
    defaultValues,
  });

  const {
    control,
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleDeleteImage = () => {
    setImageSrc(null);
    setFile(null);
    setOpen(false);
    setCroppedImage(null);
  };
  const onSubmit = handleSubmit(async (data) => {
    if (selectedRows.length === 0) {
      enqueueSnackbar('At least one property must be selected', { variant: 'error' });
      return;
    }
    if (!file) {
      enqueueSnackbar('Please select property image.', { variant: 'error' });
      return;
    }
    let paymentDetail = {
      paymentMode: data.paymentMode,
      expectPaymentMode: data.expectPaymentMode,
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
    const formData = new FormData();
    selectedRows.forEach((index) => {
      const row = currentLoan.propertyDetails[index];
      formData.append(`property[${index}][type]`, row.type);
      formData.append(`property[${index}][id]`, row.id);
      formData.append(`property[${index}][carat]`, row.carat);
      formData.append(`property[${index}][pcs]`, row.pcs);
      formData.append(`property[${index}][totalWeight]`, row.totalWeight);
      formData.append(`property[${index}][lossWeight]`, row.lossWeight);
      formData.append(`property[${index}][grossWeight]`, row.grossWeight);
      formData.append(`property[${index}][netWeight]`, row.netWeight);
      formData.append(`property[${index}][grossAmount]`, row.grossAmount);
      formData.append(`property[${index}][netAmount]`, row.netAmount);
    });
    formData.append('remark', data.remark);
    formData.append('property-image', file);
    formData.append('date', data.date);
    formData.append('amountPaid', data.amountPaid);
    for (const [key, value] of Object.entries(paymentDetail)) {
      formData.append(`paymentDetail[${key}]`, value);
    }
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/loans/${currentLoan._id}/part-release`;

      const config = {
        method: 'post',
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axios(config);
      mutate();
      refetchPartRelease();
      setSelectedRows([]);
      setProperties(response.data.data.loan.propertyDetails);
      handleDeleteImage();
      reset();
      enqueueSnackbar(response?.data.message, { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to part release', { variant: 'error' });
    }
  });

  useEffect(() => {
    if(watch('paymentMode')){
      setPaymentMode(watch('paymentMode'));
      setValue('paymentMode', watch('paymentMode'));
    }
    if (!watch('amountPaid')) {
      setValue('amountPaid', selectedTotals.netAmount);
    }
  },[watch('paymentMode'),selectedTotals.netAmount])

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      const croppedUrl = URL.createObjectURL(croppedFile);
      setCroppedImage(croppedUrl);
      setFile(croppedFile);
      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  };
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

  const handleDropSingleFile = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setOpen(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCheckboxClick = (index) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((selectedIndex) => selectedIndex !== index)
        : [...prevSelected, index],
    );
  };

  const handleSelectAllClick = () => {
    if (selectedRows.length === currentLoan.propertyDetails.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentLoan.propertyDetails.map((_, index) => index));
    }
  };

  const isRowSelected = (index) => selectedRows.includes(index);
  const handleDeletePart = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/loans/${currentLoan._id}/part-release/${id}`);
      mutate();
      refetchPartRelease();
      enqueueSnackbar((response?.data.message));
    } catch (err) {
      enqueueSnackbar('Failed to pay interest');
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant='body1' gutterBottom sx={{ fontWeight: '700' }}>
            Cash Amount : {currentLoan.cashAmount || 0}
          </Typography>
          <Typography variant='body1' gutterBottom sx={{ fontWeight: '700' }}>
            Bank Amount : {currentLoan.bankAmount || 0}
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <Box>
            <Box sx={{ width: '100%' }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding='checkbox'>
                        <Checkbox
                          checked={selectedRows.length === currentLoan.propertyDetails.length}
                          onChange={handleSelectAllClick}
                        />
                      </TableCell>
                      {tableHeaders.map((header) => (
                        <TableCell key={header.id} className={'black-text'}>{header.label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {properties && properties.length > 0 ? (
                      properties.map((row, index) => (
                        <TableRow key={row._id} selected={isRowSelected(index)}>
                          <TableCell padding='checkbox'>
                            <Checkbox
                              checked={isRowSelected(index)}
                              onChange={() => handleCheckboxClick(index)}
                            />
                          </TableCell>
                          <TableCell>{currentLoan.loanNo}</TableCell>
                          <TableCell>{row.type}</TableCell>
                          <TableCell>{row.carat}</TableCell>
                          <TableCell>{row.pcs}</TableCell>
                          <TableCell>{parseFloat(row.totalWeight || 0).toFixed(2)}</TableCell>
                          <TableCell>{parseFloat(row.netWeight || 0).toFixed(2)}</TableCell>
                          <TableCell>{parseFloat(row.grossAmount || 0).toFixed(2)}</TableCell>
                          <TableCell>{parseFloat(row.netAmount || 0).toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align='center'>
                          No Property Available
                        </TableCell>
                      </TableRow>
                    )}

                    <TableRow sx={{ backgroundColor: '#F4F6F8' }}>
                      <TableCell padding='checkbox' />
                      <TableCell sx={{ fontWeight: '600', color: '#637381' }}>TOTAL AMOUNT</TableCell>
                      <TableCell />
                      <TableCell sx={{ fontWeight: '600', color: '#637381' }}>{selectedTotals.carat}</TableCell>
                      <TableCell sx={{ fontWeight: '600', color: '#637381' }}>{selectedTotals.pcs}</TableCell>
                      <TableCell sx={{
                        fontWeight: '600',
                        color: '#637381',
                      }}>{(selectedTotals.totalWeight).toFixed(2)}</TableCell>
                      <TableCell
                        sx={{ fontWeight: '600', color: '#637381' }}>{(selectedTotals.netWeight).toFixed(2)}</TableCell>
                      <TableCell sx={{
                        fontWeight: '600',
                        color: '#637381',
                      }}>{(selectedTotals.grossAmount).toFixed(2)}</TableCell>
                      <TableCell
                        sx={{ fontWeight: '600', color: '#637381' }}>{(selectedTotals.netAmount).toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>

                </Table>
              </TableContainer>
            </Box>


            <Box sx={{ mt: 8 }}>
              <Grid container columnSpacing={2}>
                <Grid item xs={9}>
                  <Grid container rowSpacing={3} columnSpacing={2}>
                    <Grid item xs={4}>
                      <RHFDatePicker
                        name='date'
                        control={control}
                        label='Pay Date'
                        req={'red'}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <RHFTextField name='amountPaid' label='Pay amount' req='red' onKeyPress={(e) => {
                        if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                          e.preventDefault();
                        }
                      }} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <RHFTextField name='remark' label='Remark' />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <RHFAutocomplete
                        name='expectPaymentMode'
                        label='Expected Payment Mode'
                        req='red'
                        options={['Cash', 'Bank', 'Both']}
                        getOptionLabel={(option) => option}
                        renderOption={(props, option) => (
                          <li {...props} key={option}>
                            {option}
                          </li>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={3}>

                  {croppedImage ? (
                    <Upload
                      file={croppedImage}
                      onDrop={handleDropSingleFile}
                      onDelete={handleDeleteImage}
                      sx={{
                        '.css-16lfxc8': { height: { xs: '150px', md: '200px' } },
                      }}
                    />
                  ) : (
                    <Upload
                      file={file}
                      onDrop={handleDropSingleFile}
                      onDelete={handleDeleteImage}
                      sx={{
                        '.css-16lfxc8': { height: { xs: '150px', md: '200px' } },
                      }}
                    />
                  )}

                  <Dialog open={open} onClose={() => setOpen(false)} maxWidth='sm' fullWidth>
                    <Box sx={{ position: 'relative', width: '100%', height: 400 }}>
                      {aspectRatio && (
                        <Cropper
                          image={imageSrc}
                          crop={crop}
                          zoom={zoom}
                          rotation={rotation}
                          aspect={aspectRatio}
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                          onRotationChange={setRotation}
                        />
                      )}
                    </Box>
                    <Box sx={{ padding: 2 }}>
                      <Typography gutterBottom>Zoom</Typography>
                      <Slider value={zoom} min={1} max={3} step={0.1} onChange={(e, zoom) => setZoom(zoom)} />
                      <Typography gutterBottom>Rotation</Typography>
                      <Slider value={rotation} min={0} max={360} step={1}
                              onChange={(e, rotation) => setRotation(rotation)} />
                      <Box display='flex' justifyContent='space-between' mt={2}>
                        <Button onClick={() => setOpen(false)} variant='outlined'>
                          Cancel
                        </Button>
                        <Button onClick={showCroppedImage} variant='contained' color='primary'>
                          Save Cropped Image
                        </Button>
                      </Box>
                    </Box>
                  </Dialog>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant='h6' sx={{ mb: 3 }}>
                    Payment Details
                  </Typography>

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
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 3 }}>
          {(watch('paymentMode') === 'Cash' || watch('paymentMode') === 'Both') && (
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              }}>
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
            </Box>
          )}
          {(watch('paymentMode') === 'Bank' || watch('paymentMode') === 'Both') && (
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
              sx={{ mt: 3 }}
            >
              <Box>
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
              </Box>
              <Box>
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
              </Box>
            </Box>
          )}
        </Box>
        <Box xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
          <Button color='inherit' sx={{ margin: '0px 10px', height: '36px' }}
                  variant='outlined' onClick={() => reset()}>Reset</Button>
          <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Box>
      </FormProvider>
      <Table sx={{ borderRadius: '8px', overflow: 'hidden', mt: 8 }}>
        <TableHeadCustom headLabel={TABLE_HEAD} />
        <TableBody>
          {partRelease && partRelease.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.loan.loanNo}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.loan.loanAmount}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.amountPaid}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.loan.interestLoanAmount}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.createdAt)}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.remark}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{
                <IconButton color='error' onClick={() => handleDeletePart(row._id)}>
                  <Iconify icon='eva:trash-2-outline' />
                </IconButton>
              }</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>

  );
}

export default PartReleaseForm;
