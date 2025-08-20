import React from "react";

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  links: PaginationLink[];
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ links, onPageChange }) => {
  // Helper to extract page number from URL
  const getPageFromUrl = (url: string | null) => {
    if (!url) return null;
    // Handles both ?page=2 and &page=2
    const match = url.match(/[?&]page=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  return (
    <nav className="flex justify-center my-4">
      <ul className="inline-flex -space-x-px">
        {links.map((link, idx) => {
          // Remove HTML entities from label
          const label = link.label.replace(/&laquo;|&raquo;/g, (m) => (m === "&laquo;" ? "←" : "→"));
          const page = getPageFromUrl(link.url);
          const isActive = link.active;
          return (
            <li key={idx}>
              <button
                className={`px-4 py-2 border border-gray-300 font-semibold transition-colors
                  ${isActive ? "bg-blue-600 text-white cursor-default" : "bg-white text-gray-700 hover:bg-gray-100"}
                  ${!link.url || isActive ? "opacity-50 cursor-not-allowed" : ""}
                `}
                disabled={!link.url || isActive}
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  if (!isActive && page) onPageChange(page);
                }}
                dangerouslySetInnerHTML={{ __html: label }}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Pagination;
