import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

export function useGetInterestEntryReports() {
  const { user } = useAuthContext();
  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/interest-entry-report`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      interestEntryReports: data?.data || [],
      interestEntryReportsLoading: isLoading,
      interestEntryReportsError: error,
      interestEntryReportsValidating: isValidating,
      interestEntryReportsEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
