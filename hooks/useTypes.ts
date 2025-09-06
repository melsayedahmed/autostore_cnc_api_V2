// hooks/useTypes.ts
import { useQuery } from '@tanstack/react-query';
import { getTypes } from '../lib/api';
import type { Type } from '../lib/types';

// ⏳ أسبوع كامل (7 أيام بالمللي ثانية)
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

// للصفحات بالـ pagination
export function useTypes(page: number) {
  const { data, error, isPending, isError } = useQuery({
    queryKey: ['types', page],
    queryFn: () => getTypes(page),
    staleTime: ONE_WEEK, // ✅ أسبوع كامل
    cacheTime: ONE_WEEK, // ✅ أسبوع كامل
  });

  return {
    types: data?.data as Type[] | undefined,
    links: data?.links || [],
    meta: data?.meta,
    isLoading: isPending,
    isError,
  };
}

// كل الأنواع مرة واحدة
export function useAllTypes() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['types-all'],
    queryFn: () => getTypes(),
    staleTime: ONE_WEEK, // ✅ أسبوع
    cacheTime: ONE_WEEK, // ✅ أسبوع
  });

  return {
    types: data?.data as Type[] | undefined,
    isLoading: isPending,
    isError,
  };
}
