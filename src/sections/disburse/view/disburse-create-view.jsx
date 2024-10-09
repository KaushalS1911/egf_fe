import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import DisburseNewEditForm from '../disburse-new-edit-form';

// ----------------------------------------------------------------------

export default function DisburseCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Loan disburse"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'disburse',
            href: paths.dashboard.disburse.new,
          },
          { name: 'New Disburse' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DisburseNewEditForm />
    </Container>
  );
}
