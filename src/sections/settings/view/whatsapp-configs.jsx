import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Grid, Box, Card } from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import { Stack } from '@mui/system';

export default function WhatsappConfigs() {
  const { user } = useAuthContext();
  const { configs, mutate } = useGetConfigs();
  const [whatsappConfig, setWhatsappConfig] = useState({ contact1: '', contact2: '' });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (configs?.whatsappConfig) {
      setWhatsappConfig(configs.whatsappConfig);
    }
  }, [configs]);

  const handleUpdate = () => {
    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;

    axios
      .put(URL, { ...configs, whatsappConfig })
      .then(() => {
        enqueueSnackbar('WhatsApp numbers updated successfully', { variant: 'success' });
        mutate();
      })
      .catch(() => {
        enqueueSnackbar('Failed to update WhatsApp numbers', { variant: 'error' });
      });
  };

  return (
    <Box sx={{ width: '100%', padding: '10px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            WhatsApp Configs
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <Stack spacing={2} sx={{ p: 3 }}>
              <Typography variant="h6">WhatsApp Contact 1</Typography>
              <TextField
                value={whatsappConfig.contact1}
                onChange={(e) => setWhatsappConfig({ ...whatsappConfig, contact1: e.target.value })}
                size="small"
                fullWidth
              />
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <Stack spacing={2} sx={{ p: 3 }}>
              <Typography variant="h6">WhatsApp Contact 2</Typography>
              <TextField
                value={whatsappConfig.contact2}
                onChange={(e) => setWhatsappConfig({ ...whatsappConfig, contact2: e.target.value })}
                size="small"
                fullWidth
              />
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleUpdate}>
            Update WhatsApp Numbers
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
