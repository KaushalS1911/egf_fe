import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Grid,
  Box,
  Card,
  CardHeader,
  Switch,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import { Stack } from '@mui/system';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { RHFAutocomplete } from '../../../components/hook-form';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useAuthContext } from '../../../auth/hooks';

const modules = [
  {
    label: 'Dashboard',
    value: 'dashboard',
    permissions: [],
  },
  {
    label: 'Account',
    value: 'account',
    permissions: [],
  },
  {
    label: 'Visit',
    value: 'visit',
    permissions: [
      { action: 'create Visit', key: 'create_visit' },
      { action: 'update Visit', key: 'update_visit' },
      { action: 'delete Visit', key: 'delete_visit' },
      { action: 'print Visit', key: 'print_visit_detail' },
    ],
  },
  {
    label: 'Inquiry',
    value: 'inquiry',
    permissions: [
      { action: 'create Inquiry', key: 'create_inquiry' },
      { action: 'update Inquiry', key: 'update_inquiry' },
      { action: 'delete Inquiry', key: 'delete_inquiry' },
      { action: 'print Inquiry', key: 'print_inquiry_detail' },
    ],
  },
  {
    label: 'Demo',
    value: 'Demo',
    permissions: [
      { action: 'create Demo', key: 'create_demo' },
      { action: 'update Demo', key: 'update_demo' },
      { action: 'delete Demo', key: 'delete_demo' },
    ],
  },
  {
    label: 'Student',
    value: 'student',
    permissions: [
      { action: 'create Student', key: 'create_student' },
      { action: 'create Bulk Student', key: 'create_bulk_student' },
      { action: 'update Student', key: 'update_student' },
      { action: 'delete Student', key: 'delete_student' },
      { action: 'print Student', key: 'print_student_detail' },
    ],
  },
  {
    label: 'Employee',
    value: 'employee',
    permissions: [
      { action: 'create Employee', key: 'create_employee' },
      { action: 'update Employee', key: 'update_employee' },
      { action: 'delete Employee', key: 'delete_employee' },
      { action: 'print Employee', key: 'print_employee_detail' },
    ],
  },
  {
    label: 'Batches',
    value: 'batches',
    permissions: [
      { action: 'create Batches', key: 'create_batch' },
      { action: 'update Batches', key: 'update_batch' },
      { action: 'delete Batches', key: 'delete_batch' },
      { action: 'print Batches', key: 'print_batch_detail' },
    ],
  },
  {
    label: 'Attendance',
    value: 'attendance',
    permissions: [
      { action: 'create Attendance', key: 'create_attendance' },
      { action: 'update Attendance', key: 'update_attendance' },
      { action: 'delete Attendance', key: 'delete_attendance' },
    ],
  },
  {
    label: 'Exam',
    value: 'exam',
    permissions: [
      { action: 'create Exam', key: 'create_exam' },
      { action: 'update Exam', key: 'update_exam' },
      { action: 'delete Exam', key: 'delete_exam' },
      { action: 'print Exam', key: 'print_exam_detail' },
    ],
  },
  {
    label: 'Seminar',
    value: 'seminar',
    permissions: [
      { action: 'create Seminar', key: 'create_seminar' },
      { action: 'update Seminar', key: 'update_seminar' },
      { action: 'delete Seminar', key: 'delete_seminar' },
      { action: 'print Seminar', key: 'print_seminar_detail' },
    ],
  },
  {
    label: 'Fees',
    value: 'fees',
    permissions: [
      { action: 'print Fees', key: 'print_fees_detail' },
      { action: 'update Fees', key: 'update_fees' },
    ],
  },
  {
    label: 'Expenses',
    value: 'expenses',
    permissions: [
      { action: 'create Expenses', key: 'create_expense' },
      { action: 'update Expenses', key: 'update_expense' },
      { action: 'delete Expenses', key: 'delete_expense' },
      { action: 'print Expenses', key: 'print_expense_detail' },
    ],
  },
  {
    label: 'Calendar',
    value: 'calendar',
    permissions: [
      { action: 'create Calendar', key: 'create_event' },
      { action: 'update Calendar', key: 'update_event' },
      { action: 'delete Calendar', key: 'delete_event' },
      { action: 'print Calendar', key: 'print_event_detail' },
    ],
  },
  {
    label: 'Task',
    value: 'task',
    permissions: [
      { action: 'create Task', key: 'create_task' },
      { action: 'update Task', key: 'update_task' },
      { action: 'delete Task', key: 'delete_task' },
      { action: 'print Task', key: 'print_task_detail' },
    ],
  },
  {
    label: 'Complaints',
    value: 'complaints',
    permissions: [
      { action: 'update Complaints', key: 'update_complaint' },
      { action: 'delete Complaints', key: 'delete_complaint' },
      { action: 'print Complaints', key: 'print_complaint_detail' },
    ],
  },
  {
    label: 'Setting',
    value: 'setting',
    permissions: [],
  },
];

export default function PermissionView() {
  const methods = useForm();
  const { configs, mutate } = useGetConfigs();
  const { user } = useAuthContext();
  const [selectedRole, setSelectedRole] = useState(null);
  const [moduleSwitchState, setModuleSwitchState] = useState({});
  const [permissionsState, setPermissionsState] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      setOpenPopup(true);
      setIsFirstRender(false);
    }
  }, [isFirstRender]);

  useEffect(() => {
    if (selectedRole) {
      const rolePermissions = configs.permissions?.[selectedRole] || {};

      const moduleStates = {};
      const permissionsStates = {};

      modules.forEach((module) => {
        const hasPermissions = rolePermissions.sections?.includes(module.value) || false;
        moduleStates[module.value] = hasPermissions;

        if (hasPermissions) {
          module.permissions.forEach((permission) => {
            permissionsStates[`${module.value}.${permission.key}`] = rolePermissions.responsibilities?.[permission.key] || false;
          });
        }
      });

      setModuleSwitchState(moduleStates);
      setPermissionsState(permissionsStates);
    }
  }, [selectedRole, configs]);

  const handleRoleChange = (event, value) => {
    setSelectedRole(value);

    setModuleSwitchState({});
    setPermissionsState({});

    if (value) {
      const rolePermissions = configs.permissions?.[value] || {};

      const moduleStates = {};
      const permissionsStates = {};

      modules.forEach((module) => {
        const hasPermissions = rolePermissions.sections?.includes(module.value) || false;
        moduleStates[module.value] = hasPermissions;

        if (hasPermissions) {
          module.permissions.forEach((permission) => {
            permissionsStates[`${module.value}.${permission.key}`] = rolePermissions.responsibilities?.[permission.key] || false;
          });
        }
      });

      setModuleSwitchState(moduleStates);
      setPermissionsState(permissionsStates);
    }
  };

  const handleSwitchChange = (moduleValue, checked) => {
    setModuleSwitchState((prevState) => ({
      ...prevState,
      [moduleValue]: checked,
    }));
    if (!checked) {
      const updatedPermissions = { ...permissionsState };
      modules
        .find((module) => module.value === moduleValue)
        .permissions.forEach((permission) => {
        updatedPermissions[`${moduleValue}.${permission.key}`] = false;
      });
      setPermissionsState(updatedPermissions);
    }
  };

  const handleCheckboxChange = (moduleValue, actionKey, checked) => {
    setPermissionsState((prevState) => ({
      ...prevState,
      [`${moduleValue}.${actionKey}`]: checked,
    }));
  };

  const handleReset = () => {
    methods.reset();
    setSelectedRole(null);
    setModuleSwitchState({});
    setPermissionsState({});
  };

  const handleSave = (data) => {
    if (!selectedRole) {
      enqueueSnackbar('Please select a role before saving.', { variant: 'warning' });
      return;
    }

    const updatedPermissions = {
      ...configs.permissions,
      [selectedRole]: {
        sections: modules
          .filter((module) => moduleSwitchState[module.value])
          .map((module) => module.value), // Map to module values
        responsibilities: modules.reduce((acc, module) => {
          module.permissions.forEach((permission) => {
            const permissionKey = `${module.value}.${permission.key}`;
            acc[permission.key] = !!permissionsState[permissionKey];
          });
          return acc;
        }, {}),
      },
    };

    const updatedConfig = {
      ...configs,
      permissions: updatedPermissions,
    };

    const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company}/configs/${configs?._id}`;

    axios
      .put(URL, updatedConfig)
      .then(() => {
        enqueueSnackbar('Permissions updated successfully!', { variant: 'success' });
        mutate();
      })
      .catch((err) => {
        enqueueSnackbar('Failed to update permissions.', { variant: 'error' });
        console.error('Error updating permissions:', err);
      });
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  return (
    <FormProvider {...methods}>
      <Box sx={{ width: '100%', padding: '10px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} display='flex' justifyContent='space-between'>
            <Box>
              <Typography variant='h5' sx={{fontWeight: 600 }}>
                Permission
              </Typography>
            </Box>
            <Box sx={{ width: '250px' }}>
              <RHFAutocomplete
                name='course'
                label='Roles'
                placeholder='Choose a Role'
                options={configs?.roles || []}
                isOptionEqualToValue={(option, value) => option === value}
                onChange={handleRoleChange}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Box
                  display='grid'
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
                  columnGap={2}
                  rowGap={2}
                >
                  {modules.map((module, index) => (
                    <Grid
                      key={index}
                      container
                      sx={{
                        width: '100%',
                        boxShadow: 4,
                        height: module.permissions.length ? 'auto' : '70px',
                        borderRadius: 1,
                        p: 2,
                        m: 1,
                      }}
                    >
                      <Grid item xs={12} display='flex' justifyContent='space-between'>
                        <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 600 }}>
                          {module.label}
                        </Typography>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={moduleSwitchState[module.value] || false}
                              onChange={(e) => handleSwitchChange(module.value, e.target.checked)}
                            />
                          }
                          label=''
                        />
                      </Grid>

                      {module.permissions.map((permission, idx) => (
                        <Grid item xs={12} key={idx}>
                          <FormControlLabel
                            control={
                              <Controller
                                name={`${module.value}.${permission.key}`}
                                control={methods.control}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={permissionsState[`${module.value}.${permission.key}`] || false}
                                    disabled={!moduleSwitchState[module.value]} // Disable if module is off
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                      handleCheckboxChange(module.value, permission.key, e.target.checked);
                                    }}
                                  />
                                )}
                              />
                            }
                            label={permission.action}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  ))}
                </Box>
                <Stack direction='row' spacing={2} justifyContent='flex-end'>
                  <Button variant='contained' onClick={handleReset}>
                    Reset
                  </Button>
                  <Button variant='contained' onClick={methods.handleSubmit(handleSave)}>
                    Save
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>Missing Permissions</DialogTitle>
        <DialogContent>
          <Typography>
            Some employee types do not have permissions assigned. Please review and update as necessary.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} variant='contained'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}
