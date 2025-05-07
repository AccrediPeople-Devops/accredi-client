"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import curriculumService from "../../../../components/service/curriculum.service";
import courseService from "../../../../components/service/course.service";
import { Curriculum, CurriculumContent } from "../../../../types/curriculum";
import { Course } from "../../../../types/course";
import CurriculumItemInput from "../../../../components/curriculum/CurriculumItemInput";

export default function EditCurriculumPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [courseId, setCourseId] = useState("");
  const [content, setContent] = useState<CurriculumContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [availableCourses, setAvailableCourses] = useState<
    { id: string; title: string }[]
  >([]);
  const [currentCourseName, setCurrentCourseName] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchCurriculum();
    }

    // Fetch available courses
    const fetchCourses = async () => {
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
      }
    };
    fetchCourses();
  }, [id]);

  const fetchCurriculum = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Get all curriculums and find the one with matching ID
      const res = await curriculumService.getAllCurriculums();
      if (res?.status && res?.curriculum && Array.isArray(res.curriculum)) {
        const foundCurriculum = res.curriculum.find(
          (item: Curriculum) => item._id === id
        );
        if (foundCurriculum) {
          setCourseId(foundCurriculum.courseId);
          setContent(foundCurriculum.content);

          // Get course name for the header
          const coursesRes = await courseService.getAllCourses();
          if (coursesRes?.courses) {
            const course = coursesRes.courses.find(
              (course: Course) => course._id === foundCurriculum.courseId
            );
            setCurrentCourseName(course ? course.title : "Unknown Course");
          }
        } else {
          setError("Curriculum not found");
        }
      } else {
        setError("Failed to retrieve curriculum data");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching curriculum");
    } finally {
      setIsLoading(false);
    }
  };

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

    setIsSaving(true);
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

      const res = await curriculumService.updateCurriculum(id, payload);
      if (res) {
        router.push(`/dashboard/curriculum/${id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error updating curriculum");
    } finally {
      setIsSaving(false);
    }
  };

  // Get course name by ID
  const getCourseNameById = (courseId: string) => {
    if (!courseId) return "Unknown Course";
    const course = availableCourses.find((course) => course.id === courseId);
    return course ? course.title : "Course Not Found";
  };

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center space-x-4">
        <Link
          href={`/dashboard/curriculum/${id}`}
          className="p-2 rounded-lg bg-[#2A2A2A] text-white hover:bg-[#5B2C6F]/20 transition-colors"
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
        </Link>
        <div className="p-6 bg-[#2A2A2A] rounded-xl flex-1">
          <h1 className="text-2xl font-bold text-white mb-2">
            Edit Curriculum
          </h1>
          <p className="text-[#D7BDE2]">
            {!isLoading && currentCourseName ? (
              <>
                Update curriculum for{" "}
                <span className="font-medium">{currentCourseName}</span>
              </>
            ) : (
              "Update course curriculum content"
            )}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-[#5B2C6F] border-r-2 border-b-2 border-transparent"></div>
          <p className="mt-2 text-white/70">Loading curriculum...</p>
        </div>
      )}

      {/* Error message */}
      {error && !isLoading && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white text-center">
          {error}
        </div>
      )}

      {/* Form */}
      {!isLoading && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#2A2A2A] rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Course Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                  Select Course
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1A1A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B2C6F]"
                >
                  <option value="">-- Select a course --</option>
                  {availableCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-white/50 mt-1">
                  Choose the course for which you want to update the curriculum
                </p>
              </div>
            </div>

            {/* Curriculum items editor */}
            <CurriculumItemInput items={content} setItems={setContent} />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3">
            <Link
              href={`/dashboard/curriculum/${id}`}
              className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-4 py-2 rounded-lg bg-[#5B2C6F] text-white hover:bg-[#5B2C6F]/90 transition-colors flex items-center ${
                isSaving ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
