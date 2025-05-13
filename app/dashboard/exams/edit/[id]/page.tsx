"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import examService from "../../../../components/service/exam.service";
import courseService from "../../../../components/service/course.service";
import questionPaperService from "../../../../components/service/questionPaper.service";
import { Exam, ExamFormData } from "../../../../types/exam";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";

interface CourseOption {
  _id: string;
  title: string;
}

interface QuestionPaperOption {
  _id: string;
  title: string;
  courseId?: string;
}

// Wrapper component to handle the params promise
function EditExamContent({ id }: { id: string }) {
  const router = useRouter();
  const examId = id;
  
  const [formData, setFormData] = useState<ExamFormData>({
    title: "",
    courseId: "",
    questionPaperSetId: "",
    timeLimit: 60,
    resultMethod: "manual",
    isActive: true,
  });
  
  const [originalData, setOriginalData] = useState<Exam | null>(null);
  const [availableCourses, setAvailableCourses] = useState<CourseOption[]>([]);
  const [availableQuestionPapers, setAvailableQuestionPapers] = useState<QuestionPaperOption[]>([]);
  const [filteredQuestionPapers, setFilteredQuestionPapers] = useState<QuestionPaperOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [error, setError] = useState("");

  // Fetch exam data, courses, and question papers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingInitial(true);
        setError("");

        // Fetch exam data
        const examResponse = await examService.getExamById(examId);
        console.log("Exam response:", examResponse);
        
        if (!examResponse || !examResponse.status) {
          throw new Error(examResponse?.message || "Failed to fetch exam data");
        }
        
        const exam = examResponse.exam;
        if (!exam) {
          throw new Error("Exam not found");
        }

        setOriginalData(exam);
        setFormData({
          title: exam.title || "",
          courseId: exam.courseId || "",
          questionPaperSetId: exam.questionPaperSetId || "",
          timeLimit: exam.timeLimit || 60,
          resultMethod: exam.resultMethod || "manual",
          isActive: exam.isActive !== undefined ? exam.isActive : true,
        });

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
            
            // Filter question papers for the current course
            if (exam.courseId) {
              const filteredPapers = papers.filter(
                (paper: any) => paper.courseId === exam.courseId
              );
              setFilteredQuestionPapers(filteredPapers);
            }
          }
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoadingInitial(false);
      }
    };

    if (examId) {
      fetchData();
    }
  }, [examId]);

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

      console.log("Submitting updated exam data:", formData);
      
      // Update the exam
      const response = await examService.updateExam(examId, formData);
      console.log("Response from service:", response);

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
        setError("Failed to update exam. No response from server.");
      }
    } catch (err: any) {
      console.error("Error updating exam:", err);
      setError(err.message || "An unexpected error occurred while updating the exam");
    } finally {
      setIsLoading(false);
    }
  };

  // Get course name by ID
  const getCourseName = (courseId: string) => {
    const course = availableCourses.find(c => c._id === courseId);
    return course ? course.title : "Unknown Course";
  };

  // Get question paper name by ID
  const getQuestionPaperName = (paperId: string) => {
    const paper = availableQuestionPapers.find(p => p._id === paperId);
    return paper ? paper.title : "Unknown Question Paper";
  };

  if (isLoadingInitial) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error && !originalData) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-[var(--radius-md)] p-4 my-4">
        <h2 className="text-lg font-medium mb-2">Error</h2>
        <p>{error}</p>
        <Link 
          href="/dashboard/exams" 
          className="mt-4 inline-flex items-center text-sm text-red-600 hover:text-red-800"
        >
          Return to Exams List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Exam</h1>
          <p className="text-[var(--foreground-muted)]">
            Update exam details
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
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-[var(--radius-md)] p-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exam Title */}
          <div className="space-y-2">
            <label 
              htmlFor="title" 
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Exam Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)]"
              placeholder="Enter exam title"
              required
            />
          </div>

          {/* Course Selection */}
          <div className="space-y-2">
            <label 
              htmlFor="courseId" 
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Course <span className="text-red-500">*</span>
            </label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)]"
              required
            >
              <option value="">Select a course</option>
              {availableCourses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Question Paper Selection */}
          <div className="space-y-2">
            <label 
              htmlFor="questionPaperSetId" 
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Question Paper <span className="text-red-500">*</span>
            </label>
            <select
              id="questionPaperSetId"
              name="questionPaperSetId"
              value={formData.questionPaperSetId}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)]"
              required
              disabled={!formData.courseId}
            >
              <option value="">Select a question paper</option>
              {filteredQuestionPapers.map(paper => (
                <option key={paper._id} value={paper._id}>
                  {paper.title}
                </option>
              ))}
            </select>
            {!formData.courseId && (
              <p className="text-sm text-[var(--foreground-muted)]">Please select a course first</p>
            )}
            {formData.courseId && filteredQuestionPapers.length === 0 && (
              <p className="text-sm text-amber-500">No question papers available for this course</p>
            )}
          </div>

          {/* Time Limit */}
          <div className="space-y-2">
            <label 
              htmlFor="timeLimit" 
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Time Limit (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="timeLimit"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)]"
              required
            />
          </div>

          {/* Result Method */}
          <div className="space-y-2">
            <label 
              htmlFor="resultMethod" 
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Result Method <span className="text-red-500">*</span>
            </label>
            <select
              id="resultMethod"
              name="resultMethod"
              value={formData.resultMethod}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)]"
              required
            >
              <option value="auto">Automatic</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          {/* Is Active */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleCheckboxChange}
                className="h-5 w-5 rounded-[var(--radius-sm)] border-[var(--border)] text-[var(--primary)]"
              />
              <label 
                htmlFor="isActive" 
                className="text-sm font-medium text-[var(--foreground)]"
              >
                Active
              </label>
            </div>
            <p className="text-sm text-[var(--foreground-muted)]">
              If checked, this exam will be available to students
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[var(--input-bg)]/50 border border-[var(--border)] rounded-[var(--radius-md)] p-4 mt-6">
          <h3 className="font-medium mb-2 text-[var(--foreground)]">Exam Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[var(--foreground-muted)]">Course:</p>
              <p className="font-medium text-[var(--foreground)]">
                {formData.courseId ? getCourseName(formData.courseId) : "Not selected"}
              </p>
            </div>
            <div>
              <p className="text-[var(--foreground-muted)]">Question Paper:</p>
              <p className="font-medium text-[var(--foreground)]">
                {formData.questionPaperSetId ? getQuestionPaperName(formData.questionPaperSetId) : "Not selected"}
              </p>
            </div>
            <div>
              <p className="text-[var(--foreground-muted)]">Time Limit:</p>
              <p className="font-medium text-[var(--foreground)]">{formData.timeLimit} minutes</p>
            </div>
            <div>
              <p className="text-[var(--foreground-muted)]">Result Method:</p>
              <p className="font-medium text-[var(--foreground)]">
                {formData.resultMethod === 'auto' ? 'Automatic' : 'Manual'}
              </p>
            </div>
            <div>
              <p className="text-[var(--foreground-muted)]">Status:</p>
              <p className="font-medium text-[var(--foreground)]">
                {formData.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Link
            href="/dashboard/exams"
            className="px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)]/80 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="small" /> Updating...
              </>
            ) : (
              "Update Exam"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Main component that unwraps the params promise
export default async function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditExamContent id={id} />;
} 