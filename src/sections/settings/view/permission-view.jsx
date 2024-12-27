import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Grid,
  Box,
  Card,
  Switch,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, CardHeader,
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
    label: 'Inquiry',
    value: 'Inquiry',
    permissions: [
      { action: 'create Inquiry', key: 'create_inquiry' },
      { action: 'update Inquiry', key: 'update_inquiry' },
      { action: 'delete Inquiry', key: 'delete_inquiry' },
      { action: 'print Inquiry', key: 'print_inquiry_detail' },
      { action: 'bulk Inquiry', key: 'bulk_inquiry_detail' },
      { action: 'Inquiry Follow-Up', key: 'inquiry_follow_Up' },
    ],
  },
  {
    label: 'Customer',
    value: 'Customer',
    permissions: [
      { action: 'create Customer', key: 'create_customer' },
      { action: 'update Customer', key: 'update_customer' },
      { action: 'delete Customer', key: 'delete_customer' },
      { action: 'print Customer', key: 'print_customer' },
    ],
  },
  {
    label: 'Employee',
    value: 'Employee',
    permissions: [
      { action: 'create Employee', key: 'create_employee' },
      { action: 'update Employee', key: 'update_employee' },
      { action: 'delete Employee', key: 'delete_employee' },
      { action: 'print Employee', key: 'print_employee_detail' },
    ],
  },
  {
    label: 'Scheme',
    value: 'scheme',
    permissions: [
      { action: 'create Scheme', key: 'create_scheme' },
      { action: 'update Scheme', key: 'update_scheme' },
      { action: 'delete Scheme', key: 'delete_scheme' },
      { action: 'print Scheme', key: 'print_scheme_detail' },
      { action: 'Gold Price Change', key: 'gold_price_change' },
    ],
  },
  {
    label: 'Carat',
    value: 'carat',
    permissions: [
      { action: 'create Carat', key: 'create_carat' },
      { action: 'update Carat', key: 'update_carat' },
      { action: 'delete Carat', key: 'delete_carat' },
      { action: 'print Carat', key: 'print_carat_detail' },
    ],
  },
  {
    label: 'Property',
    value: 'property',
    permissions: [
      { action: 'create Property', key: 'create_property' },
      { action: 'update Property', key: 'update_property' },
      { action: 'delete Property', key: 'delete_property' },
      { action: 'print Property', key: 'print_property' },
    ],
  },
  {
    label: 'Penalty',
    value: 'penalty',
    permissions: [
      { action: 'create Penalty', key: 'create_penalty' },
      { action: 'update Penalty', key: 'update_penalty' },
      { action: 'delete Penalty', key: 'delete_penalty' },
      { action: 'print Penalty', key: 'print_penalty_detail' },
    ],
  },
  {
    label: 'Loan Issue',
    value: 'Loan issue',
    permissions: [
      { action: 'create Loan Issue', key: 'create_loanIssue' },
      { action: 'update Loan Issue', key: 'update_loanIssue' },
      { action: 'delete Loan Issue', key: 'delete_loanIssue' },
      { action: 'print Loan Issue', key: 'print_loanIssue_detail' },
    ],
  },
  {
    label: 'Disburse',
    value: 'disburse',
    permissions: [
      { action: 'create Disburse', key: 'create_disburse' },
      { action: 'update Disburse', key: 'update_disburse' },
      { action: 'delete Disburse', key: 'delete_disburse' },
      { action: 'print Disburse Detail', key: 'print_disburse_detail' },
    ],
  },
  {
    label: 'Loan Pay History',
    value: 'Loan Pay History',
    permissions: [
      { action: 'Bulk Interest Pay', key: 'bulk_interest_pay' },
      { action: 'update Loan Pay History', key: 'update_loanPayHistory' },
      { action: 'print Loan Pay History', key: 'print_loanPayHistory_detail' },
    ],
  },
  {
    label: 'Reminder',
    value: 'reminder',
    permissions: [
      { action: 'create Reminder', key: 'create_reminder' },
      { action: 'update Reminder', key: 'update_reminder' },
      { action: 'delete Reminder', key: 'delete_reminder' },
      { action: 'print Reminder', key: 'print_reminder_detail' },
    ],
  },
  {
    label: 'Gold Loan Calculator',
    value: 'Gold Loan Calculator',
    permissions: [],
  },
  {
    label: 'All Reports',
    value: 'Reports',
    permissions: [
      // { action: 'All Branch Loan Summary', key: 'all_branch_loan_summary' },
      // { action: 'Branch Vise Loan Closing Report', key: 'branch_vise_loan_closing_report' },
      // { action: 'Daily Reports', key: 'daily_reports' },
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
    if (configs?.roles && selectedRole === null) {
      const rolesWithoutPermissions = configs.roles.filter(
        (role) =>
          role !== 'Admin' &&
          (!configs.permissions?.[role] || !configs.permissions[role]?.sections?.length),
      );

      if (rolesWithoutPermissions.length > 0) {
        setOpenPopup(true);
      } else {
        setOpenPopup(false);
      }
    }
  }, [configs, selectedRole]);

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  useEffect(() => {
    if (selectedRole) {
      const rolePermissions = configs.permissions?.[selectedRole] || {};

      const moduleStates = {};
      const permissionsStates = {};

      modules.forEach((module) => {
        const hasPermissions = rolePermissions.sections?.includes(module.value) || false;

        if (module.value === 'dashboard') {
          moduleStates[module.value] = true;
        } else {
          moduleStates[module.value] = hasPermissions;
        }

        if (hasPermissions || module.value === 'dashboard') {
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
    if (moduleValue === 'dashboard') {
      checked = true;
    }

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

    const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/config/${configs?._id}`;

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

  return (
    <FormProvider {...methods}>
      <Box sx={{ width: '100%', padding: '10px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} display='flex' justifyContent='space-between'>
            <Box>
              <CardHeader title='Permission' sx={{ padding: '0px' }} />
            </Box>
            <Box sx={{ width: '250px' }}>
              <RHFAutocomplete
                name='course'
                label='Roles'
                placeholder='Choose a Role'
                options={configs?.roles?.filter((role) => role !== 'Admin') || []}
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
                        <Typography sx={{ fontSize: '16px', fontWeight: '900' }}>
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
            Some employee roles do not have permissions assigned. Please review and update as necessary:
          </Typography>
          {configs?.roles
            .filter(
              (role) =>
                role !== 'Admin' &&
                (!configs.permissions?.[role] || !configs.permissions[role]?.sections?.length),
            )
            .map((role, index) => (
              <Typography key={index}>- {role}</Typography>
            ))}
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
