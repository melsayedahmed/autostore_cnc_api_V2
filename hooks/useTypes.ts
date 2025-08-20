// hooks/useTypes.ts
import { useQuery } from '@tanstack/react-query';
import { getTypes } from '../lib/api';
import type { Type } from '../lib/types';

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;

}

export function useTypes(page: number) {
  const { data, error, isPending, isError } = useQuery({
    queryKey: ['types', page],
    queryFn: () => getTypes(page),
    staleTime: 1000 * 60 * 5, // 5 دقائق كاش
    keepPreviousData: true,   // علشان يفضل يعرض الصفحة القديمة أثناء تحميل الجديدة
  });

  return {
    types: data?.data as Type[] || [],
    links: data?.links || [],
    meta: data?.meta || undefined,
    isLoading: isPending,
    isError,
  };
}

export const fetchTypes = () => {}