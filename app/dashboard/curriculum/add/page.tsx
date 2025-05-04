"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import curriculumService from "../../../components/service/curriculum.service";
import { CurriculumContent } from "../../../types/curriculum";
import CurriculumItemInput from "../../../components/curriculum/CurriculumItemInput";

export default function AddCurriculumPage() {
  const router = useRouter();
  const [courseId, setCourseId] = useState("");
  const [content, setContent] = useState<CurriculumContent[]>([
    { title: "", description: "" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableCourses, setAvailableCourses] = useState<{ id: string; title: string }[]>([
    { id: "67facdd9067a3cf2e7263124", title: "Introduction to Web Development" },
    { id: "67facdd9067a3cf2e7263125", title: "Advanced JavaScript" },
    { id: "67facdd9067a3cf2e7263126", title: "React for Beginners" }
  ]);

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
    try {
      // Clean up empty descriptions
      const cleanContent = content.map(item => ({
        ...item,
        description: item.description.trim()
      }));

      const payload = {
        courseId,
        content: cleanContent
      };

      // Comment out for testing
      // const res = await curriculumService.createCurriculum(payload);
      // if (res) {
      //   router.push("/dashboard/curriculum");
      // }

      // For testing/display only
      console.log("Curriculum Payload:", payload);
      alert("Curriculum would be created with: " + JSON.stringify(payload, null, 2));
      router.push("/dashboard/curriculum");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating curriculum");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/curriculum"
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
          <h1 className="text-2xl font-bold text-white mb-2">Add New Curriculum</h1>
          <p className="text-[#D7BDE2]">Create a new curriculum for a course</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white text-center">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#2A2A2A] rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Course Information</h2>
            
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
                    {course.title} ({course.id})
                  </option>
                ))}
              </select>
              <p className="text-sm text-white/50 mt-1">
                Choose the course for which you want to create a curriculum
              </p>
            </div>
          </div>

          {/* Curriculum items editor */}
          <CurriculumItemInput items={content} setItems={setContent} />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-3">
          <Link
            href="/dashboard/curriculum"
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg bg-[#5B2C6F] text-white hover:bg-[#5B2C6F]/90 transition-colors flex items-center ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              "Create Curriculum"
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 