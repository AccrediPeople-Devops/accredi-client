"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { loginSchema, validateForm } from "@/app/utils/validation";
import AuthService from "@/app/components/service/auth.service";
import UserService from "@/app/components/service/user.service";
import { User } from "@/app/types/user";

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
    
    setIsLoading(true);
    try {
      const loginResponse = await AuthService.login(formData.email, formData.password);
      console.log("=== LOGIN SUCCESS ===");
      console.log("Login response:", loginResponse);

      // Store user email for use in dashboards
      localStorage.setItem("userEmail", formData.email);
      console.log("✅ Stored user email:", formData.email);

      // Add a small delay to ensure token is set properly
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get the token to extract user info and find the user's role
      const token = localStorage.getItem("token");
      console.log("Retrieved token:", token ? "Token exists" : "No token");
      
      if (!token) {
        throw new Error("No token received");
      }

      try {
        // Decode the token to get user role directly
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        console.log("=== TOKEN PAYLOAD ===");
        console.log("Token payload:", tokenPayload);
        
        // Check if role exists in token payload
        if (tokenPayload.role) {
          console.log("=== USING ROLE FROM TOKEN ===");
          console.log("User role from token:", tokenPayload.role);
          
          // Redirect based on user role from token
          if (tokenPayload.role === 'admin' || tokenPayload.role === 'superadmin') {
            console.log("🔗 REDIRECTING TO ADMIN DASHBOARD: /dashboard");
            router.push("/dashboard");
          } else {
            console.log("🔗 REDIRECTING TO USER DASHBOARD: /user-dashboard");
            router.push("/user-dashboard");
          }
        } else {
          // Fallback: Fetch users and find the one matching the token
          console.log("⚠️ No role in token, fetching users list as fallback...");
          const res = await UserService.getAllUsers();
          console.log("Users response:", res);
          
          if (res?.users) {
            console.log("Total users found:", res.users.length);
            const foundUser = res.users.find((user: User) => 
              user.email === tokenPayload.email || 
              user._id === tokenPayload.userId ||
              user._id === tokenPayload.id
            );
            
            if (foundUser) {
              console.log("=== USER FOUND ===");
              console.log("Found user:", foundUser);
              console.log("User role:", foundUser.role);
              console.log("User email:", foundUser.email);
              
              // Redirect based on user role
              if (foundUser.role === 'admin' || foundUser.role === 'superadmin') {
                console.log("🔗 REDIRECTING TO ADMIN DASHBOARD: /dashboard");
                router.push("/dashboard");
              } else {
                console.log("🔗 REDIRECTING TO USER DASHBOARD: /user-dashboard");
                router.push("/user-dashboard");
              }
            } else {
              console.log("❌ User not found in users list");
              console.log("Looking for email:", tokenPayload.email);
              console.log("Available users:", res.users.map((u: User) => ({ email: u.email, role: u.role })));
              console.log("Defaulting to admin dashboard");
              router.push("/dashboard");
            }
          } else {
            console.log("❌ No users data received");
            console.log("Defaulting to admin dashboard");
            router.push("/dashboard");
          }
        }
      } catch (tokenError) {
        console.error("❌ Error decoding token or fetching user:", tokenError);
        // Default to admin dashboard if there's an error
        router.push("/dashboard");
      }
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.message || "Login failed",
      });
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

            <div className="text-center mt-4">
              <Link 
                href="/landing" 
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
            </div>

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
