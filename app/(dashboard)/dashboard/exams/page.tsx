"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import examService from "@/app/components/service/exam.service";
import courseService from "@/app/components/service/course.service";
import questionPaperService from "@/app/components/service/questionPaper.service";
import { Exam } from "@/app/types/exam";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import Modal from "@/app/components/Modal";

export default function ExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("active");
  const [courseMap, setCourseMap] = useState<{ [key: string]: string }>({});
  const [questionPaperMap, setQuestionPaperMap] = useState<{ [key: string]: string }>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [examToDelete, setExamToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch exams, courses, and question papers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");

        
        // Fetch all exams
        const examsResponse = await examService.getAllExams();
        
        if (examsResponse) {
          let examsList = [];
          
          if (examsResponse.exams && Array.isArray(examsResponse.exams)) {
            examsList = examsResponse.exams;
          } else if (Array.isArray(examsResponse)) {
            examsList = examsResponse;
          } else if (examsResponse.data && Array.isArray(examsResponse.data)) {
            examsList = examsResponse.data;
          }
          
          if (examsList.length > 0) {
            setExams(examsList);
            
            // Extract unique course IDs
            const courseIds = Array.from(new Set(examsList.map((exam: Exam) => exam.courseId)));
            
            // Extract unique question paper IDs
            const questionPaperIds = Array.from(new Set(examsList.map((exam: Exam) => exam.questionPaperSetId)));
            
            // Fetch course details for mapping
            const coursesResponse = await courseService.getAllCourses();
            
            if (coursesResponse) {
              let courses = [];
              
              if (coursesResponse.courses && Array.isArray(coursesResponse.courses)) {
                courses = coursesResponse.courses;
              } else if (Array.isArray(coursesResponse)) {
                courses = coursesResponse;
              } else if (coursesResponse.data && Array.isArray(coursesResponse.data)) {
                courses = coursesResponse.data;
              }
              
              // Create a map of course IDs to titles
              const tempCourseMap: { [key: string]: string } = {};
              courses.forEach((course: any) => {
                if (course._id) {
                  tempCourseMap[course._id] = course.title;
                }
              });
              setCourseMap(tempCourseMap);
            }
            
            // Fetch question paper details for mapping
            const questionPapersResponse = await questionPaperService.getAllQuestionPapers();
            
            if (questionPapersResponse) {
              let questionPapers = [];
              
              if (questionPapersResponse.questionPapers && Array.isArray(questionPapersResponse.questionPapers)) {
                questionPapers = questionPapersResponse.questionPapers;
              } else if (Array.isArray(questionPapersResponse)) {
                questionPapers = questionPapersResponse;
              } else if (questionPapersResponse.data && Array.isArray(questionPapersResponse.data)) {
                questionPapers = questionPapersResponse.data;
              }
              
              // Create a map of question paper IDs to titles
              const tempQuestionPaperMap: { [key: string]: string } = {};
              questionPapers.forEach((paper: any) => {
                if (paper._id) {
                  tempQuestionPaperMap[paper._id] = paper.title;
                }
              });
              setQuestionPaperMap(tempQuestionPaperMap);
            }
          }
        }
      } catch (err: any) {
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
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTimeLimit = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hour${hours > 1 ? "s" : ""}${remainingMinutes > 0 ? ` ${remainingMinutes} min` : ""}`;
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      await examService.updateExamStatus(id, !currentStatus);
      
      // Update the local state
      setExams(
        exams.map((exam) =>
          exam._id === id ? { ...exam, isActive: !currentStatus } : exam
        )
      );
    } catch (err: any) {
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDeleteClick = (id: string) => {
    setExamToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!examToDelete) return;
    
    setIsDeleting(examToDelete);
    try {
      await examService.deleteExam(examToDelete);
      
      // Update the local state
      setExams(
        exams.map((exam) =>
          exam._id === examToDelete ? { ...exam, isDeleted: true } : exam
        )
      );
      setShowDeleteModal(false);
    } catch (err: any) {
      setError(err.message || "Failed to delete exam. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await examService.restoreExam(id);
      
      // Update the local state
      setExams(
        exams.map((exam) =>
          exam._id === id ? { ...exam, isDeleted: false } : exam
        )
      );
    } catch (err: any) {
      alert("Failed to restore exam. Please try again.");
    }
  };

  // Filter the exams based on search, course, status, and deleted state
  const filteredExams = exams.filter((exam) => {
    // Filter by deleted status based on active tab
    if (activeTab === "active" && exam.isDeleted) return false;
    if (activeTab === "deleted" && !exam.isDeleted) return false;

    // Filter by search term
    const searchMatch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by course
    const courseMatch =
      courseFilter === "all" || exam.courseId === courseFilter;

    // Filter by status
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "active" && exam.isActive) ||
      (statusFilter === "inactive" && !exam.isActive);

    return searchMatch && courseMatch && statusMatch;
  });

  // Extract unique course IDs for filtering
  const uniqueCourseIds = Array.from(
    new Set(exams.map((exam) => exam.courseId))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Exams</h1>
          <p className="text-[var(--foreground-muted)]">
            Manage your exams
          </p>
        </div>
        <Link
          href="/dashboard/exams/add"
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
          Add New Exam
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
            placeholder="Search exams..."
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
          <LoadingSpinner size="medium" text="Loading exams..." />
        </div>
      )}

      {/* Exams list */}
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
                    Question Paper
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Time Limit
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
                {filteredExams.length > 0 ? (
                  filteredExams.map((exam) => (
                    <tr
                      key={exam._id}
                      className="hover:bg-[var(--input-bg)]/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-[var(--foreground)]">
                          {exam.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[var(--foreground)]">
                        {courseMap[exam.courseId] || "Unknown Course"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[var(--foreground)]">
                        {questionPaperMap[exam.questionPaperSetId] || "Unknown Question Paper"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[var(--foreground)]">
                        {formatTimeLimit(exam.timeLimit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[var(--foreground)]">
                        {formatDate(exam.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            exam.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {exam.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {!exam.isDeleted ? (
                            <>
                              <Link
                                href={`/dashboard/exams/${exam._id}`}
                                className="text-[var(--primary)] hover:text-[var(--primary-hover)]"
                              >
                                View
                              </Link>
                              <span className="text-[var(--border)]">|</span>
                              <Link
                                href={`/dashboard/exams/edit/${exam._id}`}
                                className="text-[var(--primary)] hover:text-[var(--primary-hover)]"
                              >
                                Edit
                              </Link>
                              <span className="text-[var(--border)]">|</span>
                              <button
                                onClick={() => handleStatusToggle(exam._id, exam.isActive)}
                                className="text-[var(--primary)] hover:text-[var(--primary-hover)]"
                              >
                                {exam.isActive ? "Deactivate" : "Activate"}
                              </button>
                              <span className="text-[var(--border)]">|</span>
                              <button
                                onClick={() => handleDeleteClick(exam._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleRestore(exam._id)}
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
                      colSpan={7}
                      className="px-6 py-10 text-center text-[var(--foreground-muted)]"
                    >
                      {activeTab === "active"
                        ? "No active exams found."
                        : "No deleted exams found."}
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
        description="Are you sure you want to delete this exam? This action cannot be undone."
        confirmText="Delete Exam"
        onConfirm={confirmDelete}
        isConfirming={isDeleting !== null}
        variant="danger"
      />
    </div>
  );
} 