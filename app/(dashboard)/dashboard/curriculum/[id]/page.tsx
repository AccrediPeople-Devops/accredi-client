"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import curriculumService from "../../../../components/service/curriculum.service";
import courseService from "../../../../components/service/course.service";
import { Curriculum } from "../../../../types/curriculum";
import { Course } from "../../../../types/course";
import Modal from "../../../../components/Modal";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";

export default function CurriculumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      // First fetch courses
      const coursesRes = await courseService.getAllCourses();
      if (coursesRes?.courses) {
        setCourses(coursesRes.courses);
      }

      // Then fetch curriculums
      const res = await curriculumService.getAllCurriculums();
      if (res?.status && res?.curriculum && Array.isArray(res.curriculum)) {
        const foundCurriculum = res.curriculum.find(
          (item: Curriculum) => item._id === id
        );
        if (foundCurriculum) {
          setCurriculum(foundCurriculum);
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

  // Get course name by course ID
  const getCourseNameById = (courseId: string) => {
    if (!courseId) return "Unknown Course";
    const course = courses.find((course) => course._id === courseId);
    return course ? course.title : "Course Not Found";
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
      try {
        await curriculumService.deleteCurriculum(id);
        router.push("/dashboard/curriculum");
      } catch (err: any) {
        setError(err.response?.data?.message || "Error deleting curriculum");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleToggleActive = async () => {
    if (!curriculum) return;

    try {
      const newStatus = !curriculum.isActive;
      await curriculumService.toggleCurriculumActive(id, newStatus);
      setCurriculum({ ...curriculum, isActive: newStatus });
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Error updating curriculum status"
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-[var(--radius-md)] bg-[var(--input-bg)] text-[var(--foreground)] hover:bg-[var(--input-bg)]/80 transition-colors"
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
        </button>
        <div className="p-6 bg-[var(--background)] rounded-[var(--radius-lg)] border border-[var(--border)] flex-1">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            Curriculum Details
          </h1>
          <p className="text-[var(--foreground-muted)]">View and manage curriculum content</p>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="medium" text="Loading curriculum..." />
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Curriculum Details */}
      {!isLoading && !error && curriculum && (
        <>
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleToggleActive}
              className={`px-4 py-2 rounded-[var(--radius-md)] flex items-center ${
                curriculum.isActive
                  ? "bg-[var(--success)]/20 text-[var(--success)] hover:bg-[var(--success)]/30"
                  : "bg-[var(--foreground-muted)]/20 text-[var(--foreground-muted)] hover:bg-[var(--foreground-muted)]/30"
              } transition-colors`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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
              {curriculum.isActive ? "Deactivate" : "Activate"}
            </button>
            <Link
              href={`/dashboard/curriculum/edit/${id}`}
              className="px-4 py-2 rounded-[var(--radius-md)] bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Curriculum
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-[var(--radius-md)] bg-[var(--error)]/20 text-[var(--error)] hover:bg-[var(--error)]/30 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Delete Curriculum
            </button>
          </div>

          {/* Curriculum Details Card */}
          <div className="bg-[var(--background)] rounded-[var(--radius-lg)] p-6 border border-[var(--border)]">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">
                    Course Details
                  </h2>
                  <p className="text-[var(--foreground-muted)]">
                    <span className="font-medium">Course:</span>{" "}
                    {courses.length === 0 ? (
                      <span className="animate-pulse text-[var(--foreground-muted)]">
                        Loading...
                      </span>
                    ) : (
                      getCourseNameById(curriculum.courseId)
                    )}
                  </p>
                  <p className="text-[var(--foreground-muted)] text-sm mt-1">
                    Last updated:{" "}
                    {new Date(curriculum.updatedAt || "").toLocaleString()}
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="text-[var(--foreground-muted)]">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        curriculum.isActive
                          ? "bg-[var(--success)]/20 text-[var(--success)]"
                          : "bg-[var(--foreground-muted)]/20 text-[var(--foreground-muted)]"
                      }`}
                    >
                      {curriculum.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="bg-[var(--primary)]/20 px-3 py-1 rounded-full text-[var(--primary)] text-sm font-medium">
                  {curriculum.content.length} Content Items
                </div>
              </div>
            </div>

            {/* Content List */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">
                Curriculum Content
              </h3>
              <div className="space-y-4">
                {curriculum.content.map((item, index) => (
                  <div key={index} className="p-4 bg-[var(--input-bg)] rounded-[var(--radius-md)] border border-[var(--border)]">
                    <div className="flex justify-between">
                      <h4 className="text-[var(--primary)] font-medium">
                        {index + 1}. {item.title}
                      </h4>
                      <div className="text-[var(--foreground-muted)] text-sm">
                        Module {index + 1}
                      </div>
                    </div>
                    <div
                      className="text-[var(--foreground)] mt-2"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        description="Are you sure you want to delete this curriculum? This action cannot be undone."
        confirmText="Delete Curriculum"
        onConfirm={confirmDelete}
        isConfirming={isDeleting}
        variant="danger"
      />
    </div>
  );
}
