import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';


export function useGetLoanissue(loanPayHistory, reminder,reports,closedLoan) {
  const { user } = useAuthContext();
  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/loans`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const filteredData = useMemo(() => {
    if (loanPayHistory) {
      return data?.data?.filter((item) => item.status !== 'Issued') || [];
    }
    if (reminder) {
      return data?.data?.filter((item) => (item.status !== 'Closed' && item.status !== 'Issued')) || [];
    }
    if (reports) {
      return data?.data?.filter((item) => item.status !== 'Closed' ) || [];
    }
    if (closedLoan) {
      return data?.data?.filter((item) => item.status === 'Closed' ) || [];
    }
    return data?.data || [];
  }, [data?.data, loanPayHistory,reminder,reports,closedLoan]);
  const memoizedValue = useMemo(
    () => ({
      Loanissue: filteredData,
      LoanissueLoading: isLoading,
      LoanissueError: error,
      LoanissueValidating: isValidating,
      LoanissueEmpty: !isLoading && !filteredData.length,
      mutate,
    }),
    [filteredData, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
