"use client";

import "./globals.css";
import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  createContext,
  useContext,
  useRef,
} from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { search as searchApi } from "../lib/api";
import { useRouter } from "next/navigation";

const ThemeContext = createContext<{
  isDarkMode: boolean;
  toggleTheme: () => void;
}>({ isDarkMode: true, toggleTheme: () => {} });

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
        console.log("🔍 Search API Response:", flatRes);
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
    <div className="relative w-48">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
        className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
          isDarkMode
            ? "bg-slate-800 text-white placeholder-gray-400"
            : "bg-white text-black placeholder-gray-500"
        }`}
        onFocus={() => query && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      {showDropdown && results.length > 0 && (
        <div
          className={`absolute left-0 right-0 mt-2 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto ${
            isDarkMode
              ? "bg-slate-800 text-white border border-gray-700"
              : "bg-white text-black border border-gray-200"
          }`}
        >
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
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-6">
      <nav
        className={`rounded-2xl px-6 py-4 shadow-2xl transition-all duration-700 ${
          isDarkMode
            ? "bg-white/10 backdrop-blur-2xl border-white/20"
            : "bg-white/80 backdrop-blur-2xl border-white/60 shadow-lg"
        }`}
      >
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
              />
            </Link>
          </div>

          {/* Navigation + Search + Theme Toggle */}
          <div className="flex flex-row items-center justify-center space-x-4 md:space-x-8">
            {/* ✅ SearchBar */}
            <SearchBar />

            {/* Nav Links */}
            <nav className="flex space-x-4 md:space-x-6">
              <Link
                href="/about"
                className={`relative group transition-all duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-slate-700"
                } hover:${isDarkMode ? "text-white" : "text-slate-900"}`}
              >
                Models
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

            {/* Theme Toggle */}
            {/* <button
              onClick={toggleTheme}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isDarkMode
                  ? "bg-slate-700 focus:ring-offset-black"
                  : "bg-slate-300 focus:ring-offset-white"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg transform transition-all duration-300 flex items-center justify-center ${
                  isDarkMode ? "translate-x-0" : "translate-x-7"
                }`}
              >
                {isDarkMode ? (
                  <Moon className="h-3 w-3 text-slate-700" />
                ) : (
                  <Sun className="h-3 w-3 text-yellow-500" />
                )}
              </div>
            </button> */}
          </div>
        </div>
      </nav>
    </header>
  );
});
Header.displayName = "Header";

// ✅ RootLayout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      const prefersDark =
        storedTheme === "dark" ||
        (!storedTheme &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  }, []);

  return (
    <html lang="en" className={isDarkMode ? "dark" : ""}>
      <body
        className={`transition-colors duration-300 ${
          isDarkMode
            ? "bg-slate-900 text-white"
            : "bg-gradient-to-b from-white to-gray-100 text-black"
        }`}
      >
        <QueryClientProvider client={queryClient}>
          <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <Header />
            {children}
          </ThemeContext.Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
