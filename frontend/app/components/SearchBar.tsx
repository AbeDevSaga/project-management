"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Bars3Icon } from "@heroicons/react/24/outline";

interface SearchbarProps {
  onToggleSidebar: () => void;
  onCollapseSidebar?: () => void;
}

function SearchBar({ onToggleSidebar, onCollapseSidebar }: SearchbarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", query); // Replace with actual search logic
  };

  return (
    <div className="w-full flex items-center gap-2">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        onClick={onToggleSidebar}
      >
        <Bars3Icon className="h-6 w-6 text-gray-600 cursor-pointer" />
      </button>
      <button
        className="hidden lg:flex p-2 rounded-md hover:bg-gray-100 transition-colors"
        onClick={onCollapseSidebar}
      >
        <Bars3Icon className="h-6 w-6 text-gray-600 cursor-pointer" />
      </button>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="flex flex-1 items-center bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
      >
        {/* Search Button */}
        <button
          type="submit"
          className="px-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FaSearch className="w-4 h-4" />
        </button>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="py-2 w-full focus:outline-none text-gray-700 placeholder-gray-400"
        />
      </form>
    </div>
  );
}

export default SearchBar;
