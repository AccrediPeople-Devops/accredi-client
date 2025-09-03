"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import reviewService from "../service/review.service";
import { Review } from "../../types/review";
import config from "../config/config";

interface ReviewsResponse {
  status: boolean;
  review: Review[];
}

const stats = [
  // { number: "5,000+", label: "Certified Professionals", icon: "🎓" },
  { number: "98%", label: "Pass Rate", icon: "✅" },
  { number: "4.9/5", label: "Average Rating", icon: "⭐" },
  { number: "200%", label: "Average Salary Increase", icon: "📈" }
];

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response: ReviewsResponse = await reviewService.getPublicReviews();
      if (response.status && response.review && response.review.length > 0) {
        setReviews(response.review);
      }
    } catch (error) {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAutoPlaying || reviews.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const currentTestimonial = reviews[activeTestimonial];

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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <section className="py-24 site-section-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5] mx-auto"></div>
            <p className="mt-4 site-text-secondary">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || reviews.length === 0) {
    return (
      <section className="py-24 site-section-bg relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <div className="w-2 h-2 bg-amber-400 site-light:bg-amber-600 rounded-full animate-pulse"></div>
              <span className="text-amber-400 site-light:text-amber-600 text-sm font-semibold uppercase tracking-wider">Student Feedback</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6">
              <strong>What Our Students Say</strong>
            </h2>
            <div className="max-w-2xl mx-auto">
              <p className="site-text-secondary text-lg mb-8">
                Your feedback helps us improve and inspire future students
              </p>
              <div className="site-glass backdrop-blur-sm rounded-2xl p-8 site-border border">
                <div className="text-6xl mb-4">💭</div>
                <h3 className="text-xl font-bold site-text-primary mb-4">Share Your Success Story</h3>
                <p className="site-text-secondary mb-6">
                  We'd love to hear about your experience and how our certifications have impacted your career journey.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#4F46E5]/25"
                >
                  <span>Share Your Story</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="site-glass backdrop-blur-sm rounded-2xl p-6 site-border border hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300">
                    <div className="text-3xl mb-3">{stat.icon}</div>
                    <div className="text-3xl font-black site-text-primary mb-2">{stat.number}</div>
                    <div className="text-sm site-text-muted font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 site-section-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-[#B39DDB]/5 site-light:bg-[#B39DDB]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-1/4 w-4 h-4 bg-[#10B981] rotate-45 animate-float"></div>
        <div className="absolute bottom-32 left-1/4 w-6 h-6 bg-[#F59E0B] rounded-full animate-float-delay"></div>
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-[#EF4444] rotate-45 animate-float-delay-2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <div className="w-2 h-2 bg-amber-400 site-light:bg-amber-600 rounded-full animate-pulse"></div>
            <span className="text-amber-400 site-light:text-amber-600 text-sm font-semibold uppercase tracking-wider">Latest Reviews</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6">
            <strong>What Our Students Say</strong>
          </h2>
          <p className="site-text-secondary text-lg max-w-2xl mx-auto">
            Real stories from professionals who transformed their careers with AccrediPeopleCertifications
          </p>
        </div>

        {/* Stats Section */}
        <div className="flex justify-center mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="site-glass backdrop-blur-sm rounded-2xl p-6 site-border border hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-black site-text-primary mb-2">{stat.number}</div>
                <div className="text-sm site-text-muted font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Main Testimonial Display */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="site-glass backdrop-blur-xl rounded-3xl p-8 md:p-12 site-border border shadow-2xl relative">
              {/* Quote Icon */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>

            {/* Date Badge */}
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full px-4 py-2 text-white text-xs font-bold shadow-lg">
              {formatDate(currentTestimonial.createdAt)}
            </div>

            <div className="space-y-8">
                {/* Testimonial Content */}
              <blockquote className="text-xl md:text-2xl site-text-primary leading-relaxed text-center font-medium">
                  "{currentTestimonial.review}"
                </blockquote>

                {/* Rating */}
              {/* <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-amber-400 site-light:text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div> */}

                {/* Person Info */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white/20 site-light:ring-slate-300">
                      <Image
                        src={`${config.imageUrl}${currentTestimonial.image.path}`}
                        alt={currentTestimonial.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#10B981] rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-xl font-bold site-text-primary">{currentTestimonial.name}</h4>
                    <p className="site-text-secondary font-medium">{currentTestimonial.designation}</p>
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Navigation */}
        {reviews.length > 1 && (
        <div className="flex justify-center items-center gap-8 mb-12">
          <button
              onClick={() => setActiveTestimonial((prev) => prev === 0 ? reviews.length - 1 : prev - 1)}
            className="w-12 h-12 site-glass rounded-full flex items-center justify-center site-text-primary hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300 backdrop-blur-sm site-border border"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex gap-3">
              {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial 
                    ? 'bg-[#4F46E5] w-8' 
                    : 'bg-white/30 site-light:bg-slate-400/50 hover:bg-white/50 site-light:hover:bg-slate-400/70'
                }`}
              />
            ))}
          </div>

          <button
              onClick={() => setActiveTestimonial((prev) => (prev + 1) % reviews.length)}
            className="w-12 h-12 site-glass rounded-full flex items-center justify-center site-text-primary hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300 backdrop-blur-sm site-border border"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        )}

        {/* View All Reviews Link */}
        <div className="text-center">
          <a
            href="/reviews"
            className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-8 py-4 site-border border hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300 site-text-primary font-semibold"
          >
            <span>View All Reviews</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.1); }
        }
        @keyframes float-delay-2 {
          0%, 100% { transform: translateY(0px) rotate(45deg); }
          50% { transform: translateY(-10px) rotate(225deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 4s ease-in-out infinite 1s;
        }
        .animate-float-delay-2 {
          animation: float-delay-2 5s ease-in-out infinite 2s;
        }
      `}</style>
    </section>
  );
} 