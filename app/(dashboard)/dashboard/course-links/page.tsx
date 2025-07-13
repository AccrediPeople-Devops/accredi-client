"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import courseLinkService from "@/app/components/service/courseLink.service";
import courseService from "@/app/components/service/course.service";
import { CourseLink } from "@/app/types/courseLink";
import { Course } from "@/app/types/course";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import Modal from "@/app/components/Modal";

export default function CourseLinksPage() {
  const [courseLinks, setCourseLinks] = useState<CourseLink[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseLinkToDelete, setCourseLinkToDelete] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [courseNames, setCourseNames] = useState<Record<string, string>>({});

  // Fetch all course links
  const fetchCourseLinks = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await courseLinkService.getAllCourseLinks();
      
      if (res && res.courseLinks && Array.isArray(res.courseLinks)) {
        setCourseLinks(res.courseLinks);
      } else if (Array.isArray(res)) {
        setCourseLinks(res);
      } else {
        console.warn("Unexpected response format:", res);
        setCourseLinks([]);
      }
    } catch (err: any) {
      setError(err.message || "Error fetching course links");
      setCourseLinks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch course names for all course links
  const fetchCourseNames = async () => {
    if (courseLinks.length === 0) return;
    
    try {
      // Get unique course IDs
      const uniqueCourseIds = [...new Set(courseLinks.map(link => link.courseId))];
      
      // Fetch names for each course ID
      const courseNamesMap: Record<string, string> = {};
      
      await Promise.all(
        uniqueCourseIds.map(async (courseId) => {
          try {
            const courseResponse = await courseService.getCourseById(courseId);
            if (courseResponse && courseResponse.status && courseResponse.course) {
              courseNamesMap[courseId] = courseResponse.course.title;
            } else if (courseResponse && typeof courseResponse === 'object' && '_id' in courseResponse) {
              // Handle the case where the response is a direct course object
              const courseObj = courseResponse as any;
              courseNamesMap[courseId] = courseObj.title;
            } else {
              courseNamesMap[courseId] = "Unknown Course";
            }
          } catch (err) {
            console.error(`Error fetching course name for ID ${courseId}:`, err);
            courseNamesMap[courseId] = "Unknown Course";
          }
        })
      );
      
      setCourseNames(courseNamesMap);
    } catch (err) {
      console.error("Error fetching course names:", err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchCourseLinks();
  }, []);

  // Fetch course names whenever course links change
  useEffect(() => {
    fetchCourseNames();
  }, [courseLinks]);

  // Filter course links based on search, status, and deleted state
  const filteredCourseLinks = courseLinks.filter((link) => {
    // Match search term
    const matchesSearch = searchTerm === "" || 
      link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.link.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (courseNames[link.courseId] && courseNames[link.courseId].toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Match status filter (only applies to active tab)
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && link.isActive) ||
      (statusFilter === "inactive" && !link.isActive);
    
    // Match active/deleted tab
    const matchesTab =
      (activeTab === "active" && !link.isDeleted) ||
      (activeTab === "deleted" && link.isDeleted);
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Get course name by ID
  const getCourseName = (courseId: string) => {
    return courseNames[courseId] || "Unknown Course";
  };

  // Handle showing the delete confirmation modal
  const handleDeleteClick = (courseLinkId: string) => {
    setCourseLinkToDelete(courseLinkId);
    setShowDeleteModal(true);
  };

  // Handle deleting a course link
  const confirmDelete = async () => {
    if (!courseLinkToDelete) return;

    setIsDeleting(courseLinkToDelete);
    setError("");
    setSuccessMessage("");

    try {
      await courseLinkService.deleteCourseLink(courseLinkToDelete);
      
      // Refresh course links after deletion
      await fetchCourseLinks();
      
      setSuccessMessage("Course link moved to deleted items");
      setShowDeleteModal(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err: any) {
      console.error("Error deleting course link:", err);
      setError(err.message || "Error deleting course link");
    } finally {
      setIsDeleting(null);
    }
  };

  // Handle toggling course link active status
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsUpdatingStatus(id);
    setError("");
    setSuccessMessage("");

    try {
      await courseLinkService.updateCourseLinkStatus(id, !currentStatus);
      
      // Refresh course links after status change
      await fetchCourseLinks();
      
      setSuccessMessage(`Course link ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err: any) {
      console.error("Error updating course link status:", err);
      setError(err.message || "Error updating course link status");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Handle restoring a deleted course link
  const handleRestore = async (id: string) => {
    setIsRestoring(id);
    setError("");
    setSuccessMessage("");

    try {
      await courseLinkService.restoreCourseLink(id);
      
      // Refresh course links after restoration
      await fetchCourseLinks();
      
      setSuccessMessage("Course link restored successfully");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err: any) {
      console.error("Error restoring course link:", err);
      setError(err.message || "Error restoring course link");
    } finally {
      setIsRestoring(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Course Links</h1>
          <p className="text-[var(--foreground-muted)]">
            Manage links to your courses
          </p>
        </div>
        <Link
          href="/dashboard/course-links/add"
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
          Add New Course Link
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-[var(--success)]/10 border border-[var(--success)]/30 text-[var(--success)] rounded-[var(--radius-md)]">
          {successMessage}
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
            Active Course Links
          </button>
          <button
            onClick={() => setActiveTab("deleted")}
            className={`pb-3 px-1 font-medium text-sm transition-colors ${
              activeTab === "deleted"
                ? "border-b-2 border-[var(--primary)] text-[var(--foreground)]"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Deleted Course Links
          </button>
        </div>
      </div>

      {/* Filters - Only show status filter on Active tab */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Search course links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        {activeTab === "active" && (
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
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner size="medium" text="Loading course links..." />
        </div>
      )}

      {/* Course links list */}
      {!isLoading && (
        <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border)]">
              <thead className="bg-[var(--input-bg)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Link
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
                {filteredCourseLinks.length > 0 ? (
                  filteredCourseLinks.map((link) => (
                    <tr key={link._id} className="hover:bg-[var(--input-bg)]/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--foreground)]">{link.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--foreground)]">{getCourseName(link.courseId)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[var(--foreground)]">
                          <a 
                            href={link.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[var(--primary)] hover:underline truncate block max-w-xs"
                          >
                            {link.link}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--foreground-muted)]">{formatDate(link.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            link.isActive
                              ? "bg-[var(--success)]/10 text-[var(--success)]"
                              : "bg-[var(--warning)]/10 text-[var(--warning)]"
                          }`}
                        >
                          {link.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground-muted)]">
                        <div className="flex space-x-2">
                          {activeTab === "active" ? (
                            <>
                              <Link
                                href={`/dashboard/course-links/edit/${link._id}`}
                                className="text-[var(--primary)] hover:text-[var(--primary-hover)]"
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
                                onClick={() => handleToggleStatus(link._id, link.isActive || false)}
                                className={`${
                                  isUpdatingStatus === link._id
                                    ? "opacity-50 cursor-wait"
                                    : link.isActive
                                    ? "text-[var(--warning)] hover:text-[var(--warning-hover)]"
                                    : "text-[var(--success)] hover:text-[var(--success-hover)]"
                                }`}
                                disabled={isUpdatingStatus === link._id}
                                title={link.isActive ? "Deactivate" : "Activate"}
                              >
                                {isUpdatingStatus === link._id ? (
                                  <LoadingSpinner size="small" />
                                ) : link.isActive ? (
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
                                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
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
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteClick(link._id)}
                                className="text-[var(--error)] hover:text-[var(--error-hover)]"
                                title="Delete"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleRestore(link._id)}
                              className={`text-[var(--success)] hover:text-[var(--success-hover)] ${
                                isRestoring === link._id && "opacity-50 cursor-wait"
                              }`}
                              disabled={isRestoring === link._id}
                              title="Restore"
                            >
                              {isRestoring === link._id ? (
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
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-[var(--foreground-muted)]">
                      {activeTab === "active"
                        ? "No active course links found"
                        : "No deleted course links found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--background)] rounded-[var(--radius-lg)] p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              Confirm Deletion
            </h3>
            <p className="mt-2 text-[var(--foreground-muted)]">
              Are you sure you want to delete this course link? It will be moved to the deleted items.
            </p>
            <div className="mt-4 flex space-x-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-[var(--background-muted)] text-[var(--foreground)] rounded-[var(--radius-md)] hover:bg-[var(--background-muted)]/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`px-4 py-2 bg-[var(--error)] text-white rounded-[var(--radius-md)] hover:bg-[var(--error)]/90 transition-colors ${
                  isDeleting && "opacity-50 cursor-wait"
                }`}
                disabled={!!isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 