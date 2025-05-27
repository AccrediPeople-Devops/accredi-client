"use client";
import Image from "next/image";
import React from "react";
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

const trustedLogosDoubled = [...trustedLogos, ...trustedLogos];

export default function HeroSection() {
  return (
    <div className="relative w-full flex justify-center">
              <div className="w-full bg-[#f7fafd] md:rounded-b-[64px] rounded-b-[24px] pb-8 md:pb-40 px-5 md:px-16 overflow-hidden">
        <section className="relative pt-8 md:pt-16 pb-0 overflow-hidden">
          <div className="px-5 md:px-0 w-full 2xl:max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Left: Text */}
              <div className="col-span-7 flex flex-col gap-10 md:gap-12 z-10">
                <div className="flex flex-col gap-8 md:gap-10">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight md:leading-[3.5rem]">
                    Learn In-Demand Skills for
                    <span className="relative inline-block ml-2">
                      Tomorrow's Jobs
                      <span className="absolute left-0 bottom-0 w-full h-2 pointer-events-none">
                        <img
                          src="https://d2o2utebsixu4k.cloudfront.net/assets/images/animate-underline-yellow.gif"
                          alt="underline"
                          className="w-full h-20 object-contain animate-pulse"
                        />
                      </span>
                    </span>
                  </h1>
                  <div className="text-lg text-gray-600 font-medium">
                    Experience learning that delivers results. We're disrupting the way you learn
                    <span className="font-bold text-gray-800"> new-age technologies </span>
                    and we'll help you get
                    <span className="font-bold text-gray-800"> job-ready</span>, fast.
                  </div>
                </div>
                <div className="flex gap-4">
                  <a href="#" className="group flex justify-center m-0">
                    <button className="transition duration-300 ease-in-out bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#4338CA] rounded text-white px-8 py-4 flex items-center justify-center w-fit h-14 text-base font-bold capitalize">
                      <p>Explore All Courses</p>
                    </button>
                  </a>
                </div>
                {/* Trusted by */}
                <div className="flex flex-col gap-2 mt-2">
                  <div className="text-sm font-bold text-gray-600">Trusted by</div>
                  <div className="relative w-full overflow-x-hidden">
                    <div className="flex items-center gap-4 animate-scroll-x will-change-transform" style={{animation: 'scroll-x 18s linear infinite'}}>
                      {trustedLogosDoubled.map((logo, i) => (
                        <div key={logo.alt + i} className="w-20 h-7 relative flex-shrink-0">
                          <Image src={logo.src} alt={logo.alt} fill className="object-contain" />
                        </div>
                      ))}
                    </div>
                    <style jsx>{`
                      @keyframes scroll-x {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                      }
                      .animate-scroll-x {
                        min-width: 1200px;
                      }
                      .will-change-transform {
                        will-change: transform;
                      }
                      .no-scrollbar::-webkit-scrollbar {
                        display: none;
                      }
                      .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                      }
                    `}</style>
                  </div>
                  <div className="text-sm text-gray-500">and 4,500+ companies across the globe</div>
                </div>
                {/* Learner rating */}
                <div className="flex gap-4 items-center mt-2">
                  <div className="flex -space-x-2">
                    <Image src="https://d2o2utebsixu4k.cloudfront.net/Banner%20user%20icons%20combo%2002-f30dfde5cd784231ac9a68c5c1498876.svg" alt="Rated by Learners" width={120} height={40} className="rounded-full" style={{ width: 'auto', height: 'auto' }} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-gray-500">Rated by Learners</div>
                    <div className="flex gap-2 items-center">
                      <span className="text-yellow-500 text-lg">★</span>
                      <span className="text-sm font-bold text-gray-700">4.8/5</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-sm text-gray-600">12,500+ Reviews</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right: Hero image and floating cards */}
              <div className="col-span-5 flex flex-col items-center justify-center relative h-[500px] md:h-[600px]">
                <div className="w-full h-full relative flex items-center justify-center">
                  <Image
                    src="https://d2o2utebsixu4k.cloudfront.net/Webp-d0585444145e4b4a88e9a7f5f8f4588b.svg"
                    alt="upGrad KnowledgeHut Upskill and Transform Your Career"
                    fill
                    className="object-contain"
                    priority
                  />
                  {/* Floating testimonial cards - static for now */}
                  {/* <div className="absolute left-0 top-10 bg-white rounded-2xl shadow-lg px-4 py-2 flex flex-col items-center gap-1 w-48">
                    <div className="text-xs font-semibold text-gray-700">Business Analyst</div>
                    <div className="text-xs text-gray-500">To Project Manager</div>
                    <div className="text-xs text-gray-400">Citi</div>
                  </div>
                  <div className="absolute right-0 top-0 bg-white rounded-2xl shadow-lg px-4 py-2 flex flex-col items-start gap-1 w-56">
                    <div className="text-xs font-semibold text-gray-700">150% Salary Hike</div>
                    <div className="text-xs text-gray-500">SDE II @ Microsoft</div>
                  </div>
                  <div className="absolute left-0 bottom-10 bg-white rounded-2xl shadow-lg px-4 py-2 flex flex-col items-start gap-1 w-56">
                    <div className="text-xs font-semibold text-gray-700">Data Analyst</div>
                    <div className="text-xs text-gray-500">To Data Engineer</div>
                    <div className="text-xs text-gray-400">Walmart</div>
                  </div>
                  <div className="absolute right-0 bottom-10 bg-white rounded-2xl shadow-lg px-4 py-2 flex flex-col items-start gap-1 w-56">
                    <div className="text-xs font-semibold text-gray-700">200% Salary Hike</div>
                    <div className="text-xs text-gray-500">Cloud Architect @ Oracle</div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* CertificationsSection - overlapping on desktop, separate on mobile */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-[-60px] w-full z-30 pointer-events-none">
        <div className="flex justify-center w-full">
          <div className="pointer-events-auto w-full max-w-5xl px-5">
            <CertificationsSection />
          </div>
        </div>
      </div>
    </div>
  );
} 