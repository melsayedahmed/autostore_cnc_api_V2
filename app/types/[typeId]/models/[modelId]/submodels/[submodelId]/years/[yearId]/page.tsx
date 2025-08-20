"use client";
import React, { useEffect, useCallback } from "react";
import { VersionsList } from "../../../../../../../../../components/VersionsList";
import { useVersions } from "../../../../../../../../../hooks/useVersions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function YearStepPage({
  params,
}: {
  params: {
    typeId: string;
    modelId: string;
    submodelId: string;
    yearId: string;
  };
}) {
  const { typeId, modelId, submodelId, yearId } = params;
  const { versions, isLoading, isError } = useVersions(yearId);
  const router = useRouter();

  // ✅ Auto redirect لو مفيش Versions
  useEffect(() => {
    if (!isLoading && !isError && versions && versions.length === 0) {
      router.replace(
        `/types/${typeId}/models/${modelId}/submodels/${submodelId}/years/${yearId}/parts`
      );
    }
  }, [
    isLoading,
    isError,
    versions,
    typeId,
    modelId,
    submodelId,
    yearId,
    router,
  ]);

  // ✅ تثبيت onSelect
  const handleSelect = useCallback(
    (version: any) => {
      router.push(
        `/types/${typeId}/models/${modelId}/submodels/${submodelId}/years/${yearId}/versions/${version.id}/parts`
      );
    },
    [router, typeId, modelId, submodelId, yearId]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e5f1fc] to-[#f2f4ff] dark:bg-[radial-gradient(ellipse_at_center,_rgb(16,13,33)_0%,_#0b0a1a_100%)] text-black dark:text-white">
      <main className="max-w-7xl mx-auto p-8 pt-20">
        <Link
          href={`/types/${typeId}/models/${modelId}/submodels/${submodelId}`}
          className="text-blue-500 hover:underline mb-6 mt-7 inline-block"
        >
          ← Back to Model Years
        </Link>

        <h1 className="text-3xl font-bold mb-8">Versions</h1>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-red-500">Error loading versions.</div>
        ) : (
          <VersionsList modelYearId={yearId} onSelect={handleSelect} />
        )}
      </main>
    </div>
  );
}
