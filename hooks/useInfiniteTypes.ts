import { useInfiniteQuery } from "@tanstack/react-query";
import type { Type, PaginationResponse } from "../lib/types";
import { getTypes } from "../lib/api";

export const useInfiniteTypes = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["types"],
    queryFn: ({ pageParam = 1 }) => getTypes(pageParam),
    getNextPageParam: (lastPage, pages) => {
      // Check if there's a next page link
      const nextLink = lastPage.links?.find(
        (link) =>
          link.label.includes("Next") ||
          link.label.includes("›") ||
          link.label.includes("&raquo;")
      );

      if (nextLink?.url) {
        // Extract page number from URL
        const match = nextLink.url.match(/[?&]page=(\d+)/);
        return match ? parseInt(match[1], 10) : undefined;
      }

      return undefined;
    },
    initialPageParam: 1,
  });

  // Flatten all pages into a single array of types
  const types: Type[] = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    types,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  };
};
