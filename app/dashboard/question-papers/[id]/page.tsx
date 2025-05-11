"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import questionPaperService from "../../../components/service/questionPaper.service";
import courseService from "../../../components/service/course.service";
import { QuestionPaper } from "../../../types/questionPaper";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

// Wrapper component to handle params
export default function QuestionPaperDetailPageWrapper({
  params,
}: {
  params: { id: string };
}) {
  // Handle params correctly according to Next.js 15.3.1+ requirements
  // @ts-ignore - Next.js typing is still evolving for React.use with params
  const resolvedParams = React.use(params);
  // Use type assertion to help TypeScript understand the structure
  const id = (resolvedParams as { id: string }).id;
  
  return <QuestionPaperDetailPage id={id} />;
}

// Main component that receives the ID as a prop
function QuestionPaperDetailPage({
  id,
}: {
  id: string;
}) {
  const router = useRouter();
  const [questionPaper, setQuestionPaper] = useState<QuestionPaper | null>(null);
  const [courseName, setCourseName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");

        console.log("Fetching question paper with ID:", id);
        
        // Instead of using the direct endpoint which may return 404,
        // fetch all question papers and find the one with matching ID
        const papersResponse = await questionPaperService.getAllQuestionPapers();
        console.log("All question papers response:", papersResponse);
        
        if (papersResponse) {
          let papers = [];
          
          // Handle different response formats
          if (papersResponse.questionPapers && Array.isArray(papersResponse.questionPapers)) {
            console.log("Found question papers in standard format");
            papers = papersResponse.questionPapers;
          } else if (Array.isArray(papersResponse)) {
            console.log("Found question papers as direct array");
            papers = papersResponse;
          } else if (papersResponse.data && Array.isArray(papersResponse.data)) {
            console.log("Found question papers in data property");
            papers = papersResponse.data;
          }
          
          // Find the paper with the matching ID
          const foundPaper = papers.find((p: any) => p._id === id);
          console.log("Found paper:", foundPaper);
          
          if (foundPaper) {
            setQuestionPaper(foundPaper);
            
            // Fetch course details if we have a courseId
            if (foundPaper.courseId) {
              console.log("Fetching course details for course ID:", foundPaper.courseId);
              
              try {
                // Skip direct endpoint fetch which may return 404
                // Go directly to the fallback method
                console.log("Using fallback method - fetch all courses");
                const allCoursesResponse = await courseService.getAllCourses();
                console.log("All courses response:", allCoursesResponse);
                
                let courses = [];
                if (allCoursesResponse && allCoursesResponse.courses && Array.isArray(allCoursesResponse.courses)) {
                  courses = allCoursesResponse.courses;
                } else if (Array.isArray(allCoursesResponse)) {
                  courses = allCoursesResponse;
                } else if (allCoursesResponse && allCoursesResponse.data && Array.isArray(allCoursesResponse.data)) {
                  courses = allCoursesResponse.data;
                }
                
                const foundCourse = courses.find(
                  (c: any) => c._id === foundPaper.courseId
                );
                
                if (foundCourse) {
                  setCourseName(foundCourse.title);
                } else {
                  // Fallback to a generic course name
                  setCourseName(`Course ID: ${foundPaper.courseId}`);
                }
              } catch (courseError) {
                console.error("Error fetching course:", courseError);
                // Fallback to a generic course name
                setCourseName(`Course ID: ${foundPaper.courseId}`);
              }
            }
            
            return;
          }
        }
        
        // If we couldn't find the paper, show an error
        throw new Error("Question paper not found");
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusToggle = async () => {
    if (!questionPaper) return;

    try {
      await questionPaperService.updateQuestionPaperStatus(
        questionPaper._id,
        !questionPaper.isActive
      );
      
      // Update the local state
      setQuestionPaper({
        ...questionPaper,
        isActive: !questionPaper.isActive,
      });
    } catch (err: any) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!questionPaper) return;

    if (!window.confirm("Are you sure you want to delete this question paper?")) {
      return;
    }

    try {
      await questionPaperService.deleteQuestionPaper(questionPaper._id);
      router.push("/dashboard/question-papers");
    } catch (err: any) {
      console.error("Error deleting question paper:", err);
      alert("Failed to delete question paper. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="large" text="Loading question paper..." />
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/50 rounded-[var(--radius-lg)] text-red-500 text-center">
          <h3 className="text-xl font-semibold mb-2">Error</h3>
          <p>{error}</p>
          <Link
            href="/dashboard/question-papers"
            className="inline-block mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)]"
          >
            Back to Question Papers
          </Link>
        </div>
      ) : questionPaper ? (
        <>
          {/* Header with actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)]">
                {questionPaper.title}
              </h1>
              <p className="text-[var(--foreground-muted)]">
                {courseName ? `Course: ${courseName}` : "No course assigned"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard/question-papers"
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
                Back
              </Link>
              <Link
                href={`/dashboard/question-papers/edit/${questionPaper._id}`}
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] flex items-center gap-2 hover:bg-[var(--primary-hover)] transition-colors"
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
                onClick={handleStatusToggle}
                className={`px-4 py-2 rounded-[var(--radius-md)] flex items-center gap-2 transition-colors ${
                  questionPaper.isActive
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {questionPaper.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-[var(--radius-md)] flex items-center gap-2 hover:bg-red-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-[var(--input-bg)] rounded-[var(--radius-lg)] p-6 mb-6">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
              Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-1">
                  Questions
                </h3>
                <p className="text-[var(--foreground)] text-lg font-semibold">
                  {questionPaper.content.length}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-1">
                  Status
                </h3>
                <div className="mt-1">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      questionPaper.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {questionPaper.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-1">
                  Created On
                </h3>
                <p className="text-[var(--foreground)]">
                  {formatDate(questionPaper.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="bg-[var(--input-bg)] rounded-[var(--radius-lg)] p-6">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
              Questions
            </h2>
            
            {questionPaper.content.length === 0 ? (
              <div className="text-center py-8 text-[var(--foreground-muted)]">
                No questions available in this paper.
              </div>
            ) : (
              <div className="space-y-6">
                {questionPaper.content.map((question, index) => (
                  <div
                    key={index}
                    className="bg-[var(--background)] p-6 rounded-[var(--radius-md)] border border-[var(--border)]"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">
                        Question {index + 1}
                      </h3>
                      <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-xs font-medium">
                        MCQ
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-[var(--foreground)] font-medium">
                        {question.question}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-[var(--foreground-muted)] mb-2">
                        Options:
                      </h4>
                      <div className="space-y-2 ml-4">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] ${
                              option === question.answer
                                ? "bg-green-500/10 border border-green-500/30"
                                : "bg-[var(--input-bg)] border border-[var(--border)]"
                            }`}
                          >
                            {option === question.answer && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            <span
                              className={`${
                                option === question.answer
                                  ? "text-green-500 font-medium"
                                  : "text-[var(--foreground)]"
                              }`}
                            >
                              {option}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {question.answerDescription && (
                      <div>
                        <h4 className="text-sm font-medium text-[var(--foreground-muted)] mb-2">
                          Answer Explanation:
                        </h4>
                        <div
                          className="ml-4 p-3 bg-[var(--input-bg)] rounded-[var(--radius-md)] text-[var(--foreground)] prose prose-sm prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: question.answerDescription }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-[var(--foreground-muted)]">
          Question paper not found.
        </div>
      )}
    </div>
  );
} 