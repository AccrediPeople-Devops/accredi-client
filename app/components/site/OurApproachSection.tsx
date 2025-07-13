"use client";
import Image from "next/image";
import React, { useState } from "react";

export default function OurApproachSection() {
  return (
    <section className="relative py-24 overflow-hidden site-section-bg">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-[#4F46E5]/15 via-[#B39DDB]/10 to-transparent site-light:from-[#4F46E5]/25 site-light:via-[#B39DDB]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-[#10B981]/15 via-[#4F46E5]/10 to-transparent site-light:from-[#10B981]/25 site-light:via-[#4F46E5]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-[#B39DDB]/10 to-[#10B981]/15 site-light:from-[#B39DDB]/20 site-light:to-[#10B981]/25 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-32 w-4 h-4 bg-[#4F46E5]/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-40 left-32 w-3 h-3 bg-[#10B981]/40 rotate-45 animate-bounce delay-700"></div>
        <div className="absolute top-1/2 left-20 w-2 h-8 bg-[#B39DDB]/25 rounded-full animate-pulse delay-1200"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 space-y-32">
        {/* Our Approach Section */}
        <div className="site-glass backdrop-blur-xl rounded-3xl p-16 shadow-2xl relative overflow-hidden hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] hover:backdrop-blur-2xl group">
          {/* Enhanced Floating Elements */}
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-[#4F46E5]/40 to-[#B39DDB]/40 rounded-3xl blur-sm animate-pulse transform rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
          <div className="absolute -bottom-6 -left-6 w-10 h-10 bg-gradient-to-br from-[#10B981]/40 to-[#B39DDB]/40 rounded-full blur-sm animate-pulse delay-1000 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="absolute top-10 right-10 w-6 h-6 bg-gradient-to-r from-[#4F46E5]/20 to-[#10B981]/20 rounded-full animate-bounce delay-500"></div>
          
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
            <div className="absolute top-10 left-10 w-40 h-40 border-2 border-dashed border-white/40 site-light:border-slate-400 rounded-full animate-spin [animation-duration:20s]"></div>
            <div className="absolute bottom-10 right-10 w-56 h-56 border border-white/30 site-light:border-slate-300 rounded-full animate-ping [animation-duration:3s]"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-white/20 site-light:border-slate-200 rounded-full animate-pulse"></div>
          </div>
          
          <div className="relative z-10 text-center space-y-8">
            {/* Header */}
            <div>
                              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                  <span className="text-emerald-400 site-light:text-emerald-600 text-sm font-bold">🏆 OUR APPROACH</span>
                </div>
            </div>

            <h1 className="text-white text-5xl lg:text-7xl font-black leading-tight">
                  
                  <span className="block bg-gradient-to-r from-[#4F46E5] via-[#B39DDB] to-[#10B981] bg-clip-text text-transparent">
                  <span className="text-white">Our</span> Transformative
                  </span>
                  Approach
            </h1>

            {/* Description */}
            <div className="max-w-5xl mx-auto mb-12">
              <p className="text-lg site-text-secondary leading-relaxed">
                At AccrediPeopleCertifications, our approach is rooted in a clear mission: to deliver practical, industry-relevant training backed by globally recognized certifications. We go beyond traditional instruction by focusing on real-world application, ensuring that every learner gains not only knowledge—but the confidence and capability to use it effectively in their professional environment. Guided by expert instructors and a learner-first philosophy, we create impactful learning experiences that translate into measurable career growth and organizational value.
              </p>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center mb-16">
              {/* Cards */}
              <div className="lg:col-span-3">
                {/* Three-Step Process - Row Layout on Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                  <div className="site-glass backdrop-blur-xl rounded-3xl px-4 py-6 hover:bg-white/20 site-light:hover:bg-white/80 transition-all duration-500 group hover:scale-105 hover:shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 via-transparent to-[#B39DDB]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 text-center">
                      <div className="approach-card-title">Align</div>
                      <p className="site-text-secondary leading-relaxed mb-2 text-sm">
                        We begin by aligning learning objectives with real-world industry needs and global certification standards. Whether it's Project Management, Agile, or Quality frameworks, our programs are built to meet the demands of today's dynamic professional landscape.
                      </p>
                      <p className="text-sm font-medium site-text-secondary italic">
                        "Training that aligns with your goals—and the world's expectations."
                      </p>
                    </div>
                  </div>

                  <div className="site-glass backdrop-blur-xl rounded-3xl px-4 py-6 hover:bg-white/20 site-light:hover:bg-white/80 transition-all duration-500 group hover:scale-105 hover:shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/5 via-transparent to-[#D97706]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 text-center">
                      <div className="approach-card-title">Acquire</div>
                      <p className="site-text-secondary leading-relaxed mb-2 text-sm">
                        Through expert-led, instructor-led training, learners gain practical skills, tools, and frameworks that can be applied immediately. Our programs are structured to deliver deep knowledge, hands-on application, and preparation for globally recognized certifications.
                      </p>
                      <p className="text-sm font-medium site-text-secondary italic">
                        "Acquire the skills that set you apart—delivered by professionals, backed by accreditation."
                      </p>
                    </div>
                  </div>

                  <div className="site-glass backdrop-blur-xl rounded-3xl px-4 py-6 hover:bg-white/20 site-light:hover:bg-white/80 transition-all duration-500 group hover:scale-105 hover:shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#EF4444]/5 via-transparent to-[#DC2626]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 text-center">
                      <div className="approach-card-title">Achieve</div>
                      <p className="site-text-secondary leading-relaxed mb-2 text-sm">
                        Our mission is to help you succeed—with confidence. Learners walk away not only with certifications but with career momentum, enhanced capability, and the ability to lead in their fields. For organizations, we offer measurable upskilling solutions that support strategic growth.
                      </p>
                      <p className="text-sm font-medium site-text-secondary italic">
                        "Achieve more than credentials—gain a competitive edge."
                      </p>
                    </div>
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
                      <span className="text-xs font-bold site-text-primary no-rotate">Align</span>
                    </div>
                  </div>
                    
                  {/* Acquire - Starting 120 degrees later */}
                  <div className="absolute inset-0 animate-spin-slow animate-delay-8s">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#F59E0B]/20 to-[#D97706]/20 site-light:from-[#F59E0B]/30 site-light:to-[#D97706]/30 backdrop-blur-sm rounded-full border border-[#F59E0B]/30 site-light:border-[#F59E0B]/50 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                      <span className="text-xs font-bold site-text-primary no-rotate">Acquire</span>
                    </div>
                  </div>
                    
                  {/* Achieve - Starting 240 degrees later */}
                  <div className="absolute inset-0 animate-spin-slow animate-delay-16s">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#EF4444]/20 to-[#DC2626]/20 site-light:from-[#EF4444]/30 site-light:to-[#DC2626]/30 backdrop-blur-sm rounded-full border border-[#EF4444]/30 site-light:border-[#EF4444]/50 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                      <span className="text-xs font-bold site-text-primary no-rotate">Achieve</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Driving Lasting Behavioural Change Section */}
        <div className="site-glass backdrop-blur-xl rounded-3xl p-16 shadow-2xl relative overflow-hidden hover:shadow-3xl transition-all duration-700 hover:scale-[1.01] hover:backdrop-blur-2xl group">
          {/* Enhanced Floating Elements */}
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-[#4F46E5]/40 to-[#B39DDB]/40 rounded-3xl blur-sm animate-pulse transform rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
          <div className="absolute -bottom-6 -left-6 w-10 h-10 bg-gradient-to-br from-[#10B981]/40 to-[#B39DDB]/40 rounded-full blur-sm animate-pulse delay-1000 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="absolute top-10 left-10 w-6 h-6 bg-gradient-to-r from-[#B39DDB]/20 to-[#10B981]/20 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-10 right-10 w-4 h-4 bg-gradient-to-r from-[#4F46E5]/30 to-[#10B981]/30 rotate-45 animate-pulse delay-800"></div>
          
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

            {/* Three Cards - Simplified Design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/20 site-light:hover:bg-white/80 transition-all duration-500 text-center group hover:scale-105 hover:shadow-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 via-transparent to-[#B39DDB]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[#4F46E5] rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-6 site-text-primary">
                    Expert-Led, Insight-Driven Learning
                  </h4>
                  <div className="site-text-secondary leading-relaxed space-y-4 text-left">
                    <p className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#4F46E5] rounded-full mt-2 flex-shrink-0"></span>
                      World-class facilitators with advanced degrees and proven leadership experience
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#4F46E5] rounded-full mt-2 flex-shrink-0"></span>
                      Focused on helping learners identify strengths, gaps, and personalized goals
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#4F46E5] rounded-full mt-2 flex-shrink-0"></span>
                      Enriched with research, curated resources, and practical real-world examples
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/20 site-light:hover:bg-white/80 transition-all duration-500 text-center group hover:scale-105 hover:shadow-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/5 via-transparent to-[#F59E0B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[#F59E0B] rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v4l3-3m-3 3l-3-3" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-6 site-text-primary">
                    Action Plans That Fuel Continued Growth
                  </h4>
                  <div className="site-text-secondary leading-relaxed space-y-4 text-left">
                    <p className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#F59E0B] rounded-full mt-2 flex-shrink-0"></span>
                      Every participant walks away with a personalized action plan targeting growth areas
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#F59E0B] rounded-full mt-2 flex-shrink-0"></span>
                      These plans can be shared with leaders or HR to support long-term coaching and follow-up
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#F59E0B] rounded-full mt-2 flex-shrink-0"></span>
                      Ensures accountability and ongoing development post-training
                    </p>
                  </div>
                </div>
              </div>

              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/20 site-light:hover:bg-white/80 transition-all duration-500 text-center group hover:scale-105 hover:shadow-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 via-transparent to-[#10B981]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[#10B981] rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-6 site-text-primary">
                    Personalized & Immersive Learning Experiences
                  </h4>
                  <div className="site-text-secondary leading-relaxed space-y-4 text-left">
                    <p className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#10B981] rounded-full mt-2 flex-shrink-0"></span>
                      Sessions tailored to individual learning styles and career contexts
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#10B981] rounded-full mt-2 flex-shrink-0"></span>
                      Highly interactive format with breakout rooms, role-plays, reflections & real scenarios
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#10B981] rounded-full mt-2 flex-shrink-0"></span>
                      Designed to promote engagement, critical thinking, and behavioural change
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Statement */}
            <div className="text-center site-glass backdrop-blur-xl rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 relative overflow-hidden group mt-12">
              <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 via-[#4F46E5]/10 to-[#B39DDB]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#10B981] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-3xl font-bold site-text-primary">The Result?</span>
                </div>
                <p className="text-2xl font-bold site-text-primary leading-relaxed">
                  Training that's not just informative—but truly <span className="text-[#10B981] font-black">transformative</span>.
                </p>
              </div>
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