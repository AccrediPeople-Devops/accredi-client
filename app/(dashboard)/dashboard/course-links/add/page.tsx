"use client";

import React, { useState, useEffect } from "react";
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

export default function AddCourseLinkPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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
    const fetchCourses = async () => {
      try {
        setIsLoadingCourses(true);
        const response = await courseService.getAllCourses();
        if (response && response.courses) {
          // Filter courses that are active and not deleted
          const filteredCourses = response.courses.filter(
            (course: Course) => course.isActive && !course.isDeleted
          );
          setCourses(filteredCourses);
        } else if (Array.isArray(response)) {
          // Handle alternative response format
          const filteredCourses = response.filter(
            (course: Course) => course.isActive && !course.isDeleted
          );
          setCourses(filteredCourses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please refresh the page.");
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch schedules when course is selected
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
        console.error("Error fetching schedules:", error);
        setError("Failed to load schedules. Please try again.");
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
      const response = await courseLinkService.createCourseLink(formData);

      if (response && (response.status || response._id)) {
        setSuccessMessage("Course link created successfully!");
        
        // Reset form
        setFormData({
          courseId: "",
          name: "",
          scheduleId: "",
          link: "",
          isActive: true,
        });

        // Redirect to course links list after a short delay
        setTimeout(() => {
          router.push("/dashboard/course-links");
        }, 1500);
      } else {
        setError(response?.message || "Failed to create course link");
      }
    } catch (error: any) {
      console.error("Error creating course link:", error);
      setError(error.message || "An error occurred while creating the course link");
    } finally {
      setIsLoading(false);
    }
  };

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

      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Add New Course Link</h1>

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
                <span className="ml-2">Creating...</span>
              </div>
            ) : (
              "Create Course Link"
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 