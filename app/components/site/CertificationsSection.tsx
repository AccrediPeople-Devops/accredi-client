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
    alt: "DevOps Institute ",
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

const certificationsDoubled = [...certifications, ...certifications];

export default function CertificationsSection() {
  return (
    <div className="p-6 md:p-8 shadow-lg bg-white rounded-2xl flex flex-col gap-6 w-full">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 text-center">
          Course Category offered
        </h2>
        <div className="relative w-full overflow-x-hidden">
          <div className="flex gap-10 md:gap-16 items-center animate-scroll-x will-change-transform" style={{animation: 'scroll-x 22s linear infinite'}}>
            {certificationsDoubled.map((cert, i) => (
              <div key={cert.alt + i} className="flex flex-col items-center justify-center gap-2 min-w-[90px]">
                <div className="w-16 h-16 md:w-20 md:h-20 relative">
                  <Image src={cert.src} alt={cert.alt} fill className="object-contain" />
                </div>
                <div className="text-xs text-gray-600 text-center truncate max-w-[90px]">{cert.alt}</div>
              </div>
            ))}
          </div>
          <style jsx>{`
            @keyframes scroll-x {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll-x {
              min-width: 1400px;
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
    </div>
  );
} 