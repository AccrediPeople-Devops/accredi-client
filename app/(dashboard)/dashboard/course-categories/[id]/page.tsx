"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import CourseCategoryService from "../../../../components/service/courseCategory.service";
import { CourseCategory } from "../../../../types/courseCategory";
import courseService from "../../../../components/service/course.service";
import { formatDate } from "../../../../utils/dateUtils";

interface Course {
  _id: string;
  title: string;
  description: string;
  image?: any[];
}

export default function CourseCategoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<CourseCategory | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category details
        const categoryResponse = await CourseCategoryService.getCourseCategoryById(categoryId);
        if (categoryResponse && categoryResponse.courseCategory) {
          setCategory(categoryResponse.courseCategory);
          
          // Fetch courses for this category
          try {
            const coursesResponse = await courseService.getCoursesByCategory(categoryId);
            // Handle both API format and fallback format
            if (coursesResponse) {
              if (coursesResponse.courses && Array.isArray(coursesResponse.courses)) {
                setCourses(coursesResponse.courses);
              } else if (Array.isArray(coursesResponse)) {
                setCourses(coursesResponse);
              } else {
                setCourses([]);
              }
            } else {
              setCourses([]);
            }
          } catch (courseErr) {
            console.error("Error fetching courses:", courseErr);
            setCourses([]);
          }
        } else {
          setError("Category not found");
        }
      } catch (err: any) {
        console.error("Error fetching category details:", err);
        setError(err.response?.data?.message || "Error fetching category details");
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" text="Loading category details..." />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Category Details</h1>
          <Link
            href="/dashboard/course-categories"
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
            Back to Categories
          </Link>
        </div>
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error || "Category not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Category Details</h1>
          <p className="text-[var(--foreground-muted)]">
            Viewing details for {category.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/course-categories/edit/${categoryId}`}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-8 8a2 2 0 01-.707.707l-2 1a1 1 0 01-1.414-1.414l1-2a2 2 0 01.707-.707l8-8z" />
              <path fillRule="evenodd" d="M11 19a1 1 0 01-1-1v-2a1 1 0 112 0v2a1 1 0 01-1 1z" clipRule="evenodd" />
            </svg>
            Edit
          </Link>
          <Link
            href="/dashboard/course-categories"
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

      {/* Category details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Category info */}
        <div className="col-span-2 space-y-6">
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-lg font-medium text-[var(--foreground)]">Category Information</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground-muted)]">Name</p>
                    <p className="text-[var(--foreground)]">{category.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground-muted)]">Status</p>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          category.isActive
                            ? "bg-[var(--success)]/10 text-[var(--success)]"
                            : "bg-[var(--warning)]/10 text-[var(--warning)]"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                      
                      {category.isDeleted && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--error)]/10 text-[var(--error)]">
                          Deleted
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground-muted)]">Created</p>
                    <p className="text-[var(--foreground)]">
                      {category.createdAt ? formatDate(category.createdAt) : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground-muted)]">Last Updated</p>
                    <p className="text-[var(--foreground)]">
                      {category.updatedAt ? formatDate(category.updatedAt) : "Unknown"}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-[var(--foreground-muted)] mb-1">Description</p>
                  <p className="text-[var(--foreground)]">{category.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Courses in this category */}
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-lg font-medium text-[var(--foreground)]">
                Courses ({courses.length})
              </h2>
            </div>
            <div className="p-6">
              {courses.length === 0 ? (
                <div className="text-center p-4 text-[var(--foreground-muted)]">
                  <p>No courses found in this category</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div 
                      key={course._id}
                      className="p-4 border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)] transition-colors"
                    >
                      <Link href={`/dashboard/courses/${course._id}`} className="block">
                        <h3 className="font-medium text-[var(--foreground)]">{course.title}</h3>
                        {course.description && (
                          <p className="mt-1 text-sm text-[var(--foreground-muted)] line-clamp-2">
                            {course.description}
                          </p>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Category image */}
        <div className="col-span-1">
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-lg font-medium text-[var(--foreground)]">Category Image</h2>
            </div>
            <div className="p-6">
              {category.image && category.image.length > 0 && category.image[0].path ? (
                <div className="relative aspect-video overflow-hidden rounded-[var(--radius-md)]">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://148.135.137.229:3000'}/${category.image[0].path}`}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="text-center p-4 text-[var(--foreground-muted)]">
                  <p>No image available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}