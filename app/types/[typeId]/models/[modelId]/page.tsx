"use client";

import React, { useCallback, memo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// ✅ Dynamic Import لـ SubmodelsList مع Skeleton
const SubmodelsList = dynamic(
  () =>
    import("../../../../../components/SubmodelsList").then((mod) =>
      memo(mod.SubmodelsList)
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

export default function SubmodelsPage({
  params,
}: {
  params: { typeId: string; modelId: string };
}) {
  const { typeId, modelId } = params;

  // ✅ ثابت علشان ميتعملش له Re-Creation في كل Render
  const handleSelect = useCallback(() => {
    // ممكن تضيف Logic لو محتاج في المستقبل
  }, []);

  const renderItem = useCallback(
    (submodel: any, children: React.ReactNode) => (
      <Link
        href={`/types/${typeId}/models/${modelId}/submodels/${submodel._id}`}
        key={submodel._id}
        className="block h-full w-full"
      >
        {children}
      </Link>
    ),
    [typeId, modelId]
  );

  return (
    <div className="min-h-screen text-black dark:text-white bg-gradient-to-b from-[#e5f1fc] to-[#f2f4ff] dark:bg-[radial-gradient(ellipse_at_center,_rgb(16,13,33)_0%,_#0b0a1a_100%)]">
      <main className="max-w-7xl mx-auto p-8 pt-20">
        <Link
          href={`/types/${typeId}`}
          className="text-blue-500 hover:underline mb-6 inline-block mt-8"
        >
          ← Back to Models
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
          Submodels
        </h1>

        {/* ✅ Skeleton هيظهر أوتوماتيك من Dynamic Import أثناء تحميل SubmodelsList */}
        <SubmodelsList
          modelId={modelId}
          onSelect={handleSelect}
          renderItem={renderItem}
        />
      </main>
    </div>
  );
}
