import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

export function useGetPayment() {
  const { user } = useAuthContext();
  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/payment`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      payment: data?.data || [],
      paymentLoading: isLoading,
      paymentError: error,
      paymentValidating: isValidating,
      paymentEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
