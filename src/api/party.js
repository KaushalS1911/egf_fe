import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

export function useGetParty() {
  const { user } = useAuthContext();
  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/party`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      party: data?.data || [],
      partyLoading: isLoading,
      partyError: error,
      partyValidating: isValidating,
      partyEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
