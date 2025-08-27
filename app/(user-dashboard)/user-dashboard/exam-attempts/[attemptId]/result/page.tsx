"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  HiOutlineCheckCircle, 
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineBookOpen
} from "react-icons/hi";
import examAttemptService from "@/app/components/user-dashboard/services/examAttempt.service";
import { ExamAttemptResponse, ExamAttempt } from "@/app/types/examAttempt";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

// Type for the actual API response structure
interface ExamResultResponse {
  status: boolean;
  examResult: {
    _id: string;
    userId: string;
    examId: {
      _id: string;
      title: string;
    };
    courseId: {
      _id: string;
      title: string;
    };
    questionPaperSetId: string;
    isCompleted: boolean;
    answers: Array<{
      questionId: string;
      question: string;
      selectedOptions: string[];
      correctAnswers: string[];
      isCorrect: boolean;
      answerDescription: string;
      userDescription: string;
      _id: string;
    }>;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    percentage: number;
    isResultShown: boolean;
    resultMethod: string;
    isActive: boolean;
    isDeleted: boolean;
    startTime: string;
    endTime: string;
    timeSpent: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface ExamResultPageProps {
  params: Promise<{ attemptId: string }>;
}

export default function ExamResultPage({ params }: ExamResultPageProps) {
  const [examResult, setExamResult] = useState<ExamResultResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState<{ [questionId: string]: boolean }>({});

  useEffect(() => {
    const fetchExamResult = async () => {
      try {
        const { attemptId } = await params;
        setIsLoading(true);
        setError("");
        const response = await examAttemptService.getExamResult(attemptId);
        setExamResult(response as unknown as ExamResultResponse);
      } catch (err: any) {
        console.error("Error fetching exam result:", err);
        setError(err.message || "Failed to fetch exam result");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamResult();
  }, [params]);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100 text-green-800";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const toggleQuestionExpansion = (questionId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner size="medium" text="Loading exam results..." />
      </div>
    );
  }

  if (error || !examResult) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Exam Results</h1>
          </div>
          <Link
            href="/user-dashboard/exam-attempts"
            className="px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)]/80 transition-colors"
          >
            Back to Exam Attempts
          </Link>
        </div>
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error || "Exam result not found"}
        </div>
      </div>
    );
  }

  const result = examResult.examResult;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Exam Results</h1>
          <p className="text-[var(--foreground-muted)]">
            Your performance on {result.examId.title}
          </p>
        </div>
        <Link
          href="/user-dashboard/exam-attempts"
          className="px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)]/80 transition-colors"
        >
          Back to Exam Attempts
        </Link>
      </div>

      {/* Score Summary */}
      <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(result.percentage)} mb-2`}>
              {result.percentage}%
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getScoreBadge(result.percentage)}`}>
              {result.percentage >= 80 ? "Excellent" : result.percentage >= 60 ? "Good" : "Needs Improvement"}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--foreground)] mb-1">
              {result.correctAnswers}/{result.totalQuestions}
            </div>
            <div className="text-sm text-[var(--foreground-muted)]">Correct Answers</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--foreground)] mb-1">
              {result.incorrectAnswers}
            </div>
            <div className="text-sm text-[var(--foreground-muted)]">Incorrect Answers</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--foreground)] mb-1">
              {result.timeSpent || 0}
            </div>
            <div className="text-sm text-[var(--foreground-muted)]">Minutes Spent</div>
          </div>
        </div>
      </div>

      {/* Exam Details */}
      <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Exam Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">Course</p>
            <p className="font-medium text-[var(--foreground)]">{result.courseId.title}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">Exam</p>
            <p className="font-medium text-[var(--foreground)]">{result.examId.title}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">Started</p>
            <p className="font-medium text-[var(--foreground)]">
              {result.startTime ? formatDate(result.startTime) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">Completed</p>
            <p className="font-medium text-[var(--foreground)]">
              {result.endTime ? formatDate(result.endTime) : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Question Review</h2>
        
        <div className="space-y-4">
          {result.answers.map((answer, index) => (
            <div
              key={answer.questionId}
              className="border border-[var(--border)] rounded-[var(--radius-md)] overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-[var(--background)] transition-colors"
                onClick={() => toggleQuestionExpansion(answer.questionId)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-[var(--foreground-muted)]">
                        Question {index + 1}
                      </span>
                      {answer.isCorrect ? (
                        <HiOutlineCheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <HiOutlineXCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <p className="text-[var(--foreground)] font-medium">{answer.question}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      answer.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {answer.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                    <svg
                      className={`w-5 h-5 text-[var(--foreground-muted)] transition-transform ${
                        expandedQuestions[answer.questionId] ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {expandedQuestions[answer.questionId] && (
                <div className="border-t border-[var(--border)] p-4 bg-[var(--background)]">
                  <div className="space-y-4">
                    {/* Your Answer */}
                    <div>
                      <h4 className="font-medium text-[var(--foreground)] mb-2">Your Answer:</h4>
                      <div className="space-y-1">
                        {answer.selectedOptions.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`px-3 py-2 rounded-[var(--radius-md)] ${
                              answer.correctAnswers.includes(option)
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                        {answer.selectedOptions.length === 0 && (
                          <div className="px-3 py-2 rounded-[var(--radius-md)] bg-gray-100 text-gray-600 border border-gray-200">
                            No answer provided
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Correct Answer */}
                    <div>
                      <h4 className="font-medium text-[var(--foreground)] mb-2">Correct Answer:</h4>
                      <div className="space-y-1">
                        {answer.correctAnswers.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="px-3 py-2 rounded-[var(--radius-md)] bg-green-100 text-green-800 border border-green-200"
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Explanation */}
                    {answer.answerDescription && (
                      <div>
                        <h4 className="font-medium text-[var(--foreground)] mb-2">Explanation:</h4>
                        <p className="text-[var(--foreground-muted)] bg-[var(--input-bg)] p-3 rounded-[var(--radius-md)]">
                          {answer.answerDescription}
                        </p>
                      </div>
                    )}

                    {/* Your Explanation */}
                    {answer.userDescription && (
                      <div>
                        <h4 className="font-medium text-[var(--foreground)] mb-2">Your Explanation:</h4>
                        <p className="text-[var(--foreground-muted)] bg-[var(--input-bg)] p-3 rounded-[var(--radius-md)]">
                          {answer.userDescription}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Link
          href="/user-dashboard/practice-tests"
          className="px-6 py-3 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors"
        >
          Take Another Exam
        </Link>
        <Link
          href="/user-dashboard/exam-attempts"
          className="px-6 py-3 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)]/80 transition-colors"
        >
          View All Attempts
        </Link>
      </div>
    </div>
  );
} 