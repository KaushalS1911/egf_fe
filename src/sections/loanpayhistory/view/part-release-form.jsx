import React, { useCallback, useMemo, useState } from 'react';
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
  Grid, Card,
} from '@mui/material';
import FormProvider, { RHFAutocomplete, RHFTextField } from '../../../components/hook-form';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Upload } from '../../../components/upload';
import LoadingButton from '@mui/lab/LoadingButton';
import { TableHeadCustom } from '../../../components/table';
import { fDate } from '../../../utils/format-time';

const rows = [
  {
    id: 1,
    loanNo: 'EGL/24_25/001',
    propertyName: 'NECKLACE',
    carat: 20.00,
    pcs: 1.00,
    totalWeight: 17.20,
    netWeight: 14.54,
    grossAmount: 1999.00,
    netAmount: 8877.00,
  },
  {
    id: 2,
    loanNo: 'EGL/24_25/001',
    propertyName: 'RING',
    carat: 20.00,
    pcs: 1.00,
    totalWeight: 17.20,
    netWeight: 14.54,
    grossAmount: 1999.00,
    netAmount: 8877.00,
  },
  {
    id: 3,
    loanNo: 'EGL/24_25/001',
    propertyName: 'CHAIN',
    carat: 20.00,
    pcs: 1.00,
    totalWeight: 17.20,
    netWeight: 14.54,
    grossAmount: 1999.00,
    netAmount: 8877.00,
  },
  {
    id: 4,
    loanNo: 'EGL/24_25/001',
    propertyName: 'EAR CHAIN',
    carat: 20.00,
    pcs: 1.00,
    totalWeight: 17.20,
    netWeight: 14.54,
    grossAmount: 1999.00,
    netAmount: 8877.00,
  },
  {
    id: 5,
    loanNo: 'EGL/24_25/001',
    propertyName: 'CHAIN',
    carat: 20.00,
    pcs: 1.00,
    totalWeight: 17.20,
    netWeight: 14.54,
    grossAmount: 1999.00,
    netAmount: 8877.00,
  },
  {
    id: 6,
    loanNo: 'EGL/24_25/001',
    propertyName: 'EAR CHAIN',
    carat: 20.00,
    pcs: 1.00,
    totalWeight: 17.20,
    netWeight: 14.54,
    grossAmount: 1999.00,
    netAmount: 8877.00,
  },
];
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
  { id: 'docNo', label: 'Doc No.' },
  { id: 'loanAmount', label: 'Loan Amount' },
  { id: 'payAmount', label: 'Pay Amount' },
  { id: 'pendingAmount', label: 'Pending Amount' },
  { id: 'payDate', label: 'Pay Date' },
  { id: 'remarks', label: 'Remarks' },
];
const tableDummyData = [
  {
    id: 1,
    docNo: 'DOC001',
    loanAmount: 3325.20,
    payAmount: 1000.00,
    pendingAmount: 2325.20,
    payDate: '05 Aug 2024',
    remarks: 'First payment',
  },
  {
    id: 2,
    docNo: 'DOC002',
    loanAmount: 31000.00,
    payAmount: 15000.00,
    pendingAmount: 16000.00,
    payDate: '05 Aug 2024',
    remarks: 'Partial payment',
  },
  {
    id: 3,
    docNo: 'DOC003',
    loanAmount: 5000.00,
    payAmount: 5000.00,
    pendingAmount: 0.00,
    payDate: '05 Aug 2024',
    remarks: 'Full payment',
  },
  {
    id: 4,
    docNo: 'DOC004',
    loanAmount: 15000.00,
    payAmount: 5000.00,
    pendingAmount: 10000.00,
    payDate: '05 Aug 2024',
    remarks: 'Pending amount remaining',
  },
  {
    id: 5,
    docNo: 'DOC005',
    loanAmount: 7500.00,
    payAmount: 3000.00,
    pendingAmount: 4500.00,
    payDate: '05 Aug 2024',
    remarks: 'Partial payment',
  },
];

function PartReleaseForm() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [file, setFile] = useState(null);

  const selectedTotals = useMemo(() => {
    return rows.reduce(
      (totals, row) => {
        if (selectedRows.includes(row.id)) {
          totals.pcs += row.pcs || 0;
          totals.totalWeight += row.totalWeight || 0;
          totals.netWeight += row.netWeight || 0;
          totals.grossAmount += row.grossAmount || 0;
          totals.netAmount += row.netAmount || 0;
        }
        return totals;
      },
      { pcs: 0, totalWeight: 0, netWeight: 0, grossAmount: 0, netAmount: 0 }
    );
  }, [selectedRows]);

  const NewPartReleaseSchema = Yup.object().shape({
    date: Yup.date().nullable().required('Pay date is required'),
    amountPaid: Yup.number()
      .min(1, 'Pay amount must be greater than 0')
      .required('Pay amount is required')
      .typeError('Pay amount must be a number'),
    remark: Yup.string().required('Remark is required'),
    paymentMode: Yup.string().required('Payment Mode is required'),
    accountName: Yup.string().required('Account name is required'),
    accountNo: Yup.string().required('Account number is required'),
    accountType: Yup.string().required('Account type is required'),
    IFSC: Yup.string().required('IFSC code is required'),
    bankName: Yup.string().required('Bank name is required'),
  });
  const defaultValues = {
    date: null,
    amountPaid: '',
    remark: '',
    paymentMode: '',
    accountName: '',
    accountNo: '',
    accountType: '',
    IFSC: '',
    bankName: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewPartReleaseSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      loan : 'adsdasdadsdadsdddw233e',
      property: selectedRows,
      remark: data.remark,
      propertyImage: file,
      date: data.date,
      amountPaid: data.amountPaid,
      paymentDetail : {
        accountName: data.accountName,
        accountNo: data.accountNo,
        accountType: data.accountType,
        ifscCode: data.IFSC,
        bankName: data.bankName
      }
    }
    console.log('DATAAAAAAAAAAA : ', payload);
  });

  const handleDropSingleFile = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setFile(
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        }),
      );
    }
  }, []);

  const handleCheckboxClick = (row) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(row.id)
        ? prevSelected.filter((id) => id !== row.id)
        : [...prevSelected, row.id]
    );
  };

  const handleSelectAllClick = () => {
    if (selectedRows.length === rows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((row) => row.id));
    }
  };

  const isRowSelected = (id) => selectedRows.includes(id);
  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ p: 3 }}>
          <Box>
            <Box sx={{ width: '100%' }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                          checked={rows.length > 0 && selectedRows.length === rows.length}
                          onChange={handleSelectAllClick}
                        />
                      </TableCell>
                      {tableHeaders.map((header) => (
                        <TableCell key={header.id}>{header.label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id} selected={isRowSelected(row.id)}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isRowSelected(row.id)}
                            onChange={() => handleCheckboxClick(row)}
                          />
                        </TableCell>
                        <TableCell>{row.loanNo}</TableCell>
                        <TableCell>{row.propertyName}</TableCell>
                        <TableCell>{row.carat}</TableCell>
                        <TableCell>{row.pcs}</TableCell>
                        <TableCell>{row.totalWeight}</TableCell>
                        <TableCell>{row.netWeight}</TableCell>
                        <TableCell>{row.grossAmount}</TableCell>
                        <TableCell>{row.netAmount}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ backgroundColor: '#F4F6F8' }}>
                      <TableCell padding="checkbox" />
                      <TableCell sx={{ fontWeight: '600', color: '#637381' }}>TOTAL AMOUNT</TableCell>
                      <TableCell />
                      <TableCell sx={{ fontWeight: '600', color: '#637381' }}>{selectedTotals.carat}</TableCell>
                      <TableCell sx={{ fontWeight: '600', color: '#637381' }}>{selectedTotals.pcs}</TableCell>
                      <TableCell sx={{ fontWeight: '600', color: '#637381' }}>{selectedTotals.totalWeight}</TableCell>
                      <TableCell sx={{ fontWeight: '600', color: '#637381' }}>{selectedTotals.netWeight}</TableCell>
                      <TableCell sx={{ fontWeight: '600', color: '#637381' }}>{selectedTotals.grossAmount}</TableCell>
                      <TableCell sx={{ fontWeight: '600', color: '#637381' }}>{selectedTotals.netAmount}</TableCell>
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
                      <Controller
                        name='date'
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <DatePicker
                            label='Pay date'
                            value={field.value}
                            onChange={(newValue) => field.onChange(newValue)}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!error,
                                helperText: error?.message,
                                className: 'req',
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <RHFTextField name='amountPaid' label='Pay amount' req={'red'} />
                    </Grid>
                    <Grid item xs={4}>
                      <RHFTextField name='remark' label='Remark' req={'red'} />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant='h6' sx={{ mt: 5, mb: 2 }}>
                        Payment Details
                      </Typography>
                      <RHFAutocomplete
                        name='paymentMode'
                        label='Payment Mode'
                        req={'red'}
                        options={['Cash', 'Check']}
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
                <Grid item xs={3}>
                  <Upload file={file} onDrop={handleDropSingleFile} onDelete={() => setFile(null)} />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
        <Grid container sx={{ mt: 3 }}>
          <Grid item xs={12} md={4}>
            <Typography variant='h6' sx={{ mb: 0.5 }}>
              Bank Account Details
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name='accountName' label='Account Name' req={'red'} />
              <RHFTextField name='accountNo' label='Account No.' req={'red'} />
              <RHFAutocomplete
                name='accountType'
                label='Account Type'
                req={'red'}
                options={['Saving', 'Current']}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              <RHFTextField name='IFSC' label='IFSC Code' req={'red'} />
              <RHFTextField name='bankName' label='Bank Name' req={'red'} />
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
          <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
          Submit
          </LoadingButton>
        </Box>
      </FormProvider>
      <Table sx={{ borderRadius: '8px', overflow: 'hidden', mt: 8 }}>
        <TableHeadCustom headLabel={TABLE_HEAD} />
        <TableBody>
          {tableDummyData.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.docNo}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.loanAmount}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.payAmount}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.pendingAmount}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.payDate)}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.remarks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>

  );
}

export default PartReleaseForm;
