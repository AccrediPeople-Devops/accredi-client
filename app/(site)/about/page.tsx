"use client";

import React, { useState } from "react";
import Image from "next/image";
import Breadcrumb from "@/app/components/site/Breadcrumb";
import OurApproachSection from "@/app/components/site/OurApproachSection";
import Link from "next/link";

export default function AboutPage() {
  const [activeValue, setActiveValue] = useState(0);

  const aboutImages = [
    "/Website Images/AboutUs/AdobeStock_603966594.jpeg",
  ];

  const coreValues = [
    {
      title: "Excellence",
      description: "Delivering top-notch training programs.",
      icon: "⭐",
      gradient: "from-[#F59E0B] to-[#D97706]",
      stats: "98% Satisfaction"
    },
    {
      title: "Innovation", 
      description: "Continuously evolving to meet industry demands.",
      icon: "💡",
      gradient: "from-[#4F46E5] to-[#7C3AED]",
      stats: "Latest Methods"
    },
    {
      title: "Integrity",
      description: "Upholding transparency and ethical standards.",
      icon: "🤝",
      gradient: "from-[#10B981] to-[#059669]",
      stats: "100% Transparency"
    },
    {
      title: "Impact",
      description: "Creating measurable improvements for learners.",
      icon: "📈",
      gradient: "from-[#8B5CF6] to-[#6D28D9]",
      stats: "Real Results"
    }
  ];

  const breadcrumbItems = [
    { label: "About Us" }
  ];

  // const achievements = [
  //   { number: "100K+", label: "Students Trained", icon: "🎓" },
  //   { number: "100+", label: "Countries Served", icon: "🌍" },
  //   { number: "98%", label: "Success Rate", icon: "✅" },
  //   { number: "10+", label: "Years Experience", icon: "📅" }
  // ];

  return (
    <div className="min-h-screen site-section-bg">
      {/* Hero Section */}
      <section className="relative  overflow-hidden site-section-bg">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#B39DDB]/5 site-light:bg-[#B39DDB]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-8 py-4 mb-8 hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300">
                <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse"></div>
                <span className="site-text-accent font-bold text-sm uppercase tracking-wider">About Us</span>
                <div className="w-3 h-3 bg-[#4F46E5] rounded-full animate-pulse delay-500"></div>
              </div>

              <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
                <span className="site-text-primary">About Us</span>
              </h1>

              <h2 className="text-2xl lg:text-3xl font-bold mb-8 bg-gradient-to-r from-[#4F46E5] via-[#B39DDB] to-[#10B981] bg-clip-text text-transparent">
                "Empowering Growth Through Expert Training"
              </h2>

              <p className="text-lg site-text-secondary max-w-2xl leading-relaxed mb-8">
                At AccrediPeople Certifications, we are committed to delivering high-quality training programs that empower individuals and organizations. With a learner-centric approach, we ensure that every training session drives real-world impact.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses">
                  <button className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#4F46E5]/25">
                    Our Programs
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="site-text-primary px-8 py-4 rounded-2xl font-bold text-lg site-border border site-glass backdrop-blur-sm transition-all duration-300 hover:bg-white/20 site-light:hover:bg-white/60 hover:scale-105">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-320 h-320 site-glass backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl hover:scale-105 transition-all duration-500">
                  <Image
                    src="/Website Images/AboutUs/AdobeStock_603966594.jpeg"
                    alt="Learning and Growth"
                    width={320}
                    height={320}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                
                {/* Floating Stats */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#4F46E5]/90 to-[#7C3AED]/90 backdrop-blur-sm rounded-2xl border border-white/20 flex flex-col items-center justify-center animate-pulse">
                  <span className="text-lg font-bold text-white">98%</span>
                  <span className="text-xs text-white/80">Success</span>
                </div>
                
                {/* <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-[#10B981]/90 to-[#059669]/90 backdrop-blur-sm rounded-2xl border border-white/20 flex flex-col items-center justify-center animate-pulse delay-500">
                  <span className="text-lg font-bold text-white">100K+</span>
                  <span className="text-xs text-white/80">Learners</span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Enhanced */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-48 h-48 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
              <span className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider">Our Foundation</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6">
              <strong>Vision & Mission</strong>
            </h2>
            <p className="site-text-secondary text-lg max-w-3xl mx-auto">
              Our vision and mission guide everything we do, driving us to deliver exceptional 
              training experiences that transform careers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 group">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">Our Vision</h3>
              </div>
              <p className="site-text-secondary text-lg leading-relaxed">
                To be a leading provider of transformative training solutions that foster professional and personal growth.
              </p>
            </div>

            {/* Mission */}
            <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 group">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent">Our Mission</h3>
              </div>
              <p className="site-text-secondary text-lg leading-relaxed">
                To equip individuals and businesses with the skills and knowledge they need to excel in a dynamic world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values & Objectives */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#B39DDB]/5 site-light:bg-[#B39DDB]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
              <span className="text-[#10B981] text-sm font-semibold uppercase tracking-wider">What Drives Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6">
              <strong>Core Values & Objectives</strong>
            </h2>
            <p className="site-text-secondary text-lg max-w-3xl mx-auto">
              Our core values shape our culture, guide our decisions, and define how we interact with 
              our learners, partners, and each other every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {coreValues.map((value, index) => (
              <div 
                key={index} 
                className={`site-glass backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 cursor-pointer group ${
                  activeValue === index ? 'ring-2 ring-[#4F46E5] scale-105' : 'hover:scale-105'
                }`}
                onClick={() => setActiveValue(index)}
              >
                <div className="text-center">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{value.icon}</div>
                  <h3 className={`text-2xl font-black mb-4 bg-gradient-to-r ${value.gradient} bg-clip-text text-transparent`}>
                    {value.title}
                  </h3>
                  <p className="site-text-secondary leading-relaxed mb-6">{value.description}</p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${value.gradient} text-white text-sm font-bold`}>
                    <span>{value.stats}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Commitment Section */}
          <div className="site-glass backdrop-blur-xl rounded-3xl p-12 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <span className="text-[#F59E0B] text-sm font-bold">🏆 OUR COMMITMENT</span>
                </div>
                <h3 className="text-4xl lg:text-5xl font-black mb-6 leading-tight site-text-primary">
                  Delivering Excellence
                  <span className="block bg-gradient-to-r from-[#F59E0B] to-[#EF4444] bg-clip-text text-transparent">
                    Every Single Day
                  </span>
                </h3>
                <p className="text-xl site-text-secondary leading-relaxed mb-8">
                  At AccrediPeople Certifications, we believe in transforming careers through exceptional training experiences. 
                  Our commitment extends beyond delivering courses—we foster long-term professional growth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact">
                    <button className="bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#F59E0B]/25">
                      Learn More
                    </button> 
                  </Link>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-80 h-80 site-glass backdrop-blur-xl rounded-full border border-white/30 site-light:border-slate-300 flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-500">
                    <div className="w-64 h-64 bg-gradient-to-br from-[#F59E0B] to-[#EF4444] rounded-full flex items-center justify-center shadow-xl">
                      <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#4F46E5]/30 to-[#7C3AED]/30 backdrop-blur-sm rounded-full border border-[#4F46E5]/30 site-light:border-[#4F46E5]/50 flex items-center justify-center animate-pulse">
                    <span className="text-sm font-bold text-[#4F46E5]">100K+</span>
                  </div> */}
                  
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#10B981]/30 to-[#059669]/30 backdrop-blur-sm rounded-full border border-[#10B981]/30 site-light:border-[#10B981]/50 flex items-center justify-center animate-pulse delay-500">
                    <span className="text-sm font-bold text-[#10B981]">98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        
        .marquee {
          animation: marquee 15s linear infinite;
        }
        
        .marquee:nth-child(2) {
          animation-delay: -5s;
        }
        
        .marquee:nth-child(3) {
          animation-delay: -10s;
        }
      `}</style>
    </div>
  );
} 