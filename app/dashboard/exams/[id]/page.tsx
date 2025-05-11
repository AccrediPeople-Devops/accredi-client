"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import examService from "../../../components/service/exam.service";
import courseService from "../../../components/service/course.service";
import questionPaperService from "../../../components/service/questionPaper.service";
import { Exam } from "../../../types/exam";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

// Wrapper component to handle the params promise
function ViewExamContent({ id }: { id: string }) {
  const router = useRouter();
  const examId = id;
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [courseName, setCourseName] = useState<string>("");
  const [questionPaperName, setQuestionPaperName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch exam data and related info
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Fetch exam data
        const examResponse = await examService.getExamById(examId);
        console.log("Exam response:", examResponse);
        
        if (!examResponse || !examResponse.status) {
          throw new Error(examResponse?.message || "Failed to fetch exam data");
        }
        
        const examData = examResponse.exam;
        if (!examData) {
          throw new Error("Exam not found");
        }

        setExam(examData);

        // Fetch course name
        if (examData.courseId) {
          try {
            const courseResponse = await courseService.getCourseById(examData.courseId);
            
            if (courseResponse && courseResponse.status) {
              setCourseName(courseResponse.course?.title || "Unknown Course");
            } else if (courseResponse && courseResponse._id) {
              setCourseName(courseResponse.title || "Unknown Course");
            } else {
              setCourseName("Unknown Course");
            }
          } catch (err) {
            console.error("Error fetching course:", err);
            setCourseName("Unknown Course");
          }
        }

        // Fetch question paper name
        if (examData.questionPaperSetId) {
          try {
            const questionPaperResponse = await questionPaperService.getQuestionPaperById(examData.questionPaperSetId);
            
            if (questionPaperResponse && questionPaperResponse.status) {
              setQuestionPaperName(questionPaperResponse.questionPaper?.title || "Unknown Question Paper");
            } else if (questionPaperResponse && questionPaperResponse._id) {
              setQuestionPaperName(questionPaperResponse.title || "Unknown Question Paper");
            } else {
              setQuestionPaperName("Unknown Question Paper");
            }
          } catch (err) {
            console.error("Error fetching question paper:", err);
            setQuestionPaperName("Unknown Question Paper");
          }
        }
      } catch (err: any) {
        console.error("Error fetching exam data:", err);
        setError(err.message || "An error occurred while fetching exam data");
      } finally {
        setIsLoading(false);
      }
    };

    if (examId) {
      fetchData();
    }
  }, [examId]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this exam? This action cannot be undone.")) {
      try {
        setIsActionLoading(true);
        setActionError("");
        
        const response = await examService.deleteExam(examId);
        
        if (response && response.status) {
          router.push("/dashboard/exams");
        } else {
          setActionError(response?.message || "Failed to delete exam");
        }
      } catch (err: any) {
        console.error("Error deleting exam:", err);
        setActionError(err.message || "An error occurred while deleting the exam");
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  const handleToggleStatus = async () => {
    try {
      setIsActionLoading(true);
      setActionError("");
      setSuccessMessage("");
      
      if (!exam) return;
      
      const newStatus = !exam.isActive;
      const response = await examService.updateExamStatus(examId, newStatus);
      
      if (response && (response.status || response._id)) {
        // Update the local state
        setExam(prev => {
          if (!prev) return null;
          return {
            ...prev,
            isActive: newStatus
          };
        });
        
        setSuccessMessage(`Exam ${newStatus ? 'activated' : 'deactivated'} successfully`);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setActionError(response?.message || `Failed to ${newStatus ? 'activate' : 'deactivate'} exam`);
      }
    } catch (err: any) {
      console.error("Error toggling exam status:", err);
      setActionError(err.message || "An error occurred while updating exam status");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRestore = async () => {
    if (confirm("Are you sure you want to restore this exam?")) {
      try {
        setIsActionLoading(true);
        setActionError("");
        
        const response = await examService.restoreExam(examId);
        
        if (response && response.status) {
          // Update the local state
          setExam(prev => {
            if (!prev) return null;
            return {
              ...prev,
              isDeleted: false
            };
          });
          
          setSuccessMessage("Exam restored successfully");
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        } else {
          setActionError(response?.message || "Failed to restore exam");
        }
      } catch (err: any) {
        console.error("Error restoring exam:", err);
        setActionError(err.message || "An error occurred while restoring the exam");
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-[var(--radius-md)] p-4 my-4">
        <h2 className="text-lg font-medium mb-2">Error</h2>
        <p>{error || "Exam not found"}</p>
        <Link 
          href="/dashboard/exams" 
          className="mt-4 inline-flex items-center text-sm text-red-600 hover:text-red-800"
        >
          Return to Exams List
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{exam.title}</h1>
          <p className="text-[var(--foreground-muted)]">
            {exam.isDeleted ? (
              <span className="text-red-500">Deleted Exam</span>
            ) : exam.isActive ? (
              <span className="text-green-500">Active</span>
            ) : (
              <span className="text-yellow-500">Inactive</span>
            )}
          </p>
        </div>
        <Link
          href="/dashboard/exams"
          className="px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] flex items-center gap-2 hover:bg-[var(--input-bg)]/80 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Exams
        </Link>
      </div>

      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-[var(--radius-md)] p-4">
          <p>{actionError}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-[var(--radius-md)] p-4">
          <p>{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Exam Details */}
        <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
          <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Exam Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-[var(--foreground-muted)]">Course</p>
              <p className="font-medium text-[var(--foreground)]">{courseName}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-[var(--foreground-muted)]">Question Paper</p>
              <p className="font-medium text-[var(--foreground)]">{questionPaperName}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-[var(--foreground-muted)]">Time Limit</p>
              <p className="font-medium text-[var(--foreground)]">{exam.timeLimit} minutes</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-[var(--foreground-muted)]">Result Method</p>
              <p className="font-medium text-[var(--foreground)]">
                {exam.resultMethod === 'auto' ? 'Automatic' : 'Manual'}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-[var(--foreground-muted)]">Status</p>
              <p className="font-medium">
                {exam.isDeleted ? (
                  <span className="text-red-500">Deleted</span>
                ) : exam.isActive ? (
                  <span className="text-green-500">Active</span>
                ) : (
                  <span className="text-yellow-500">Inactive</span>
                )}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-[var(--foreground-muted)]">Last Updated</p>
              <p className="font-medium text-[var(--foreground)]">{formatDate(exam.updatedAt)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-[var(--foreground-muted)]">Created At</p>
              <p className="font-medium text-[var(--foreground)]">{formatDate(exam.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
          <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Actions</h2>
          
          <div className="flex flex-wrap gap-3">
            {!exam.isDeleted ? (
              <>
                <Link
                  href={`/dashboard/exams/edit/${examId}`}
                  className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </Link>
                
                <button
                  onClick={handleToggleStatus}
                  disabled={isActionLoading}
                  className="px-4 py-2 bg-amber-500 text-white rounded-[var(--radius-md)] hover:bg-amber-600 transition-colors flex items-center gap-2"
                >
                  {isActionLoading ? (
                    <>
                      <LoadingSpinner size="small" /> Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      </svg>
                      {exam.isActive ? 'Deactivate' : 'Activate'}
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleDelete}
                  disabled={isActionLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded-[var(--radius-md)] hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  {isActionLoading ? (
                    <>
                      <LoadingSpinner size="small" /> Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={handleRestore}
                disabled={isActionLoading}
                className="px-4 py-2 bg-green-500 text-white rounded-[var(--radius-md)] hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                {isActionLoading ? (
                  <>
                    <LoadingSpinner size="small" /> Processing...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Restore
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component that unwraps the params promise
export default function ViewExamPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Unwrap the params using React.use()
  const unwrappedParams = React.use(params as Promise<{ id: string }>);
  return <ViewExamContent id={unwrappedParams.id} />;
} 