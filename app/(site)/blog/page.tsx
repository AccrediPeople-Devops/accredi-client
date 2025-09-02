"use client";

import React from "react";
import Breadcrumb from "@/app/components/site/Breadcrumb";

export default function BlogPage() {
  const breadcrumbItems = [
    { label: "Blog" }
  ];

  return (
    <div className="min-h-screen site-section-bg">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden site-section-bg">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl "></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl  "></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl  "></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Main Content */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-8 py-4 mb-8 hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300">
              <div className="w-3 h-3 bg-[#10B981] rounded-full "></div>
              <span className="site-text-accent font-bold text-sm uppercase tracking-wider">Coming Soon</span>
              <div className="w-3 h-3 bg-[#4F46E5] rounded-full  "></div>
        </div>

            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="site-text-primary">Knowledge Hub </span>
              <span className="bg-gradient-to-r from-[#4F46E5] via-[#10B981] to-[#F59E0B] bg-clip-text text-transparent">
                Blog
              </span>
            </h1>

            <div className="site-glass backdrop-blur-xl rounded-3xl p-12 shadow-2xl mb-12 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-br from-[#F59E0B] to-[#EF4444] rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative z-10">
                {/* Large Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-[#4F46E5] to-[#10B981] rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
              </div>

                <h2 className="text-3xl md:text-4xl font-black site-text-primary mb-6">
                  Exciting Content Coming Soon!
            </h2>

                <p className="text-lg site-text-secondary leading-relaxed mb-8">
                  We're crafting insightful articles, expert guides, and industry insights to help you advance your career. 
                  Our blog will feature comprehensive content on professional certifications, career development strategies, 
                  and the latest trends in technology and business.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#4F46E5] rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold site-text-primary mb-2">Certification Guides</h4>
                    <p className="site-text-secondary text-sm">Comprehensive guides for PMP, Agile, Cloud, and more</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#10B981] rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <h4 className="font-bold site-text-primary mb-2">Career Insights</h4>
                    <p className="site-text-secondary text-sm">Expert advice on professional growth and development</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#F59E0B] rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                    <h4 className="font-bold site-text-primary mb-2">Industry Trends</h4>
                    <p className="site-text-secondary text-sm">Latest developments in technology and business</p>
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-gradient-to-r from-[#4F46E5]/10 to-[#10B981]/10 site-light:from-[#4F46E5]/20 site-light:to-[#10B981]/20 rounded-2xl p-6 border border-[#4F46E5]/20 site-light:border-[#4F46E5]/30">
                  <h3 className="text-xl font-bold site-text-primary mb-3">
                    Be the First to Know
                  </h3>
                  <p className="site-text-secondary mb-4">
                    Subscribe to get notified when we launch our blog with valuable insights and expert content.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="flex-1 px-4 py-3 rounded-xl site-glass backdrop-blur-sm border border-white/20 site-light:border-slate-300 site-text-primary placeholder-white/60 site-light:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    />
                    <button className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] hover:from-[#10B981] hover:to-[#4F46E5] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#4F46E5]/25">
                      Notify Me
                    </button>
                      </div>
                </div>
              </div>
          </div>

            {/* Back to Home */}
            <div className="text-center">
              <a
                href="/"
                className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-8 py-4 site-border border hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300 site-text-primary font-semibold"
              >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 