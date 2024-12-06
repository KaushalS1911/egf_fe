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

function PartReleaseForm({ currentLoan, mutate }) {
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
  const confirm = useBoolean();
  const popover = usePopover();
  const [deleteId, setDeleteId] = useState('');

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

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
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

  const showCroppedImage = async () => {
    if (!completedCrop || !completedCrop.width || !completedCrop.height) {
      if (file) {
        setCroppedImage(URL.createObjectURL(file));
      }
      setImageSrc(null);
      return;
    }

    const canvas = document.createElement('canvas');
    const image = document.getElementById('cropped-image');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    );

    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Failed to create blob');
        return;
      }

      const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
      setCroppedImage(URL.createObjectURL(croppedFile));
      setFile(croppedFile);
      setImageSrc(null);
    }, 'image/jpeg');
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
        <Box sx={{display:'flex',gap:4,pl:0.5}}>
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
                    <Typography variant='subtitle1' my={1.5}>
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
                              name="account"
                              label="Account"
                              req="red"
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
                              name="bankAmount"
                              control={control}
                              render={({ field }) => (
                                <RHFTextField
                                  {...field}
                                  label="Bank Amount"
                                  req="red"
                                  disabled={watch('paymentMode') !== 'Bank'}
                                  type="number"
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
                        aspect={1} // Aspect ratio for cropping
                      >
                        <img
                          id='cropped-image'
                          src={imageSrc}
                          alt='Crop preview'
                          onLoad={resetCrop} // Reset crop when the image loads
                        />
                      </ReactCrop>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
                      <Button variant='outlined' onClick={handleCancel}>
                        Cancel
                      </Button>
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

        <Box xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end',mt:2}}>
          <Button color='inherit' sx={{ margin: '0px 10px', height: '36px' }}
                  variant='outlined' onClick={() => reset()}>Reset</Button>
          <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Box>
      </FormProvider>
      <Table sx={{ borderRadius: '8px', overflow: 'hidden', mt: 3 }}>
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
                <IconButton color='error' onClick={() => {
                  confirm.onTrue();
                  popover.onClose();
                  setDeleteId(row?._id);
                }}>
                  <Iconify icon='eva:trash-2-outline' />
                </IconButton>
              }</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>{
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
              }</TableCell>
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
              <PartReleasePdf selectedRow={data} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>

  );
}

export default PartReleaseForm;







