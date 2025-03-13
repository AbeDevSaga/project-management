"use client";
import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";

function Theme() {
  const dispatch = useDispatch();
  const theme = useSelector((state: { theme: string }) => state.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="relative border rounded-lg bg-white color p-2">
      {/* Theme Toggle Button */}
      {theme === 'dark' ? (
        <FaMoon
          className="w-5 h-5 text-gray-600 hover:text-gray-800 transition-colors"
          onClick={() => dispatch(toggleTheme())}
        />
      ) : (
        <FaSun
          className="w-5 h-5 text-yellow-500 hover:text-yellow-300 transition-colors"
          onClick={() => dispatch(toggleTheme())}
        />
      )}
    </div>
  );
}

export default Theme;
