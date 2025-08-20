"use client";

import React, { useCallback, memo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useModels, fetchModels } from "../../../hooks/useModels";

// ✅ Dynamic Import لـ ModelsList مع Skeleton Loader
const ModelsList = dynamic(
  () =>
    import("../../../components/ModelsList").then((mod) =>
      memo(mod.ModelsList)
    ),
  {
    loading: () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 aspect-[4/3] animate-pulse"
          >
            <div className="w-full h-32 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    ),
    ssr: false,
  }
);

// ✅ Error UI محسّن مع Retry
function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center p-4 text-red-500">
      <p className="mb-2">Something went wrong while loading models.</p>
      <button
        onClick={onRetry}
        className="text-blue-500 underline hover:text-blue-700"
      >
        Retry
      </button>
    </div>
  );
}

export default function ModelsPage() {
  const params = useParams<{ typeId: string }>();
  const typeId = params?.typeId || "";
  const queryClient = useQueryClient();

  // ✅ Prefetch on mount for instant load next time
  React.useEffect(() => {
    if (typeId) {
      queryClient.prefetchQuery(["models", typeId], () => fetchModels(typeId));
    }
  }, [typeId, queryClient]);

  const { models, isLoading, isError, refetch } = useModels(typeId);

  const renderModelItem = useCallback(
    (model: any, children: React.ReactNode) => (
      <Link
        href={`/types/${typeId}/models/${model.id}`}
        key={model.id}
        className="block h-full w-full"
      >
        {children}
      </Link>
    ),
    [typeId]
  );

  return (
    <div className="min-h-screen text-black dark:text-white bg-gradient-to-b from-[#e5f1fc] to-[#f2f4ff] dark:bg-[radial-gradient(ellipse_at_center,_rgb(16,13,33)_0%,_#0b0a1a_100%)]">
      <main className="max-w-7xl mx-auto p-8 pt-20">
        <Link
          href="/"
          className="text-blue-500 hover:underline mb-6 mt-8 inline-block"
        >
          ← Back to Types
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
          Models
        </h1>

        {/* ✅ Skeleton هيظهر تلقائي وقت الـ Dynamic Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 aspect-[4/3] animate-pulse"
              >
                <div className="w-full h-32 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorFallback onRetry={refetch} />
        ) : (
          <ModelsList
            typeId={typeId}
            onSelect={() => {}}
            renderItem={renderModelItem}
          />
        )}
      </main>
    </div>
  );
}
