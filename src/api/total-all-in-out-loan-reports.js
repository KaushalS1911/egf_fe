import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

export function useGetTotalAllInoutLoanReports() {
  const { user } = useAuthContext();
  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/all-in-out-report`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      totalAllInoutLoanReports: data?.data || [],
      totalAllInoutLoanReportsLoading: isLoading,
      totalAllInoutLoanReportsError: error,
      totalAllInoutLoanReportsValidating: isValidating,
      totalAllInoutLoanReportsEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
