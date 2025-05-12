"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CourseCategoryList from "../../components/course-categories/CourseCategoryList";
import { CourseCategory } from "../../types/courseCategory";
import CourseCategoryService from "../../components/service/courseCategory.service";
import courseService from "../../components/service/course.service";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export default function CourseCategoriesPage() {
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchCategories = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await CourseCategoryService.getAllCourseCategories();
      if (res?.courseCategories) {
        const categoriesData = res.courseCategories;
        
        // Get course counts for each category
        const categoriesWithCounts = await Promise.all(
          categoriesData.map(async (category: CourseCategory) => {
            try {
              const courseCount = await courseService.countCoursesByCategory(category._id);
              return {
                ...category,
                courseCount: courseCount
              };
            } catch (error) {
              console.error(`Error getting course count for category ${category._id}:`, error);
              return category;
            }
          })
        );
        
        setCategories(categoriesWithCounts);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteClick = async (id: string) => {
    // Clear previous error
    setDeleteError("");
    
    try {
      // Check if category has associated courses
      const hasAssociatedCourses = await courseService.hasCoursesByCategory(id);
      
      if (hasAssociatedCourses) {
        setDeleteError("Cannot delete category that has associated courses. Please remove all courses from this category first.");
        return;
      }
      
      // If no courses, proceed with deletion
      setCategoryToDelete(id);
      setIsDeleteModalOpen(true);
    } catch (err) {
      console.error("Error checking category courses:", err);
      setDeleteError("Error checking if category has associated courses.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      await CourseCategoryService.deleteCourseCategory(categoryToDelete);
      
      // Update the UI optimistically
      setCategories(
        categories.map((category) =>
          category._id === categoryToDelete ? { ...category, isDeleted: true } : category
        )
      );
      
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting category");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestoreCategory = async (id: string) => {
    try {
      await CourseCategoryService.restoreCourseCategory(id);
      
      // Update the UI optimistically
      setCategories(
        categories.map((category) =>
          category._id === id ? { ...category, isDeleted: false } : category
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Error restoring category");
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await CourseCategoryService.updateCourseCategoryStatus(id, isActive);
      
      // Update the UI optimistically
      setCategories(
        categories.map((category) =>
          category._id === id ? { ...category, isActive } : category
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Error updating category status");
    }
  };

  const handleTabChange = (tab: "active" | "deleted") => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Course Categories</h1>
          <p className="text-[var(--foreground-muted)]">
            Manage categories for organizing courses
          </p>
        </div>
        <Link
          href="/dashboard/course-categories/add"
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] flex items-center gap-2 hover:bg-[var(--primary-hover)] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Category
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}
      
      {/* Delete Error message */}
      {deleteError && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {deleteError}
        </div>
      )}

      {/* Tabs for Active/Deleted */}
      <div className="border-b border-[var(--border)]">
        <div className="flex space-x-4">
          <button
            onClick={() => handleTabChange("active")}
            className={`pb-3 px-1 font-medium text-sm transition-colors ${
              activeTab === "active"
                ? "border-b-2 border-[var(--primary)] text-[var(--foreground)]"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Active Categories
          </button>
          <button
            onClick={() => handleTabChange("deleted")}
            className={`pb-3 px-1 font-medium text-sm transition-colors ${
              activeTab === "deleted"
                ? "border-b-2 border-[var(--primary)] text-[var(--foreground)]"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Deleted Categories
          </button>
        </div>
      </div>

      {/* Category list */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner size="medium" text="Loading categories..." />
        </div>
      ) : (
        <CourseCategoryList
          categories={categories.filter(
            (category) =>
              activeTab === "active" ? !category.isDeleted : category.isDeleted
          )}
          onDelete={handleDeleteClick}
          onRestore={handleRestoreCategory}
          onToggleActive={handleToggleActive}
          activeTab={activeTab}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[var(--background)] rounded-[var(--radius-lg)] p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-[var(--foreground)]">Confirm Delete</h3>
            <p className="mt-2 text-[var(--foreground-muted)]">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="mt-4 flex space-x-2 justify-end">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                disabled={isDeleting}
                className="px-4 py-2 bg-[var(--error)] text-white rounded-[var(--radius-md)] hover:bg-[var(--error)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <LoadingSpinner size="small" />
                    Deleting...
                  </>
                ) : (
                  <>Delete</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
