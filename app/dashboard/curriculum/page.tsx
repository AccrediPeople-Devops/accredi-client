"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import curriculumService from "../../components/service/curriculum.service";
import courseService from "../../components/service/course.service";
import { Curriculum } from "../../types/curriculum";
import { Course } from "../../types/course";
import { createHtmlPreview } from "../../utils/textUtils";

export default function CurriculumPage() {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      // First fetch courses
      const coursesRes = await courseService.getAllCourses();
      if (coursesRes?.courses) {
        setCourses(coursesRes.courses);
      }

      // Then fetch curriculums after we have course data
      const curriculumsRes = await curriculumService.getAllCurriculums();
      if (curriculumsRes?.curriculum) {
        setCurriculums(curriculumsRes.curriculum);
      } else {
        setCurriculums([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  // Get course name by course ID
  const getCourseNameById = (courseId: string) => {
    if (!courseId) return "Unknown Course";
    const course = courses.find((course) => course._id === courseId);
    return course ? course.title : "Course Not Found";
  };

  const handleDeleteCurriculum = async (id: string) => {
    try {
      await curriculumService.deleteCurriculum(id);
      // Update the local state after successful deletion
      setCurriculums(curriculums.filter((curriculum) => curriculum._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting curriculum");
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await curriculumService.toggleCurriculumActive(id, isActive);
      // Update the local state after successful toggle
      setCurriculums(
        curriculums.map((curriculum) =>
          curriculum._id === id ? { ...curriculum, isActive } : curriculum
        )
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Error updating curriculum status"
      );
    }
  };

  const filteredCurriculums = curriculums.filter((curriculum) => {
    const courseName = getCourseNameById(curriculum.courseId).toLowerCase();
    return courseName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="p-6 bg-[#2A2A2A] rounded-xl">
        <h1 className="text-2xl font-bold text-white mb-2">
          Curriculum Management
        </h1>
        <p className="text-[#D7BDE2]">
          Create and manage course curriculum content
        </p>
      </div>

      {/* Search and Add Curriculum */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by course name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 pl-10 bg-[#2A2A2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B2C6F]"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <Link
          href="/dashboard/curriculum/add"
          className="w-full sm:w-auto px-4 py-2 bg-[#5B2C6F] text-white rounded-lg font-medium hover:bg-[#5B2C6F]/90 transition-colors flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add New Curriculum
        </Link>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-[#5B2C6F] border-r-2 border-b-2 border-transparent"></div>
          <p className="mt-2 text-white/70">Loading curriculums...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white text-center">
          {error}
        </div>
      )}

      {/* Curriculum List */}
      {!isLoading && !error && filteredCurriculums.length === 0 && (
        <div className="text-center py-12 bg-[#2A2A2A] rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-[#5B2C6F]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-white">
            No Curriculums Found
          </h3>
          <p className="mt-2 text-white/70">
            {searchTerm
              ? "No curriculums match your search criteria."
              : "Get started by creating a new curriculum."}
          </p>
        </div>
      )}

      {!isLoading && !error && filteredCurriculums.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {filteredCurriculums.map((curriculum) => (
            <div
              key={curriculum._id}
              className="bg-[#2A2A2A] rounded-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium text-white">
                    {courses.length === 0 ? (
                      <span className="inline-flex items-center">
                        Course:{" "}
                        <span className="ml-2 animate-pulse text-gray-400">
                          Loading...
                        </span>
                      </span>
                    ) : (
                      <span>
                        Course: {getCourseNameById(curriculum.courseId)}
                      </span>
                    )}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleToggleActive(
                          curriculum._id as string,
                          !curriculum.isActive
                        )
                      }
                      className={`p-2 rounded-lg ${
                        curriculum.isActive
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                      } transition-colors`}
                      title={curriculum.isActive ? "Deactivate" : "Activate"}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d={
                            curriculum.isActive
                              ? "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              : "M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                          }
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <Link
                      href={`/dashboard/curriculum/edit/${curriculum._id}`}
                      className="p-2 rounded-lg bg-[#5B2C6F]/20 text-[#D7BDE2] hover:bg-[#5B2C6F]/30 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this curriculum?"
                          )
                        ) {
                          handleDeleteCurriculum(curriculum._id as string);
                        }
                      }}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
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
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-white/90 font-medium mb-2">
                    Content Items: {curriculum.content.length}
                  </h3>
                  <div className="space-y-2">
                    {curriculum.content.slice(0, 3).map((item, index) => (
                      <div key={index} className="p-3 bg-[#1A1A1A] rounded-lg">
                        <h4 className="text-[#D7BDE2] font-medium">
                          {item.title}
                        </h4>
                        <div className="text-white/70 text-sm mt-1 line-clamp-1 overflow-hidden">
                          {createHtmlPreview(item.description)}
                        </div>
                      </div>
                    ))}
                    {curriculum.content.length > 3 && (
                      <div className="text-center text-[#D7BDE2] text-sm">
                        +{curriculum.content.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <div className="text-sm text-white/50">
                    Last updated:{" "}
                    {new Date(curriculum.updatedAt || "").toLocaleDateString()}
                    <span className="ml-3 inline-flex items-center">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          curriculum.isActive ? "bg-green-400" : "bg-gray-400"
                        } mr-1`}
                      ></span>
                      {curriculum.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Link
                    href={`/dashboard/curriculum/${curriculum._id}`}
                    className="text-[#D7BDE2] hover:text-white transition-colors flex items-center"
                  >
                    View Details
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
