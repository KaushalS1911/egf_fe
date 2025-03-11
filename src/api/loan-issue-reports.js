import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

export function useGetLoanIssueReport() {
  const { user } = useAuthContext();
  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/issued-loan-detail`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      loanIssueReports: data?.data || [],
      loanIssueReportsLoading: isLoading,
      loanIssueReportsError: error,
      loanIssueReportsValidating: isValidating,
      loanIssueReportsEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
