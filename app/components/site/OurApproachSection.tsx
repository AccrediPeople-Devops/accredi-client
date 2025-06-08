"use client";
import Image from "next/image";
import React, { useState } from "react";

export default function OurApproachSection() {
  return (
    <section className="relative min-h-screen py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 site-light:from-slate-50 site-light:via-white site-light:to-slate-100"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30 site-light:opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-[#F59E0B]/20 to-[#D97706]/20 rounded-full filter blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 space-y-32">
        {/* Our Approach Section */}
        <div className="site-glass backdrop-blur-xl rounded-3xl p-12 shadow-2xl relative overflow-hidden hover:shadow-3xl transition-all duration-500">
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-[#4F46E5]/30 to-[#7C3AED]/30 rounded-2xl blur-sm animate-pulse transform rotate-45"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-[#10B981]/30 to-[#059669]/30 rounded-full blur-sm animate-pulse delay-1000"></div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 site-light:border-slate-300 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/20 site-light:border-slate-200 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/10 site-light:border-slate-100 rounded-full"></div>
          </div>
          
          <div className="relative z-10 text-center space-y-8">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                <span className="text-[#10B981] text-sm font-bold">🏆 OUR APPROACH</span>
              </div>
              <h3 className="text-4xl lg:text-5xl font-black mb-6 leading-tight site-text-primary">
                <span>Align </span>
                <span className="text-[#F59E0B]">Acquire </span>
                <span>Achieve</span>
              </h3>
            </div>

            {/* Centered Layout with Cards and Animation */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
              {/* Cards */}
              <div className="lg:col-span-3">
                {/* Three-Step Process - Row Layout on Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 site-glass backdrop-blur-sm rounded-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 h-80 flex flex-col justify-center">
                    <h4 className="font-black text-lg mb-3 text-[#4F46E5]">Align</h4>
                    <p className="site-text-secondary leading-relaxed mb-2 text-xs">
                      We begin by aligning learning objectives with real-world industry needs and global certification standards. Whether it's Project Management, Agile, or Quality frameworks, our programs are built to meet the demands of today's dynamic professional landscape.
                    </p>
                    <p className="text-xs font-medium text-[#4F46E5] italic">
                      "Training that aligns with your goals—and the world's expectations."
          </p>
        </div>

                  <div className="p-4 site-glass backdrop-blur-sm rounded-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 h-80 flex flex-col justify-center">
                    <h4 className="font-black text-lg mb-3 text-[#F59E0B]">Acquire</h4>
                    <p className="site-text-secondary leading-relaxed mb-2 text-xs">
                      Through expert-led, instructor-led training, learners gain practical skills, tools, and frameworks that can be applied immediately. Our programs are structured to deliver deep knowledge, hands-on application, and preparation for globally recognized certifications.
                    </p>
                    <p className="text-xs font-medium text-[#F59E0B] italic">
                      "Acquire the skills that set you apart—delivered by professionals, backed by accreditation."
                    </p>
                  </div>

                  <div className="p-4 site-glass backdrop-blur-sm rounded-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 h-80 flex flex-col justify-center">
                    <h4 className="font-black text-lg mb-3 text-[#EF4444]">Achieve</h4>
                    <p className="site-text-secondary leading-relaxed mb-2 text-xs">
                      Our mission is to help you succeed—with confidence. Learners walk away not only with certifications but with career momentum, enhanced capability, and the ability to lead in their fields. For organizations, we offer measurable upskilling solutions that support strategic growth.
                    </p>
                    <p className="text-xs font-medium text-[#EF4444] italic">
                      "Achieve more than credentials—gain a competitive edge."
                    </p>
                  </div>
                </div>
                </div>
                
              {/* Enhanced Visual Element */}
              <div className="lg:col-span-2 flex justify-center lg:justify-center items-center">
                <div className="relative">
                  {/* Central Leadership Hub */}
                  <div className="w-56 h-56 site-glass backdrop-blur-xl rounded-full border border-white/30 site-light:border-slate-300 flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-500">
                    <div className="w-40 h-40 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-xl">
                      <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Rotating Orbiting Elements - All 3 Circles */}
                  {/* Align - Starting at top */}
                  <div className="absolute inset-0 animate-spin-slow">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 site-light:from-[#4F46E5]/30 site-light:to-[#7C3AED]/30 backdrop-blur-sm rounded-full border border-[#4F46E5]/30 site-light:border-[#4F46E5]/50 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                      <span className="text-xs font-bold text-[#4F46E5] no-rotate">Align</span>
                    </div>
                    </div>
                    
                  {/* Acquire - Starting 120 degrees later */}
                  <div className="absolute inset-0 animate-spin-slow animate-delay-8s">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#F59E0B]/20 to-[#D97706]/20 site-light:from-[#F59E0B]/30 site-light:to-[#D97706]/30 backdrop-blur-sm rounded-full border border-[#F59E0B]/30 site-light:border-[#F59E0B]/50 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                      <span className="text-xs font-bold text-[#F59E0B] no-rotate">Acquire</span>
                        </div>
                    </div>
                    
                  {/* Achieve - Starting 240 degrees later */}
                  <div className="absolute inset-0 animate-spin-slow animate-delay-16s">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#EF4444]/20 to-[#DC2626]/20 site-light:from-[#EF4444]/30 site-light:to-[#DC2626]/30 backdrop-blur-sm rounded-full border border-[#EF4444]/30 site-light:border-[#EF4444]/50 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                      <span className="text-xs font-bold text-[#EF4444] no-rotate">Achieve</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Section - Driving Lasting Behavioural Change */}
        <div className="site-glass backdrop-blur-xl rounded-3xl p-12 shadow-2xl relative overflow-hidden hover:shadow-3xl transition-all duration-500">
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-[#4F46E5]/30 to-[#7C3AED]/30 rounded-2xl blur-sm animate-pulse transform rotate-45"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-[#10B981]/30 to-[#059669]/30 rounded-full blur-sm animate-pulse delay-1000"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-5xl lg:text-6xl font-black mb-4 leading-tight">
                <span className="site-text-primary">Driving Lasting </span>
                <span className="bg-gradient-to-r from-[#4F46E5] via-[#B39DDB] to-[#10B981] bg-clip-text text-transparent">
                  Behavioural Change
                  </span>
              </h2>
              <h3 className="text-2xl lg:text-3xl font-bold site-text-primary mb-6">
                Empowering Professionals Beyond the Classroom
                </h3>
              <p className="text-lg site-text-secondary max-w-4xl mx-auto leading-relaxed">
                At AccrediPeopleCertifications, our programs are designed to create meaningful, lasting transformation—not just temporary impact. We focus on embedding new skills, behaviours, and mindsets that continue to shape your career long after the session ends.
                </p>
              </div>

            {/* Three Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <h4 className="text-xl font-black site-text-primary mb-4">Expert-Led, Insight-Driven Learning</h4>
                <div className="text-sm site-text-secondary leading-relaxed space-y-2">
                  <p>World-class facilitators with advanced degrees and proven leadership experience</p>
                  <p>Focused on helping learners identify strengths, gaps, and personalized goals</p>
                  <p>Enriched with research, curated resources, and practical real-world examples</p>
                </div>
                </div>
                
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v4l3-3m-3 3l-3-3" />
                    </svg>
                  </div>
                <h4 className="text-xl font-black site-text-primary mb-4">Action Plans That Fuel Continued Growth</h4>
                <div className="text-sm site-text-secondary leading-relaxed space-y-2">
                  <p>Every participant walks away with a personalized action plan targeting growth areas</p>
                  <p>These plans can be shared with leaders or HR to support long-term coaching and follow-up</p>
                  <p>Ensures accountability and ongoing development post-training</p>
                </div>
              </div>

              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-black site-text-primary mb-4">Personalized & Immersive Learning Experiences</h4>
                <div className="text-sm site-text-secondary leading-relaxed space-y-2">
                  <p>Sessions tailored to individual learning styles and career contexts</p>
                  <p>Highly interactive format with breakout rooms, role-plays, reflections & real scenarios</p>
                  <p>Designed to promote engagement, critical thinking, and behavioural change</p>
                </div>
              </div>
            </div>

            {/* Result Statement */}
            <div className="text-center site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <span className="text-2xl font-black text-[#10B981]">The Result?</span>
              </div>
              <p className="text-xl font-bold site-text-primary">
                Training that's not just informative—but truly <span className="text-[#10B981]">transformative</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 24s linear infinite;
        }
        .animate-delay-8s {
          animation-delay: -8s;
        }
        .animate-delay-16s {
          animation-delay: -16s;
        }
        .no-rotate {
          transform: none !important;
        }
      `}</style>
    </section>
  );
} 