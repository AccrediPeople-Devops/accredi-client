"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/app/types/course";
import { User } from "@/app/types/user";
import UserService from "@/app/components/service/user.service";
import siteCourseService from "@/app/components/site/siteCourse.service";
import config from "@/app/components/config/config";
import { createCourseSlug } from "@/app/utils/textUtils";

export default function MyCoursesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Check authentication and fetch user courses
  useEffect(() => {
    const checkAuthAndFetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Decode token to get user info
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const res = await UserService.getAllUsers();
        
        if (res?.users) {
          const foundUser = res.users.find((user: User) => 
            user.email === tokenPayload.email || 
            user._id === tokenPayload.userId ||
            user._id === tokenPayload.id
          );
          
          if (foundUser) {
            setCurrentUser(foundUser);
            
            // Fetch user's enrolled courses
            // Note: This is a placeholder implementation
            // You'll need to implement actual enrollment tracking in your backend
            try {
              const coursesResponse = await siteCourseService.getPublicCourses();
              let coursesData: Course[] = [];
              
              if (coursesResponse?.status && coursesResponse?.courses) {
                coursesData = coursesResponse.courses.filter((course: Course) => !course.isDeleted);
              } else if (Array.isArray(coursesResponse)) {
                coursesData = coursesResponse.filter((course: Course) => !course.isDeleted);
              }
              
              // For now, show all courses as placeholder
              // In a real implementation, you'd filter by user enrollment
              setEnrolledCourses(coursesData.slice(0, 6)); // Show first 6 as demo
            } catch (coursesError) {
              console.error("Error fetching courses:", coursesError);
              setError("Failed to load courses");
            }
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchCourses();
  }, [router]);

  // Helper function to get course image URL
  const getCourseImageUrl = (course: Course) => {
    if (course.upload?.courseImage?.[0]) {
      if (course.upload.courseImage[0].path?.startsWith("http")) {
        return course.upload.courseImage[0].path;
      }
      if (course.upload.courseImage[0].url) {
        return course.upload.courseImage[0].url;
      }
      if (course.upload.courseImage[0].path) {
        return `${config.imageUrl}${course.upload.courseImage[0].path}`;
      }
      if (course.upload.courseImage[0].key) {
        return `${config.imageUrl}${course.upload.courseImage[0].key}`;
      }
    }
    return "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  };

  // Helper function to get category name
  const getCategoryName = (course: Course) => {
    if (
      course.categoryId &&
      typeof course.categoryId === "object" &&
      "name" in course.categoryId
    ) {
      return (course.categoryId as any).name;
    }
    return "Professional Certification";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen site-section-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-white/20 site-light:border-slate-300 border-t-[#4F46E5] rounded-full animate-spin"></div>
          <p className="site-text-primary text-lg">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen site-section-bg">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-black site-text-primary mb-6">
            <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
              My Courses
            </span>
          </h1>
          <p className="text-lg site-text-secondary max-w-2xl mx-auto">
            Track your learning progress and continue your certification journey
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold site-text-primary">{enrolledCourses.length}</h3>
                <p className="site-text-secondary text-sm">Enrolled Courses</p>
              </div>
            </div>
          </div>

          <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold site-text-primary">0</h3>
                <p className="site-text-secondary text-sm">Completed</p>
              </div>
            </div>
          </div>

          <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold site-text-primary">{enrolledCourses.length}</h3>
                <p className="site-text-secondary text-sm">In Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-red-500/30 bg-red-500/10 mb-8">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Course Grid */}
        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map((course) => (
              <div
                key={course._id}
                className="site-glass backdrop-blur-xl rounded-3xl shadow-2xl border site-border overflow-hidden hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group"
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={getCourseImageUrl(course)}
                    alt={course.title}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Progress Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-[#F59E0B]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                      In Progress
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-[#4F46E5]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                      {getCategoryName(course)}
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold site-text-primary mb-3 line-clamp-2 group-hover:text-[#4F46E5] transition-colors">
                    {course.title}
                  </h3>
                  
                  {course.shortDescription && (
                    <p className="site-text-secondary text-sm mb-4 line-clamp-3">
                      {course.shortDescription}
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium site-text-secondary">Progress</span>
                      <span className="text-xs font-medium site-text-primary">0%</span>
                    </div>
                    <div className="w-full bg-gray-200 site-dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={`/courses/${createCourseSlug(course.title)}`}
                      className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:shadow-xl hover:shadow-[#4F46E5]/25 transition-all duration-300 font-medium hover:scale-105 text-sm"
                    >
                      Continue Learning
                    </Link>
                    <button className="px-4 py-2 site-glass backdrop-blur-sm border site-border rounded-xl hover:bg-white/20 site-light:hover:bg-slate-100 transition-all duration-300 group">
                      <svg className="w-4 h-4 site-text-secondary group-hover:site-text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="site-glass backdrop-blur-xl rounded-3xl p-12 shadow-2xl border site-border max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold site-text-primary mb-4">
                No Courses Yet
              </h3>
              <p className="site-text-secondary mb-8 leading-relaxed">
                You haven't enrolled in any courses yet. Start your learning journey by exploring our comprehensive course catalog.
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:shadow-xl hover:shadow-[#4F46E5]/25 transition-all duration-300 font-medium hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Courses
              </Link>
            </div>
          </div>
        )}

        {/* Additional Resources */}
        {enrolledCourses.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold site-text-primary mb-8 text-center">
              Learning Resources
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold site-text-primary mb-2">Study Materials</h3>
                <p className="site-text-secondary text-sm">Access downloadable resources, notes, and supplementary materials for your courses.</p>
              </div>

              <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold site-text-primary mb-2">Community Forums</h3>
                <p className="site-text-secondary text-sm">Connect with fellow learners, ask questions, and share insights in our community forums.</p>
              </div>

              <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold site-text-primary mb-2">Certificates</h3>
                <p className="site-text-secondary text-sm">Earn professional certificates upon course completion to showcase your achievements.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 