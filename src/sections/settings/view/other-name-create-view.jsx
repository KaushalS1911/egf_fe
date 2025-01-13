import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Box, Card } from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import { Stack } from '@mui/system';

export default function OtherNameCreateView() {
  const { user } = useAuthContext();
  const { configs, mutate } = useGetConfigs();
  const [otherNames, setOtherNames] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleOtherNamesClick = () => {
    if (!otherNames) {
      enqueueSnackbar('Other name cannot be empty', { variant: 'warning' });
      return;
    }

    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const updatedOtherNames = configs.otherNames
      ? [...configs.otherNames, otherNames]
      : [otherNames];
    const payload = { ...configs, otherNames: updatedOtherNames };

    axios
      .put(URL, payload)
      .then((res) => {
        if (res.status === 200) {
          setOtherNames('');
          enqueueSnackbar('Other name added successfully', { variant: 'success' });
          mutate();
        }
      })
      .catch((err) => {
        enqueueSnackbar('Failed to add Other name', { variant: 'error' });
        console.log(err);
      });
  };

  const handleDeleteOtherNames = (otherNamesToDelete) => {
    const updatedOtherNames = configs.otherNames.filter((r) => r !== otherNamesToDelete);
    const apiEndpoint = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const payload = { ...configs, otherNames: updatedOtherNames };

    axios
      .put(apiEndpoint, payload)
      .then(() => {
        enqueueSnackbar('Other name deleted successfully', { variant: 'success' });
        mutate();
      })
      .catch((err) => {
        enqueueSnackbar('Failed to delete Other name', { variant: 'error' });
        console.log(err);
      });
  };

  return (
    <Box sx={{ width: '100%', padding: '10px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Add Other Name
          </Typography>
        </Grid>

        <Grid item md={4} xs={12}>
          <Box sx={{ width: '100%', maxWidth: '600px', padding: '10px' }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Other Name"
              value={otherNames}
              onChange={(e) => setOtherNames(e.target.value.toUpperCase())}
              sx={{
                '& .MuiOutlinedInput-root': {
                  textTransform: 'uppercase',
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '20px' }}>
              <Button variant="contained" onClick={handleOtherNamesClick}>
                Add Other Name
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
                {configs?.otherNames &&
                  configs.otherNames.length !== 0 &&
                  configs.otherNames.map((otherNames, index) => (
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
                        <Typography sx={{ fontSize: '14px' }}>{otherNames}</Typography>
                      </Grid>
                      <Grid item>
                        <Box
                          sx={{ color: 'error.main', cursor: 'pointer' }}
                          onClick={() => handleDeleteOtherNames(otherNames)}
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
