"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import scheduleService from "@/app/components/service/schedule.service";
import courseService from "@/app/components/service/course.service";
import { Schedule } from "@/app/types/schedule";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import Modal from "@/app/components/Modal";
import { formatDate, parseDateLocal } from "@/app/utils/dateUtils";
import { ListPageControls, Pagination } from "@/app/components/ListPageControls";
import { EnhancedLocationService } from "@/app/components/service/enhancedLocationData";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("startDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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
      const res = await scheduleService.getAllSchedules();

      if (res && res.schedules) {
        setSchedules(res.schedules);
      } else if (Array.isArray(res)) {
        setSchedules(res);
      } else {
        setSchedules([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching schedules");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await courseService.getAllCourses();
      if (res && res.courses) {
        setCourses(res.courses);
      } else if (Array.isArray(res)) {
        setCourses(res);
      } else {
        setCourses([]);
      }
    } catch (err: any) {
      console.error("Error fetching courses:", err);
    }
  };

  // Fetch countries
  const fetchCountries = () => {
    try {
      const allCountries = EnhancedLocationService.getAllCountries();
      setCountries(allCountries);
    } catch (err: any) {
      console.error("Error fetching countries:", err);
    }
  };

  // Fetch course names for all schedules
  const fetchCourseNames = async () => {
    if (schedules.length === 0) return;

    try {
      // Get unique course IDs
      const uniqueCourseIds = [
        ...new Set(schedules.map((schedule) => schedule.courseId)),
      ];

      // Fetch names for each course ID
      const courseNamesMap: Record<string, string> = {};

      await Promise.all(
        uniqueCourseIds.map(async (courseId) => {
          try {
            const courseResponse = await courseService.getCourseById(courseId);
            if (
              courseResponse &&
              courseResponse.status &&
              courseResponse.course
            ) {
              courseNamesMap[courseId] = courseResponse.course.title;
            } else if (courseResponse && "_id" in courseResponse) {
              const course = courseResponse as any;
              courseNamesMap[courseId] = course.title;
            } else {
              courseNamesMap[courseId] = "Unknown Course";
            }
          } catch (err) {
            courseNamesMap[courseId] = "Unknown Course";
          }
        })
      );

      setCourseNames(courseNamesMap);
    } catch (err) {
    }
  };

  // Initial data load
  useEffect(() => {
    fetchSchedules();
    fetchCourses();
    fetchCountries();
  }, []);

  // Fetch course names whenever schedules change
  useEffect(() => {
    fetchCourseNames();
  }, [schedules]);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCountry, selectedCourse, statusFilter, activeTab]);

  // Filter and sort schedules
  const filteredSchedules = useMemo(() => {
    let filtered = schedules.filter((schedule) => {
      // Match search term
      const matchesSearch =
        searchTerm === "" ||
        (courseNames[schedule.courseId] &&
          courseNames[schedule.courseId]
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (schedule.instructorName &&
          schedule.instructorName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (schedule.country &&
          schedule.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (schedule.city &&
          schedule.city.toLowerCase().includes(searchTerm.toLowerCase()));

      // Match country filter
      const matchesCountry =
        selectedCountry === "" ||
        schedule.country === selectedCountry;

      // Match course filter
      const matchesCourse =
        selectedCourse === "" ||
        schedule.courseId === selectedCourse;

      // Match status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "upcoming" &&
          parseDateLocal(schedule.startDate)! > new Date()) ||
        (statusFilter === "ongoing" &&
          parseDateLocal(schedule.startDate)! <= new Date() &&
          parseDateLocal(schedule.endDate)! >= new Date()) ||
        (statusFilter === "completed" &&
          parseDateLocal(schedule.endDate)! < new Date());

      // Filter based on active tab
      const matchesTab =
        (activeTab === "active" && !(schedule.isDeleted ?? false)) ||
        (activeTab === "deleted" && (schedule.isDeleted ?? false));

      return matchesSearch && matchesCountry && matchesCourse && matchesStatus && matchesTab;
    });

    // Sort schedules
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "courseName":
          aValue = courseNames[a.courseId] || "";
          bValue = courseNames[b.courseId] || "";
          break;
        case "instructorName":
          aValue = a.instructorName || "";
          bValue = b.instructorName || "";
          break;
        case "country":
          aValue = a.country || "";
          bValue = b.country || "";
          break;
        case "city":
          aValue = a.city || "";
          bValue = b.city || "";
          break;
        case "startDate":
          aValue = new Date(a.startDate).getTime();
          bValue = new Date(b.startDate).getTime();
          break;
        case "endDate":
          aValue = new Date(a.endDate).getTime();
          bValue = new Date(b.endDate).getTime();
          break;
        case "price":
          aValue = a.offerPrice || a.standardPrice || 0;
          bValue = b.offerPrice || b.standardPrice || 0;
          break;
        default:
          aValue = new Date(a.startDate).getTime();
          bValue = new Date(b.startDate).getTime();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [schedules, searchTerm, selectedCountry, selectedCourse, statusFilter, activeTab, sortBy, sortOrder, courseNames]);

  // Pagination calculations
  const totalItems = filteredSchedules.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSchedules = filteredSchedules.slice(startIndex, endIndex);

  // Get available courses for selected country
  const availableCourses = useMemo(() => {
    if (!selectedCountry) return courses;
    
    const countrySchedules = schedules.filter(schedule => 
      schedule.country === selectedCountry && !(schedule.isDeleted ?? false)
    );
    const courseIds = [...new Set(countrySchedules.map(schedule => schedule.courseId))];
    
    return courses.filter(course => courseIds.includes(course._id || course.id));
  }, [courses, schedules, selectedCountry]);

  // Get available countries
  const availableCountries = useMemo(() => {
    const countrySchedules = schedules.filter(schedule => !(schedule.isDeleted ?? false));
    const countryNames = [...new Set(countrySchedules.map(schedule => schedule.country).filter(Boolean))];
    
    return countries.filter(country => countryNames.includes(country.name));
  }, [countries, schedules]);

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    // Check if date is invalid
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get course name by ID
  const getCourseName = (courseId: string) => {
    return courseNames[courseId] || "Unknown Course";
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Format schedule type for display
  const formatScheduleType = (type: string) => {
    if (!type) return "N/A";
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, " ");
  };

  // Get schedule status based on dates
  const getScheduleStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = parseDateLocal(startDate)!;
    const end = parseDateLocal(endDate)!;

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "ongoing";
    return "completed";
  };

  // Handle showing the delete confirmation modal
  const handleDeleteClick = (scheduleId: string) => {
    setScheduleToDelete(scheduleId);
    setShowDeleteModal(true);
  };

  // Handle deleting a schedule (soft delete)
  const confirmDelete = async () => {
    if (!scheduleToDelete) return;

    setIsDeleting(scheduleToDelete);
    setError("");
    setSuccessMessage("");

    try {
      // Use updateSchedule to set isDeleted: true (soft delete)
      await scheduleService.updateSchedule(scheduleToDelete, {
        isDeleted: true,
      });

      // Refresh the schedules data to get the latest state
      await fetchSchedules();

      setSuccessMessage("Schedule deleted successfully");
      setShowDeleteModal(false);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting schedule");
    } finally {
      setIsDeleting(null);
    }
  };

  // Handle restoring a schedule
  const handleRestoreSchedule = async (scheduleId: string) => {
    setIsRestoring(scheduleId);
    setError("");
    setSuccessMessage("");

    try {
      // Use updateSchedule to set isDeleted: false (restore)
      await scheduleService.updateSchedule(scheduleId, {
        isDeleted: false,
      });

      // Refresh the schedules data to get the latest state
      await fetchSchedules();

      setSuccessMessage("Schedule restored successfully");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error restoring schedule");
    } finally {
      setIsRestoring(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Course Schedules
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Manage course schedules and sessions
          </p>
        </div>
        <Link
          href="/dashboard/schedules/add"
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] flex items-center gap-2 hover:bg-[var(--primary-hover)] transition-colors mt-4 sm:mt-0"
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

      {/* Error and Success Messages */}
      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-[var(--radius-md)]">
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

      {/* Search and Filter Controls */}
      <ListPageControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search schedules..."
        filters={[
          {
            label: "Country",
            value: selectedCountry,
            onChange: (value) => {
              setSelectedCountry(value);
              setSelectedCourse(""); // Reset course when country changes
            },
            options: [
              { value: "", label: "All Countries" },
              ...availableCountries.map(country => ({
                value: country.name,
                label: country.name
              }))
            ]
          },
          {
            label: "Course",
            value: selectedCourse,
            onChange: setSelectedCourse,
            options: [
              { value: "", label: "All Courses" },
              ...availableCourses.map(course => ({
                value: course._id || course.id,
                label: course.title
              }))
            ]
          },
          {
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: "all", label: "All Status" },
              { value: "upcoming", label: "Upcoming" },
              { value: "ongoing", label: "Ongoing" },
              { value: "completed", label: "Completed" }
            ]
          }
        ]}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        sortOptions={[
          { value: "startDate", label: "Start Date" },
          { value: "endDate", label: "End Date" },
          { value: "courseName", label: "Course Name" },
          { value: "instructorName", label: "Instructor" },
          { value: "country", label: "Country" },
          { value: "city", label: "City" },
          { value: "price", label: "Price" }
        ]}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        totalItems={totalItems}
        startIndex={startIndex + 1}
        endIndex={Math.min(endIndex, totalItems)}
      />

      {/* Schedules List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" text="Loading schedules..." />
        </div>
      ) : filteredSchedules.length === 0 ? (
        <div className="mt-6 p-8 text-center border border-[var(--primary)]/10 rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] bg-[var(--background)]">
          <h3 className="text-lg font-medium text-[var(--foreground)]/80">
            {activeTab === "active" ? "No active schedules found" : "No deleted schedules found"}
          </h3>
          <p className="mt-2 text-[var(--foreground)]/60">
            {activeTab === "active" 
              ? searchTerm || statusFilter !== "all" || selectedCountry || selectedCourse
                ? "Try adjusting your search or filters"
                : "Add your first schedule to get started"
              : "No deleted schedules to show"
            }
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border border-[var(--primary)]/10 rounded-[var(--radius-md)] overflow-hidden">
            <thead className="bg-[var(--primary)]/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)]/70 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)]/70 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)]/70 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)]/70 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)]/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)]/70 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--foreground)]/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--background)] divide-y divide-[var(--primary)]/10">
              {paginatedSchedules.map((schedule) => {
                const status = getScheduleStatus(
                  schedule.startDate,
                  schedule.endDate
                );
                return (
                  <tr
                    key={schedule._id}
                    className="hover:bg-[var(--primary)]/5"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[var(--foreground)]">
                        {getCourseName(schedule.courseId)}
                      </div>
                      <div className="text-sm text-[var(--foreground)]/70">
                        {formatScheduleType(schedule.scheduleType)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                      {schedule.instructorName || "TBA"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--foreground)]">
                        {schedule.city || "N/A"}
                      </div>
                      <div className="text-sm text-[var(--foreground)]/70">
                        {schedule.country || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--foreground)]">
                        {formatDate(schedule.startDate)}
                      </div>
                      <div className="text-sm text-[var(--foreground)]/70">
                        to {formatDate(schedule.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          status === "upcoming"
                            ? "bg-blue-100 text-blue-800"
                            : status === "ongoing"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                      {formatPrice(
                        schedule.offerPrice || schedule.standardPrice
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {activeTab === "active" ? (
                          <>
                            <Link
                              href={`/dashboard/schedules/edit/${schedule._id}`}
                              className="text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                              title="Edit schedule"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(schedule._id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete schedule"
                              disabled={isDeleting === schedule._id}
                            >
                              {isDeleting === schedule._id ? (
                                <LoadingSpinner size="small" />
                              ) : (
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
                              )}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRestoreSchedule(schedule._id)}
                            className="text-[var(--success)] hover:text-[var(--success)]/80 transition-colors"
                            title="Restore schedule"
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && filteredSchedules.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={totalItems}
          startIndex={startIndex + 1}
          endIndex={Math.min(endIndex, totalItems)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Schedule"
        description="Are you sure you want to delete this schedule? This action can be undone by restoring it from the Deleted Schedules tab."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        isConfirming={isDeleting !== null}
        variant="danger"
      />
    </div>
  );
}
