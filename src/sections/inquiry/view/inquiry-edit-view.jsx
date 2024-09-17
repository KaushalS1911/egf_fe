import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import InquiryNewEditForm from '../inquiry-new-edit-form';
import { useParams } from '../../../routes/hooks';

// ----------------------------------------------------------------------

export default function InquiryEditView() {
  const settings = useSettingsContext();
  const { id } = useParams();
  const currentUser = _userList.find((user) => user.id === id);

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

      <InquiryNewEditForm currentUser={currentUser} />
    </Container>
  );
}

InquiryEditView.propTypes = {
  id: PropTypes.string,
};
