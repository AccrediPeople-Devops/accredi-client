"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import AuthService from "@/app/components/service/auth.service";

interface ResetPasswordPageProps {
  params: Promise<{ token: string }>;
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const token = unwrappedParams.token;

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation states
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Password validation
  const validatePassword = (password: string) => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push("Password must contain at least one special character (@$!%*?&)");
    }

    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous errors
    setError("");

    // Validate password in real-time
    if (name === "password") {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }

    // Check if passwords match
    if (name === "confirmPassword") {
      setPasswordsMatch(value === formData.password);
    } else if (name === "password") {
      setPasswordsMatch(formData.confirmPassword === value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation
    const errors = validatePassword(formData.password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await AuthService.resetPassword(
        token,
        formData.password,
        formData.confirmPassword
      );

      if (response.status) {
        // Store authentication tokens if provided
        if (response.token) {
          localStorage.setItem("token", response.token.accessToken);
          localStorage.setItem("refreshToken", response.token.refreshToken);
        }

        // Store user info if provided
        if (response.user) {
          localStorage.setItem("userEmail", response.user.email);
        }

        setSuccess(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(response.message || "Failed to reset password. Please try again.");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      
      // Handle specific error cases
      if (error.response?.status === 401 || 
          error.response?.data?.message?.toLowerCase().includes("token")) {
        setError("Reset link has expired or is invalid. Please request a new password reset.");
      } else if (error.response?.status === 400) {
        setError(error.response?.data?.message || "Invalid password format. Please check the requirements.");
      } else if (error.response?.status === 404) {
        setError("Reset link not found. Please request a new password reset.");
      } else {
        setError(
          error.response?.data?.message || 
          "Failed to reset password. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (success) {
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
              <h2 className="text-2xl font-semibold mb-6">Password Reset Successful</h2>
              <p className="text-lg opacity-80">
                "Your password has been successfully reset. You can now login with your new password."
              </p>
            </div>
          </div>
        </div>

        {/* Right column with success message */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Password Reset Successfully!</h1>
            <p className="text-secondary/80 mb-6">
              Your password has been updated successfully. You will be redirected to the login page shortly.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium rounded-lg transition-colors duration-200"
            >
              Continue to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <h2 className="text-2xl font-semibold mb-6">Create New Password</h2>
            <p className="text-lg opacity-80">
              "Enter your new password below to complete the reset process."
            </p>
          </div>
        </div>
      </div>

      {/* Right column with reset password form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white">Reset Password</h1>
            <p className="text-secondary/80 mt-3">
              Create a strong password for your account
            </p>
          </div>

          {error && (
            <div className="bg-error/20 border border-error/30 text-white px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                New Password *
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your new password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={passwordErrors.length > 0 ? passwordErrors[0] : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-1.414-1.414M14.12 14.12l1.414 1.414M14.12 14.12L15.536 15.536M14.12 14.12l-1.414-1.414M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.563 3.029m-5.858-.908a3 3 0 01-4.243-4.243" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.563 3.029m-5.858-.908a3 3 0 01-4.243-4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-1.414-1.414M14.12 14.12l1.414 1.414M14.12 14.12L15.536 15.536M14.12 14.12l-1.414-1.414" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Password Requirements */}
              {passwordErrors.length > 0 && (
                <div className="mt-2 text-sm text-red-400">
                  <ul className="list-disc list-inside space-y-1">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={!passwordsMatch ? "Passwords do not match" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-1.414-1.414M14.12 14.12l1.414 1.414M14.12 14.12L15.536 15.536M14.12 14.12l-1.414-1.414M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.563 3.029m-5.858-.908a3 3 0 01-4.243-4.243" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.563 3.029m-5.858-.908a3 3 0 01-4.243-4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-1.414-1.414M14.12 14.12l1.414 1.414M14.12 14.12L15.536 15.536M14.12 14.12l-1.414-1.414" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              disabled={isLoading || passwordErrors.length > 0 || !passwordsMatch}
              className="py-3 bg-[#4F46E5] hover:bg-[#4338CA]"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
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
          </form>
        </div>
      </div>
    </div>
  );
} 