"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiOutlineClock,
  HiOutlineSave,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";
import examAttemptService from "@/app/components/user-dashboard/services/examAttempt.service";
import { StartExamAttemptResponse, ExamAnswer } from "@/app/types/examAttempt";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

interface MinimalExam {
  _id: string;
  title: string;
  timeLimit: number;
  resultMethod: string;
  isActive: boolean;
  courseId: { _id: string; title: string };
  questions: Array<{
    _id: string;
    question: string;
    options: string[];
    multipleChoiceQuestions: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface TakeExamPageProps {
  params: Promise<{ attemptId: string }>;
}

export default function TakeExamPage({ params }: TakeExamPageProps) {
  const router = useRouter();
  const [examData, setExamData] = useState<{
    status: boolean;
    examAttempt: any;
    exam: MinimalExam;
  } | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string[] }>(
    {}
  );
  const [userDescriptions, setUserDescriptions] = useState<{
    [questionId: string]: string;
  }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const fetchExamAttempt = async () => {
      try {
        const { attemptId } = await params;
        setIsLoading(true);
        setError("");

        // Try to get exam data from localStorage first (from start exam)
        const storedExamData = localStorage.getItem("currentExamData");
        let examData: any = null;

        if (storedExamData) {
          try {
            examData = JSON.parse(storedExamData);
            // Check if this is the correct exam attempt
            if (examData.examAttempt._id === attemptId) {
              console.log("Using stored exam data");
            } else {
              examData = null; // Wrong attempt, fetch from API
            }
          } catch (e) {
            examData = null; // Invalid data, fetch from API
          }
        }

        // If no stored data or wrong attempt, we can't proceed
        if (!examData) {
          throw new Error("Exam data not found. Please start the exam again.");
        }

        const attempt = examData.examAttempt;
        const exam = examData.exam;

        // Initialize answers from existing attempt
        const existingAnswers: { [questionId: string]: string[] } = {};
        const existingDescriptions: { [questionId: string]: string } = {};

        if (attempt.answers) {
          (attempt.answers as any[]).forEach((answer: any) => {
            existingAnswers[answer.questionId] = answer.selectedOptions || [];
            existingDescriptions[answer.questionId] =
              answer.userDescription || "";
          });
        }

        setAnswers(existingAnswers);
        setUserDescriptions(existingDescriptions);

        // Set time limit from exam data
        setTimeLeft((exam.timeLimit || 60) * 60); // Convert minutes to seconds

        // Set exam data
        setExamData({
          status: true,
          examAttempt: attempt,
          exam: {
            _id: exam._id,
            title: exam.title,
            timeLimit: exam.timeLimit || 60,
            resultMethod: exam.resultMethod || "manual",
            isActive: exam.isActive !== false,
            courseId: exam.courseId,
            questions: exam.questions || [],
            createdAt: exam.createdAt || "",
            updatedAt: exam.updatedAt || "",
          },
        });
      } catch (err: any) {
        console.error("Error fetching exam attempt:", err);
        setError(
          err.message ||
            "Failed to fetch exam attempt. Please go back and start the exam again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamAttempt();
  }, [params]);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || !examData) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, examData]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (
    questionId: string,
    option: string,
    isMultiple: boolean
  ) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];

      if (isMultiple) {
        // Multiple choice - toggle option
        const newAnswers = currentAnswers.includes(option)
          ? currentAnswers.filter((a) => a !== option)
          : [...currentAnswers, option];
        return { ...prev, [questionId]: newAnswers };
      } else {
        // Single choice - replace option
        return { ...prev, [questionId]: [option] };
      }
    });
  };

  const handleDescriptionChange = (questionId: string, description: string) => {
    setUserDescriptions((prev) => ({
      ...prev,
      [questionId]: description,
    }));
  };

  const saveProgress = useCallback(async () => {
    if (!examData || !examData.exam || !examData.exam.questions) return;

    setIsSaving(true);
    setError("");

    try {
      const answersArray: ExamAnswer[] = examData.exam.questions.map(
        (question) => ({
          questionId: question._id,
          question: question.question,
          selectedOptions: answers[question._id] || [],
          correctAnswers: [],
          isCorrect: null,
          answerDescription: "",
          userDescription: userDescriptions[question._id] || "",
        })
      );

      await examAttemptService.saveProgress(
        examData.examAttempt._id!,
        answersArray
      );
      setLastSaved(new Date());
      console.log("Progress saved successfully");
    } catch (err: any) {
      console.error("Error saving progress:", err);
      setError(err.message || "Failed to save progress");
    } finally {
      setIsSaving(false);
    }
  }, [examData, answers, userDescriptions]);

  const handleSubmitExam = async () => {
    if (!examData || !examData.exam || !examData.exam.questions) return;

    setIsSubmitting(true);
    setError("");

    try {
      const answersArray: ExamAnswer[] = examData.exam.questions.map(
        (question) => ({
          questionId: question._id,
          question: question.question,
          selectedOptions: answers[question._id] || [],
          correctAnswers: [],
          isCorrect: null,
          answerDescription: "",
          userDescription: userDescriptions[question._id] || "",
        })
      );

      const endTime = new Date().toISOString();
      const timeSpent = Math.floor(
        (examData.exam.timeLimit * 60 - timeLeft) / 60
      );

      await examAttemptService.submitExam(
        examData.examAttempt._id!,
        answersArray,
        endTime,
        timeSpent
      );

      // Clean up stored exam data
      localStorage.removeItem("currentExamData");

      // Navigate to results page
      router.push(
        `/user-dashboard/exam-attempts/${examData.examAttempt._id}/result`
      );
    } catch (err: any) {
      console.error("Error submitting exam:", err);
      setError(err.message || "Failed to submit exam");
      setIsSubmitting(false);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < examData!.exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getQuestionStatus = (index: number) => {
    const question = examData!.exam.questions[index];
    const questionAnswers = answers[question._id] || [];
    return questionAnswers.length > 0 ? "answered" : "unanswered";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner size="medium" text="Loading exam..." />
      </div>
    );
  }

  if (error || !examData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              Take Exam
            </h1>
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

  const currentQuestion = examData.exam.questions[currentQuestionIndex];
  const currentAnswers = answers[currentQuestion._id] || [];
  const currentDescription = userDescriptions[currentQuestion._id] || "";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-[var(--card-bg)] border-b border-[var(--border)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">
                {examData.exam.title}
              </h1>
              <p className="text-sm text-[var(--foreground-muted)]">
                Question {currentQuestionIndex + 1} of{" "}
                {examData.exam.questions.length}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className="flex items-center gap-2 bg-[var(--input-bg)] px-3 py-2 rounded-[var(--radius-md)]">
                <HiOutlineClock className="w-5 h-5 text-[var(--primary)]" />
                <span
                  className={`font-mono font-bold ${
                    timeLeft < 300 ? "text-red-600" : "text-[var(--foreground)]"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* Save Progress */}
              <button
                onClick={saveProgress}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
              >
                <HiOutlineSave className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save"}
              </button>

              {/* Submit Exam */}
              <button
                onClick={() => setShowConfirmSubmit(true)}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-[var(--radius-md)] hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <HiOutlineCheckCircle className="w-4 h-4" />
                Submit
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-[var(--input-bg)] rounded-full h-2">
              <div
                className="bg-[var(--primary)] h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) /
                      examData.exam.questions.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {lastSaved && (
            <p className="text-xs text-[var(--foreground-muted)] mt-2">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 sticky top-24">
              <h3 className="font-semibold text-[var(--foreground)] mb-4">
                Question Navigation
              </h3>
              <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                {examData.exam.questions.map((question, index) => (
                  <button
                    key={question._id}
                    onClick={() => goToQuestion(index)}
                    className={`p-2 text-sm rounded-[var(--radius-md)] transition-colors ${
                      index === currentQuestionIndex
                        ? "bg-[var(--primary)] text-white"
                        : getQuestionStatus(index) === "answered"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-[var(--input-bg)] text-[var(--foreground)] hover:bg-[var(--border)]"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
              {/* Question */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <HiOutlineQuestionMarkCircle className="w-5 h-5 text-[var(--primary)]" />
                  <span className="text-sm text-[var(--foreground-muted)]">
                    Question {currentQuestionIndex + 1}
                  </span>
                </div>
                <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
                  {currentQuestion.question}
                </h2>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className="flex items-start gap-3 p-3 border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)] cursor-pointer transition-colors"
                    >
                      <input
                        type={
                          currentQuestion.multipleChoiceQuestions
                            ? "checkbox"
                            : "radio"
                        }
                        name={`question-${currentQuestion._id}`}
                        value={option}
                        checked={currentAnswers.includes(option)}
                        onChange={() =>
                          handleAnswerChange(
                            currentQuestion._id,
                            option,
                            currentQuestion.multipleChoiceQuestions
                          )
                        }
                        className="mt-1"
                      />
                      <span className="text-[var(--foreground)]">{option}</span>
                    </label>
                  ))}
                </div>

                {/* User Description */}
                {/* <div className="mb-6">
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-2">
                    Your Explanation (Optional)
                  </label>
                  <textarea
                    value={currentDescription}
                    onChange={(e) => handleDescriptionChange(currentQuestion._id, e.target.value)}
                    placeholder="Explain your reasoning for this answer..."
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--background)] text-[var(--foreground)] resize-none"
                    rows={3}
                  />
                </div> */}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-[var(--border)]">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--border)] transition-colors disabled:opacity-50"
                >
                  <HiOutlineArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={saveProgress}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Progress"}
                  </button>
                </div>

                <button
                  onClick={nextQuestion}
                  disabled={
                    currentQuestionIndex === examData.exam.questions.length - 1
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
                >
                  Next
                  <HiOutlineArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--background)] rounded-[var(--radius-lg)] p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Submit Exam
            </h3>
            <p className="text-[var(--foreground-muted)] mb-6">
              Are you sure you want to submit your exam? You cannot change your
              answers after submission.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--border)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  handleSubmitExam();
                }}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-[var(--radius-md)] hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Exam"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
