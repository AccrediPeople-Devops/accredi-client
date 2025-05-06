"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import curriculumService from "../../../components/service/curriculum.service";
import courseService from "../../../components/service/course.service";
import { CurriculumContent } from "../../../types/curriculum";
import { Course } from "../../../types/course";
import CurriculumItemInput from "../../../components/curriculum/CurriculumItemInput";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

export default function AddCurriculumPage() {
  const router = useRouter();
  const [courseId, setCourseId] = useState("");
  const [content, setContent] = useState<CurriculumContent[]>([
    { title: "", description: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [error, setError] = useState("");
  const [availableCourses, setAvailableCourses] = useState<
    { id: string; title: string }[]
  >([]);

  // Fetch available courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoadingCourses(true);
      try {
        const res = await courseService.getAllCourses();
        if (res?.courses) {
          setAvailableCourses(
            res.courses.map((course: Course) => ({
              id: course._id,
              title: course.title,
            }))
          );
        }
      } catch (err) {
        setError("Failed to load courses");
      } finally {
        setIsLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const validateForm = () => {
    if (!courseId.trim()) {
      setError("Course ID is required");
      return false;
    }

    if (content.length === 0) {
      setError("At least one curriculum item is required");
      return false;
    }

    for (const item of content) {
      if (!item.title.trim()) {
        setError("All curriculum items must have a title");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      // Clean up empty descriptions
      const cleanContent = content.map((item) => ({
        ...item,
        description: item.description.trim(),
      }));

      const payload = {
        courseId,
        content: cleanContent,
      };

      const res = await curriculumService.createCurriculum(payload);
      if (res) {
        router.push("/dashboard/curriculum");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating curriculum");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Add Curriculum
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Create curriculum content for a course
          </p>
        </div>
        <Link
          href="/dashboard/curriculum"
          className="px-4 py-2 bg-[var(--background)] text-[var(--foreground)] rounded-[var(--radius-md)] flex items-center gap-2 hover:bg-[var(--input-bg)] transition-colors border border-[var(--border)]"
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
          Back to Curriculum
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Loading state for courses */}
      {isLoadingCourses ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="medium" text="Loading courses..." />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Selection */}
          <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
              Course Selection
            </h2>
            <div>
              <label 
                htmlFor="courseId" 
                className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
              >
                Select Course *
              </label>
              <select
                id="courseId"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              >
                <option value="">Select a course</option>
                {availableCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                Choose the course this curriculum belongs to
              </p>
            </div>
          </div>

          {/* Curriculum Content */}
          <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
              Curriculum Content
            </h2>
            <CurriculumItemInput 
              items={content} 
              setItems={setContent} 
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
                  Creating Curriculum...
                </>
              ) : (
                "Create Curriculum"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
