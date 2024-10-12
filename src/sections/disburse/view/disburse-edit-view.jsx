import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import DisburseNewEditForm from '../disburse-new-edit-form';
import { useGetScheme } from '../../../api/scheme';
import { useParams } from '../../../routes/hooks';
import { LoadingScreen } from '../../../components/loading-screen';
import { Box } from '@mui/material';
import { useGetLoanissue } from '../../../api/loanissue';

// ----------------------------------------------------------------------

  export default function DisburseEditView() {
  const settings = useSettingsContext();
  const { Loanissue } = useGetLoanissue();
  const {id} = useParams()
  const currentDisburse = Loanissue.find((loanissue) => loanissue._id === id);
    console.log(currentDisburse);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create New Disbuese"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Disburse',
            href: paths.dashboard.disburse.root,
          },
          { name: currentDisburse?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentDisburse ? <DisburseNewEditForm currentDisburse={currentDisburse} /> :
        <Box sx={{ height: '65vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LoadingScreen />
        </Box>
      }
    </Container>
  );
}

DisburseEditView.propTypes = {
  id: PropTypes.string,
};
