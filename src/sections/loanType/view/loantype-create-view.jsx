import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import LoantypeNewEditForm from '../loantype-new-edit-form';

// ----------------------------------------------------------------------

export default function LoantypeCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Add  Loan Type"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Loan Type',
            href: paths.dashboard.loan.root,
          },
          { name: 'New Loan Type' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LoantypeNewEditForm />
    </Container>
  );
}