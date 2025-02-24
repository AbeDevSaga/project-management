'use client';
import React, { useState } from "react";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { TLanguage } from "../constants/type";
import { languages } from "../constants/languages";

function LanguageSelection() {
  const [selectedLanguage, setSelectedLanguage] = useState<TLanguage>(languages[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLanguageSelect = (language: TLanguage) => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative">
      {/* Selected Language */}
      <div
        className="flex items-center gap-2 cursor-pointer p-2 border border-gray-300 rounded-lg"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Image
          src={selectedLanguage.country.image}
          alt={selectedLanguage.country.language}
          width={24}
          height={24}
          className="w-6 h-6 rounded-full"
        />
        <span className="text-sm font-medium">
          {selectedLanguage.country.language}
        </span>
        {isDropdownOpen?<FaChevronUp className="w-4 h-4" />:<FaChevronDown className="w-4 h-4" />}
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-12 left-0 bg-white border border-gray-300 rounded-lg shadow-lg px-2 z-10">
          <ul>
            {languages.map((language, index) => (
              <li
                key={index}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleLanguageSelect(language)}
              >
                <Image
                  src={language.country.image}
                  alt={language.country.language}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium">
                  {language.country.language}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LanguageSelection;