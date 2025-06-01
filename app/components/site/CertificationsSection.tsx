"use client";
import Image from "next/image";
import React from "react";

const certifications = [
  {
    alt: "PMI",
    src: "https://d2o2utebsixu4k.cloudfront.net/authorized-training-partner-pmi-1-ab553e6169e042f988a8cc3437f1bf42.svg",
  },
  {
    alt: "Scaled Agile Inc.",
    src: "https://d2o2utebsixu4k.cloudfront.net/Platinum%20SPCT-01-cf9ad4584c4b4d6d80b5c276552eb420.svg",
  },
  {
    alt: "DevOps Institute",
    src: "https://d2o2utebsixu4k.cloudfront.net/Badges-03-5e5c5b39fc9345b7abcb578473a22ac4.svg",
  },
  {
    alt: "EC-Council",
    src: "https://d2o2utebsixu4k.cloudfront.net/Badges-04-ca4c756dadec4a0891d31fa2761b231f.svg",
  },
  {
    alt: "ICAgile",
    src: "https://d2o2utebsixu4k.cloudfront.net/Badges-06-de54f5c0eba7499f933a20bd21e362f9.svg",
  },
  {
    alt: "IIBA",
    src: "https://d2o2utebsixu4k.cloudfront.net/Badges-07-a433444a95ce4ee89725dd70d58822f5.svg",
  },
  {
    alt: "IASSC",
    src: "https://d2o2utebsixu4k.cloudfront.net/Badges-05-9742a8cf7ccf480385fb5205b4d27e6c.svg",
  },
  {
    alt: "Scrum.Org",
    src: "https://d2o2utebsixu4k.cloudfront.net/Badges-01-3c7afa39926d4146bdaa3ffccbe29726.svg",
  },
  {
    alt: "AWS",
    src: "https://d2o2utebsixu4k.cloudfront.net/Badges-02-6c95913e7b804651babdfd8822b3c757.svg",
  },
  {
    alt: "Microsoft",
    src: "https://d2o2utebsixu4k.cloudfront.net/Badges-08-5cc405936a8b4c75b220cac6e9e910af.svg",
  },
  {
    alt: "Scrum Alliance",
    src: "https://d2o2utebsixu4k.cloudfront.net/REA-New%20Logo-b5b7e812ead6484baec67fa9d4784a4d.svg",
  },
];

export default function CertificationsSection() {
  return (
    <div className="relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#4F46E5]/10 site-light:bg-[#4F46E5]/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#B39DDB]/10 site-light:bg-[#B39DDB]/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#10B981]/10 site-light:bg-[#10B981]/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Premium Glassmorphism Container */}
      <div className="relative site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
        
        {/* Floating Geometric Elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-[#4F46E5]/30 to-[#7C3AED]/30 rounded-2xl blur-sm animate-pulse transform rotate-45"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-[#10B981]/30 to-[#059669]/30 rounded-full blur-sm animate-pulse delay-1000"></div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-6 py-3 mb-6 hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
            <span className="site-text-primary text-sm font-bold uppercase tracking-wider">Certification Partners</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black site-text-primary mb-4 leading-tight">
            Industry-Leading
            <span className="block bg-gradient-to-r from-[#4F46E5] via-[#B39DDB] to-[#10B981] bg-clip-text text-transparent">
              Certifications
            </span>
          </h2>
          <p className="site-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Authorized training partner for world's most valued certifications that employers actually value
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="relative overflow-hidden rounded-2xl site-glass backdrop-blur-sm p-6">
          {/* Scrolling Container */}
          <div className="flex items-center gap-8 animate-scroll-x-smooth">
            {[...certifications, ...certifications].map((cert, i) => (
              <div key={cert.alt + i} className="flex-shrink-0 group/cert">
                <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/20 site-light:bg-white/60 backdrop-blur-sm border border-white/30 site-light:border-slate-200 hover:bg-white/30 site-light:hover:bg-white/80 hover:border-white/50 site-light:hover:border-slate-300 transition-all duration-300 min-w-[140px] hover:scale-105 hover:shadow-xl hover:shadow-white/20">
                  {/* Logo Container */}
                  <div className="w-20 h-20 relative p-3 bg-white rounded-2xl shadow-lg group-hover/cert:scale-110 group-hover/cert:shadow-2xl transition-all duration-300">
                    <Image 
                      src={cert.src} 
                      alt={cert.alt} 
                      fill 
                      className="object-contain p-1" 
                      unoptimized 
                    />
                  </div>
                  {/* Label */}
                  <div className="text-sm site-text-primary text-center font-semibold truncate max-w-[120px] group-hover/cert:text-[#4F46E5] transition-colors duration-300">
                    {cert.alt}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white/20 site-light:from-white/60 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white/20 site-light:from-white/60 to-transparent pointer-events-none"></div>
        </div>

        {/* Enhanced Stats Row */}
        <div className="grid grid-cols-3 gap-6 mt-8 pt-8 site-border border-t">
          <div className="text-center group/stat">
            <div className="text-3xl font-black bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent mb-2 group-hover/stat:scale-110 transition-transform duration-300">25+</div>
            <div className="text-sm site-text-muted font-medium">Certifications</div>
          </div>
          <div className="text-center group/stat">
            <div className="text-3xl font-black bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent mb-2 group-hover/stat:scale-110 transition-transform duration-300">98%</div>
            <div className="text-sm site-text-muted font-medium">Pass Rate</div>
          </div>
          <div className="text-center group/stat">
            <div className="text-3xl font-black bg-gradient-to-r from-[#F59E0B] to-[#D97706] bg-clip-text text-transparent mb-2 group-hover/stat:scale-110 transition-transform duration-300">Global</div>
            <div className="text-sm site-text-muted font-medium">Recognition</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <button className="group/cta relative overflow-hidden bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#4F46E5]/25">
            <span className="relative z-10">View All Certifications</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300"></div>
            <svg className="inline-block w-5 h-5 ml-2 group-hover/cta:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-x-smooth {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-x-smooth {
          animation: scroll-x-smooth 40s linear infinite;
          min-width: 200%;
        }
      `}</style>
    </div>
  );
} 