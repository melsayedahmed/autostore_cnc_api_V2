import React, { memo } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

const SearchInput = memo<SearchInputProps>(
  ({
    value,
    onChange,
    onClear,
    isLoading = false,
    placeholder = "Search products...",
    className = "",
  }) => {
    return (
      <div className={`relative w-full ${className}`}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   bg-white dark:bg-slate-800 text-black dark:text-white
                   placeholder-gray-500 dark:placeholder-gray-400
                   transition-all duration-200 ease-in-out
                   shadow-sm hover:shadow-md focus:shadow-lg"
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          ) : value ? (
            <button
              onClick={onClear}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                       transition-colors duration-200 ease-in-out"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          ) : null}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
