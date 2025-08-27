"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import scheduleService from "@/app/components/service/schedule.service";
import courseService from "@/app/components/service/course.service";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { Schedule } from "@/app/types/schedule";
import { formatDate, parseDateLocal } from "@/app/utils/dateUtils";

// Client component for the schedule details
function ScheduleDetails({ id }: { id: string }) {
  const router = useRouter();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
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
        // Fetch the schedule
        const response = await scheduleService.getScheduleById(id);
        
        let fetchedSchedule: Schedule | null = null;
        
        if (response && response.status && response.schedule) {
          // Standard response format
          fetchedSchedule = response.schedule;
        } else if (response && '_id' in response) {
          // Direct object response format
          fetchedSchedule = response as unknown as Schedule;
        } else {
          // Failed to find the schedule
          setError(response?.message || "Failed to find the schedule");
          console.error("Failed to fetch schedule:", response);
          setLoading(false);
          return;
        }
        
        setSchedule(fetchedSchedule);
        
        // Fetch the course name
        if (fetchedSchedule && fetchedSchedule.courseId) {
          try {
            const courseResponse = await courseService.getCourseById(fetchedSchedule.courseId);
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
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = parseDateLocal(dateString);
    if (!date) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatScheduleType = (type: string) => {
    if (!type) return "N/A";
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ');
  };

  const getDayName = (day: string) => {
    const daysMap: Record<string, string> = {
      "1": "Monday",
      "2": "Tuesday",
      "3": "Wednesday",
      "4": "Thursday",
      "5": "Friday",
      "6": "Saturday",
      "7": "Sunday",
    };
    return daysMap[day] || day;
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!schedule) return;

    setIsActionLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await scheduleService.deleteSchedule(schedule._id);
      
      if (response && response.status) {
        setSuccessMessage("Schedule deleted successfully");
        // Navigate back to the list after a short delay
        setTimeout(() => {
          router.push("/dashboard/schedules");
        }, 1500);
      } else {
        setError(response?.message || "Failed to delete schedule");
      }
    } catch (err: any) {
      console.error("Error deleting schedule:", err);
      setError(err.message || "An error occurred while deleting the schedule");
    } finally {
      setIsActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!schedule) return;

    setIsActionLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await scheduleService.updateScheduleStatus(
        schedule._id,
        !schedule.isActive
      );
      
      if (response && (response.status || response._id)) {
        // Update the local state
        setSchedule({
          ...schedule,
          isActive: !schedule.isActive,
        });
        
        setSuccessMessage(`Schedule ${schedule.isActive ? "deactivated" : "activated"} successfully`);
      } else {
        setError(response?.message || "Failed to update schedule status");
      }
    } catch (err: any) {
      console.error("Error updating schedule status:", err);
      setError(err.message || "An error occurred while updating the schedule status");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRestoreClick = async () => {
    if (!schedule) return;

    setIsActionLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      console.log("DetailPage: Attempting to restore schedule with ID:", schedule._id);
      const response = await scheduleService.restoreSchedule(schedule._id);
      console.log("DetailPage: Restore response:", response);
      
      // Check for successful restoration in various response formats
      const isSuccess = 
        (response && response.status === true) || 
        (response && response._id) || 
        (response && response.schedule && response.schedule._id);
      
      if (isSuccess) {
        console.log("DetailPage: Restore successful, updating UI");
        // Update the local state
        setSchedule({
          ...schedule,
          isDeleted: false,
        });
        
        setSuccessMessage("Schedule restored successfully");
      } else {
        console.error("DetailPage: Restore failed with response:", response);
        
        // Try a fallback approach - refresh the schedule data
        try {
          console.log("DetailPage: Attempting fallback - refreshing schedule data");
          const refreshedData = await scheduleService.getScheduleById(schedule._id);
          
          if (refreshedData && refreshedData.schedule) {
            // If the refreshed data shows the schedule as not deleted, consider it a success
            if (!refreshedData.schedule.isDeleted) {
              console.log("DetailPage: Schedule appears to be restored based on refreshed data");
              setSchedule(refreshedData.schedule);
              setSuccessMessage("Schedule restored successfully");
              setIsActionLoading(false);
              return;
            }
          }
        } catch (refreshError) {
          console.error("DetailPage: Fallback refresh failed:", refreshError);
        }
        
        setError(response?.message || "Failed to restore schedule. Please try again.");
      }
    } catch (err: any) {
      console.error("DetailPage: Error restoring schedule:", err);
      if (err.response) {
        console.error("DetailPage: Server response:", {
          status: err.response.status, 
          data: err.response.data
        });
      }
      setError(err.message || "An error occurred while restoring the schedule. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="large" text="Loading schedule..." />
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="p-6 bg-[var(--background)] rounded-xl">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">Schedule Not Found</h1>
        <p className="text-[var(--foreground-muted)] mb-6">
          The schedule you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/dashboard/schedules"
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors"
        >
          Back to Schedules
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
              href="/dashboard/schedules"
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
              Back to Schedules
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{courseName} Schedule</h1>
          <p className="text-[var(--foreground-muted)]">{formatScheduleType(schedule.scheduleType)}</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {!schedule.isDeleted ? (
            <>
              <Link
                href={`/dashboard/schedules/edit/${schedule._id}`}
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
                  schedule.isActive
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
                          schedule.isActive
                            ? "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        }
                      />
                    </svg>
                    {schedule.isActive ? "Deactivate" : "Activate"}
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

      {/* Schedule Details */}
      <div className="p-6 bg-[var(--background)] rounded-xl">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Schedule Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Course</h3>
            <p className="text-[var(--foreground)]">{courseName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Schedule Type</h3>
            <p className="text-[var(--foreground)]">{formatScheduleType(schedule.scheduleType)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Dates</h3>
            <p className="text-[var(--foreground)]">
              {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Days</h3>
            <p className="text-[var(--foreground)]">
              {schedule.days.map(day => getDayName(day)).join(", ")}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Week Type</h3>
            <p className="text-[var(--foreground)]">
              {schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1)}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Access Type</h3>
            <p className="text-[var(--foreground)]">
              {schedule.accessType === "lifetime" ? "Lifetime" : `${schedule.accessType} Days`}
            </p>
          </div>
          
          {schedule.instructorName && (
            <div>
              <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Instructor</h3>
              <p className="text-[var(--foreground)]">{schedule.instructorName}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Location</h3>
            <p className="text-[var(--foreground)]">
              {schedule.city && schedule.state
                ? `${schedule.city}, ${schedule.state}, ${schedule.country}`
                : schedule.country}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Standard Price</h3>
            <p className="text-[var(--foreground)]">{formatPrice(schedule.standardPrice)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Offer Price</h3>
            <p className="text-[var(--foreground)]">{formatPrice(schedule.offerPrice)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Status</h3>
            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  schedule.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {schedule.isActive ? "Active" : "Inactive"}
              </span>
              {schedule.isDeleted && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Deleted
                </span>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Created</h3>
            <p className="text-[var(--foreground)]">{formatDate(schedule.createdAt)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Last Updated</h3>
            <p className="text-[var(--foreground)]">{formatDate(schedule.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--background)] p-6 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Confirm Delete</h2>
            <p className="text-[var(--foreground-muted)] mb-6">
              Are you sure you want to delete this schedule? This action cannot be undone.
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

// Main page component
export default function ScheduleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ScheduleDetails id={id} />;
} 