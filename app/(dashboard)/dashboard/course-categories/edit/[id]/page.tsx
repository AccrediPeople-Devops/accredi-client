"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import CourseCategoryForm from "@/app/components/course-categories/CourseCategoryForm";
import { CourseCategory } from "@/app/types/courseCategory";
import CourseCategoryService from "@/app/components/service/courseCategory.service";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

export default function EditCourseCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<CourseCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await CourseCategoryService.getCourseCategoryById(categoryId);
        if (response && response.courseCategory) {
          setCategory(response.courseCategory);
        } else {
          setError("Category not found");
        }
      } catch (err: any) {
        console.error("Error fetching category:", err);
        setError(err.response?.data?.message || "Error fetching category");
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const handleUpdateCategory = async (updatedCategory: CourseCategory) => {
    setIsSubmitting(true);
    setError("");

    try {
      // Make sure the image data is in the expected format
      const imageData =
        updatedCategory.image && updatedCategory.image.length > 0
          ? updatedCategory.image.map((img) => ({
              path: img.path,
              key: img.key,
              _id: img._id,
            }))
          : [];

      // Create a payload that matches the validator schema, excluding isActive
      const payload = {
        name: updatedCategory.name,
        description: updatedCategory.description,
        image: imageData,
      };

      const res = await CourseCategoryService.updateCourseCategory(categoryId, payload);
      
      if (res) {
        // Update the active status if needed
        const currentIsActive = category?.isActive || false;
        if (updatedCategory.isActive !== currentIsActive) {
          await CourseCategoryService.updateCourseCategoryStatus(
            categoryId,
            updatedCategory.isActive
          );
        }
        
        // Navigate back to categories page
        router.push("/dashboard/course-categories");
      }
    } catch (err: any) {
      console.error("Error updating category:", err);
      setError(err.response?.data?.message || "Error updating category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/course-categories");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" text="Loading category data..." />
      </div>
    );
  }

  if (error && !category) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Course Category</h1>
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
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Course Category</h1>
          <p className="text-[var(--foreground-muted)]">
            Update the details for {category?.name}
          </p>
        </div>
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
            Update the details of this course category
          </p>
        </div>
        <div className="p-6">
          {isSubmitting ? (
            <div className="flex justify-center items-center py-10">
              <LoadingSpinner size="medium" text="Updating category..." />
            </div>
          ) : (
            category && (
              <CourseCategoryForm
                initialData={category}
                onSubmit={handleUpdateCategory}
                onCancel={handleCancel}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
} 