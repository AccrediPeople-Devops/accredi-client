"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import CertificationsSection from "./CertificationsSection";

// Create array of client logos - all are PNG files
const trustedLogos = Array.from({ length: 24 }, (_, i) => {
  const num = i + 1;
  return {
    alt: `Client ${num}`,
    src: `/ClientTale/${num}.png`,
    id: num,
  };
});

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
                <span className="text-sm font-medium">Transforming Careers Since 2025</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                  Empowering 
                  <span className="block bg-gradient-to-r from-[#4F46E5] via-[#B39DDB] to-[#10B981] bg-clip-text text-transparent">
                  professionals to master
                  </span>
                  future-ready skills
                </h1>
                
                {/* Animated Skills */}
                <div className="flex items-center gap-4 text-xl lg:text-2xl font-bold">
                  <span className="site-text-secondary">one certification at a time in</span>
                  <div className="relative overflow-hidden">
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
              
              </p>
              <p className="text-xl site-text-secondary leading-relaxed max-w-lg">
              We're committed to delivering world-class, instructor-led training programs that help professionals upskill, grow in their careers, and stay ahead in today's competitive landscape
              </p>

              {/* Interactive CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/courses" className="group relative overflow-hidden bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#4F46E5]/25">
                  <span className="relative z-10">Explore Certifications</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                
                <a href="/contact" className="group flex items-center gap-3 site-glass backdrop-blur-sm site-text-primary px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105">
                  <svg className="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Schedule a Call
                </a>
              </div>

              {/* Premium Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 site-border border-t">
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent">
                    98%
                  </div>
                  <div className="text-sm site-text-muted font-medium">Pass Rate</div>
                </div>
                {/* <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-[#F59E0B] to-[#D97706] bg-clip-text text-transparent">
                    5K+
                  </div>
                  <div className="text-sm site-text-muted font-medium">Certified</div>
                </div> */}
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-[#EF4444] to-[#DC2626] bg-clip-text text-transparent">
                    4.9★
                  </div>
                  <div className="text-sm site-text-muted font-medium">Rating</div>
                </div>
              </div>
            </div>

            {/* Right Visual - Clean Image Only */}
            <div className="relative">
              {/* Main Visual Container */}
              <div className="relative">
                {/* Hero Image - Clean without any overlay content or floating cards */}
                <div className="relative z-20 rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/Website Images/HeroSectionHomePage/AdobeStock_258949460.jpeg"
                    alt="Professional Training and Certification"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />
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
            <div className="flex items-center justify-center gap-12 animate-scroll-x">
              {[...trustedLogos, ...trustedLogos].map((logo, i) => (
                <div key={`${logo.id}-${i}`} className="flex-shrink-0 w-28 h-14 relative opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <Image 
                    src={logo.src} 
                    alt={logo.alt} 
                    fill 
                    className="object-contain logo-filter" 
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                    onLoad={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.opacity = '1';
                    }}
                    style={{ 
                      opacity: 0, 
                      transition: 'opacity 0.3s ease',
                    }}
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
        .logo-filter {
          filter: brightness(0) invert(1); /* White in dark mode */
        }
        :global(.site-light) .logo-filter {
          filter: brightness(0); /* Black in light mode */
        }
      `}</style>
    </div>
  );
} 