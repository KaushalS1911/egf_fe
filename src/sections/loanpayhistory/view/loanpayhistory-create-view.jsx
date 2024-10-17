import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import LoanpayhistoryNewEditForm from '../loanpayhistory-new-edit-form';
import { useGetDisburseLoan } from '../../../api/disburseLoan';
import { useParams } from 'react-router';
import EmployeeNewEditForm from '../../employee/employee-new-edit-form';
import { Box } from '@mui/material';
import { LoadingScreen } from '../../../components/loading-screen';

// ----------------------------------------------------------------------

export default function LoanpayhistoryCreateView() {
  const settings = useSettingsContext();
  const {id} = useParams()
  const {disburseLoan , mutate} = useGetDisburseLoan();
  const currentLoan = disburseLoan.find((item) => item._id == id);
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

      {currentLoan ? <LoanpayhistoryNewEditForm currentLoan={currentLoan} mutate={mutate}/> :
        <Box sx={{ height: '65vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LoadingScreen />
        </Box>
      }
    </Container>
  );
}
