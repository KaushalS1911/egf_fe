import PropTypes from 'prop-types';
import { TableCell, TableRow } from '@mui/material';
import { useAuthContext } from '../../../auth/hooks';
import { useGetConfigs } from '../../../api/config';
import { fDate } from '../../../utils/format-time';

// ----------------------------------------------------------------------

export default function OtherInterestEntryReportsTableRow({ row }) {
  const { user, initialize } = useAuthContext();
  const { configs } = useGetConfigs();

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.otherLoan.loan.loanNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.otherLoan.otherNumber}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.from)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.to)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.days > 0 ? row.days : 0}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.otherLoan.amount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.interestAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.charge}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {(Number(row.interestAmount || 0) + Number(row.charge || 0)).toFixed(2)}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.paymentDetail.cashAmount || 0}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.paymentDetail.bankAmount || 0}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.paymentDetail.bankName || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.createdAt)}</TableCell>
      </TableRow>
    </>
  );
}

OtherInterestEntryReportsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  loanStatus: PropTypes.string,
};
