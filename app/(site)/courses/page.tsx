"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/app/types/course";
import { CourseCategory } from "@/app/types/courseCategory";
import siteCourseService from "@/app/components/site/siteCourse.service";
import config from "@/app/components/config/config";
import { createCourseSlug, stripHtml } from "@/app/utils/textUtils";
import RichTextRenderer from "@/app/components/RichTextRenderer";

import GlobalLoader from "@/app/components/GlobalLoader";
import { useSimpleEnhancedLoader } from "@/app/hooks/useEnhancedGlobalLoader";

interface CategoryWithCourses extends CourseCategory {
  courses: Course[];
}

export default function CoursesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithCourses[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Global loader state - synchronized with layout
  const { isLoading: globalLoading, setDataLoaded } = useSimpleEnhancedLoader(true, 800);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      
      try {
        
        // Fetch courses only - categories are embedded in course objects
        const coursesResponse = await siteCourseService.getPublicCourses();


        let coursesData: Course[] = [];

        // Handle courses response - support different response formats
        if (coursesResponse?.status && coursesResponse?.courses) {
          coursesData = coursesResponse.courses.filter((course: Course) => 
            course.isActive !== false && !course.isDeleted
          );
        } else if (Array.isArray(coursesResponse)) {
          // Handle direct array response
          coursesData = coursesResponse.filter((course: Course) => 
            course.isActive !== false && !course.isDeleted
          );
        } else if (coursesResponse?.data && Array.isArray(coursesResponse.data)) {
          // Handle data wrapper response
          coursesData = coursesResponse.data.filter((course: Course) => 
            course.isActive !== false && !course.isDeleted
          );
        }


        // Log first course structure for debugging
        if (coursesData.length > 0) {
        }

        // Extract unique categories from courses
        const categoriesMap = new Map();
        coursesData.forEach(course => {
          if (course.categoryId && typeof course.categoryId === 'object') {
            const category = course.categoryId as any;
            if (!categoriesMap.has(category._id)) {
              categoriesMap.set(category._id, {
                ...category,
                courses: []
              });
            }
            categoriesMap.get(category._id).courses.push(course);
          }
        });

        const categoriesWithCourses = Array.from(categoriesMap.values());

        // Log category-course mapping
        categoriesWithCourses.forEach(category => {
        });

        setCategories(categoriesWithCourses);
        setAllCourses(coursesData);
        setFilteredCourses(coursesData);
        
        if (coursesData.length === 0) {
        }
        
        // Mark data as loaded for global loader
        setDataLoaded();
        
      } catch (err: any) {
        setError("Failed to load courses and categories");
        setDataLoaded(); // Still mark as loaded even on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setDataLoaded]);

  // Filter courses based on search and category
  useEffect(() => {
    let filtered = allCourses;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(course => {
        // Handle both string and object categoryId
        const categoryId = typeof course.categoryId === 'object' && course.categoryId !== null 
          ? (course.categoryId as any)._id 
          : course.categoryId;
        return categoryId === selectedCategory;
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.shortDescription?.toLowerCase().includes(searchLower) ||
        course.description?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedCategory, allCourses]);

  const getCategoryName = (categoryId: string | object) => {
    // Handle both string and object categoryId
    const categoryIdString = typeof categoryId === 'object' && categoryId !== null 
      ? (categoryId as any)._id 
      : categoryId;
    const category = categories.find(cat => cat._id === categoryIdString);
    return category ? category.name : "Unknown Category";
  };

  const getImageUrl = (course: Course) => {
    if (course.upload?.courseImage?.[0]) {
      const image = course.upload.courseImage[0];
      // Handle different URL formats from API
      if (image.path) {
        if (image.path.startsWith('http')) {
          // Complete URL
          return image.path;
        } else {
          // Relative path - prepend base URL
          return `${config.imageUrl}${image.path}`;
        }
      } else if (image.url) {
        return image.url;
      } else if (image.key) {
        return `${config.imageUrl}${image.key}`;
      }
    }
    return "/api/placeholder/300/200";
  };

  const getCategoryImageUrl = (category: CourseCategory) => {
    if (category.image?.[0]?.url) {
      return `${config.apiUrl}${category.image[0].url}`; // Categories still need config.apiUrl
    }
    return "/api/placeholder/300/200";
  };

  if (globalLoading) {
    return <GlobalLoader isLoading={globalLoading} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A1A3E] to-[#2D1B69] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Courses</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:from-[#4338CA] hover:to-[#6D28D9] transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A1A3E] to-[#2D1B69] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#10B981]/20 to-[#F59E0B]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#7C3AED]/10 to-[#4F46E5]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-[#4F46E5]/30 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-[#10B981]/30 rounded-full"></div>
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-[#F59E0B]/30 rounded-full"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Professional <span className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">Certification</span> Courses
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Advance your career with industry-recognized certifications from leading professionals and experts.
            </p>
          </div>

          {/* Search and View Controls */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-xl">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search Input */}
                <div className="flex-1 relative max-w-md">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-white/10 rounded-lg border border-white/20 overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-2.5 transition-all duration-300 ${
                      viewMode === "grid" 
                        ? "bg-[#4F46E5] text-white" 
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                    title="Grid View"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-2.5 transition-all duration-300 ${
                      viewMode === "list" 
                        ? "bg-[#4F46E5] text-white" 
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                    title="List View"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Cards */}
          <div className="max-w-6xl mx-auto mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Filter by Category</h2>
            <div className="flex flex-wrap gap-3">
              {/* All Categories Button */}
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-[#4F46E5]/25"
                    : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20"
                }`}
              >
                All Courses ({allCourses.length})
              </button>
              
              {/* Category Filter Buttons */}
              {categories.map(category => (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category._id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category._id
                      ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-[#4F46E5]/25"
                      : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20"
                  }`}
                >
                  {category.image?.[0]?.url && (
                    <div className="w-5 h-5 rounded-full overflow-hidden">
                      <Image
                        src={getCategoryImageUrl(category)}
                        alt={category.name}
                        width={20}
                        height={20}
                        className="w-full h-full object-cover rounded-full"
                        unoptimized
                      />
                    </div>
                  )}
                  {category.name} ({category.courses.length})
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid/List */}
          <div className="max-w-6xl mx-auto mb-16">
            {filteredCourses.length > 0 ? (
              <>
                {/* Course Results Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedCategory === "all" 
                      ? `All Courses (${filteredCourses.length})`
                      : `${getCategoryName(selectedCategory)} (${filteredCourses.length})`
                    }
                  </h2>
                  
                  {/* Sort Options */}
                  <div className="flex items-center gap-4">
                    <span className="text-gray-300 text-sm">Sort by:</span>
                    <select className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent">
                      <option value="newest" className="bg-gray-800">Newest First</option>
                      <option value="oldest" className="bg-gray-800">Oldest First</option>
                      <option value="name" className="bg-gray-800">Name A-Z</option>
                    </select>
                  </div>
                </div>

                <div className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
                  }>
                  {filteredCourses.map(course => (
                    <Link
                      key={course._id}
                      href={`/courses/${createCourseSlug(course.title)}`}
                      className="group block"
                    >
                      {viewMode === "grid" ? (
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                          <div className="relative overflow-hidden">
                            <Image
                              src={getImageUrl(course)}
                              alt={course.title}
                              width={400}
                              height={250}
                              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute top-4 right-4">
                              <span className="px-3 py-1 bg-[#4F46E5]/90 text-white text-xs font-medium rounded-full">
                                {getCategoryName(course.categoryId)}
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#4F46E5] transition-colors duration-300 line-clamp-2">
                              {course.title}
                            </h3>
                            {course.shortDescription && (
                              <div className="text-gray-300 text-sm mb-4 line-clamp-3">
                                {stripHtml(course.shortDescription)}
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-[#10B981] font-medium text-sm">
                                Certification Course
                              </span>
                              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#4F46E5] group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-48 flex-shrink-0">
                              <div className="relative overflow-hidden rounded-xl">
                                <Image
                                  src={`${config.imageUrl}${course.upload.courseImage[0].path}`}
                                  alt={course.title}
                                  width={400}
                                  height={250}
                                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-xl font-semibold text-white group-hover:text-[#4F46E5] transition-colors duration-300">
                                  {course.title}
                                </h3>
                                <span className="px-3 py-1 bg-[#4F46E5]/20 text-[#4F46E5] text-xs font-medium rounded-full ml-4 flex-shrink-0">
                                  {getCategoryName(course.categoryId)}
                                </span>
                              </div>
                              {course.shortDescription && (
                                <div className="text-gray-300 text-sm mb-4 line-clamp-2">
                                  {stripHtml(course.shortDescription)}
                                </div>
                              )}
                              <div className="flex items-center justify-between">
                                <span className="text-[#10B981] font-medium text-sm">
                                  Certification Course
                                </span>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#4F46E5] group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-12 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-[#4F46E5]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-[#4F46E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">No Courses Found</h3>
                  <p className="text-gray-300 mb-6">
                    {searchTerm ? 
                      `No courses match your search "${searchTerm}"` : 
                      selectedCategory !== "all" ? 
                        `No courses found in ${getCategoryName(selectedCategory)}` :
                        "No courses available at the moment"
                    }
                  </p>
                  {(searchTerm || selectedCategory !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:from-[#4338CA] hover:to-[#6D28D9] transition-all duration-300 transform hover:scale-105"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 