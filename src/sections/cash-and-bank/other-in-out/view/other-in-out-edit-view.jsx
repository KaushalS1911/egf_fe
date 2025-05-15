import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths.js';
import { useSettingsContext } from 'src/components/settings/index.js';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/index.js';
import OtherInOutNewEditForm from '../other-in-out-new-edit-form.jsx';
import { useParams } from '../../../../routes/hooks/index.js';
import { LoadingScreen } from '../../../../components/loading-screen/index.js';
import { Box } from '@mui/material';
import { useGetOtherInOut } from '../../../../api/other-in-out.js';

// ----------------------------------------------------------------------

export default function OtherInOutEditView() {
  const settings = useSettingsContext();
  const { OtherInOut } = useGetOtherInOut();
  const { id } = useParams();

  const currentOtherInOut = OtherInOut?.find((other) => other?._id === id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Edit'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Other In/Out List',
            href: paths.dashboard.cashAndBank.otherInOut.list,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentOtherInOut ? (
        <OtherInOutNewEditForm currentOtherInOut={currentOtherInOut} />
      ) : (
        <Box
          sx={{ height: '65vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <LoadingScreen />
        </Box>
      )}
    </Container>
  );
}

OtherInOutEditView.propTypes = {
  id: PropTypes.string,
};
