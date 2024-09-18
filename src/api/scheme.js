import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

export function useGetScheme() {
  const URL = `https://egf-be.onrender.com/api/company/66ea4b784993e01af85bcfe3/scheme?branch=66ea5ebb0f0bdc8062c13a64`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      scheme: data?.data || [],
      schemeLoading: isLoading,
      schemeError: error,
      schemeValidating: isValidating,
      inquiryEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
