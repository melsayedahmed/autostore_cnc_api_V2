"use client";

import React, { memo, useCallback, useMemo } from "react";
import Image from "next/image";
import type { Type } from "../lib/types";
import { PaginationLink } from "../hooks/useTypes";
import Pagination from "./ui/pagination";

// ✅ Skeleton Loader Component
const TypeCardSkeleton = memo(() => (
  <div
    className="flex flex-col items-center justify-center 
      bg-white dark:bg-gradient-to-b dark:from-[#4998a455] dark:to-[#4998a4] 
      border border-transparent rounded-2xl shadow-md 
      p-12 aspect-[4/3] w-full min-h-[240px] animate-pulse"
  >
    <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
  </div>
));
TypeCardSkeleton.displayName = "TypeCardSkeleton";

// ✅ Individual Type Card Component (Memoized)
const TypeCard = memo(
  ({ type, onSelect }: { type: Type; onSelect: (type: Type) => void }) => {
    const handleClick = useCallback(() => onSelect(type), [onSelect, type]);

    return (
      <button
        className="flex flex-col items-center justify-center 
          bg-white dark:bg-gradient-to-b dark:from-[#4998a455] dark:to-[#4998a4] 
          border border-transparent rounded-2xl shadow-md 
          transition-all duration-300 ease-in-out 
          hover:scale-105 hover:ring-4 hover:ring-[#8b5cf6]/30 
          hover:shadow-[0_0_30px_#8b5cf6] dark:hover:shadow-[0_0_30px_#8b5cf6] 
          p-12 cursor-pointer aspect-[4/3] w-full min-h-[240px] overflow-hidden"
        onClick={handleClick}
        aria-label={`Select type ${type.name}`}
      >
        {type.image ? (
          <div className="w-full h-40 relative mb-6 rounded">
            <Image
              src={type.image}
              alt={type.name}
              layout="fill"
              objectFit="contain"
              className="rounded"
              priority={false}
              onError={(e) => {
                (e.currentTarget as any).style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-800 mb-6 rounded">
            <span className="text-gray-500 dark:text-white text-4xl">🚗</span>
          </div>
        )}
        <p
          className="font-medium text-center text-base w-full px-4 mt-3 leading-snug break-words"
          title={type.name}
        >
          {type.name}
        </p>
      </button>
    );
  }
);
TypeCard.displayName = "TypeCard";

// ✅ Main List Component (Memoized)
interface TypesListProps {
  types: Type[];
  links: PaginationLink[];
  onSelect: (type: Type) => void;
  onPageChange: (page: number) => void;
  searchTerm?: string; // ✅ Added for search
  renderItem?: (type: Type, children: React.ReactNode) => React.ReactNode;
  isLoading?: boolean;
}

const TypesListComponent: React.FC<TypesListProps> = ({
  types,
  links,
  onSelect,
  onPageChange,
  searchTerm = "",
  renderItem,
  isLoading = false,
}) => {
  const handleSelect = useCallback((type: Type) => onSelect(type), [onSelect]);

  // ✅ فلترة باستخدام useMemo للأداء
  const filteredTypes = useMemo(() => {
    if (!searchTerm) return types;
    const lowerSearch = searchTerm.toLowerCase();
    return types.filter((item) =>
      item.name.toLowerCase().includes(lowerSearch)
    );
  }, [types, searchTerm]);

  if (isLoading) {
    return (
      <div className="w-full rounded-2xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <TypeCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!filteredTypes?.length) {
    return <div className="text-center text-gray-500">No types found.</div>;
  }

  return (
    <>
      <div className="w-full rounded-2xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTypes.map((type) => {
            const card = (
              <TypeCard key={type.id} type={type} onSelect={handleSelect} />
            );
            return renderItem ? renderItem(type, card) : card;
          })}
        </div>
      </div>
      <Pagination links={links} onPageChange={onPageChange} />
    </>
  );
};

export const TypesList = memo(TypesListComponent);
TypesList.displayName = "TypesList";
