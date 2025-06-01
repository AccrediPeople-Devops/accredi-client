"use client";
import Image from "next/image";
import React, { useState } from "react";

const approaches = [
  {
    id: "excellence",
    title: "Excellence-Driven Methodology",
    subtitle: "World-Class Facilitators",
    description: "Our certified master trainers combine decades of real-world experience with cutting-edge pedagogical approaches.",
    features: [
      "Advanced degree holders with industry expertise",
      "Personalized learning pathways for every individual",
      "Research-backed content with practical applications",
      "Continuous improvement through learner feedback"
    ],
    icon: "🎯",
    color: "from-[#4F46E5] to-[#7C3AED]",
    bgColor: "bg-[#4F46E5]/20"
  },
  {
    id: "transformation",
    title: "Transformation-Focused Results",
    subtitle: "Tangible Career Growth",
    description: "Every learner graduates with a personalized action plan targeting 3-4 key areas for immediate professional impact.",
    features: [
      "Concrete growth plans with measurable outcomes",
      "Leadership coaching and ongoing mentorship",
      "Industry-specific competency frameworks",
      "90-day post-training support system"
    ],
    icon: "🚀",
    color: "from-[#10B981] to-[#059669]",
    bgColor: "bg-[#10B981]/20"
  },
  {
    id: "innovation",
    title: "Innovation-Powered Learning",
    subtitle: "Interactive Environments",
    description: "Adaptive learning technology meets human-centered design to create immersive, engaging educational experiences.",
    features: [
      "AI-powered content personalization",
      "Virtual reality simulation exercises",
      "Collaborative digital workspaces",
      "Real-time performance analytics"
    ],
    icon: "⚡",
    color: "from-[#F59E0B] to-[#D97706]",
    bgColor: "bg-[#F59E0B]/20"
  }
];

export default function OurApproachSection() {
  const [activeApproach, setActiveApproach] = useState("excellence");

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden site-section-bg">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#B39DDB]/5 site-light:bg-[#B39DDB]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-8 py-4 mb-8 hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300">
            <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse"></div>
            <span className="site-text-accent font-bold text-sm uppercase tracking-wider">Revolutionary Methodology</span>
            <div className="w-3 h-3 bg-[#4F46E5] rounded-full animate-pulse delay-500"></div>
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">
            <span className="site-text-primary">Our </span>
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#B39DDB] to-[#10B981] bg-clip-text text-transparent">
              Transformative
            </span>
            <span className="block site-text-primary">Approach</span>
          </h2>
          
          <p className="text-xl site-text-secondary max-w-3xl mx-auto leading-relaxed">
            We don't just teach—we transform. Our revolutionary approach combines neuroscience, 
            behavioral psychology, and cutting-edge technology to create lasting professional change.
          </p>
        </div>

        {/* Interactive Approach Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {approaches.map((approach, index) => (
            <div
              key={approach.id}
              className={`group cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                activeApproach === approach.id ? 'scale-105' : ''
              }`}
              onClick={() => setActiveApproach(approach.id)}
            >
              <div className={`relative overflow-hidden rounded-3xl site-glass backdrop-blur-xl p-8 site-border border-2 transition-all duration-300 hover:shadow-2xl ${
                activeApproach === approach.id 
                  ? 'border-white/30 site-light:border-slate-300 shadow-2xl bg-white/15 site-light:bg-white/70' 
                  : 'hover:border-white/30 site-light:hover:border-slate-300 hover:bg-white/15 site-light:hover:bg-white/70'
              }`}>
                
                {/* Enhanced Background Gradient */}
                {activeApproach === approach.id && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${approach.color} opacity-10`}></div>
                )}
                
                {/* Number Badge */}
                <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br ${approach.color} text-white font-bold text-lg flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300`}>
                  {index + 1}
                </div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl ${approach.bgColor} backdrop-blur-sm site-border border flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {approach.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-bold site-text-muted uppercase tracking-wider mb-2">
                        {approach.subtitle}
                      </div>
                      <h3 className="text-2xl font-black site-text-primary mb-3 leading-tight">
                        {approach.title}
                      </h3>
                      <p className="site-text-secondary leading-relaxed">
                        {approach.description}
                      </p>
                    </div>
                    
                    {/* Features */}
                    <div className="space-y-3">
                      {approach.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${approach.color} mt-2 flex-shrink-0`}></div>
                          <span className="text-sm site-text-secondary leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Action */}
                    <div className="pt-4">
                      <button className={`inline-flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${approach.color} bg-clip-text text-transparent hover:scale-105 transition-all duration-300`}>
                        Learn More
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Leadership Excellence Section */}
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
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                  <span className="text-[#10B981] text-sm font-bold">🏆 LEADERSHIP EXCELLENCE</span>
                </div>
                <h3 className="text-4xl lg:text-5xl font-black mb-6 leading-tight site-text-primary">
                  Business-Centered
                  <span className="block bg-gradient-to-r from-[#10B981] via-[#F59E0B] to-[#EF4444] bg-clip-text text-transparent">
                    Leadership Mastery
                  </span>
                </h3>
                <p className="text-xl site-text-secondary leading-relaxed mb-8">
                  Where analytical precision meets creative innovation. Our three-pillar leadership framework 
                  develops both left-brain strategy and right-brain empathy for complete leadership transformation.
                </p>
              </div>

              {/* Leadership Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center p-6 site-glass backdrop-blur-sm rounded-2xl hover:bg-white/15 site-light:hover:bg-white/70 hover:scale-105 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v4l3-3m-3 3l-3-3" />
                    </svg>
                  </div>
                  <h4 className="font-black text-lg mb-2 site-text-primary">Process Leadership</h4>
                  <p className="text-sm site-text-muted">Systems & Strategy</p>
                </div>
                
                <div className="text-center p-6 site-glass backdrop-blur-sm rounded-2xl hover:bg-white/15 site-light:hover:bg-white/70 hover:scale-105 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="font-black text-lg mb-2 site-text-primary">Personal Leadership</h4>
                  <p className="text-sm site-text-muted">Self-Awareness</p>
                </div>
                
                <div className="text-center p-6 site-glass backdrop-blur-sm rounded-2xl hover:bg-white/15 site-light:hover:bg-white/70 hover:scale-105 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="font-black text-lg mb-2 site-text-primary">Strategic Leadership</h4>
                  <p className="text-sm site-text-muted">Vision & Innovation</p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group relative overflow-hidden bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#10B981]/25">
                  <span className="relative z-10">Explore Leadership Training</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#059669] to-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button className="group flex items-center gap-3 site-text-primary px-8 py-4 rounded-2xl font-bold text-lg site-border border site-glass backdrop-blur-sm transition-all duration-300 hover:bg-white/20 site-light:hover:bg-white/60 hover:scale-105">
                  <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Enhanced Visual Element */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Central Leadership Hub */}
                <div className="w-48 h-48 site-glass backdrop-blur-xl rounded-full border border-white/30 site-light:border-slate-300 flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-500">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-xl">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                
                {/* Orbiting Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 site-light:from-[#4F46E5]/30 site-light:to-[#7C3AED]/30 backdrop-blur-sm rounded-full border border-[#4F46E5]/30 site-light:border-[#4F46E5]/50 flex items-center justify-center animate-pulse hover:scale-110 transition-transform duration-300">
                  <span className="text-xs font-bold text-[#4F46E5]">Vision</span>
                </div>
                
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#F59E0B]/20 to-[#D97706]/20 site-light:from-[#F59E0B]/30 site-light:to-[#D97706]/30 backdrop-blur-sm rounded-full border border-[#F59E0B]/30 site-light:border-[#F59E0B]/50 flex items-center justify-center animate-pulse delay-500 hover:scale-110 transition-transform duration-300">
                  <span className="text-xs font-bold text-[#F59E0B]">Action</span>
                </div>
                
                <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-[#EF4444]/20 to-[#DC2626]/20 site-light:from-[#EF4444]/30 site-light:to-[#DC2626]/30 backdrop-blur-sm rounded-full border border-[#EF4444]/30 site-light:border-[#EF4444]/50 flex items-center justify-center animate-pulse delay-1000 hover:scale-110 transition-transform duration-300">
                  <span className="text-xs font-bold text-[#EF4444]">Impact</span>
                </div>
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
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
} 