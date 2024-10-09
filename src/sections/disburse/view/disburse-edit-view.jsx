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

// ----------------------------------------------------------------------

export default function DisburseEditView() {
  const settings = useSettingsContext();
  const {scheme} = useGetScheme()
  const {id} = useParams()

  const currentScheme = scheme.find((scheme) => scheme._id === id);
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
            name: 'Scheme',
            href: paths.dashboard.scheme.root,
          },
          { name: currentScheme?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentScheme ? <DisburseNewEditForm currentScheme={currentScheme} /> :
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
