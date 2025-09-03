"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import examAttemptService from "@/app/components/service/examAttempt.service";
import { ExamAttemptWithDetails, UpdateExamAttemptRequest } from "@/app/types/examAttempt";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

interface ExamAttemptEditPageProps {
  params: Promise<{ id: string }>;
}

export default function ExamAttemptEditPage({ params }: ExamAttemptEditPageProps) {
  const router = useRouter();
  const [examAttempt, setExamAttempt] = useState<ExamAttemptWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<UpdateExamAttemptRequest>({
    percentage: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    isResultShown: false,
    resultMethod: "manual",
    timeSpent: 0,
    endTime: "",
  });

  useEffect(() => {
    const fetchExamAttempt = async () => {
      try {
        const { id } = await params;
        setIsLoading(true);
        setError("");
        const attempt = await examAttemptService.getExamAttemptById(id);
        setExamAttempt(attempt);
        
        // Initialize form data
        setFormData({
          percentage: attempt.percentage || 0,
          correctAnswers: attempt.correctAnswers || 0,
          incorrectAnswers: attempt.incorrectAnswers || 0,
          isResultShown: attempt.isResultShown || false,
          resultMethod: attempt.resultMethod || "manual",
          timeSpent: attempt.timeSpent || 0,
          endTime: attempt.endTime || "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to fetch exam attempt");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamAttempt();
  }, [params]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      if (!examAttempt?._id) {
        throw new Error("Exam attempt ID not found");
      }

      // Validate form data
      const correctAnswers = formData.correctAnswers || 0;
      const incorrectAnswers = formData.incorrectAnswers || 0;
      const percentage = formData.percentage || 0;
      
      if (correctAnswers + incorrectAnswers !== examAttempt.totalQuestions) {
        throw new Error(`Total answers (${correctAnswers + incorrectAnswers}) must equal total questions (${examAttempt.totalQuestions})`);
      }

      if (percentage < 0 || percentage > 100) {
        throw new Error("Percentage must be between 0 and 100");
      }

      // Calculate percentage if not provided
      const calculatedPercentage = Math.round((correctAnswers / examAttempt.totalQuestions) * 100);
      const finalPercentage = percentage || calculatedPercentage;

      const updateData: UpdateExamAttemptRequest = {
        ...formData,
        percentage: finalPercentage,
        isCompleted: true, // Mark as completed when updating
      };

      
      await examAttemptService.updateExamAttempt(examAttempt._id, updateData);
      
      // Redirect back to the exam attempts list
      router.push("/dashboard/exam-attempts");
    } catch (err: any) {
      setError(err.message || "Failed to update exam attempt");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Exam Attempt</h1>
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
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Exam Attempt</h1>
          <p className="text-[var(--foreground-muted)]">
            Update exam results and settings
          </p>
        </div>
        <Link
          href="/dashboard/exam-attempts"
          className="px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)]/80 transition-colors"
        >
          Back to Exam Attempts
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

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
            <p className="text-sm text-[var(--foreground-muted)]">Started</p>
            <p className="text-lg font-medium text-[var(--foreground)]">
              {examAttempt.startTime ? formatDate(examAttempt.startTime) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">Total Questions</p>
            <p className="text-lg font-medium text-[var(--foreground)]">
              {examAttempt.totalQuestions}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">Current Status</p>
            <p className="text-lg font-medium text-[var(--foreground)]">
              {examAttempt.isCompleted ? "Completed" : "In Progress"}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
          <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">Update Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-2">
                Correct Answers *
              </label>
              <input
                type="number"
                name="correctAnswers"
                value={formData.correctAnswers}
                onChange={handleInputChange}
                min="0"
                max={examAttempt.totalQuestions}
                className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-2">
                Incorrect Answers *
              </label>
              <input
                type="number"
                name="incorrectAnswers"
                value={formData.incorrectAnswers}
                onChange={handleInputChange}
                min="0"
                max={examAttempt.totalQuestions}
                className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-2">
                Percentage (%)
              </label>
              <input
                type="number"
                name="percentage"
                value={formData.percentage}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.1"
                                 className={`w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${getScoreColor(formData.percentage || 0)}`}
              />
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                Leave empty to auto-calculate
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-2">
                Time Spent (minutes)
              </label>
              <input
                type="number"
                name="timeSpent"
                value={formData.timeSpent}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-2">
                End Time
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime ? formData.endTime.slice(0, 16) : ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-2">
                Result Method
              </label>
              <select
                name="resultMethod"
                value={formData.resultMethod}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="manual">Manual</option>
                <option value="auto">Automatic</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isResultShown"
                checked={formData.isResultShown}
                onChange={handleInputChange}
                className="h-4 w-4 text-[var(--primary)] rounded border-[var(--border)] focus:ring-[var(--primary)]"
              />
              <span className="ml-2 text-sm text-[var(--foreground)]">
                Show results to student
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/dashboard/exam-attempts"
            className="px-6 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)]/80 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <LoadingSpinner size="small" className="text-white" />
                Updating...
              </>
            ) : (
              "Update Exam Attempt"
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 