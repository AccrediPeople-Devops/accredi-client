"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function UserDashboardEnrolledCoursesPage() {
  const [courses] = useState([
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "John Smith",
      progress: 75,
      totalLessons: 120,
      completedLessons: 90,
      duration: "40 hours",
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      nextLesson: "Building REST APIs",
      enrolledDate: "2024-01-15",
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      instructor: "Sarah Johnson", 
      progress: 45,
      totalLessons: 80,
      completedLessons: 36,
      duration: "30 hours",
      category: "Data Science",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      nextLesson: "Introduction to Machine Learning",
      enrolledDate: "2024-02-01",
    },
    {
      id: 3,
      title: "Digital Marketing Mastery",
      instructor: "Mike Chen",
      progress: 90,
      totalLessons: 60,
      completedLessons: 54,
      duration: "25 hours",
      category: "Marketing",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      nextLesson: "Advanced Analytics",
      enrolledDate: "2023-12-10",
    },
  ]);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "from-green-500 to-green-600";
    if (progress >= 60) return "from-blue-500 to-blue-600";
    if (progress >= 40) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold site-text-primary">Enrolled Courses</h1>
          <p className="site-text-secondary mt-2">Continue your learning journey</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold site-text-primary">{courses.length}</p>
          <p className="text-sm site-text-secondary">Active Courses</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold site-text-primary">{courses.reduce((acc, course) => acc + course.completedLessons, 0)}</h3>
              <p className="site-text-secondary text-sm">Lessons Completed</p>
            </div>
          </div>
        </div>

        <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold site-text-primary">{courses.reduce((acc, course) => acc + parseInt(course.duration), 0)}h</h3>
              <p className="site-text-secondary text-sm">Total Study Time</p>
            </div>
          </div>
        </div>

        <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-xl border site-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold site-text-primary">{Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)}%</h3>
              <p className="site-text-secondary text-sm">Average Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {courses.map((course) => (
          <div
            key={course.id}
            className="site-glass backdrop-blur-xl rounded-3xl shadow-2xl border site-border overflow-hidden hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group"
          >
            {/* Course Image */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={course.image}
                alt={course.title}
                width={400}
                height={192}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Progress Badge */}
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                  {course.progress}% Complete
                </div>
              </div>
              
              {/* Category Badge */}
              <div className="absolute bottom-4 left-4">
                <div className="bg-[#4F46E5]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                  {course.category}
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold site-text-primary mb-2 line-clamp-2 group-hover:text-[#4F46E5] transition-colors">
                {course.title}
              </h3>
              
              <p className="site-text-secondary text-sm mb-4">
                by {course.instructor} • {course.duration} • {course.totalLessons} lessons
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium site-text-secondary">Progress</span>
                  <span className="text-xs font-medium site-text-primary">{course.completedLessons}/{course.totalLessons} lessons</span>
                </div>
                <div className="w-full bg-gray-200 site-dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${getProgressColor(course.progress)} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Next Lesson */}
              <div className="mb-6">
                <p className="text-xs font-semibold site-text-secondary mb-1">Up Next:</p>
                <p className="text-sm site-text-primary font-medium">{course.nextLesson}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:shadow-xl hover:shadow-[#4F46E5]/25 transition-all duration-300 font-medium hover:scale-105 text-sm">
                  Continue Learning
                </button>
                <button className="px-4 py-3 site-glass backdrop-blur-sm border site-border rounded-xl hover:bg-white/20 site-light:hover:bg-slate-100 transition-all duration-300 group">
                  <svg className="w-4 h-4 site-text-secondary group-hover:site-text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>

              {/* Enrolled Date */}
              <div className="mt-4 pt-4 border-t site-border">
                <p className="text-xs site-text-secondary">
                  Enrolled on {new Date(course.enrolledDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State for Future */}
      <div className="text-center py-12">
        <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl border site-border max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold site-text-primary mb-2">
            Explore More Courses
          </h3>
          <p className="site-text-secondary mb-6 text-sm">
            Discover new skills and expand your knowledge with our comprehensive course catalog.
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:shadow-xl hover:shadow-[#4F46E5]/25 transition-all duration-300 font-medium hover:scale-105">
            Browse Courses
          </button>
        </div>
      </div>
    </div>
  );
} 