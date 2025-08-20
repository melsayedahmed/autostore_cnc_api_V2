"use client";

import React, { useCallback, memo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useModelYears,
  fetchModelYears,
} from "../../../../../../../hooks/useModelYears";

// ✅ Dynamic Import لـ ModelYearsList مع Skeleton متناسق
const ModelYearsList = dynamic(
  () =>
    import("../../../../../../../components/ModelYearsList").then((mod) =>
      memo(mod.ModelYearsList)
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
          ></div>
        ))}
      </div>
    ),
  }
);

// ✅ ErrorFallback Component
function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center p-4 text-red-500">
      <p className="mb-2">Error loading model years.</p>
      <button
        onClick={onRetry}
        className="text-blue-500 underline hover:text-blue-700"
      >
        Retry
      </button>
    </div>
  );
}

export default function ModelYearsPage() {
  const params = useParams<{
    typeId: string;
    modelId: string;
    submodelId: string;
  }>();

  const { typeId, modelId, submodelId } = params;
  const queryClient = useQueryClient();

  // ✅ Prefetch للبيانات
  React.useEffect(() => {
    if (submodelId) {
      queryClient.prefetchQuery(["modelYears", submodelId], () =>
        fetchModelYears(submodelId)
      );
    }
  }, [submodelId, queryClient]);

  const { isLoading, isError, refetch } = useModelYears(submodelId);

  const handleSelect = useCallback(() => {}, []);

  const renderItem = useCallback(
    (modelYear: any, children: React.ReactNode) => (
      <Link
        href={`/types/${typeId}/models/${modelId}/submodels/${submodelId}/years/${modelYear._id}`}
        key={modelYear._id}
      >
        <div className="block h-full w-full">{children}</div>
      </Link>
    ),
    [typeId, modelId, submodelId]
  );

  return (
    <div className="min-h-screen text-black dark:text-white bg-gradient-to-b from-[#e5f1fc] to-[#f2f4ff] dark:bg-[radial-gradient(ellipse_at_center,_rgb(16,13,33)_0%,_#0b0a1a_100%)]">
      <main className="max-w-7xl mx-auto p-8 pt-20">
        <Link
          href={`/types/${typeId}/models/${modelId}`}
          className="text-blue-500 hover:underline mb-6 mt-7 inline-block"
        >
          ← Back to Submodels
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
          Model Years
        </h1>

        {isLoading ? (
          // ✅ Skeleton بنفس شكل باقي الصفحات
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : isError ? (
          <ErrorFallback onRetry={refetch} />
        ) : (
          <ModelYearsList
            submodelId={submodelId}
            onSelect={handleSelect}
            renderItem={renderItem}
          />
        )}
      </main>
    </div>
  );
}
