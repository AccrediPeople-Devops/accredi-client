"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import CountryButton from "@/app/components/CountryButton";
import { CountryData } from "@/app/context/LocationContext";
import couponCodeService from "@/app/components/service/couponCode.service";
import courseService from "@/app/components/service/course.service";
import { formatDateForInput } from "@/app/utils/dateUtils";

interface Course {
  _id: string;
  title: string;
}

interface CouponFormData {
  courseId: string;
  country: string;
  discountCode: string;
  couponLimit: number;
  expiryDate: string;
  discountPrice: number;
}

export default function AddCouponCodePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CouponFormData>({
    courseId: "",
    country: "",
    discountCode: "",
    couponLimit: 1,
    expiryDate: formatDateForInput(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // Default to 30 days from now
    discountPrice: 0
  });

  // Common country codes for dropdown
  const countryCodes = [
    { code: "IN", name: "India" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "SG", name: "Singapore" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "ALL", name: "All Countries" }
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoadingCourses(true);
        const response = await courseService.getAllCourses();
        if (response && response.courses) {
          // Filter out active courses
          const activeCourses = response.courses.filter(
            (course: any) => course.isActive && !course.isDeleted
          );
          setCourses(activeCourses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses");
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "couponLimit" || name === "discountPrice" 
        ? Number(value) 
        : value,
    }));
  };

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const length = 8;
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    setFormData((prev) => ({
      ...prev,
      discountCode: result
    }));
  };

  const handleCountrySelect = (country: CountryData) => {
    setFormData((prev) => ({
      ...prev,
      country: country.name
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.courseId) {
        throw new Error("Course is required");
      }
      if (!formData.country) {
        throw new Error("Country is required");
      }
      if (!formData.discountCode) {
        throw new Error("Discount code is required");
      }
      if (!formData.expiryDate) {
        throw new Error("Expiry date is required");
      }
      if (formData.couponLimit < 1) {
        throw new Error("Coupon limit must be at least 1");
      }
      if (formData.discountPrice <= 0) {
        throw new Error("Discount price must be greater than 0");
      }

      // Create the coupon code
      const response = await couponCodeService.createCouponCode(formData);
      
      if (response && (response.couponCode || response.status === "success" || response.status === true)) {
        // Successfully created coupon code
        router.push("/dashboard/coupon-codes");
      } else {
        throw new Error(response?.message || "Failed to create coupon code");
      }
    } catch (err: any) {
      console.error("Error creating coupon code:", err);
      setError(err.message || "An error occurred while creating the coupon code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Add Coupon Code
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Create a new discount coupon code
          </p>
        </div>
        <Link
          href="/dashboard/coupon-codes"
          className="px-4 py-2 bg-[var(--background)] text-[var(--foreground)] rounded-[var(--radius-md)] flex items-center gap-2 hover:bg-[var(--input-bg)] transition-colors border border-[var(--border)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Coupon Codes
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Loading state for courses */}
      {isLoadingCourses ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="medium" text="Loading courses..." />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
              Coupon Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course selection */}
              <div>
                <label 
                  htmlFor="courseId" 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                >
                  Course *
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country selection */}
              <CountryButton
                label="Country"
                selectedCountryCode={formData.country}
                onCountrySelect={handleCountrySelect}
                placeholder="Select a country"
                required
              />

              {/* Discount code with generate button */}
              <div className="relative">
                <label 
                  htmlFor="discountCode" 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                >
                  Discount Code *
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    id="discountCode"
                    name="discountCode"
                    value={formData.discountCode}
                    onChange={handleChange}
                    placeholder="e.g. SUMMER20"
                    className="w-full px-4 py-2 font-mono bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="px-3 py-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-[var(--radius-md)] hover:bg-[var(--primary)]/20 transition-colors"
                  >
                    Generate
                  </button>
                </div>
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                  Use uppercase letters and numbers, no spaces
                </p>
              </div>

              {/* Expiry date */}
              <div>
                <label 
                  htmlFor="expiryDate" 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                >
                  Expiry Date *
                </label>
                <input 
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  min={formatDateForInput(new Date())}
                  className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  required
                />
              </div>

              {/* Coupon limit */}
              <div>
                <label 
                  htmlFor="couponLimit" 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                >
                  Usage Limit *
                </label>
                <input 
                  type="number"
                  id="couponLimit"
                  name="couponLimit"
                  value={formData.couponLimit}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  required
                />
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                  Maximum number of times this coupon can be used
                </p>
              </div>

              {/* Discount price */}
              <div>
                <label 
                  htmlFor="discountPrice" 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                >
                  Discount Amount *
                </label>
                <input 
                  type="number"
                  id="discountPrice"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  required
                />
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                  Amount to be discounted from the course price
                </p>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" className="text-white" />
                  Creating Coupon...
                </>
              ) : (
                "Create Coupon"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 