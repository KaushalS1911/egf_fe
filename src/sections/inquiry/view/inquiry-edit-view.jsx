import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetInquiry } from 'src/api/inquiry';
import InquiryNewEditForm from '../inquiry-new-edit-form';
import { useParams } from '../../../routes/hooks';
import { LoadingScreen } from '../../../components/loading-screen';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function InquiryEditView() {
  const settings = useSettingsContext();
  const { inquiry } = useGetInquiry();
  const { id } = useParams();
  const currentInquiry = inquiry.find((inq) => inq._id === id);
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
            name: 'Inquiry List',
            href: paths.dashboard.inquiry.root,
          },
          { name: 'Edit Inquiry' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentInquiry ? <InquiryNewEditForm currentInquiry={currentInquiry} inquiry={inquiry} /> :
        <Box sx={{ height: '65vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LoadingScreen />
        </Box>
      }
    </Container>
  );
}

InquiryEditView.propTypes = {
  id: PropTypes.string,
};
