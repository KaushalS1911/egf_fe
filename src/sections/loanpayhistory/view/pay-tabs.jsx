import React, { useState } from 'react';
import Card from '@mui/material/Card';
import { Tab, Tabs } from '@mui/material';
import InterestPayDetailsForm from './interest-pay-details-form';
import PartReleaseForm from './part-release-form';
import UchakInterestPayForm from './uchak-interest-pay-form';
import LoanPartPaymentForm from './loan-part-payment-form';
import LoanCloseForm from './loan-close-form';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

function PayTabs({ mutate, currentLoan }) {
  const [activeTab, setActiveTab] = useState(0);
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  return (
    <>
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Typography variant='subtitle1' sx={{  fontWeight: 600 }}>
            Loan Pay Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Tabs value={activeTab} onChange={handleChange} variant='scrollable' scrollButtons='auto' sx={{ mb: 3 }}>
              <Tab label='Interest Pay Details' />
              <Tab label='Part Release' />
              <Tab label='Uchak Interest Pay Details' />
              <Tab label='Loan Part Payment' />
              <Tab label='Loan Close' />
            </Tabs>
            {(activeTab === 0 && currentLoan) && <InterestPayDetailsForm currentLoan={currentLoan} mutate={mutate} />}
            {(activeTab === 1 && currentLoan) && <PartReleaseForm currentLoan={currentLoan} mutate={mutate} />}
            {(activeTab === 2 && currentLoan) && <UchakInterestPayForm currentLoan={currentLoan} mutate={mutate} />}
            {(activeTab === 3 && currentLoan) && <LoanPartPaymentForm currentLoan={currentLoan} mutate={mutate} />}
            {(activeTab === 4 && currentLoan) && <LoanCloseForm currentLoan={currentLoan} mutate={mutate} />}
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default PayTabs;
