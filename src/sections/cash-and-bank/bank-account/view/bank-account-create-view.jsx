import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths.js';
import { useSettingsContext } from 'src/components/settings/index.js';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/index.js';
import BankAccountNewEditForm from '../bank-account-new-edit-form.jsx';

// ----------------------------------------------------------------------

export default function BankAccountCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Scheme"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Scheme List',
            href: paths.dashboard.scheme.root,
          },
          { name: 'New Scheme' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <BankAccountNewEditForm />
    </Container>
  );
}
