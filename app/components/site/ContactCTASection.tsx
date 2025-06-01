"use client";
import React from "react";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import { FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

export default function ContactCTASection() {
  const socialLinks = [
    { icon: FaLinkedin, href: "https://linkedin.com/company/accredi", color: "text-blue-400 hover:text-blue-300" },
    { icon: FaFacebook, href: "https://facebook.com/accredi", color: "text-blue-500 hover:text-blue-400" },
    { icon: FaInstagram, href: "https://instagram.com/accredi", color: "text-pink-400 hover:text-pink-300" },
    { icon: BsTwitterX, href: "https://twitter.com/accredi", color: "text-gray-300 hover:text-white" },
  ];

  const paymentMethods = [
    { name: "PayPal", src: "https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" },
    { name: "American Express", src: "https://logos-world.net/wp-content/uploads/2020/09/American-Express-Logo.png" },
    { name: "Mastercard", src: "https://logoeps.com/wp-content/uploads/2013/03/mastercard-vector-logo.png" },
    { name: "Visa", src: "https://logos-world.net/wp-content/uploads/2020/04/Visa-Logo.png" },
    { name: "Afterpay", src: "https://logos-world.net/wp-content/uploads/2021/03/Afterpay-Logo.png" },
  ];

  const globalContacts = [
    {
      country: "USA",
      flag: "🇺🇸",
      numbers: ["+1-469-442-0620", "+1-832-684-0080"]
    },
    {
      country: "India",
      flag: "🇮🇳",
      numbers: ["1800-121-9232"]
    },
    {
      country: "UK",
      flag: "🇬🇧",
      numbers: ["+44-2080890434"]
    },
    {
      country: "Singapore",
      flag: "🇸🇬",
      numbers: ["+65-317-46174"]
    },
    {
      country: "Malaysia",
      flag: "🇲🇾",
      numbers: ["+60154877094"]
    },
    {
      country: "Canada",
      flag: "🇨🇦",
      numbers: ["+1-613-707-0763"]
    },
    {
      country: "New Zealand",
      flag: "🇳🇿",
      numbers: ["+64-36694791"]
    },
    {
      country: "Ireland",
      flag: "🇮🇪",
      numbers: ["+353-12708328"]
    },
    {
      country: "Australia",
      flag: "🇦🇺",
      numbers: ["+61-290995641"]
    },
    {
      country: "UAE Toll Free",
      flag: "🇦🇪",
      numbers: ["8000180860"]
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-[#0F0F23] via-[#1A1A3E] to-[#2D1B69] relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-80 h-80 bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B39DDB]/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto z-10">
        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Contact Section */}
          <div className="text-center lg:text-left">
            {/* Contact Label */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-[#B39DDB] rounded-full animate-pulse"></div>
              <span className="text-[#B39DDB] text-sm font-semibold uppercase tracking-wider">Contact</span>
            </div>
            
            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
              Don't Wait—Your Next 
              <span className="block bg-gradient-to-r from-[#4F46E5] via-[#B39DDB] to-[#10B981] bg-clip-text text-transparent">
                Career Move Starts Here
              </span>
            </h2>
            
            {/* Description */}
            <div className="mb-12">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Whether you're exploring your first certification or ready to level up your entire team, we're 
                here to help. Our training advisors are just one click away—ready to guide you on the best 
                path forward in <span className="text-white font-semibold bg-gradient-to-r from-[#4F46E5] to-[#B39DDB] bg-clip-text text-transparent">PMP®, Agile, Six Sigma, Cloud, and more</span>.
              </p>
              
              {/* Serving location with enhanced design */}
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                <span className="text-3xl">🇺🇸</span>
                <span className="text-base font-medium text-white">Serving professionals across the US & Canada</span>
              </div>
            </div>
            
            {/* Contact Button */}
            <div className="flex justify-center lg:justify-start mb-12">
              <Link 
                href="/contact" 
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#4F46E5]/25"
              >
                Contact Us
                <HiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            
            {/* Enhanced feature indicators */}
            <div className="flex items-center justify-center lg:justify-start gap-8 text-sm flex-wrap">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse"></div>
                <span className="text-gray-300">Available 24/7</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                <div className="w-3 h-3 bg-[#4F46E5] rounded-full"></div>
                <span className="text-gray-300">Expert Guidance</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                <div className="w-3 h-3 bg-[#B39DDB] rounded-full"></div>
                <span className="text-gray-300">Personalized Path</span>
              </div>
            </div>
          </div>

          {/* Right Column - Connect & Payment Info */}
          <div className="space-y-8">
            {/* Connect with us */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Connect with us
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <Link
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-white/30 hover:scale-110 group"
                    >
                      <IconComponent className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* We Accept */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                We Accept
              </h3>
              <div className="flex gap-3 flex-wrap">
                {paymentMethods.map((payment, index) => (
                  <div
                    key={index}
                    className="w-16 h-10 bg-white/20 backdrop-blur-sm rounded-xl p-1 flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105"
                  >
                    <img
                      src={payment.src}
                      alt={payment.name}
                      className="max-w-full max-h-full object-contain filter brightness-100"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Global Contact Numbers */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-[#F59E0B]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Global Contact Numbers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {globalContacts.slice(0, 6).map((contact, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{contact.flag}</span>
                      <span className="font-semibold text-white text-sm">{contact.country}</span>
                    </div>
                    {contact.numbers.map((number, numIndex) => (
                      <div key={numIndex}>
                        <a 
                          href={`tel:${number}`}
                          className="text-gray-300 hover:text-[#4F46E5] transition-colors duration-300 text-sm block font-medium"
                        >
                          {number}
                        </a>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              
              {/* Additional countries in a second row if needed */}
              {globalContacts.length > 6 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
                  {globalContacts.slice(6).map((contact, index) => (
                    <div key={index + 6} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{contact.flag}</span>
                        <span className="font-semibold text-white text-sm">{contact.country}</span>
                      </div>
                      {contact.numbers.map((number, numIndex) => (
                        <div key={numIndex}>
                          <a 
                            href={`tel:${number}`}
                            className="text-gray-300 hover:text-[#4F46E5] transition-colors duration-300 text-sm block font-medium"
                          >
                            {number}
                          </a>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 