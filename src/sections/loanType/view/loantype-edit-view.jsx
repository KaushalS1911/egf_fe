import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import LoantypeNewEditForm from '../loantype-new-edit-form';
import { useGetScheme } from '../../../api/scheme';
import { useParams } from '../../../routes/hooks';
import { LoadingScreen } from '../../../components/loading-screen';
import { Box } from '@mui/material';
import { useGetCarat } from '../../../api/carat';
import { useGetLoan } from '../../../api/loantype';

// ----------------------------------------------------------------------

export default function LoantypeEditView() {
  const settings = useSettingsContext();
  const {loan} = useGetLoan()
  const {id} = useParams()

  const currentLoan = loan.find((loan) => loan._id === id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Loan Type',
            href: paths.dashboard.loan.root,
          },
          { name: currentLoan?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentLoan ? <LoantypeNewEditForm currentLoan={currentLoan} /> :
        <Box sx={{ height: '65vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LoadingScreen />
        </Box>
      }
    </Container>
  );
}

LoantypeEditView.propTypes = {
  id: PropTypes.string,
};
