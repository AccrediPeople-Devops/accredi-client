"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import OTPInput from "@/app/components/OTPInput";
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
    otp?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

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
      console.log("=== LOGIN RESPONSE ===");
      console.log("Login response:", loginResponse);

      // Check if 2FA is required (response doesn't contain token)
      if (!loginResponse.token && loginResponse.userId) {
        // No token in response but has userId means 2FA is required
        console.log("🔐 2FA REQUIRED - No token in response, showing 2FA form");
        setUserId(loginResponse.userId);
        setUserEmail(formData.email);
        setShow2FA(true);
        setIsLoading(false);
        return;
      }

      // Check if we got a token (normal login)
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token received and no 2FA required");
      }

      // Normal login flow - we have a token
      console.log("=== LOGIN SUCCESS ===");
      
      // Store user email for use in dashboards
      localStorage.setItem("userEmail", formData.email);
      console.log("✅ Stored user email:", formData.email);

      // Add a small delay to ensure token is set properly
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirect based on user role
      await redirectUserBasedOnRole(token);
      
    } catch (error: any) {
      console.error("❌ Login error:", error);
      setErrors({
        general: error.response?.data?.message || "Login failed",
      });
      setIsLoading(false);
    }
  };

  const handleOTPComplete = async (otp: string) => {
    setIsLoading(true);
    setErrors({ otp: undefined });
    
    try {
      console.log("🔐 Submitting OTP:", otp, "for user:", userId);
      const response = await AuthService.loginWith2FA(userId, otp);
      console.log("=== 2FA LOGIN SUCCESS ===");
      console.log("2FA response:", response);

      // Store user email for use in dashboards
      localStorage.setItem("userEmail", userEmail);
      console.log("✅ Stored user email:", userEmail);

      // Add a small delay to ensure token is set properly
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get the token and redirect
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token received after 2FA");
      }

      // Redirect based on user role
      await redirectUserBasedOnRole(token);
      
    } catch (error: any) {
      console.error("❌ 2FA error:", error);
      setErrors({
        otp: error.response?.data?.message || "Invalid OTP. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const redirectUserBasedOnRole = async (token: string) => {
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
  };

  const handleBackToLogin = () => {
    setShow2FA(false);
    setUserId("");
    setUserEmail("");
    setErrors({});
    setIsLoading(false);
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
            />
          </div>
          <div className="text-white text-center">
            <h2 className="text-2xl font-semibold mb-6">Empowering Professionals, One Certification at a Time.</h2>
            <p className="text-lg opacity-80">
              "We’re committed to delivering world-class, instructor-led training programs that help professionals upskill, grow in their careers, and stay ahead in today’s competitive landscape."
            </p>
          </div>
        </div>
      </div>

      {/* Right column with login form or 2FA */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {!show2FA ? (
            // Login Form
            <>
              <div className="mb-10">
                <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                <p className="text-secondary/80 mt-3">Sign in to access your dashboard</p>
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
                    href="/home" 
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
            </>
          ) : (
            // 2FA Form
            <>
              <div className="mb-10">
                <h1 className="text-3xl font-bold text-white">Two-Factor Authentication</h1>
                <p className="text-secondary/80 mt-3">
                  We&apos;ve sent a verification code to <span className="text-white font-medium">{userEmail}</span>
                </p>
              </div>

              {errors.otp && (
                <div className="bg-error/20 border border-error/30 text-white px-4 py-3 rounded mb-6">
                  {errors.otp}
                </div>
              )}

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-white mb-4 text-center">
                    Enter the 6-digit code
                  </label>
                  <OTPInput
                    length={6}
                    onComplete={handleOTPComplete}
                    isLoading={isLoading}
                    error={errors.otp}
                  />
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Login
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-white/70 text-sm">
                    Didn&apos;t receive the code?{" "}
                    <button 
                      type="button"
                      className="text-[#4F46E5] hover:text-[#4338CA] font-medium transition-colors"
                      disabled={isLoading}
                    >
                      Resend Code
                    </button>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
