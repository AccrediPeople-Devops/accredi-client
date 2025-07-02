"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/app/types/user";
import UserProfileService, { PurchasedCourse, UserResource, UserLink } from "@/app/components/user-dashboard/services/userProfile.service";
import Image from "next/image";
import config from "@/app/components/config/config";
import Link from "next/link";
import { 
  HiOutlineAcademicCap, 
  HiOutlineClipboardCheck, 
  HiOutlineDownload, 
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineTrendingUp,
  HiOutlineCalendar,
  HiOutlineBadgeCheck,
  HiOutlineRefresh,
  HiOutlineBookOpen,
  HiOutlinePlay
} from "react-icons/hi";

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  upcomingCourses: number;
  totalResources: number;
  totalSessions: number;
}

export default function UserDashboardProfile() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    upcomingCourses: 0,
    totalResources: 0,
    totalSessions: 0
  });
  const [recentCourses, setRecentCourses] = useState<PurchasedCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchDashboardData = async () => {
    setIsStatsLoading(true);
    try {
      // Fetch all data in parallel
      const [coursesResponse, resourcesResponse, sessionsResponse] = await Promise.allSettled([
        UserProfileService.getPurchasedCourses(),
        UserProfileService.getUserResources(),
        UserProfileService.getUserLinks()
      ]);

      let stats: DashboardStats = {
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        upcomingCourses: 0,
        totalResources: 0,
        totalSessions: 0
      };

      // Process courses data
      if (coursesResponse.status === 'fulfilled' && coursesResponse.value.courses) {
        const courses = coursesResponse.value.courses;
        stats.totalCourses = courses.length;
        setRecentCourses(courses.slice(0, 3)); // Get latest 3 courses

        // Calculate course status based on dates
        const currentDate = new Date();
        courses.forEach(course => {
          const startDate = course.scheduleId.startDate ? new Date(course.scheduleId.startDate) : null;
          const endDate = course.scheduleId.endDate ? new Date(course.scheduleId.endDate) : null;
          
          if (course.scheduleId.scheduleType === 'self-paced') {
            stats.inProgressCourses++;
          } else if (startDate && endDate) {
            if (currentDate > endDate) {
              stats.completedCourses++;
            } else if (currentDate >= startDate) {
              stats.inProgressCourses++;
            } else {
              stats.upcomingCourses++;
            }
          }
        });
      }

      // Process resources data
      if (resourcesResponse.status === 'fulfilled' && resourcesResponse.value.resources) {
        const resources = resourcesResponse.value.resources.filter(r => r.isActive && !r.isDeleted);
        stats.totalResources = resources.reduce((total, resource) => 
          total + resource.content.length, 0
        );
      }

      // Process sessions data
      if (sessionsResponse.status === 'fulfilled' && sessionsResponse.value.links) {
        const sessions = sessionsResponse.value.links.filter(s => s.isActive && !s.isDeleted);
        stats.totalSessions = sessions.length;
      }

      setDashboardStats(stats);
      console.log("📊 DASHBOARD: Stats updated:", stats);
    } catch (error) {
      console.error("❌ DASHBOARD: Error fetching dashboard data:", error);
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      console.log("🔍 PROFILE OVERVIEW: Fetching user profile from API...");
      setIsLoading(true);
      setError("");
      
      try {
        const profileData = await UserProfileService.getCurrentUserProfile();
        console.log("👤 PROFILE OVERVIEW: Profile data received:", profileData);
        
        if (profileData && profileData._id) {
          setCurrentUser(profileData);
          console.log("✅ PROFILE OVERVIEW: User profile loaded successfully");
        } else {
          throw new Error("Invalid profile data received");
        }
      } catch (error: any) {
        console.error("❌ PROFILE OVERVIEW: Error fetching profile:", error);
        setError(error.response?.data?.message || error.message || "Failed to load profile");
        
        // Fallback to token data if API fails
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const storedEmail = localStorage.getItem("userEmail") || "";
            const userName = storedEmail ? storedEmail.split('@')[0].replace(/[._]/g, ' ') : "User";
            
            const fallbackUser: User = {
              _id: tokenPayload.userId,
              fullName: userName,
              email: storedEmail,
              role: tokenPayload.role,
              contactNumber: "",
              country: "",
              city: "",
              isActive: true,
              isDeleted: false,
              createdAt: "",
              updatedAt: ""
            };
            
            setCurrentUser(fallbackUser);
            console.log("⚠️ PROFILE OVERVIEW: Using fallback token data");
          }
        } catch (fallbackError) {
          console.error("❌ PROFILE OVERVIEW: Fallback failed:", fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
    fetchDashboardData();
  }, []);

  const getUserProfileImage = (user: User) => {
    // First check for direct profileImageUrl from API
    if (user.profileImageUrl) {
      return user.profileImageUrl;
    }
    
    // Fallback to profileImage.path
    if (user.profileImage?.path) {
      return `${config.imageUrl}${user.profileImage.path}`;
    }
    
    return null;
  };

  const formatMemberSince = (createdAt: string) => {
    if (!createdAt) return new Date().getFullYear();
    
    try {
      const date = new Date(createdAt);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    } catch {
      return new Date().getFullYear();
    }
  };

  const getAccountStatus = (user: User) => {
    if (!user.isActive) {
      return {
        label: "Inactive Account",
        className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      };
    }
    
    if (user.isEmailVerified === false) {
      return {
        label: "Email Not Verified",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      };
    }
    
    return {
      label: "Active Account",
      className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground-muted)]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">Failed to Load Profile</h3>
          <p className="text-[var(--foreground-muted)] mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] rounded-[var(--radius-md)] font-medium transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const accountStatus = currentUser ? getAccountStatus(currentUser) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Profile Overview</h1>
            <p className="text-[var(--foreground-muted)]">Welcome back! Here's your learning progress and account status</p>
          </div>
          <button
            onClick={() => {
              fetchDashboardData();
              // Also refresh user profile if needed
              window.location.reload();
            }}
            disabled={isLoading || isStatsLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-text)] rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <HiOutlineRefresh className={`w-4 h-4 ${(isLoading || isStatsLoading) ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && currentUser && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-[var(--radius-md)] p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Using cached profile data
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Info Card */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
        <div className="flex items-center gap-6">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--input-bg)] border-2 border-[var(--border)]">
              {currentUser && getUserProfileImage(currentUser) ? (
                <Image
                  src={getUserProfileImage(currentUser)!}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-[var(--primary-text)] text-xl font-bold">
                  {currentUser?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
          </div>
          
          {/* User Details */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-1">
              {currentUser?.fullName || 'User'}
            </h2>
            <p className="text-[var(--foreground-muted)] mb-2">{currentUser?.email}</p>
            <div className="flex items-center gap-4">
              {accountStatus && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${accountStatus.className}`}>
                  <HiOutlineBadgeCheck className="w-3 h-3 mr-1" />
                  {accountStatus.label}
                </span>
              )}
              <span className="text-sm text-[var(--foreground-muted)]">
                Member since {formatMemberSince(currentUser?.createdAt || "")}
              </span>
            </div>
            
            {/* Additional Info */}
            {currentUser && (currentUser.contactNumber || currentUser.country || currentUser.city) && (
              <div className="mt-3 flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
                {currentUser.contactNumber && (
                  <span>📞 {currentUser.contactNumber}</span>
                )}
                {(currentUser.city || currentUser.country) && (
                  <span>📍 {[currentUser.city, currentUser.country].filter(Boolean).join(', ')}</span>
                )}
              </div>
            )}
          </div>

          {/* Edit Profile Button */}
          <div>
            <Link 
              href="/user-dashboard/general"
              className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] rounded-[var(--radius-md)] font-medium transition-colors duration-200"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Enrolled Courses */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <HiOutlineAcademicCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-[var(--foreground)]">
              {isStatsLoading ? (
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                dashboardStats.totalCourses
              )}
            </span>
          </div>
          <h3 className="font-medium text-[var(--foreground)] mb-1">Enrolled Courses</h3>
          <p className="text-sm text-[var(--foreground-muted)]">Total purchased courses</p>
        </div>

        {/* Completed Courses */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <HiOutlineClipboardCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-2xl font-bold text-[var(--foreground)]">
              {isStatsLoading ? (
                <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                dashboardStats.completedCourses
              )}
            </span>
          </div>
          <h3 className="font-medium text-[var(--foreground)] mb-1">Completed</h3>
          <p className="text-sm text-[var(--foreground-muted)]">Courses finished</p>
        </div>

        {/* Resources */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <HiOutlineDownload className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-2xl font-bold text-[var(--foreground)]">
              {isStatsLoading ? (
                <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                dashboardStats.totalResources
              )}
            </span>
          </div>
          <h3 className="font-medium text-[var(--foreground)] mb-1">Resources</h3>
          <p className="text-sm text-[var(--foreground-muted)]">Available downloads</p>
        </div>

        {/* Sessions */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <HiOutlineCalendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-2xl font-bold text-[var(--foreground)]">
              {isStatsLoading ? (
                <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                dashboardStats.totalSessions
              )}
            </span>
          </div>
          <h3 className="font-medium text-[var(--foreground)] mb-1">Sessions</h3>
          <p className="text-sm text-[var(--foreground-muted)]">Available sessions</p>
        </div>
      </div>

      {/* Recent Activity & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">Recent Activity</h3>
          
          <div className="space-y-4">
            {isStatsLoading ? (
              <div className="text-center py-6">
                <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-[var(--foreground-muted)]">Loading recent activity...</p>
              </div>
            ) : recentCourses.length > 0 ? (
              recentCourses.map((course, index) => {
                const purchaseDate = new Date(course.createdAt);
                const daysAgo = Math.floor((new Date().getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
                const timeAgo = daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
                
                return (
                  <div key={course._id} className="flex items-center gap-4 p-3 bg-[var(--input-bg)] rounded-[var(--radius-md)]">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <HiOutlineAcademicCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        Enrolled in "{course.courseId.title}"
                      </p>
                      <p className="text-xs text-[var(--foreground-muted)]">{timeAgo}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6">
                <HiOutlineAcademicCap className="w-8 h-8 text-[var(--foreground-muted)] mx-auto mb-2" />
                <p className="text-sm text-[var(--foreground-muted)]">No recent activity</p>
                <p className="text-xs text-[var(--foreground-muted)]">Your course enrollments will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Course Status Overview */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">Course Status Overview</h3>
          
          <div className="space-y-4">
            {isStatsLoading ? (
              <div className="text-center py-6">
                <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-[var(--foreground-muted)]">Loading courses...</p>
              </div>
            ) : recentCourses.length > 0 ? (
              recentCourses.slice(0, 3).map((course) => {
                // Determine course status
                const currentDate = new Date();
                const startDate = course.scheduleId.startDate ? new Date(course.scheduleId.startDate) : null;
                const endDate = course.scheduleId.endDate ? new Date(course.scheduleId.endDate) : null;
                
                let status = 'Self-Paced';
                let statusColor = 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200';
                let statusIcon = <HiOutlineBookOpen className="w-4 h-4" />;

                if (course.scheduleId.scheduleType !== 'self-paced' && startDate && endDate) {
                  if (currentDate > endDate) {
                    status = 'Completed';
                    statusColor = 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
                    statusIcon = <HiOutlineClipboardCheck className="w-4 h-4" />;
                  } else if (currentDate >= startDate) {
                    status = 'In Progress';
                    statusColor = 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200';
                    statusIcon = <HiOutlinePlay className="w-4 h-4" />;
                  } else {
                    status = 'Upcoming';
                    statusColor = 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200';
                    statusIcon = <HiOutlineCalendar className="w-4 h-4" />;
                  }
                }

                const formatDate = (dateStr: string) => {
                  return new Date(dateStr).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });
                };

                return (
                  <div key={course._id} className="border border-[var(--border)] rounded-[var(--radius-md)] p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-[var(--foreground)] mb-1">
                          {course.courseId.title}
                        </h4>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          {course.scheduleId.scheduleType === 'online' ? 'Online' : 
                           course.scheduleId.scheduleType === 'classroom' ? 'Classroom' : 'Self-Paced'}
                          {course.scheduleId.instructorName && ` • ${course.scheduleId.instructorName}`}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        {statusIcon}
                        {status}
                      </span>
                    </div>
                    
                    {startDate && endDate && course.scheduleId.scheduleType !== 'self-paced' && (
                      <div className="text-xs text-[var(--foreground-muted)]">
                        <span className="font-medium">Schedule:</span> {formatDate(course.scheduleId.startDate)} - {formatDate(course.scheduleId.endDate)}
                      </div>
                    )}
                    
                    {course.scheduleId.scheduleType === 'self-paced' && (
                      <div className="text-xs text-[var(--foreground-muted)]">
                        <span className="font-medium">Access:</span> {course.scheduleId.accessType} days from enrollment
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6">
                <HiOutlineAcademicCap className="w-8 h-8 text-[var(--foreground-muted)] mx-auto mb-2" />
                <p className="text-sm text-[var(--foreground-muted)]">No courses enrolled</p>
                <p className="text-xs text-[var(--foreground-muted)]">Your enrolled courses will appear here</p>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          {!isStatsLoading && recentCourses.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[var(--border)]">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-[var(--foreground)]">
                    {dashboardStats.completedCourses}
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)]">Completed</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-[var(--foreground)]">
                    {dashboardStats.inProgressCourses}
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)]">In Progress</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-[var(--foreground)]">
                    {dashboardStats.upcomingCourses}
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)]">Upcoming</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-[var(--border)]">
            <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/user-dashboard/sessions"
                className="flex items-center gap-2 p-3 bg-[var(--input-bg)] hover:bg-[var(--border)] rounded-[var(--radius-md)] transition-colors duration-200"
              >
                <HiOutlineCalendar className="w-4 h-4 text-[var(--foreground-muted)]" />
                <span className="text-sm text-[var(--foreground)]">Sessions</span>
              </Link>
              <Link 
                href="/user-dashboard/resources"
                className="flex items-center gap-2 p-3 bg-[var(--input-bg)] hover:bg-[var(--border)] rounded-[var(--radius-md)] transition-colors duration-200"
              >
                <HiOutlineDownload className="w-4 h-4 text-[var(--foreground-muted)]" />
                <span className="text-sm text-[var(--foreground)]">Resources</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 