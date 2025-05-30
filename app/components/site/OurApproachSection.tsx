"use client";
import Image from "next/image";
import React from "react";

export default function OurApproachSection() {
  return (
    <section className="py-32 px-16 bg-white" id="our-approach">
      <div className="px-5 md:px-0 w-full 2xl:max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Image */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="relative">
                {/* Background decorative element */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] to-[#B39DDB] rounded-full transform rotate-12 opacity-20"></div>
                
                {/* Main image container */}
                <div className="relative bg-white rounded-2xl p-8 shadow-lg">
                                      <div className="w-full h-48 bg-gradient-to-br from-[#E0E7FF] to-[#EDE9FE] rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#4F46E5] rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">Behavioral Change</h3>
                      <p className="text-sm text-gray-600">Long-term Impact</p>
                    </div>
                  </div>
                </div>
                
                {/* Decorative SVG overlay */}
                <div className="absolute -bottom-4 -right-4 w-20 h-20 opacity-60">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#B39DDB]">
                    <circle cx="50" cy="50" r="40" fill="currentColor" opacity="0.3"/>
                    <circle cx="50" cy="50" r="25" fill="currentColor" opacity="0.5"/>
                    <circle cx="50" cy="50" r="10" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="lg:col-span-8 lg:pl-8">
            <div className="py-5 px-4">
              <div className="text-sm font-bold text-gray-600 mb-4 tracking-wider">OUR APPROACH</div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#4F46E5] mb-6 leading-tight">
                Facilitating Long-Term Behavioral Change
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our commitment extends beyond single-session training to fostering enduring professional development. Our approach is 
                designed to create a ripple effect, where the insights and skills you gain continue to benefit you long after the workshop 
                ends. Our methodology combines three key elements that work together to facilitate long-term behavioral change:
              </p>
            </div>
          </div>
        </div>

        {/* Three Approach Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Card 01 */}
          <div className="relative bg-white rounded-lg border border-gray-200 shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="absolute -top-4 left-8">
              <div className="bg-[#4F46E5] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                01
              </div>
            </div>
            <div className="pt-4">
              <h3 className="text-xl font-bold text-[#4F46E5] mb-6 leading-tight">
                World-Class Facilitators Who Cultivate Enhanced Learning
              </h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4F46E5] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Our facilitators hold advanced degrees and use their extensive team leadership experience to help employees identify their strengths, weaknesses, and goals.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4F46E5] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Facilitators enrich content with research, recommended readings, and real-world examples for comprehensive learning.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 02 */}
          <div className="relative bg-white rounded-lg border border-gray-200 shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="absolute -top-4 left-8">
              <div className="bg-[#4F46E5] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                02
              </div>
            </div>
            <div className="pt-4">
              <h3 className="text-xl font-bold text-[#4F46E5] mb-6 leading-tight">
                Tangible Takeaways and an Action Plan for Growth
              </h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4F46E5] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Every participant leaves with a concrete plan targeting 3-4 key areas for professional growth.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4F46E5] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Action plans can be shared with leaders and HR for ongoing coaching and support.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 03 */}
          <div className="relative bg-white rounded-lg border border-gray-200 shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="absolute -top-4 left-8">
              <div className="bg-[#4F46E5] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                03
              </div>
            </div>
            <div className="pt-4">
              <h3 className="text-xl font-bold text-[#4F46E5] mb-6 leading-tight">
                Individualized Discussions and Interactive Environments
              </h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4F46E5] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Facilitators adapt content to individual needs and characteristics.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4F46E5] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Sessions are highly interactive, featuring role-play, breakout discussions, targeted activities, and guided reflections.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Business-Centered Leadership Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Content */}
          <div className="lg:col-span-8 lg:pr-8">
            <div className="py-5 px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[#4F46E5] mb-6">
                Business-Centered Leadership
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Discover what talents can be discovered with the power of Business-Centered Leadership, where the left-brain of 
                  analysis, process and strategy meets the right-brain of connectivity, empathy, and creativity.
                </p>
                <p>
                  Our facilitated workshops empower current and future leaders to build trust, collaboration, and data-driven processes to 
                  create a better tomorrow.
                </p>
                <p>
                  What sets us apart is our ability to recognize that leadership requires both sides of the brain. This is why we have created 
                  three pillars to leadership: Process Leadership, Personal Leadership, and Strategic Leadership.
                </p>
              </div>
              <div className="mt-8">
                <a 
                  href="/leadership-training" 
                  className="inline-flex items-center gap-3 text-[#4F46E5] font-bold text-lg hover:text-[#4338CA] transition-colors duration-300"
                >
                  Explore Now
                  <div className="w-6 h-6 bg-[#4F46E5] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          {/* Leadership Diagram */}
          <div className="lg:col-span-4 hidden lg:flex justify-center">
            <div className="px-5">
              <Image
                src="https://www.watermarklearning.com/images/leadership-training/WL_LeadershipPillars_Diagram.svg"
                alt="Business-Centered Leadership"
                width={400}
                height={400}
                className="mx-auto w-full"
                loading="lazy"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 