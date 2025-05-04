"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  // Mock categories for filter
  const categories = [
    { id: "all", name: "All" },
    { id: "programming", name: "Programming" },
    { id: "marketing", name: "Marketing" },
    { id: "design", name: "Design" },
    { id: "business", name: "Business" },
    { id: "data-science", name: "Data Science" },
  ];

  // Mock courses data
  const allCourses = [
    {
      id: 1,
      title: "Introduction to Web Development",
      category: "programming",
      instructor: "John Doe",
      rating: 4.8,
      students: 245,
      image: "https://placehold.co/600x400/5B2C6F/FFFFFF/png?text=Web+Dev",
    },
    {
      id: 2,
      title: "Digital Marketing Essentials",
      category: "marketing",
      instructor: "Jane Smith",
      rating: 4.7,
      students: 187,
      image: "https://placehold.co/600x400/7D3C98/FFFFFF/png?text=Marketing",
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      category: "design",
      instructor: "Alex Johnson",
      rating: 4.9,
      students: 320,
      image: "https://placehold.co/600x400/8E44AD/FFFFFF/png?text=UI+UX",
    },
    {
      id: 4,
      title: "Data Science Fundamentals",
      category: "data-science",
      instructor: "Emily Chen",
      rating: 4.6,
      students: 156,
      image: "https://placehold.co/600x400/8E44AD/FFFFFF/png?text=Data+Science",
    },
    {
      id: 5,
      title: "Mobile App Development with React Native",
      category: "programming",
      instructor: "David Wilson",
      rating: 4.5,
      students: 132,
      image: "https://placehold.co/600x400/9B59B6/FFFFFF/png?text=React+Native",
    },
    {
      id: 6,
      title: "Business Strategy for Startups",
      category: "business",
      instructor: "Sarah Lee",
      rating: 4.8,
      students: 201,
      image: "https://placehold.co/600x400/AF7AC5/FFFFFF/png?text=Business",
    },
    {
      id: 7,
      title: "Advanced JavaScript Concepts",
      category: "programming",
      instructor: "Michael Brown",
      rating: 4.9,
      students: 178,
      image: "https://placehold.co/600x400/5B2C6F/FFFFFF/png?text=JavaScript",
    },
    {
      id: 8,
      title: "Social Media Marketing",
      category: "marketing",
      instructor: "Amanda Taylor",
      rating: 4.7,
      students: 245,
      image: "https://placehold.co/600x400/7D3C98/FFFFFF/png?text=Social+Media",
    },
  ];

  // Filter courses based on active filter
  const filteredCourses =
    activeFilter === "all"
      ? allCourses
      : allCourses.filter((course) => course.category === activeFilter);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-[#2A2A2A] rounded-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Courses</h1>
        <p className="text-[#D7BDE2]">Browse all available courses</p>
      </div>

      {/* Filters */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === category.id
                  ? "bg-[#5B2C6F] text-white"
                  : "bg-[#2A2A2A] text-white/70 hover:bg-[#5B2C6F]/20"
              }`}
              onClick={() => setActiveFilter(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Add Course */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full sm:w-80 px-4 py-2 pl-10 bg-[#2A2A2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B2C6F]"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <Link href="/dashboard/courses/add" className="w-full sm:w-auto">
          <button className="w-full px-4 py-2 bg-[#5B2C6F] text-white rounded-lg font-medium hover:bg-[#5B2C6F]/90 transition-colors flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Course
          </button>
        </Link>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-[#2A2A2A] rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
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
              <p className="text-xs text-[#D7BDE2] mb-1 capitalize">
                {course.category.replace("-", " ")}
              </p>
              <h3 className="text-white font-medium mb-2 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-sm text-white/70 mb-2">{course.instructor}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-yellow-400 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white">{course.rating}</span>
                </div>
                <div className="flex items-center text-sm text-white/70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  {course.students}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
