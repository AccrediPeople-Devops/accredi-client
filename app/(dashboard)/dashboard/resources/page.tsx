"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import resourceService from "@/app/components/service/resource.service";
import courseService from "@/app/components/service/course.service";
import { formatDate } from "@/app/utils/dateUtils";

interface ResourceFile {
  url: string;
  key: string;
  path?: string;
  _id?: string;
}

interface ResourceItem {
  title: string;
  description: string;
  file: ResourceFile[];
  _id?: string;
}

interface Resource {
  _id: string;
  courseId: string;
  content: ResourceItem[];
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Course {
  _id: string;
  title: string;
}

export default function ResourcesPage() {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [courses, setCourses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [activeTab, setActiveTab] = useState("active");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
    fetchCourses();
  }, []);

  const fetchResources = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await resourceService.getAllResources();
      if (response && response.resources) {
        setResources(response.resources);
      } else if (Array.isArray(response)) {
        setResources(response);
      } else {
        setError("Failed to load resources. Invalid response format.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load resources");
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
    }
  };

  const handleDeleteClick = (resourceId: string) => {
    setResourceToDelete(resourceId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!resourceToDelete) return;

    setIsDeleting(resourceToDelete);

    try {
      await resourceService.deleteResource(resourceToDelete);
      setResources(resources.map(resource => 
        resource._id === resourceToDelete ? { ...resource, isDeleted: true } : resource
      ));
      setShowDeleteModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting resource");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleRestore = async (id: string) => {
    setIsRestoring(id);
    try {
      await resourceService.restoreResource(id);
      setResources(prevResources => 
        prevResources.map(resource => 
          resource._id === id 
            ? { ...resource, isDeleted: false } 
            : resource
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Error restoring resource");
    } finally {
      setIsRestoring(null);
    }
  };

  const getCourseName = (courseId: string): string => {
    return courses[courseId] || "Unknown Course";
  };

  const countResourceItems = (resource: Resource): number => {
    return resource.content ? resource.content.length : 0;
  };

  const filteredResources = resources.filter(resource => {
    // Filter by search term
    const searchMatch = 
      (resource.courseId && getCourseName(resource.courseId).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (resource.content && resource.content.some(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    // Filter by status
    let statusMatch = true;
    if (selectedStatus === "active") {
      statusMatch = resource.isActive !== false;
    } else if (selectedStatus === "inactive") {
      statusMatch = resource.isActive === false;
    }
    
    // Filter by course
    let courseMatch = true;
    if (selectedCourse !== "all") {
      courseMatch = resource.courseId === selectedCourse;
    }
    
    // Filter by tab (active or deleted)
    const matchesTab = 
      (activeTab === "active" && !resource.isDeleted) ||
      (activeTab === "deleted" && resource.isDeleted);
    
    return searchMatch && statusMatch && courseMatch && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Course Resources</h1>
          <p className="text-[var(--foreground-muted)]">
            Manage learning resources for courses
          </p>
        </div>
        <Link
          href="/dashboard/resources/add"
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
          Add Resources
        </Link>
      </div>

      {/* Error message */}
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
            Active Resources
          </button>
          <button
            onClick={() => setActiveTab("deleted")}
            className={`pb-3 px-1 font-medium text-sm transition-colors ${
              activeTab === "deleted"
                ? "border-b-2 border-[var(--primary)] text-[var(--foreground)]"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Deleted Resources
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
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        <div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 w-full bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">All Courses</option>
            {Object.entries(courses).map(([id, title]) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 w-full bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner size="medium" text="Loading resources..." />
        </div>
      ) : (
        <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border)]">
              <thead className="bg-[var(--input-bg)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Resources
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Updated
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
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <tr
                      key={resource._id}
                      className="hover:bg-[var(--input-bg)]/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[var(--foreground)]">
                          {getCourseName(resource.courseId)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="font-medium text-[var(--foreground)]">{countResourceItems(resource)}</span>
                          <span className="ml-2 text-[var(--foreground-muted)]">items</span>
                        </div>
                        {resource.content && resource.content.length > 0 && (
                          <div className="mt-1 text-xs text-[var(--foreground-muted)] truncate max-w-xs">
                            {resource.content.map(item => item.title).join(", ")}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--foreground)]">
                          {resource.createdAt ? formatDate(resource.createdAt) : "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--foreground)]">
                          {resource.updatedAt ? formatDate(resource.updatedAt) : "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            resource.isActive === false
                              ? "bg-[var(--error)]/20 text-[var(--error)]"
                              : "bg-[var(--success)]/20 text-[var(--success)]"
                          }`}
                        >
                          {resource.isActive === false ? "Inactive" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {activeTab === "active" ? (
                            <>
                              <Link
                                href={`/dashboard/resources/details/${resource._id}`}
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
                                href={`/dashboard/resources/edit/${resource._id}`}
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
                                onClick={() => handleDeleteClick(resource._id)}
                                className="text-[var(--error)] hover:text-[var(--error)]/80 transition-colors"
                                title="Delete"
                                disabled={isDeleting === resource._id}
                              >
                                {isDeleting === resource._id ? (
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
                              onClick={() => handleRestore(resource._id)}
                              className="text-[var(--success)] hover:text-[var(--success)]/80 transition-colors"
                              title="Restore"
                              disabled={isRestoring === resource._id}
                            >
                              {isRestoring === resource._id ? (
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
                      colSpan={6}
                      className="px-6 py-10 text-center text-[var(--foreground-muted)]"
                    >
                      {activeTab === "active"
                        ? "No active resources found matching your filters."
                        : "No deleted resources found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[var(--background)] rounded-[var(--radius-lg)] p-6 max-w-md w-full shadow-[var(--shadow-lg)]">
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">
              Confirm Delete
            </h3>
            <p className="text-[var(--foreground)] mb-6">
              Are you sure you want to delete this resource? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-transparent border border-[var(--border)] text-[var(--foreground)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting !== null}
                className="px-4 py-2 bg-[var(--error)] text-white rounded-[var(--radius-md)] hover:bg-[var(--error)]/90 transition-colors flex items-center"
              >
                {isDeleting !== null ? (
                  <>
                    <LoadingSpinner size="small" className="-ml-1 mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete Resource"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 