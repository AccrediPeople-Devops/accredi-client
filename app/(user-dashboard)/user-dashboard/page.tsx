"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/app/types/user";
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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      console.log("🔍 PROFILE OVERVIEW: Loading user data from token...");
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("❌ PROFILE OVERVIEW: No token found");
          return;
        }

        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        console.log("🔍 PROFILE OVERVIEW: Token payload:", tokenPayload);
        
        // Get stored user email and create user object
        const storedEmail = localStorage.getItem("userEmail") || "";
        const userName = storedEmail ? storedEmail.split('@')[0].replace(/[._]/g, ' ') : "User";
        
        // Create user object from token data (no API calls needed)
        const userFromToken: User = {
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
        
        console.log("👤 PROFILE OVERVIEW: Created user object with name:", userName, "email:", storedEmail);
        setCurrentUser(userFromToken);
      } catch (error) {
        console.error("❌ PROFILE OVERVIEW: Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const getUserProfileImage = (user: User) => {
    if (user.profileImage?.path) {
      return `${config.imageUrl}${user.profileImage.path}`;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground-muted)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Profile Overview</h1>
        <p className="text-[var(--foreground-muted)]">Welcome back! Here's your learning progress and account status</p>
      </div>

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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                <HiOutlineBadgeCheck className="w-3 h-3 mr-1" />
                Active Account
              </span>
              <span className="text-sm text-[var(--foreground-muted)]">
                Member since {new Date().getFullYear()}
              </span>
            </div>
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
            <span className="text-2xl font-bold text-[var(--foreground)]">3</span>
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