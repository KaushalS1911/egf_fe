import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';


export function useGetLoanissue(loanPayHistory, reminder,issued) {
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
    if (issued) {
      return data?.data?.filter((item) => item.status === 'Issued') || [];
    }
    return data?.data || [];
  }, [data?.data, loanPayHistory,reminder]);
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
