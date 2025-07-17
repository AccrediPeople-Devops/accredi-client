"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import examService from "@/app/components/user-dashboard/services/exam.service";
import examAttemptService from "@/app/components/user-dashboard/services/examAttempt.service";
import { Exam } from "@/app/components/user-dashboard/services/exam.service";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

interface StartExamPageProps {
  params: Promise<{ examId: string }>;
}

export default function StartExamPage({ params }: StartExamPageProps) {
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const { examId } = await params;
        setIsLoading(true);
        setError("");
        const examData = await examService.getExamById(examId);
        setExam(examData);
      } catch (err: any) {
        console.error("Error fetching exam:", err);
        setError(err.message || "Failed to fetch exam");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExam();
  }, [params]);

  const handleStartExam = async () => {
    if (!exam) return;

    setIsStarting(true);
    setError("");

    try {
      const response = await examAttemptService.startExamAttempt(exam._id);
      console.log("Started exam attempt:", response);
      
      // Navigate to the exam interface
      router.push(`/user-dashboard/exam-attempts/${response.examAttempt._id}/take`);
    } catch (err: any) {
      console.error("Error starting exam:", err);
      setError(err.message || "Failed to start exam");
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner size="medium" text="Loading exam details..." />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Start Exam</h1>
          </div>
          <Link
            href="/user-dashboard/practice-tests"
            className="px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)]/80 transition-colors"
          >
            Back to Practice Tests
          </Link>
        </div>
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error || "Exam not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Start Exam</h1>
          <p className="text-[var(--foreground-muted)]">
            Review exam details before starting
          </p>
        </div>
        <Link
          href="/user-dashboard/practice-tests"
          className="px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)]/80 transition-colors"
        >
          Back to Practice Tests
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Exam Details */}
      <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Exam Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
              {exam.title}
            </h3>
            <p className="text-[var(--foreground-muted)] mb-4">
              Course: {exam.courseId.title}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--foreground-muted)]">Time Limit:</span>
              <span className="font-medium text-[var(--foreground)]">{exam.timeLimit} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--foreground-muted)]">Question Set:</span>
              <span className="font-medium text-[var(--foreground)]">{exam.questionPaperSetId.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--foreground-muted)]">Result Method:</span>
              <span className="font-medium text-[var(--foreground)] capitalize">
                {exam.resultMethod}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Instructions */}
      <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Instructions</h2>
        
        <div className="space-y-3 text-[var(--foreground-muted)]">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[var(--primary)] rounded-full mt-2 flex-shrink-0"></div>
            <p>You have {exam.timeLimit} minutes to complete this exam.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[var(--primary)] rounded-full mt-2 flex-shrink-0"></div>
            <p>Answer all questions in the question set to the best of your ability.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[var(--primary)] rounded-full mt-2 flex-shrink-0"></div>
            <p>You can save your progress and return later if needed.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[var(--primary)] rounded-full mt-2 flex-shrink-0"></div>
            <p>Once you submit the exam, you cannot change your answers.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[var(--primary)] rounded-full mt-2 flex-shrink-0"></div>
            <p>Results will be available after the exam is reviewed by an instructor.</p>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-center">
        <button
          onClick={handleStartExam}
          disabled={isStarting}
          className="px-8 py-3 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg font-medium"
        >
          {isStarting ? (
            <>
              <LoadingSpinner size="small" className="text-white" />
              Starting Exam...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Start Exam Now
            </>
          )}
        </button>
      </div>
    </div>
  );
} 