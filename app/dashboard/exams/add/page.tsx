"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import examService from "../../../components/service/exam.service";
import courseService from "../../../components/service/course.service";
import questionPaperService from "../../../components/service/questionPaper.service";
import { ExamFormData } from "../../../types/exam";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

interface CourseOption {
  _id: string;
  title: string;
}

interface QuestionPaperOption {
  _id: string;
  title: string;
}

export default function AddExamPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ExamFormData>({
    title: "",
    courseId: "",
    questionPaperSetId: "",
    timeLimit: 60,
    resultMethod: "manual",
    isActive: true,
  });
  
  const [availableCourses, setAvailableCourses] = useState<CourseOption[]>([]);
  const [availableQuestionPapers, setAvailableQuestionPapers] = useState<QuestionPaperOption[]>([]);
  const [filteredQuestionPapers, setFilteredQuestionPapers] = useState<QuestionPaperOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [error, setError] = useState("");

  // Fetch courses and question papers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingInitial(true);
        setError("");

        // Fetch courses
        const coursesResponse = await courseService.getAllCourses();
        console.log("Courses response:", coursesResponse);
        
        if (coursesResponse) {
          let courses = [];
          
          if (coursesResponse.courses && Array.isArray(coursesResponse.courses)) {
            courses = coursesResponse.courses;
          } else if (Array.isArray(coursesResponse)) {
            courses = coursesResponse;
          } else if (coursesResponse.data && Array.isArray(coursesResponse.data)) {
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
        }

        // Fetch question papers
        const questionPapersResponse = await questionPaperService.getAllQuestionPapers();
        console.log("Question papers response:", questionPapersResponse);
        
        if (questionPapersResponse) {
          let questionPapers = [];
          
          if (questionPapersResponse.questionPapers && Array.isArray(questionPapersResponse.questionPapers)) {
            questionPapers = questionPapersResponse.questionPapers;
          } else if (Array.isArray(questionPapersResponse)) {
            questionPapers = questionPapersResponse;
          } else if (questionPapersResponse.data && Array.isArray(questionPapersResponse.data)) {
            questionPapers = questionPapersResponse.data;
          }
          
          if (questionPapers.length > 0) {
            const papers = questionPapers
              .filter((paper: any) => !paper.isDeleted)
              .map((paper: any) => ({
                _id: paper._id,
                title: paper.title,
                courseId: paper.courseId,
              }));
            
            setAvailableQuestionPapers(papers);
            // Initially show empty list since no course is selected
            setFilteredQuestionPapers([]);
          }
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoadingInitial(false);
      }
    };

    fetchData();
  }, []);

  // Filter question papers when course changes
  useEffect(() => {
    if (formData.courseId) {
      const papers = availableQuestionPapers.filter(
        (paper: any) => paper.courseId === formData.courseId
      );
      setFilteredQuestionPapers(papers);
      
      // Reset question paper selection if the current one doesn't belong to this course
      const currentPaperMatchesCourse = papers.some(paper => paper._id === formData.questionPaperSetId);
      if (!currentPaperMatchesCourse) {
        setFormData(prev => ({
          ...prev,
          questionPaperSetId: ""
        }));
      }
    } else {
      setFilteredQuestionPapers([]);
      setFormData(prev => ({
        ...prev,
        questionPaperSetId: ""
      }));
    }
  }, [formData.courseId, availableQuestionPapers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // For timeLimit, convert to number
    if (name === 'timeLimit') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title) {
        throw new Error("Exam title is required");
      }
      if (!formData.courseId) {
        throw new Error("Course is required");
      }
      if (!formData.questionPaperSetId) {
        throw new Error("Question paper is required");
      }
      if (formData.timeLimit <= 0) {
        throw new Error("Time limit must be greater than 0 minutes");
      }

      console.log("Submitting exam data:", formData);
      
      // Submit the exam
      const response = await examService.createExam(formData);
      console.log("Response from service:", response);

      // If we get any response back, consider it successful
      // The backend API might be sending back a different structure than expected
      if (response) {
        // Check if the response has exam or status property
        if (
          (response.exam && response.status === true) || 
          response._id || 
          (response.data && response.data._id)
        ) {
          router.push("/dashboard/exams");
          return;
        }
        
        // If we get a response but no success indicators, check for error message
        if (response.message) {
          setError(response.message);
        } else {
          // If we can't determine a specific pattern but got a response,
          // assume success and redirect
          console.log("No specific success indicator found, but got a response. Assuming success.");
          router.push("/dashboard/exams");
        }
      } else {
        setError("Failed to create exam. No response from server.");
      }
    } catch (err: any) {
      console.error("Error creating exam:", err);
      setError(err.message || "An unexpected error occurred while creating the exam");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Add New Exam</h1>
          <p className="text-[var(--foreground-muted)]">
            Create a new exam for your course
          </p>
        </div>
        <Link
          href="/dashboard/exams"
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
          Back to Exams
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {isLoadingInitial ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner size="medium" text="Loading..." />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 gap-6">
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
                  placeholder="e.g. Midterm Exam - Web Development"
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

              <div>
                <label 
                  htmlFor="questionPaperSetId" 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                >
                  Question Paper *
                </label>
                <select
                  id="questionPaperSetId"
                  name="questionPaperSetId"
                  value={formData.questionPaperSetId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  required
                  disabled={!formData.courseId || filteredQuestionPapers.length === 0}
                >
                  <option value="">
                    {!formData.courseId 
                      ? "Select a course first" 
                      : filteredQuestionPapers.length === 0 
                        ? "No question papers available for this course" 
                        : "Select a question paper"}
                  </option>
                  {filteredQuestionPapers.map((paper) => (
                    <option key={paper._id} value={paper._id}>
                      {paper.title}
                    </option>
                  ))}
                </select>
                {formData.courseId && filteredQuestionPapers.length === 0 && (
                  <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                    Please add question papers for this course first
                  </p>
                )}
              </div>

              <div>
                <label 
                  htmlFor="timeLimit" 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                >
                  Time Limit (minutes) *
                </label>
                <input 
                  type="number"
                  id="timeLimit"
                  name="timeLimit"
                  value={formData.timeLimit}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  required
                />
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                  {formData.timeLimit >= 60 
                    ? `${Math.floor(formData.timeLimit / 60)} hour${Math.floor(formData.timeLimit / 60) > 1 ? 's' : ''}${formData.timeLimit % 60 ? ` ${formData.timeLimit % 60} min` : ''}` 
                    : `${formData.timeLimit} minutes`}
                </p>
              </div>

              <div>
                <label 
                  htmlFor="resultMethod" 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                >
                  Result Method *
                </label>
                <select
                  id="resultMethod"
                  name="resultMethod"
                  value={formData.resultMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  required
                >
                  <option value="manual">Manual (Instructor will grade)</option>
                  <option value="auto">Automatic (System will grade)</option>
                </select>
              </div>

              <div>
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
                  Creating...
                </>
              ) : (
                "Create Exam"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 