"use client";

import "./globals.css";
import React, {
  useState,
  useEffect,
  memo,
  createContext,
  useContext,
  useRef,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { search as searchApi } from "../lib/api";
import { useRouter } from "next/navigation";

// 🌙 ثابت دايمًا على dark mode
const ThemeContext = createContext<{ isDarkMode: boolean }>({
  isDarkMode: true,
});

export const useTheme = () => useContext(ThemeContext);

// ✅ Helper function for dynamic links
const getResultLink = (item: any): string => {
  return `/types/${encodeURIComponent(item.type)}/models/${encodeURIComponent(
    item.subtype
  )}/submodels/${encodeURIComponent(item.submodel)}/years/${item.id}/parts`;
};

// ✅ SearchBar Component
const SearchBar = memo(() => {
  const { isDarkMode } = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const fetchResults = async (value: string, reset = true) => {
    const nextPage = reset ? 1 : page + 1;
    try {
      const res = await searchApi(value, nextPage, 50); // ✅ 50 per_page
      const flatRes =
        Array.isArray(res) && Array.isArray(res[0]) ? res[0] : res;

      if (reset) {
        setResults(flatRes);
      } else {
        setResults((prev) => [...prev, ...flatRes]);
      }

      setPage(nextPage);
      setHasMore(flatRes.length > 0);
      setShowDropdown(true);
    } catch {
      if (reset) setResults([]);
      setHasMore(false);
      setShowDropdown(false);
    }
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!value) {
      setResults([]);
      setPage(1);
      setHasMore(true);
      setShowDropdown(false);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      fetchResults(value, true);
    }, 400);
  };

  useEffect(() => {
    document.title = "Autostore Catalog";
  }, []);

  return (
    <div className="relative flex justify-end w-full md:w-72 lg:w-96 px-2 mx-2">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 
             focus:outline-none focus:ring-2 focus:ring-blue-500 
             text-sm bg-slate-800 text-white placeholder-gray-400"
        onFocus={() => query && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      {showDropdown && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-9 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto bg-slate-800 text-white border border-gray-700">
          {results.map((item, idx) => (
            <div
              key={item.id || idx}
              className="block px-4 py-2 hover:bg-blue-500 hover:text-white text-sm cursor-pointer"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowDropdown(false);
                router.push(getResultLink(item));
              }}
            >
              <span className="font-semibold mr-2">
                {[item.type, item.subtype, item.submodel, item.year]
                  .filter(Boolean)
                  .join(" - ")}
              </span>
              {item.name || `${item.type} ${item.subtype}`}
            </div>
          ))}

          {/* ✅ زرار Load More */}
          {hasMore && (
            <button
              className="w-full py-2 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm"
              onMouseDown={(e) => {
                e.preventDefault();
                fetchResults(query, false);
              }}
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
});
SearchBar.displayName = "SearchBar";

// ✅ Modal Component
const Modal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 p-6 rounded-2xl shadow-lg w-11/12 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Search</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>
        <SearchBar />
      </div>
    </div>
  );
};

// ✅ Header with Search (Desktop Only)
const Header = memo(() => {
  return (
    <header className="hidden md:block fixed top-6 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-6xl px-6">
      <nav className="rounded-2xl px-6 py-4 shadow-2xl transition-all duration-700 bg-white/10 backdrop-blur-2xl border-white/20">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="block">
              <Image
                src="/images/nav.webp"
                alt="Logo"
                width={150}
                height={40}
                priority
                className="hidden md:block"
              />
            </Link>
          </div>
          {/* SearchBar for Desktop */}
          <SearchBar />
        </div>
      </nav>
    </header>
  );
});
Header.displayName = "Header";

// ✅ Mobile Floating Button
const MobileSearchButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="md:hidden fixed bottom-8 right-6 translate-x-1/4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl z-50 text-3xl"
    >
      🔍
    </button>
  );
};

// ✅ RootLayout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <body className="bg-slate-900 text-white transition-colors duration-300">
        <QueryClientProvider client={queryClient}>
          <ThemeContext.Provider value={{ isDarkMode: true }}>
            {/* Desktop Header */}
            <Header />

            {/* Mobile Floating Button */}
            <MobileSearchButton onClick={() => setIsModalOpen(true)} />

            {/* Modal for Search */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {children}
          </ThemeContext.Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
