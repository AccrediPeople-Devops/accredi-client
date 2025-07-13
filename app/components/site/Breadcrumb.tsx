"use client";
import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: "light" | "dark"; // light = dark text on light bg, dark = light text on dark bg
}

export default function Breadcrumb({ items, className = "", variant = "light" }: BreadcrumbProps) {
  const baseClasses = variant === "dark" 
    ? "text-white/80 hover:text-white" 
    : "text-gray-500 hover:text-gray-600";
  
  const arrowClasses = variant === "dark" 
    ? "text-white/60" 
    : "text-gray-500";
    
  const itemClasses = variant === "dark" 
    ? "text-white font-medium" 
    : "text-blue-500 hover:text-blue-600";

  return (
    <nav className={`flex mt-5 mb-5 lg:mb-7 ${className}`} aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-1">
        {/* Home Link */}
        <li>
          <div>
            <Link href="/" className={baseClasses}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="size-3 lg:size-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="2" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" 
                />
              </svg>
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        
        {/* Breadcrumb Items */}
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              {/* Arrow Separator */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`size-4 lg:size-5 flex-shrink-0 ${arrowClasses}`}
                viewBox="0 0 20 20" 
                fill="currentColor" 
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" 
                  clipRule="evenodd"
                />
              </svg>
              
              {/* Breadcrumb Link or Text */}
              {item.href ? (
                <Link
                  href={item.href}
                  className={`ml-1 text-xs lg:text-sm font-semibold ${itemClasses}`}
                >
                  {item.label}
                </Link>
              ) : (
                <span 
                  className={`ml-1 text-xs lg:text-sm font-semibold ${itemClasses}`}
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
} 