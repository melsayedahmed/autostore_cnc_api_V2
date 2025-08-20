// hooks/useSubmodels.ts
import { useQuery } from '@tanstack/react-query';
import { getSubmodels } from '../lib/api';
import type { Submodel } from '../lib/types';

export function useSubmodels(modelId: string | undefined) {
  return useQuery<Submodel[]>({
    queryKey: ['submodels', modelId],
    queryFn: () => getSubmodels(modelId!),
    enabled: !!modelId, // مش هيعمل fetch إلا لو modelId موجود
    staleTime: 5 * 60 * 1000, // البيانات تعتبر fresh لمدة 5 دقايق
    cacheTime: 30 * 60 * 1000, // الكاش يفضل 30 دقيقة بعد عدم الاستخدام
  });
}
