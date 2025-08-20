import { useQuery } from "@tanstack/react-query";
import { getModels } from "../lib/api";
import type { Model } from "../lib/types";

export function useModels(typeId: string | undefined) {
  return useQuery<Model[]>({
    queryKey: ["models", typeId],
    queryFn: () => getModels(typeId!),
    enabled: !!typeId, // مش هيعمل fetch غير لما يكون في typeId
    staleTime: 5 * 60 * 1000, // 5 دقايق: البيانات تفضل fresh ومش تتعمل refetch
    cacheTime: 30 * 60 * 1000, // 30 دقيقة: البيانات تفضل متخزنة في الكاش بعد عدم الاستخدام
  });
}

export const fetchModels = () => {};
