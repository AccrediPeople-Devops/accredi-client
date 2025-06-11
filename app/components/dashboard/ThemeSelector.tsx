"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { themes, ThemeType } from "../../theme";

export default function ThemeSelector() {
  const { themeType, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themeOptions = [
    { id: "pureBlack", label: "Pure Black", color: "#000000" },
    { id: "purpleElegance", label: "Purple Elegance", color: "#7E57C2" },
    { id: "darkMinimal", label: "Dark Minimal", color: "#FFFFFF" },
    {
      id: "blackWhiteMinimal",
      label: "Black & White Minimal",
      color: "#333333",
    },
    { id: "whiteSoftGray", label: "White & Soft Gray", color: "#2196F3" },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Find the current theme
  const currentTheme = themeOptions.find((theme) => theme.id === themeType);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--input-bg)] text-[var(--foreground)] hover:bg-opacity-80 transition-colors border border-[var(--primary)]/10 shadow-[var(--shadow-sm)]"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div
          className="w-4 h-4 rounded-full shadow-[var(--shadow-sm)]"
          style={{ backgroundColor: currentTheme?.color }}
        />
        <span>{currentTheme?.label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed mt-2 w-48 rounded-[var(--radius-md)] shadow-[var(--shadow-md)] bg-[var(--background)] border border-[var(--primary)]/10 z-50"
          style={{
            top: dropdownRef.current
              ? dropdownRef.current.getBoundingClientRect().bottom +
                window.scrollY
              : 0,
            right:
              window.innerWidth -
              (dropdownRef.current
                ? dropdownRef.current.getBoundingClientRect().right +
                  window.scrollX
                : 0),
          }}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {themeOptions.map((option) => (
              <button
                key={option.id}
                className={`w-full text-left px-4 py-2 flex items-center space-x-2 ${
                  option.id === themeType
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "text-[var(--foreground)] hover:bg-[var(--primary)]/5"
                }`}
                role="menuitem"
                onClick={() => handleThemeChange(option.id as ThemeType)}
              >
                <div
                  className="w-4 h-4 rounded-full shadow-[var(--shadow-sm)]"
                  style={{ backgroundColor: option.color }}
                />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
