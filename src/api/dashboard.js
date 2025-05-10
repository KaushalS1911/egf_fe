import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

export function useGetReferenceAreaSummary(timeRange = 'this_year', fields = 'references') {
  const { user } = useAuthContext();
  const storedBranch = sessionStorage.getItem('selectedBranch');
  let parsedBranch = storedBranch;

  if (storedBranch !== 'all') {
    try {
      parsedBranch = JSON.parse(storedBranch);
    } catch (error) {
      console.error('Error parsing storedBranch:', error);
    }
  }

  const timeQuery = `timeRange=${timeRange}`;
  const fieldsQuery = fields ? `fields=${fields}` : '';
  const branchQuery =
    parsedBranch && parsedBranch !== 'all'
      ? `branchId=${parsedBranch}`
      : '';

  const queryString = [timeQuery, fieldsQuery, branchQuery].filter(Boolean).join('&');

  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/dashboard/reference-area-summary?${queryString}`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      ReferenceAreaSummary: data?.data || [],
      ReferenceAreaSummaryLoading: isLoading,
      ReferenceAreaSummaryError: error,
      ReferenceAreaSummaryValidating: isValidating,
      ReferenceAreaSummaryEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}

export function useGetInquirySummary(timeRange = 'this_year') {
  const { user } = useAuthContext();
  const storedBranch = sessionStorage.getItem('selectedBranch');
  let parsedBranch = storedBranch;

  if (storedBranch !== 'all') {
    try {
      parsedBranch = JSON.parse(storedBranch);
    } catch (error) {
      console.error('Error parsing storedBranch:', error);
    }
  }

  const timeQuery = `timeRange=${timeRange}`;
  const branchQuery =
    parsedBranch && parsedBranch !== 'all'
      ? `branchId=${parsedBranch}`
      : '';

  const queryString = [timeQuery, branchQuery].filter(Boolean).join('&');

  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/dashboard/inquiry-summary?${queryString}`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      InquirySummary: data || [],
      InquirySummaryLoading: isLoading,
      InquirySummaryError: error,
      InquirySummaryValidating: isValidating,
      InquirySummaryEmpty: !isLoading && !data?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}

export function useGetSchemeLoanSummary(timeRange = 'this_year') {
  const { user } = useAuthContext();

  const timeQuery = `timeRange=${timeRange}`;
  const queryString = timeQuery;

  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/dashboard/scheme-loan-summary?${queryString}`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      SchemeLoanSummary: data || [],
      SchemeLoanSummaryLoading: isLoading,
      SchemeLoanSummaryError: error,
      SchemeLoanSummaryValidating: isValidating,
      SchemeLoanSummaryEmpty: !isLoading && !data?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}

export function useGetPortfolioSummary() {
  const { user } = useAuthContext();

  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/dashboard/portfolio-summary`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      PortfolioSummary: data || [],
      PortfolioSummaryLoading: isLoading,
      PortfolioSummaryError: error,
      PortfolioSummaryValidating: isValidating,
      PortfolioSummaryEmpty: !isLoading && !data?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}

export function useGetCombinedLoanStats(timeRange = 'this_year', fields = 'references') {
  const { user } = useAuthContext();
  const storedBranch = sessionStorage.getItem('selectedBranch');
  let parsedBranch = storedBranch;

  if (storedBranch !== 'all') {
    try {
      parsedBranch = JSON.parse(storedBranch);
    } catch (error) {
      console.error('Error parsing storedBranch:', error);
    }
  }

  const timeQuery = `timeRange=${timeRange}`;
  const fieldsQuery = fields ? `fields=${fields}` : '';
  const branchQuery =
    parsedBranch && parsedBranch !== 'all'
      ? `branchId=${parsedBranch}`
      : '';

  const queryString = [timeQuery, fieldsQuery, branchQuery].filter(Boolean).join('&');

  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/dashboard/combined-loan-stats?${queryString}`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      CombinedLoanStats: data?.data || [],
      CombinedLoanStatsLoading: isLoading,
      CombinedLoanStatsError: error,
      CombinedLoanStatsValidating: isValidating,
      CombinedLoanStatsEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}

export function useGetOtherLoanChart() {
  const { user } = useAuthContext();

  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/dashboard/other-loan-chart`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      OtherLoanChart: data || [],
      OtherLoanChartLoading: isLoading,
      OtherLoanChartError: error,
      OtherLoanChartValidating: isValidating,
      OtherLoanChartEmpty: !isLoading && !data?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}

export function useGetLoanChart() {
  const { user } = useAuthContext();

  const URL = `${import.meta.env.VITE_BASE_URL}/${user?.company}/dashboard/loan-chart`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      LoanChart: data || [],
      LoanChartLoading: isLoading,
      LoanChartError: error,
      LoanChartValidating: isValidating,
      LoanChartEmpty: !isLoading && !data?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
