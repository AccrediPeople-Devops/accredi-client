"use client";

import React, { useState, useEffect } from "react";
import courseService from "./service/course.service";
import scheduleService from "./service/schedule.service";
import courseAssignmentService from "./service/courseAssignment.service";
import UserService from "./service/user.service";
import { LoadingSpinner } from "./LoadingSpinner";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  isDeleted?: boolean;
}

interface Course {
  _id: string;
  title: string;
  categoryId: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

interface Schedule {
  _id: string;
  courseId: string;
  startDate: string;
  endDate: string;
  scheduleType: string;
  location?: string;
  instructor?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

interface GlobalCourseAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function GlobalCourseAssignmentModal({
  isOpen,
  onClose,
  onSuccess
}: GlobalCourseAssignmentModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch data on modal open
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Fetch users, courses and schedules in parallel
      const [usersResponse, coursesResponse, schedulesResponse] = await Promise.allSettled([
        UserService.getAllUsers(),
        courseService.getAllCourses(),
        scheduleService.getAllSchedules()
      ]);

      // Process users - only show users with role "user"
      if (usersResponse.status === 'fulfilled' && usersResponse.value?.users) {
        const userUsers = usersResponse.value.users.filter(
          (user: User) => user.role === "user" && !user.isDeleted
        );
        setUsers(userUsers);
      }

      // Process courses
      if (coursesResponse.status === 'fulfilled' && coursesResponse.value?.courses) {
        const activeCourses = coursesResponse.value.courses.filter(
          (course: Course) => course.isActive && !course.isDeleted
        );
        setCourses(activeCourses);
      }

      // Process schedules
      if (schedulesResponse.status === 'fulfilled' && schedulesResponse.value?.schedules) {
        const activeSchedules = schedulesResponse.value.schedules.filter(
          (schedule: Schedule) => schedule.isActive && !schedule.isDeleted
        );
        setSchedules(activeSchedules);
      }
    } catch (err: any) {
      setError(err.message || "Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter schedules based on selected course
  const filteredSchedules = schedules.filter(
    schedule => schedule.courseId === selectedCourseId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId || !selectedCourseId || !selectedScheduleId) {
      setError("Please select user, course, and schedule");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const result = await courseAssignmentService.assignCourseToUser({
        userId: selectedUserId,
        courseId: selectedCourseId,
        scheduleId: selectedScheduleId
      });

      if (result.success) {
        setSuccess(result.message);
        // Reset form
        setSelectedUserId("");
        setSelectedCourseId("");
        setSelectedScheduleId("");
        
        // Call success callback after a short delay
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || "Error assigning course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getScheduleDisplayText = (schedule: Schedule) => {
    const startDate = formatDate(schedule.startDate);
    const endDate = formatDate(schedule.endDate);
    const type = schedule.scheduleType;
    const location = schedule.location || "Online";
    
    return `${startDate} - ${endDate} (${type}) - ${location}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--background)] rounded-[var(--radius-lg)] p-6 max-w-2xl w-full mx-4 shadow-[var(--shadow-lg)] transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-[var(--foreground)]">
            Assign Course to User
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="large" text="Loading users, courses and schedules..." />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                {success}
              </div>
            )}

            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Select User *
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => {
                  setSelectedUserId(e.target.value);
                  setSelectedCourseId(""); // Reset course when user changes
                  setSelectedScheduleId(""); // Reset schedule when user changes
                }}
                className="w-full px-3 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullName} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Select Course *
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  setSelectedScheduleId(""); // Reset schedule when course changes
                }}
                className="w-full px-3 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
                disabled={!selectedUserId}
              >
                <option value="">
                  {selectedUserId ? "Choose a course..." : "Select a user first..."}
                </option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Schedule Selection */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Select Schedule *
              </label>
              <select
                value={selectedScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
                disabled={!selectedCourseId}
              >
                <option value="">
                  {selectedCourseId ? "Choose a schedule..." : "Select a course first..."}
                </option>
                {filteredSchedules.map((schedule) => (
                  <option key={schedule._id} value={schedule._id}>
                    {getScheduleDisplayText(schedule)}
                  </option>
                ))}
              </select>
              {selectedCourseId && filteredSchedules.length === 0 && (
                <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                  No schedules available for this course.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[var(--foreground)] bg-[var(--input-bg)] border border-[var(--border)] rounded-md hover:bg-[var(--background-secondary)] transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isSubmitting || !selectedUserId || !selectedCourseId || !selectedScheduleId}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Assigning...
                  </>
                ) : (
                  "Assign Course"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 