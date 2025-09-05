"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/app/components/Input";
import courseLinkService from "@/app/components/service/courseLink.service";
import courseService from "@/app/components/service/course.service";
import scheduleService from "@/app/components/service/schedule.service";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

interface Course {
  _id: string;
  title: string;
  isActive: boolean;
  isDeleted: boolean;
}

interface Schedule {
  _id: string;
  courseId: string;
  startDate?: string;
  endDate?: string;
  country?: string;
  city?: string;
  instructorName?: string;
  isActive: boolean;
  isDeleted: boolean;
}

interface CourseLink {
  _id: string;
  courseId: string;
  name: string;
  scheduleId: string;
  link: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CourseLinkFormData {
  courseId: string;
  name: string;
  scheduleId: string;
  link: string;
  isActive: boolean;
}

// Predefined link types that match backend validation
const LINK_TYPES = [
  { value: "google", label: "Google" },
  { value: "zoom", label: "Zoom" }
];

// Main component that handles params unwrapping - Next.js 15 compatible
export default function EditCourseLinkPage({
  params
}: {
  params: any
}) {
  // Unwrap params at the component level - this is allowed by React
  const unwrappedParams = use(params) as { id: string };
  const courseId = unwrappedParams.id;
  
  return <EditCourseLinkContent id={courseId} />;
}

// Separate component that takes a simple string id prop
function EditCourseLinkContent({
  id
}: {
  id: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState<CourseLinkFormData>({
    courseId: "",
    name: "",
    scheduleId: "",
    link: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        setError("");

        // Fetch courses first
        setIsLoadingCourses(true);
        const courseResponse = await courseService.getAllCourses();
        
        if (courseResponse && courseResponse.courses) {
          setCourses(courseResponse.courses);
        } else if (Array.isArray(courseResponse)) {
          // Handle alternative response format
          setCourses(courseResponse);
        }
        setIsLoadingCourses(false);

        // Fetch the course link for editing
        const response = await courseLinkService.getCourseLinkById(id);
        
        if (response && response.status && response.courseLink) {
          // Standard response format
          const courseLink = response.courseLink;
          setFormData({
            courseId: courseLink.courseId,
            name: courseLink.name,
            scheduleId: courseLink.scheduleId,
            link: courseLink.link,
            isActive: courseLink.isActive,
          });
        } else if (response && '_id' in response) {
          // Direct object response format
          const courseLink = response as unknown as CourseLink;
          setFormData({
            courseId: courseLink.courseId,
            name: courseLink.name,
            scheduleId: courseLink.scheduleId,
            link: courseLink.link,
            isActive: courseLink.isActive,
          });
        } else {
          // Failed to find the course link
          setError(response?.message || "Failed to find the course link");

        }
      } catch (error: any) {

        setError(error.message || "An error occurred while fetching data");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [id]);

  // Fetch schedules when course is selected or changed
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!formData.courseId) {
        setSchedules([]);
        return;
      }

      try {
        setIsLoadingSchedules(true);
        const response = await scheduleService.getSchedulesByCourseId(formData.courseId);

        if (response && response.status && response.schedules) {
          // Filter schedules that are active and not deleted
          const filteredSchedules = response.schedules.filter(
            (schedule: Schedule) => schedule.isActive && !schedule.isDeleted
          );
          setSchedules(filteredSchedules);
        } else {
          setSchedules([]);
        }
      } catch (error) {

        setSchedules([]);
      } finally {
        setIsLoadingSchedules(false);
      }
    };

    fetchSchedules();
  }, [formData.courseId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    
    // If changing course, reset scheduleId
    if (name === 'courseId') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        scheduleId: ""
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Format schedule display name
  const formatScheduleName = (schedule: Schedule) => {
    const dateInfo = schedule.startDate 
      ? new Date(schedule.startDate).toLocaleDateString() 
      : 'Self-paced';
    
    const locationInfo = schedule.city && schedule.country
      ? `${schedule.city}, ${schedule.country}`
      : schedule.country || schedule.city || 'Online';
    
    const instructorInfo = schedule.instructorName
      ? `(${schedule.instructorName})`
      : '';
    
    return `${dateInfo} - ${locationInfo} ${instructorInfo}`.trim();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    // Validate form data
    if (!formData.courseId) {
      setError("Please select a course");
      setIsLoading(false);
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter a name for the course link");
      setIsLoading(false);
      return;
    }

    if (!formData.scheduleId) {
      setError("Please select a schedule");
      setIsLoading(false);
      return;
    }

    if (!formData.link.trim()) {
      setError("Please enter a link");
      setIsLoading(false);
      return;
    }

    try {
      // Submit the data
      const response = await courseLinkService.updateCourseLink(id, formData);

      if (response && (response.status || response._id)) {
        setSuccessMessage("Course link updated successfully!");
        
        // Redirect to course links list after a short delay
        setTimeout(() => {
          router.push("/dashboard/course-links");
        }, 1500);
      } else {
        setError(response?.message || "Failed to update course link");
      }
    } catch (error: any) {

      setError(error.message || "An error occurred while updating the course link");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="large" text="Loading course link data..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-[var(--background)] rounded-xl">
      <div className="mb-6">
        <Link
          href="/dashboard/course-links"
          className="flex items-center text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Course Links
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Edit Course Link</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Selection */}
        <div>
          <label htmlFor="courseId" className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Course<span className="text-red-500"> *</span>
          </label>
          <select
            id="courseId"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] p-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            required
          >
            <option value="">Select a course</option>
            {isLoadingCourses ? (
              <option value="" disabled>Loading courses...</option>
            ) : (
              courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Link Type<span className="text-red-500"> *</span>
          </label>
          <select
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] p-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            required
          >
            <option value="">Select a link type</option>
            {LINK_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Schedule Selection */}
        <div>
          <label htmlFor="scheduleId" className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Schedule<span className="text-red-500"> *</span>
          </label>
          <select
            id="scheduleId"
            name="scheduleId"
            value={formData.scheduleId}
            onChange={handleChange}
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] p-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            disabled={!formData.courseId || isLoadingSchedules}
            required
          >
            <option value="">Select a schedule</option>
            {isLoadingSchedules ? (
              <option value="" disabled>Loading schedules...</option>
            ) : schedules.length > 0 ? (
              schedules.map((schedule) => (
                <option key={schedule._id} value={schedule._id}>
                  {formatScheduleName(schedule)}
                </option>
              ))
            ) : formData.courseId ? (
              <option value="" disabled>No schedules available for this course</option>
            ) : null}
          </select>
        </div>

        {/* Link Input */}
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Link URL<span className="text-red-500"> *</span>
          </label>
          <Input
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="Enter link URL"
            required
          />
        </div>

        {/* Active Status Checkbox */}
        <div className="flex items-center">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-[var(--foreground)]">
            Active
          </label>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/dashboard/course-links"
            className="px-4 py-2 bg-[var(--background-muted)] text-[var(--foreground)] rounded-[var(--radius-md)] hover:bg-[var(--background-muted)]/80 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <LoadingSpinner size="small" /> 
                <span className="ml-2">Updating...</span>
              </div>
            ) : (
              "Update Course Link"
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 