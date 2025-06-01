"use client";
import React from "react";
import { 
  MdFolder, 
  MdCalendarToday, 
  MdPublic, 
  MdDeviceHub 
} from "react-icons/md";

export default function ProfessionalTrainingSection() {
  const features = [
    {
      icon: MdFolder,
      title: "Largest global course portfolio",
      description: "You won't find better value in the marketplace. If you do find a lower price, we will beat it."
    },
    {
      icon: MdCalendarToday,
      title: "Best choice of dates for classroom courses",
      description: "A variety of delivery methods are available depending on your learning preference."
    },
    {
      icon: MdPublic,
      title: "Most venues globally",
      description: "We have locations stretching the entire globe, allowing flexible training wherever you need it."
    },
    {
      icon: MdDeviceHub,
      title: "Multichannel delivery",
      description: "We're the only provider to have classroom, online instructor-led, online self-paced and in-house training methods globally."
    }
  ];

  return (
    <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-48 h-48 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Side - Professional Training */}
          <div className="lg:col-span-8">
            <div className="mb-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
                <span className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider">Professional Excellence</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                <span className="site-text-primary">Professional training, </span>
                <span className="bg-gradient-to-r from-[#4F46E5] to-[#B39DDB] bg-clip-text text-transparent">the way it should be done.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="group">
                    <div className="site-glass backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 h-full">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 site-light:from-[#4F46E5]/30 site-light:to-[#7C3AED]/30 rounded-2xl border border-[#4F46E5]/30 site-light:border-[#4F46E5]/50 group-hover:from-[#4F46E5]/30 group-hover:to-[#7C3AED]/30 site-light:group-hover:from-[#4F46E5]/40 site-light:group-hover:to-[#7C3AED]/40 transition-all duration-300">
                          <IconComponent className="w-7 h-7 text-[#4F46E5]" />
                        </div>
                        <div>
                          <h3 className="font-bold site-text-primary mb-3 text-lg group-hover:text-[#4F46E5] transition-colors duration-300">
                            {feature.title}
                          </h3>
                          <p className="site-text-secondary text-base leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side - Our New Normal */}
          <div className="lg:col-span-4">
            <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl site-text-primary flex flex-col justify-between h-full relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full blur-2xl"></div>
              </div>

              <div className="relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#10B981]/20 to-[#059669]/20 site-light:from-[#10B981]/30 site-light:to-[#059669]/30 backdrop-blur-sm rounded-full px-3 py-1 mb-6 border border-[#10B981]/30 site-light:border-[#10B981]/50">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                  <span className="text-[#10B981] text-xs font-semibold uppercase tracking-wider">Special Offer</span>
                </div>

                <h3 className="text-3xl font-black mb-6 bg-gradient-to-r from-[#10B981] to-[#F59E0B] bg-clip-text text-transparent">
                  Our new normal
                </h3>
                
                <p className="site-text-secondary mb-6 leading-relaxed">
                  Over the course of the current health crisis we've adapted the way we work to allow our 
                  clients to continue getting the same great quality training, whilst in a safe environment. 
                  All of our courses are available as online instructor-led, you get the feel of a classroom 
                  course but from the comfort of your own home.
                </p>

                <div className="bg-gradient-to-r from-[#F59E0B]/20 to-[#EF4444]/20 site-light:from-[#F59E0B]/30 site-light:to-[#EF4444]/30 backdrop-blur-sm p-6 rounded-2xl mb-6 border border-[#F59E0B]/30 site-light:border-[#F59E0B]/50 relative overflow-hidden">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/5 to-[#EF4444]/5 rounded-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[#F59E0B] font-bold text-sm uppercase tracking-wider">Limited Time</span>
                    </div>
                    <p className="font-bold site-text-primary text-lg leading-relaxed">
                      We're currently offering up to 25% off all Online Instructor-led courses. Don't miss out!
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <button className="bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 w-full hover:scale-105 hover:shadow-xl hover:shadow-[#10B981]/25 flex items-center justify-center gap-2">
                  <span>Enquire now</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 