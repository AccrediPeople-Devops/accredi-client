"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User } from "@/app/types/user";
import UserService from "@/app/components/service/user.service";
import courseAssignmentService from "@/app/components/service/courseAssignment.service";
import CourseAssignmentModal from "@/app/components/CourseAssignmentModal";
import config from "@/app/components/config/config";

interface UserProfile {
  user: User;
  token: string;
}

interface AssignedCourse {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    shortDescription: string;
  };
  scheduleId: {
    _id: string;
    startDate: string;
    endDate: string;
    scheduleType: string;
    location?: string;
  };
  assignedAt: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [assignedCourses, setAssignedCourses] = useState<AssignedCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCourseAssignmentModal, setShowCourseAssignmentModal] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Use the same pattern as the edit page - fetch all users and find the specific one
      const response = await UserService.getAllUsers();
      
      if (!response || !response.status || !response.users || !Array.isArray(response.users)) {
        setUserProfile(null);
        setError("Failed to fetch user data");
        setIsLoading(false);
        return;
      }

      // Find the specific user by ID
      const foundUser = response.users.find((user: any) => user._id === userId);

      if (!foundUser) {
        setUserProfile(null);
        setError("User not found.");
        setIsLoading(false);
        return;
      }

      // Transform the response to match our interface
      const profileData: UserProfile = {
        user: foundUser,
        token: "" // We don't need the token for display
      };
      
      setUserProfile(profileData);

      // Fetch assigned courses
      try {
        const coursesResponse = await courseAssignmentService.getUserAssignedCourses(userId);
        if (coursesResponse.success && coursesResponse.courses) {
          setAssignedCourses(coursesResponse.courses);
        }
      } catch (coursesError) {
        console.error("Error fetching assigned courses:", coursesError);
        // Don't fail the whole page if courses fail to load
      }

    } catch (err: any) {
      console.error("Error fetching user profile:", err);
      if (err.response?.status === 404) {
        setError("User not found.");
      } else {
        setError(err.message || "Error fetching user profile");
      }
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-red-100 text-red-700";
      case "admin":
        return "bg-[var(--primary)]/20 text-[var(--primary)]";
      case "user":
        return "bg-[var(--secondary)]/20 text-[var(--secondary)]";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-green-100 text-green-700" 
      : "bg-red-100 text-red-700";
  };

  const handleCourseAssignmentSuccess = () => {
    // Refresh the assigned courses
    fetchUserProfile();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (error || !userProfile || !userProfile.user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">User Profile</h1>
            <p className="text-[var(--foreground-muted)]">View user details and assigned courses</p>
          </div>
          <Link
            href="/dashboard/users"
            className="px-4 py-2 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-[var(--radius-md)] flex items-center gap-2 hover:bg-[var(--background-secondary)]/80 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Users
          </Link>
        </div>
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-[var(--radius-md)]">
          {error || "User not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">User Profile</h1>
          <p className="text-[var(--foreground-muted)]">View user details and assigned courses</p>
        </div>
        <div className="flex items-center gap-3">
          {userProfile.user.role === "user" && (
            <button
              onClick={() => setShowCourseAssignmentModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-[var(--radius-md)] hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Assign Course
            </button>
          )}
          <Link
            href="/dashboard/users"
            className="px-4 py-2 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-[var(--radius-md)] flex items-center gap-2 hover:bg-[var(--background-secondary)]/80 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Users
          </Link>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="bg-[var(--background-secondary)] p-6 rounded-[var(--radius-lg)]">
        <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">User Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Image */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 relative rounded-full overflow-hidden bg-[var(--background)]">
              {userProfile.user.profileImageUrl ? (
                <Image
                  src={userProfile.user.profileImageUrl}
                  alt={userProfile.user.fullName}
                  layout="fill"
                  objectFit="cover"
                  unoptimized
                />
              ) : userProfile.user.profileImage?.path ? (
                <Image
                  src={`${config.imageUrl}${userProfile.user.profileImage.path}`}
                  alt={userProfile.user.fullName}
                  layout="fill"
                  objectFit="cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--foreground-muted)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--foreground)]">{userProfile.user.fullName}</h3>
              <p className="text-[var(--foreground-muted)]">{userProfile.user.email}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--foreground-muted)]">Role:</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(userProfile.user.role)}`}>
                {userProfile.user.role === "superadmin" ? "Super Admin" : userProfile.user.role === "admin" ? "Admin" : "User"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--foreground-muted)]">Email Verified:</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${userProfile.user.isEmailVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {userProfile.user.isEmailVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Contact Number</label>
            <p className="text-[var(--foreground)]">{userProfile.user.contactNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Location</label>
            <p className="text-[var(--foreground)]">{userProfile.user.city}, {userProfile.user.country}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Member Since</label>
            <p className="text-[var(--foreground)]">{formatDate(userProfile.user.createdAt)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Last Updated</label>
            <p className="text-[var(--foreground)]">{userProfile.user.updatedAt ? formatDate(userProfile.user.updatedAt) : 'Not available'}</p>
          </div>
        </div>
      </div>

      {/* Assigned Courses Section */}
      <div className="bg-[var(--background-secondary)] p-6 rounded-[var(--radius-lg)]">
        <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">Assigned Courses</h2>
        
        {assignedCourses.length === 0 ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[var(--foreground-muted)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">No Courses Assigned</h3>
            <p className="text-[var(--foreground-muted)]">This user hasn't been assigned any courses yet.</p>
            {userProfile.user.role === "user" && (
              <button
                onClick={() => setShowCourseAssignmentModal(true)}
                className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors"
              >
                Assign First Course
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {assignedCourses.map((course) => (
              <div key={course._id} className="border border-[var(--border)] rounded-[var(--radius-md)] p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                      {course.courseId.title}
                    </h3>
                    <p className="text-[var(--foreground-muted)] mb-3">
                      {course.courseId.shortDescription}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-[var(--foreground-muted)]">Schedule Type:</span>
                        <p className="text-[var(--foreground)] font-medium">{course.scheduleId.scheduleType}</p>
                      </div>
                      <div>
                        <span className="text-[var(--foreground-muted)]">Start Date:</span>
                        <p className="text-[var(--foreground)] font-medium">{formatDate(course.scheduleId.startDate)}</p>
                      </div>
                      <div>
                        <span className="text-[var(--foreground-muted)]">End Date:</span>
                        <p className="text-[var(--foreground)] font-medium">{formatDate(course.scheduleId.endDate)}</p>
                      </div>
                    </div>
                    {course.scheduleId.location && (
                      <div className="mt-2">
                        <span className="text-[var(--foreground-muted)]">Location:</span>
                        <p className="text-[var(--foreground)] font-medium">{course.scheduleId.location}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[var(--foreground-muted)]">Assigned</span>
                    <p className="text-sm text-[var(--foreground)]">{formatDate(course.assignedAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Assignment Modal */}
      {userProfile && (
        <CourseAssignmentModal
          isOpen={showCourseAssignmentModal}
          onClose={() => setShowCourseAssignmentModal(false)}
          userId={userProfile.user._id}
          userName={userProfile.user.fullName}
          onSuccess={handleCourseAssignmentSuccess}
        />
      )}
    </div>
  );
} 