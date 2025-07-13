"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import couponCodeService from "@/app/components/service/couponCode.service";
import courseService from "@/app/components/service/course.service";
import { formatDate } from "@/app/utils/dateUtils";

interface CouponCode {
  _id: string;
  courseId: string;
  country: string;
  discountCode: string;
  couponLimit: number;
  expiryDate: string;
  discountPrice: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Course {
  _id: string;
  title: string;
}

export default function CouponCodesPage() {
  const router = useRouter();
  const [couponCodes, setCouponCodes] = useState<CouponCode[]>([]);
  const [courses, setCourses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isTogglingActive, setIsTogglingActive] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchCouponCodes();
    fetchCourses();
  }, []);

  const fetchCouponCodes = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await couponCodeService.getAllCouponCodes();
      if (response && response.couponCodes) {
        setCouponCodes(response.couponCodes);
      } else if (Array.isArray(response)) {
        setCouponCodes(response);
      } else {
        setError("Failed to load coupon codes. Invalid response format.");
      }
    } catch (err: any) {
      console.error("Error fetching coupon codes:", err);
      setError(err.response?.data?.message || "Failed to load coupon codes");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAllCourses();
      if (response && response.courses) {
        const courseMap: Record<string, string> = {};
        response.courses.forEach((course: Course) => {
          courseMap[course._id] = course.title;
        });
        setCourses(courseMap);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon code?")) {
      setIsDeleting(id);
      try {
        await couponCodeService.deleteCouponCode(id);
        setCouponCodes(couponCodes.filter(code => code._id !== id));
      } catch (err: any) {
        console.error("Error deleting coupon code:", err);
        setError(err.response?.data?.message || "Error deleting coupon code");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleToggleActive = async (id: string, currentActiveState: boolean) => {
    setIsTogglingActive(id);
    try {
      await couponCodeService.toggleCouponCodeActive(id, !currentActiveState);
      setCouponCodes(
        couponCodes.map(code => 
          code._id === id ? { ...code, isActive: !currentActiveState } : code
        )
      );
    } catch (err: any) {
      console.error("Error toggling coupon code active state:", err);
      setError(err.response?.data?.message || "Error updating coupon code status");
    } finally {
      setIsTogglingActive(null);
    }
  };

  const getCourseName = (courseId: string): string => {
    return courses[courseId] || "Unknown Course";
  };

  const filteredCouponCodes = couponCodes.filter(code => {
    // Filter by search term
    const searchMatch = 
      code.discountCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCourseName(code.courseId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    let statusMatch = true;
    if (selectedStatus === "active") {
      statusMatch = code.isActive === true;
    } else if (selectedStatus === "inactive") {
      statusMatch = code.isActive === false;
    } else if (selectedStatus === "expired") {
      const today = new Date();
      const expiryDate = new Date(code.expiryDate);
      statusMatch = expiryDate < today;
    }
    
    return searchMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Coupon Codes</h1>
          <p className="text-[var(--foreground-muted)]">
            Manage discount coupon codes for courses
          </p>
        </div>
        <Link
          href="/dashboard/coupon-codes/add"
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Coupon Code
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by code, course, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)]"
          />
        </div>
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="large" text="Loading coupon codes..." />
        </div>
      ) : (
        <>
          {/* Coupon code list */}
          {filteredCouponCodes.length === 0 ? (
            <div className="text-center py-20 text-[var(--foreground-muted)]">
              <p className="text-lg font-medium">No coupon codes found</p>
              <p className="mt-2">
                {searchTerm || selectedStatus !== "all" 
                  ? "Try changing your search or filter criteria" 
                  : "Click 'Add Coupon Code' to create your first coupon code"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[var(--input-bg)] text-[var(--foreground)]">
                    <th className="px-4 py-3 text-left font-medium">Code</th>
                    <th className="px-4 py-3 text-left font-medium">Course</th>
                    <th className="px-4 py-3 text-left font-medium">Country</th>
                    <th className="px-4 py-3 text-left font-medium">Discount</th>
                    <th className="px-4 py-3 text-left font-medium">Limit</th>
                    <th className="px-4 py-3 text-left font-medium">Expiry Date</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCouponCodes.map((code) => {
                    const isExpired = new Date(code.expiryDate) < new Date();
                    
                    return (
                      <tr 
                        key={code._id} 
                        className="border-b border-[var(--border)] hover:bg-[var(--input-bg)]/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-[var(--foreground)]">
                          <span className="font-mono bg-[var(--input-bg)] px-2 py-1 rounded-[var(--radius-sm)]">
                            {code.discountCode}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[var(--foreground)]">
                          {getCourseName(code.courseId)}
                        </td>
                        <td className="px-4 py-3 text-[var(--foreground)]">
                          {code.country}
                        </td>
                        <td className="px-4 py-3 text-[var(--foreground)]">
                          {code.discountPrice}
                        </td>
                        <td className="px-4 py-3 text-[var(--foreground)]">
                          {code.couponLimit}
                        </td>
                        <td className="px-4 py-3 text-[var(--foreground)]">
                          <span className={isExpired ? "text-[var(--error)]" : ""}>
                            {formatDate(code.expiryDate)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isExpired
                                ? "bg-[var(--error)]/10 text-[var(--error)]"
                                : code.isActive
                                ? "bg-[var(--success)]/10 text-[var(--success)]"
                                : "bg-[var(--foreground-muted)]/10 text-[var(--foreground-muted)]"
                            }`}
                          >
                            {isExpired
                              ? "Expired"
                              : code.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleActive(code._id, code.isActive || false)}
                            disabled={isTogglingActive === code._id || isExpired}
                            className={`px-2 py-1 rounded-[var(--radius-sm)] text-xs font-medium ${
                              isExpired
                                ? "bg-[var(--background)] text-[var(--foreground-muted)] cursor-not-allowed"
                                : code.isActive
                                ? "bg-[var(--warning)]/10 text-[var(--warning)] hover:bg-[var(--warning)]/20"
                                : "bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20"
                            } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {isTogglingActive === code._id ? (
                              <LoadingSpinner size="small" />
                            ) : isExpired ? (
                              "Expired"
                            ) : code.isActive ? (
                              "Deactivate"
                            ) : (
                              "Activate"
                            )}
                          </button>
                          
                          <Link
                            href={`/dashboard/coupon-codes/edit/${code._id}`}
                            className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 rounded-[var(--radius-sm)] text-xs font-medium transition-colors inline-block"
                          >
                            Edit
                          </Link>
                          
                          <button
                            onClick={() => handleDelete(code._id)}
                            disabled={isDeleting === code._id}
                            className="px-2 py-1 bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20 rounded-[var(--radius-sm)] text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDeleting === code._id ? (
                              <LoadingSpinner size="small" />
                            ) : (
                              "Delete"
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
} 