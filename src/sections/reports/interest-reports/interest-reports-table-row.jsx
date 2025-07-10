import PropTypes from 'prop-types';
import { TableCell, TableRow } from '@mui/material';
import { fDate } from '../../../utils/format-time';

// ----------------------------------------------------------------------

export default function InterestReportsTableRow({ row }) {
  const {
    loanNo,
    customer,
    scheme,
    loanAmount,
    interestLoanAmount,
    consultingCharge,
    lastInstallmentDate,
    interestAmount,
    consultingAmount,
  } = row;

  return (
    <>
      <TableRow hover>
        <TableCell>{row.srNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {`${customer.firstName} ${customer.middleName} ${customer.lastName}`}
        </TableCell>{' '}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.issueDate)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{loanAmount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {interestLoanAmount ? interestLoanAmount : '0'}
        </TableCell>
        <TableCell sx b={{ whiteSpace: 'nowrap' }}>
          {scheme.interestRate <= 1.5 ? scheme.interestRate : 1.5}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{consultingCharge}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{(interestAmount || 0).toFixed(2)}</TableCell>{' '}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{(consultingAmount || 0).toFixed(2)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.penaltyAmount ? row.penaltyAmount : '0'}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.day > 0 ? row.day : 0}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.totalPaidInterest ? row.totalPaidInterest.toFixed(2) : '0'}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {lastInstallmentDate ? fDate(lastInstallmentDate) : '-'}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.createdAt) || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.pendingDays > 0 ? row.pendingDays : 0}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{(row.pendingInterest || 0).toFixed(2)}</TableCell>
      </TableRow>
    </>
  );
}

InterestReportsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  loanStatus: PropTypes.string,
};
