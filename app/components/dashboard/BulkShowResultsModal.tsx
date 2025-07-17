"use client";

import React, { useState } from "react";
import examAttemptService from "@/app/components/service/examAttempt.service";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

interface BulkShowResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  examId: string;
  examTitle: string;
  onSuccess?: () => void;
}

export default function BulkShowResultsModal({
  isOpen,
  onClose,
  examId,
  examTitle,
  onSuccess,
}: BulkShowResultsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleShowResults = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await examAttemptService.showExamResults(examId);
      setSuccess("Results have been successfully shown to all students for this exam.");
      
      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("Error showing exam results:", err);
      setError(err.message || "Failed to show exam results");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--background)] rounded-[var(--radius-lg)] p-6 w-full max-w-md">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            Show Exam Results
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-[var(--foreground-muted)] mb-2">
            This action will show results to all students who have completed:
          </p>
          <p className="text-lg font-medium text-[var(--foreground)]">
            {examTitle}
          </p>
        </div>

        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-[var(--radius-md)]">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This action cannot be undone. All completed exam attempts for this exam will have their results shown to students.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)] text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-[var(--radius-md)] text-sm">
            {success}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)]/80 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleShowResults}
            disabled={isLoading}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="small" className="text-white" />
                Processing...
              </>
            ) : (
              "Show Results"
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 