"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import examAttemptService from "@/app/components/user-dashboard/services/examAttempt.service";
import { ExamAttempt } from "@/app/types/examAttempt";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

export default function UserExamAttemptsPage() {
  const router = useRouter();
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExamAttempts();
  }, []);

  const fetchExamAttempts = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await examAttemptService.getMyAttempts();

      // Handle different response formats
      let attempts: ExamAttempt[] = [];
      if (Array.isArray(response)) {
        attempts = response;
      } else if (
        response &&
        typeof response === "object" &&
        "examAttempts" in response &&
        Array.isArray((response as any).examAttempts)
      ) {
        attempts = (response as any).examAttempts;
      } else if (
        response &&
        typeof response === "object" &&
        "data" in response &&
        Array.isArray((response as any).data)
      ) {
        attempts = (response as any).data;
      } else if (
        response &&
        typeof response === "object" &&
        "attempts" in response &&
        Array.isArray((response as any).attempts)
      ) {
        attempts = (response as any).attempts;
      } else {
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
        <LoadingSpinner size="medium" text="Loading your exam attempts..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            My Exam Attempts
          </h1>
          <p className="text-[var(--foreground-muted)]">
            View and manage your exam attempts
          </p>
        </div>
        <Link
          href="/user-dashboard/practice-tests"
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors"
        >
          Take New Exam
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          <h3 className="font-medium mb-2">Error Loading Exam Attempts</h3>
          <p>{error}</p>
          <button
            onClick={fetchExamAttempts}
            className="mt-2 px-3 py-1 bg-[var(--error)] text-white rounded text-sm hover:bg-[var(--error)]/80 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!Array.isArray(examAttempts) || examAttempts.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-[var(--foreground-muted)] mb-4">
            <svg
              className="mx-auto h-12 w-12 text-[var(--foreground-muted)]"
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
          </div>
          <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
            No exam attempts yet
          </h3>
          <p className="text-[var(--foreground-muted)] mb-4">
            Start your first exam to see your attempts here.
          </p>
          <Link
            href="/user-dashboard/practice-tests"
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors"
          >
            Take Your First Exam
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {Array.isArray(examAttempts) &&
            examAttempts.map((attempt) => (
              <div
                key={attempt._id}
                className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)] border border-[var(--border)]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-[var(--foreground)]">
                      Exam Attempt
                    </h3>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Started:{" "}
                      {attempt.startTime
                        ? formatDate(attempt.startTime)
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(attempt.isCompleted, attempt.isResultShown)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Total Questions
                    </p>
                    <p className="text-lg font-medium text-[var(--foreground)]">
                      {attempt.totalQuestions}
                    </p>
                  </div>
                  {attempt.isCompleted && (
                    <>
                      <div>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          Score
                        </p>
                        <p
                          className={`text-lg font-medium ${getScoreColor(
                            attempt.percentage
                          )}`}
                        >
                          {Math.round(attempt.percentage || 0)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          Correct Answers
                        </p>
                        <p className="text-lg font-medium text-[var(--foreground)]">
                          {attempt.correctAnswers}/{attempt.totalQuestions}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-[var(--foreground-muted)]">
                    {attempt.timeSpent && (
                      <span>Time spent: {attempt.timeSpent} minutes</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {!attempt.isCompleted ? (
                      <button
                        onClick={() =>
                          router.push(
                            `/user-dashboard/exam-attempts/${attempt._id}/take`
                          )
                        }
                        className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors"
                      >
                        Continue Exam
                      </button>
                    ) : attempt.isResultShown ? (
                      <button
                        onClick={() =>
                          router.push(
                            `/user-dashboard/exam-attempts/${attempt._id}/result`
                          )
                        }
                        className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors"
                      >
                        View Result
                      </button>
                    ) : (
                      <span className="px-4 py-2 text-[var(--foreground-muted)] bg-[var(--background)] rounded-[var(--radius-md)]">
                        Pending Review
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
