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
const ThemeContext = createContext<{
  isDarkMode: boolean;
}>({ isDarkMode: true });

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!value) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await searchApi(value);
        const flatRes =
          Array.isArray(res) && Array.isArray(res[0]) ? res[0] : res;
        setResults(flatRes);
        setShowDropdown(true);
      } catch {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);
  };

  useEffect(() => {
    document.title = "Autostore Catalog";
  }, []);

  return (
    <div className="relative flex justify-end w-full md:w-72 lg:w-96 px-9 mx-2">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
        className="w-[180%] sm:w-96 px-5 py-3 rounded-lg border border-gray-300 
             focus:outline-none focus:ring-2 focus:ring-blue-500 
             text-lg sm:text-sm bg-slate-800 text-white placeholder-gray-400"
        onFocus={() => query && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      {showDropdown && results.length > 0 && (
        <div className="absolute left-0 right-0 mt- rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto bg-slate-800 text-white border border-gray-700">
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
                [
                {[item.type, item.subtype, item.submodel, item.year]
                  .filter(Boolean)
                  .join(" - ")}
                ]
              </span>
              {item.name || `${item.type} ${item.subtype}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
SearchBar.displayName = "SearchBar";

// ✅ Header with Search
const Header = memo(() => {
  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-6">
      <nav className="rounded-2xl px-6 py-4 shadow-2xl transition-all duration-700 bg-white/10 backdrop-blur-2xl border-white/20">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/about" className="block">
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

          {/* Navigation + Search */}
          <div className="flex flex-row items-center justify-center space-x-4">
            <SearchBar />

            {/* Nav Links */}
            {/* <nav className="flex space-x-4 md:space-x-6"> */}
              {/* <Link
                href="/about"
                className="relative group transition-all duration-300 text-gray-300 hover:text-white"
              >
                Models
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link> */}
            {/* </nav> */}
          </div>
        </div>
      </nav>
    </header>
  );
});
Header.displayName = "Header";

// ✅ RootLayout (Dark Mode فقط)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" className="dark">
      <body className="bg-slate-900 text-white transition-colors duration-300">
        <QueryClientProvider client={queryClient}>
          <ThemeContext.Provider value={{ isDarkMode: true }}>
            <Header />
            {children}
          </ThemeContext.Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
