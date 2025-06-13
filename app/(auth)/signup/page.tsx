"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import ImageUpload from "@/app/components/ImageUpload";
import { registrationSchema, validateForm } from "@/app/utils/validation";
import AuthService from "@/app/components/service/auth.service";
import uploadService from "@/app/components/service/upload.service";

type FormData = {
  fullName: string;
  email: string;
  password: string;
  contactNumber: string;
  country: string;
  city: string;
};

type FormErrors = {
  [K in keyof FormData]?: string;
} & {
  general?: string;
};

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    contactNumber: "",
    country: "",
    city: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated
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
            router.replace("/user-dashboard/profile");
          }
        } catch (error) {
          // Invalid token, remove it
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      }
    };
    
    checkAuthentication();
  }, [router]);

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
      registrationSchema
    );
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the data in the format expected by the backend
      // Note: Profile image upload is skipped during signup to avoid auth issues
      // Users can add profile images later in their profile settings
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contactNumber,
        country: formData.country,
        city: formData.city,
      };

      console.log("Sending registration data:", registrationData);

      // Make the actual API call
      const response = await AuthService.register(registrationData);
      
      console.log("Registration response:", response);

      // Check if registration was successful
      if (response.success || response.status) {
        // Registration successful, redirect to login with success message
        router.push("/login?message=Registration successful! Please login with your credentials.");
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrors({
        general: error.response?.data?.message || error.message || "Failed to register. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left column with signup form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-lg">
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

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-secondary/80 mt-3">Join our community and start your certification journey</p>
          </div>

          {errors.general && (
            <div className="bg-error/20 border border-error/30 text-white px-4 py-3 rounded mb-6">
              {errors.general}
            </div>
          )}

                    <form onSubmit={handleSubmit} className="space-y-5">
            {/* Basic Info */}
            <div className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                autoComplete="name"
              />

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
            </div>

            {/* Password */}
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
            />

            {/* Contact and Location Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Number"
                type="tel"
                name="contactNumber"
                placeholder="Enter your contact number"
                value={formData.contactNumber}
                onChange={handleChange}
                error={errors.contactNumber}
                autoComplete="tel"
              />

              <Input
                label="Country"
                type="text"
                name="country"
                placeholder="Enter your country"
                value={formData.country}
                onChange={handleChange}
                error={errors.country}
                autoComplete="country"
              />
            </div>

            {/* City */}
            <Input
              label="City"
              type="text"
              name="city"
              placeholder="Enter your city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              autoComplete="address-level2"
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              fullWidth 
              disabled={isLoading} 
              className="py-3 bg-[#10B981] hover:bg-[#059669] mt-6"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-white/70">
                Already have an account?{" "}
                <Link href="/login" className="auth-link text-[#10B981]">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right column with design and quote */}
      <div className="w-full md:w-1/2 bg-[#10B981] flex flex-col items-center justify-center p-8 relative">
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
            <h2 className="text-2xl font-semibold mb-6">Start Your Professional Journey Today</h2>
            <p className="text-lg opacity-90">
              "Join thousands of professionals who have advanced their careers through our industry-leading certification programs. Your success story begins here."
            </p>
            
            {/* Feature highlights */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center text-left">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/90">Industry-recognized certifications</span>
              </div>
              
              <div className="flex items-center text-left">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/90">Expert-led training programs</span>
              </div>
              
              <div className="flex items-center text-left">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/90">Flexible learning schedules</span>
              </div>
              
              <div className="flex items-center text-left">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/90">Career advancement support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
