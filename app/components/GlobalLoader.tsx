"use client";

import React from "react";
import Image from "next/image";

interface GlobalLoaderProps {
  isLoading: boolean;
}

export default function GlobalLoader({ isLoading }: GlobalLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#0F0F23] via-[#1A1A3E] to-[#2D1B69]">
      {/* Animated Logo Container */}
      <div className="relative w-80 h-32 flex items-center justify-center">
        {/* Logo Image with Animation */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src="/Logo/Only_Transperent/full_margin_transparent_white.png"
            alt="AccrediPeople Certifications"
            width={320}
            height={128}
            className="max-w-full max-h-full object-contain animate-logo-reveal"
            priority
          />
        </div>
      </div>

      {/* Loading Spinner (Optional - underneath the logo) */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
} 