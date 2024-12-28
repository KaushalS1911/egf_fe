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
  Button,
  Grid, Dialog, IconButton, DialogActions,
} from '@mui/material';
import FormProvider, { RHFAutocomplete, RHFTextField } from '../../../components/hook-form';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Upload } from '../../../components/upload';
import LoadingButton from '@mui/lab/LoadingButton';
import { TableHeadCustom } from '../../../components/table';
import { fDate } from '../../../utils/format-time';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useGetAllPartRelease } from '../../../api/part-release';
import { useGetBranch } from '../../../api/branch';
import RHFDatePicker from '../../../components/hook-form/rhf-.date-picker';
import Iconify from '../../../components/iconify';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useBoolean } from '../../../hooks/use-boolean';
import { PDFViewer } from '@react-pdf/renderer';
import PartReleasePdf from '../PDF/part-release-pdf';
import { ConfirmDialog } from '../../../components/custom-dialog';
import { usePopover } from '../../../components/custom-popover';
import { getResponsibilityValue } from '../../../permission/permission';
import { useAuthContext } from '../../../auth/hooks';

const tableHeaders = [
  { id: 'loanNo', label: 'Loan No.' },
  { id: 'propertyName', label: 'Property Name' },
  { id: 'carat', label: 'Carat' },
  { id: 'pcs', label: 'PCS' },
  { id: 'totalWeight', label: 'Total Weight' },
  { id: 'netWeight', label: 'Net Weight' },
  { id: 'grossAmount', label: 'Gross Amount' },
  { id: 'netAmount', label: 'Net Amount' },
];

const TABLE_HEAD = [
  { id: 'loanNo', label: 'Loan No.' },
  { id: 'loanAmount', label: 'Loan Amount' },
  { id: 'payAmount', label: 'Pay Amount' },
  { id: 'pendingAmount', label: 'Pending Amount' },
  { id: 'payDate', label: 'Pay Date' },
  { id: 'remarks', label: 'Remarks' },
  { id: 'action', label: 'Action' },
  { id: 'pdf', label: 'PDF' },
];

function PartReleaseForm({ currentLoan, mutate, configs }) {
  const { user } = useAuthContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [paymentMode, setPaymentMode] = useState('');
  const [properties, setProperties] = useState([]);
  const { branch } = useGetBranch();
  const { partRelease, refetchPartRelease } = useGetAllPartRelease(currentLoan._id);
  const [croppedImage, setCroppedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [data, setData] = useState(null);
  const view = useBoolean();
  const [crop, setCrop] = useState({ unit: '%', width: 50 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(null);
  const popover = usePopover();
  const confirm = useBoolean();
  const [deleteId, setDeleteId] = useState('');
  const [rotation, setRotation] = useState(0);

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
    account: Yup.object().required('Account is required').typeError('Account is required'),
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
    if (watch('paymentMode')) {
      setPaymentMode(watch('paymentMode'));
      setValue('paymentMode', watch('paymentMode'));
    }
    if (!watch('amountPaid')) {
      setValue('amountPaid', selectedTotals.netAmount);
    }
  }, [watch('paymentMode'), selectedTotals.netAmount]);

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
        setFile(file);
        resetCrop();
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const resetCrop = () => {
    setCrop({ unit: '%', width: 50, aspect: 1 });
    setCompletedCrop(null);
  };
  const rotateImage = (angle) => {
    setRotation((prevRotation) => prevRotation + angle);
  };
  const showCroppedImage = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = document.getElementById('cropped-image');

      if (!image) {
        console.error('Image element not found!');
        return;
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const angleRadians = (rotation * Math.PI) / 180;

      if (!completedCrop || !completedCrop.width || !completedCrop.height) {
        // No cropping, save the entire rotated image
        const rotatedCanvasWidth = Math.abs(image.naturalWidth * Math.cos(angleRadians)) + Math.abs(image.naturalHeight * Math.sin(angleRadians));
        const rotatedCanvasHeight = Math.abs(image.naturalWidth * Math.sin(angleRadians)) + Math.abs(image.naturalHeight * Math.cos(angleRadians));

        canvas.width = rotatedCanvasWidth;
        canvas.height = rotatedCanvasHeight;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angleRadians);
        ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2, image.naturalWidth, image.naturalHeight);
        ctx.restore();
      } else {
        // Cropping is required
        const cropX = completedCrop.x * scaleX;
        const cropY = completedCrop.y * scaleY;
        const cropWidth = completedCrop.width * scaleX;
        const cropHeight = completedCrop.height * scaleY;

        const rotatedCanvasWidth = Math.abs(cropWidth * Math.cos(angleRadians)) + Math.abs(cropHeight * Math.sin(angleRadians));
        const rotatedCanvasHeight = Math.abs(cropWidth * Math.sin(angleRadians)) + Math.abs(cropHeight * Math.cos(angleRadians));

        canvas.width = rotatedCanvasWidth;
        canvas.height = rotatedCanvasHeight;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angleRadians);
        ctx.drawImage(
          image,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          -cropWidth / 2,
          -cropHeight / 2,
          cropWidth,
          cropHeight,
        );
        ctx.restore();
      }

      // Convert canvas to Blob and handle it
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob');
          return;
        }
        const fileName = !completedCrop ? 'rotated-image.jpg' : 'cropped-rotated-image.jpg';
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        const fileURL = URL.createObjectURL(file);

        setCroppedImage(fileURL);
        setFile(file);
        setValue('property_image', file);
        setImageSrc(null);
        setOpen(false);
      }, 'image/jpeg');
    } catch (error) {
      console.error('Error handling image upload:', error);
    }
  };


  const handleDeleteImage = () => {
    setCroppedImage(null);
    setFile(null);
    setImageSrc(null);
  };

  const handleCancel = () => {
    setImageSrc(null);
  };

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
      confirm.onFalse();
      enqueueSnackbar((response?.data.message));
    } catch (err) {
      enqueueSnackbar('Failed to pay interest');
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ display: 'flex', gap: 4, pl: 0.5 }}>
          <Typography variant='body1' gutterBottom sx={{ fontWeight: '700' }}>
            Cash Amount : {currentLoan.cashAmount || 0}
          </Typography>
          <Typography variant='body1' gutterBottom sx={{ fontWeight: '700' }}>
            Bank Amount : {currentLoan.bankAmount || 0}
          </Typography>
        </Box>
        <Box>
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
                        <TableCell key={header.id} className={'black-text'}
                                   sx={{ py: 1, px: 1 }}>{header.label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {properties && properties.length > 0 ? (
                      properties.map((row, index) => (
                        <TableRow key={row._id} selected={isRowSelected(index)}>
                          <TableCell padding='checkbox' sx={{ py: 0, px: 1, height: 1 }}>
                            <Checkbox
                              checked={isRowSelected(index)}
                              onChange={() => handleCheckboxClick(index)}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 0, px: 1, height: 1 }}>{currentLoan.loanNo}</TableCell>
                          <TableCell sx={{ py: 0, px: 1, height: 1 }}>{row.type}</TableCell>
                          <TableCell sx={{ py: 0, px: 1, height: 1 }}>{row.carat}</TableCell>
                          <TableCell sx={{ py: 0, px: 1, height: 1 }}>{row.pcs}</TableCell>
                          <TableCell
                            sx={{ py: 0, px: 1, height: 1 }}>{parseFloat(row.totalWeight || 0).toFixed(2)}</TableCell>
                          <TableCell
                            sx={{ py: 0, px: 1, height: 1 }}>{parseFloat(row.netWeight || 0).toFixed(2)}</TableCell>
                          <TableCell
                            sx={{ py: 0, px: 1, height: 1 }}>{parseFloat(row.grossAmount || 0).toFixed(2)}</TableCell>
                          <TableCell
                            sx={{ py: 0, px: 1, height: 1 }}>{parseFloat(row.netAmount || 0).toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align='center' sx={{ py: 0, px: 1, height: 1 }}>
                          No Property Available
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow sx={{ backgroundColor: '#F4F6F8' }}>
                      <TableCell padding='checkbox' />
                      <TableCell sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}>TOTAL AMOUNT</TableCell>
                      <TableCell />
                      <TableCell
                        sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}>{selectedTotals.carat}</TableCell>
                      <TableCell
                        sx={{ fontWeight: '600', color: '#637381', py: 1, px: 1 }}>{selectedTotals.pcs}</TableCell>
                      <TableCell sx={{
                        fontWeight: '600',
                        color: '#637381',
                        py: 1, px: 1,
                      }}>{(selectedTotals.totalWeight).toFixed(2)}</TableCell>
                      <TableCell
                        sx={{
                          fontWeight: '600',
                          color: '#637381',
                          py: 1,
                          px: 1,
                        }}>{(selectedTotals.netWeight).toFixed(2)}</TableCell>
                      <TableCell sx={{
                        fontWeight: '600',
                        color: '#637381', py: 1, px: 1,

                      }}>{(selectedTotals.grossAmount).toFixed(2)}</TableCell>
                      <TableCell
                        sx={{
                          fontWeight: '600',
                          color: '#637381',
                          py: 1,
                          px: 1,
                        }}>{(selectedTotals.netAmount).toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Grid container columnSpacing={2}>
                <Grid item xs={9}>
                  <Grid container rowSpacing={3} columnSpacing={2}>
                    <Grid item xs={3}>
                      <RHFDatePicker
                        name='date'
                        control={control}
                        label='Pay Date'
                        req={'red'}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <RHFTextField name='amountPaid' label='Pay amount' req='red' onKeyPress={(e) => {
                        if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                          e.preventDefault();
                        }
                      }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <RHFTextField name='remark' label='Remark' />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
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
                  <Grid>
                    <Typography variant='subtitle1' my={1}>
                      Payment Details
                    </Typography>
                    <Box
                      rowGap={2}
                      columnGap={2}
                      display='grid'
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(4, 1fr)',
                      }}>
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
                      {(watch('paymentMode') === 'Cash' || watch('paymentMode') === 'Both') && (
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
                      )}
                      {
                        (watch('paymentMode') === 'Bank' || watch('paymentMode') === 'Both') && (
                          <>
                            <RHFAutocomplete
                              name='account'
                              label='Account'
                              req='red'
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
                              name='bankAmount'
                              control={control}
                              render={({ field }) => (
                                <RHFTextField
                                  {...field}
                                  label='Bank Amount'
                                  req='red'
                                  disabled={watch('paymentMode') !== 'Bank'}
                                  type='number'
                                  inputProps={{ min: 0 }}
                                />
                              )}
                            />
                          </>
                        )
                      }
                    </Box>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={3}>
                  {croppedImage ? (
                    <div>
                      <Upload
                        file={croppedImage || (file && URL.createObjectURL(file))} // Show uploaded/cropped image
                        onDrop={handleDropSingleFile}
                        onDelete={handleDeleteImage}
                        sx={{
                          '.css-16lfxc8': { height: { xs: '150px', md: '200px' } },
                        }}
                      />
                    </div>
                  ) : (
                    <Upload
                      file={croppedImage}
                      onDrop={handleDropSingleFile}
                      onDelete={handleDeleteImage}
                      sx={{
                        '.css-16lfxc8': { height: { xs: '150px', md: '200px' } },
                      }}
                    />
                  )}
                  <Dialog open={Boolean(imageSrc)} onClose={handleCancel}>
                    {imageSrc && (
                      <ReactCrop
                        crop={crop}
                        onChange={(newCrop) => setCrop(newCrop)}
                        onComplete={(newCrop) => setCompletedCrop(newCrop)}
                        aspect={1}
                      >
                        <img
                          id='cropped-image'
                          src={imageSrc}
                          alt='Crop preview'
                          onLoad={resetCrop}
                          style={{ transform: `rotate(${rotation}deg)` }}
                        />
                      </ReactCrop>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
                      <Button variant='outlined' onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Box sx={{ display: 'flex' }}>
                        <IconButton
                          onClick={() => rotateImage(-90)} // Rotate left by 90 degrees
                          style={{ marginRight: '10px' }}
                        >
                          <Iconify icon='material-symbols:rotate-90-degrees-cw-rounded' />

                        </IconButton>
                        <IconButton onClick={() => rotateImage(90)} // Rotate right by 90 degrees
                        >
                          <Iconify icon='material-symbols:rotate-90-degrees-ccw-rounded' />
                        </IconButton>
                      </Box>
                      <Button variant='contained' color='primary' onClick={showCroppedImage}>
                        Save Image
                      </Button>
                    </div>
                  </Dialog>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
        <Box xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
          <Button color='inherit' sx={{ margin: '0px 10px', height: '36px' }}
                  variant='outlined' onClick={() => reset()}>Reset</Button>
          {getResponsibilityValue('update_loanPayHistory', configs, user) &&
          <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
            Submit
          </LoadingButton>}
        </Box>
      </FormProvider>
      <Table sx={{ borderRadius: '8px', overflow: 'hidden', mt: 2.5 }}>
        <TableHeadCustom headLabel={TABLE_HEAD} />
        <TableBody>
          {partRelease && partRelease.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ whiteSpace: 'nowrap', py: 0, px: 1, height: 1 }}>{row.loan.loanNo}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', py: 0, px: 1, height: 1 }}>{row.loan.loanAmount}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', py: 0, px: 1, height: 1 }}>{row.amountPaid}</TableCell>
              <TableCell
                sx={{ whiteSpace: 'nowrap', py: 0, px: 1, height: 1 }}>{row.loan.interestLoanAmount}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', py: 0, px: 1, height: 1 }}>{fDate(row.createdAt)}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', py: 0, px: 1, height: 1 }}>{row.remark}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', py: 0, px: 1, height: 1 }}>{
                <IconButton color='error' onClick={() => {
                  if (index === 0) {
                    confirm.onTrue();
                    popover.onClose();
                    setDeleteId(row?._id);
                  }
                }} sx={{
                  cursor: index === 0 ? 'pointer' : 'default',
                  opacity: index === 0 ? 1 : 0.5,
                  pointerEvents: index === 0 ? 'auto' : 'none',
                }}>
                  <Iconify icon='eva:trash-2-outline' />
                </IconButton>
              }</TableCell>
              {getResponsibilityValue('print_loanPayHistory_detail', configs, user) ?
                <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer', py: 0, px: 1, height: 1 }}>{
                  <Typography onClick={() => {
                    view.onTrue();
                    setData(row);
                  }} sx={{
                    cursor: 'pointer',
                    color: 'inherit',
                    pointerEvents: 'auto',
                  }}>
                    <Iconify icon='basil:document-solid' />
                  </Typography>
                }</TableCell> : <TableCell>'-'</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title='Delete'
        content='Are you sure want to delete?'
        action={
          <Button variant='contained' color='error' onClick={() => handleDeletePart(deleteId)}>
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
            <Button color='inherit' variant='contained' onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width='100%' height='100%' style={{ border: 'none' }}>
              <PartReleasePdf selectedRow={data} configs={configs} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>

  );
}

export default PartReleaseForm;







