"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { CourseCategory } from "../../types/courseCategory";
import CourseCategoryService from "../service/courseCategory.service";
import config from "../config/config";
interface CourseCategoryListProps {
  categories: CourseCategory[];
  isLoading: boolean;
  onEdit: (category: CourseCategory) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onRestore?: (id: string) => void;
  showDeletedUI?: boolean;
}

export default function CourseCategoryList({
  categories,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
  onRestore,
  showDeletedUI = false,
}: CourseCategoryListProps) {
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);
  const [restoreConfirm, setRestoreConfirm] = React.useState<string | null>(
    null
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[var(--background)] border border-[var(--primary)]/10 rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)] animate-pulse"
          >
            <div className="h-6 bg-[var(--primary)]/10 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-[var(--primary)]/10 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-[var(--primary)]/10 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 bg-[var(--background)] border border-[var(--primary)]/10 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
        <h3 className="text-lg font-medium text-[var(--foreground)]">
          No course categories yet
        </h3>
        <p className="text-[var(--foreground)]/70 mt-2">
          Add your first course category to get started
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {categories.map((category) => (
        <div
          key={category._id}
          className={`bg-[var(--background)] border border-[var(--primary)]/10 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] overflow-hidden ${
            !category.isActive && "opacity-70"
          } ${category.isDeleted && "border-red-300"}`}
        >
          <div className="h-40 relative bg-[var(--primary)]/5">
            {category.image &&
            category.image.length > 0 &&
            category.image[0].path ? (
              <Image
                src={`${config.imageUrl}${category.image[0].path}`}
                alt={category.name}
                fill
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--primary)]/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            {showDeletedUI && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Deleted
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-[var(--foreground)]">
                {category.name}
              </h3>
              <div className="flex items-center space-x-1">
                {!showDeletedUI && (
                  <>
                    <button
                      className="text-[var(--foreground)]/70 hover:text-[var(--primary)] p-1"
                      onClick={() => onEdit(category)}
                      aria-label="Edit category"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    {deleteConfirm === category._id ? (
                      <>
                        <button
                          className="text-red-500 hover:text-red-700 p-1"
                          onClick={() => {
                            onDelete(category._id);
                            setDeleteConfirm(null);
                          }}
                          aria-label="Confirm delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          className="text-[var(--foreground)]/70 hover:text-[var(--foreground)] p-1"
                          onClick={() => setDeleteConfirm(null)}
                          aria-label="Cancel delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <button
                        className="text-[var(--foreground)]/70 hover:text-red-500 p-1"
                        onClick={() => setDeleteConfirm(category._id)}
                        aria-label="Delete category"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </>
                )}

                {showDeletedUI && onRestore && (
                  <>
                    {restoreConfirm === category._id ? (
                      <>
                        <button
                          className="text-green-500 hover:text-green-700 p-1"
                          onClick={() => {
                            onRestore(category._id);
                            setRestoreConfirm(null);
                          }}
                          aria-label="Confirm restore"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          className="text-[var(--foreground)]/70 hover:text-[var(--foreground)] p-1"
                          onClick={() => setRestoreConfirm(null)}
                          aria-label="Cancel restore"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <button
                        className="text-[var(--foreground)]/70 hover:text-green-500 p-1"
                        onClick={() => setRestoreConfirm(category._id)}
                        aria-label="Restore category"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <p className="text-sm text-[var(--foreground)]/70 mt-2 line-clamp-2">
              {category.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-[var(--foreground)]/70">
                <span className="font-medium">{category.courseCount}</span>{" "}
                {category.courseCount === 1 ? "course" : "courses"}
              </div>

              {!showDeletedUI && (
                <div className="flex items-center">
                  <span className="text-sm text-[var(--foreground)]/70 mr-2">
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={category.isActive}
                      onChange={() =>
                        onToggleActive(category._id, !category.isActive)
                      }
                      aria-label={`Toggle active state for ${category.name}`}
                    />
                    <div className="w-9 h-5 bg-[var(--input-bg)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--primary)]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
