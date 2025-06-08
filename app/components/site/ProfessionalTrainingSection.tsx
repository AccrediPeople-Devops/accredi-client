"use client";
import React from "react";

export default function ProfessionalTrainingSection() {
  const features = [
    {
      emoji: "📚",
      title: "Comprehensive Global Course Portfolio",
      description: "One of the most extensive certification offerings available—spanning key domains like Project Management, Agile, and Quality."
    },
    {
      emoji: "🗓️",
      title: "Flexible Scheduling Options",
      description: "Choose from a wide range of training dates to match your availability and pace."
    },
    {
      emoji: "💼",
      title: "Multi-Modal Delivery Options",
      description: "Instructor-led, classroom, or self-paced—each mode is designed to offer a seamless, high-impact learning experience."
    },
    {
      emoji: "📚",
      title: "Always Industry-Relevant",
      description: "Our curriculum stays up-to-date with evolving trends, tools, and frameworks to keep you career-ready."
    },
    {
      emoji: "🎓",
      title: "Highly Qualified Instructors",
      description: "Certified professionals with deep subject-matter expertise and proven instructional capabilities."
    },
    {
      emoji: "🤝",
      title: "Mentorship That Goes Beyond",
      description: "We don't just teach—we guide, mentor, and support you throughout your learning journey."
    },
    {
      emoji: "🧠",
      title: "Focused Learner Engagement",
      description: "Interactive, thoughtfully structured sessions designed to maximize participation and retention."
    },
    {
      emoji: "🛠️",
      title: "Customized Learning Solutions",
      description: "Personalized pathways and enterprise-aligned training designed to meet individual and organizational goals."
    },
    {
      emoji: "⏱️",
      title: "Efficiency-Driven Experience",
      description: "Streamlined content delivery and flexible formats—ensuring minimal disruption and maximum value."
    }
  ];

  return (
    <section className="py-16 md:py-24 site-section-bg relative overflow-hidden min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-48 h-48 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#B39DDB]/5 site-light:bg-[#B39DDB]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Side - Professional Excellence */}
          <div className="lg:col-span-8">
            <div className="mb-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                <span className="text-2xl">🌟</span>
                <span className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider">What Sets Us Apart - Professional Excellence</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                <span className="site-text-primary">At AccrediPeopleCertifications, excellence isn't optional—</span>
                <span className="bg-gradient-to-r from-[#4F46E5] to-[#B39DDB] bg-clip-text text-transparent">it's embedded in everything we do.</span>
              </h2>

              <h3 className="text-2xl md:text-3xl font-bold site-text-primary mb-8">
                Why Professionals Choose AccrediPeopleCertifications
              </h3>

              <p className="text-lg site-text-secondary mb-8 leading-relaxed">
                We don't just offer training—we deliver transformational learning experiences backed by industry-leading quality and flexibility. Here's what makes us stand out:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <div className="site-glass backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {feature.emoji}
                      </div>
                      <h4 className="font-bold site-text-primary mb-3 text-lg group-hover:text-[#4F46E5] transition-colors duration-300">
                        {feature.title}
                      </h4>
                      <p className="site-text-secondary text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Our New Normal (Sticky) */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-4 lg:h-screen lg:flex lg:items-center">
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl site-text-primary relative overflow-hidden w-full">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full blur-2xl"></div>
                  <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-br from-[#F59E0B] to-[#EF4444] rounded-full blur-2xl"></div>
                </div>

                <div className="relative z-10">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#10B981]/20 to-[#059669]/20 site-light:from-[#10B981]/30 site-light:to-[#059669]/30 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-[#10B981]/30 site-light:border-[#10B981]/50">
                    <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                    <span className="text-[#10B981] text-sm font-semibold uppercase tracking-wider">Safe & Convenient</span>
                  </div>

                  <h3 className="text-3xl font-black mb-6 bg-gradient-to-r from-[#10B981] to-[#F59E0B] bg-clip-text text-transparent">
                    Our New Normal
                  </h3>
                  
                  <p className="site-text-secondary mb-6 leading-relaxed">
                    In response to the ongoing health crisis, we've evolved the way we deliver our training to ensure our clients continue receiving the same high-quality experience—now in a safe and convenient format. All our courses are now available as live, instructor-led online sessions, offering the interactive feel of a traditional classroom, right from the comfort of your home.
                  </p>

                  {/* Special Offer */}
                  <div className="bg-gradient-to-r from-[#F59E0B]/20 to-[#EF4444]/20 site-light:from-[#F59E0B]/30 site-light:to-[#EF4444]/30 backdrop-blur-sm p-6 rounded-2xl mb-6 border border-[#F59E0B]/30 site-light:border-[#F59E0B]/50 relative overflow-hidden">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/5 to-[#EF4444]/5 rounded-2xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[#F59E0B] font-bold text-sm uppercase tracking-wider">Limited Time Offer</span>
                      </div>
                      <p className="font-black site-text-primary text-xl leading-relaxed mb-2">
                        Up to 15% OFF all Online Instructor-led courses
                      </p>
                      <p className="site-text-secondary text-sm">Don't miss out on this exclusive opportunity!</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 w-full hover:scale-105 hover:shadow-xl hover:shadow-[#10B981]/25 flex items-center justify-center gap-2">
                    <span>Enquire Now</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 