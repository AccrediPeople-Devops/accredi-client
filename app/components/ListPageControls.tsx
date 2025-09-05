import React from "react";

interface SortOption {
  value: string;
  label: string;
}

interface FilterOption {
  value: string;
  label: string;
}

interface ListPageControlsProps {
  // Search
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  
  // Filters
  filters?: Array<{
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }>;
  
  // Sorting
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
  sortOptions: SortOption[];
  
  // Pagination
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  
  // Additional controls
  additionalControls?: React.ReactNode;
}

export default function ListPageControls({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  sortOptions,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  startIndex,
  endIndex,
  additionalControls
}: ListPageControlsProps) {
  return (
    <div className="space-y-4">
      {/* Search and Primary Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[var(--foreground-muted)]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        {filters.length > 0 && (
          <div>
            <select
              value={filters[0].value}
              onChange={(e) => filters[0].onChange(e.target.value)}
              className="px-4 py-2 w-full bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {filters[0].options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Additional Filters */}
      {filters.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filters.slice(1).map((filter, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">
                {filter.label}
              </label>
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="px-4 py-2 w-full bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Sorting and Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => onSortOrderChange(e.target.value as "asc" | "desc")}
              className="px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">
              Items per page
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={-1}>All</option>
            </select>
          </div>

          {additionalControls}
        </div>

        <div className="text-sm text-[var(--foreground-muted)]">
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} results
        </div>
      </div>
    </div>
  );
}

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[var(--input-bg)] border-t border-[var(--border)]">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--input-bg)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          First
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--input-bg)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1 text-sm rounded-[var(--radius-sm)] transition-colors ${
                  currentPage === pageNum
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--input-bg)]"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--input-bg)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--input-bg)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Last
        </button>
      </div>
      
      <div className="text-sm text-[var(--foreground-muted)]">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}

// Sortable Table Header Component
interface SortableHeaderProps {
  children: React.ReactNode;
  sortKey: string;
  currentSort: string;
  sortOrder: "asc" | "desc";
  onSort: (key: string) => void;
  className?: string;
}

export function SortableHeader({ 
  children, 
  sortKey, 
  currentSort, 
  sortOrder, 
  onSort, 
  className = "" 
}: SortableHeaderProps) {
  const isActive = currentSort === sortKey;
  
  return (
    <th 
      className={`px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {children}
        {isActive && (
          <svg
            className={`w-4 h-4 ${sortOrder === "asc" ? "transform rotate-180" : ""}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        )}
      </div>
    </th>
  );
}
