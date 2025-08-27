"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/app/types/course";
import courseService from "@/app/components/service/course.service";
import courseCategoryService from "@/app/components/service/courseCategory.service";
import uploadService from "@/app/components/service/upload.service";
import config from "@/app/components/config/config";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import Modal from "@/app/components/Modal";

interface CategoryType {
  id: string;
  name: string;
}

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await courseService.getAllCourses();
      console.log("Courses fetched:", res);
      if (res?.courses) {
        setCourses(res.courses);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching courses");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await courseCategoryService.getAllCourseCategories();
      if (res?.courseCategories) {
        setCategories(
          res.courseCategories
            .filter(
              (cat: any) => cat.isActive === true && cat.isDeleted === false
            )
            .map((cat: any) => ({ id: cat._id, name: cat.name }))
        );
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  // Filter courses based on search, category, status, and deleted state
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || course.categoryId === selectedCategory;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && (course.isActive ?? false)) ||
      (statusFilter === "inactive" && !(course.isActive ?? false));

    // Filter based on active tab
    const matchesTab =
      (activeTab === "active" && !(course.isDeleted ?? false)) ||
      (activeTab === "deleted" && (course.isDeleted ?? false));

    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  const getCategoryName = (categoryId: string | any) => {
    // Handle both string and object types
    const categoryIdString =
      typeof categoryId === "string"
        ? categoryId
        : categoryId?._id || categoryId?.id;
    const category = categories.find((cat) => cat.id === categoryIdString);
    return category ? category.name : "Unknown";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteClick = (courseId: string) => {
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;

    setIsDeleting(courseToDelete);

    try {
      console.log("=== DELETE OPERATION START ===");
      console.log("Course ID to delete:", courseToDelete);

      // Find the course in our current list to verify it exists
      const courseToDeleteObj = courses.find((c) => c._id === courseToDelete);
      console.log("Course object found:", courseToDeleteObj);

      if (!courseToDeleteObj) {
        throw new Error("Course not found in current list");
      }

      // Use the same updateCourse approach that works in the edit page
      console.log("Attempting soft delete with updateCourse...");
      const updateResult = await courseService.updateCourse(courseToDelete, {
        isDeleted: true,
      });
      console.log("Soft delete successful, result:", updateResult);

      // Refresh the courses data to get the latest state
      console.log("Refreshing courses data...");
      await fetchCourses();
      console.log("Courses data refreshed successfully");

      setShowDeleteModal(false);
      console.log("=== DELETE OPERATION SUCCESS ===");
    } catch (err: any) {
      console.log("=== DELETE OPERATION FAILED ===");
      console.error("Delete failed:", err);
      console.error("Error message:", err.message);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error config URL:", err.config?.url);
      console.error("Error config method:", err.config?.method);
      console.error("Error config data:", err.config?.data);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error deleting course. Please try again."
      );
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleActive = async (courseId: string, isActive: boolean) => {
    try {
      console.log("=== TOGGLE OPERATION START ===");
      console.log("Course ID:", courseId);
      console.log("New isActive value:", isActive);

      // Find the course in our current list to verify it exists
      const courseObj = courses.find((c) => c._id === courseId);
      console.log("Course object found:", courseObj);
      console.log("Current isActive value:", courseObj?.isActive);

      if (!courseObj) {
        throw new Error("Course not found in current list");
      }

      // Use the same updateCourse approach that works in the edit page
      console.log("Calling updateCourse API with isActive...");
      const response = await courseService.updateCourse(courseId, {
        isActive: isActive,
      });
      console.log("Toggle API response:", response);

      // Refresh the courses data to ensure we have the latest state from the server
      console.log("Refreshing courses data after toggle...");
      await fetchCourses();
      console.log("Courses data refreshed successfully");
      console.log("=== TOGGLE OPERATION SUCCESS ===");
    } catch (err: any) {
      console.log("=== TOGGLE OPERATION FAILED ===");
      console.error("Error updating course status:", err);
      console.error("Error message:", err.message);
      console.error("Toggle error response:", err.response?.data);
      console.error("Toggle error status:", err.response?.status);
      console.error("Toggle error config URL:", err.config?.url);
      console.error("Toggle error config method:", err.config?.method);
      console.error("Toggle error config data:", err.config?.data);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error updating course status. Please try again."
      );
    }
  };

  // Add function to handle course restore
  const handleRestoreCourse = async (courseId: string) => {
    setIsRestoring(courseId);
    try {
      await courseService.restoreCourse(courseId);

      // Refresh courses data instead of trying to update local state
      await fetchCourses();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error restoring course");
    } finally {
      setIsRestoring(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Courses
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Manage your course catalog
          </p>
        </div>
        <Link
          href="/dashboard/courses/add"
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] flex items-center gap-2 hover:bg-[var(--primary)]/90 transition-colors"
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
          Add New Course
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Tabs for Active/Deleted */}
      <div className="border-b border-[var(--border)]">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 px-1 font-medium text-sm transition-colors ${
              activeTab === "active"
                ? "border-b-2 border-[var(--primary)] text-[var(--foreground)]"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Active Courses
          </button>
          <button
            onClick={() => setActiveTab("deleted")}
            className={`pb-3 px-1 font-medium text-sm transition-colors ${
              activeTab === "deleted"
                ? "border-b-2 border-[var(--primary)] text-[var(--foreground)]"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Deleted Courses
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[var(--foreground-muted)]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 w-full bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 w-full bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner size="medium" text="Loading courses..." />
        </div>
      )}

      {/* Course list */}
      {!isLoading && (
        <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border)]">
              <thead className="bg-[var(--input-bg)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--background)]">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <tr
                      key={course._id}
                      className="hover:bg-[var(--input-bg)]/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-[var(--radius-md)] overflow-hidden flex-shrink-0">
                            {course.upload?.courseImage &&
                            course.upload.courseImage.length > 0 &&
                            course.upload.courseImage[0].path ? (
                              <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://148.135.137.229:3000'}/${course.upload.courseImage[0].path}`}
                                alt={course.title}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Image
                                src="/placeholder.png"
                                alt={course.title}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[var(--foreground)]">
                              {course.title}
                            </div>
                            <div className="text-xs text-[var(--foreground-muted)] truncate max-w-xs">
                              {course.shortDescription}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--foreground)]">
                          {getCategoryName(course.categoryId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--foreground)]">
                          {formatDate(course.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {activeTab === "active" ? (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={course.isActive ?? false}
                              onChange={() =>
                                handleToggleActive(
                                  course._id,
                                  !(course.isActive ?? false)
                                )
                              }
                            />
                            <div className="w-11 h-6 bg-[var(--input-bg)] rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                            <span className="ml-3 text-sm text-[var(--foreground)]">
                              {course.isActive ?? false ? "Active" : "Inactive"}
                            </span>
                          </label>
                        ) : (
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              course.isActive ?? false
                                ? "bg-[var(--success)]/20 text-[var(--success)]"
                                : "bg-[var(--error)]/20 text-[var(--error)]"
                            }`}
                          >
                            {course.isActive ?? false ? "Active" : "Inactive"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {activeTab === "active" ? (
                            <>
                              <Link
                                href={`/dashboard/courses/${course._id}`}
                                className="text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
                                title="View"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
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
                              </Link>
                              <Link
                                href={`/dashboard/courses/edit/${course._id}`}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                title="Edit"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
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
                              </Link>
                              <button
                                onClick={() => handleDeleteClick(course._id)}
                                className="text-[var(--error)] hover:text-[var(--error)]/80 transition-colors"
                                title="Delete"
                                disabled={isDeleting === course._id}
                              >
                                {isDeleting === course._id ? (
                                  <LoadingSpinner size="small" />
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
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
                                )}
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleRestoreCourse(course._id)}
                              className="text-[var(--success)] hover:text-[var(--success)]/80 transition-colors"
                              title="Restore"
                              disabled={isRestoring === course._id}
                            >
                              {isRestoring === course._id ? (
                                <LoadingSpinner size="small" />
                              ) : (
                                <div className="flex items-center">
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
                                </div>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-[var(--foreground-muted)]"
                    >
                      {activeTab === "active"
                        ? "No active courses found matching your filters."
                        : "No deleted courses found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        description="Are you sure you want to delete this course? This action cannot be undone."
        confirmText="Delete Course"
        onConfirm={confirmDelete}
        isConfirming={isDeleting !== null}
        variant="danger"
      />
    </div>
  );
}
