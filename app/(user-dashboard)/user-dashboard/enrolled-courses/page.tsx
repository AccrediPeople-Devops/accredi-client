"use client";

import React, { useState, useEffect } from "react";
import { 
  HiOutlineCalendar, 
  HiOutlineClock,
  HiOutlineDesktopComputer,
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlinePlay,
  HiOutlineBookOpen,
  HiOutlineGlobeAlt,
  HiOutlineUsers,
  HiOutlineRefresh
} from "react-icons/hi";
import userProfileService, { PurchasedCourse } from "@/app/components/user-dashboard/services/userProfile.service";

interface EnrolledCourse {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  schedule: string; // e.g., "Weekend"
  deliveryMethod: string; // e.g., "Instructor-Led Live Online", "Self-Paced Learning"
  status: 'completed' | 'in-progress' | 'upcoming' | 'self-paced';
  accessDays?: number; // for self-paced courses
  progress?: number; // percentage for in-progress courses
  instructor?: string;
  courseType: 'live' | 'self-paced';
  courseId?: string;
  scheduleId?: string;
  purchaseDate?: string;
}

export default function EnrolledCoursesPage() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'upcoming' | 'self-paced'>('all');

  /**
   * Transform purchased course data to enrolled course format
   */
  const transformPurchasedCourse = (purchasedCourse: PurchasedCourse): EnrolledCourse => {
    const { courseId, scheduleId } = purchasedCourse;
    
    // Determine course status based on schedule dates
    const currentDate = new Date();
    const startDate = scheduleId.startDate ? new Date(scheduleId.startDate) : null;
    const endDate = scheduleId.endDate ? new Date(scheduleId.endDate) : null;
    
    let status: EnrolledCourse['status'] = 'upcoming';
    if (scheduleId.scheduleType === 'self-paced') {
      status = 'self-paced';
    } else if (startDate && endDate) {
      if (currentDate > endDate) {
        status = 'completed';
      } else if (currentDate >= startDate) {
        status = 'in-progress';
      } else {
        status = 'upcoming';
      }
    }

    // Determine delivery method
    let deliveryMethod = 'Instructor-Led Live Online';
    if (scheduleId.scheduleType === 'online') {
      deliveryMethod = 'Instructor-Led Live Online';
    } else if (scheduleId.scheduleType === 'self-paced') {
      deliveryMethod = 'E-Learning';
    } else if (scheduleId.scheduleType === 'classroom') {
      deliveryMethod = 'Classroom Training';
    }

    // Determine schedule type
    let schedule = 'Weekdays';
    if (scheduleId.type === 'weekend') {
      schedule = 'Weekend';
    } else if (scheduleId.type === 'weekday') {
      schedule = 'Weekdays';
    } else if (scheduleId.scheduleType === 'self-paced') {
      schedule = 'SELF-PACED LEARNING';
    }

    return {
      id: purchasedCourse._id,
      title: courseId.title,
      startDate: scheduleId.startDate,
      endDate: scheduleId.endDate,
      startTime: '9:00 AM', // Default time as API doesn't provide this
      endTime: '5:00 PM',   // Default time as API doesn't provide this
      timezone: 'UTC',      // Default timezone as API doesn't provide this
      schedule,
      deliveryMethod,
      status,
      accessDays: scheduleId.scheduleType === 'self-paced' ? parseInt(scheduleId.accessType) : undefined,
      progress: status === 'in-progress' ? Math.floor(Math.random() * 50) + 25 : undefined, // Mock progress
      instructor: scheduleId.instructorName,
      courseType: scheduleId.scheduleType === 'self-paced' ? 'self-paced' : 'live',
      courseId: courseId._id,
      scheduleId: scheduleId._id,
      purchaseDate: purchasedCourse.createdAt
    };
  };

  const fetchEnrolledCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching purchased courses...");
      const response = await userProfileService.getPurchasedCourses();
      console.log("Purchased courses response:", response);
      
      if (response.status && response.courses) {
        const transformedCourses = response.courses.map(transformPurchasedCourse);
        setCourses(transformedCourses);
        console.log("Transformed courses:", transformedCourses);
      } else {
        setCourses([]);
      }
    } catch (error: any) {
      console.error('Error fetching enrolled courses:', error);
      setError(error.message || 'Failed to fetch enrolled courses');
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const getStatusIcon = (status: EnrolledCourse['status']) => {
    switch (status) {
      case 'completed':
        return <HiOutlineCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'in-progress':
        return <HiOutlinePlay className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'upcoming':
        return <HiOutlineCalendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      case 'self-paced':
        return <HiOutlineBookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <HiOutlineAcademicCap className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusColor = (status: EnrolledCourse['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'in-progress':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'upcoming':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20';
      case 'self-paced':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusText = (status: EnrolledCourse['status']) => {
    switch (status) {
      case 'completed':
        return 'Course Completed';
      case 'in-progress':
        return 'In Progress';
      case 'upcoming':
        return 'Upcoming';
      case 'self-paced':
        return 'Self-Paced';
      default:
        return 'Unknown';
    }
  };

  const getDeliveryIcon = (deliveryMethod: string) => {
    if (deliveryMethod.includes('Online') || deliveryMethod.includes('Live')) {
      return <HiOutlineGlobeAlt className="w-4 h-4" />;
    } else if (deliveryMethod.includes('E-Learning')) {
      return <HiOutlineDesktopComputer className="w-4 h-4" />;
    } else {
      return <HiOutlineUsers className="w-4 h-4" />;
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startFormatted = start.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const endFormatted = end.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    return `${startFormatted} to ${endFormatted}`;
  };

  const filteredCourses = courses.filter(course => 
    filter === 'all' || course.status === filter
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground-muted)]">Loading enrolled courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Purchased Courses</h1>
            <p className="text-[var(--foreground-muted)]">View and manage your enrolled courses</p>
          </div>
          <button
            onClick={fetchEnrolledCourses}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-text)] rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <HiOutlineRefresh className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-[var(--radius-md)] text-red-800 dark:text-red-200">
            <p className="font-medium">Error loading courses</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={fetchEnrolledCourses}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'All Courses' },
          { key: 'completed', label: 'Completed' },
          { key: 'in-progress', label: 'In Progress' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'self-paced', label: 'Self-Paced' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-[var(--radius-md)] font-medium transition-colors duration-200 ${
              filter === tab.key
                ? 'bg-[var(--primary)] text-[var(--primary-text)]'
                : 'bg-[var(--input-bg)] text-[var(--foreground)] hover:bg-[var(--border)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <HiOutlineAcademicCap className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
              {error ? 'Unable to load courses' : 'No courses found'}
            </h3>
            <p className="text-[var(--foreground-muted)] mb-4">
              {error 
                ? 'There was an error loading your purchased courses. Please try refreshing the page.'
                : filter === 'all' 
                  ? 'You have not purchased any courses yet. Browse our course catalog to get started!'
                  : `No ${filter.replace('-', ' ')} courses found. Try selecting a different filter.`
              }
            </p>
            {!error && filter === 'all' && (
              <button
                onClick={() => window.location.href = '/courses'}
                className="px-6 py-2 bg-[var(--primary)] text-[var(--primary-text)] rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors duration-200"
              >
                Browse Courses
              </button>
            )}
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 hover:bg-[var(--border)] transition-colors duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Course Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${getStatusColor(course.status)}`}>
                      {getStatusIcon(course.status)}
                    </div>
                    <div className="flex-1">
                      <div className="bg-yellow-200 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-md text-sm font-medium inline-block mb-2">
                        {course.title}
                      </div>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-3 ml-11">
                    {/* Date and Time */}
                    {course.courseType === 'live' && (
                      <>
                        <div className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                          <HiOutlineCalendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span>{formatDateRange(course.startDate, course.endDate)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                          <HiOutlineClock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span>{course.startTime} - {course.endTime} {course.timezone}</span>
                        </div>
                      </>
                    )}

                    {/* Self-paced access */}
                    {course.courseType === 'self-paced' && course.accessDays && (
                      <div className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                        <HiOutlineCalendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>{course.accessDays} Days Access</span>
                      </div>
                    )}

                    {/* Delivery Method */}
                    <div className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                      {getDeliveryIcon(course.deliveryMethod)}
                      <span>{course.deliveryMethod}</span>
                    </div>

                    {/* Schedule */}
                    <div className="text-sm font-medium text-[var(--foreground)] mt-2">
                      {course.schedule}
                    </div>

                    {/* Instructor */}
                    {course.instructor && (
                      <div className="text-sm text-[var(--foreground-muted)]">
                        Instructor: {course.instructor}
                      </div>
                    )}

                    {/* Additional Course Info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--foreground-muted)] mt-3 pt-3 border-t border-[var(--border)]">
                      {course.courseId && (
                        <span>Course ID: {course.courseId}</span>
                      )}
                      {course.scheduleId && (
                        <span>Schedule ID: {course.scheduleId}</span>
                      )}
                      {course.purchaseDate && (
                        <span>Purchased: {new Date(course.purchaseDate).toLocaleDateString()}</span>
                      )}
                    </div>

                    {/* Progress Bar for in-progress and self-paced courses */}
                    {(course.status === 'in-progress' || course.status === 'self-paced') && course.progress && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-[var(--foreground)]">
                            Progress
                          </span>
                          <span className="text-sm text-[var(--foreground-muted)]">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-[var(--input-bg)] rounded-full h-2">
                          <div 
                            className="bg-[var(--primary)] h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.status === 'completed' 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                      : course.status === 'in-progress'
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                      : course.status === 'upcoming'
                      ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200'
                      : 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200'
                  }`}>
                    {getStatusText(course.status)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {courses.length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">Total Courses</div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {courses.filter(c => c.status === 'completed').length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">Completed</div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {courses.filter(c => c.status === 'in-progress').length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">In Progress</div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {courses.filter(c => c.status === 'upcoming').length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">Upcoming</div>
        </div>
      </div>
    </div>
  );
} 