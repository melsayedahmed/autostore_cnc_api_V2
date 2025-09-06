"use client";

import React, { memo, useMemo, useCallback, useState } from "react";
import Image from "next/image";
import { useModels } from "../hooks/useModels";
import type { Model } from "../lib/types";
import { motion } from "framer-motion";

interface ModelsListProps {
  typeId: string;
  onSelect: (model: Model) => void;
  renderItem?: (model: Model, children: React.ReactNode) => React.ReactNode;
}

// Animation for each card
const fadeSlideUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: index * 0.12,
      duration: 0.6,
      ease: "easeOut",
      type: "spring",
      stiffness: 60,
    },
  }),
};

export const ModelsList: React.FC<ModelsListProps> = memo(
  ({ typeId, onSelect, renderItem }) => {
    const { data: models, isLoading, isError } = useModels(typeId);
    const [searchTerm, setSearchTerm] = useState("");

    const handleImageError = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.style.display = "none";
      },
      []
    );

    // ✅ فلترة الموديلات
    const filteredModels = useMemo(() => {
      if (!models) return [];
      if (!searchTerm) return models;
      const lowerSearch = searchTerm.toLowerCase();
      return models.filter((item) =>
        item.name.toLowerCase().includes(lowerSearch)
      );
    }, [models, searchTerm]);

    const renderCard = useCallback(
      (model: Model, index: number) => {
        const card = (
          <motion.button
            custom={index}
            variants={fadeSlideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
              transition: { duration: 0.3 },
            }}
            className="flex flex-col items-center justify-center
          bg-white dark:bg-gradient-to-b dark:from-[#4998a455] dark:to-[#4998a4] 
              border border-transparent rounded-2xl shadow-md
              transition-transform duration-300 ease-in-out
              hover:scale-105 hover:ring-4
          hover:shadow-[0_0_30px_#8b5cf6] dark:hover:shadow-[0_0_30px_#8b5cf6] 
              p-12 cursor-pointer aspect-[4/3] w-full h-full min-h-[240px]"
            onClick={() => onSelect(model)}
            aria-label={`Select model ${model.name}`}
          >
            {model.image ? (
              <div className="w-full h-40 relative mb-6 rounded">
                <Image
                  src={model.image}
                  alt={model.name}
                  fill
                  className="object-contain rounded"
                  onError={(e) => handleImageError(e as any)}
                />
              </div>
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-800 mb-6 rounded">
                <span className="text-white text-4xl">🚗</span>
              </div>
            )}
            <p
              className="font-medium text-center text-base w-full px-4 mt-3 leading-snug break-words text-black dark:text-white"
              title={model.name}
            >
              {model.name}
            </p>
          </motion.button>
        );

        return renderItem ? renderItem(model, card) : card;
      },
      [onSelect, renderItem, handleImageError]
    );

    // ✅ Loading + Error + Empty
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
            />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-red-500 font-medium">Error loading models.</div>
      );
    }

    // ✅ عرض مع السرش
    return (
      <>
        {/* ✅ Search Input for Mobile */}
        <div className="w-full p-4 md:hidden">
          <input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-black dark:text-white"
          />
        </div>

        {filteredModels.length === 0 ? (
          <div className="text-center text-gray-500">No models found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {filteredModels.map((model, index) => (
              <div key={model.id}>{renderCard(model, index)}</div>
            ))}
          </div>
        )}
      </>
    );
  }
);

ModelsList.displayName = "ModelsList";
