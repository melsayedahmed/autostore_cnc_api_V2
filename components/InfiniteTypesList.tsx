"use client";

import React, { memo, useCallback, useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { Type } from "../lib/types";
import { Loader2 } from "lucide-react";

// ✅ Skeleton Loader
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

// ✅ Card
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
              fill
              style={{ objectFit: "contain" }}
              className="rounded"
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

// ✅ Infinite Types List
interface InfiniteTypesListProps {
  types: Type[];
  onSelect: (type: Type) => void;
  onLoadMore: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  renderItem?: (type: Type, children: React.ReactNode, index: number) => React.ReactNode;
}

const InfiniteTypesListComponent: React.FC<InfiniteTypesListProps> = ({
  types,
  onSelect,
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
  isLoading = false,
  renderItem,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const handleSelect = useCallback((type: Type) => onSelect(type), [onSelect]);

  // ✅ Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  // ✅ فلترة
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

  return (
    <>
      {/* ✅ Search Input */}
      <div className="w-full p-4 md:hidden">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-black dark:text-white"
        />
      </div>

      {/* ✅ Results */}
      {filteredTypes.length === 0 && searchTerm ? (
        <div className="text-center text-gray-500 py-8">
          No products found matching "{searchTerm}".
        </div>
      ) : (
        <>
          <div className="w-full rounded-2xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredTypes.map((type, index) => {
                const card = (
                  <TypeCard key={type.id} type={type} onSelect={handleSelect} />
                );
                return renderItem ? renderItem(type, card, index) : card;
              })}
            </div>
          </div>

          {/* ✅ Load More Trigger */}
          <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more...</span>
              </div>
            ) : hasNextPage ? (
              <div className="h-4 w-4" /> // Invisible trigger element
            ) : filteredTypes.length > 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent w-64 mx-auto mb-4"></div>
                <p className="text-sm">You've reached the end</p>
              </div>
            ) : null}
          </div>
        </>
      )}
    </>
  );
};

export const InfiniteTypesList = memo(InfiniteTypesListComponent);
InfiniteTypesList.displayName = "InfiniteTypesList";