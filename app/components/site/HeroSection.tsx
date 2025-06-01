"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import CertificationsSection from "./CertificationsSection";

const trustedLogos = [
  {
    alt: "HP Enterprise",
    src: "https://d2o2utebsixu4k.cloudfront.net/Transform workflow logos_HP-2860f6848ad5400ba9b52db0077bb097.svg",
  },
  {
    alt: "Tiger",
    src: "https://d2o2utebsixu4k.cloudfront.net/Transform workflow logos_Tiger-4ff6b27ed592481881edf61e4d019df1.svg",
  },
  {
    alt: "Welspun",
    src: "https://d2o2utebsixu4k.cloudfront.net/Transform workflow logos_Welspun-4e17b025b5a8445395b02df62d9fd1f3.svg",
  },
  {
    alt: "Terrapay",
    src: "https://d2o2utebsixu4k.cloudfront.net/Transform workflow logos_terrapay-12651a4aa23148108427a29818c0dc52.svg",
  },
  {
    alt: "Reliance Retail",
    src: "https://d2o2utebsixu4k.cloudfront.net/Transform workflow logos_Reliance-8d98162977754c8b9583c132028cd967.svg",
  },
  {
    alt: "Infosys BPM",
    src: "https://d2o2utebsixu4k.cloudfront.net/Transform workflow logos_Infosys-69007f6080d94039b856ddd607aca191.svg",
  },
];

const skillsAnimation = [
  "Project Management",
  "Agile & Scrum",
  "Cloud Computing",
  "Six Sigma",
  "DevOps",
  "Digital Transformation"
];

export default function HeroSection() {
  const [currentSkill, setCurrentSkill] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentSkill((prev) => (prev + 1) % skillsAnimation.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden site-bg-primary">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#4F46E5]/10 site-light:bg-[#4F46E5]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#B39DDB]/10 site-light:bg-[#B39DDB]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#10B981]/10 site-light:bg-[#10B981]/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-32 right-1/4 w-24 h-24 text-[#4F46E5]/20 animate-spin-slow" viewBox="0 0 100 100">
          <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-32 left-1/4 w-16 h-16 text-[#B39DDB]/30 animate-bounce" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="currentColor" />
        </svg>
        <div className="absolute top-1/4 left-10 w-8 h-32 bg-gradient-to-b from-[#10B981]/30 to-transparent transform rotate-45"></div>
        <div className="absolute bottom-1/4 right-10 w-8 h-32 bg-gradient-to-t from-[#F59E0B]/30 to-transparent transform -rotate-45"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            
            {/* Left Content */}
            <div className="space-y-8 site-text-primary">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-6 py-3">
                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Transforming Careers Since 2010</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                  Master
                  <span className="block bg-gradient-to-r from-[#4F46E5] via-[#B39DDB] to-[#10B981] bg-clip-text text-transparent">
                    Future-Ready
                  </span>
                  Skills
                </h1>
                
                {/* Animated Skills */}
                <div className="flex items-center gap-4 text-2xl lg:text-3xl font-bold">
                  <span className="site-text-secondary">in</span>
                  <div className="relative h-12 overflow-hidden">
                    <div 
                      className={`transition-all duration-300 ${
                        isVisible ? 'transform translate-y-0 opacity-100' : 'transform -translate-y-full opacity-0'
                      }`}
                    >
                      <span className="bg-gradient-to-r from-[#F59E0B] to-[#EF4444] bg-clip-text text-transparent">
                        {skillsAnimation[currentSkill]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xl site-text-secondary leading-relaxed max-w-lg">
                Join the elite circle of certified professionals. Transform your career with industry-leading certifications that employers actually value.
              </p>

              {/* Interactive CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group relative overflow-hidden bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#4F46E5]/25">
                  <span className="relative z-10">Explore Certifications</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <button className="group flex items-center gap-3 site-glass backdrop-blur-sm site-text-primary px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105">
                  <svg className="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Schedule a Call
                </button>
              </div>

              {/* Premium Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 site-border border-t">
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent">
                    98%
                  </div>
                  <div className="text-sm site-text-muted font-medium">Pass Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-[#F59E0B] to-[#D97706] bg-clip-text text-transparent">
                    15K+
                  </div>
                  <div className="text-sm site-text-muted font-medium">Certified</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-[#EF4444] to-[#DC2626] bg-clip-text text-transparent">
                    4.9★
                  </div>
                  <div className="text-sm site-text-muted font-medium">Rating</div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              {/* Main Visual Container */}
              <div className="relative">
                {/* Central Floating Card */}
                <div className="relative z-20 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl mx-auto flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Premium Certification</h3>
                      <p className="text-gray-300">Industry-recognized credentials</p>
                    </div>
                    <div className="flex justify-center gap-2">
                      <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-[#F59E0B] rounded-full animate-pulse delay-300"></div>
                      <div className="w-3 h-3 bg-[#EF4444] rounded-full animate-pulse delay-700"></div>
                    </div>
                  </div>
                </div>

                {/* Floating Success Cards */}
                <div className="absolute -top-8 -left-8 bg-[#10B981]/20 backdrop-blur-sm rounded-2xl p-4 border border-[#10B981]/30 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold">200%</div>
                    <div className="text-xs opacity-80">Salary Increase</div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-12 bg-[#F59E0B]/20 backdrop-blur-sm rounded-2xl p-4 border border-[#F59E0B]/30 transform rotate-12 hover:rotate-0 transition-transform duration-300">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold">5 Weeks</div>
                    <div className="text-xs opacity-80">To Certified</div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -right-8 bg-[#EF4444]/20 backdrop-blur-sm rounded-2xl p-4 border border-[#EF4444]/30 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-xs opacity-80">Support</div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-12 bg-[#B39DDB]/20 backdrop-blur-sm rounded-2xl p-4 border border-[#B39DDB]/30 transform -rotate-12 hover:rotate-0 transition-transform duration-300">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold">Global</div>
                    <div className="text-xs opacity-80">Recognition</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted Companies Section */}
      <div className="relative z-10 site-glass backdrop-blur-sm site-border border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <p className="site-text-secondary font-medium">Trusted by professionals at</p>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex items-center justify-center gap-8 animate-scroll-x">
              {[...trustedLogos, ...trustedLogos].map((logo, i) => (
                <div key={logo.alt + i} className="flex-shrink-0 w-24 h-12 relative opacity-60 hover:opacity-100 transition-opacity duration-300">
                  <Image 
                    src={logo.src} 
                    alt={logo.alt} 
                    fill 
                    className="object-contain filter brightness-0 invert site-light:brightness-100 site-light:invert-0" 
                    unoptimized 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CertificationsSection - Hidden on mobile, shown on desktop only */}
      <div className="relative z-30 hidden md:block bg-gradient-to-br from-[#0F0F23]/80 via-[#1A1A3E]/80 to-[#2D1B69]/80 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <CertificationsSection />
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-scroll-x {
          animation: scroll-x 20s linear infinite;
          min-width: 200%;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
} 