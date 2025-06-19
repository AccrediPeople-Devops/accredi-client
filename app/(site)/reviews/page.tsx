"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import reviewService from "../../components/service/review.service";
import { Review } from "../../types/review";
import config from "../../components/config/config";

interface ReviewsResponse {
  status: boolean;
  review: Review[];
}

const stats = [
  { number: "5,000+", label: "Certified Professionals", icon: "🎓", description: "Successfully trained and certified" },
  { number: "98%", label: "Pass Rate", icon: "✅", description: "First-attempt certification success" },
  { number: "4.9/5", label: "Average Rating", icon: "⭐", description: "Based on student feedback" },
  { number: "200%", label: "Average Salary Increase", icon: "📈", description: "Post-certification career growth" }
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reviewsPerPage = 9;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response: ReviewsResponse = await reviewService.getPublicReviews();
      if (response.status && response.review) {
        setReviews(response.review);
        setFilteredReviews(response.review);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = reviews.filter(review =>
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReviews(filtered);
    setCurrentPage(1);
  }, [searchTerm, reviews]);

  // Helper function to get image URL
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${config.imageUrl}${imagePath}`;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  // Pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen site-section-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5] mx-auto"></div>
          <p className="mt-4 site-text-secondary">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error || reviews.length === 0) {
    return (
      <div className="min-h-screen site-section-bg">
        {/* Header */}
        <div className="py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-64 h-64 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                <div className="w-2 h-2 bg-amber-400 site-light:bg-amber-600 rounded-full animate-pulse"></div>
                <span className="text-amber-400 site-light:text-amber-600 text-sm font-semibold uppercase tracking-wider">Student Testimonials</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black site-text-primary mb-6">
                <strong>Student Reviews</strong>
              </h1>
              <p className="site-text-secondary text-xl max-w-3xl mx-auto mb-12">
                Your feedback helps us improve and inspire future students
              </p>

              {/* No Reviews State */}
              <div className="max-w-2xl mx-auto">
                <div className="site-glass backdrop-blur-sm rounded-3xl p-12 site-border border">
                  <div className="text-8xl mb-6">💭</div>
                  <h2 className="text-2xl font-bold site-text-primary mb-6">Share Your Success Story</h2>
                  <p className="site-text-secondary text-lg mb-8">
                    We'd love to hear about your experience and how our certifications have transformed your career. Your story could inspire others to take the next step in their professional journey.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#4F46E5]/25"
                    >
                      <span>Share Your Story</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <Link
                      href="/courses"
                      className="inline-flex items-center justify-center gap-2 site-glass backdrop-blur-sm rounded-xl px-8 py-4 site-border border hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300 site-text-primary font-semibold"
                    >
                      <span>Explore Courses</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="site-glass backdrop-blur-sm rounded-2xl p-6 site-border border hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300">
                    <div className="text-4xl mb-4">{stat.icon}</div>
                    <div className="text-3xl font-black site-text-primary mb-2">{stat.number}</div>
                    <div className="text-sm font-bold site-text-secondary mb-2">{stat.label}</div>
                    <div className="text-xs site-text-muted">{stat.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen site-section-bg">
      {/* Header */}
      <div className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <div className="w-2 h-2 bg-amber-400 site-light:bg-amber-600 rounded-full animate-pulse"></div>
              <span className="text-amber-400 site-light:text-amber-600 text-sm font-semibold uppercase tracking-wider">Student Testimonials</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black site-text-primary mb-6">
              <strong>Student Reviews</strong>
            </h1>
            <p className="site-text-secondary text-xl max-w-3xl mx-auto">
              Real stories from professionals who transformed their careers with AccrediPeopleCertifications
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 site-text-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search reviews by name, position, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 site-glass backdrop-blur-sm rounded-2xl site-border border site-text-primary placeholder-gray-400 site-light:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>
        </div>
          </div>

          {/* Stats Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 site-border border hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-3xl font-black site-text-primary mb-2">{stat.number}</div>
                  <div className="text-sm font-bold site-text-secondary mb-2">{stat.label}</div>
                  <div className="text-xs site-text-muted">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold site-text-primary mb-4">No reviews found</h3>
              <p className="site-text-secondary">Try adjusting your search terms</p>
            </div>
          ) : (
            <>
              {/* Results count */}
              <div className="mb-8">
                <p className="site-text-secondary">
                  Showing {indexOfFirstReview + 1} - {Math.min(indexOfLastReview, filteredReviews.length)} of {filteredReviews.length} reviews
                </p>
              </div>

              {/* Reviews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {currentReviews.map((review) => (
                  <div key={review._id} className="site-glass backdrop-blur-sm rounded-2xl p-6 site-border border hover:bg-white/10 site-light:hover:bg-white/60 transition-all duration-300 group">
                    {/* Header with image and info */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-white/20 site-light:ring-slate-300">
                          <Image
                            src={getImageUrl(review.image.path)}
                            alt={review.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#10B981] rounded-lg flex items-center justify-center shadow-lg">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold site-text-primary text-lg">{review.name}</h3>
                        <p className="site-text-secondary text-sm">{review.designation}</p>
                        <p className="site-text-muted text-xs">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-amber-400 site-light:text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>

                    {/* Review content */}
                    <div className="mb-6">
                      <p className="site-text-primary leading-relaxed">
                        "{truncateText(review.review, 150)}"
                      </p>
                    </div>

                    {/* View full review button */}
                    {review.review.length > 150 && (
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="text-[#4F46E5] hover:text-[#7C3AED] font-semibold text-sm transition-colors duration-300 flex items-center gap-1 group-hover:gap-2"
                      >
                        <span>Read full story</span>
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    className="w-10 h-10 site-glass rounded-lg flex items-center justify-center site-text-primary hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm site-border border"
                    >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    </button>
                    
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-10 h-10 px-3 rounded-lg font-semibold transition-all duration-300 ${
                            currentPage === page
                              ? 'bg-[#4F46E5] text-white shadow-lg'
                              : 'site-glass backdrop-blur-sm site-border border site-text-primary hover:bg-white/20 site-light:hover:bg-white/60'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="site-text-muted">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                    
                    <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    className="w-10 h-10 site-glass rounded-lg flex items-center justify-center site-text-primary hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm site-border border"
                    >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    </button>
                </div>
              )}
            </>
          )}
          </div>
        </div>

      {/* Modal for full review */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="site-glass backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto site-border border shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-white/20 site-light:ring-slate-300">
                  <Image
                    src={getImageUrl(selectedReview.image.path)}
                    alt={selectedReview.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold site-text-primary">{selectedReview.name}</h3>
                  <p className="site-text-secondary">{selectedReview.designation}</p>
                  <p className="site-text-muted text-sm">{formatDate(selectedReview.createdAt)}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="w-8 h-8 site-glass rounded-lg flex items-center justify-center site-text-primary hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
              </button>
            </div>

            {/* Rating */}
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-400 site-light:text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
              ))}
            </div>

            {/* Full review */}
            <div className="site-text-primary leading-relaxed text-lg">
              "{selectedReview.review}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 