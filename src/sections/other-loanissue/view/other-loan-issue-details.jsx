import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Divider,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {fDate} from '../../../utils/format-time.js';

export default function OtherLoanIssueDetails({selectedRow}) {
  if (!selectedRow) return null;
  const loan = selectedRow?.loan || {};
  const customer = selectedRow?.loan?.customer || {};
  const address = customer.permanentAddress || {};
  const scheme = selectedRow?.loan?.scheme || {};
  const bank = selectedRow.bankDetails || {};
  const propertyDetails = selectedRow?.loan?.propertyDetails || [];

  return (
    <Box p={2}>
      {/* Images at the top */}
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        {customer.avatar_url && (
          <Avatar src={customer.avatar_url} alt="Customer" sx={{width: 90, height: 90}}/>
        )}
        {selectedRow.loan.propertyImage && (
          <Avatar src={selectedRow.loan.propertyImage} alt="Property" sx={{width: 90, height: 90}}/>
        )}
      </Box>

      <Typography variant="h6" gutterBottom>
        Other Loan Overview
      </Typography>
      <Divider sx={{mb: 2}}/>

      {/* Customer Details */}
      <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 1}}>
        Customer Details
      </Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={4}>
          <b>Customer Code:</b> {customer.customerCode}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Name:</b> {customer.firstName} {customer.middleName} {customer.lastName}
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <b>Address:</b> {address.street}, {address.landmark}, {address.city}, {address.zipcode}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Mobile No.:</b> {customer.contact}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>OTP Mobile No.:</b> {customer.otpContact}
        </Grid>
      </Grid>

      <Divider sx={{my: 2}}/>

      {/* Loan Details */}
      <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 1}}>
        Loan Details
      </Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={4}>
          <b>Loan No.:</b> {loan.loanNo}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Issue Date:</b> {fDate(loan.issueDate)}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Total Wt:</b>{' '}
          {loan.propertyDetails.reduce(
            (prev, next) => prev + (Number(next?.totalWeight) || 0),
            0
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Net Wt:</b> {loan.propertyDetails.reduce(
          (prev, next) => prev + (Number(next?.netWeight) || 0),
          0
        )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Total Loan Amount:</b> {loan.loanAmount}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Part Loan Amount:</b> {loan.loanAmount - loan.interestLoanAmount}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Int. Loan Amount:</b> {loan.interestLoanAmount}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Int. Rate:</b> {loan.scheme.interestRate}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Consulting Charge:</b> {loan.consultingCharge}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Approval Charge:</b> {loan.approvalCharge}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Jeweller Name:</b> {loan.jewellerName}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Loan Type:</b> {loan.loanType}
        </Grid>
      </Grid>

      <Divider sx={{my: 2}}/>

      {/* Other Loan Details as columns */}
      <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 1}}>
        Other Loan Details
      </Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={4}>
          <b>Other Name:</b> {selectedRow.otherName}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Other Number:</b> {selectedRow.otherNumber}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Amount:</b> {selectedRow.amount}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Percentage:</b> {selectedRow.percentage}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Date:</b> {fDate(selectedRow.date)}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Gross Wt:</b> {selectedRow.grossWt}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Net Wt:</b> {selectedRow.netWt}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Rate:</b> {selectedRow.rate}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Month:</b> {selectedRow.month}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Renewal Date:</b> {fDate(selectedRow.renewalDate)}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Other Charge:</b> {selectedRow.otherCharge}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Ornament Detail:</b> {selectedRow.ornamentDetail}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Total Ornament:</b> {selectedRow.totalOrnament}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Remark:</b> {selectedRow.remark}
        </Grid>
      </Grid>

      <Divider sx={{my: 2}}/>

      {/* Payment Details */}
      <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 1}}>
        Payment Details
      </Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={4}>
          <b>Loan Amount:</b> {selectedRow.amount}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Payment Mode:</b> {selectedRow.paymentMode}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Cash Amount:</b> {selectedRow.cashAmount}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Bank Amount:</b> {selectedRow.bankAmount}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Account:</b> {bank.account ? bank.account.bankName : ''}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Account No.:</b> {bank.accountNumber}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Account Type:</b> {bank.accountType}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Account Holder Name:</b> {bank.accountHolderName}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>IFSC Code:</b> {bank.IFSC}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Bank Name:</b> {bank.bankName}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <b>Branch Name:</b> {bank.branchName}
        </Grid>
      </Grid>

      <Divider sx={{my: 2}}/>

      {/* Property Details Table */}
      <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 1}}>
        Property Details
      </Typography>
      <TableContainer component={Paper} sx={{mb: 2}}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Property Name</b>
              </TableCell>
              <TableCell>
                <b>Carat</b>
              </TableCell>
              <TableCell>
                <b>Qty</b>
              </TableCell>
              <TableCell>
                <b>Total Wt</b>
              </TableCell>
              <TableCell>
                <b>Loss Wt</b>
              </TableCell>
              <TableCell>
                <b>Gross Wt</b>
              </TableCell>
              <TableCell>
                <b>Net Wt</b>
              </TableCell>
              <TableCell>
                <b>Gross Amt</b>
              </TableCell>
              <TableCell>
                <b>Net Amt</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {propertyDetails.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.carat}</TableCell>
                <TableCell>{row.pcs}</TableCell>
                <TableCell>{row.totalWeight}</TableCell>
                <TableCell>{row.lossWeight}</TableCell>
                <TableCell>{row.grossWeight}</TableCell>
                <TableCell>{row.netWeight}</TableCell>
                <TableCell>{row.grossAmount}</TableCell>
                <TableCell>{row.netAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
