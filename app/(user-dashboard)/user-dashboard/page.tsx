"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/app/types/user";
import UserProfileService from "@/app/components/user-dashboard/services/userProfile.service";
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
  HiOutlineBadgeCheck
} from "react-icons/hi";

export default function UserDashboardProfile() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

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
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Profile Overview</h1>
        <p className="text-[var(--foreground-muted)]">Welcome back! Here's your learning progress and account status</p>
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
              {currentUser?.course?.length || 0}
            </span>
          </div>
          <h3 className="font-medium text-[var(--foreground)] mb-1">Enrolled Courses</h3>
          <p className="text-sm text-[var(--foreground-muted)]">Active enrollments</p>
        </div>

        {/* Completed Courses */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <HiOutlineClipboardCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-2xl font-bold text-[var(--foreground)]">1</span>
          </div>
          <h3 className="font-medium text-[var(--foreground)] mb-1">Completed</h3>
          <p className="text-sm text-[var(--foreground-muted)]">Courses finished</p>
        </div>

        {/* Certificates */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <HiOutlineDownload className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-2xl font-bold text-[var(--foreground)]">1</span>
          </div>
          <h3 className="font-medium text-[var(--foreground)] mb-1">Certificates</h3>
          <p className="text-sm text-[var(--foreground-muted)]">Ready to download</p>
        </div>

        {/* Study Hours */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <HiOutlineClock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-2xl font-bold text-[var(--foreground)]">24</span>
          </div>
          <h3 className="font-medium text-[var(--foreground)] mb-1">Study Hours</h3>
          <p className="text-sm text-[var(--foreground-muted)]">This month</p>
        </div>
      </div>

      {/* Recent Activity & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">Recent Activity</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-[var(--input-bg)] rounded-[var(--radius-md)]">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <HiOutlineClipboardCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--foreground)]">Completed "Project Management Basics"</p>
                <p className="text-xs text-[var(--foreground-muted)]">2 days ago</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-[var(--input-bg)] rounded-[var(--radius-md)]">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <HiOutlineAcademicCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--foreground)]">Started "Advanced Scrum Master"</p>
                <p className="text-xs text-[var(--foreground-muted)]">1 week ago</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-[var(--input-bg)] rounded-[var(--radius-md)]">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <HiOutlineDownload className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--foreground)]">Downloaded certificate</p>
                <p className="text-xs text-[var(--foreground-muted)]">1 week ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">Learning Progress</h3>
          
          <div className="space-y-6">
            {/* Course Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[var(--foreground)]">Advanced Scrum Master</span>
                <span className="text-sm text-[var(--foreground-muted)]">75%</span>
              </div>
              <div className="w-full bg-[var(--input-bg)] rounded-full h-2">
                <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[var(--foreground)]">Quality Management</span>
                <span className="text-sm text-[var(--foreground-muted)]">45%</span>
              </div>
              <div className="w-full bg-[var(--input-bg)] rounded-full h-2">
                <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[var(--foreground)]">Agile Fundamentals</span>
                <span className="text-sm text-[var(--foreground-muted)]">20%</span>
              </div>
              <div className="w-full bg-[var(--input-bg)] rounded-full h-2">
                <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>

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
                href="/user-dashboard/certificates"
                className="flex items-center gap-2 p-3 bg-[var(--input-bg)] hover:bg-[var(--border)] rounded-[var(--radius-md)] transition-colors duration-200"
              >
                <HiOutlineDownload className="w-4 h-4 text-[var(--foreground-muted)]" />
                <span className="text-sm text-[var(--foreground)]">Certificates</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 