import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LoanpayhistoryNew from '../other-loanpayhistory-new';
import { useParams } from 'react-router';
import { Box } from '@mui/material';
import { LoadingScreen } from '../../../components/loading-screen';
import { useGetLoanissue } from '../../../api/loanissue';
import OtherLoanpayhistoryNew from '../other-loanpayhistory-new';

// ----------------------------------------------------------------------

export default function LoanpayhistoryCreateView() {
  const settings = useSettingsContext();
  const { id } = useParams();
  const loanPayHistory = true;
  const { Loanissue, mutate } = useGetLoanissue(loanPayHistory);
  const currentLoan = Loanissue.find((item) => item._id === id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Other Loan Pay History'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'other Loan Pay History List',
            href: paths.dashboard.other_loanPayHistory.root,
          },
          { name: 'Other Loan Pay History' },
        ]}
        sx={{
          mb: 2,
        }}
      />
      {currentLoan ? <OtherLoanpayhistoryNew currentLoan={currentLoan} mutate={mutate} /> :
        <Box sx={{ height: '65vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LoadingScreen />
        </Box>
      }
    </Container>
  );
}
