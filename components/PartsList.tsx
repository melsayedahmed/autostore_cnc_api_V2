"use client";

import React, { useMemo, useCallback } from "react";
import Image from "next/image";
import { useParts } from "../hooks/useParts";
import type { Part } from "../lib/types";
import { motion } from "framer-motion";

interface PartsListProps {
  modelYearId: string;
  versionId?: string;
  renderItem?: (
    part: Part,
    index: number,
    children: React.ReactNode
  ) => React.ReactNode;
}

// نفس الفيد سلايد أب زي الهوم
const fadeSlideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const PartsListComponent: React.FC<PartsListProps> = ({
  modelYearId,
  versionId,
  renderItem,
}) => {
  const {
    data: parts,
    isLoading,
    isError,
    refetch,
  } = useParts(modelYearId, versionId);

  const memoizedParts = useMemo(() => parts || [], [parts]);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.style.display = "none";
    },
    []
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 p-4">
        <p className="mb-2">Error loading parts.</p>
        <button
          onClick={refetch}
          className="text-blue-500 underline hover:text-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (memoizedParts.length === 0) {
    return <div className="text-gray-500 mt-6">No parts found.</div>;
  }

  const renderCard = (part: Part) => (
    <div
      className="flex flex-col items-center justify-center 
        bg-white dark:bg-gradient-to-b dark:from-[#4998a455] dark:to-[#4998a4] 
        border border-transparent rounded-2xl shadow-md 
        transition-transform duration-300 ease-in-out 
        hover:scale-105 hover:ring-4 hover:ring-[#8b5cf6]/30 
        hover:shadow-[0_0_30px_#8b5cf6] dark:hover:shadow-[0_0_30px_#8b5cf6] 
        p-6 cursor-pointer aspect-[4/3] w-full min-h-[240px] overflow-hidden"
    >
      {part.image ? (
        <div className="relative w-full h-20 mb-4">
          <Image
            src={part.image}
            alt={part.name}
            layout="fill"
            objectFit="contain"
            onError={handleImageError}
            className="rounded"
            priority={false}
          />
        </div>
      ) : (
        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 mb-4 rounded">
          <span className="text-gray-400 dark:text-white text-2xl">🔩</span>
        </div>
      )}
      <span className="font-medium text-center text-sm text-black dark:text-white truncate w-full">
        {part.name}
      </span>
      {part.dimensions && (
        <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
          {part.dimensions}
        </span>
      )}
      {typeof part.points === "number" && (
        <span className="text-xs text-gray-800 dark:text-gray-300">
          Points: {part.points}
        </span>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {memoizedParts.map((part, index) =>
        renderItem ? (
          renderItem(part, index, renderCard(part))
        ) : (
          <motion.div
            key={part.id}
            variants={fadeSlideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            {renderCard(part)}
          </motion.div>
        )
      )}
    </div>
  );
};

export const PartsList = React.memo(
  PartsListComponent,
  (prevProps, nextProps) =>
    prevProps.modelYearId === nextProps.modelYearId &&
    prevProps.versionId === nextProps.versionId
);
