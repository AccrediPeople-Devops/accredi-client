"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import siteCourseService from "./siteCourse.service";
import config from "@/app/components/config/config";
import { CourseCategory } from "@/app/types/courseCategory";

export default function CertificationsSection() {
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError("");
      
      try {
        const response = await siteCourseService.getPublicCourseCategories();
        if (response?.courseCategories) {
          // Filter active and non-deleted categories
          const activeCategories = response.courseCategories.filter(
            (category: CourseCategory) => category.isActive && !category.isDeleted
          );
          setCategories(activeCategories);
        }
      } catch (err: any) {
        console.error("Error fetching course categories:", err);
        // If it's an authentication error, just show empty state
        if (err.response?.status === 401 || err.message === "Authentication required") {
          console.warn("Authentication failed, showing empty categories");
          setCategories([]);
        } else {
        setError("Failed to load categories");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryImageUrl = (category: CourseCategory) => {
    if (category.image?.[0]) {
      // First check if we have a complete URL
      if (category.image[0].url) {
        return category.image[0].url;
      }
      // Then check if we have a path that needs the imageUrl prefixed
      if (category.image[0].path) {
        return `${config.imageUrl}${category.image[0].path}`;
      }
    }
    // Fallback to a simple SVG placeholder
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#f3f4f6"/>
        <text x="50" y="50" font-family="Arial" font-size="12" fill="#6b7280" text-anchor="middle" dy="0.3em">Category</text>
      </svg>
    `)}`;
  };

  return (
    <div className="relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#4F46E5]/10 site-light:bg-[#4F46E5]/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#B39DDB]/10 site-light:bg-[#B39DDB]/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#10B981]/10 site-light:bg-[#10B981]/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Premium Glassmorphism Container */}
      <div className="relative site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
        
        {/* Floating Geometric Elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-[#4F46E5]/30 to-[#7C3AED]/30 rounded-2xl blur-sm animate-pulse transform rotate-45"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-[#10B981]/30 to-[#059669]/30 rounded-full blur-sm animate-pulse delay-1000"></div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-6 py-3 mb-6 hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
            <span className="site-text-primary text-sm font-bold uppercase tracking-wider">Certification Categories Offered</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black site-text-primary mb-4 leading-tight">
            Expert-Led Courses.  
            <span className="block bg-gradient-to-r from-[#4F46E5] via-[#B39DDB] to-[#10B981] bg-clip-text text-transparent">
            Industry-Relevant Certifications.
            </span>
            Real Career Impact.
          </h2>
          <p className="site-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
          Instructor-led live and On-Demand courses
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="relative overflow-hidden rounded-2xl site-glass backdrop-blur-sm p-6">
          {isLoading ? (
            // Loading State
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 border-4 border-[#4F46E5]/30 border-t-[#4F46E5] rounded-full animate-spin"></div>
                <span className="site-text-primary text-lg font-medium">Loading categories...</span>
              </div>
            </div>
          ) : error ? (
            // Error State
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-400 text-lg font-medium mb-2">Failed to load categories</div>
                <p className="site-text-muted text-sm">Please try refreshing the page</p>
              </div>
            </div>
          ) : categories.length === 0 ? (
            // Empty State
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="site-text-primary text-lg font-medium mb-2">No categories available</div>
                <p className="site-text-muted text-sm">Categories will appear here once they are added</p>
              </div>
            </div>
          ) : (
            // Categories Display
            <>
          {/* Scrolling Container */}
          <div className="flex items-center gap-8 animate-scroll-x-smooth">
                {[...categories, ...categories].map((category, i) => (
                  <div key={category._id + i} className="flex-shrink-0 group/cert">
                    <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/20 site-light:bg-white/60 backdrop-blur-sm border border-white/30 site-light:border-slate-200 hover:bg-white/30 site-light:hover:bg-white/80 hover:border-white/50 site-light:hover:border-slate-300 transition-all duration-300 min-w-[140px] hover:scale-105 hover:shadow-xl hover:shadow-white/20">
                      {/* Category Image Container */}
                      <div className="w-20 h-20 relative p-3 bg-white rounded-2xl shadow-lg group-hover/cert:scale-110 group-hover/cert:shadow-2xl transition-all duration-300">
                    <Image 
                          src={getCategoryImageUrl(category)} 
                          alt={category.name} 
                      fill 
                      className="object-contain p-1" 
                      unoptimized 
                    />
                  </div>
                      {/* Category Name */}
                      <div className="text-sm site-text-primary text-center font-semibold truncate max-w-[120px] group-hover/cert:text-[#4F46E5] transition-colors duration-300">
                        {category.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

              {/* Enhanced Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white/20 site-light:from-white/60 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white/20 site-light:from-white/60 to-transparent pointer-events-none"></div>
            </>
          )}
        </div>

        {/* Enhanced Stats Row */}
        <div className="grid grid-cols-3 gap-6 mt-8 pt-8 site-border border-t">
          <div className="text-center group/stat">
            <div className="text-3xl font-black bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent mb-2 group-hover/stat:scale-110 transition-transform duration-300">
              {categories.length}+
            </div>
            <div className="text-sm site-text-muted font-medium">Categories</div>
          </div>
          <div className="text-center group/stat">
            <div className="text-3xl font-black bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent mb-2 group-hover/stat:scale-110 transition-transform duration-300">98%</div>
            <div className="text-sm site-text-muted font-medium">Pass Rate</div>
          </div>
          <div className="text-center group/stat">
            <div className="text-3xl font-black bg-gradient-to-r from-[#F59E0B] to-[#D97706] bg-clip-text text-transparent mb-2 group-hover/stat:scale-110 transition-transform duration-300">Global</div>
            <div className="text-sm site-text-muted font-medium">Recognition</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <button className="group/cta relative overflow-hidden bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#4F46E5]/25">
            <span className="relative z-10">View All Certifications</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300"></div>
            <svg className="inline-block w-5 h-5 ml-2 group-hover/cta:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-x-smooth {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-x-smooth {
          animation: scroll-x-smooth 40s linear infinite;
          min-width: 200%;
        }
      `}</style>
    </div>
  );
} 