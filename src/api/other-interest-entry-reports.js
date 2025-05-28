import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

export function useGetOtherInterestEntryReports() {
  const { user } = useAuthContext();
  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/other-interest-entry-report`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      otherInterestEntryReports: data?.data || [],
      otherInterestEntryReportsLoading: isLoading,
      otherInterestEntryReportsError: error,
      otherInterestEntryReportsValidating: isValidating,
      otherInterestEntryReportsEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
