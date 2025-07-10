import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Label from '../../../components/label';
import { fDate } from '../../../utils/format-time';

// ----------------------------------------------------------------------

export default function OtherLonaInterestTableRow({
  row,
  index,
  selected,
  onEditRow,
  onDeleteRow,
}) {
  const { loan, day, pendingInterest, otherNumber, otherName, rate, renewalDate, status } = row;
  const { loanNo, customer, loanAmount, scheme, issueDate } = loan;

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{index + 1}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{loanNo}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {`${customer?.firstName || ''} ${customer?.middleName || ''} ${customer?.lastName || ''}`}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{otherName}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{otherNumber}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {Number(row.percentage).toFixed(2) || 0}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{fDate(row.date)}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{row.amount}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {(row.totalCharge || 0).toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{day > 0 ? day : 0}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {(row.totalInterestAmt - row.totalCharge).toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {fDate(row.createdAt) || '-'}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {row.pendingDay > 0 ? row.pendingDay : 0}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {Number(pendingInterest).toFixed(2) || 0}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {fDate(row.renewalDate) || '-'}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px', textAlign: 'center' }}>
          <Label
            variant="soft"
            color={
              (status === 'Disbursed' && 'info') ||
              (status === 'Issued' && 'secondary') ||
              (status === 'Closed' && 'warning') ||
              (status === 'Overdue' && 'error') ||
              (status === 'Regular' && 'success') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>
      </TableRow>
    </>
  );
}

OtherLonaInterestTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
