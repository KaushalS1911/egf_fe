import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

export function useGetInquiry() {
  const {user} = useAuthContext();
  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/inquiry?branch=66ea5ebb0f0bdc8062c13a64`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      inquiry: data?.data || [],
      inquiryLoading: isLoading,
      inquiryError: error,
      inquiryValidating: isValidating,
      inquiryEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
