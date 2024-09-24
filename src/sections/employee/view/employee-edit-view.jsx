import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import EmployeeNewEditForm from '../employee-new-edit-form';
import { useParams } from '../../../routes/hooks';
import { useGetEmployee } from '../../../api/employee';
import { Box } from '@mui/material';
import { LoadingScreen } from '../../../components/loading-screen';

// ----------------------------------------------------------------------

export default function EmployeeEditView() {
  const settings = useSettingsContext();
  const {employee} = useGetEmployee();
  const { id } = useParams();
  const currentEmployee = employee.find((emp) => emp._id === id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create New Employee"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Employee List',
            href: paths.dashboard.employee.root,
          },
          { name: 'Create New Employee' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentEmployee ? <EmployeeNewEditForm currentEmployee={currentEmployee} /> :
        <Box sx={{ height: '65vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LoadingScreen />
        </Box>
      }
    </Container>
  );
}

EmployeeEditView.propTypes = {
  id: PropTypes.string,
};
