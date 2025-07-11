import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import { Stack } from '@mui/system';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { RHFAutocomplete } from '../../../components/hook-form';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useAuthContext } from '../../../auth/hooks';

export const modules = [
  {
    label: 'Dashboard',
    value: 'Dashboard',
    permissions: [
      { action: 'Select Customer', key: 'select_customer' },
      { action: 'Select Loan No.', key: 'select_loan_no' },
      { action: 'Select Mobile No.', key: 'select_mobile_no' },
      { action: 'Select Calculator', key: 'select_calculator' },
      { action: 'Expense Box', key: 'expense_box' },
      { action: 'Payment In Box', key: 'payment_in_box' },
      { action: 'Payment Out Box', key: 'payment_out_box' },
      { action: 'Payment Diff Box', key: 'payment_diff_box' },
      { action: 'Cash/Bank Chart', key: 'cash_bank_chart' },
      { action: 'Portfolio Box', key: 'portfolio_box' },
      { action: 'Interest Summary Box', key: 'interest_summary_box' },
      { action: 'All In/Out Summary Box', key: 'all_in/out_summary_box' },
      { action: 'Charge Summary Box', key: 'charge_summary_box' },
      { action: 'Scheme Chart', key: 'scheme_chart' },
      { action: 'Loan Chart', key: 'loan_chart' },
      { action: 'Other Loan Chart', key: 'other_loan_chart' },
      { action: 'Inquiry Chart', key: 'inquiry_chart' },
      { action: 'Customer Chart', key: 'customer_chart' },
      { action: 'Customer References Chart', key: 'customer_references_chart' },
      { action: 'Customer Area Chart', key: 'customer_area_chart' },
    ],
  },
  {
    label: 'Inquiry',
    value: 'Inquiry',
    permissions: [
      { action: 'Create Inquiry', key: 'create_inquiry' },
      { action: 'Update Inquiry', key: 'update_inquiry' },
      { action: 'Delete Inquiry', key: 'delete_inquiry' },
      { action: 'Print Inquiry', key: 'print_inquiry_detail' },
      { action: 'Bulk Inquiry', key: 'bulk_inquiry_detail' },
      { action: 'Inquiry Follow-Up', key: 'inquiry_follow-up' },
    ],
  },
  {
    label: 'Customer',
    value: 'Customer',
    permissions: [
      { action: 'Create Customer', key: 'create_customer' },
      { action: 'Update Customer', key: 'update_customer' },
      { action: 'Delete Customer', key: 'delete_customer' },
      { action: 'Print Customer', key: 'print_customer' },
    ],
  },
  {
    label: 'Employee',
    value: 'Employee',
    permissions: [
      { action: 'Create Employee', key: 'create_employee' },
      { action: 'Update Employee', key: 'update_employee' },
      { action: 'Delete Employee', key: 'delete_employee' },
      { action: 'Print Employee', key: 'print_employee_detail' },
    ],
  },
  {
    label: 'Scheme',
    value: 'Scheme',
    permissions: [
      { action: 'Create Scheme', key: 'create_scheme' },
      { action: 'Update Scheme', key: 'update_scheme' },
      { action: 'Delete Scheme', key: 'delete_scheme' },
      { action: 'Print Scheme', key: 'print_scheme_detail' },
      { action: 'Gold Price Change', key: 'gold_price_change' },
      { action: 'Gold Price Change Print', key: 'gold_price_change_print' },
    ],
  },
  {
    label: 'Carat',
    value: 'Carat',
    permissions: [
      { action: 'Create Carat', key: 'create_carat' },
      { action: 'Update Carat', key: 'update_carat' },
      { action: 'Delete Carat', key: 'delete_carat' },
      { action: 'Print Carat', key: 'print_carat_detail' },
    ],
  },
  {
    label: 'Property',
    value: 'Property',
    permissions: [
      { action: 'Create Property', key: 'create_property' },
      { action: 'Update Property', key: 'update_property' },
      { action: 'Delete Property', key: 'delete_property' },
      { action: 'Print Property', key: 'print_property' },
    ],
  },
  {
    label: 'Penalty',
    value: 'Penalty',
    permissions: [
      { action: 'Create Penalty', key: 'create_penalty' },
      { action: 'Update Penalty', key: 'update_penalty' },
      { action: 'Delete Penalty', key: 'delete_penalty' },
      { action: 'Print Penalty', key: 'print_penalty_detail' },
    ],
  },
  {
    label: 'Loan Issue',
    value: 'Loan Issue',
    permissions: [
      { action: 'Create Loan Issue', key: 'create_loan_issue' },
      { action: 'Update Loan Issue', key: 'update_loan_issue' },
      { action: 'Delete Loan Issue', key: 'delete_loan_issue' },
      { action: 'Print Loan Issue', key: 'print_loan_issue_detail' },
    ],
  },
  {
    label: 'Disburse',
    value: 'Disburse',
    permissions: [
      { action: 'Create Disburse', key: 'create_disburse' },
      { action: 'Update Disburse', key: 'update_disburse' },
      { action: 'Delete Disburse', key: 'delete_disburse' },
    ],
  },
  {
    label: 'Loan Pay History',
    value: 'Loan Pay History',
    permissions: [
      { action: 'Bulk Interest Pay', key: 'bulk_interest_pay' },
      { action: 'Update Loan Pay History', key: 'update_loan_pay_history' },
      { action: 'Print Loan Pay History', key: 'print_loan_pay_history_detail' },
      { action: 'Delete Loan', key: 'delete_loan' },
      { action: 'Create Interest', key: 'create_interest' },
      { action: 'Delete Interest', key: 'delete_interest' },
      { action: 'Create Part Release', key: 'create_part_release' },
      { action: 'Delete Part Release', key: 'delete_part_release' },
      { action: 'Create Uchak Interest', key: 'create_uchak_interest' },
      { action: 'Delete Uchak Interest', key: 'delete_uchak_interest' },
      { action: 'Create Loan Part Payment', key: 'create_loan_part_payment' },
      { action: 'Delete Loan Part Payment', key: 'delete_loan_part_payment' },
      { action: 'Create Loan Close', key: 'create_loan_close' },
    ],
  },
  {
    label: 'Other Loan Issue',
    value: 'Other Loan Issue',
    permissions: [
      { action: 'Create Other Loan Issue', key: 'create_other_loan_issue' },
      { action: 'Update Other Loan Issue', key: 'update_other_loan_issue' },
      { action: 'Delete Other Loan Issue', key: 'delete_other_loan_issue' },
    ],
  },
  {
    label: 'Other Loan Pay History',
    value: 'Other Loan Pay History',
    permissions: [
      { action: 'Update Other Loan Pay History', key: 'update_other_loan_pay_history' },
      { action: 'Delete Other Loan', key: 'delete_other_loan' },
      { action: 'Create Other Interest', key: 'create_other_interest' },
      { action: 'Delete Other Interest', key: 'delete_other_interest' },
      { action: 'Create Loan Close', key: 'create_loan_close' },
    ],
  },
  {
    label: 'Reminder',
    value: 'Reminder',
    permissions: [
      { action: 'Create Reminder', key: 'create_reminder' },
      { action: 'Update Reminder', key: 'update_reminder' },
      { action: 'Delete Reminder', key: 'delete_reminder' },
      { action: 'Print Reminder', key: 'print_reminder_detail' },
    ],
  },
  {
    label: 'Gold Loan Calculator',
    value: 'Gold Loan Calculator',
    permissions: [],
  },
  {
    label: 'Reports',
    value: 'Reports',
    permissions: [
      { action: 'All Branch Loan Summary', key: 'all branch loan summary' },
      { action: 'Branch Vise Loan Closing Report', key: 'branch vise loan closing report' },
      { action: 'Daily Reports', key: 'daily reports' },
      { action: 'Loan Details', key: 'loan details' },
      { action: 'Interest Reports', key: 'interest reports' },
      { action: 'Interest Entry Reports', key: 'interest entry reports' },
      { action: 'Customer Statement', key: 'customer statement' },
      { action: 'Customer Refrance Statement', key: 'customer refrance report' },
      { action: 'Loan Issue Reports', key: 'loan issue reports' },
    ],
  },
  {
    label: 'Reports Print',
    value: 'Reports Print',
    permissions: [
      { action: 'All Branch Loan Summary', key: 'print_all_branch_loan_summary' },
      { action: 'Branch Vise Loan Closing Report', key: 'print_branch_vise_loan_closing_report' },
      { action: 'Daily Reports', key: 'print_daily_reports' },
      { action: 'Loan Details', key: 'print_loan_details' },
      { action: 'Interest Reports', key: 'print_interest_reports' },
      { action: 'Interest Entry Report', key: 'print_interest_entry_report' },
      { action: 'Customer Statement', key: 'print_customer_statement' },
      { action: 'Customer Refrance Statement', key: 'print_customer_refrance_statement' },
      { action: 'Loan Issue Reports', key: 'print_loan_issue_reports' },
    ],
  },
  {
    label: 'Other Reports',
    value: 'Other Reports',
    permissions: [
      { action: 'Other Loan All Branch Reports', key: 'other loan all branch reports' },
      { action: 'Other Loan Close Reports', key: 'other loan close reports' },
      { action: 'Other Loan Interest', key: 'other loan interest' },
      { action: 'Other Interest Entry Report', key: 'other interest entry reports' },
      { action: 'Other Loan Daily Reports', key: 'other loan daily reports' },
      { action: 'Total All In Out Loan Reports', key: 'total all in out loan reports' },
    ],
  },
  {
    label: 'Other Reports Print',
    value: 'Other Reports Print',
    permissions: [
      { action: 'Other Loan All Branch Reports', key: 'print_other_loan_all_branch_reports' },
      { action: 'Other Loan Close Reports', key: 'print_other_loan_close_reports' },
      { action: 'Other Loan Interest', key: 'print_other_loan_interest' },
      { action: 'Other Interest Entry Report', key: 'print_other_interest_entry_report' },
      { action: 'Other Loan Daily Reports', key: 'print_other_loan_daily_reports' },
      { action: 'Total All In Out Loan Reports', key: 'print_total_all_in_out_loan_reports' },
    ],
  },
  {
    label: 'Accounting',
    value: 'Accounting',
    permissions: [
      { action: 'Cash In', key: 'cash in' },
      { action: 'Bank Account', key: 'bank account' },
      { action: 'Expense', key: 'expence' },
      { action: 'Payment In Out', key: 'payment in/out' },
      { action: 'Charge In Out', key: 'charge in/out' },
      { action: 'Day Book', key: 'day book' },
      { action: 'All Transaction', key: 'all transaction' },
    ],
  },
  {
    label: 'Accounting Print',
    value: 'Accounting Print',
    permissions: [
      { action: 'Print Cash In', key: 'print_cash_in' },
      { action: 'Print Bank Account In', key: 'print_bank_account_in' },
      { action: 'Create Transfer', key: 'create_transfer' },
      { action: 'Delete Transfer', key: 'delete_transfer' },
      { action: 'Update Transfer', key: 'update_transfer' },
      { action: 'Create Expenses', key: 'create_expenses' },
      { action: 'Delete Expenses', key: 'delete_expenses' },
      { action: 'Update Expenses', key: 'update_expenses' },
      { action: 'Print Expenses', key: 'print_expenses' },
      { action: 'Create Party', key: 'create_party' },
      { action: 'Delete Party', key: 'delete_party' },
      { action: 'Update Party', key: 'update_party' },
      { action: 'Create Payment In/Out', key: 'create_payment_in_out' },
      { action: 'Delete Payment In/Out', key: 'delete_payment_in_out' },
      { action: 'Update Payment In/Out', key: 'update_payment_in_out' },
      { action: 'Print Payment In/Out', key: 'print_payment_in_out' },
      { action: 'Create Charge', key: 'create_charge' },
      { action: 'Delete Charge', key: 'delete_charge' },
      { action: 'Update Charge', key: 'update_charge' },
      { action: 'Print Charge', key: 'print_charge' },
      { action: 'Print Day Book', key: 'print_day_book' },
      { action: 'Print All Transaction', key: 'print_all_transaction' },
    ],
  },
  {
    label: 'Setting',
    value: 'Setting',
    permissions: [
      { action: 'Company Profile', key: 'Company Profile' },
      { action: 'Roles', key: 'Roles' },
      { action: 'Permission', key: 'Permission' },
      { action: 'Branch', key: 'Branch' },
      { action: 'Business Type', key: 'Business type' },
      { action: 'Loan Type', key: 'Loan type' },
      { action: 'Percentage', key: 'Percentage' },
      { action: 'Expense Type', key: 'Expense type' },
      { action: 'Charge Type', key: 'Charge type' },
      { action: 'Remark Type', key: 'Remark type' },
      { action: 'Export Policy Config', key: 'Export Policy Config' },
      { action: 'Other Name', key: 'Other Name' },
      { action: 'Month Tab', key: 'Month' },
      { action: 'WhatsApp Configs', key: 'WhatsApp Configs' },
      { action: 'Device Access', key: 'Device Access' },
      { action: 'Area', key: 'Area' },
    ],
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

  useEffect(() => {
    if (configs?.roles && selectedRole === null) {
      const rolesWithoutPermissions = configs.roles.filter(
        (role) =>
          role !== 'Admin' &&
          (!configs.permissions?.[role] || !configs.permissions[role]?.sections?.length)
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
            permissionsStates[`${module.value}.${permission.key}`] =
              rolePermissions.responsibilities?.[permission.key] || false;
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
            permissionsStates[`${module.value}.${permission.key}`] =
              rolePermissions.responsibilities?.[permission.key] || false;
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
          .map((module) => module.value),
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
          <Grid item xs={12} display="flex" justifyContent="space-between">
            <Box>
              <CardHeader title="Permission" sx={{ padding: '0px' }} />
            </Box>
            <Box sx={{ width: '250px' }}>
              <RHFAutocomplete
                name="course"
                label="Roles"
                placeholder="Choose a Role"
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
                  display="grid"
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
                      <Grid item xs={12} display="flex" justifyContent="space-between">
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
                          label=""
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
                                    checked={
                                      permissionsState[`${module.value}.${permission.key}`] || false
                                    }
                                    disabled={!moduleSwitchState[module.value]}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                      handleCheckboxChange(
                                        module.value,
                                        permission.key,
                                        e.target.checked
                                      );
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
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="contained" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button variant="contained" onClick={methods.handleSubmit(handleSave)}>
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
            Some employee roles do not have permissions assigned. Please review and update as
            necessary:
          </Typography>
          {configs?.roles
            ?.filter(
              (role) =>
                role !== 'Admin' &&
                (!configs.permissions?.[role] || !configs.permissions[role]?.sections?.length)
            )
            .map((role, index) => (
              <Typography key={index}>- {role}</Typography>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}
