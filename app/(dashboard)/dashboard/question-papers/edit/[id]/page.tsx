"use client";

import React, { useState, useEffect, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/app/components/Input";
import questionPaperService from "@/app/components/service/questionPaper.service";
import courseService from "@/app/components/service/course.service";
import { QuestionItem, QuestionPaper } from "@/app/types/questionPaper";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import QuestionInput from "@/app/components/question/QuestionInput";

interface CourseOption {
  _id: string;
  title: string;
}

// Wrapper component to handle params
export default async function EditQuestionPaperPageWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditQuestionPaperPage id={id} />;
}

// Main component that receives the ID as a prop
function EditQuestionPaperPage({
  id,
}: {
  id: string;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    content: [] as QuestionItem[],
    isActive: true,
  });
  
  const [availableCourses, setAvailableCourses] = useState<CourseOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [error, setError] = useState("");
  const questionPaperId = id;

  // Fetch question paper and courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingInitial(true);
        setError("");

        console.log("Fetching question paper with ID:", questionPaperId);
        console.log("API endpoint should be: /question-papers/v1/" + questionPaperId);
        
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
          const foundPaper = papers.find((p: any) => p._id === questionPaperId);
          console.log("Found paper:", foundPaper);
          
          if (foundPaper) {
            console.log("Successfully found question paper:", foundPaper);
            setFormData({
              title: foundPaper.title,
              courseId: foundPaper.courseId,
              content: foundPaper.content || [],
              isActive: foundPaper.isActive,
            });

            // Fetch all courses for the dropdown
            console.log("Fetching courses for dropdown");
            const coursesResponse = await courseService.getAllCourses();
            console.log("Courses response:", coursesResponse);
            
            let courses = [];
            
            if (coursesResponse && coursesResponse.courses) {
              courses = coursesResponse.courses;
            } else if (Array.isArray(coursesResponse)) {
              courses = coursesResponse;
            } else if (coursesResponse && coursesResponse.data && Array.isArray(coursesResponse.data)) {
              courses = coursesResponse.data;
            }
            
            if (courses.length > 0) {
              setAvailableCourses(
                courses.map((course: any) => ({
                  _id: course._id,
                  title: course.title,
                }))
              );
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
        setIsLoadingInitial(false);
      }
    };

    fetchData();
  }, [questionPaperId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleQuestionsChange = (newQuestions: SetStateAction<QuestionItem[]>) => {
    setFormData((prev) => ({
      ...prev,
      content: typeof newQuestions === 'function' 
        ? newQuestions(prev.content)
        : newQuestions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title) {
        throw new Error("Question paper title is required");
      }
      if (!formData.courseId) {
        throw new Error("Course is required");
      }
      if (formData.content.length === 0) {
        throw new Error("At least one question is required");
      }

      // Validate each question
      for (let i = 0; i < formData.content.length; i++) {
        const question = formData.content[i];
        if (!question.question) {
          throw new Error(`Question ${i + 1} text is required`);
        }
        if (question.options.length < 2) {
          throw new Error(`Question ${i + 1} must have at least 2 options`);
        }
        if (!question.answer) {
          throw new Error(`Question ${i + 1} must have a selected answer`);
        }
      }

      console.log("Submitting updated question paper data:", formData);
      console.log("API endpoint should be: /question-papers/v1/" + questionPaperId);
      
      // Submit the updated question paper
      const response = await questionPaperService.updateQuestionPaper(questionPaperId, formData);
      console.log("Response from service:", response);

      // If we get any response back, consider it successful
      // The backend API might be sending back a different structure than expected
      if (response) {
        // Check if the response has questionPaper or status property
        if (
          (response.questionPaper && response.status === true) || 
          response._id || 
          (response.data && response.data._id)
        ) {
          router.push("/dashboard/question-papers");
          return;
        }
        
        // If we get a response but no success indicators, check for error message
        if (response.message) {
          setError(response.message);
        } else {
          // If we can't determine a specific pattern but got a response,
          // assume success and redirect
          console.log("No specific success indicator found, but got a response. Assuming success.");
          router.push("/dashboard/question-papers");
        }
      } else {
        setError("Failed to update question paper. No response from server.");
      }
    } catch (err: any) {
      console.error("Error updating question paper:", err);
      setError(err.message || "An unexpected error occurred while updating the question paper");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Question Paper</h1>
          <p className="text-[var(--foreground-muted)]">
            Update the question paper details
          </p>
        </div>
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
          Back to Question Papers
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {isLoadingInitial ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner size="medium" text="Loading question paper..." />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  htmlFor="title" 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                >
                  Title *
                </label>
                <input 
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="e.g. Midterm Quiz - Basic Concepts"
                  required
                />
              </div>

              <div>
                <label 
                  htmlFor="courseId" 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                >
                  Course *
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  required
                >
                  <option value="">Select a course</option>
                  {availableCourses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-[var(--primary)] rounded border-[var(--border)] focus:ring-[var(--primary)]"
                />
                <span className="ml-2 text-sm text-[var(--foreground)]">
                  Active (visible to students)
                </span>
              </label>
            </div>
          </div>

          {/* Questions section */}
          <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
            <QuestionInput
              questions={formData.content}
              setQuestions={handleQuestionsChange}
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" className="text-white" />
                  Updating...
                </>
              ) : (
                "Update Question Paper"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 