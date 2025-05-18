"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import questionPaperService from "@/app/components/service/questionPaper.service";
import courseService from "@/app/components/service/course.service";
import { QuestionPaper } from "@/app/types/questionPaper";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import Modal from "@/app/components/Modal";

export default function QuestionPapersPage() {
  const router = useRouter();
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  const [courseMap, setCourseMap] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paperToDelete, setPaperToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");

        console.log("Fetching all question papers");
        
        // Fetch all question papers
        const papersResponse = await questionPaperService.getAllQuestionPapers();
        console.log("Question papers response:", papersResponse);
        
        if (papersResponse) {
          let papers = [];
          
          // Handle different response formats
          if (papersResponse.questionPapers && Array.isArray(papersResponse.questionPapers)) {
            console.log("Found question papers in standard format");
            papers = papersResponse.questionPapers;
          } else if (Array.isArray(papersResponse)) {
            console.log("Found question papers as direct array");
            papers = papersResponse;
          } else if (papersResponse.data && Array.isArray(papersResponse.data)) {
            console.log("Found question papers in data property");
            papers = papersResponse.data;
          }
          
          if (papers.length > 0) {
            console.log("Successfully loaded question papers:", papers.length);
            setQuestionPapers(papers);
            
            // Fetch all courses for mapping
            console.log("Fetching courses for mapping");
            const coursesResponse = await courseService.getAllCourses();
            console.log("Courses response:", coursesResponse);
            
            if (coursesResponse) {
              let courses = [];
              
              if (coursesResponse.courses && Array.isArray(coursesResponse.courses)) {
                courses = coursesResponse.courses;
              } else if (Array.isArray(coursesResponse)) {
                courses = coursesResponse;
              } else if (coursesResponse.data && Array.isArray(coursesResponse.data)) {
                courses = coursesResponse.data;
              }
              
              if (courses.length > 0) {
                const courseMapping: { [key: string]: string } = {};
                courses.forEach((course: any) => {
                  courseMapping[course._id] = course.title;
                });
                setCourseMap(courseMapping);
              }
            }
            
            return;
          }
        }
        
        throw new Error(papersResponse?.message || "Failed to fetch question papers");
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      await questionPaperService.updateQuestionPaperStatus(id, !currentStatus);
      
      // Update the local state
      setQuestionPapers(
        questionPapers.map((paper) =>
          paper._id === id ? { ...paper, isActive: !currentStatus } : paper
        )
      );
    } catch (err: any) {
      console.error("Error toggling status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDeleteClick = (id: string) => {
    setPaperToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!paperToDelete) return;
    
    setIsDeleting(true);
    try {
      await questionPaperService.deleteQuestionPaper(paperToDelete);
      
      // Update the local state
      setQuestionPapers(
        questionPapers.map((paper) =>
          paper._id === paperToDelete ? { ...paper, isDeleted: true } : paper
        )
      );
      setShowDeleteModal(false);
    } catch (err: any) {
      console.error("Error deleting question paper:", err);
      setError(err.message || "Failed to delete question paper. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await questionPaperService.restoreQuestionPaper(id);
      
      // Update the local state
      setQuestionPapers(
        questionPapers.map((paper) =>
          paper._id === id ? { ...paper, isDeleted: false } : paper
        )
      );
    } catch (err: any) {
      console.error("Error restoring question paper:", err);
      alert("Failed to restore question paper. Please try again.");
    }
  };

  // Filter the question papers based on search, course, status, and deleted state
  const filteredQuestionPapers = questionPapers.filter((paper) => {
    // Filter by deleted status based on active tab
    if (activeTab === "active" && paper.isDeleted) return false;
    if (activeTab === "deleted" && !paper.isDeleted) return false;

    // Filter by search term
    const searchMatch =
      paper.title.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by course
    const courseMatch =
      courseFilter === "all" || paper.courseId === courseFilter;

    // Filter by status
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "active" && paper.isActive) ||
      (statusFilter === "inactive" && !paper.isActive);

    return searchMatch && courseMatch && statusMatch;
  });

  // Extract unique course IDs for filtering
  const uniqueCourseIds = Array.from(
    new Set(questionPapers.map((paper) => paper.courseId))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Question Papers</h1>
          <p className="text-[var(--foreground-muted)]">
            Manage your question papers
          </p>
        </div>
        <Link
          href="/dashboard/question-papers/add"
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
          Add New Question Paper
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
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === "active"
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground-muted)]"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("deleted")}
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === "deleted"
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground-muted)]"
            }`}
          >
            Deleted
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search question papers..."
            className="px-4 py-2 w-full bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 w-full bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">All Courses</option>
            {uniqueCourseIds.map((courseId) => (
              <option key={courseId} value={courseId}>
                {courseMap[courseId] || "Unknown Course"}
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
          <LoadingSpinner size="medium" text="Loading question papers..." />
        </div>
      )}

      {/* Question paper list */}
      {!isLoading && (
        <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border)]">
              <thead className="bg-[var(--input-bg)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Questions
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
              <tbody className="bg-[var(--background)] divide-y divide-[var(--border)]">
                {filteredQuestionPapers.length > 0 ? (
                  filteredQuestionPapers.map((paper) => (
                    <tr
                      key={paper._id}
                      className="hover:bg-[var(--input-bg)]/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-[var(--foreground)]">
                          {paper.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[var(--foreground)]">
                        {courseMap[paper.courseId] || "Unknown Course"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[var(--foreground)]">
                        {paper.content.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[var(--foreground-muted)]">
                        {formatDate(paper.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            paper.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {paper.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {!paper.isDeleted ? (
                            <>
                              <Link
                                href={`/dashboard/question-papers/${paper._id}`}
                                className="text-[var(--primary)] hover:text-[var(--primary-hover)]"
                              >
                                View
                              </Link>
                              <span className="text-[var(--border)]">|</span>
                              <Link
                                href={`/dashboard/question-papers/edit/${paper._id}`}
                                className="text-[var(--primary)] hover:text-[var(--primary-hover)]"
                              >
                                Edit
                              </Link>
                              <span className="text-[var(--border)]">|</span>
                              <button
                                onClick={() => handleStatusToggle(paper._id, paper.isActive)}
                                className="text-[var(--primary)] hover:text-[var(--primary-hover)]"
                              >
                                {paper.isActive ? "Deactivate" : "Activate"}
                              </button>
                              <span className="text-[var(--border)]">|</span>
                              <button
                                onClick={() => handleDeleteClick(paper._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleRestore(paper._id)}
                              className="text-green-500 hover:text-green-700"
                            >
                              Restore
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
                        ? "No active question papers found."
                        : "No deleted question papers found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        description="Are you sure you want to delete this question paper? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        isConfirming={isDeleting}
        variant="danger"
      />
    </div>
  );
} 