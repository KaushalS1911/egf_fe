import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';


import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {useGetInquiry} from 'src/api/inquiry'
import InquiryNewEditForm from '../inquiry-new-edit-form';
import { useParams } from '../../../routes/hooks';

// ----------------------------------------------------------------------

export default function InquiryEditView() {
  const settings = useSettingsContext();
  const {inquiry} = useGetInquiry();
  const { id } = useParams();
  const currentInquiry = inquiry.find((inq) => inq._id === id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="New Inquiry"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Inquiry List',
            href: paths.dashboard.inquiry.root,
          },
          { name: 'New Inquiry' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <InquiryNewEditForm currentInquiry={currentInquiry} />
    </Container>
  );
}

InquiryEditView.propTypes = {
  id: PropTypes.string,
};
