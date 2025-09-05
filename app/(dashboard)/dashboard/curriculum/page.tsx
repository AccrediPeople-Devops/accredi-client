"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import curriculumService from "@/app/components/service/curriculum.service";
import courseService from "@/app/components/service/course.service";
import { Curriculum, CurriculumContent } from "@/app/types/curriculum";
import { Course } from "@/app/types/course";
import { createHtmlPreview } from "@/app/utils/textUtils";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import Modal from "@/app/components/Modal";
import ListPageControls, { Pagination } from "@/app/components/ListPageControls";

export default function CurriculumPage() {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [curriculumToDelete, setCurriculumToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Enhanced filtering and pagination state
  const [selectedCourse, setSelectedCourse] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Status update state
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      // First fetch courses
      const coursesRes = await courseService.getAllCourses();
      if (coursesRes?.courses) {
        setCourses(coursesRes.courses);
      }

      // Then fetch curriculums after we have course data
      const curriculumsRes = await curriculumService.getAllCurriculums();
      if (curriculumsRes?.curriculum) {
        setCurriculums(curriculumsRes.curriculum);
      } else {
        setCurriculums([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  // Get course name by course ID
  const getCourseNameById = (courseId: string) => {
    if (!courseId) return "Unknown Course";
    const course = courses.find((course) => course._id === courseId);
    return course ? course.title : "Course Not Found";
  };

  const handleDeleteCurriculum = async (id: string) => {
    try {
      await curriculumService.deleteCurriculum(id);
      // Update the local state after successful deletion
      setCurriculums(curriculums.filter((curriculum) => curriculum._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting curriculum");
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    setIsUpdatingStatus(id);
    try {
      await curriculumService.toggleCurriculumActive(id, isActive);
      // Update the local state after successful toggle
      setCurriculums(
        curriculums.map((curriculum) =>
          curriculum._id === id ? { ...curriculum, isActive } : curriculum
        )
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Error updating curriculum status"
      );
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setCurriculumToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!curriculumToDelete) return;
    
    setIsDeleting(true);
    try {
      await curriculumService.deleteCurriculum(curriculumToDelete);
      // Update the local state after successful deletion
      setCurriculums(curriculums.filter((curriculum) => curriculum._id !== curriculumToDelete));
      setShowDeleteModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting curriculum");
    } finally {
      setIsDeleting(false);
    }
  };

  // Enhanced filtering and sorting logic
  const filteredCurriculums = useMemo(() => {
    let filtered = curriculums.filter((curriculum) => {
      const courseName = getCourseNameById(curriculum.courseId).toLowerCase();
      const matchesSearch = courseName.includes(searchTerm.toLowerCase());
      const matchesCourse = !selectedCourse || curriculum.courseId === selectedCourse;
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "active" && curriculum.isActive) ||
        (statusFilter === "inactive" && !curriculum.isActive);
      
      return matchesSearch && matchesCourse && matchesStatus;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "courseName":
          aValue = getCourseNameById(a.courseId).toLowerCase();
          bValue = getCourseNameById(b.courseId).toLowerCase();
          break;
        case "contentCount":
          aValue = a.content.length;
          bValue = b.content.length;
          break;
        case "updatedAt":
          aValue = new Date(a.updatedAt || a.createdAt || "").getTime();
          bValue = new Date(b.updatedAt || b.createdAt || "").getTime();
          break;
        case "createdAt":
          aValue = new Date(a.createdAt || "").getTime();
          bValue = new Date(b.createdAt || "").getTime();
          break;
        default:
          aValue = a[sortBy as keyof Curriculum];
          bValue = b[sortBy as keyof Curriculum];
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [curriculums, searchTerm, selectedCourse, statusFilter, sortBy, sortOrder, courses]);

  // Pagination logic
  const totalItems = filteredCurriculums.length;
  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(totalItems / itemsPerPage);
  const startIndex = itemsPerPage === -1 ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = itemsPerPage === -1 ? totalItems : Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedCurriculums = itemsPerPage === -1 ? filteredCurriculums : filteredCurriculums.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCourse, statusFilter, sortBy, sortOrder]);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Curriculum Management
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Create and manage course curriculum content
          </p>
        </div>
        <Link
          href="/dashboard/curriculum/add"
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
          Add New Curriculum
        </Link>
      </div>

      {/* Enhanced Search and Filter Controls */}
      <ListPageControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by course name..."
        filters={[
          {
            label: "Course",
            value: selectedCourse,
            options: [
              { value: "", label: "All Courses" },
              ...courses.map(course => ({ value: course._id, label: course.title }))
            ],
            onChange: setSelectedCourse
          },
          {
            label: "Status",
            value: statusFilter,
            options: [
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" }
            ],
            onChange: setStatusFilter
          }
        ]}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        sortOptions={[
          { value: "courseName", label: "Course Name" },
          { value: "contentCount", label: "Content Items" },
          { value: "updatedAt", label: "Last Updated" },
          { value: "createdAt", label: "Created Date" }
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

      {/* Error message */}
      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner size="medium" text="Loading curriculums..." />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && filteredCurriculums.length === 0 && (
        <div className="text-center py-12 bg-[var(--input-bg)] rounded-[var(--radius-md)] border border-[var(--border)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-[var(--primary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-[var(--foreground)]">
            No Curriculums Found
          </h3>
          <p className="mt-2 text-[var(--foreground-muted)]">
            {searchTerm || selectedCourse || statusFilter !== "all"
              ? "No curriculums match your search criteria."
              : "Get started by creating a new curriculum."}
          </p>
        </div>
      )}

      {/* Curriculum List */}
      {!isLoading && !error && filteredCurriculums.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {paginatedCurriculums.map((curriculum) => (
            <div
              key={curriculum._id}
              className="bg-[var(--background)] rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)]"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-medium text-[var(--foreground)] mb-2">
                      {courses.length === 0 ? (
                        <span className="inline-flex items-center">
                          Course:{" "}
                          <span className="ml-2 animate-pulse text-[var(--foreground-muted)]">
                            Loading...
                          </span>
                        </span>
                      ) : (
                        <span>
                          Course: {getCourseNameById(curriculum.courseId)}
                        </span>
                      )}
                    </h2>
                    <div className="flex items-center gap-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          curriculum.isActive
                            ? "bg-[var(--success)]/20 text-[var(--success)]"
                            : "bg-[var(--foreground-muted)]/20 text-[var(--foreground-muted)]"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full mr-1 ${
                            curriculum.isActive ? "bg-[var(--success)]" : "bg-[var(--foreground-muted)]"
                          }`}
                        ></span>
                        {curriculum.isActive ? "Active" : "Inactive"}
                      </span>
                      <span className="text-sm text-[var(--foreground-muted)]">
                        {curriculum.content.length} content items
                      </span>
                    </div>
                  </div>
                  
                  {/* Action buttons moved to top right */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleToggleActive(
                          curriculum._id as string,
                          !curriculum.isActive
                        )
                      }
                      disabled={isUpdatingStatus === curriculum._id}
                      className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-colors disabled:opacity-50 ${
                        curriculum.isActive
                          ? "bg-[var(--success)]/20 text-[var(--success)] hover:bg-[var(--success)]/30"
                          : "bg-[var(--foreground-muted)]/20 text-[var(--foreground-muted)] hover:bg-[var(--foreground-muted)]/30"
                      }`}
                    >
                      {isUpdatingStatus === curriculum._id ? (
                        <span className="flex items-center gap-1">
                          <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </span>
                      ) : (
                        curriculum.isActive ? "Deactivate" : "Activate"
                      )}
                    </button>
                    
                    <Link
                      href={`/dashboard/curriculum/${curriculum._id}`}
                      className="px-3 py-1.5 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--input-bg)] transition-colors text-sm font-medium flex items-center gap-1"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </Link>
                    
                    <Link
                      href={`/dashboard/curriculum/edit/${curriculum._id}`}
                      className="px-3 py-1.5 bg-[var(--primary)] text-white rounded-[var(--radius-sm)] hover:bg-[var(--primary)]/90 transition-colors text-sm font-medium flex items-center gap-1"
                    >
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </Link>
                    
                    <button
                      onClick={() => handleDeleteClick(curriculum._id as string)}
                      className="px-3 py-1.5 bg-[var(--error)]/20 text-[var(--error)] rounded-[var(--radius-sm)] hover:bg-[var(--error)]/30 transition-colors text-sm font-medium flex items-center gap-1"
                    >
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-[var(--foreground)] font-medium mb-3">
                    Content Preview
                  </h3>
                  <div className="space-y-2">
                    {curriculum.content.slice(0, 3).map((item, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-[var(--input-bg)] rounded-[var(--radius-sm)]"
                      >
                        <h4 className="text-[var(--primary)] font-medium text-sm">
                          {item.title}
                        </h4>
                        <div className="text-[var(--foreground-muted)] text-xs mt-1 line-clamp-2 overflow-hidden">
                          {createHtmlPreview(item.description)}
                        </div>
                      </div>
                    ))}
                    {curriculum.content.length > 3 && (
                      <div className="text-center text-[var(--primary)] text-sm">
                        +{curriculum.content.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <div className="text-sm text-[var(--foreground-muted)]">
                    Last updated: {new Date(curriculum.updatedAt || "").toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && filteredCurriculums.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        description="Are you sure you want to delete this curriculum? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        isConfirming={isDeleting}
        variant="danger"
      />
    </div>
  );
}
