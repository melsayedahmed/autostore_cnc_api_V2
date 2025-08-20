"use client";

import React, { useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { fetchParts, useParts } from "@/hooks/useParts"; // ✅ Hook و Fetch function
import Link from "next/link";

// ✅ Dynamic Import لـ PartsList مع Skeleton Loader
const PartsList = dynamic(
  () => import("@/components/PartsList").then((mod) => memo(mod.PartsList)),
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

// ✅ ErrorFallback Component مع Retry
function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center p-4 text-red-500">
      <p className="mb-2">Error loading parts.</p>
      <button
        onClick={onRetry}
        className="text-blue-500 underline hover:text-blue-700"
      >
        Retry
      </button>
    </div>
  );
}

export default function PartsPage() {
  const params = useParams<{
    typeId: string;
    modelId: string;
    submodelId: string;
    yearId: string;
  }>();

  const { typeId, modelId, submodelId, yearId } = params;
  const queryClient = useQueryClient();

  // ✅ Prefetch للـ parts لسرعة التنقل
  React.useEffect(() => {
    if (yearId) {
      queryClient.prefetchQuery(["parts", yearId], () => fetchParts(yearId));
    }
  }, [yearId, queryClient]);

  const { isLoading, isError, refetch } = useParts(yearId);

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <div className="min-h-screen text-black dark:text-white bg-gradient-to-b from-[#e5f1fc] to-[#f2f4ff] dark:bg-[radial-gradient(ellipse_at_center,_rgb(16,13,33)_0%,_#0b0a1a_100%)]">
      <main className="max-w-7xl mx-auto p-8 pt-20">
        <button
          onClick={handleBack}
          className="text-blue-500 hover:underline mb-6 mt-14 inline-block"
        >
          ← Back to Model Year
        </button>

        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
          Parts
        </h1>

        {isLoading ? (
          // ✅ Skeleton Loader
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
          <PartsList modelYearId={yearId} />
        )}
      </main>
    </div>
  );
}
