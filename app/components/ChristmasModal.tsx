"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ChristmasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChristmasModal: React.FC<ChristmasModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Generate snowflake data once and memoize it - optimized
  const snowflakes = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 10, // 15-25 seconds (slower)
      size: 16 + Math.random() * 12, // 16-28px
      opacity: 0.5 + Math.random() * 0.3, // 0.5-0.8
    }));
  }, []);

  // Generate Christmas lights for top of modal
  const lights = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: (i * 5) + '%',
      delay: (i * 0.2) % 2,
    }));
  }, []);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText("CHRISTMAS2025");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ zIndex: 1 }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-red-700 via-red-600 to-red-500 rounded-2xl shadow-2xl transform transition-all duration-300" style={{ overflow: 'hidden', position: 'relative', zIndex: 2 }}>
        
        {/* Christmas Lights on Top */}
        <div className="absolute -top-2 left-0 right-0 h-4 z-30 flex justify-between items-center px-2">
          {lights.map((light) => (
            <div
              key={light.id}
              className="christmas-light"
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                animationDelay: `${light.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
          aria-label="Close modal"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Christmas Trees at Bottom */}
        <div className="absolute bottom-16 left-0 right-0 pointer-events-none z-0">
          <div className="christmas-tree absolute bottom-0 left-[10%] text-red-800/60 text-4xl" style={{ animationDelay: '0s' }}>
            🎄
          </div>
          <div className="christmas-tree absolute bottom-0 left-[30%] text-red-800/50 text-3xl" style={{ animationDelay: '0.5s' }}>
            🎄
          </div>
          <div className="christmas-tree absolute bottom-0 left-[50%] text-red-800/60 text-4xl" style={{ animationDelay: '1s' }}>
            🎄
          </div>
          <div className="christmas-tree absolute bottom-0 left-[70%] text-red-800/50 text-3xl" style={{ animationDelay: '1.5s' }}>
            🎄
          </div>
          <div className="christmas-tree absolute bottom-0 left-[85%] text-red-800/60 text-4xl" style={{ animationDelay: '2s' }}>
            🎄
          </div>
        </div>

        {/* Additional decorative elements inside modal */}
        <div className="absolute top-4 left-4 z-20 text-yellow-300 text-2xl christmas-twinkle" style={{ animationDelay: '0s' }}>
          ✨
        </div>
        <div className="absolute top-4 right-16 z-20 text-yellow-300 text-2xl christmas-twinkle" style={{ animationDelay: '0.5s' }}>
          ✨
        </div>
        <div className="absolute top-1/4 left-2 z-20 text-yellow-300 text-xl christmas-twinkle" style={{ animationDelay: '1s' }}>
          ⭐
        </div>
        <div className="absolute top-1/4 right-2 z-20 text-yellow-300 text-xl christmas-twinkle" style={{ animationDelay: '1.5s' }}>
          ⭐
        </div>
        <div className="absolute bottom-32 left-4 z-20 text-yellow-300 text-2xl christmas-twinkle" style={{ animationDelay: '2s' }}>
          🔔
        </div>
        <div className="absolute bottom-32 right-4 z-20 text-yellow-300 text-2xl christmas-twinkle" style={{ animationDelay: '2.5s' }}>
          🔔
        </div>

        {/* Content */}
        <div className="relative z-20 p-8 md:p-12 pb-24 md:pb-28">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif">
              Christmas
            </h2>
            <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-400 drop-shadow-lg mb-4">
              SUPER SALE
            </h1>
          </div>

          {/* 50% OFF Box */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm border-2 border-white rounded-xl px-8 py-4 transform hover:scale-105 transition-transform">
              <p className="text-4xl md:text-5xl font-bold text-white">
                50% OFF
              </p>
            </div>
          </div>

          {/* Discount Code */}
          <div className="bg-white/95 rounded-xl p-6 mb-6 shadow-lg">
            <p className="text-sm text-gray-600 mb-2 text-center">Discount Code:</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-xl md:text-2xl px-6 py-3 rounded-lg flex-1 text-center min-w-[200px]">
                CHRISTMAS2025
              </div>
              <button
                onClick={handleCopyCode}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Special Message */}
          <div className="text-center mb-6">
            <p className="text-xl md:text-2xl text-white font-semibold drop-shadow-lg">
              🎄 Christmas Special! 
            </p>
            <p className="text-lg md:text-xl text-white mt-2 drop-shadow-md">
              Limited-Time Offer – Enrol Now & Save Big! 🎁
            </p>
          </div>

          {/* Enroll Now Button */}
          <div className="flex justify-center mt-6">
            <Link
              href="/courses/pmp-certification-training-course"
              onClick={onClose}
              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-gray-900 font-bold text-lg md:text-xl px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 z-20 relative"
            >
              Enroll Now
              <span className="text-2xl">→</span>
            </Link>
          </div>
        </div>

        {/* Snowdrift Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/40 backdrop-blur-sm z-10">
          <div className="absolute -top-12 left-0 right-0 h-12 bg-white/30 rounded-t-full" style={{
            clipPath: 'polygon(0% 100%, 5% 80%, 10% 90%, 15% 70%, 20% 85%, 25% 75%, 30% 90%, 35% 80%, 40% 95%, 45% 85%, 50% 100%, 55% 85%, 60% 95%, 65% 80%, 70% 90%, 75% 75%, 80% 85%, 85% 70%, 90% 90%, 95% 80%, 100% 100%)'
          }}></div>
        </div>
      </div>

      {/* Snowfall on entire page - in front of modal */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 3, overflow: 'hidden' }}>
        {snowflakes.map((snowflake) => (
          <div
            key={snowflake.id}
            className="christmas-snowflake"
            style={{
              position: 'fixed',
              left: `${snowflake.left}%`,
              top: '-100px',
              animation: `christmasFall ${snowflake.duration}s linear ${snowflake.delay}s infinite`,
              fontSize: `${snowflake.size}px`,
              opacity: snowflake.opacity,
              color: 'rgba(255, 255, 255, 0.9)',
              textShadow: '0 0 3px rgba(255,255,255,0.6)',
              pointerEvents: 'none',
              userSelect: 'none',
              lineHeight: 1,
              willChange: 'transform, opacity',
              transform: 'translateZ(0)', // GPU acceleration
              backfaceVisibility: 'hidden', // Performance optimization
            }}
          >
            ❄
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChristmasModal;

