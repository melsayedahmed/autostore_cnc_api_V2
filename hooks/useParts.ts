// hooks/useParts.ts
import { useQuery } from "@tanstack/react-query";
import { getParts } from "../lib/api";
import type { Part } from "../lib/types";

export function useParts(modelYearId: string | undefined, versionId?: string) {
  return useQuery<Part[]>({
    queryKey: ["parts", modelYearId, versionId],
    queryFn: () => getParts(modelYearId!, versionId),
    enabled: !!modelYearId, // متعملش fetch إلا لما يكون فيه modelYearId
    staleTime: 5 * 60 * 1000, // البيانات تفضل fresh لمدة 5 دقايق
    cacheTime: 30 * 60 * 1000, // الكاش يفضل 30 دقيقة بعد عدم الاستخدام
  });
}

export const fetchParts = () => {};
