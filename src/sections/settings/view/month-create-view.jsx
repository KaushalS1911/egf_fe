import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Box, Card } from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import { Stack } from '@mui/system';

export default function MonthCreateView() {
  const { user } = useAuthContext();
  const { configs, mutate } = useGetConfigs();
  const [months, setMonths] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleNonthsClick = () => {
    if (!months) {
      enqueueSnackbar('Month cannot be empty', { variant: 'warning' });
      return;
    }

    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const updatedMonths = configs.months ? [...configs.months, months] : [months];
    const payload = { ...configs, months: updatedMonths };

    axios
      .put(URL, payload)
      .then((res) => {
        if (res.status === 200) {
          setMonths('');
          enqueueSnackbar('Month added successfully', { variant: 'success' });
          mutate();
        }
      })
      .catch((err) => {
        enqueueSnackbar('Failed to add Month', { variant: 'error' });
        console.log(err);
      });
  };

  const handleDeleteMonths = (monthToDelete) => {
    const updatedMonths = configs.months.filter((r) => r !== monthToDelete);
    const apiEndpoint = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const payload = { ...configs, months: updatedMonths };

    axios
      .put(apiEndpoint, payload)
      .then(() => {
        enqueueSnackbar('Month deleted successfully', { variant: 'success' });
        mutate();
      })
      .catch((err) => {
        enqueueSnackbar('Failed to delete Month', { variant: 'error' });
        console.log(err);
      });
  };

  return (
    <Box sx={{ width: '100%', padding: '10px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Add Month
          </Typography>
        </Grid>

        <Grid item md={4} xs={12}>
          <Box sx={{ width: '100%', maxWidth: '600px', padding: '10px' }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Month"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              sx={{ fontSize: '16px' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '20px' }}>
              <Button variant="contained" onClick={handleNonthsClick}>
                Add Month
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
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                {configs?.months &&
                  configs.months.length !== 0 &&
                  configs.months.map((months, index) => (
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
                        <Typography sx={{ fontSize: '14px' }}>{months}</Typography>
                      </Grid>
                      <Grid item>
                        <Box
                          sx={{ color: 'error.main', cursor: 'pointer' }}
                          onClick={() => handleDeleteMonths(months)}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
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
