"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CourseCategory } from "../../types/courseCategory";
import CourseCategoryService from "../service/courseCategory.service";
import config from "../config/config";
import { formatDate } from "../../utils/dateUtils";

// Extended ImageItem interface to include url
interface ExtendedImageItem {
  url?: string;
  path?: string;
  key: string;
  _id?: string;
}

// Update the CourseCategory interface to use ExtendedImageItem
interface ExtendedCourseCategory extends Omit<CourseCategory, 'image'> {
  image: ExtendedImageItem[];
}

interface CourseCategoryListProps {
  categories: ExtendedCourseCategory[];
  onDelete: (id: string) => void;
  onRestore?: (id: string) => Promise<void>;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
  activeTab: "active" | "deleted";
  isLoading?: boolean;
}

export default function CourseCategoryList({
  categories,
  onDelete,
  onRestore,
  onToggleActive,
  activeTab,
  isLoading = false,
}: CourseCategoryListProps) {
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);
  const [restoreConfirm, setRestoreConfirm] = React.useState<string | null>(
    null
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-[var(--foreground-muted)] mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        <p className="text-lg font-medium text-[var(--foreground)]">
          No categories found
        </p>
        <p className="text-[var(--foreground-muted)] max-w-md mt-2">
          {activeTab === "active"
            ? "Start by adding a category to organize your courses"
            : "No deleted categories found"}
        </p>
        {activeTab === "active" && (
          <Link
            href="/dashboard/course-categories/add"
            className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2"
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
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category._id}
          className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-md)]"
        >
          {/* Category image */}
          <div className="relative h-48 w-full bg-[var(--input-bg)]">
            {category.image && category.image.length > 0 && (
              <Image
                src={
                  // First check if we have a URL directly
                  category.image[0].url
                    ? category.image[0].url
                    // Then check if we have a path that needs the API URL prefixed
                    : category.image[0].path
                    ? `${process.env.NEXT_PUBLIC_API_URL || config.imageUrl}${category.image[0].path}`
                    // Fallback to placeholder
                    : '/placeholder-image.png'
                }
                alt={category.name}
                fill
                className="object-cover"
              />
            )}
            {(!category.image || category.image.length === 0 || 
              (!category.image[0].url && !category.image[0].path)) && (
              <div className="flex items-center justify-center h-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-[var(--foreground-muted)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Category details */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-medium text-[var(--foreground)] truncate">
                {category.name}
              </h3>
              <div className="flex-1"></div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  category.isActive
                    ? "bg-[var(--success)]/10 text-[var(--success)]"
                    : "bg-[var(--warning)]/10 text-[var(--warning)]"
                }`}
              >
                {category.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="text-[var(--foreground-muted)] line-clamp-2 mb-3">
              {category.description}
            </p>

            <div className="flex items-center justify-between text-sm text-[var(--foreground-muted)]">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span>
                  {category.courseCount !== undefined
                    ? category.courseCount > 1 || category.courseCount === 0
                      ? `${category.courseCount} courses`
                      : `${category.courseCount} course`
                    : "0 courses"}
                </span>
              </div>
              <span>{formatDate(category.updatedAt)}</span>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-3 gap-2">
              {activeTab === "active" ? (
                <>
                  <Link
                    href={`/dashboard/course-categories/${category._id}`}
                    className="flex justify-center items-center text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View
                  </Link>
                  <Link
                    href={`/dashboard/course-categories/edit/${category._id}`}
                    className="flex justify-center items-center text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(category._id)}
                    className="flex justify-center items-center text-[var(--foreground)] hover:text-[var(--error)] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <div></div>
                  <button
                    onClick={() => onRestore && onRestore(category._id)}
                    className="flex justify-center items-center text-[var(--foreground)] hover:text-[var(--success)] transition-colors col-span-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Restore
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
