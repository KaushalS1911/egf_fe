import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from 'src/utils/axios';


export function useGetAllPartPayment(loanId) {
  const URL = `${import.meta.env.VITE_BASE_URL}/loans/${loanId}/loan-part-payment`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      partPayment: data?.data || [],
      partPaymentLoading: isLoading,
      partPaymentError: error,
      partPaymentValidating: isValidating,
      partPaymentEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
