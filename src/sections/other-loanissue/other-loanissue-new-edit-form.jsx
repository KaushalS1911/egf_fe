import * as Yup from 'yup';
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormProvider, {
  RHFAutocomplete,
  RHFTextField,
  RHFUploadAvatar,
} from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import {
  Alert,
  CardActions,
  Dialog,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useGetScheme } from '../../api/scheme';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Iconify from '../../components/iconify';
import { useGetCustomer } from '../../api/customer';
import { ACCOUNT_TYPE_OPTIONS } from '../../_mock';
import { useGetAllProperty } from '../../api/property';
import { useGetCarat } from '../../api/carat';
import { useRouter } from '../../routes/hooks';
import { paths } from '../../routes/paths';
import { useGetBranch } from '../../api/branch';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import RHFDatePicker from '../../components/hook-form/rhf-.date-picker';
import { TableHeadCustom, useTable } from '../../components/table';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useGetConfigs } from '../../api/config';
import { useGetLoanissue } from '../../api/loanissue.js';
import Image from '../../components/image/index.js';
import Lightbox, { useLightBox } from '../../components/lightbox/index.js';

//----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'type', label: 'Type' },
  { id: 'carat', label: 'Carat' },
  { id: 'Pcs', label: 'Pcs' },
  { id: 'totalWt', label: 'Total wt' },
  { id: 'lossWt', label: 'Loss Wt' },
  { id: 'grossWt', label: 'Gross Wt' },
  { id: 'netWt', label: 'Net Wt' },
  { id: 'grossAmt', label: 'Gross Amt' },
  { id: 'netAmt', label: 'Net Amt' },
  { id: 'actions', label: 'Actions' },
];

export default function OtherLoanissueNewEditForm({ currentOtherLoanIssue }) {
  const router = useRouter();
  const table = useTable();
  const [loanId, setLoanID] = useState();
  const [customerData, setCustomerData] = useState();
  const [schemeId, setSchemeID] = useState();
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const { user } = useAuthContext();
  const { branch } = useGetBranch();
  const { customer } = useGetCustomer();
  const { Loanissue } = useGetLoanissue();
  const { scheme } = useGetScheme();
  const { property } = useGetAllProperty();
  const { configs, mutate } = useGetConfigs();
  const { carat } = useGetCarat();
  const { enqueueSnackbar } = useSnackbar();
  const [multiSchema, setMultiSchema] = useState([]);
  const [isFieldsEnabled, setIsFieldsEnabled] = useState(false);
  const [errors, setErrors] = useState({});
  const uuid = uuidv4();
  const storedBranch = sessionStorage.getItem('selectedBranch');
  const [croppedImage, setCroppedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 50 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(null);
  const lightbox = useLightBox(file);
  const [propertImg, setPropertImg] = useState(null);

  useEffect;
  () => {
    setMultiSchema(scheme);
  },
    [scheme];

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        setAspectRatio(img.width / img.height);
      };
    }
  }, [imageSrc]);

  const NewLoanissueSchema = Yup.object().shape({
    loan: Yup.object().required('Loan is required'),
    otherName: Yup.string().required('Other Name is required'),
    otherNumber: Yup.string().required('Other Name is Number').max(10),
    amount: Yup.string().required('Amount is required'),
    percentage: Yup.string().required('Percent is required'),
    date: Yup.date().required('Date is required'),
    grossWt: Yup.string().required('groos wt'),
    netWt: Yup.string().required('NetWas wt'),
    month: Yup.string().required('Month is required'),
    renewalDate: Yup.date().required('Renewaldate is required'),
    closeDate: Yup.string().required('Colse Date is required'),
    otherCharge: Yup.string().required('OtherCharge is required'),
    closingCharge: Yup.string().required('ClosingCgarge is required'),
    interestAmount: Yup.string().required('Interest Amount is required'),
    // propertyDetails: Yup.array().of(
    //   Yup.object().shape({
    //     type: Yup.string().required('Type is required'),
    //     carat: Yup.string().required('Carat is required'),
    //     pcs: Yup.string().required('Pieces are required'),
    //     grossWeight: Yup.string().required('Gross Weight is required'),
    //     netWeight: Yup.string().required('Net Weight is required'),
    //     grossAmount: Yup.string().required('Gross Amount is required'),
    //     netAmount: Yup.string().required('Net Amount is required'),
    //   })
    // ),
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
      property_image: currentOtherLoanIssue?.loan?.propertyImage || null,
      loan: currentOtherLoanIssue
        ? {
            id: currentOtherLoanIssue?.loan?._id,
            loanNo: currentOtherLoanIssue?.loan?.loanNo,
          }
        : null,
      scheme: currentOtherLoanIssue ? currentOtherLoanIssue?.loan?.scheme : null,
      loanNo: currentOtherLoanIssue?.loanNo || '',
      issueDate: currentOtherLoanIssue
        ? new Date(currentOtherLoanIssue?.loan?.issueDate)
        : new Date(),
      consultingCharge: currentOtherLoanIssue?.loan?.consultingCharge || '',
      approvalCharge: currentOtherLoanIssue?.loan?.approvalCharge || 0,
      nextInstallmentDate: currentOtherLoanIssue
        ? new Date(currentOtherLoanIssue?.loan?.nextInstallmentDate)
        : null,
      jewellerName: currentOtherLoanIssue?.loan?.jewellerName || '',
      loanType: currentOtherLoanIssue?.loan?.loanType || '',
      loanAmount: currentOtherLoanIssue?.loan?.loanAmount || '',
      partLoanAmount: currentOtherLoanIssue?.loan?.partLoanAmount || '',
      intLoanAmount: currentOtherLoanIssue?.loan?.intLoanAmount || '',
      intRate: currentOtherLoanIssue?.loan?.intRate || '',
      paymentMode: currentOtherLoanIssue?.loan?.paymentMode || '',
      cashAmount: currentOtherLoanIssue?.loan?.cashAmount || '',
      bankAmount: currentOtherLoanIssue?.loan?.bankAmount || 0,
      accountNumber: currentOtherLoanIssue?.loan?.customerBankDetail?.accountNumber || '',
      accountType: currentOtherLoanIssue?.loan?.customerBankDetail?.accountType || '',
      accountHolderName: currentOtherLoanIssue?.loan?.customerBankDetail?.accountHolderName || '',
      IFSC: currentOtherLoanIssue?.loan?.customerBankDetail?.IFSC || '',
      bankName: currentOtherLoanIssue?.loan?.customerBankDetail?.bankName || '',
      branchName: currentOtherLoanIssue?.loan?.customerBankDetail?.branchName || null,
      otherName: currentOtherLoanIssue?.otherName || '',
      otherNumber: currentOtherLoanIssue?.otherNumber || '',
      amount: currentOtherLoanIssue?.amount || 0,
      percentage: currentOtherLoanIssue?.percentage || 0,
      date: currentOtherLoanIssue?.date ? new Date(currentOtherLoanIssue.date) : new Date(),
      grossWt: currentOtherLoanIssue?.grossWt || 0,
      netWt: currentOtherLoanIssue?.netWt || 0,
      rate: currentOtherLoanIssue?.rate || 0,
      month: currentOtherLoanIssue?.month || '',
      renewalDate: currentOtherLoanIssue?.renewalDate
        ? new Date(currentOtherLoanIssue.renewalDate)
        : '',
      closeDate: currentOtherLoanIssue?.closeDate
        ? new Date(currentOtherLoanIssue.closeDate)
        : new Date(),
      otherCharge: currentOtherLoanIssue?.otherCharge || 0,
      closingCharge: currentOtherLoanIssue?.closingCharge || 0,
      interestAmount: currentOtherLoanIssue?.interestAmount || 0,
      remark: currentOtherLoanIssue?.remark || '',
      // propertyDetails: currentOtherLoanIssue?.propertyDetails || [
      //   {
      //     type: '',
      //     carat: '',
      //     pcs: '',
      //     totalWeight: '',
      //     lossWeight: '',
      //     grossWeight: '',
      //     netWeight: '',
      //     grossAmount: '',
      //     netAmount: '',
      //     id: uuid,
      //   },
      // ],
    };
    return baseValues;
  }, [currentOtherLoanIssue]);

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
  //
  // useEffect(() => {
  //   const loanType = watch('loanType');
  //   if (loanType && configs?.loanTypes?.length > 0) {
  //     const selectedLoan = configs.loanTypes.find((loan) => loan.loanType === loanType);
  //     setValue('approvalCharge', selectedLoan?.approvalCharge || '');
  //   }
  // }, [watch('loanType'), configs.loanTypes]);

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
      id: uuid,
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

  const videoConstraints = {
    width: 640,
    height: 360,
    facingMode: 'user',
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setValue('property_image', imageSrc);
        setOpen2(false);
        setOpen(true);
      }
    }
  }, [webcamRef, setCapturedImage, setValue, setOpen2, user, currentOtherLoanIssue]);

  const handleRemove = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      loan: data.loan.id,
      otherName: data.otherName,
      otherNumber: data.otherNumber,
      amount: data.amount,
      percentage: data.percentage,
      date: data.date,
      grossWt: data.grossWt,
      netWt: data.netWt,
      rate: data.rate,
      month: data.month,
      renewalDate: data.renewalDate,
      closeDate: data.closeDate,
      otherCharge: data.otherCharge,
      closingCharge: data.closingCharge,
      interestAmount: data.interestAmount,
      remark: data.remark,
    };
    try {
      const url = currentOtherLoanIssue
        ? `${import.meta.env.VITE_BASE_URL}/${user?.company}/other-loans/${currentOtherLoanIssue?._id}`
        : `${import.meta.env.VITE_BASE_URL}/${user?.company}/other-loan-issue`;

      const response = currentOtherLoanIssue
        ? await axios.put(url, payload)
        : await axios.post(url, payload);

      enqueueSnackbar('Loan processed successfully!', {
        variant: 'success',
      });

      router.push(paths.dashboard.other_loanissue.root);
      setCapturedImage(null);
      reset();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        currentOtherLoanIssue ? 'Failed to update loan.' : error.response.data.message,
        {
          variant: 'error',
        }
      );
    }
  });

  useEffect(() => {
    const month = watch('month');

    if (!month) {
      // Handle empty month value
      setValue('renewalDate', new Date()); // Reset or clear the renewal date
      return;
    }

    const monthsToAdd =
      month === 'MONTHLY' ? 1 : month === 'YEARLY' ? 12 : parseInt(month.split(' ')[0], 10) || 0;

    const calculatedDate = new Date();
    calculatedDate.setMonth(calculatedDate.getMonth() + monthsToAdd);

    setValue('renewalDate', calculatedDate);
  }, [watch('month')]);

  const handleCustomerSelect = (selectedCustomer) => {
    if (selectedCustomer) {
      setIsFieldsEnabled(true);
    } else {
      setIsFieldsEnabled(false);
    }
  };

  useEffect(() => {
    const loan = watch('loan');
    const scheme = watch('scheme');
    if (customer) {
      handleCustomerSelect(loan);
      setLoanID(loan);
    } else {
      setLoanID(null);
    }
    if (scheme) {
      setSchemeID(scheme);
    } else {
      setSchemeID(null);
    }
  }, [watch('loan'), watch('scheme'), currentOtherLoanIssue]);

  useEffect(() => {
    const findLoan = Loanissue?.find((item) => item?._id === loanId?.id);
    setPropertImg(findLoan?.propertyImage);
    console.log(findLoan, '0000');
    setCustomerData(findLoan?.customer);
    if (findLoan) {
      setValue('loanNo', findLoan?.loanNo);
      setValue('customerCode', findLoan?.customer?.customerCode);
      setValue(
        'customerName',
        `${findLoan?.customer?.firstName} ${findLoan?.customer?.middleName} ${findLoan?.customer?.lastName} `
      );
      setValue(
        'customerAddress',
        `${findLoan?.customer?.permanentAddress?.street} ${findLoan?.customer?.permanentAddress?.landmark} ${findLoan?.customer.permanentAddress?.city}`
      );
      setValue('contact', findLoan?.customer?.contact);
      setValue('contactOtp', findLoan?.customer?.otpContact);
      setValue('customer_url', findLoan?.customer?.avatar_url);
      setValue('scheme', findLoan?.scheme);
      if (scheme) {
        setValue('periodTime', findLoan?.scheme?.interestPeriod);
        setValue('renewalTime', findLoan?.scheme?.renewalTime);
        setValue('loanCloseTime', findLoan?.scheme?.minLoanTime);
        setValue(
          'intRate',
          findLoan?.scheme?.interestRate <= 1.5 ? findLoan?.scheme?.interestRate : 1.5
        );
      }
      setValue('consultingCharge', findLoan?.consultingCharge);
      setValue('issueDate', new Date(findLoan?.issueDate));
      setValue('loanType', findLoan?.loanType);
      setValue('approvalCharge', findLoan?.approvalCharge);
      setValue('jewellerName', findLoan?.jewellerName);
      setValue('loanAmount', findLoan?.loanAmount);
      setValue('partLoanAmount', findLoan?.loanAmount - findLoan?.interestLoanAmount);
      setValue('intLoanAmount', findLoan?.interestLoanAmount);
      setValue('paymentMode', findLoan?.paymentMode);
      setValue('cashAmount', findLoan?.cashAmount);

      if (!currentOtherLoanIssue) {
        setValue('accountNumber', findLoan?.customer?.bankDetails?.accountNumber);
        setValue('accountType', findLoan?.customer?.bankDetails?.accountType);
        setValue('accountHolderName', findLoan?.customer?.bankDetails?.accountHolderName);
        setValue('IFSC', findLoan?.customer?.bankDetails?.IFSC);
        setValue('bankName', findLoan?.customer?.bankDetails?.bankName);
        setValue('branchName', findLoan?.customer?.bankDetails?.branchName);
      }
    } else {
      setValue('customerCode', '');
      setValue('customerName', '');
      setValue('customerAddress', '');
      setValue('contact', '');
      setValue('contactOtp', '');
      setValue('customer_url', '');
      if (!currentOtherLoanIssue) {
        setValue('accountNumber', '');
        setValue('accountType', '');
        setValue('accountHolderName', '');
        setValue('IFSC', '');
        setValue('bankName', '');
        setValue('branchName', '');
      }
    }
  }, [loanId, Loanissue, setValue]);

  // useEffect(() => {
  //   if (scheme && scheme.length > 0 && schemeId) {
  //     if (schemeId) {
  //       setValue('periodTime', schemeId?.interestPeriod);
  //       setValue('renewalTime', schemeId?.renewalTime);
  //       setValue('loanCloseTime', schemeId?.minLoanTime);
  //     } else {
  //       setValue('periodTime', '');
  //       setValue('renewalTime', '');
  //       setValue('loanCloseTime', '');
  //     }
  //     if (schemeId && schemeId?.interestRate) {
  //       const interestRate = parseFloat(schemeId?.interestRate);
  //       if (interestRate <= 1.5) {
  //         methods.setValue('consultingCharge', 0);
  //         methods.setValue('interestRate', interestRate);
  //       } else {
  //         methods.setValue('consultingCharge', (interestRate - '1.5').toFixed(2));
  //         methods.setValue('interestRate', '1.5');
  //       }
  //     } else {
  //       methods.setValue('consultingCharge', '');
  //     }
  //   }
  // }, [schemeId, scheme, setValue, reset, getValues, watch('scheme')]);

  const calculateTotal = (field) => {
    const propertyDetails = useWatch({
      name: 'propertyDetails',
      control: methods.control,
    });
    if (!propertyDetails || propertyDetails.length === 0) return;
    0;
    return propertyDetails
      .reduce((total, item) => {
        const value = parseFloat(item?.[field]) || 0;
        return total + value;
      }, 0)
      .toFixed(field === 'pcs' ? 0 : 2);
  };

  // const handleLoanAmountChange = (event) => {
  //   const newLoanAmount = parseFloat(event.target.value) || '';
  //   setValue('loanAmount', newLoanAmount);
  //   const paymentMode = watch('paymentMode');
  //   if (paymentMode === 'Cash') {
  //     setValue('cashAmount', newLoanAmount);
  //     setValue('bankAmount', 0);
  //   } else if (paymentMode === 'Bank') {
  //     setValue('bankAmount', newLoanAmount);
  //     setValue('cashAmount', 0);
  //   } else if (paymentMode === 'Both') {
  //     setValue('cashAmount', newLoanAmount);
  //   }
  // };

  const handleCashAmountChange = (event) => {
    const newCashAmount = parseFloat(event.target.value) || '';
    const currentLoanAmount = parseFloat(watch('loanAmount')) || '';
    if (newCashAmount > currentLoanAmount) {
      setValue('cashAmount', currentLoanAmount);
      enqueueSnackbar('Cash amount cannot be greater than the loan amount.', {
        variant: 'warning',
      });
    } else {
      setValue('cashAmount', newCashAmount);
    }
    if (watch('paymentMode') === 'Both') {
      const calculatedBankAmount = currentLoanAmount - newCashAmount;
      setValue('bankAmount', calculatedBankAmount >= 0 ? calculatedBankAmount : '');
    }
  };

  // const handleAmountChange = () => {
  //   const newCashAmount =
  //     watch('propertyDetails').reduce((prev, next) => prev + (Number(next?.netAmount) || 0), 0) ||
  //     '';
  //   const currentLoanAmount = parseFloat(watch('loanAmount')) || '';
  //   if (currentLoanAmount > newCashAmount) {
  //     setValue('loanAmount', newCashAmount);
  //     enqueueSnackbar('Loan amount cannot be greater than the net amount.', { variant: 'warning' });
  //   } else {
  //     setValue('loanAmount', currentLoanAmount);
  //   }
  // };

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

    const branchQuery =
      parsedBranch && parsedBranch === 'all'
        ? `&branch=${mainbranchid?._id}`
        : `&branch=${parsedBranch}`;

    try {
      const url = `${import.meta.env.VITE_BASE_URL}/${user?.company}/customer/${customerData?._id}?${branchQuery}`;
      const response = await axios.put(url, JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      enqueueSnackbar(response.message, { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error, { variant: 'error' });
    }
  };

  const checkIFSC = async (ifscCode) => {
    if (ifscCode.length === 11) {
      try {
        const response = await axios.get(`https://ifsc.razorpay.com/${ifscCode}`);
        if (response.data) {
          setValue('branchName', response?.data?.BRANCH || '', { shouldValidate: true });
          enqueueSnackbar('IFSC code is valid and branch details fetched.', { variant: 'success' });
        }
      } catch (error) {
        setValue('branchName', '', { shouldValidate: true });
        enqueueSnackbar('Invalid IFSC code. Please check and enter a valid IFSC code.', {
          variant: 'error',
        });
      }
    } else {
      enqueueSnackbar('IFSC code must be exactly 11 characters.', { variant: 'warning' });
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
        const rotatedCanvasWidth =
          Math.abs(image.naturalWidth * Math.cos(angleRadians)) +
          Math.abs(image.naturalHeight * Math.sin(angleRadians));
        const rotatedCanvasHeight =
          Math.abs(image.naturalWidth * Math.sin(angleRadians)) +
          Math.abs(image.naturalHeight * Math.cos(angleRadians));

        canvas.width = rotatedCanvasWidth;
        canvas.height = rotatedCanvasHeight;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angleRadians);
        ctx.drawImage(
          image,
          -image.naturalWidth / 2,
          -image.naturalHeight / 2,
          image.naturalWidth,
          image.naturalHeight
        );
        ctx.restore();
      } else {
        // Cropping is required
        const cropX = completedCrop.x * scaleX;
        const cropY = completedCrop.y * scaleY;
        const cropWidth = completedCrop.width * scaleX;
        const cropHeight = completedCrop.height * scaleY;

        const rotatedCanvasWidth =
          Math.abs(cropWidth * Math.cos(angleRadians)) +
          Math.abs(cropHeight * Math.sin(angleRadians));
        const rotatedCanvasHeight =
          Math.abs(cropWidth * Math.sin(angleRadians)) +
          Math.abs(cropHeight * Math.cos(angleRadians));

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
          cropHeight
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

  const handleCancel = () => {
    setImageSrc(null);
    setOpen(false);
  };

  const validateField = (fieldName, index, value) => {
    const updatedErrors = { ...errors };
    const schemedata = watch('scheme');
    if (!schemedata) {
      enqueueSnackbar('Please select a scheme before adding properties.', { variant: 'warning' });
      return;
    }
    const totalWeight = parseFloat(getValues(`propertyDetails[${index}].totalWeight`)) || 0;
    const lossWeight = parseFloat(getValues(`propertyDetails[${index}].lossWeight`)) || 0;
    const caratValue =
      carat?.find(
        (item) => item?.name === parseFloat(getValues(`propertyDetails[${index}].carat`))
      ) || {};
    const typeValue = property?.find((item) => item?.propertyType === value) || {};
    const grossWeight = totalWeight - lossWeight;
    const netWeight = grossWeight * (caratValue?.caratPercentage / 100 || 1);
    switch (fieldName) {
      case 'totalWeight':
        if (!value) {
          updatedErrors[`propertyDetails[${index}].totalWeight`] = 'Total weight cannot be empty.';
        } else if (!/^-?\d*\.?\d*$/.test(value)) {
          updatedErrors[`propertyDetails[${index}].totalWeight`] = 'Please enter a valid number.';
        } else if (lossWeight > parseFloat(value)) {
          updatedErrors[`propertyDetails[${index}].totalWeight`] =
            'Loss weight cannot exceed total weight.';
        } else {
          delete updatedErrors[`propertyDetails[${index}].totalWeight`];
          setValue(`propertyDetails[${index}].grossWeight`, grossWeight.toFixed(2));
          setValue(`propertyDetails[${index}].netWeight`, netWeight.toFixed(2));
          setValue(
            `propertyDetails[${index}].grossAmount`,
            (grossWeight * schemedata?.ratePerGram).toFixed(2)
          );
          setValue(
            `propertyDetails[${index}].netAmount`,
            (netWeight * schemedata?.ratePerGram).toFixed(2)
          );
        }
        break;
      case 'lossWeight':
        if (!value) {
          updatedErrors[`propertyDetails[${index}].lossWeight`] = 'Loss weight cannot be empty.';
        } else if (!/^-?\d*\.?\d*$/.test(value)) {
          updatedErrors[`propertyDetails[${index}].lossWeight`] = 'Please enter a valid number.';
        } else if (parseFloat(value) > totalWeight) {
          updatedErrors[`propertyDetails[${index}].lossWeight`] =
            'Loss weight cannot exceed total weight.';
        } else {
          delete updatedErrors[`propertyDetails[${index}].lossWeight`];
          setValue(`propertyDetails[${index}].grossWeight`, grossWeight.toFixed(2));
          setValue(`propertyDetails[${index}].netWeight`, netWeight.toFixed(2));
          setValue(
            `propertyDetails[${index}].grossAmount`,
            (grossWeight * schemedata?.ratePerGram).toFixed(2)
          );
          setValue(
            `propertyDetails[${index}].netAmount`,
            (netWeight * schemedata?.ratePerGram).toFixed(2)
          );
        }
        break;
      case 'type':
        if (!value) {
          updatedErrors[`propertyDetails[${index}].type`] = 'Type is required.';
        } else {
          delete updatedErrors[`propertyDetails[${index}].type`];
          if (typeValue) {
            const { quantity, isQtyEdit } = typeValue;
            setValue(`propertyDetails[${index}].pcs`, quantity || 0);
            setValue(`propertyDetails[${index}].isPcsEditable`, isQtyEdit);
            if (!isQtyEdit && (!quantity || quantity <= 0)) {
              updatedErrors[`propertyDetails[${index}].pcs`] =
                'Invalid quantity for selected type.';
            }
          } else {
            updatedErrors[`propertyDetails[${index}].type`] = 'Invalid type selected.';
          }
        }
        break;
      case 'carat':
        if (!value) {
          updatedErrors[`propertyDetails[${index}].carat`] = 'Carat is required.';
        } else {
          delete updatedErrors[`propertyDetails[${index}].carat`];
          setValue(`propertyDetails[${index}].netWeight`, netWeight.toFixed(2));
          setValue(
            `propertyDetails[${index}].grossAmount`,
            (grossWeight * schemedata?.ratePerGram).toFixed(2)
          );
          setValue(
            `propertyDetails[${index}].netAmount`,
            (netWeight * schemedata?.ratePerGram).toFixed(2)
          );
        }
        break;
      case 'pcs':
        if (!value || parseInt(value) <= 0) {
          updatedErrors[`propertyDetails[${index}].pcs`] = 'Pcs must be a positive number.';
        } else {
          delete updatedErrors[`propertyDetails[${index}].pcs`];
          const grossAmount = (grossWeight * schemedata?.ratePerGram).toFixed(2);
          setValue(`propertyDetails[${index}].grossAmount`, grossAmount);
          const netAmount = (netWeight * schemedata?.ratePerGram).toFixed(2);
          setValue(`propertyDetails[${index}].netAmount`, netAmount);
        }
        break;
      default:
        break;
    }
    setErrors(updatedErrors);
  };

  const sx = {
    label: {
      mt: -1.4,
      fontSize: '14px',
    },
    '& .MuiInputLabel-shrink': {
      mt: 0,
    },
    input: {
      height: 0,
    },
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={2}>
          {!isFieldsEnabled && (
            <>
              {/*<Grid item xs={12} md={4}>*/}
              {/*  <Typography variant='h6' sx={{ mb: 3 }}>*/}
              {/*  </Typography>*/}
              {/*</Grid>*/}
              {/*<Grid item xs={12} md={8}>*/}
              {/*  <Alert severity='warning'>Please select acustomer to proceed with the loan issuance.</Alert>*/}
              {/*</Grid>*/}
            </>
          )}
          <Grid item xs={12} md={4}>
            <Box>
              <RHFUploadAvatar disabled={true} name="customer_url" maxSize={3145728} />
            </Box>
          </Grid>
          <Grid xs={12} md={8}>
            <Box>
              <Card sx={{ p: 2 }}>
                {!isFieldsEnabled && (
                  <Box sx={{ mb: 1.5 }}>
                    <Alert severity="warning">
                      Please select a loan to proceed with the other loan issuance.
                    </Alert>
                  </Box>
                )}
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
                    name="loan"
                    label="Select Loan"
                    req={'red'}
                    fullWidth
                    options={Loanissue?.filter((e) => e.status !== 'Closed')?.map((item) => ({
                      id: item._id,
                      loanNo: item.loanNo,
                    }))}
                    getOptionLabel={(option) => option.loanNo}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.loanNo}
                      </li>
                    )}
                  />
                </Box>
              </Card>
            </Box>
          </Grid>
          <Grid xs={12}>
            <Card sx={{ p: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  fontWeight: '600',
                }}
              >
                Customer Details
              </Typography>
              <Box
                rowGap={1.5}
                columnGap={1.5}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(5, 1fr)',
                }}
              >
                <RHFTextField
                  name="customerCode"
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{ shrink: true }}
                  label={'Customer Code'}
                />
                <RHFTextField
                  name="customerName"
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{ shrink: true }}
                  label={'Customer Name'}
                />
                <RHFTextField
                  name="customerAddress"
                  InputProps={{ readOnly: true }}
                  label={'Customer Address'}
                  InputLabelProps={{ shrink: true }}
                />
                <RHFTextField
                  name="contact"
                  InputProps={{ readOnly: true }}
                  label={'Mobile No.'}
                  InputLabelProps={{ shrink: true }}
                />
                <RHFTextField
                  name="contactOtp"
                  InputProps={{ readOnly: true }}
                  label={'OTP Mobile No.'}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Card>
          </Grid>
          <Grid xs={12} md={12}>
            <Card sx={{ p: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                }}
              >
                Loan Details
              </Typography>
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
                  req={'red'}
                  InputProps={{ readOnly: true }}
                  disabled
                />
                <RHFDatePicker
                  name="issueDate"
                  control={control}
                  label="Issue Date"
                  req={'red'}
                  disabled
                />
                <RHFTextField
                  name="loanAmount"
                  label="Total Loan Amount"
                  req={'red'}
                  InputProps={{ readOnly: true }}
                  disabled
                />
                <RHFTextField
                  name="partLoanAmount"
                  label="Part Loan Amount"
                  req={'red'}
                  InputProps={{ readOnly: true }}
                  disabled
                />
                <RHFTextField
                  name="intLoanAmount"
                  label="Int. Loan Amount"
                  req={'red'}
                  InputProps={{ readOnly: true }}
                  disabled
                />
                <RHFTextField
                  name="intRate"
                  label="Int. Rate"
                  req={'red'}
                  InputProps={{ readOnly: true }}
                  disabled
                />
                <RHFTextField
                  name="consultingCharge"
                  label="Consulting Charge"
                  req={'red'}
                  InputProps={{ readOnly: true }}
                  disabled
                />
                <RHFTextField name="approvalCharge" label="Approval Charge" disabled req={'red'} />
                <RHFTextField name="closingCharge" label="Closing Charge" disabled req={'red'} />
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
                {isFieldsEnabled && (
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
                          key={propertImg}
                          src={propertImg}
                          alt={propertImg}
                          ratio="1/1"
                          onClick={() => lightbox.onOpen(propertImg)}
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
                )}
              </Box>
            </Card>
          </Grid>
          {/*<Grid item xs={12} md={2}>*/}
          {/*  <Box sx={{ textAlign: 'center', mb: 1 }}>*/}
          {/*    <Typography variant="subtitle1" component={'span'} sx={{ fontWeight: 600 }}>*/}
          {/*      Property Image*/}
          {/*    </Typography>*/}
          {/*  </Box>*/}
          {/*  <Card>*/}
          {/*    <CardContent sx={{ height: '156px', p: 1.5 }}>*/}
          {/*      <Box*/}
          {/*        sx={{*/}
          {/*          display: 'flex',*/}
          {/*          justifyContent: 'space-between',*/}
          {/*          alignItems: 'center',*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        <Typography*/}
          {/*          variant="subtitle1"*/}
          {/*          sx={{*/}
          {/*            display: 'inline-block',*/}
          {/*            fontWeight: 600,*/}
          {/*          }}*/}
          {/*        ></Typography>*/}
          {/*      </Box>*/}
          {/*      <Box mt={0.2}>*/}
          {/*        /!*{(croppedImage || capturedImage) ? (*!/*/}
          {/*        <RHFUploadAvatar*/}
          {/*          radius={true}*/}
          {/*          name="property_image"*/}
          {/*          camera={true}*/}
          {/*          setOpen2={setOpen2}*/}
          {/*          setOpen={setOpen}*/}
          {/*          setImageSrc={setImageSrc}*/}
          {/*          setFile={setFile}*/}
          {/*          file={*/}
          {/*            croppedImage || capturedImage || imageSrc || currentOtherLoanIssue?.propertyImage*/}
          {/*          }*/}
          {/*          maxSize={3145728}*/}
          {/*          accept="image/*"*/}
          {/*          onDrop={handleDropSingleFile}*/}
          {/*        />*/}
          {/*        /!*)}*!/*/}
          {/*      </Box>*/}
          {/*      <Dialog open={Boolean(open)} onClose={handleCancel}>*/}
          {/*        /!*{imageSrc && (*!/*/}
          {/*        <ReactCrop*/}
          {/*          crop={crop}*/}
          {/*          onChange={(newCrop) => setCrop(newCrop)}*/}
          {/*          onComplete={(newCrop) => setCompletedCrop(newCrop)}*/}
          {/*          aspect={1}*/}
          {/*        >*/}
          {/*          <img*/}
          {/*            id="cropped-image"*/}
          {/*            src={imageSrc || capturedImage}*/}
          {/*            alt="Crop preview"*/}
          {/*            onLoad={resetCrop}*/}
          {/*            style={{ transform: `rotate(${rotation}deg)` }}*/}
          {/*          />*/}
          {/*        </ReactCrop>*/}
          {/*        /!*)}*!/*/}
          {/*        <Box*/}
          {/*          style={{*/}
          {/*            display: 'flex',*/}
          {/*            justifyContent: 'space-between',*/}
          {/*            padding: '1rem',*/}
          {/*          }}*/}
          {/*        >*/}
          {/*          <Button variant="outlined" onClick={handleCancel}>*/}
          {/*            Cancel*/}
          {/*          </Button>*/}
          {/*          <Box sx={{ display: 'flex' }}>*/}
          {/*            <IconButton*/}
          {/*              onClick={() => rotateImage(-90)} // Rotate left by 90 degrees*/}
          {/*              style={{ marginRight: '10px' }}*/}
          {/*            >*/}
          {/*              <Iconify icon="material-symbols:rotate-90-degrees-cw-rounded" />*/}
          {/*            </IconButton>*/}
          {/*            <IconButton*/}
          {/*              onClick={() => rotateImage(90)} // Rotate right by 90 degrees*/}
          {/*            >*/}
          {/*              <Iconify icon="material-symbols:rotate-90-degrees-ccw-rounded" />*/}
          {/*            </IconButton>*/}
          {/*          </Box>*/}
          {/*          <Button variant="contained" color="primary" onClick={showCroppedImage}>*/}
          {/*            Save Image*/}
          {/*          </Button>*/}
          {/*        </Box>*/}
          {/*      </Dialog>*/}
          {/*    </CardContent>*/}
          {/*  </Card>*/}
          {/*</Grid>*/}
          {/*<Grid item xs={12} md={12}>*/}
          {/*  <Card>*/}
          {/*    <CardContent sx={{ p: 2 }}>*/}
          {/*      <Typography*/}
          {/*        variant="subtitle1"*/}
          {/*        sx={{*/}
          {/*          mb: 1,*/}
          {/*          fontWeight: '600',*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        Property Details*/}
          {/*      </Typography>*/}
          {/*      <TableContainer>*/}
          {/*        <Table>*/}
          {/*          <TableHeadCustom*/}
          {/*            order={table.order}*/}
          {/*            orderBy={table.orderBy}*/}
          {/*            headLabel={TABLE_HEAD}*/}
          {/*            onSort={table.onSort}*/}
          {/*          />*/}
          {/*          <TableBody>*/}
          {/*            {fields.map((row, index) => (*/}
          {/*              <TableRow*/}
          {/*                key={row.id}*/}
          {/*                sx={{*/}
          {/*                  '&:hover': { backgroundColor: 'inherit' },*/}
          {/*                  height: '10px',*/}
          {/*                }}*/}
          {/*              >*/}
          {/*                <TableCell*/}
          {/*                  sx={{*/}
          {/*                    width: '200px',*/}
          {/*                    padding: '0px 8px',*/}
          {/*                  }}*/}
          {/*                >*/}
          {/*                  <RHFAutocomplete*/}
          {/*                    sx={sx}*/}
          {/*                    name={`propertyDetails[${index}].type`}*/}
          {/*                    label="Type"*/}
          {/*                    disabled={!isFieldsEnabled}*/}
          {/*                    options={property*/}
          {/*                      ?.filter((e) => e.isActive === true)*/}
          {/*                      ?.map((item) => ({*/}
          {/*                        label: item.propertyType,*/}
          {/*                        value: item.propertyType,*/}
          {/*                      }))}*/}
          {/*                    onChange={(e, value) => {*/}
          {/*                      setValue(`propertyDetails[${index}].type`, value?.value || '');*/}
          {/*                      validateField('type', index, value?.value);*/}
          {/*                    }}*/}
          {/*                    helperText={errors[`propertyDetails[${index}].type`] || ''}*/}
          {/*                    error={!!errors[`propertyDetails[${index}].type`]}*/}
          {/*                  />*/}
          {/*                </TableCell>*/}
          {/*                <TableCell*/}
          {/*                  sx={{*/}
          {/*                    width: '40px',*/}
          {/*                    padding: '0px 8px',*/}
          {/*                  }}*/}
          {/*                >*/}
          {/*                  <RHFAutocomplete*/}
          {/*                    sx={{*/}
          {/*                      label: {*/}
          {/*                        mt: -1.4,*/}
          {/*                        fontSize: '14px',*/}
          {/*                      },*/}
          {/*                      '& .MuiInputLabel-shrink': {*/}
          {/*                        mt: 0,*/}
          {/*                      },*/}
          {/*                      input: { height: 0 },*/}
          {/*                    }}*/}
          {/*                    name={`propertyDetails[${index}].carat`}*/}
          {/*                    label="Carat"*/}
          {/*                    disabled={!isFieldsEnabled}*/}
          {/*                    options={carat*/}
          {/*                      ?.filter((e) => e.isActive === true)*/}
          {/*                      ?.map((e) => e?.name)}*/}
          {/*                    onChange={(e, value) => {*/}
          {/*                      setValue(`propertyDetails[${index}].carat`, value);*/}
          {/*                      validateField('carat', index, value);*/}
          {/*                    }}*/}
          {/*                  />*/}
          {/*                </TableCell>*/}
          {/*                <TableCell*/}
          {/*                  sx={{*/}
          {/*                    width: '80px',*/}
          {/*                    padding: '0px 8px',*/}
          {/*                  }}*/}
          {/*                >*/}
          {/*                  <RHFTextField*/}
          {/*                    sx={sx}*/}
          {/*                    name={`propertyDetails[${index}].pcs`}*/}
          {/*                    label="PCS"*/}
          {/*                    type="number"*/}
          {/*                    disabled={*/}
          {/*                      !watch(`propertyDetails[${index}].isPcsEditable`) &&*/}
          {/*                      !isFieldsEnabled*/}
          {/*                    }*/}
          {/*                    helperText={errors[`propertyDetails[${index}].pcs`] || ''}*/}
          {/*                    error={!!errors[`propertyDetails[${index}].pcs`]}*/}
          {/*                    onChange={(e) => {*/}
          {/*                      setValue(`propertyDetails[${index}].pcs`, e.target.value);*/}
          {/*                      validateField('pcs', index, e.target.value);*/}
          {/*                    }}*/}
          {/*                  />*/}
          {/*                </TableCell>*/}
          {/*                <TableCell*/}
          {/*                  sx={{*/}
          {/*                    width: '100px',*/}
          {/*                    padding: '0px 8px',*/}
          {/*                  }}*/}
          {/*                >*/}
          {/*                  <RHFTextField*/}
          {/*                    sx={sx}*/}
          {/*                    name={`propertyDetails[${index}].totalWeight`}*/}
          {/*                    label="Total Weight"*/}
          {/*                    type="number"*/}
          {/*                    disabled={!isFieldsEnabled}*/}
          {/*                    helperText={errors[`propertyDetails[${index}].totalWeight`] || ''}*/}
          {/*                    error={!!errors[`propertyDetails[${index}].totalWeight`]}*/}
          {/*                    onChange={(e) => {*/}
          {/*                      setValue(`propertyDetails[${index}].totalWeight`, e.target.value);*/}
          {/*                      validateField('totalWeight', index, e.target.value);*/}
          {/*                    }}*/}
          {/*                  />*/}
          {/*                </TableCell>*/}
          {/*                <TableCell*/}
          {/*                  sx={{*/}
          {/*                    width: '100px',*/}
          {/*                    padding: '0px 8px',*/}
          {/*                  }}*/}
          {/*                >*/}
          {/*                  <RHFTextField*/}
          {/*                    sx={sx}*/}
          {/*                    name={`propertyDetails[${index}].lossWeight`}*/}
          {/*                    label="Loss Weight"*/}
          {/*                    disabled={!isFieldsEnabled}*/}
          {/*                    type="number"*/}
          {/*                    helperText={errors[`propertyDetails[${index}].lossWeight`] || ''}*/}
          {/*                    error={!!errors[`propertyDetails[${index}].lossWeight`]}*/}
          {/*                    onChange={(e) => {*/}
          {/*                      const value = e.target.value;*/}
          {/*                      setValue(`propertyDetails[${index}].lossWeight`, value);*/}
          {/*                      validateField('lossWeight', index, value);*/}
          {/*                    }}*/}
          {/*                  />*/}
          {/*                </TableCell>*/}
          {/*                <TableCell*/}
          {/*                  sx={{*/}
          {/*                    width: '120px',*/}
          {/*                    padding: '0px 8px',*/}
          {/*                  }}*/}
          {/*                >*/}
          {/*                  <RHFTextField*/}
          {/*                    sx={sx}*/}
          {/*                    name={`propertyDetails[${index}].grossWeight`}*/}
          {/*                    label="GW"*/}
          {/*                    disabled={true}*/}
          {/*                    value={getValues(`propertyDetails[${index}].grossWeight`) || ''}*/}
          {/*                  />*/}
          {/*                </TableCell>*/}
          {/*                <TableCell*/}
          {/*                  sx={{*/}
          {/*                    width: '120px',*/}
          {/*                    padding: '0px 8px',*/}
          {/*                  }}*/}
          {/*                >*/}
          {/*                  <RHFTextField*/}
          {/*                    sx={sx}*/}
          {/*                    name={`propertyDetails[${index}].netWeight`}*/}
          {/*                    label="NW"*/}
          {/*                    disabled={true}*/}
          {/*                    value={getValues(`propertyDetails[${index}].netWeight`) || ''}*/}
          {/*                  />*/}
          {/*                </TableCell>*/}
          {/*                <TableCell*/}
          {/*                  sx={{*/}
          {/*                    width: '120px',*/}
          {/*                    padding: '06px 8px',*/}
          {/*                  }}*/}
          {/*                >*/}
          {/*                  <RHFTextField*/}
          {/*                    sx={sx}*/}
          {/*                    name={`propertyDetails[${index}].grossAmount`}*/}
          {/*                    label="GA"*/}
          {/*                    disabled={true}*/}
          {/*                  />*/}
          {/*                </TableCell>*/}
          {/*                <TableCell*/}
          {/*                  sx={{*/}
          {/*                    width: '120px',*/}
          {/*                    padding: '0px 8px',*/}
          {/*                  }}*/}
          {/*                >*/}
          {/*                  <RHFTextField*/}
          {/*                    sx={sx}*/}
          {/*                    name={`propertyDetails[${index}].netAmount`}*/}
          {/*                    label="NA"*/}
          {/*                    disabled={true}*/}
          {/*                  />*/}
          {/*                </TableCell>*/}
          {/*                <TableCell*/}
          {/*                  sx={{*/}
          {/*                    width: '100px',*/}
          {/*                    padding: '0px 8px',*/}
          {/*                  }}*/}
          {/*                >*/}
          {/*                  <IconButton*/}
          {/*                    onClick={() => handleReset(index)}*/}
          {/*                    disabled={!isFieldsEnabled}*/}
          {/*                  >*/}
          {/*                    <Iconify icon="ic:baseline-refresh" />*/}
          {/*                  </IconButton>*/}
          {/*                  <IconButton*/}
          {/*                    color="error"*/}
          {/*                    onClick={() => handleRemove(index)}*/}
          {/*                    disabled={!isFieldsEnabled || fields.length === 1}*/}
          {/*                  >*/}
          {/*                    <Iconify icon="solar:trash-bin-trash-bold" />*/}
          {/*                  </IconButton>*/}
          {/*                </TableCell>*/}
          {/*              </TableRow>*/}
          {/*            ))}*/}
          {/*            <TableRow*/}
          {/*              sx={{*/}
          {/*                backgroundColor: (theme) =>*/}
          {/*                  theme.palette.mode === 'light' ? '#e0f7fa' : '#2f3944',*/}
          {/*              }}*/}
          {/*            >*/}
          {/*              <TableCell*/}
          {/*                colSpan={2}*/}
          {/*                sx={{*/}
          {/*                  padding: '8px',*/}
          {/*                }}*/}
          {/*              >*/}
          {/*                <strong>Total:</strong>*/}
          {/*              </TableCell>*/}
          {/*              <TableCell sx={{ padding: '8px' }}>{calculateTotal('pcs')}</TableCell>*/}
          {/*              <TableCell sx={{ padding: '8px' }}>*/}
          {/*                {calculateTotal('totalWeight')}*/}
          {/*              </TableCell>*/}
          {/*              <TableCell sx={{ padding: '8px' }}>*/}
          {/*                {calculateTotal('lossWeight')}*/}
          {/*              </TableCell>*/}
          {/*              <TableCell sx={{ padding: '8px' }}>*/}
          {/*                {calculateTotal('grossWeight')}*/}
          {/*              </TableCell>*/}
          {/*              <TableCell sx={{ padding: '8px' }}>{calculateTotal('netWeight')}</TableCell>*/}
          {/*              <TableCell sx={{ padding: '8px' }}>*/}
          {/*                {calculateTotal('grossAmount')}*/}
          {/*              </TableCell>*/}
          {/*              <TableCell sx={{ padding: '8px' }}>{calculateTotal('netAmount')}</TableCell>*/}
          {/*              <TableCell sx={{ padding: '8px' }}></TableCell>*/}
          {/*            </TableRow>*/}
          {/*          </TableBody>*/}
          {/*        </Table>*/}
          {/*      </TableContainer>*/}
          {/*    </CardContent>*/}
          {/*    <CardActions*/}
          {/*      sx={{*/}
          {/*        margin: '0px 16px 10px 16px',*/}
          {/*        justifyContent: 'flex-end',*/}
          {/*        p: 0,*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      <Button*/}
          {/*        size="small"*/}
          {/*        disabled={!isFieldsEnabled}*/}
          {/*        variant="contained"*/}
          {/*        color="primary"*/}
          {/*        startIcon={<Iconify icon="mingcute:add-line" />}*/}
          {/*        onClick={handleAdd}*/}
          {/*      >*/}
          {/*        Add Property*/}
          {/*      </Button>*/}
          {/*    </CardActions>*/}
          {/*  </Card>*/}
          {/*</Grid>*/}
          <Grid xs={12}>
            <Card sx={{ p: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                }}
              >
                Other Loan Details
              </Typography>
              <Box
                rowGap={1.5}
                columnGap={1.5}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(7, 1fr)',
                }}
              >
                <RHFAutocomplete
                  disabled={!isFieldsEnabled}
                  name="otherName"
                  label="Other Name"
                  req="red"
                  fullWidth
                  options={
                    configs?.otherNames?.length > 0 ? configs.otherNames.map((item) => item) : []
                  }
                  getOptionLabel={(option) => option || ''}
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  )}
                />

                <RHFTextField
                  name="otherNumber"
                  label="Other Number"
                  req={'red'}
                  disabled={!isFieldsEnabled}
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
                  req={'red'}
                  disabled={!isFieldsEnabled}
                  onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                      e.preventDefault();
                    }
                  }}
                />
                <RHFTextField
                  name="percentage"
                  label="Percentage"
                  req={'red'}
                  disabled={!isFieldsEnabled}
                  onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                      e.preventDefault();
                    }
                  }}
                />
                <RHFDatePicker
                  name="date"
                  control={control}
                  label="Date"
                  req={'red'}
                  disabled={!isFieldsEnabled}
                />
                <RHFTextField
                  name="grossWt"
                  label="Gross Wt"
                  req={'red'}
                  disabled={!isFieldsEnabled}
                  onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                      e.preventDefault();
                    }
                  }}
                />
                <RHFTextField name="netWt" label="Net Wt" req={'red'} disabled={!isFieldsEnabled} />
                <RHFTextField
                  name="rate"
                  label="Rate"
                  req={'red'}
                  disabled
                  value={watch('netWt') ? (watch('amount') / watch('netWt')).toFixed(2) : 0}
                />
                <RHFAutocomplete
                  name="month"
                  label="Month"
                  req={'red'}
                  fullWidth
                  disabled={!isFieldsEnabled}
                  options={configs?.months?.length > 0 ? configs.months.map((item) => item) : []}
                  getOptionLabel={(option) => option}
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  )}
                />
                <RHFDatePicker
                  name="renewalDate"
                  control={control}
                  label="Renewal Date"
                  req={'red'}
                  disabled={!isFieldsEnabled}
                />
                <RHFDatePicker
                  name="closeDate"
                  control={control}
                  label="Close Date"
                  req={'red'}
                  disabled={!isFieldsEnabled}
                />
                <RHFTextField
                  name="otherCharge"
                  label="Other Charge"
                  req={'red'}
                  disabled={!isFieldsEnabled}
                />
                <RHFTextField
                  name="closingCharge"
                  label="Closing charge"
                  req={'red'}
                  disabled={!isFieldsEnabled}
                  onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                      e.preventDefault();
                    }
                  }}
                />
                <RHFTextField
                  name="interestAmount"
                  label="Interest Amount"
                  req={'red'}
                  disabled={!isFieldsEnabled}
                  onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
                      e.preventDefault();
                    }
                  }}
                />
                <RHFTextField
                  name="remark"
                  label="Remark"
                  req={'red'}
                  disabled={!isFieldsEnabled}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  fontWeight: '600',
                }}
              >
                Payment Details
              </Typography>
              <Box
                rowGap={1.5}
                columnGap={1.5}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)',
                }}
              >
                <Controller
                  name="loanAmount"
                  control={control}
                  render={({ field }) => (
                    <RHFTextField
                      {...field}
                      label="Loan Amount"
                      req={'red'}
                      disabled
                      type="number"
                      inputProps={{ min: 0 }}
                      // onChange={(e) => {
                      //   field.onChange(e);
                      //   // handleLoanAmountChange(e);
                      //   handleAmountChange();
                      // }}
                    />
                  )}
                />
                <RHFAutocomplete
                  name="paymentMode"
                  label="Payment Mode"
                  req={'red'}
                  disabled
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
                    handleLoanAmountChange({
                      target: {
                        value: getValues('loanAmount'),
                      },
                    });
                  }}
                />
                {watch('paymentMode') === 'Cash' && (
                  <Controller
                    name="cashAmount"
                    control={control}
                    render={({ field }) => (
                      <RHFTextField
                        {...field}
                        label="Cash Amount"
                        req={'red'}
                        disabled
                        type="number"
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
                    name="bankAmount"
                    control={control}
                    render={({ field }) => (
                      <RHFTextField
                        {...field}
                        label="Bank Amount"
                        req={'red'}
                        disabled
                        type="number"
                        inputProps={{ min: 0 }}
                      />
                    )}
                  />
                )}
                {watch('paymentMode') === 'Both' && (
                  <>
                    <Controller
                      name="cashAmount"
                      control={control}
                      render={({ field }) => (
                        <RHFTextField
                          {...field}
                          label="Cash Amount"
                          req={'red'}
                          disabled
                          type="number"
                          inputProps={{ min: 0 }}
                          onChange={(e) => {
                            field.onChange(e);
                            handleCashAmountChange(e);
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="bankAmount"
                      control={control}
                      render={({ field }) => (
                        <RHFTextField
                          {...field}
                          label="Bank Amount"
                          req={'red'}
                          disabled
                          type="number"
                          inputProps={{ min: 0 }}
                        />
                      )}
                    />
                  </>
                )}
              </Box>
            </Card>
          </Grid>

          {['Bank', 'Both'].includes(watch('paymentMode')) && (
            <>
              <Grid item xs={12} md={12}>
                <Card sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 0.5,
                        fontWeight: '600',
                      }}
                    >
                      Account Details
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        pb: 1.5,
                      }}
                    >
                      <Button
                        variant={'outlined'}
                        disabled={!isFieldsEnabled}
                        onClick={() => saveCustomerBankDetails()}
                        style={{
                          fontWeight: 'bold',
                          textDecoration: 'none',
                          color: 'inherit',
                        }}
                      >
                        Add beneficiary
                      </Button>
                    </Box>
                  </Box>
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(6, 1fr)',
                    }}
                  >
                    <RHFTextField
                      name="accountNumber"
                      label="Account No."
                      req={'red'}
                      disabled
                      type="number"
                      inputProps={{ min: 0 }}
                    />
                    <RHFAutocomplete
                      name="accountType"
                      label="Account Type"
                      req={'red'}
                      disabled
                      fullWidth
                      options={ACCOUNT_TYPE_OPTIONS?.map((item) => item)}
                      getOptionLabel={(option) => option}
                      renderOption={(props, option) => (
                        <li {...props} key={option}>
                          {option}
                        </li>
                      )}
                    />
                    <RHFTextField
                      name="accountHolderName"
                      label="Account Holder Name"
                      disabled
                      req={'red'}
                    />
                    <RHFTextField
                      name="IFSC"
                      label="IFSC Code"
                      inputProps={{ maxLength: 11, pattern: '[A-Za-z0-9]*' }}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                      }}
                      onBlur={(e) => checkIFSC(e.target.value)}
                    />
                    <RHFTextField name="bankName" label="Bank Name" req={'red'} disabled />
                    <RHFTextField name="branchName" label="Branch Name" req={'red'} disabled />
                  </Box>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
        <Box
          xs={12}
          md={8}
          sx={{
            display: 'flex',
            justifyContent: 'end',
            mt: 3,
          }}
        >
          <Button
            color="inherit"
            sx={{
              margin: '0px 10px',
              height: '36px',
            }}
            disabled={!isFieldsEnabled}
            variant="outlined"
            onClick={() => reset()}
          >
            Reset
          </Button>
          <LoadingButton
            disabled={!isFieldsEnabled}
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {!currentOtherLoanIssue ? 'Submit' : 'Save'}
          </LoadingButton>
        </Box>
      </FormProvider>
      <Lightbox image={propertImg} open={lightbox.open} close={lightbox.onClose} />

      {/*<Dialog*/}
      {/*  fullWidth*/}
      {/*  maxWidth={false}*/}
      {/*  open={open2}*/}
      {/*  onClose={() => setOpen2(false)}*/}
      {/*  PaperProps={{*/}
      {/*    sx: { maxWidth: 720 },*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <DialogTitle>Camera</DialogTitle>*/}
      {/*  <Box*/}
      {/*    sx={{*/}
      {/*      display: 'flex',*/}
      {/*      justifyContent: 'center',*/}
      {/*      alignItems: 'center',*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Webcam*/}
      {/*      audio={false}*/}
      {/*      ref={webcamRef}*/}
      {/*      screenshotFormat="image/jpeg"*/}
      {/*      width={'90%'}*/}
      {/*      height={'100%'}*/}
      {/*      videoConstraints={videoConstraints}*/}
      {/*    />*/}
      {/*  </Box>*/}
      {/*  <DialogActions>*/}
      {/*    <Button variant="outlined" onClick={capture}>*/}
      {/*      Capture Photo*/}
      {/*    </Button>*/}
      {/*    <Button variant="contained" onClick={() => setOpen2(false)}>*/}
      {/*      Close Camera*/}
      {/*    </Button>*/}
      {/*  </DialogActions>*/}
      {/*</Dialog>*/}
    </>
  );
}
OtherLoanissueNewEditForm.propTypes = { currentOtherLoanIssue: PropTypes.object };
