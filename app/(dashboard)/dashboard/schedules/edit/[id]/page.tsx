"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/app/components/Input";
import scheduleService from "@/app/components/service/schedule.service";
import courseService from "@/app/components/service/course.service";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { Schedule } from "@/app/types/schedule";

// Type for the page params
interface PageParams {
  id: string;
}

interface Course {
  _id: string;
  title: string;
  isActive: boolean;
  isDeleted: boolean;
}

interface ScheduleFormData {
  courseId: string;
  country: string;
  scheduleType: string;
  startDate: string;
  endDate: string;
  days: string[];
  type: string;
  instructorName: string;
  accessType: string;
  state: string;
  city: string;
  standardPrice: number;
  offerPrice: number;
  isActive: boolean;
}

// Use a separate client component for the form to avoid React.use() complexity
function ScheduleEditForm({ id }: { id: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState<ScheduleFormData>({
    courseId: "",
    country: "",
    scheduleType: "self-paced",
    startDate: "",
    endDate: "",
    days: [],
    type: "weekday",
    instructorName: "",
    accessType: "90",
    state: "",
    city: "",
    standardPrice: 0,
    offerPrice: 0,
    isActive: true,
  });

  const scheduleTypes = [
    { value: "self-paced", label: "Self Paced" },
    { value: "online", label: "Live Online" },
    { value: "classroom", label: "Classroom" },
  ];

  const accessTypes = [
    { value: "30", label: "30 Days" },
    { value: "60", label: "60 Days" },
    { value: "90", label: "90 Days" },
    { value: "180", label: "180 Days" },
    { value: "365", label: "365 Days" },
    { value: "lifetime", label: "Lifetime" },
  ];

  const weekdayTypes = [
    { value: "weekday", label: "Weekday" },
    { value: "weekend", label: "Weekend" },
    { value: "all", label: "All Days" },
  ];

  // All days of the week
  const daysOfWeek = [
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
    { value: "7", label: "Sunday" },
  ];

  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

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

        // Fetch the schedule for editing
        const response = await scheduleService.getScheduleById(id);
        
        let scheduleData: Schedule | null = null;
        
        if (response && response.status && response.schedule) {
          // Standard response format
          scheduleData = response.schedule;
        } else if (response && '_id' in response) {
          // Direct object response format
          scheduleData = response as unknown as Schedule;
        } else {
          // Failed to find the schedule
          setError(response?.message || "Failed to find the schedule");
          console.error("Failed to fetch schedule:", response);
          setIsLoadingData(false);
          return;
        }
        
        // Set form data from fetched schedule
        setFormData({
          courseId: scheduleData?.courseId || "",
          country: scheduleData?.country || "",
          scheduleType: scheduleData?.scheduleType || "self-paced",
          startDate: scheduleData ? formatDateForInput(scheduleData.startDate) : "",
          endDate: scheduleData ? formatDateForInput(scheduleData.endDate) : "",
          days: scheduleData?.days || [],
          type: scheduleData?.type || "weekday",
          instructorName: scheduleData?.instructorName || "",
          accessType: scheduleData?.accessType || "90",
          state: scheduleData?.state || "",
          city: scheduleData?.city || "",
          standardPrice: scheduleData?.standardPrice || 0,
          offerPrice: scheduleData?.offerPrice || 0,
          isActive: scheduleData?.isActive !== false,
        });
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred while fetching data");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    
    // Special handling for numeric fields
    if (name === "standardPrice" || name === "offerPrice") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
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

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      // Add day to array if checked
      setFormData((prev) => ({
        ...prev,
        days: [...prev.days, value],
      }));
    } else {
      // Remove day from array if unchecked
      setFormData((prev) => ({
        ...prev,
        days: prev.days.filter((day) => day !== value),
      }));
    }
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

    if (!formData.country) {
      setError("Please enter a country");
      setIsLoading(false);
      return;
    }

    // Validate fields based on scheduleType
    if (formData.scheduleType === "self-paced") {
      if (!formData.accessType) {
        setError("Please select an access duration");
        setIsLoading(false);
        return;
      }
    } else if (formData.scheduleType === "online" || formData.scheduleType === "classroom") {
      if (!formData.startDate) {
        setError("Please enter a start date");
        setIsLoading(false);
        return;
      }

      if (!formData.endDate) {
        setError("Please enter an end date");
        setIsLoading(false);
        return;
      }

      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        setError("Start date cannot be later than end date");
        setIsLoading(false);
        return;
      }

      if (formData.days.length === 0) {
        setError("Please select at least one day");
        setIsLoading(false);
        return;
      }

      if (!formData.instructorName) {
        setError("Please enter an instructor name for the scheduled course");
        setIsLoading(false);
        return;
      }
      
      if (formData.scheduleType === "classroom") {
        if (!formData.state) {
          setError("Please enter a state");
          setIsLoading(false);
          return;
        }
        
        if (!formData.city) {
          setError("Please enter a city");
          setIsLoading(false);
          return;
        }
      }
    }

    if (formData.standardPrice < 0 || formData.offerPrice < 0) {
      setError("Prices cannot be negative");
      setIsLoading(false);
      return;
    }

    if (formData.offerPrice > formData.standardPrice) {
      setError("Offer price cannot be higher than standard price");
      setIsLoading(false);
      return;
    }

    try {
      // Submit the data
      const response = await scheduleService.updateSchedule(id, formData);

      if (response && (response.status || response._id)) {
        setSuccessMessage("Schedule updated successfully!");
        
        // Redirect to schedules list after a short delay
        setTimeout(() => {
          router.push("/dashboard/schedules");
        }, 1500);
      } else {
        setError(response?.message || "Failed to update schedule");
      }
    } catch (error: any) {
      console.error("Error updating schedule:", error);
      setError(error.message || "An error occurred while updating the schedule");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="large" text="Loading schedule data..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-[var(--background)] rounded-xl">
      <div className="mb-6">
        <Link
          href="/dashboard/schedules"
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
          Back to Schedules
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Edit Schedule</h1>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Schedule Type */}
          <div>
            <label htmlFor="scheduleType" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Schedule Type<span className="text-red-500"> *</span>
            </label>
            <select
              id="scheduleType"
              name="scheduleType"
              value={formData.scheduleType}
              onChange={handleChange}
              className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] p-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            >
              {scheduleTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Access Type - Only for self-paced */}
          {formData.scheduleType === "self-paced" && (
            <div>
              <label htmlFor="accessType" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Access Duration<span className="text-red-500"> *</span>
              </label>
              <select
                id="accessType"
                name="accessType"
                value={formData.accessType}
                onChange={handleChange}
                className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] p-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              >
                {accessTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Fields for online and classroom courses */}
        {(formData.scheduleType === "online" || formData.scheduleType === "classroom") && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Start Date<span className="text-red-500"> *</span>
                </label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  End Date<span className="text-red-500"> *</span>
                </label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Week Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Week Type<span className="text-red-500"> *</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] p-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              >
                {weekdayTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Days Selection */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Days<span className="text-red-500"> *</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {daysOfWeek.map((day) => (
                  <div key={day.value} className="flex items-center">
                    <input
                      id={`day-${day.value}`}
                      name="days"
                      type="checkbox"
                      value={day.value}
                      checked={formData.days.includes(day.value)}
                      onChange={handleDayChange}
                      className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    <label htmlFor={`day-${day.value}`} className="ml-2 block text-sm text-[var(--foreground)]">
                      {day.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Name */}
            <div>
              <label htmlFor="instructorName" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Instructor Name<span className="text-red-500"> *</span>
              </label>
              <Input
                id="instructorName"
                name="instructorName"
                value={formData.instructorName}
                onChange={handleChange}
                placeholder="Enter instructor name"
                required
              />
            </div>
          </>
        )}

        {/* Country field - shown for all types */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Country<span className="text-red-500"> *</span>
          </label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter country"
            required
          />
        </div>

        {/* State and City - Only for classroom */}
        {formData.scheduleType === "classroom" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* State */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                State<span className="text-red-500"> *</span>
              </label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                City<span className="text-red-500"> *</span>
              </label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Standard Price */}
          <div>
            <label htmlFor="standardPrice" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Standard Price<span className="text-red-500"> *</span>
            </label>
            <Input
              id="standardPrice"
              name="standardPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.standardPrice}
              onChange={handleChange}
              placeholder="Enter standard price"
              required
            />
          </div>

          {/* Offer Price */}
          <div>
            <label htmlFor="offerPrice" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Offer Price<span className="text-red-500"> *</span>
            </label>
            <Input
              id="offerPrice"
              name="offerPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.offerPrice}
              onChange={handleChange}
              placeholder="Enter offer price"
              required
            />
          </div>
        </div>

        {/* Active Status */}
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

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 mt-8">
          <Link
            href="/dashboard/schedules"
            className="px-4 py-2 border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] hover:bg-[var(--input-bg)] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || isLoadingCourses}
          >
            {isLoading ? <LoadingSpinner size="small" /> : "Update Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Main page component as server component
export default function EditSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ScheduleEditForm id={id} />;
} 