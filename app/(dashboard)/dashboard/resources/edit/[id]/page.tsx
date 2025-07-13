"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import ResourceItemForm from "@/app/components/ResourceItemForm";
import resourceService from "@/app/components/service/resource.service";
import courseService from "@/app/components/service/course.service";

interface ResourceFile {
  url: string;
  key: string;
  path?: string;
  _id?: string;
}

interface ResourceItem {
  title: string;
  description: string;
  file: ResourceFile[];
  _id?: string;
}

interface Resource {
  _id?: string;
  courseId: string;
  content: ResourceItem[];
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Course {
  _id: string;
  title: string;
}

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();
  const resourceId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState<Resource>({
    courseId: "",
    content: [],
  });
  
  useEffect(() => {
    if (resourceId) {
      Promise.all([fetchResource(), fetchCourses()]).catch(err => {
        console.error("Error initializing page:", err);
      });
    }
  }, [resourceId]);

  const fetchResource = async () => {
    try {
      const response = await resourceService.getResourceById(resourceId);
      if (response && response.resource) {
        const resource = response.resource;
        setFormData({
          ...resource,
          courseId: resource.courseId || "",
          content: Array.isArray(resource.content) ? resource.content : [],
        });
      } else if (response && !response.status) {
        setError(response.message || "Resource not found");
      } else {
        setError("Failed to load resource data");
      }
    } catch (err: any) {
      console.error("Error fetching resource:", err);
      setError(err.response?.data?.message || "Error loading resource");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAllCourses();
      if (response && response.courses) {
        setCourses(response.courses);
      } else {
        console.error("Invalid course response format");
      }
    } catch (err: any) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      courseId: e.target.value,
    });
  };

  const handleResourceItemsChange = (items: ResourceItem[]) => {
    setFormData({
      ...formData,
      content: items,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.courseId) {
      setError("Please select a course");
      return;
    }

    if (formData.content.length === 0) {
      setError("Please add at least one resource item");
      return;
    }

    for (const item of formData.content) {
      if (!item.title) {
        setError("All resource items must have a title");
        return;
      }
      
      if (!item.file || item.file.length === 0 || !item.file[0].url) {
        setError("All resource items must have a file");
        return;
      }
    }

    setIsSubmitting(true);
    setError("");

    try {
      console.log("Updating resource data:", formData);
      const response = await resourceService.updateResource(resourceId, formData);
      
      if (response && (response.status || response.resource)) {
        router.push("/dashboard/resources");
      } else {
        setError("Failed to update resource. Invalid response format.");
      }
    } catch (err: any) {
      console.error("Error updating resource:", err);
      setError(err.response?.data?.message || "Failed to update resource");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" text="Loading resource data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Resources</h1>
          <p className="text-[var(--foreground-muted)]">
            Update course resources
          </p>
        </div>
        <Link
          href="/dashboard/resources"
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
          Back to Resources
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
          <div className="p-6">
            <div className="space-y-4">
              {/* Course selection */}
              <div>
                <label 
                  htmlFor="courseId"
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                >
                  Course *
                </label>
                <select
                  id="courseId"
                  value={formData.courseId}
                  onChange={handleCourseChange}
                  className="w-full px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resource items */}
              <ResourceItemForm 
                items={formData.content}
                onChange={handleResourceItemsChange}
                isLoading={isSubmitting}
              />
            </div>
          </div>
          
          {/* Form footer */}
          <div className="px-6 py-4 bg-[var(--input-bg)] border-t border-[var(--border)] flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="small" /> Saving...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Update Resources
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 