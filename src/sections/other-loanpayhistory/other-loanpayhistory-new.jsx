import PropTypes from 'prop-types';
import PayTabs from './view/pay-tabs';
import LoanpayhistoryNewEditForm from './other-loanpayhistory-new-edit-form';
import OtherLoanpayhistoryNewEditForm from './other-loanpayhistory-new-edit-form';

// ----------------------------------------------------------------------

export default function OtherLoanpayhistoryNew({ currentLoan, mutate }) {
  return (
    <>
      <OtherLoanpayhistoryNewEditForm currentLoan={currentLoan} mutate={mutate} />
      <PayTabs currentLoan={currentLoan} mutate={mutate} />
    </>
  );
}

OtherLoanpayhistoryNew.propTypes = {
  currentLoan: PropTypes.object,
};
