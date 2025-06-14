"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardInput, DashboardSelect, DashboardCheckbox } from "@/app/components/DashboardInput";
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
        <DashboardSelect
          label="Course"
          name="courseId"
          value={formData.courseId}
          onChange={handleChange}
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
        </DashboardSelect>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Schedule Type */}
          <DashboardSelect
            label="Schedule Type"
            name="scheduleType"
            value={formData.scheduleType}
            onChange={handleChange}
            required
          >
            {scheduleTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </DashboardSelect>

          {/* Access Type - Only for self-paced */}
          {formData.scheduleType === "self-paced" && (
            <DashboardSelect
              label="Access Duration"
              name="accessType"
              value={formData.accessType}
              onChange={handleChange}
              required
            >
              {accessTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </DashboardSelect>
          )}
        </div>

        {/* Fields for online and classroom courses */}
        {(formData.scheduleType === "online" || formData.scheduleType === "classroom") && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <DashboardInput
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />

              {/* End Date */}
              <DashboardInput
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Week Type */}
            <DashboardSelect
              label="Week Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              {weekdayTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </DashboardSelect>

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
            <DashboardInput
              label="Instructor Name"
              name="instructorName"
              value={formData.instructorName}
              onChange={handleChange}
              placeholder="Enter instructor name"
              required
            />
          </>
        )}

        {/* Country field - shown for all types */}
        <DashboardInput
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Enter country"
          required
        />

        {/* State and City - Only for classroom */}
        {formData.scheduleType === "classroom" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* State */}
            <DashboardInput
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
              required
            />

            {/* City */}
            <DashboardInput
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              required
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Standard Price */}
          <DashboardInput
            label="Standard Price"
            name="standardPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.standardPrice}
            onChange={handleChange}
            placeholder="Enter standard price"
            required
          />

          {/* Offer Price */}
          <DashboardInput
            label="Offer Price"
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

        {/* Active Status */}
        <DashboardCheckbox
          name="isActive"
          checked={formData.isActive}
          onChange={handleCheckboxChange}
          label="Active"
        />

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