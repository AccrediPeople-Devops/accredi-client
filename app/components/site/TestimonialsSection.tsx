"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    position: "Sr. Product Manager",
    company: "Microsoft",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    content: "Accredi's approach is revolutionary. They don't just teach you frameworks—they rewire your thinking. My PMP certification opened doors I never knew existed.",
    rating: 5,
    profileLink: "/reviews/sarah-chen",
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    position: "Cloud Architect",
    company: "Amazon Web Services",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    content: "The personalized mentorship was game-changing. My instructor didn't just prepare me for AWS certification—they prepared me for career transformation.",
    rating: 5,
    profileLink: "/reviews/marcus-rodriguez",
    date: "5 days ago"
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    position: "VP of Operations",
    company: "Johnson & Johnson",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    content: "Six Sigma certification through Accredi didn't just improve my skills—it transformed how I approach complex problems. The ROI is immeasurable.",
    rating: 5,
    profileLink: "/reviews/priya-sharma",
    date: "1 week ago"
  },
  {
    id: 4,
    name: "James Thompson",
    position: "Scrum Master",
    company: "Spotify",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    content: "The interactive learning environment at AccrediPeopleCertifications is unmatched. Real scenarios, expert feedback, and a supportive community made all the difference.",
    rating: 5,
    profileLink: "/reviews/james-thompson",
    date: "2 weeks ago"
  },
  {
    id: 5,
    name: "Emily Zhang",
    position: "Digital Transformation Lead",
    company: "Goldman Sachs",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    content: "AccrediPeopleCertifications' comprehensive approach to DevOps certification went beyond technical skills. They taught me to think strategically about transformation.",
    rating: 5,
    profileLink: "/reviews/emily-zhang",
    date: "3 weeks ago"
  }
];

const stats = [
  { number: "5,000+", label: "Certified Professionals", icon: "🎓" },
  { number: "98%", label: "Pass Rate", icon: "✅" },
  { number: "4.9/5", label: "Average Rating", icon: "⭐" },
  { number: "200%", label: "Average Salary Increase", icon: "📈" }
];

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentTestimonial = testimonials[activeTestimonial];

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
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
              {currentTestimonial.date}
            </div>

            <div className="space-y-8">
                {/* Testimonial Content */}
              <blockquote className="text-xl md:text-2xl site-text-primary leading-relaxed text-center font-medium">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Rating */}
              <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-amber-400 site-light:text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>

                {/* Person Info */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white/20 site-light:ring-slate-300">
                      <Image
                        src={currentTestimonial.image}
                        alt={currentTestimonial.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized
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
                    <p className="site-text-secondary font-medium">{currentTestimonial.position}</p>
                    <p className="text-sm site-text-muted">{currentTestimonial.company}</p>
              </div>
            </div>

                {/* Profile Link */}
                <a
                  href={currentTestimonial.profileLink}
                  className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#4F46E5]/25 flex items-center gap-2"
                >
                  <span>View Profile</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Navigation */}
        <div className="flex justify-center items-center gap-8 mb-12">
          <button
            onClick={() => setActiveTestimonial((prev) => prev === 0 ? testimonials.length - 1 : prev - 1)}
            className="w-12 h-12 site-glass rounded-full flex items-center justify-center site-text-primary hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300 backdrop-blur-sm site-border border"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex gap-3">
            {testimonials.map((_, index) => (
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
            onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
            className="w-12 h-12 site-glass rounded-full flex items-center justify-center site-text-primary hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300 backdrop-blur-sm site-border border"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

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