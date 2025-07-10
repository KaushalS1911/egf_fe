import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { fDate } from '../../../../utils/format-time';

// ----------------------------------------------------------------------

export default function LoanCloseTableRow({
  row,
  index,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  handleClick,
}) {
  const { loan, createdAt, totalLoanAmount, netAmount, closingCharge, date, entryBy } = row;
  const { loanNo, customer } = loan;

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{index + 1}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {`${customer?.firstName || ''} ${customer?.middleName || ''} ${customer?.lastName || ''}`}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{totalLoanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {(netAmount - closingCharge).toFixed(2)}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {totalLoanAmount - (netAmount - closingCharge)}
        </TableCell>{' '}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(date)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(createdAt)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{closingCharge}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{netAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{entryBy}</TableCell>
      </TableRow>
    </>
  );
}

LoanCloseTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
