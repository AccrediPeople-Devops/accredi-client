"use client";
import Image from "next/image";
import React from "react";

export default function ClientLogosSection() {
  const companyLogos = [
    {
      alt: "Just Eat",
      src: "https://d2o2utebsixu4k.cloudfront.net/logo-1-e4e0ba9ac02940348b8f1c7be0a72fb1.svg",
    },
    {
      alt: "Barclays",
      src: "https://d2o2utebsixu4k.cloudfront.net/Barclays-01%20%281%29-aadf86830e3c474d8e2a88068eb80e8c.svg",
    },
    {
      alt: "Confused.com",
      src: "https://d2o2utebsixu4k.cloudfront.net/confused-04baafa6c81b4c5f8b9ea82bb8ecdcbb.svg",
    },
    {
      alt: "ASOS",
      src: "https://d2o2utebsixu4k.cloudfront.net/asos-01-6bcc88ad71364e37b2e98b3fd6de5be5.svg",
    },
    {
      alt: "Aston Martin",
      src: "https://d2o2utebsixu4k.cloudfront.net/aston%20martin-01-e95306b7e5414b29b9c8bb3c47edc90e.svg",
    },
    {
      alt: "Charles Stanley",
      src: "https://d2o2utebsixu4k.cloudfront.net/charles%20stanley-01-7fd7c02f13794ab29f66b8f76d0ee8e9.svg",
    },
    {
      alt: "Rolls-Royce",
      src: "https://d2o2utebsixu4k.cloudfront.net/RR%20Brand%20Logo%20Digital%20Blue%20RGB-01-c31cfa9b3b524c1ba63d6a04c7ea85ff.svg",
    },
    {
      alt: "BMW",
      src: "https://d2o2utebsixu4k.cloudfront.net/bmw-01-5e81cb16d5e44cf397e9b9b57b4cf6f4.svg",
    },
    {
      alt: "Deliveroo",
      src: "https://d2o2utebsixu4k.cloudfront.net/deliveroo-01-b1fcb5df6c804ebfb6bb80fae9e3dcde.svg",
    },
    {
      alt: "Google",
      src: "https://d2o2utebsixu4k.cloudfront.net/google-01-12c8c9a8c2f041748b2b9816e4a30a6c.svg",
    },
    {
      alt: "Microsoft",
      src: "https://d2o2utebsixu4k.cloudfront.net/microsoft-01-5b1db4a6ce6143649a6c1e3dd1d4f8e1.svg",
    },
    {
      alt: "Amazon",
      src: "https://d2o2utebsixu4k.cloudfront.net/amazon-01-1c3d8af35b48494b9d3d65db3a0ba4ca.svg",
    },
    {
      alt: "Apple",
      src: "https://d2o2utebsixu4k.cloudfront.net/apple-01-c1e5b3c5d34b49749a4f3f5b4d2c8f9a.svg",
    },
    {
      alt: "Netflix",
      src: "https://d2o2utebsixu4k.cloudfront.net/netflix-01-8f9e2d4c6b3a487390b5c7d8e1f6a4b2.svg",
    },
    {
      alt: "Uber",
      src: "https://d2o2utebsixu4k.cloudfront.net/uber-01-7e6f5d4c8a2b4962a1c5f8d9b3e7a6c1.svg",
    },
    {
      alt: "Spotify",
      src: "https://d2o2utebsixu4k.cloudfront.net/spotify-01-2f8e7a9c5d3b46128f5c8e7a1b4d6f3a.svg",
    }
  ];

  // Triple the logos for seamless infinite scroll
  const logosTripled = [...companyLogos, ...companyLogos, ...companyLogos];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto">
        <div className="company-logos text-center">
          {/* Header Text */}
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-12 md:mb-16">
            We've trained 300,000+ companies & over 2,000,000 delegates
          </p>
          
          {/* Logo Carousel */}
          <div className="logo-carousel relative">
            {/* Container with gradient masks for translucent ends */}
            <div className="relative overflow-hidden">
              {/* Left gradient fade */}
              <div className="absolute left-0 top-0 w-20 md:w-32 h-full bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
              
              {/* Right gradient fade */}
              <div className="absolute right-0 top-0 w-20 md:w-32 h-full bg-gradient-to-l from-gray-100 to-transparent z-10 pointer-events-none"></div>
              
              {/* Scrolling logos container */}
              <div className="flex items-center gap-8 md:gap-12 animate-infinite-scroll" style={{animation: 'infinite-scroll 40s linear infinite'}}>
                {logosTripled.map((logo, i) => (
                  <div key={`${logo.alt}-${i}`} className="flex-shrink-0 w-24 h-12 md:w-32 md:h-16 relative grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                    <Image 
                      src={logo.src} 
                      alt={logo.alt} 
                      fill 
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes infinite-scroll {
          0% { 
            transform: translateX(0); 
          }
          100% { 
            transform: translateX(-33.333%); 
          }
        }
        
        .animate-infinite-scroll {
          width: calc(300%);
          will-change: transform;
        }
        
        /* Ensure smooth scrolling */
        .logo-carousel {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }
      `}</style>
    </section>
  );
} 