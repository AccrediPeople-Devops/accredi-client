"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import examAttemptService from "@/app/components/service/examAttempt.service";
import { ExamAttemptWithDetails } from "@/app/types/examAttempt";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

interface ExamAttemptPageProps {
  params: Promise<{ id: string }>;
}

export default function ExamAttemptPage({ params }: ExamAttemptPageProps) {
  const router = useRouter();
  const [examAttempt, setExamAttempt] = useState<ExamAttemptWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExamAttempt = async () => {
      try {
        const { id } = await params;
        setIsLoading(true);
        setError("");
        const attempt = await examAttemptService.getExamAttemptById(id);
        setExamAttempt(attempt);
      } catch (err: any) {
        setError(err.message || "Failed to fetch exam attempt");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamAttempt();
  }, [params]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (isCompleted: boolean, isResultShown: boolean) => {
    if (!isCompleted) {
      return (
        <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
          In Progress
        </span>
      );
    }
    if (isResultShown) {
      return (
        <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
          Completed
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
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
        <LoadingSpinner size="medium" text="Loading exam attempt..." />
      </div>
    );
  }

  if (error || !examAttempt) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Exam Attempt</h1>
          </div>
          <Link
            href="/dashboard/exam-attempts"
            className="px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)]/80 transition-colors"
          >
            Back to Exam Attempts
          </Link>
        </div>
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error || "Exam attempt not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Exam Attempt Details</h1>
          <p className="text-[var(--foreground-muted)]">
            Review student's exam attempt and results
          </p>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/dashboard/exam-attempts/edit/${examAttempt._id}`}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors"
          >
            Edit Attempt
          </Link>
          <Link
            href="/dashboard/exam-attempts"
            className="px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)]/80 transition-colors"
          >
            Back to List
          </Link>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
        <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">Student</p>
            <p className="text-lg font-medium text-[var(--foreground)]">
              {examAttempt.userId.fullName}
            </p>
            <p className="text-sm text-[var(--foreground-muted)]">
              {examAttempt.userId.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">Exam</p>
            <p className="text-lg font-medium text-[var(--foreground)]">
              {examAttempt.examId.title}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">Course</p>
            <p className="text-lg font-medium text-[var(--foreground)]">
              {examAttempt.courseId.title}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">Status</p>
            <div className="mt-1">
              {getStatusBadge(examAttempt.isCompleted, examAttempt.isResultShown)}
            </div>
          </div>
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">Started</p>
            <p className="text-lg font-medium text-[var(--foreground)]">
              {examAttempt.startTime ? formatDate(examAttempt.startTime) : "N/A"}
            </p>
          </div>
          {examAttempt.endTime && (
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Completed</p>
              <p className="text-lg font-medium text-[var(--foreground)]">
                {formatDate(examAttempt.endTime)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      {examAttempt.isCompleted && (
        <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
          <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">Results Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-[var(--foreground-muted)]">Total Questions</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {examAttempt.totalQuestions}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-[var(--foreground-muted)]">Correct Answers</p>
              <p className="text-2xl font-bold text-green-600">
                {examAttempt.correctAnswers}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-[var(--foreground-muted)]">Incorrect Answers</p>
              <p className="text-2xl font-bold text-red-600">
                {examAttempt.incorrectAnswers}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-[var(--foreground-muted)]">Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(examAttempt.percentage)}`}>
                {examAttempt.percentage}%
              </p>
            </div>
          </div>
          {examAttempt.timeSpent && (
            <div className="mt-4 text-center">
              <p className="text-sm text-[var(--foreground-muted)]">Time Spent</p>
              <p className="text-lg font-medium text-[var(--foreground)]">
                {examAttempt.timeSpent} minutes
              </p>
            </div>
          )}
        </div>
      )}

      {/* Answers */}
      <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
        <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">Question Answers</h2>
        <div className="space-y-6">
          {examAttempt.answers.map((answer, index) => (
            <div key={answer._id} className="border border-[var(--border)] rounded-[var(--radius-md)] p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-medium text-[var(--foreground)]">
                  Question {index + 1}
                </h3>
                {examAttempt.isCompleted && (
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      answer.isCorrect
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {answer.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                )}
              </div>
              
              <p className="text-[var(--foreground)] mb-3">{answer.question}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-[var(--foreground-muted)] mb-2">
                    Student's Answer:
                  </p>
                  {answer.selectedOptions.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {answer.selectedOptions.map((option, optIndex) => (
                        <li key={optIndex} className="text-[var(--foreground)]">
                          {option}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[var(--foreground-muted)] italic">No answer provided</p>
                  )}
                </div>
                
                {examAttempt.isCompleted && (
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground-muted)] mb-2">
                      Correct Answer:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {answer.correctAnswers.map((option, optIndex) => (
                        <li key={optIndex} className="text-green-600">
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {answer.answerDescription && (
                <div className="mt-3 p-3 bg-[var(--background)] rounded-[var(--radius-md)]">
                  <p className="text-sm font-medium text-[var(--foreground-muted)] mb-1">
                    Explanation:
                  </p>
                  <p className="text-[var(--foreground)] text-sm">
                    {answer.answerDescription}
                  </p>
                </div>
              )}
              
              {answer.userDescription && (
                <div className="mt-3 p-3 bg-[var(--background)] rounded-[var(--radius-md)]">
                  <p className="text-sm font-medium text-[var(--foreground-muted)] mb-1">
                    Student's Note:
                  </p>
                  <p className="text-[var(--foreground)] text-sm">
                    {answer.userDescription}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 