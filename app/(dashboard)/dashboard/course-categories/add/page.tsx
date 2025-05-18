"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CourseCategoryForm from "@/app/components/course-categories/CourseCategoryForm";
import { CourseCategory } from "@/app/types/courseCategory";
import CourseCategoryService from "@/app/components/service/courseCategory.service";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

export default function AddCourseCategoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddCategory = async (
    newCategory: Omit<
      CourseCategory,
      "_id" | "createdAt" | "updatedAt" | "courseCount" | "isDeleted"
    >
  ) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Make sure the image data is in the expected format
      const imageData =
        newCategory.image && newCategory.image.length > 0
          ? newCategory.image.map((img) => ({
              path: img.path,
              key: img.key,
              _id: img._id,
            }))
          : [];

      // Create a payload that matches the validator schema, excluding isActive
      const payload = {
        name: newCategory.name,
        description: newCategory.description,
        image: imageData,
      };

      const res = await CourseCategoryService.createCourseCategory(payload);
      
      if (res && res.courseCategory) {
        // If the user wanted the category to be active, update the status
        if (newCategory.isActive) {
          try {
            await CourseCategoryService.updateCourseCategoryStatus(
              res.courseCategory._id,
              true
            );
          } catch (statusErr) {
            console.error("Error setting initial active status:", statusErr);
          }
        }
        
        // Navigate back to categories page
        router.push("/dashboard/course-categories");
      }
    } catch (err: any) {
      console.error("Error adding category:", err);
      setError(err.response?.data?.message || "Error adding category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Add Course Category</h1>
        <Link
          href="/dashboard/course-categories"
          className="px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)] transition-colors flex items-center gap-2"
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
          Back to Categories
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-medium text-[var(--foreground)]">Category Information</h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            Fill in the details to create a new course category
          </p>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <LoadingSpinner size="medium" text="Creating category..." />
            </div>
          ) : (
            <CourseCategoryForm
              onSubmit={handleAddCategory}
              initialCategory={{
                name: "",
                description: "",
                image: [],
                isActive: true,
              }}
              submitButtonText="Create Category"
              onCancel={() => router.push("/dashboard/course-categories")}
            />
          )}
        </div>
      </div>
    </div>
  );
} 