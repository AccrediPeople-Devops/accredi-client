"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import courseLinkService from "../../../components/service/courseLink.service";
import courseService from "../../../components/service/course.service";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

interface CourseLink {
  _id: string;
  courseId: string;
  name: string;
  scheduleId: string;
  link: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CourseLinkDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [courseLink, setCourseLink] = useState<CourseLink | null>(null);
  const [courseName, setCourseName] = useState<string>("Unknown Course");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch the course link
        const response = await courseLinkService.getCourseLinkById(params.id);
        
        let fetchedCourseLink: CourseLink | null = null;
        
        if (response && response.status && response.courseLink) {
          // Standard response format
          fetchedCourseLink = response.courseLink;
        } else if (response && '_id' in response) {
          // Direct object response format
          fetchedCourseLink = response as unknown as CourseLink;
        } else {
          // Failed to find the course link
          setError(response?.message || "Failed to find the course link");
          console.error("Failed to fetch course link:", response);
          setLoading(false);
          return;
        }
        
        setCourseLink(fetchedCourseLink);
        
        // Fetch the course name
        if (fetchedCourseLink && fetchedCourseLink.courseId) {
          try {
            const courseResponse = await courseService.getCourseById(fetchedCourseLink.courseId);
            if (courseResponse && courseResponse.status && courseResponse.course) {
              setCourseName(courseResponse.course.title);
            } else if (courseResponse && '_id' in courseResponse) {
              // Alternative response format
              const course = courseResponse as any;
              setCourseName(course.title);
            }
          } catch (err) {
            console.error("Error fetching course name:", err);
          }
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!courseLink) return;

    setIsActionLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await courseLinkService.deleteCourseLink(courseLink._id);
      
      if (response && response.status) {
        setSuccessMessage("Course link deleted successfully");
        // Navigate back to the list after a short delay
        setTimeout(() => {
          router.push("/dashboard/course-links");
        }, 1500);
      } else {
        setError(response?.message || "Failed to delete course link");
      }
    } catch (err: any) {
      console.error("Error deleting course link:", err);
      setError(err.message || "An error occurred while deleting the course link");
    } finally {
      setIsActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!courseLink) return;

    setIsActionLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await courseLinkService.updateCourseLinkStatus(
        courseLink._id,
        !courseLink.isActive
      );
      
      if (response && (response.status || response._id)) {
        // Update the local state
        setCourseLink({
          ...courseLink,
          isActive: !courseLink.isActive,
        });
        
        setSuccessMessage(`Course link ${courseLink.isActive ? "deactivated" : "activated"} successfully`);
      } else {
        setError(response?.message || "Failed to update course link status");
      }
    } catch (err: any) {
      console.error("Error updating course link status:", err);
      setError(err.message || "An error occurred while updating the course link status");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRestoreClick = async () => {
    if (!courseLink) return;

    setIsActionLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await courseLinkService.restoreCourseLink(courseLink._id);
      
      if (response && (response.status || response._id)) {
        // Update the local state
        setCourseLink({
          ...courseLink,
          isDeleted: false,
        });
        
        setSuccessMessage("Course link restored successfully");
      } else {
        setError(response?.message || "Failed to restore course link");
      }
    } catch (err: any) {
      console.error("Error restoring course link:", err);
      setError(err.message || "An error occurred while restoring the course link");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="large" text="Loading course link..." />
      </div>
    );
  }

  if (!courseLink) {
    return (
      <div className="p-6 bg-[var(--background)] rounded-xl">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">Course Link Not Found</h1>
        <p className="text-[var(--foreground-muted)] mb-6">
          The course link you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/dashboard/course-links"
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors"
        >
          Back to Course Links
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="p-6 bg-[var(--background)] rounded-xl flex flex-wrap justify-between items-center">
        <div>
          <div className="flex items-center mb-1">
            <Link
              href="/dashboard/course-links"
              className="flex items-center text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Course Links
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{courseLink.name}</h1>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {!courseLink.isDeleted ? (
            <>
              <Link
                href={`/dashboard/course-links/edit/${courseLink._id}`}
                className="px-3 py-1.5 bg-[var(--primary)] text-white text-sm rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
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
                className={`px-3 py-1.5 text-sm rounded-[var(--radius-md)] transition-colors flex items-center ${
                  courseLink.isActive
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-yellow-600 text-white hover:bg-yellow-700"
                }`}
                onClick={handleStatusToggle}
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          courseLink.isActive
                            ? "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        }
                      />
                    </svg>
                    {courseLink.isActive ? "Deactivate" : "Activate"}
                  </>
                )}
              </button>
              <button
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-[var(--radius-md)] hover:bg-red-700 transition-colors flex items-center"
                onClick={handleDeleteClick}
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
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
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-[var(--radius-md)] hover:bg-blue-700 transition-colors flex items-center"
              onClick={handleRestoreClick}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
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
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Course Link Details */}
      <div className="p-6 bg-[var(--background)] rounded-xl">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Course Link Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Course</h3>
            <p className="text-[var(--foreground)]">{courseName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Link Name</h3>
            <p className="text-[var(--foreground)]">{courseLink.name}</p>
          </div>
          
          {courseLink.scheduleId && (
            <div>
              <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Schedule ID</h3>
              <p className="text-[var(--foreground)]">{courseLink.scheduleId}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Link URL</h3>
            <div className="flex items-center">
              <a 
                href={courseLink.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--primary)] hover:text-[var(--primary-hover)] truncate max-w-xs"
              >
                {courseLink.link}
              </a>
              <button
                className="ml-2 text-[var(--primary)] hover:text-[var(--primary-hover)]"
                onClick={() => {
                  navigator.clipboard.writeText(courseLink.link);
                  alert("Link copied to clipboard!");
                }}
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
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Status</h3>
            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  courseLink.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {courseLink.isActive ? "Active" : "Inactive"}
              </span>
              {courseLink.isDeleted && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Deleted
                </span>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Created</h3>
            <p className="text-[var(--foreground)]">{formatDate(courseLink.createdAt)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Last Updated</h3>
            <p className="text-[var(--foreground)]">{formatDate(courseLink.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--background)] p-6 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Confirm Delete</h2>
            <p className="text-[var(--foreground-muted)] mb-6">
              Are you sure you want to delete this course link? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] hover:bg-[var(--input-bg)] transition-colors"
                onClick={() => setShowDeleteModal(false)}
                disabled={isActionLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-[var(--radius-md)] hover:bg-red-700 transition-colors"
                onClick={confirmDelete}
                disabled={isActionLoading}
              >
                {isActionLoading ? <LoadingSpinner size="small" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 