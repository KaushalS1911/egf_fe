import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';


export function useGetDisburseLoan() {
  const {user} = useAuthContext();
  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/loans?type=disburse`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      disburseLoan: data?.data || [],
      disburseLoanLoading: isLoading,
      disburseLoanError: error,
      disburseLoanValidating: isValidating,
      disburseLoanEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
