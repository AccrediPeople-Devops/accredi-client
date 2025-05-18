"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import scheduleService from "@/app/components/service/schedule.service";
import courseService from "@/app/components/service/course.service";
import { Schedule } from "@/app/types/schedule";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import Modal from "@/app/components/Modal";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [courseNames, setCourseNames] = useState<Record<string, string>>({});

  // Fetch all schedules
  const fetchSchedules = async () => {
    setIsLoading(true);
    setError("");
    try {
      console.log("Fetching all schedules");
      const res = await scheduleService.getAllSchedules();
      console.log("Schedules response:", res);
      
      if (res && res.schedules) {
        console.log(`Got ${res.schedules.length} schedules`);
        const deletedCount = res.schedules.filter((s: Schedule) => s.isDeleted).length;
        console.log(`Including ${deletedCount} deleted schedules`);
        setSchedules(res.schedules);
      } else if (Array.isArray(res)) {
        console.log(`Got ${res.length} schedules (direct array)`);
        const deletedCount = res.filter((s: Schedule) => s.isDeleted).length;
        console.log(`Including ${deletedCount} deleted schedules`);
        setSchedules(res);
      } else {
        console.warn("Unexpected response format:", res);
        setSchedules([]);
      }
    } catch (err: any) {
      console.error("Error fetching schedules:", err);
      setError(err.response?.data?.message || "Error fetching schedules");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch course names for all schedules
  const fetchCourseNames = async () => {
    if (schedules.length === 0) return;
    
    try {
      // Get unique course IDs
      const uniqueCourseIds = [...new Set(schedules.map(schedule => schedule.courseId))];
      
      // Fetch names for each course ID
      const courseNamesMap: Record<string, string> = {};
      
      await Promise.all(
        uniqueCourseIds.map(async (courseId) => {
          try {
            const courseResponse = await courseService.getCourseById(courseId);
            if (courseResponse && courseResponse.status && courseResponse.course) {
              courseNamesMap[courseId] = courseResponse.course.title;
            } else if (courseResponse && '_id' in courseResponse) {
              const course = courseResponse as any;
              courseNamesMap[courseId] = course.title;
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
    fetchSchedules();
  }, []);

  // Fetch course names whenever schedules change
  useEffect(() => {
    fetchCourseNames();
  }, [schedules]);

  // Filter schedules based on search, status, and deleted state
  const filteredSchedules = schedules.filter((schedule) => {
    // Match search term
    const matchesSearch = searchTerm === "" || 
      (courseNames[schedule.courseId] && courseNames[schedule.courseId].toLowerCase().includes(searchTerm.toLowerCase())) ||
      (schedule.instructorName && schedule.instructorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (schedule.country && schedule.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (schedule.city && schedule.city.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Match status filter (only applies to active tab)
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && schedule.isActive) ||
      (statusFilter === "inactive" && !schedule.isActive);
    
    // Match active/deleted tab
    const matchesTab =
      (activeTab === "active" && !schedule.isDeleted) ||
      (activeTab === "deleted" && schedule.isDeleted);
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    // Check if date is invalid
    if (isNaN(date.getTime())) return "N/A";
    
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

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Format schedule type for display
  const formatScheduleType = (type: string) => {
    if (!type) return "N/A";
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ');
  };

  // Handle showing the delete confirmation modal
  const handleDeleteClick = (scheduleId: string) => {
    setScheduleToDelete(scheduleId);
    setShowDeleteModal(true);
  };

  // Handle deleting a schedule
  const confirmDelete = async () => {
    if (!scheduleToDelete) return;

    setIsDeleting(scheduleToDelete);
    setError("");
    setSuccessMessage("");

    try {
      console.log("Deleting schedule with ID:", scheduleToDelete);
      await scheduleService.deleteSchedule(scheduleToDelete);
      
      // Refresh schedules after deletion
      await fetchSchedules();
      
      setSuccessMessage("Schedule moved to deleted items");
      setShowDeleteModal(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err: any) {
      console.error("Error deleting schedule:", err);
      setError(err.response?.data?.message || "Error deleting schedule");
    } finally {
      setIsDeleting(null);
    }
  };

  // Handle toggling schedule active status
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await scheduleService.updateScheduleStatus(id, !currentStatus);
      
      // Refresh schedules after status change
      await fetchSchedules();
      
      setSuccessMessage(`Schedule ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err: any) {
      console.error("Error toggling schedule status:", err);
      setError(err.message || "An error occurred while updating schedule status");
    }
  };

  // Handle restoring a deleted schedule
  const handleRestore = async (id: string) => {
    setIsRestoring(id);
    try {
      console.log("Restoring schedule with ID:", id);
      await scheduleService.restoreSchedule(id);
      
      // Refresh schedules after restoration
      await fetchSchedules();
      
      setSuccessMessage("Schedule restored successfully");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err: any) {
      console.error("Error restoring schedule:", err);
      setError(err.response?.data?.message || "Error restoring schedule");
    } finally {
      setIsRestoring(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Schedules</h1>
          <p className="text-[var(--foreground-muted)]">
            Manage your course schedules
          </p>
        </div>
        <Link
          href="/dashboard/schedules/add"
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
          Add Schedule
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-[var(--radius-md)]">
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
            Active Schedules
          </button>
          <button
            onClick={() => setActiveTab("deleted")}
            className={`pb-3 px-1 font-medium text-sm transition-colors ${
              activeTab === "deleted"
                ? "border-b-2 border-[var(--primary)] text-[var(--foreground)]"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Deleted Schedules
          </button>
        </div>
      </div>
      
      {/* Filters */}
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
              placeholder="Search schedules..."
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
          <LoadingSpinner size="medium" text="Loading schedules..." />
        </div>
      )}

      {/* Schedules table */}
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
                    Schedule Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--background)]">
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((schedule) => (
                    <tr
                      key={schedule._id}
                      className="hover:bg-[var(--input-bg)]/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[var(--foreground)]">
                          {getCourseName(schedule.courseId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--foreground)]">
                          {formatScheduleType(schedule.scheduleType)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--foreground)]">
                          {schedule.scheduleType === "self-paced" 
                            ? "N/A" 
                            : `${formatDate(schedule.startDate)} - ${formatDate(schedule.endDate)}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--foreground)]">
                          {schedule.city && schedule.state
                            ? `${schedule.city}, ${schedule.state}, ${schedule.country}`
                            : schedule.country || "Online"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--foreground)]">
                          {formatPrice(schedule.offerPrice)}
                          {schedule.standardPrice > schedule.offerPrice && (
                            <span className="ml-2 text-xs text-[var(--foreground-muted)] line-through">
                              {formatPrice(schedule.standardPrice)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {activeTab === "active" ? (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={schedule.isActive || false}
                              onChange={() =>
                                handleToggleStatus(schedule._id, schedule.isActive || false)
                              }
                            />
                            <div className="w-11 h-6 bg-[var(--input-bg)] rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                            <span className="ml-3 text-sm text-[var(--foreground)]">
                              {schedule.isActive ? "Active" : "Inactive"}
                            </span>
                          </label>
                        ) : (
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              schedule.isActive
                                ? "bg-[var(--success)]/20 text-[var(--success)]"
                                : "bg-[var(--error)]/20 text-[var(--error)]"
                            }`}
                          >
                            {schedule.isActive ? "Active" : "Inactive"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <div className="flex space-x-2 justify-end">
                          {activeTab === "active" ? (
                            <>
                              <Link
                                href={`/dashboard/schedules/${schedule._id}`}
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
                                href={`/dashboard/schedules/edit/${schedule._id}`}
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
                                onClick={() => handleDeleteClick(schedule._id)}
                                className="text-[var(--error)] hover:text-[var(--error)]/80 transition-colors"
                                title="Delete"
                                disabled={isDeleting === schedule._id}
                              >
                                {isDeleting === schedule._id ? (
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
                              onClick={() => handleRestore(schedule._id)}
                              className="text-[var(--success)] hover:text-[var(--success)]/80 transition-colors"
                              title="Restore"
                              disabled={isRestoring === schedule._id}
                            >
                              {isRestoring === schedule._id ? (
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
                      colSpan={7}
                      className="px-6 py-10 text-center text-[var(--foreground-muted)]"
                    >
                      {activeTab === "active"
                        ? "No active schedules found matching your filters."
                        : "No deleted schedules found."}
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
        description="Are you sure you want to delete this schedule? It will be moved to the deleted items tab."
        confirmText="Delete Schedule"
        onConfirm={confirmDelete}
        isConfirming={isDeleting !== null}
        variant="danger"
      />
    </div>
  );
} 