"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import courseLinkService from "@/app/components/service/courseLink.service";
import courseService from "@/app/components/service/course.service";
import scheduleService from "@/app/components/service/schedule.service";
import { CourseLink } from "@/app/types/courseLink";
import { Course } from "@/app/types/course";
import { Schedule } from "@/app/types/schedule";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import Modal from "@/app/components/Modal";
import ListPageControls, { Pagination, SortableHeader } from "@/app/components/ListPageControls";

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
  
  // New filtering and pagination states
  const [countryFilter, setCountryFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [scheduleFilter, setScheduleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Data for filters
  const [countries, setCountries] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [scheduleNames, setScheduleNames] = useState<Record<string, string>>({});
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState("");

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
            courseNamesMap[courseId] = "Unknown Course";
          }
        })
      );
      
      setCourseNames(courseNamesMap);
    } catch (err) {
    }
  };

  // Fetch filter data
  const fetchFilterData = async () => {
    try {
      // Fetch courses
      const coursesResponse = await courseService.getAllCourses();
      if (coursesResponse && coursesResponse.courses) {
        setCourses(Array.isArray(coursesResponse.courses) ? coursesResponse.courses : []);
      }

      // Fetch schedules
      const schedulesResponse = await scheduleService.getAllSchedules();
      if (schedulesResponse && schedulesResponse.schedules) {
        const schedulesData = Array.isArray(schedulesResponse.schedules) ? schedulesResponse.schedules : [];
        setSchedules(schedulesData);
        
        // Extract unique countries from schedules
        const uniqueCountries = [...new Set(schedulesData.map((schedule: Schedule) => schedule.country))].filter(Boolean) as string[];
        setCountries(uniqueCountries);
        
        // Create schedule names map
        const scheduleNamesMap: Record<string, string> = {};
        schedulesData.forEach((schedule: Schedule) => {
          const courseName = courses.find(c => c._id === schedule.courseId)?.title || "Unknown Course";
          const scheduleName = `${courseName} - ${schedule.country} (${schedule.startDate} to ${schedule.endDate})`;
          scheduleNamesMap[schedule._id] = scheduleName;
        });
        setScheduleNames(scheduleNamesMap);
      }
    } catch (err) {
      console.error("Error fetching filter data:", err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchCourseLinks();
    fetchFilterData();
  }, []);

  // Fetch course names whenever course links change
  useEffect(() => {
    fetchCourseNames();
  }, [courseLinks]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [countryFilter, courseFilter, scheduleFilter, searchTerm, statusFilter, activeTab]);

  // Get schedule name for a course link
  const getScheduleName = (scheduleId: string) => {
    return scheduleNames[scheduleId] || "Unknown Schedule";
  };

  // Get country for a course link (from schedule)
  const getCountryForLink = (scheduleId: string) => {
    const schedule = schedules.find(s => s._id === scheduleId);
    return schedule?.country || "Unknown Country";
  };

  // Handle copying link to clipboard
  const handleCopyLink = async (link: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLinkId(linkId);
      setCopyMessage("Link copied to clipboard!");
      
      // Clear the copied state and message after 2 seconds
      setTimeout(() => {
        setCopiedLinkId(null);
        setCopyMessage("");
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopiedLinkId(linkId);
      setCopyMessage("Link copied to clipboard!");
      
      setTimeout(() => {
        setCopiedLinkId(null);
        setCopyMessage("");
      }, 2000);
    }
  };

  // Filter course links based on all filters
  const filteredCourseLinks = courseLinks.filter((link) => {
    // Match search term
    const matchesSearch = searchTerm === "" || 
      link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.link.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (courseNames[link.courseId] && courseNames[link.courseId].toLowerCase().includes(searchTerm.toLowerCase())) ||
      (scheduleNames[link.scheduleId] && scheduleNames[link.scheduleId].toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Match status filter (only applies to active tab)
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && link.isActive) ||
      (statusFilter === "inactive" && !link.isActive);
    
    // Match active/deleted tab
    const matchesTab =
      (activeTab === "active" && !link.isDeleted) ||
      (activeTab === "deleted" && link.isDeleted);
    
    // Match country filter
    const matchesCountry = countryFilter === "all" || getCountryForLink(link.scheduleId) === countryFilter;
    
    // Match course filter
    const matchesCourse = courseFilter === "all" || link.courseId === courseFilter;
    
    // Match schedule filter
    const matchesSchedule = scheduleFilter === "all" || link.scheduleId === scheduleFilter;
    
    return matchesSearch && matchesStatus && matchesTab && matchesCountry && matchesCourse && matchesSchedule;
  });

  // Sort filtered course links
  const sortedCourseLinks = [...filteredCourseLinks].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "course":
        aValue = (courseNames[a.courseId] || "").toLowerCase();
        bValue = (courseNames[b.courseId] || "").toLowerCase();
        break;
      case "country":
        aValue = getCountryForLink(a.scheduleId).toLowerCase();
        bValue = getCountryForLink(b.scheduleId).toLowerCase();
        break;
      case "createdAt":
      default:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
    }
    
    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Pagination
  const totalItems = sortedCourseLinks.length;
  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(totalItems / itemsPerPage);
  const startIndex = itemsPerPage === -1 ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = itemsPerPage === -1 ? totalItems : startIndex + itemsPerPage;
  const paginatedCourseLinks = sortedCourseLinks.slice(startIndex, endIndex);

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

      {copyMessage && (
        <div className="p-4 bg-[var(--success)]/10 border border-[var(--success)]/30 text-[var(--success)] rounded-[var(--radius-md)]">
          {copyMessage}
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

      {/* Filters */}
      <ListPageControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search course links..."
        filters={[
          ...(activeTab === "active" ? [{
            label: "Status",
            value: statusFilter,
            options: [
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" }
            ],
            onChange: setStatusFilter
          }] : []),
          {
            label: "Country",
            value: countryFilter,
            options: [
              { value: "all", label: "All Countries" },
              ...countries.map(country => ({ value: country, label: country }))
            ],
            onChange: setCountryFilter
          },
          {
            label: "Course",
            value: courseFilter,
            options: [
              { value: "all", label: "All Courses" },
              ...courses.map(course => ({ value: course._id, label: course.title }))
            ],
            onChange: setCourseFilter
          },
          {
            label: "Schedule",
            value: scheduleFilter,
            options: [
              { value: "all", label: "All Schedules" },
              ...schedules.map(schedule => ({ 
                value: schedule._id, 
                label: scheduleNames[schedule._id] || `${schedule.country} - ${schedule.startDate} to ${schedule.endDate}`
              }))
            ],
            onChange: setScheduleFilter
          }
        ]}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        sortOptions={[
          { value: "createdAt", label: "Date Created" },
          { value: "name", label: "Name" },
          { value: "course", label: "Course" },
          { value: "country", label: "Country" }
        ]}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
      />

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
                  <SortableHeader
                    sortKey="name"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={(key) => {
                      if (sortBy === key) {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy(key);
                        setSortOrder("asc");
                      }
                    }}
                  >
                    Name
                  </SortableHeader>
                  <SortableHeader
                    sortKey="course"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={(key) => {
                      if (sortBy === key) {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy(key);
                        setSortOrder("asc");
                      }
                    }}
                  >
                    Course
                  </SortableHeader>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Link
                  </th>
                  <SortableHeader
                    sortKey="createdAt"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={(key) => {
                      if (sortBy === key) {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy(key);
                        setSortOrder("desc");
                      }
                    }}
                  >
                    Date Added
                  </SortableHeader>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Country
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
                {paginatedCourseLinks.length > 0 ? (
                  paginatedCourseLinks.map((link) => (
                    <tr key={link._id} className="hover:bg-[var(--input-bg)]/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--foreground)]">{link.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--foreground)]">{getCourseName(link.courseId)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <a 
                            href={link.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[var(--primary)] hover:underline truncate block max-w-xs flex-1"
                          >
                            {link.link}
                          </a>
                          <button
                            onClick={() => handleCopyLink(link.link, link._id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleCopyLink(link.link, link._id);
                              }
                            }}
                            className={`p-2 rounded-[var(--radius-sm)] transition-all duration-200 flex-shrink-0 border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-1 ${
                              copiedLinkId === link._id
                                ? "bg-[var(--success)] text-white border-[var(--success)]"
                                : "text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 border-[var(--border)] hover:border-[var(--primary)]"
                            }`}
                            title={copiedLinkId === link._id ? "Copied!" : "Copy link to clipboard"}
                            aria-label={copiedLinkId === link._id ? "Link copied to clipboard" : "Copy link to clipboard"}
                          >
                            {copiedLinkId === link._id ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--foreground-muted)]">{formatDate(link.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--foreground)]">{getCountryForLink(link.scheduleId)}</div>
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
                    <td colSpan={7} className="px-6 py-4 text-center text-[var(--foreground-muted)]">
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

      {/* Pagination */}
      {!isLoading && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}

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