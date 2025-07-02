"use client";

import React, { useState, useRef, useEffect } from "react";

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  isLoading?: boolean;
  error?: string;
}

export default function OTPInput({ 
  length = 6, 
  onComplete, 
  isLoading = false,
  error 
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== "") && newOtp.join("").length === length) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      
      if (otp[index]) {
        // Clear current field
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous field and clear it
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus the next empty field or the last field
    const nextEmptyIndex = newOtp.findIndex(digit => digit === "");
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit if complete
    if (newOtp.every(digit => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={isLoading}
            className={`
              w-12 h-12 text-center text-xl font-semibold
              bg-[var(--input-bg)] border-2 rounded-lg
              text-[var(--foreground)] placeholder-[var(--foreground-muted)]
              focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-[var(--border)] hover:border-[#4F46E5]/50'
              }
              ${digit ? 'border-[#4F46E5]' : ''}
            `}
            placeholder="0"
          />
        ))}
      </div>
      
      {error && (
        <div className="text-center">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
      
      {isLoading && (
        <div className="flex justify-center">
          <div className="w-6 h-6 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
} 