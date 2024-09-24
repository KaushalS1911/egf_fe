import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Box, Card, CardHeader } from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import { Stack } from '@mui/system';

export default function LoanTypeView() {
  const { user } = useAuthContext();
  const { configs, mutate } = useGetConfigs();
  const [inputVal, setInputVal] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    if (!inputVal) {
      enqueueSnackbar('Loan Type cannot be empty', { variant: 'warning' });
      return;
    }

    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const updatedLoanTypes = configs.loanTypes ? [...configs.loanTypes, inputVal] : [inputVal];
    const payload = { ...configs, loanTypes: updatedLoanTypes };

    axios.put(URL, payload)
      .then((res) => {
        if (res.status === 200) {
          setInputVal('');
          enqueueSnackbar('Loan Type added successfully', { variant: 'success' });
          mutate();
        }
      })
      .catch((err) => {
        enqueueSnackbar('Failed to add Loan Type', { variant: 'error' });
        console.log(err);
      });
  };

  const handleDelete = (loan) => {
    const updatedLoanTypes = configs.loanTypes.filter((r) => r !== loan);
    const apiEndpoint = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const payload = { ...configs, loanTypes: updatedLoanTypes };

    axios.put(apiEndpoint, payload)
      .then(() => {
        enqueueSnackbar('Loan Type deleted successfully', { variant: 'success' });
        mutate();
      })
      .catch((err) => {
        enqueueSnackbar('Failed to delete Loan Type', { variant: 'error' });
        console.log(err);
      });
  };

  return (
    <Box sx={{ width: '100%', padding: '10px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CardHeader title='Add Loan Type' />
        </Grid>

        <Grid item md={4} xs={12}>
          <Box sx={{ width: '100%', maxWidth: '600px', padding: '10px' }}>
            <TextField
              fullWidth
              variant='outlined'
              label='Loan Type'
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              sx={{ fontSize: '16px' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '20px' }}>
              <Button variant='contained' onClick={handleClick}>
                Add
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <Stack spacing={3} sx={{ p: 3 }}>
              <Box
                columnGap={2}
                rowGap={2}
                display='grid'
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                {configs?.loanTypes && configs.loanTypes.length !== 0 && configs.loanTypes.map((loan, index) => (
                  <Grid
                    container
                    key={index}
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      boxShadow: 4,
                      borderRadius: 1,
                      p: 2,
                      m: 1,
                    }}
                  >
                    <Grid item>
                      <Typography sx={{ fontSize: '14px' }}>{loan}</Typography>
                    </Grid>
                    <Grid item>
                      <Box
                        sx={{ color: 'error.main', cursor: 'pointer' }}
                        onClick={() => handleDelete(loan)}
                      >
                        <Iconify icon='solar:trash-bin-trash-bold' />
                      </Box>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
