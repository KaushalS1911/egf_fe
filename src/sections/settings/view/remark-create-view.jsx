import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Box, Card } from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import { Stack } from '@mui/system';

export default function RemarkCreateView() {
  const { user } = useAuthContext();
  const { configs, mutate } = useGetConfigs();
  const [remark, setRemark] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleRemarkClick = () => {
    if (!remark) {
      enqueueSnackbar('Remark cannot be empty', { variant: 'warning' });
      return;
    }

    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const updatedRemarks = configs.remarks ? [...configs.remarks, remark] : [remark];
    const payload = { ...configs, remarks: updatedRemarks };

    axios.put(URL, payload)
      .then((res) => {
        if (res.status === 200) {
          setRemark('');
          enqueueSnackbar('Remark added successfully', { variant: 'success' });
          mutate();
        }
      })
      .catch((err) => {
        enqueueSnackbar('Failed to add Remark', { variant: 'error' });
        console.log(err);
      });
  };

  const handleDeleteRemark = (remarkToDelete) => {
    const updatedRemarks = configs.remarks.filter((r) => r !== remarkToDelete);
    const apiEndpoint = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const payload = { ...configs, remarks: updatedRemarks };

    axios.put(apiEndpoint, payload)
      .then(() => {
        enqueueSnackbar('Remark deleted successfully', { variant: 'success' });
        mutate();
      })
      .catch((err) => {
        enqueueSnackbar('Failed to delete Remark', { variant: 'error' });
        console.log(err);
      });
  };

  return (
    <Box sx={{ width: '100%', padding: '10px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant='h5' sx={{ fontWeight: 600 }}>
            Add Remark
          </Typography>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box sx={{ width: '100%', maxWidth: '600px', padding: '10px' }}>
            <TextField
              fullWidth
              variant='outlined'
              label='Remark'
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              sx={{ fontSize: '16px' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '20px' }}>
              <Button variant='contained' onClick={handleRemarkClick}>
                Add Remark
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
                {configs?.remarks && configs.remarks.length !== 0 && configs.remarks.map((remark, index) => (
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
                      <Typography sx={{ fontSize: '14px' }}>{remark}</Typography>
                    </Grid>
                    <Grid item>
                      <Box
                        sx={{ color: 'error.main', cursor: 'pointer' }}
                        onClick={() => handleDeleteRemark(remark)}
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
