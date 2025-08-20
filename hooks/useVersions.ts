import useSWR from 'swr';
import { getVersions } from '../lib/api';
import type { Version } from '../lib/types';

export function useVersions(modelYearId: string | undefined) {
  const shouldFetch = Boolean(modelYearId);
  const { data, error, isLoading } = useSWR(shouldFetch ? ['versions', modelYearId] : null, () => getVersions(modelYearId!));
  return {
    versions: data,
    isLoading,
    isError: !!error,
  };
} 