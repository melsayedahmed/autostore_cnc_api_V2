// hooks/useModelYears.ts
import { useQuery } from '@tanstack/react-query';
import { getModelYears } from '../lib/api';
import type { ModelYear } from '../lib/types';

export function useModelYears(submodelId: string | undefined) {
  return useQuery<ModelYear[]>({
    queryKey: ['modelYears', submodelId],
    queryFn: () => getModelYears(submodelId!),
    enabled: !!submodelId, // ميتعملش fetch غير لما يكون في submodelId
    staleTime: 5 * 60 * 1000, // البيانات تفضل fresh لمدة 5 دقايق
    cacheTime: 30 * 60 * 1000, // الكاش يفضل 30 دقيقة بعد عدم الاستخدام
  });
}

export const fetchModelYears = () => {}