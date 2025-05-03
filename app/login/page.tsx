"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Input from "../components/Input";
import Button from "../components/Button";
import { loginSchema, validateForm } from "../utils/validation";
import AuthService from "../components/service/authService";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

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
      await AuthService.login(formData.email, formData.password);
      setIsLoading(true);

      // Mock successful login
      router.push("/dashboard");
    } catch (error: any) {
      setErrors({
        general: error.response.data.message,
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
              src="/Logo/Only Transperent/full_trimmed_transparent_white.png"
              alt="Accredipeople Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div className="text-white text-center">
            <h2 className="text-2xl font-semibold mb-6">Certification Excellence</h2>
            <p className="text-lg opacity-80">
              "Elevating professionals through industry-recognized certifications and verified credentials."
            </p>
          </div>
        </div>
      </div>

      {/* Right column with login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-secondary/80 mt-3">Sign in to access your certification dashboard</p>
          </div>

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
