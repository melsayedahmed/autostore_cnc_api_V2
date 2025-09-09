"use client";

import React, { memo, useCallback, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import type { Type } from "../lib/types";
import { Loader2 } from "lucide-react";
import SearchInput from "./SearchInput";
import { useSearch } from "../hooks/useSearch";

// ✅ Skeleton Loader
const TypeCardSkeleton = memo(() => (
  <div
    className="flex flex-col items-center justify-center 
      bg-white dark:text-white bg-gradient-to-b from-[#e5f1fc] to-[#f2f4ff] dark:bg-[radial-gradient(ellipse_at_center,_rgb(16,13,33)_0%,_#0b0a1a_100%)] 
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
          bg-white dark:bg-gradient-to-b dark:from-[#4998a455] dark:to-[#0d0b1c]
           border-transparent rounded-2xl shadow-md 
          transition-all duration-300 ease-in-out 
          hover:scale-105 hover:ring-4 hover:ring-[#4998a455]/30 
          hover:shadow-[#62b5e39e] dark:hover:shadow-[#62b5e39e] 
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
            <span className="text-gray-500 dark:text-white text-2xl">🚗</span>
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

// ✅ Search Results Display
const SearchResults = memo(
  ({
    results,
    onSelect,
    renderItem,
    isLoading,
    isError,
    onRetry,
  }: {
    results: Type[];
    onSelect: (type: Type) => void;
    renderItem?: (
      type: Type,
      children: React.ReactNode,
      index: number
    ) => React.ReactNode;
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
  }) => {
    if (isLoading) {
      return (
        <div className="w-full rounded-2xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <TypeCardSkeleton key={index} />
            ))}
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Search failed. Please try again.
          </p>
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Search
          </button>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mb-4">
            <span className="text-6xl">🔍</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            No results found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search terms
          </p>
        </div>
      );
    }

    return (
      <div className="w-full rounded-2xl p-4">
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Found {results.length} result{results.length !== 1 ? "s" : ""}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {results.map((type, index) => {
            const card = (
              <TypeCard key={type.id} type={type} onSelect={onSelect} />
            );
            return renderItem ? renderItem(type, card, index) : card;
          })}
        </div>
      </div>
    );
  }
);
SearchResults.displayName = "SearchResults";

// ✅ Infinite Types List
interface InfiniteTypesListProps {
  types: Type[];
  onSelect: (type: Type) => void;
  onLoadMore: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  renderItem?: (
    type: Type,
    children: React.ReactNode,
    index: number
  ) => React.ReactNode;
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
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const handleSelect = useCallback((type: Type) => onSelect(type), [onSelect]);

  // ✅ Search functionality
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    hasSearchTerm,
    isSearchError,
    clearSearch,
    refetchSearch,
  } = useSearch();

  // ✅ Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !hasSearchTerm
        ) {
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
  }, [hasNextPage, isFetchingNextPage, onLoadMore, hasSearchTerm]);

  // ✅ Show search results or regular types
  const displayContent = () => {
    if (hasSearchTerm) {
      return (
        <SearchResults
          results={searchResults}
          onSelect={handleSelect}
          renderItem={renderItem}
          isLoading={isSearching}
          isError={isSearchError}
          onRetry={refetchSearch}
        />
      );
    }

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
        <div className="w-full rounded-2xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {types.map((type, index) => {
              const card = (
                <TypeCard key={type.id} type={type} onSelect={handleSelect} />
              );
              return renderItem ? renderItem(type, card, index) : card;
            })}
          </div>
        </div>

        {/* ✅ Load More Trigger - Only show when not searching */}
        <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading more...</span>
            </div>
          ) : hasNextPage ? (
            <div className="h-4 w-4" /> // Invisible trigger element
          ) : types.length > 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent w-64 mx-auto mb-4"></div>
              <p className="text-sm">You've reached the end</p>
            </div>
          ) : null}
        </div>
      </>
    );
  };

  return (
    <>
      {/* ✅ Search Input - Now visible on all devices */}
      <div className="w-full p-4 mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={clearSearch}
          isLoading={isSearching}
          placeholder="Search your car..."
        />
      </div>

      {/* ✅ Content Display */}
      {displayContent()}
    </>
  );
};

export const InfiniteTypesList = memo(InfiniteTypesListComponent);
InfiniteTypesList.displayName = "InfiniteTypesList";
