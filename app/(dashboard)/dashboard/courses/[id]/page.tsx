"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import courseService from "@/app/components/service/course.service";
import courseCategoryService from "@/app/components/service/courseCategory.service";
import config from "@/app/components/config/config";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

interface FileUpload {
  url: string;
  key: string;
  path?: string;
  _id?: string;
}

interface Course {
  _id: string;
  title: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  upload: {
    courseImage: FileUpload[];
    courseSampleCertificate: FileUpload[];
    courseBadge: FileUpload[];
  };
  keyFeatures: string[];
  isActive: boolean;
  broucher: FileUpload[];
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
}

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = use(params);
  const router = useRouter();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoryResponse =
          await courseCategoryService.getAllCourseCategories();
        if (categoryResponse && categoryResponse.courseCategories) {
          setCategories(categoryResponse.courseCategories);
        }

        // Fetch all courses and find the one with matching ID
        const courseResponse = await courseService.getAllCourses();
        if (courseResponse && courseResponse.courses) {
          const foundCourse = courseResponse.courses.find(
            (c: any) => c._id === courseId
          );

          if (foundCourse) {
            // Format the course data for display
            // Add url property to all file objects
            if (foundCourse.upload) {
              // Process courseImage
              if (
                foundCourse.upload.courseImage &&
                foundCourse.upload.courseImage.length > 0
              ) {
                foundCourse.upload.courseImage =
                  foundCourse.upload.courseImage.map((img: any) => ({
                    ...img,
                    url: img.path ? `${config.imageUrl}${img.path}` : "",
                  }));
              }

              // Process courseSampleCertificate
              if (
                foundCourse.upload.courseSampleCertificate &&
                foundCourse.upload.courseSampleCertificate.length > 0
              ) {
                foundCourse.upload.courseSampleCertificate =
                  foundCourse.upload.courseSampleCertificate.map(
                    (img: any) => ({
                      ...img,
                      url: img.path ? `${config.imageUrl}${img.path}` : "",
                    })
                  );
              }

              // Process courseBadge
              if (
                foundCourse.upload.courseBadge &&
                foundCourse.upload.courseBadge.length > 0
              ) {
                foundCourse.upload.courseBadge =
                  foundCourse.upload.courseBadge.map((img: any) => ({
                    ...img,
                    url: img.path ? `${config.imageUrl}${img.path}` : "",
                  }));
              }
            }

            // Process broucher
            if (foundCourse.broucher && foundCourse.broucher.length > 0) {
              foundCourse.broucher = foundCourse.broucher.map((img: any) => ({
                ...img,
                url: img.path ? `${config.imageUrl}${img.path}` : "",
              }));
            }

            setCourse(foundCourse);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!course) return;

    setIsDeleting(true);

    try {
      // Call the delete course API
      await courseService.deleteCourse(course._id);
      setIsDeleting(false);
      setShowDeleteModal(false);
      router.push("/dashboard/courses");
    } catch (error) {
      console.error("Error deleting course:", error);
      setIsDeleting(false);
      alert("Failed to delete course. Please try again.");
    }
  };

  const handleStatusToggle = async () => {
    if (!course) return;

    try {
      await courseService.toggleCourseActive(course._id, !course.isActive);
      setCourse({
        ...course,
        isActive: !course.isActive,
      });
    } catch (error) {
      console.error("Error updating course status:", error);
      alert("Failed to update course status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" text="Loading course details..." />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Course Details</h1>
          <Link
            href="/dashboard/courses"
            className="px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)] transition-colors flex items-center gap-2"
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
            Back to Courses
          </Link>
        </div>
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          The course you are looking for does not exist or has been removed.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{course.title}</h1>
          <div className="flex items-center space-x-3">
            <span className="text-[var(--foreground-muted)]">
              {getCategoryName(course.categoryId)}
            </span>
            <span className="w-1 h-1 bg-[var(--foreground-muted)] rounded-full"></span>
            <span
              className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                course.isActive
                  ? "bg-[var(--success)]/10 text-[var(--success)]"
                  : "bg-[var(--warning)]/10 text-[var(--warning)]"
              }`}
            >
              {course.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/courses/edit/${course._id}`}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </Link>
          <button
            onClick={handleDeleteClick}
            className="px-4 py-2 bg-[var(--error)] text-white rounded-[var(--radius-md)] hover:bg-[var(--error)]/90 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
          <Link
            href="/dashboard/courses"
            className="px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)] transition-colors flex items-center gap-2"
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-lg font-medium text-[var(--foreground)]">
                Basic Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="relative aspect-video rounded-[var(--radius-md)] overflow-hidden">
                {course.upload.courseImage[0] && (
                  <Image
                    src={course.upload.courseImage[0].url}
                    alt={course.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-1">
                  Short Description
                </h3>
                <p className="text-[var(--foreground)]">{course.shortDescription}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-1">
                  Full Description
                </h3>
                <div
                  className="text-[var(--foreground)] prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-lg font-medium text-[var(--foreground)]">
                Key Features
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {course.keyFeatures && course.keyFeatures.length > 0 ? (
                  course.keyFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1.5 rounded-full text-sm"
                    >
                      {feature}
                    </div>
                  ))
                ) : (
                  <p className="text-[var(--foreground-muted)]">No features specified</p>
                )}
              </div>
            </div>
          </div>

          {/* Course Brochure */}
          {course.broucher[0] && (
            <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
              <div className="p-6 border-b border-[var(--border)]">
                <h2 className="text-lg font-medium text-[var(--foreground)]">
                  Course Brochure
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="border border-[var(--border)] rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-[var(--primary)]"
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
                    <div className="ml-3">
                      <div className="text-[var(--foreground)] font-medium">
                        Course Brochure
                      </div>
                      <div className="text-[var(--foreground-muted)] text-sm">PDF Document</div>
                    </div>
                  </div>
                  <a
                    href={course.broucher[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-[var(--primary)] text-[var(--foreground)] text-sm rounded-lg hover:bg-[var(--primary)]/90 transition-colors"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Details */}
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-lg font-medium text-[var(--foreground)]">Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-1">
                  Category
                </h3>
                <p className="text-[var(--foreground)]">
                  {getCategoryName(course.categoryId)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-1">
                  Added on
                </h3>
                <p className="text-[var(--foreground)]">{formatDate(course.createdAt)}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-1">
                  Status
                </h3>
                <div className="mt-1">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      course.isActive
                        ? "bg-[var(--success)]/10 text-[var(--success)]"
                        : "bg-[var(--warning)]/10 text-[var(--warning)]"
                    }`}
                  >
                    {course.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate & Badges */}
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-lg font-medium text-[var(--foreground)]">
                Certificate & Badges
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {course.upload.courseSampleCertificate[0] && (
                <div>
                  <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-2">
                    Sample Certificate
                  </h3>
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={course.upload.courseSampleCertificate[0].url}
                      alt="Sample Certificate"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}

              {course.upload.courseBadge.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-2">
                    Course Badges
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {course.upload.courseBadge.map((badge, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden"
                      >
                        <Image
                          src={badge.url}
                          alt={`Badge ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[var(--background)] rounded-[var(--radius-lg)] p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-[var(--foreground)]">Confirm Delete</h3>
            <p className="mt-2 text-[var(--foreground-muted)]">
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
            <div className="mt-4 flex space-x-2 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-[var(--error)] text-white rounded-[var(--radius-md)] hover:bg-[var(--error)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <LoadingSpinner size="small" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
