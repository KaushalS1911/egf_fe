import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Card,
  Autocomplete,
  IconButton,
} from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import { useGetEmployee } from '../../../api/employee.js';

export default function DeviceAccessView() {
  const { user } = useAuthContext();
  const { employee: employees } = useGetEmployee();
  const { configs, mutate } = useGetConfigs();
  const { enqueueSnackbar } = useSnackbar();

  const [deviceInput, setDeviceInput] = useState({
    employee: null,
    macAddress: '',
  });
  const [editIndex, setEditIndex] = useState(null);

  const formatEmployeeName = (emp) => {
    if (!emp || !emp.user) return '';
    const { firstName, middleName, lastName } = emp.user;
    return `${firstName || ''} ${middleName || ''} ${lastName || ''}`.trim();
  };

  const handleAddOrUpdateDevice = () => {
    // Validation
    if (!deviceInput.employee || !deviceInput.macAddress) {
      enqueueSnackbar('Employee and MAC address are required', { variant: 'warning' });
      return;
    }

    const nameOnly = formatEmployeeName(deviceInput.employee);

    const newDevice = {
      employee: nameOnly,
      macAddress: deviceInput.macAddress,
    };

    let updatedDevices = configs?.devices ? [...configs.devices] : [];

    if (editIndex !== null) {
      updatedDevices[editIndex] = newDevice;
    } else {
      updatedDevices.push(newDevice);
    }

    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const payload = { ...configs, devices: updatedDevices };

    axios
      .put(URL, payload)
      .then(() => {
        enqueueSnackbar(
          editIndex !== null ? 'Device updated successfully' : 'Device added successfully',
          { variant: 'success' }
        );
        mutate();
        setDeviceInput({ employee: null, macAddress: '' });
        setEditIndex(null);
      })
      .catch((err) => {
        enqueueSnackbar('Failed to save device', { variant: 'error' });
        console.log(err);
      });
  };

  const handleEditDevice = (device, index) => {
    const matchedEmployee = employees?.find(
      (emp) => formatEmployeeName(emp).toLowerCase() === device.employee.toLowerCase()
    );

    setDeviceInput({
      employee: matchedEmployee || null,
      macAddress: device.macAddress,
    });

    setEditIndex(index);
  };

  const handleDeleteDevice = (indexToRemove) => {
    const updatedDevices = configs.devices.filter((_, i) => i !== indexToRemove);
    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;
    const payload = { ...configs, devices: updatedDevices };

    axios
      .put(URL, payload)
      .then(() => {
        enqueueSnackbar('Device deleted successfully', { variant: 'success' });
        mutate();
        if (editIndex === indexToRemove) {
          setEditIndex(null);
          setDeviceInput({ employee: null, macAddress: '' });
        }
      })
      .catch((err) => {
        enqueueSnackbar('Failed to delete device', { variant: 'error' });
        console.log(err);
      });
  };

  return (
    <Box sx={{ width: '100%', padding: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Device Access
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Autocomplete
            options={employees || []}
            getOptionLabel={formatEmployeeName}
            value={deviceInput.employee}
            onChange={(_, newValue) => setDeviceInput({ ...deviceInput, employee: newValue })}
            renderInput={(params) => <TextField {...params} label="Employee Name" />}
          />

          <TextField
            fullWidth
            label="MAC Address"
            value={deviceInput.macAddress}
            onChange={(e) => setDeviceInput({ ...deviceInput, macAddress: e.target.value })}
            sx={{ mt: 2 }}
          />

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleAddOrUpdateDevice}>
              {editIndex !== null ? 'Update Device' : 'Add Device'}
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Devices List
          </Typography>
          <Grid container spacing={2}>
            {configs?.devices?.length > 0 ? (
              configs.devices.map((device, index) => (
                <Grid key={index} item xs={12} sm={6} md={4} lg={6}>
                  <Card sx={{ p: 2, minHeight: 100 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2">
                          <strong>Employee :</strong> {device.employee}
                        </Typography>
                        <Typography mt={1} variant="subtitle2">
                          <strong>MAC : </strong> {device.macAddress}
                        </Typography>
                      </Box>
                      <Box display="flex" flexDirection={'column'} justifyContent="flex-end">
                        <IconButton color="primary" onClick={() => handleEditDevice(device, index)}>
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteDevice(index)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography>No devices added yet.</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
