"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { generatePlaceholderImage } from "../utils/imageUtils";

export default function Dashboard() {
  // Mock data for stats
  const stats = [
    {
      title: "Total Students",
      value: "3,245",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      color: "bg-[#5B2C6F]",
    },
    {
      title: "Active Courses",
      value: "32",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      ),
      color: "bg-[#5B2C6F]",
    },
    {
      title: "Course Categories",
      value: "8",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      ),
      color: "bg-[#8E44AD]"
    },
    {
      title: "Revenue",
      value: "$12,480",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "bg-[#9B59B6]",
    },
  ];

  // Mock data for recent courses
  const recentCourses = [
    {
      id: 1,
      title: "Introduction to Web Development",
      category: "Programming",
      students: 245,
      image: generatePlaceholderImage("5B2C6F", "FFFFFF", "Web Dev"),
    },
    {
      id: 2,
      title: "Digital Marketing Essentials",
      category: "Marketing",
      students: 187,
      image: generatePlaceholderImage("7D3C98", "FFFFFF", "Marketing"),
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      category: "Data Science",
      students: 156,
      image: generatePlaceholderImage("8E44AD", "FFFFFF", "Data Science"),
    },
    {
      id: 4,
      title: "Mobile App Development with React Native",
      category: "Programming",
      students: 132,
      image: generatePlaceholderImage("9B59B6", "FFFFFF", "React Native"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="p-6 bg-[#2A2A2A] rounded-xl mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome to AccrediLearn
        </h1>
        <p className="text-[#D7BDE2]">
          Your dashboard gives you an overview of your learning platform.
        </p>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#2A2A2A] rounded-xl p-4 flex items-center space-x-4 transition-transform hover:scale-105"
          >
            <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-sm text-[#D7BDE2]">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent courses section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Courses</h2>
          <Link
            href="/dashboard/courses"
            className="text-sm font-medium text-[#D7BDE2] hover:text-white transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentCourses.map((course) => (
            <div
              key={course.id}
              className="bg-[#2A2A2A] rounded-xl overflow-hidden transition-transform hover:scale-105"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-[#D7BDE2] mb-1">{course.category}</p>
                <h3 className="text-white font-medium mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex items-center text-sm text-white/70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  {course.students} students
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
