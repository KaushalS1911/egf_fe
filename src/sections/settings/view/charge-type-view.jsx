import React, { useState } from 'react';
import { Box, Button, Card, Grid, TextField, Typography } from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import { Stack } from '@mui/system';

export default function ChargeTypeView({ setTab }) {
  const { user } = useAuthContext();
  const { configs, mutate } = useGetConfigs();
  const [inputVal, setInputVal] = useState('');
  const [chargeTypes, setChargeTypes] = useState(configs?.chargeType || []);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    if (!inputVal) {
      enqueueSnackbar('Charge type cannot be empty', { variant: 'warning' });
      return;
    }

    const updatedChargeTypes = [...chargeTypes, inputVal.toUpperCase()];
    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const payload = { ...configs, chargeType: updatedChargeTypes };

    axios
      .put(URL, payload)
      .then((res) => {
        if (res.status === 200) {
          setInputVal('');
          setChargeTypes(updatedChargeTypes);
          enqueueSnackbar('Charge type added successfully', { variant: 'success' });
          setTab('Permission');
          mutate();
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (type) => {
    const updatedChargeTypes = chargeTypes.filter((bt) => bt !== type);
    const apiEndpoint = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const payload = { ...configs, chargeType: updatedChargeTypes };

    axios
      .put(apiEndpoint, payload)
      .then(() => {
        setChargeTypes(updatedChargeTypes);
        enqueueSnackbar('Charge type deleted successfully', { variant: 'success' });
        mutate();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box sx={{ width: '100%', marginBottom: '10px', padding: '10px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Add Charge Type
          </Typography>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box sx={{ width: '100%', maxWidth: '600px', marginBottom: '10px', padding: '10px' }}>
            <TextField
              fullWidth
              name='chargeType'
              variant="outlined"
              label='Charge Type'
              value={inputVal}
              inputProps={{ style: { textTransform: 'uppercase' } }}
              onChange={(e) => setInputVal(e.target.value)}
              sx={{ fontSize: '16px' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '20px' }}>
              <Button variant="contained" onClick={handleClick}>
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
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                {chargeTypes.length !== 0 &&
                  chargeTypes.map((type, index) => (
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
                        <Typography sx={{ fontSize: '14px' }}>{type}</Typography>
                      </Grid>
                      <Grid item>
                        <Box
                          sx={{ color: 'error.main', cursor: 'pointer' }}
                          onClick={() => handleDelete(type)}
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
