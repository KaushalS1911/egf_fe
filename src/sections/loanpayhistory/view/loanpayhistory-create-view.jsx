import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import LoanpayhistoryNewEditForm from '../loanpayhistory-new-edit-form';

// ----------------------------------------------------------------------

export default function LoanpayhistoryCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Loan Pay History"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Loan Pay History List',
            href: paths.dashboard.loanPayHistory.root,
          },
          { name: 'Loan Pay History' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LoanpayhistoryNewEditForm />
    </Container>
  );
}
