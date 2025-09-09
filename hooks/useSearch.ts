import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Type, SearchResultItem } from "../lib/types";

interface SearchResponse {
  data: Type[];
  total: number;
}

const transformSearchResult = (item: SearchResultItem): Type => {
  return {
    id: item.id,
    name: `${item.type} ${item.subtype} ${item.submodel} (${item.year})`,
    image: item.image,
    description: `${item.type} ${item.subtype} ${item.submodel} - ${item.year}`,
  };
};
const searchProducts = async (searchTerm: string): Promise<SearchResponse> => {
  if (!searchTerm.trim()) {
    return { data: [], total: 0 };
  }

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  if (!API_KEY) {
    throw new Error("VITE_API_KEY is not set in environment variables");
  }

  const response = await fetch(
    `https://autostore.link/api/v2/search/${encodeURIComponent(searchTerm)}`,
    {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        search: searchTerm,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const result = await response.json();

  // Transform the nested array structure to flat array of Type objects
  const flatResults: SearchResultItem[] = result.flat();
  const transformedData = flatResults.map(transformSearchResult);

  return {
    data: transformedData,
    total: transformedData.length,
  };
};

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["search", debouncedSearchTerm],
    queryFn: () => searchProducts(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    searchResults: data?.data || [],
    totalResults: data?.total || 0,
    isSearching: isLoading && debouncedSearchTerm.length > 0,
    hasSearchTerm: debouncedSearchTerm.length > 0,
    isSearchError: isError,
    searchError: error,
    clearSearch,
    refetchSearch: refetch,
  };
};
