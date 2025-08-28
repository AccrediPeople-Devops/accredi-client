"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineQuestionMarkCircle,
  HiOutlinePlay,
  HiOutlineCheckCircle,
  HiOutlineBookOpen,
} from "react-icons/hi";
import examService, {
  Exam,
} from "@/app/components/user-dashboard/services/exam.service";
import examAttemptService from "@/app/components/user-dashboard/services/examAttempt.service";
import { ExamAttempt } from "@/app/types/examAttempt";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

interface PracticeTest extends Exam {
  status: "not-started" | "in-progress" | "completed";
  attempts: number;
  maxAttempts: number;
  lastAttempted?: string;
  score?: number;
  completedQuestions?: number;
  latestAttemptId?: string; // ✅ Add this field back
}

export default function PracticeTestsPage() {
  const router = useRouter();
  const [practiceTests, setPracticeTests] = useState<PracticeTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingExam, setIsStartingExam] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "not-started" | "in-progress" | "completed"
  >("all");

  useEffect(() => {
    const fetchPracticeTests = async () => {
      setIsLoading(true);
      try {
        // Fetch available exams
        const exams = await examService.getAvailableExams();

        // Fetch user's exam attempts to determine status
        const attempts = await examAttemptService.getMyAttempts();

        // Map exams to practice tests with status
        const practiceTestsWithStatus: PracticeTest[] = exams.map((exam) => {
          const examAttempts = attempts.filter((attempt) => {
            // Handle both string and object examId
            const attemptExamId =
              typeof attempt.examId === "string"
                ? attempt.examId
                : (attempt.examId as any)._id;
            return attemptExamId === exam._id;
          });
          const latestAttempt =
            examAttempts.length > 0
              ? examAttempts[examAttempts.length - 1]
              : null;

          let status: "not-started" | "in-progress" | "completed" =
            "not-started";
          let score: number | undefined;
          let lastAttempted: string | undefined;
          let completedQuestions: number | undefined;

          if (latestAttempt) {
            if (latestAttempt.isCompleted) {
              status = "completed";
              score = latestAttempt.percentage;
            } else {
              status = "in-progress";
              completedQuestions =
                latestAttempt.answers?.filter(
                  (a) => a.selectedOptions?.length > 0
                ).length || 0;
            }
            lastAttempted = latestAttempt.startTime;
          }

          return {
            ...exam,
            status,
            attempts: examAttempts.length,
            maxAttempts: 3, // Default max attempts
            score,
            lastAttempted,
            completedQuestions,
            latestAttemptId: latestAttempt?._id, // ✅ Store the attempt ID
          };
        });

        setPracticeTests(practiceTestsWithStatus);
      } catch (error) {
        console.error("Error fetching practice tests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPracticeTests();
  }, []);

  const getStatusIcon = (status: PracticeTest["status"]) => {
    switch (status) {
      case "completed":
        return (
          <HiOutlineCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        );
      case "in-progress":
        return (
          <HiOutlinePlay className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        );
      case "not-started":
        return (
          <HiOutlineClipboardList className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        );
      default:
        return (
          <HiOutlineClipboardList className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  const getStatusColor = (status: PracticeTest["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20";
      case "in-progress":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20";
      case "not-started":
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getButtonText = (test: PracticeTest) => {
    switch (test.status) {
      case "completed":
        return test.attempts < test.maxAttempts ? "Retake" : "View Results";
      case "in-progress":
        return "Resume";
      case "not-started":
        return "Start Test";
      default:
        return "Start Test";
    }
  };

  const getButtonColor = (test: PracticeTest) => {
    switch (test.status) {
      case "completed":
        return test.attempts < test.maxAttempts
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-gray-600 hover:bg-gray-700 text-white";
      case "in-progress":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "not-started":
        return "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)]";
      default:
        return "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)]";
    }
  };

  const handleStartExam = async (test: PracticeTest) => {
    if (isStartingExam) return; // Prevent multiple clicks

    setIsStartingExam(test._id);

    try {
      // Check if resultMethod is "auto" and handle accordingly
      if (test.resultMethod === "auto") {
        console.warn(
          `Exam ${test._id} has resultMethod "auto" which may cause backend validation issues`
        );
        // You might want to show a user-friendly message here
      }

      // Directly call the correct API endpoint
      const response = await examAttemptService.startExamAttempt(test._id);

      // Store the complete exam data in localStorage for the take exam page
      localStorage.setItem("currentExamData", JSON.stringify(response));

      // Navigate directly to the exam interface
      router.push(
        `/user-dashboard/exam-attempts/${response.examAttempt._id}/take`
      );
    } catch (error: any) {
      console.error("Error starting exam:", error);

      // Handle the specific validation error
      if (error.message && error.message.includes("resultMethod")) {
        alert(
          "This exam has an invalid configuration. Please contact support."
        );
      } else {
        alert(error.message || "Failed to start exam");
      }
    } finally {
      setIsStartingExam(null);
    }
  };

  const handleResumeExam = async (test: PracticeTest) => {
    if (isStartingExam) return; // Prevent multiple clicks

    if (!test.latestAttemptId) {
      alert("No attempt found to resume. Please start a new exam.");
      return;
    }

    setIsStartingExam(test._id);

    try {
      // Call the resume API endpoint
      const response = await examAttemptService.resumeExamAttempt(
        test.latestAttemptId
      ); // ✅ Call resume API with examId

      // Store the complete exam data in localStorage for the take exam page
      localStorage.setItem("currentExamData", JSON.stringify(response));

      // Navigate to the exam interface with existing answers
      router.push(
        `/user-dashboard/exam-attempts/${response.examAttempt._id}/take`
      );
    } catch (error: any) {
      console.error("Error resuming exam:", error);
      alert(error.message || "Failed to resume exam");
    } finally {
      setIsStartingExam(null);
    }
  };

  const handleTestAction = (test: PracticeTest) => {
    // Handle test action (start, resume, retake, view results)
    console.log(`Action for test ${test._id}:`, getButtonText(test));
    console.log("test --->", test);
    if (test.status === "not-started") {
      // Start new exam directly - call the correct API
      handleStartExam(test);
    } else if (test.status === "in-progress") {
      // Resume exam - call resume API to get current state
      handleResumeExam(test); // ✅ Use the resume function
    } else if (test.status === "completed") {
      // View results
      if (test.latestAttemptId) {
        router.push(
          `/user-dashboard/exam-attempts/${test.latestAttemptId}/result`
        );
      } else {
        alert("Unable to view results.");
      }
    }
  };

  const getProgressPercentage = (test: PracticeTest) => {
    if (test.status === "completed") return 100;
    if (test.status === "not-started") return 0;
    return test.completedQuestions
      ? Math.round((test.completedQuestions / 10) * 100)
      : 0; // Default to 10 questions
  };

  const filteredTests = practiceTests.filter(
    (test) => filter === "all" || test.status === filter
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground-muted)]">
            Loading practice tests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          Practice Tests
        </h1>
        <p className="text-[var(--foreground-muted)]">
          Test your knowledge with comprehensive practice exams
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "all", label: "All Tests" },
            { key: "not-started", label: "Not Started" },
            { key: "in-progress", label: "In Progress" },
            { key: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-[var(--radius-md)] font-medium transition-colors duration-200 ${
                filter === tab.key
                  ? "bg-[var(--primary)] text-[var(--primary-text)]"
                  : "bg-[var(--input-bg)] text-[var(--foreground)] hover:bg-[var(--border)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Practice Tests List */}
        <div className="space-y-4">
          {filteredTests.length === 0 ? (
            <div className="text-center py-12">
              <HiOutlineClipboardList className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                No Practice Tests Yet
              </h3>
              <p className="text-[var(--foreground-muted)]">
                Practice tests are not available at the moment. They will be
                added soon!
              </p>
            </div>
          ) : (
            filteredTests.map((test) => (
              <div
                key={test._id}
                className="bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 hover:bg-[var(--border)] transition-colors duration-200"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Test Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`p-2 rounded-lg ${getStatusColor(
                          test.status
                        )}`}
                      >
                        {getStatusIcon(test.status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--foreground)]">
                          {test.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-[var(--foreground-muted)]">
                          <div className="flex items-center gap-1">
                            <HiOutlineClock className="w-4 h-4" />
                            <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                              {test.timeLimit} minutes
                            </span>
                          </div>
                          <div className="text-gray-400">|</div>
                          <div className="flex items-center gap-1">
                            <HiOutlineQuestionMarkCircle className="w-4 h-4" />
                            <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                              {test.questionPaperSetId.title}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {/* {test.status !== "not-started" && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-[var(--foreground)]">
                            Progress: {test.completedQuestions || 0}/10
                          </span>
                          <span className="text-sm text-[var(--foreground-muted)]">
                            {getProgressPercentage(test)}%
                          </span>
                        </div>
                        <div className="w-full bg-[var(--card-bg)] rounded-full h-2">
                          <div
                            className="bg-[var(--primary)] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(test)}%` }}
                          ></div>
                        </div>
                      </div>
                    )} */}

                    {/* Additional Info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--foreground-muted)]">
                      <span>
                        Attempts: {test.attempts}/{test.maxAttempts}
                      </span>
                      {test.lastAttempted && (
                        <span>
                          Last attempted:{" "}
                          {new Date(test.lastAttempted).toLocaleDateString()}
                        </span>
                      )}
                      {test.score && (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Score: {Math.round(test.score || 0)}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleTestAction(test)}
                      disabled={
                        isStartingExam === test._id ||
                        (test.status === "completed" &&
                          test.attempts >= test.maxAttempts)
                      }
                      className={`px-6 py-3 font-medium rounded-[var(--radius-md)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${getButtonColor(
                        test
                      )}`}
                    >
                      {isStartingExam === test._id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Starting...
                        </div>
                      ) : (
                        getButtonText(test)
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {practiceTests.length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">
            Total Tests
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {practiceTests.filter((t) => t.status === "completed").length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">
            Completed
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {practiceTests.filter((t) => t.status === "in-progress").length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">
            In Progress
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {Math.round(
              practiceTests
                .filter((t) => t.score)
                .reduce((avg, t) => avg + (t.score || 0), 0) /
                practiceTests.filter((t) => t.score).length
            ) || 0}
            %
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">
            Average Score
          </div>
        </div>
      </div>
    </div>
  );
}
