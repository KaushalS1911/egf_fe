import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths.js';
import { useSettingsContext } from 'src/components/settings/index.js';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/index.js';
import OtherInOutNewEditForm from '../other-in-out-new-edit-form.jsx';

// ----------------------------------------------------------------------

export default function OtherInOutCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new Other In/Out'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Other In/Out List',
            href: paths.dashboard.cashAndBank.otherInOut.list,
          },
          { name: 'New Other In/Out' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <OtherInOutNewEditForm />
    </Container>
  );
}
