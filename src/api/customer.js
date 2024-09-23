import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

export function useGetCustomer() {
  const { user } = useAuthContext();
  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/customer`;
  const { data, error, isValidating, mutate } = useSWR(URL, fetcher);

  if (error) {
    console.error('Error fetching data:', error);
  }

  const memoizedValue = useMemo(() => {
    const customer = data?.data || [];
    const isLoading = !data && !error;
    return {
      customer,
      customerLoading: isLoading,
      customerError: error,
      customerValidating: isValidating,
      customerEmpty: !isLoading && customer?.length === 0,
      mutate,
    };
  }, [data?.data, error, isValidating, mutate]);

  return memoizedValue;
}
