"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import AuthService from "@/app/components/service/auth.service";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await AuthService.forgotPassword(email);
      
      if (response.status) {
        setSuccess(true);
      } else {
        setError(response.message || "Failed to send reset email. Please try again.");
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setError(
        error.response?.data?.message || 
        "Failed to send reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left column with logo and quote */}
      <div className="w-full md:w-1/2 bg-[#4F46E5] flex flex-col items-center justify-center p-4 relative">
        <div className="max-w-md w-full flex flex-col items-center">
          <div className="relative w-96 h-40 mb-6">
            <Image
              src="/Logo/Only_Transperent/full_trimmed_transparent_white.png"
              alt="Accredipeople Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
              unoptimized
            />
          </div>
          <div className="text-white text-center">
            <h2 className="text-2xl font-semibold mb-6">Reset Your Password</h2>
            <p className="text-lg opacity-80">
              "Enter your email address and we'll send you a link to reset your password."
            </p>
          </div>
        </div>
      </div>

      {/* Right column with forgot password form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {!success ? (
            // Forgot Password Form
            <>
              <div className="mb-10">
                <h1 className="text-3xl font-bold text-white">Forgot Password</h1>
                <p className="text-secondary/80 mt-3">
                  Enter your email address and we'll send you a password reset link
                </p>
              </div>

              {error && (
                <div className="bg-error/20 border border-error/30 text-white px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleEmailChange}
                  autoComplete="email"
                />

                <Button 
                  type="submit" 
                  fullWidth 
                  disabled={isLoading} 
                  className="py-3 bg-[#4F46E5] hover:bg-[#4338CA]"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="text-center mt-6">
                  <Link 
                    href="/login" 
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            // Success Message
            <>
              <div className="mb-10">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white text-center">Check Your Email</h1>
                <p className="text-secondary/80 mt-3 text-center">
                  We've sent a password reset link to <span className="text-white font-medium">{email}</span>
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-primary/10 border border-primary/20 text-white px-4 py-3 rounded">
                  <p className="text-sm">
                    <strong>Didn't receive the email?</strong>
                    <br />
                    • Check your spam/junk folder
                    <br />
                    • Make sure you entered the correct email address
                    <br />
                    • Wait a few minutes and try again
                  </p>
                </div>

                <Button 
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                  fullWidth 
                  className="py-3 bg-[#4F46E5] hover:bg-[#4338CA]"
                >
                  Try Again
                </Button>

                <div className="text-center">
                  <Link 
                    href="/login" 
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Login
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 