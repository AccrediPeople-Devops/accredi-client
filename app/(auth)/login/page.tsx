"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { loginSchema, validateForm } from "@/app/utils/validation";
import AuthService from "@/app/components/service/auth.service";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated and handle success messages
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Decode token to check user role
          const payload = JSON.parse(atob(token.split('.')[1]));
          const role = payload.role;
          
          // Redirect based on role
          if (role === "admin" || role === "superadmin") {
            router.replace("/dashboard");
          } else {
            router.replace("/my-courses");
          }
        } catch (error) {
          // Invalid token, remove it
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      }
    };
    
    // Check for success message from signup
    const message = searchParams.get('message');
    if (message) {
      setSuccessMessage(message);
      // Clear the message from URL without causing a re-render loop
      window.history.replaceState({}, '', '/login');
    }
    
    checkAuthentication();
  }, [router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateForm(
      formData,
      loginSchema
    );
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    try {
      setIsLoading(true);
      const response = await AuthService.login(formData.email, formData.password);
      
      // Decode token to check user role
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;
        
        // Redirect based on role
        if (role === "admin" || role === "superadmin") {
          router.push("/dashboard");
        } else {
          router.push("/my-courses");
        }
      }
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left column with logo and quote */}
      <div className="w-full md:w-1/2 bg-[#4F46E5] flex flex-col items-center justify-center p-8 relative">
        <div className="max-w-md w-full flex flex-col items-center">
          <div className="relative w-96 h-40 mb-12">
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
            <h2 className="text-2xl font-semibold mb-6">Empowering Professionals, One Certification at a Time.</h2>
            <p className="text-lg opacity-80">
              "We're committed to delivering world-class, instructor-led training programs that help professionals upskill, grow in their careers, and stay ahead in today's competitive landscape."
            </p>
          </div>
        </div>
      </div>

      {/* Right column with login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Home Button */}
          <div className="mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center text-secondary/80 hover:text-white transition-colors text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-secondary/80 mt-3">Sign in to access your certification dashboard</p>
          </div>

          {successMessage && (
            <div className="bg-green-500/20 border border-green-500/30 text-white px-4 py-3 rounded mb-6">
              {successMessage}
            </div>
          )}

          {errors.general && (
            <div className="bg-error/20 border border-error/30 text-white px-4 py-3 rounded mb-6">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="flex justify-end">
              <Link href="/forgot-password" className="auth-link text-sm">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth disabled={isLoading} className="py-3 bg-[#4F46E5] hover:bg-[#4338CA]">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center mt-6">
              <p className="text-white/70">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="auth-link text-[#4F46E5]">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
