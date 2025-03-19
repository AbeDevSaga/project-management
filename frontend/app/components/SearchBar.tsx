"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", query); // Replace with actual search logic
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full flex border bg-white items-center rounded-l-lg pr-4"
    >
      {/* Search Button */}
      <button
        type="submit"
        className="px-4 py-2 focus:outline-none"
      >
        <FaSearch className="w-4 h-4" />
      </button>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="py-2 bg-white w-full focus:outline-none"
      />
    </form>
  );
}

export default SearchBar;
