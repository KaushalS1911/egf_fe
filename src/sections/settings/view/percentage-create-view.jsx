import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Box, Card } from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import { Stack } from '@mui/system';

export default function PercentageCreateView() {
  const { user } = useAuthContext();
  const { configs, mutate } = useGetConfigs();
  const [percentage, setPercentage] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handlePercentageClick = () => {
    if (!percentage) {
      enqueueSnackbar('Percentage cannot be empty', { variant: 'warning' });
      return;
    }

    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const updatedPercentage = configs.percentage
      ? [...configs.percentage, percentage]
      : [percentage];
    const payload = { ...configs, percentage: updatedPercentage };

    axios
      .put(URL, payload)
      .then((res) => {
        if (res.status === 200) {
          setPercentage('');
          enqueueSnackbar('Percentage added successfully', { variant: 'success' });
          mutate();
        }
      })
      .catch((err) => {
        enqueueSnackbar('Failed to add Percentage', { variant: 'error' });
        console.log(err);
      });
  };

  const handleDeletePercentage = (percentageToDelete) => {
    const updatedPercentage = configs.percentage.filter((r) => r !== percentageToDelete);
    const apiEndpoint = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const payload = { ...configs, percentage: updatedPercentage };

    axios
      .put(apiEndpoint, payload)
      .then(() => {
        enqueueSnackbar('Percentage deleted successfully', { variant: 'success' });
        mutate();
      })
      .catch((err) => {
        enqueueSnackbar('Failed to delete Percentage', { variant: 'error' });
        console.log(err);
      });
  };

  return (
    <Box sx={{ width: '100%', padding: '10px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Add Percentage
          </Typography>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box sx={{ width: '100%', maxWidth: '600px', padding: '10px' }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Percentage"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              sx={{ fontSize: '16px' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '20px' }}>
              <Button variant="contained" onClick={handlePercentageClick}>
                Add Percentage
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
                  sm: 'repeat(4, 1fr)',
                }}
              >
                {configs?.percentage &&
                  configs.percentage.length !== 0 &&
                  configs.percentage.map((percentage, index) => (
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
                        <Typography sx={{ fontSize: '14px' }}>{percentage}</Typography>
                      </Grid>
                      <Grid item>
                        <Box
                          sx={{ color: 'error.main', cursor: 'pointer' }}
                          onClick={() => handleDeletePercentage(percentage)}
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
