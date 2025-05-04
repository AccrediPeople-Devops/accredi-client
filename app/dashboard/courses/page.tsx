"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Course } from "../../types/course";
import CourseService from "../../components/service/course.service";
import CourseCategoryService from "../../components/service/courseCategory.service";
import uploadService from "../../components/service/upload.service";
import config from "../../components/config/config";

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
      const res = await CourseService.getAllCourses();
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
      const res = await CourseCategoryService.getAllCourseCategories();
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
      (statusFilter === "active" && course.isActive) ||
      (statusFilter === "inactive" && !course.isActive);

    // Filter based on active tab
    const matchesTab =
      (activeTab === "active" && !course.isDeleted) ||
      (activeTab === "deleted" && course.isDeleted);

    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
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
      const courseToDeleteObj = courses.find(
        (course) => course._id === courseToDelete
      );

      // Delete any associated images first
      if (courseToDeleteObj) {
        // Handle course image deletion
        if (
          courseToDeleteObj.upload &&
          courseToDeleteObj.upload.courseImage &&
          courseToDeleteObj.upload.courseImage.length > 0
        ) {
          for (const img of courseToDeleteObj.upload.courseImage) {
            if (img.key) {
              try {
                await uploadService.deleteImage(img.key);
              } catch (error) {
                console.error(
                  `Error deleting image with key ${img.key}:`,
                  error
                );
              }
            }
          }
        }

        // Handle certificate image deletion
        if (
          courseToDeleteObj.upload &&
          courseToDeleteObj.upload.courseSampleCertificate &&
          courseToDeleteObj.upload.courseSampleCertificate.length > 0
        ) {
          for (const img of courseToDeleteObj.upload.courseSampleCertificate) {
            if (img.key) {
              try {
                await uploadService.deleteImage(img.key);
              } catch (error) {
                console.error(
                  `Error deleting certificate with key ${img.key}:`,
                  error
                );
              }
            }
          }
        }

        // Handle badge image deletion
        if (
          courseToDeleteObj.upload &&
          courseToDeleteObj.upload.courseBadge &&
          courseToDeleteObj.upload.courseBadge.length > 0
        ) {
          for (const img of courseToDeleteObj.upload.courseBadge) {
            if (img.key) {
              try {
                await uploadService.deleteImage(img.key);
              } catch (error) {
                console.error(
                  `Error deleting badge with key ${img.key}:`,
                  error
                );
              }
            }
          }
        }

        // Handle brochure deletion
        if (
          courseToDeleteObj.broucher &&
          courseToDeleteObj.broucher.length > 0
        ) {
          for (const brochure of courseToDeleteObj.broucher) {
            if (brochure.key) {
              try {
                await uploadService.deleteImage(brochure.key);
              } catch (error) {
                console.error(
                  `Error deleting brochure with key ${brochure.key}:`,
                  error
                );
              }
            }
          }
        }
      }

      // Now delete the course
      await CourseService.deleteCourse(courseToDelete);

      // Refresh the course list
      await fetchCourses();

      setShowDeleteModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting course");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleActive = async (courseId: string, isActive: boolean) => {
    try {
      // Call the API to update the course status
      await CourseService.updateCourseStatus(courseId, isActive);

      // Update the local state to reflect the change
      setCourses(
        courses.map((course) =>
          course._id === courseId ? { ...course, isActive } : course
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Error updating course status");
    }
  };

  // Add function to handle course restore
  const handleRestoreCourse = async (courseId: string) => {
    setIsRestoring(courseId);
    try {
      await CourseService.restoreCourse(courseId);

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
      <div className="p-6 bg-[#2A2A2A] rounded-xl flex flex-wrap justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Courses</h1>
          <p className="text-[#D7BDE2]">Manage your course catalog</p>
        </div>
        <Link
          href="/dashboard/courses/add"
          className="px-4 py-2 bg-[#5B2C6F] text-white rounded-lg hover:bg-[#5B2C6F]/90 transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
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
        <div className="p-4 bg-red-900 border border-red-700 text-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-[#2A2A2A] rounded-xl p-4 flex space-x-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "active"
              ? "bg-[#5B2C6F] text-white"
              : "bg-[#3A3A55] text-gray-300"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active Courses
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "deleted"
              ? "bg-[#5B2C6F] text-white"
              : "bg-[#3A3A55] text-gray-300"
          }`}
          onClick={() => setActiveTab("deleted")}
        >
          Deleted Courses
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#2A2A2A] rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-white">
              Search
            </label>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-[#2A2A2A] text-white border border-[#3A3A55] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B2C6F]"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-white">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-[#2A2A2A] text-white border border-[#3A3A55] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B2C6F]"
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
            <label className="block mb-2 text-sm font-medium text-white">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-[#2A2A2A] text-white border border-[#3A3A55] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B2C6F]"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course list */}
      <div className="bg-[#2A2A2A] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-10 text-center text-white">
              <div className="animate-spin mx-auto w-8 h-8 border-4 border-[#5B2C6F] border-t-transparent rounded-full mb-4"></div>
              <p>Loading courses...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-[#3A3A55]">
              <thead className="bg-[#2D2D44]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A3A55] bg-[#2A2A2A]">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <tr
                      key={course._id}
                      className="hover:bg-[#2D2D44] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                            {course.upload?.courseImage &&
                            course.upload.courseImage.length > 0 &&
                            course.upload.courseImage[0].path ? (
                              <Image
                                src={`${config.imageUrl}${course.upload.courseImage[0].path}`}
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
                            <div className="text-sm font-medium text-white">
                              {course.title}
                            </div>
                            <div className="text-xs text-[#D7BDE2] truncate max-w-xs">
                              {course.shortDescription}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {getCategoryName(course.categoryId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {formatDate(course.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {activeTab === "active" ? (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={course.isActive}
                              onChange={() =>
                                handleToggleActive(course._id, !course.isActive)
                              }
                            />
                            <div className="w-11 h-6 bg-[#3A3A55] rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5B2C6F]"></div>
                            <span className="ml-3 text-sm text-white">
                              {course.isActive ? "Active" : "Inactive"}
                            </span>
                          </label>
                        ) : (
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              course.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {course.isActive ? "Active" : "Inactive"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {activeTab === "active" ? (
                            <>
                              <Link
                                href={`/dashboard/courses/${course._id}`}
                                className="text-indigo-400 hover:text-indigo-200 transition-colors"
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
                                className="text-blue-400 hover:text-blue-200 transition-colors"
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
                                className="text-red-400 hover:text-red-200 transition-colors"
                                title="Delete"
                                disabled={isDeleting === course._id}
                              >
                                {isDeleting === course._id ? (
                                  <svg
                                    className="animate-spin h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
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
                              className="text-green-400 hover:text-green-200 transition-colors"
                              title="Restore"
                              disabled={isRestoring === course._id}
                            >
                              {isRestoring === course._id ? (
                                <svg
                                  className="animate-spin h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
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
                      className="px-6 py-10 text-center text-white"
                    >
                      {activeTab === "active"
                        ? "No active courses found matching your filters."
                        : "No deleted courses found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#2A2A2A] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-white mb-6">
              Are you sure you want to delete this course? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-transparent border border-[#5B2C6F] text-white rounded-lg hover:bg-[#5B2C6F]/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting !== null}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                {isDeleting !== null ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Course"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
