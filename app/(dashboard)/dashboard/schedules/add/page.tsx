"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardInput, DashboardSelect, DashboardCheckbox } from "@/app/components/DashboardInput";
import SearchableDropdown from "@/app/components/SearchableDropdown";
import CountryButton from "@/app/components/CountryButton";
import StateButton from "@/app/components/StateButton";
import scheduleService from "@/app/components/service/schedule.service";
import courseService from "@/app/components/service/course.service";
import locationService from "@/app/components/service/location.service";
import { WORLD_COUNTRIES } from "@/app/components/service/worldLocationData";
import { CountryData } from "@/app/context/LocationContext";
import { StateData } from "@/app/components/service/enhancedLocationData";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { formatDateForInput, parseDateLocal } from "@/app/utils/dateUtils";

interface Course {
  _id: string;
  title: string;
  isActive: boolean;
  isDeleted: boolean;
}

interface ScheduleFormData {
  courseId: string;
  country: string;
  countryCode: string;
  scheduleType: string;
  startDate: string;
  endDate: string;
  days: string[];
  type: string;
  instructorName: string;
  accessType: string;
  state: string;
  stateCode: string;
  city: string;
  standardPrice: number;
  offerPrice: number;
  isActive: boolean;
}

export default function AddSchedulePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState<ScheduleFormData>({
    courseId: "",
    country: "",
    countryCode: "",
    scheduleType: "self-paced",
    startDate: "",
    endDate: "",
    days: [],
    type: "weekday",
    instructorName: "",
    accessType: "90",
    state: "",
    stateCode: "",
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
    { value: "manual", label: "Manual" },
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
    } else if (name === "type") {
      // Handle week type change and auto-select days
      let selectedDays: string[] = [];
      
      switch (value) {
        case "weekday":
          selectedDays = ["1", "2", "3", "4", "5"]; // Monday to Friday
          break;
        case "weekend":
          selectedDays = ["6", "7"]; // Saturday and Sunday
          break;
        case "all":
          selectedDays = ["1", "2", "3", "4", "5", "6", "7"]; // All days
          break;
        default:
          selectedDays = [];
      }
      
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        days: selectedDays,
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

  // Helper function to determine week type based on selected days
  const getWeekTypeFromDays = (days: string[]): string => {
    const sortedDays = [...days].sort();
    
    // Check if it matches weekday pattern (Mon-Fri)
    if (sortedDays.length === 5 && 
        sortedDays.every(day => ["1", "2", "3", "4", "5"].includes(day))) {
      return "weekday";
    }
    
    // Check if it matches weekend pattern (Sat-Sun)
    if (sortedDays.length === 2 && 
        sortedDays.every(day => ["6", "7"].includes(day))) {
      return "weekend";
    }
    
    // Check if it matches all days pattern
    if (sortedDays.length === 7 && 
        sortedDays.every(day => ["1", "2", "3", "4", "5", "6", "7"].includes(day))) {
      return "all";
    }
    
    // If it doesn't match any pattern, it's manual
    return "manual";
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    let newDays: string[];
    if (checked) {
      // Add day to array if checked
      newDays = [...formData.days, value];
    } else {
      // Remove day from array if unchecked
      newDays = formData.days.filter((day) => day !== value);
    }
    
    // Determine the appropriate week type based on the new day selection
    const newWeekType = getWeekTypeFromDays(newDays);
    
    setFormData((prev) => ({
      ...prev,
      days: newDays,
      type: newWeekType,
    }));
  };

  // Location dropdown handlers
  const handleCountryChange = (value: string, code?: string) => {
    setFormData((prev) => ({
      ...prev,
      country: value,
      countryCode: code || "",
      state: "",
      stateCode: "",
      city: "",
    }));
  };

  // Country button handler
  const handleCountrySelect = (country: CountryData) => {
    setFormData((prev) => ({
      ...prev,
      country: country.name,
      countryCode: country.code,
      state: "",
      stateCode: "",
      city: "",
    }));
  };

  // State button handler
  const handleStateSelect = (state: StateData) => {
    setFormData((prev) => ({
      ...prev,
      state: state.name,
      stateCode: state.code,
      city: "",
    }));
  };

  const handleCityChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      city: value,
    }));
  };

  // City input handler
  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      city: e.target.value,
    }));
  };

  // Get location options - using comprehensive world database
  const countryOptions = WORLD_COUNTRIES.map(country => ({
    value: country.name,
    label: country.name,
    code: country.code
  }));

  const stateOptions = formData.countryCode 
    ? locationService.getStatesByCountry(formData.countryCode).map(state => ({
        value: state.name,
        label: state.name,
        code: state.code
      }))
    : [];

  const cityOptions = formData.countryCode && formData.stateCode
    ? locationService.getCitiesByState(formData.countryCode, formData.stateCode).map(city => ({
        value: city,
        label: city
      }))
    : [];

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

      if (parseDateLocal(formData.startDate)! > parseDateLocal(formData.endDate)!) {
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
      const response = await scheduleService.createSchedule(formData);

      if (response && (response.status || response._id)) {
        setSuccessMessage("Schedule created successfully!");
        
        // Reset form
        setFormData({
          courseId: "",
          country: "",
          countryCode: "",
          scheduleType: "self-paced",
          startDate: "",
          endDate: "",
          days: [],
          type: "weekday",
          instructorName: "",
          accessType: "90",
          state: "",
          stateCode: "",
          city: "",
          standardPrice: 0,
          offerPrice: 0,
          isActive: true,
        });

        // Redirect to schedules list after a short delay
        setTimeout(() => {
          router.push("/dashboard/schedules");
        }, 1500);
      } else {
        setError(response?.message || "Failed to create schedule");
      }
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      setError(error.message || "An error occurred while creating the schedule");
    } finally {
      setIsLoading(false);
    }
  };

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

      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Add New Schedule</h1>

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
            <div>
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
              <p className="mt-1 text-sm text-[var(--foreground)]/60">
                Days will be automatically selected: 
                <span className="font-medium"> Weekday</span> (Mon-Fri), 
                <span className="font-medium"> Weekend</span> (Sat-Sun), 
                <span className="font-medium"> All Days</span> (Mon-Sun).
                <br />
                <span className="font-medium">Manual</span> selection will be set automatically when you customize the days.
              </p>
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
        <CountryButton
          label="Country"
          selectedCountryCode={formData.countryCode}
          onCountrySelect={handleCountrySelect}
          placeholder="Select a country"
          required
        />

        {/* State and City - Only for classroom */}
        {formData.scheduleType === "classroom" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* State */}
            <StateButton
              label="State"
              selectedCountryCode={formData.countryCode}
              selectedStateCode={formData.stateCode}
              onStateSelect={handleStateSelect}
              placeholder="Select a state"
              disabled={!formData.countryCode}
              required
            />

            {/* City */}
            <DashboardInput
              label="City"
              name="city"
              value={formData.city}
              onChange={handleCityInputChange}
              placeholder={!formData.stateCode ? "Select a state first" : "Enter city name"}
              disabled={!formData.stateCode}
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
            {isLoading ? <LoadingSpinner size="small" /> : "Create Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
} 