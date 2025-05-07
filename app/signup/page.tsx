"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "../components/Input";
import Button from "../components/Button";
import ImageUpload from "../components/ImageUpload";
import { registrationSchema, validateForm } from "../utils/validation";

type FormData = {
  fullName: string;
  email: string;
  password: string;
  contactNumber: string;
  country: string;
  city: string;
  profileImage: {
    url: string;
    key: string;
  } | null;
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
    profileImage: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
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

  const handleImageChange = (image: { url: string; key: string }) => {
    setFormData((prev) => ({
      ...prev,
      profileImage: image,
    }));

    if (errors.profileImage) {
      setErrors((prev) => ({
        ...prev,
        profileImage: undefined,
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
      // In a real app, you would call your API here
      // For now, we'll simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful registration
      router.push("/login");
    } catch (error) {
      setErrors({
        general: "Failed to register. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container py-10">
      <div className="auth-card max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-secondary/80">Join our community today</p>
        </div>

        {errors.general && (
          <div className="bg-error/20 border border-error/30 text-white px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-6 mb-4">
            <div className="md:w-1/3 flex justify-center">
              <ImageUpload
                onChange={handleImageChange}
                value={formData.profileImage || undefined}
                error={errors.profileImage}
              />
            </div>

            <div className="md:w-2/3">
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

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="mt-6">
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>

          <div className="text-center mt-6">
            <p className="text-white/70">
              Already have an account?{" "}
              <Link href="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
