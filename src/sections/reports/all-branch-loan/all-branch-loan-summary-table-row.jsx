import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Label from '../../../components/label';
import { fDate } from '../../../utils/format-time';

// ----------------------------------------------------------------------

export default function AllBranchLoanSummaryTableRow({
  row,
  index,
  selected,
  onEditRow,
  onDeleteRow,
}) {
  const {
    loanNo,
    customer,
    loanAmount,
    scheme,
    status,
    issueDate,
    lastInstallmentDate,
    nextInstallmentDate,
    interestLoanAmount,
    consultingCharge,
    totalPaidInterest,
    day,
    pendingInterest,
    lastAmtPayDate,
  } = row;

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{index + 1}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{loanNo}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {`${customer?.firstName || ''} ${customer?.middleName || ''} ${customer?.lastName || ''}`}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{customer?.contact}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {Number(scheme?.interestRate > 1.5 ? 1.5 : scheme?.interestRate).toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {Number(consultingCharge).toFixed(2) || 0}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{fDate(issueDate)}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{loanAmount}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {fDate(lastAmtPayDate) || '-'}
        </TableCell>
        <TableCell
          sx={{
            fontSize: '12px',
            padding: '6px',
          }}
        >
          {parseFloat((loanAmount - interestLoanAmount).toFixed(2))}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{interestLoanAmount}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {fDate(lastInstallmentDate) || '-'}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{day > 0 ? day : 0}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {totalPaidInterest.toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {row.pendingDays > 0 ? row.pendingDays : 0}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {Number(pendingInterest).toFixed(2) || 0}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {fDate(nextInstallmentDate) || '-'}
        </TableCell>{' '}
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{row.approvalCharge || 0}</TableCell>
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

AllBranchLoanSummaryTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
