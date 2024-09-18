import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import EmployeeNewEditForm from '../employee-new-edit-form';
import { useParams } from '../../../routes/hooks';

// ----------------------------------------------------------------------

export default function EmployeeEditView() {
  const settings = useSettingsContext();
  const { id } = useParams();
  const currentUser = _userList.find((user) => user.id === id);

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

      <EmployeeNewEditForm currentUser={currentUser} />
    </Container>
  );
}

EmployeeEditView.propTypes = {
  id: PropTypes.string,
};
