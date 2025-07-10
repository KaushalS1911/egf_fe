import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Label from '../../../components/label';
import { fDate } from '../../../utils/format-time';

// ----------------------------------------------------------------------

export default function TotalAllInOutLoanReportsTableRow({
  row,
  index,
  selected,
  onEditRow,
  onDeleteRow,
  isFirstRow,
  rowSpan,
}) {
  const { loan, day, pendingInterest, otherNumber, otherName, rate, renewalDate, status } = row;
  const { loanNo, customer, loanAmount, scheme, issueDate, interestLoanAmount } = loan;

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }} rowSpan={rowSpan}>{index + 1}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }} rowSpan={rowSpan}>{loanNo}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }} rowSpan={rowSpan}>{fDate(issueDate)}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }} rowSpan={rowSpan}>
          {`${customer?.firstName || ''} ${customer?.middleName || ''} ${customer?.lastName || ''}`}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }} rowSpan={rowSpan}>{loanAmount}</TableCell>
        <TableCell
          sx={{
            fontSize: '12px',
            padding: '6px',
          }}
          rowSpan={rowSpan}
        >
          {parseFloat((loanAmount - interestLoanAmount).toFixed(2)) || 0}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }} rowSpan={rowSpan}>{interestLoanAmount}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }} rowSpan={rowSpan}>
          {loan.propertyDetails
            .reduce((prev, next) => prev + (Number(next?.totalWeight) || 0), 0)
            .toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }} rowSpan={rowSpan}>
          {loan.propertyDetails
            .reduce((prev, next) => prev + (Number(next?.netWeight) || 0), 0)
            .toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }} rowSpan={rowSpan}>{scheme.interestRate}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }} rowSpan={rowSpan}>
          {(row.totalInterestAmount || 0).toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{otherNumber}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{fDate(row.date)}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{otherName}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{row.amount}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{row.grossWt}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{row.netWt}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>{row.percentage}</TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {row.totalOtherInterestAmount.toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {(row.amount - interestLoanAmount).toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px' }}>
          {(row.totalInterestAmount - row.totalOtherInterestAmount).toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontSize: '12px', padding: '6px', textAlign: 'center' }}>
          {index === 0 && (
            <>
              <TableCell
                align="center"
                sx={{
                  fontSize: '11px',
                  padding: '4px 6px',
                  width: TABLE_HEAD[19].width
                }}
                rowSpan={rowSpan}
              >
                {(() => {
                  const totalOtherAmount = otherLoans.reduce(
                    (sum, loan) => sum + Number(loan.amount || 0),
                    0
                  );
                  const diffAmount = totalOtherAmount - row.loan.loanAmount;
                  return diffAmount.toFixed(2);
                })()}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontSize: '11px',
                  padding: '4px 6px',
                  width: TABLE_HEAD[20].width
                }}
                rowSpan={rowSpan}
              >
                {(() => {
                  const totalOtherInterest = otherLoans.reduce(
                    (sum, loan) => sum + Number(loan.totalOtherInterestAmount || 0),
                    0
                  );
                  const diffInterest = totalOtherInterest - row.totalInterestAmount;
                  return diffInterest.toFixed(2);
                })()}
              </TableCell>
            </>
          )}
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

TotalAllInOutLoanReportsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  isFirstRow: PropTypes.bool,
  rowSpan: PropTypes.number,
};
