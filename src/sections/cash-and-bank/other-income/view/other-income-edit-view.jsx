import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths.js';
import { useSettingsContext } from 'src/components/settings/index.js';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/index.js';
import OtherIncomeNewEditForm from '../other-income-new-edit-form.jsx';
import { useGetScheme } from '../../../../api/scheme.js';
import { useParams } from '../../../../routes/hooks/index.js';
import { LoadingScreen } from '../../../../components/loading-screen/index.js';
import { Box } from '@mui/material';
import { useGetExpanse } from '../../../../api/expense.js';
import { useGetOtherIncome } from '../../../../api/other-income.js';

// ----------------------------------------------------------------------

export default function OtherIncomeEditView() {
  const { otherIncome } = useGetOtherIncome();
  const settings = useSettingsContext();
  const { id } = useParams();

  const currentOtherIncome = otherIncome.find((otherIncome) => otherIncome._id === id);
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
            name: 'Other Income List',
            href: paths.dashboard.cashAndBank.otherIncome.list,
          },
          { name: currentOtherIncome?.otherIncomeType },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentOtherIncome ? (
        <OtherIncomeNewEditForm currentOtherIncome={currentOtherIncome} />
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

OtherIncomeEditView.propTypes = {
  id: PropTypes.string,
};
