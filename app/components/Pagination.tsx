import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onNextPage,
  onPrevPage,
}) => {
  // Function to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      // Show all pages if total pages are 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first 2 pages, ellipsis, current page, and last 2 pages
      if (currentPage <= 3) {
        // Show first 3 pages and ellipsis
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push("...");
      } else if (currentPage >= totalPages - 2) {
        // Show ellipsis and last 3 pages
        pages.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show ellipsis, current page, ellipsis
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="absolute left-0 bottom-0 w-full shadow-lg z-200">
      <div className="flex justify-center items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={onPrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-full ${
            currentPage === 1
              ? "cursor-not-allowed"
              : "hover:bg-gray-300"
          }`}
        >
          &lt;
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={index} className="text-center text-xl px-4 pb-3 flex items-center justify-center">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(page as number)}
              className={`px-4 py-2 rounded-full ${
                currentPage === page
                  ? "bg-primary"
                  : "hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next Button */}
        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-full ${
            currentPage === totalPages
              ? "cursor-not-allowed"
              : "hover:bg-gray-300"
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;