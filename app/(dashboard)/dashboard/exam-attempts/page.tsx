"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import examAttemptService from "@/app/components/service/examAttempt.service";
import { ExamAttemptWithDetails } from "@/app/types/examAttempt";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import BulkShowResultsModal from "@/app/components/dashboard/BulkShowResultsModal";

export default function ExamAttemptsPage() {
  const router = useRouter();
  const [examAttempts, setExamAttempts] = useState<ExamAttemptWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    fetchExamAttempts();
  }, []);

  const fetchExamAttempts = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await examAttemptService.getAllExamAttempts();
      
      // Handle different response formats
      let attempts: ExamAttemptWithDetails[] = [];
      if (Array.isArray(response)) {
        attempts = response;
      } else if (response && typeof response === 'object' && 'examAttempts' in response && Array.isArray((response as any).examAttempts)) {
        attempts = (response as any).examAttempts;
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
        attempts = (response as any).data;
      } else {
        console.warn("Unexpected response format:", response);
        attempts = [];
      }
      
      setExamAttempts(attempts);
    } catch (err: any) {
      console.error("Error fetching exam attempts:", err);
      setError(err.message || "Failed to fetch exam attempts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (attemptId: string) => {
    if (!confirm("Are you sure you want to delete this exam attempt?")) {
      return;
    }

    try {
      await examAttemptService.deleteExamAttempt(attemptId);
      setExamAttempts(prev => prev.filter(attempt => attempt._id !== attemptId));
    } catch (err: any) {
      console.error("Error deleting exam attempt:", err);
      alert(err.message || "Failed to delete exam attempt");
    }
  };

  const handleShowResults = (examId: string, examTitle: string) => {
    setSelectedExam({ id: examId, title: examTitle });
    setShowResultsModal(true);
  };

  const handleShowResultsSuccess = () => {
    // Refresh the exam attempts list
    fetchExamAttempts();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (isCompleted: boolean, isResultShown: boolean) => {
    if (!isCompleted) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
          In Progress
        </span>
      );
    }
    if (isResultShown) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          Completed
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
        Pending Review
      </span>
    );
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner size="medium" text="Loading exam attempts..." />
      </div>
    );
  }

  // Get unique exams for bulk actions
  const uniqueExams = Array.from(new Set(examAttempts.map(attempt => attempt.examId._id))).map(examId => {
    const attempt = examAttempts.find(a => a.examId._id === examId);
    return {
      id: examId,
      title: attempt?.examId.title || "Unknown Exam"
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Exam Attempts</h1>
          <p className="text-[var(--foreground-muted)]">
            Manage and review student exam attempts
          </p>
        </div>
        {uniqueExams.length > 0 && (
          <div className="flex space-x-2">
            <select
              onChange={(e) => {
                const exam = uniqueExams.find(ex => ex.id === e.target.value);
                if (exam) {
                  handleShowResults(exam.id, exam.title);
                }
              }}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors border-0"
              defaultValue=""
            >
              <option value="" disabled>Show Results for Exam</option>
              {uniqueExams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      <div className="bg-[var(--input-bg)] rounded-[var(--radius-lg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--background)] border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  Started
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {!Array.isArray(examAttempts) || examAttempts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-[var(--foreground-muted)]">
                    No exam attempts found
                  </td>
                </tr>
              ) : (
                Array.isArray(examAttempts) && examAttempts.map((attempt) => (
                  <tr key={attempt._id} className="hover:bg-[var(--background)]/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[var(--foreground)]">
                          {attempt.userId.fullName}
                        </div>
                        <div className="text-sm text-[var(--foreground-muted)]">
                          {attempt.userId.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--foreground)]">
                        {attempt.examId.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--foreground)]">
                        {attempt.courseId.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(attempt.isCompleted, attempt.isResultShown)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {attempt.isCompleted ? (
                        <div className={`text-sm font-medium ${getScoreColor(attempt.percentage)}`}>
                          {attempt.percentage}% ({attempt.correctAnswers}/{attempt.totalQuestions})
                        </div>
                      ) : (
                        <span className="text-sm text-[var(--foreground-muted)]">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground-muted)]">
                      {attempt.startTime ? formatDate(attempt.startTime) : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/dashboard/exam-attempts/${attempt._id}`)}
                          className="text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/exam-attempts/edit/${attempt._id}`)}
                          className="text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(attempt._id!)}
                          className="text-[var(--error)] hover:text-[var(--error)]/80 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Show Results Modal */}
      {selectedExam && (
        <BulkShowResultsModal
          isOpen={showResultsModal}
          onClose={() => {
            setShowResultsModal(false);
            setSelectedExam(null);
          }}
          examId={selectedExam.id}
          examTitle={selectedExam.title}
          onSuccess={handleShowResultsSuccess}
        />
      )}
    </div>
  );
} 