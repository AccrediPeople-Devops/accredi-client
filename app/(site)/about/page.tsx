"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import OurApproachSection from "@/app/components/site/OurApproachSection";
import Breadcrumb from "@/app/components/site/Breadcrumb";

export default function AboutPage() {
  const aboutImages = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
  ];

  const visionMissionCards = [
    {
      title: "Our Vision",
      description: "To be the global leader in professional certification training, empowering individuals and organizations to achieve excellence through industry-recognized credentials and cutting-edge learning experiences.",
      icon: "🎯",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "Our Mission", 
      description: "To provide world-class certification training programs that bridge the gap between industry demands and professional skills, enabling career advancement and organizational success.",
      icon: "🚀",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  const coreValues = [
    {
      title: "Excellence",
      description: "We maintain the highest standards in everything we do, from course content to instructor expertise.",
      icon: "⭐",
      color: "text-yellow-600 bg-yellow-50"
    },
    {
      title: "Innovation", 
      description: "We continuously evolve our teaching methods and technology to provide cutting-edge learning experiences.",
      icon: "💡",
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Integrity",
      description: "We operate with complete transparency and honesty in all our interactions and business practices.",
      icon: "🤝",
      color: "text-green-600 bg-green-50"
    },
    {
      title: "Growth",
      description: "We are committed to the continuous development of our learners, instructors, and organization.",
      icon: "📈",
      color: "text-purple-600 bg-purple-50"
    },
    {
      title: "Global Impact",
      description: "We strive to make a positive difference in professionals' lives across the globe.",
      icon: "🌍",
      color: "text-indigo-600 bg-indigo-50"
    },
    {
      title: "Empowerment",
      description: "We believe in empowering individuals with the knowledge and skills needed for career success.",
      icon: "💪",
      color: "text-red-600 bg-red-50"
    }
  ];

  const breadcrumbItems = [
    { label: "About Us" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="overflow-hidden bg-no-repeat bg-cover bg-center min-h-[440px]" 
        style={{
          backgroundImage: "url('https://d1qnndbrfkpp2h.cloudfront.net/static-images/sa-about-page-intro-bg.webp')"
        }}
      >
        <div className="lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="flex justify-between items-center">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Main Heading */}
          <div className="max-w-3xl mx-auto mt-7 lg:mt-4">
            <h1 className="text-2xl lg:text-4xl font-bold leading-7 lg:leading-10 text-gray-900 text-center">
              Accredi's commitment to{" "}
              <span className="text-[#4F46E5]">professional growth</span>{" "}
              and career advancement.
            </h1>
            <div className="text-right">
              <Image
                src="https://d1qnndbrfkpp2h.cloudfront.net/static-images/sa-about-headig-underline.webp"
                alt="Underline"
                width={120}
                height={8}
                className="inline-block h-2 -translate-y-3"
                unoptimized
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-2 text-slate-700 text-base max-w-2xl mx-auto text-center">
            Accredi has established a strong global presence, reaching students and professionals across 100+ 
            countries. Our training programs provide dynamic experiences that empower learners with the most 
            comprehensive knowledge.
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className="lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8 -translate-y-24 lg:-translate-y-32 -mb-10 lg:-mb-5 pt-10 overflow-hidden">
        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-5 gap-5">
          {aboutImages.map((imageSrc, index) => (
            <div key={index}>
              <Image
                src={imageSrc}
                alt="Image"
                width={300}
                height={400}
                className={`w-full ${index % 2 === 1 ? '-translate-y-10' : ''}`}
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Mobile Marquee - Multiple Rows */}
        <div className="md:hidden flex flex-nowrap justify-center lg:container lg:mx-auto lg:max-w-7xl relative">
          {/* First Row */}
          <div className="flex gap-5 marquee">
            {aboutImages.map((imageSrc, index) => (
              <div key={`row1-${index}`} className="w-[50vw]">
                <Image
                  src={imageSrc}
                  alt="Image"
                  width={200}
                  height={300}
                  className={`w-full ${index % 2 === 1 ? '-translate-y-10' : ''}`}
                  unoptimized
                />
              </div>
            ))}
          </div>
          
          {/* Second Row */}
          <div className="flex gap-7 marquee ml-7">
            {aboutImages.map((imageSrc, index) => (
              <div key={`row2-${index}`} className="w-[50vw]">
                <Image
                  src={imageSrc}
                  alt="Image"
                  width={200}
                  height={300}
                  className={`w-full ${index % 2 === 0 ? '-translate-y-10' : ''}`}
                  unoptimized
                />
              </div>
            ))}
          </div>
          
          {/* Third Row */}
          <div className="flex gap-7 marquee ml-7">
            {aboutImages.map((imageSrc, index) => (
              <div key={`row3-${index}`} className="w-[50vw]">
                <Image
                  src={imageSrc}
                  alt="Image"
                  width={200}
                  height={300}
                  className={`w-full ${index % 2 === 1 ? '-translate-y-10' : ''}`}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commitment Section */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="lg:pr-8">
              <div className="text-sm font-bold text-gray-600 mb-4 tracking-wider">OUR COMMITMENT</div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#4F46E5] mb-6 leading-tight">
                Delivering High-Quality Training Excellence
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  At Accredi, we believe in transforming careers through exceptional training experiences. 
                  Our commitment extends beyond delivering courses—we are dedicated to fostering long-term 
                  professional growth and success for every learner.
                </p>
                <p>
                  With over a decade of experience in professional development, we've helped thousands of 
                  professionals achieve their certification goals and advance their careers across various 
                  industries and domains.
                </p>
                <p>
                  Our comprehensive approach combines world-class content, expert instructors, and innovative 
                  learning methodologies to ensure that every training experience delivers measurable results 
                  and lasting impact.
                </p>
              </div>
            </div>
            
            {/* Image */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="relative">
                  {/* Background decorative element */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] to-[#B39DDB] rounded-2xl transform rotate-3 opacity-20"></div>
                  
                  {/* Main image container */}
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                      alt="Professional Training Excellence"
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover rounded-xl"
                      unoptimized
                    />
                    <div className="mt-4 text-center">
                      <h3 className="text-lg font-bold text-gray-800">Excellence in Training</h3>
                      <p className="text-sm text-gray-600">Empowering Professional Growth</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission Section */}
      <div className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-sm font-bold text-gray-600 mb-4 tracking-wider">OUR FOUNDATION</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Vision & Mission
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our vision and mission guide everything we do, driving us to deliver exceptional 
              training experiences that transform careers and shape the future of professional development.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#3730A3] rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#4F46E5]">Our Vision</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                To be the global leader in professional certification training, empowering millions of 
                professionals worldwide to achieve their career aspirations through innovative, accessible, 
                and transformative learning experiences that drive industry excellence and personal growth.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#B39DDB] to-[#9C88C4] rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#B39DDB]">Our Mission</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                To deliver world-class professional certification training that combines expert instruction, 
                cutting-edge methodologies, and personalized support to help individuals and organizations 
                achieve their goals, advance their careers, and create lasting positive impact in their industries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-sm font-bold text-gray-600 mb-4 tracking-wider">WHAT DRIVES US</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Core Values & Objectives
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our core values shape our culture, guide our decisions, and define how we interact with 
              our learners, partners, and each other every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 lg:p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#4F46E5]">
                <div className="text-center">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Objectives */}
          <div className="mt-16 bg-gradient-to-r from-[#4F46E5] to-[#3730A3] rounded-2xl p-8 lg:p-12 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">Our Strategic Objectives</h3>
              <p className="text-blue-100 text-lg">
                These key objectives guide our strategic direction and operational excellence
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">100+</span>
                </div>
                <h4 className="font-bold text-lg mb-2">Countries Served</h4>
                <p className="text-blue-100 text-sm">Global reach and accessibility</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">95%</span>
                </div>
                <h4 className="font-bold text-lg mb-2">Success Rate</h4>
                <p className="text-blue-100 text-sm">Certification achievement rate</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">24/7</span>
                </div>
                <h4 className="font-bold text-lg mb-2">Support</h4>
                <p className="text-blue-100 text-sm">Round-the-clock assistance</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">10+</span>
                </div>
                <h4 className="font-bold text-lg mb-2">Years Experience</h4>
                <p className="text-blue-100 text-sm">Industry expertise and knowledge</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Approach Section */}
      <OurApproachSection />

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