import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Box, Card } from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import { Stack } from '@mui/system';

export default function PolicyConfigCreateView() {
  const { user } = useAuthContext();
  const { configs, mutate } = useGetConfigs();
  const [exportPolicyConfig, setExportPolicyConfig] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleRemarkClick = () => {
    if (!exportPolicyConfig) {
      enqueueSnackbar('Terms And Conditions cannot be empty', { variant: 'warning' });
      return;
    }

    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const updatedeXportPolicyConfig = configs.exportPolicyConfig ? [...configs.exportPolicyConfig, exportPolicyConfig] : [exportPolicyConfig];
    const payload = { ...configs, exportPolicyConfig: updatedeXportPolicyConfig };

    axios.put(URL, payload)
      .then((res) => {
        if (res.status === 200) {
          setExportPolicyConfig('');
          enqueueSnackbar('Terms And Conditions added successfully', { variant: 'success' });
          mutate();
        }
      })
      .catch((err) => {
        enqueueSnackbar('Terms And Conditions to add Remark', { variant: 'error' });
        console.log(err);
      });
  };

  const handleDeleteRemark = (exportPolicyConfig) => {
    const updatedeXportPolicyConfig = configs.exportPolicyConfig.filter((r) => r !== exportPolicyConfig);
    const apiEndpoint = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const payload = { ...configs, exportPolicyConfig: updatedeXportPolicyConfig };

    axios.put(apiEndpoint, payload)
      .then(() => {
        enqueueSnackbar('Terms and conditions deleted successfully', { variant: 'success' });
        mutate();
      })
      .catch((err) => {
        enqueueSnackbar('Failed to delete terms and conditions ', { variant: 'error' });
        console.log(err);
      });
  };

  return (
    <Box sx={{ width: '100%', padding: '10px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant='h5' sx={{ fontWeight: 600 }}>
            Add Terms And Conditions
          </Typography>
        </Grid>

        <Grid item md={4} xs={12}>
          <Box sx={{ width: '100%', maxWidth: '600px', padding: '10px' }}>
            <TextField
              fullWidth
              variant='outlined'
              label='Terms And Conditions'
              value={exportPolicyConfig}
              onChange={(e) => setExportPolicyConfig(e.target.value)}
              sx={{ fontSize: '16px' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '20px' }}>
              <Button variant='contained' onClick={handleRemarkClick}>
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
                  sm: 'repeat(1, 1fr)',
                }}
              >
                {configs?.exportPolicyConfig && configs.exportPolicyConfig.length !== 0 && configs.exportPolicyConfig.map((exportPolicyConfig, index) => (
                  <Box
                    container
                    key={index}
                    sx={{
                      display:'flex',
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
                      <Typography sx={{ fontSize: '14px' }}>{exportPolicyConfig}</Typography>
                    </Grid>
                    <Grid item>
                      <Box
                        sx={{ color: 'error.main', cursor: 'pointer' }}
                        onClick={() => handleDeleteRemark(exportPolicyConfig)}
                      >
                        <Iconify icon='solar:trash-bin-trash-bold' />
                      </Box>
                    </Grid>
                  </Box>
                ))}
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
