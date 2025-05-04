"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Course {
  _id: string;
  title: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  upload: {
    courseImage: { url: string; key: string }[];
  };
}

interface CategoryType {
  id: string;
  name: string;
}

// Mock data for courses
const mockCourses: Course[] = [
  {
    _id: "1",
    title: "Introduction to Web Development",
    categoryId: "67faba597db07ab585f64eae",
    isActive: true,
    createdAt: "2023-04-15T10:30:00Z",
    upload: {
      courseImage: [{ url: "https://via.placeholder.com/150", key: "img1" }]
    }
  },
  {
    _id: "2",
    title: "Advanced JavaScript Patterns",
    categoryId: "67faba597db07ab585f64eae",
    isActive: true,
    createdAt: "2023-05-20T09:15:00Z",
    upload: {
      courseImage: [{ url: "https://via.placeholder.com/150", key: "img2" }]
    }
  },
  {
    _id: "3",
    title: "Digital Marketing Fundamentals",
    categoryId: "67faba597db07ab585f64eaf",
    isActive: false,
    createdAt: "2023-03-10T14:45:00Z",
    upload: {
      courseImage: [{ url: "https://via.placeholder.com/150", key: "img3" }]
    }
  },
  {
    _id: "4",
    title: "UI/UX Design Principles",
    categoryId: "67faba597db07ab585f64eb0",
    isActive: true,
    createdAt: "2023-06-05T11:20:00Z",
    upload: {
      courseImage: [{ url: "https://via.placeholder.com/150", key: "img4" }]
    }
  },
  {
    _id: "5",
    title: "Business Analysis Techniques",
    categoryId: "67faba597db07ab585f64eb1",
    isActive: true,
    createdAt: "2023-07-12T08:30:00Z",
    upload: {
      courseImage: [{ url: "https://via.placeholder.com/150", key: "img5" }]
    }
  }
];

// Mock categories
const categories: CategoryType[] = [
  { id: "67faba597db07ab585f64eae", name: "Programming" },
  { id: "67faba597db07ab585f64eaf", name: "Marketing" },
  { id: "67faba597db07ab585f64eb0", name: "Design" },
  { id: "67faba597db07ab585f64eb1", name: "Business" },
  { id: "67faba597db07ab585f64eb2", name: "Data Science" },
];

export default function CoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  // Filter courses based on search, category, and status
  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || course.categoryId === selectedCategory;
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && course.isActive) || 
      (statusFilter === "inactive" && !course.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const handleDeleteClick = (courseId: string) => {
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    
    setIsDeleting(courseToDelete);
    
    // In a real app, you would make an API call here
    // For now, we'll just simulate a deletion
    setTimeout(() => {
      setIsDeleting(null);
      setShowDeleteModal(false);
      alert(`Course ${courseToDelete} has been deleted.`);
      // In a real app, you would refresh the course list here
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-[#2A2A2A] rounded-xl flex flex-wrap justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Courses</h1>
          <p className="text-[#D7BDE2]">Manage your course catalog</p>
        </div>
        <Link 
          href="/dashboard/courses/add"
          className="px-4 py-2 bg-[#5B2C6F] text-white rounded-lg hover:bg-[#5B2C6F]/90 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Course
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-[#2A2A2A] rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-white">Search</label>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-[#2A2A2A] text-white border border-[#3A3A55] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B2C6F]"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-white">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-[#2A2A2A] text-white border border-[#3A3A55] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B2C6F]"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-white">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-[#2A2A2A] text-white border border-[#3A3A55] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B2C6F]"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course list */}
      <div className="bg-[#2A2A2A] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#3A3A55]">
            <thead className="bg-[#2D2D44]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date Added</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3A55] bg-[#2A2A2A]">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course._id} className="hover:bg-[#2D2D44] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={course.upload.courseImage[0]?.url || "/placeholder.png"}
                            alt={course.title}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{course.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{getCategoryName(course.categoryId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{formatDate(course.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        course.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {course.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/dashboard/courses/${course._id}`}
                          className="text-indigo-400 hover:text-indigo-200 transition-colors"
                          title="View"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link 
                          href={`/dashboard/courses/edit/${course._id}`}
                          className="text-blue-400 hover:text-blue-200 transition-colors"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(course._id)}
                          className="text-red-400 hover:text-red-200 transition-colors"
                          title="Delete"
                          disabled={isDeleting === course._id}
                        >
                          {isDeleting === course._id ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-white">
                    No courses found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#2A2A2A] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-white mb-6">
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-transparent border border-[#5B2C6F] text-white rounded-lg hover:bg-[#5B2C6F]/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting !== null}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                {isDeleting !== null ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Course"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
