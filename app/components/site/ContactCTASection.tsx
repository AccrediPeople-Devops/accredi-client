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
    <section className="py-20 md:py-32 bg-black relative overflow-hidden">
      {/* Background pattern or texture can be added here */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
      
      <div className="relative px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto">
        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Contact Section */}
          <div className="text-center lg:text-left">
            {/* Contact Label */}
            <p className="text-[#B39DDB] font-bold text-sm uppercase tracking-widest mb-8">
              CONTACT
            </p>
            
            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              Don't Wait—Your Next Career<br />
              Move Starts Here
            </h2>
            
            {/* Description */}
            <div className="mb-12">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Whether you're exploring your first certification or ready to level up your entire team, we're 
                here to help. Our training advisors are just one click away—ready to guide you on the best 
                path forward in <span className="text-white font-semibold">PMP®, Agile, Six Sigma, Cloud, and more</span>.
              </p>
              
              {/* Serving location with flag */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-400">
                <span className="text-2xl">🇺🇸</span>
                <span className="text-base font-medium">Serving professionals across the US & Canada</span>
              </div>
            </div>
            
            {/* Contact Button */}
            <div className="flex justify-center lg:justify-start mb-12">
              <Link 
                href="/contact" 
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#4338CA] hover:to-[#3730A3] text-white font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Contact Us
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            
            {/* Additional subtle elements */}
            <div className="flex items-center justify-center lg:justify-start gap-6 text-gray-500 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Available 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#4F46E5] rounded-full"></div>
                <span>Expert Guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#B39DDB] rounded-full"></div>
                <span>Personalized Path</span>
              </div>
            </div>
          </div>

          {/* Right Column - Connect & Payment Info */}
          <div className="space-y-8">
            {/* Connect with us */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Connect with us</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <Link
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300 ${social.color}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* We Accept */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">We Accept</h3>
              <div className="flex gap-3 flex-wrap">
                {paymentMethods.map((payment, index) => (
                  <div
                    key={index}
                    className="w-16 h-10 bg-white rounded-lg p-1 flex items-center justify-center"
                  >
                    <img
                      src={payment.src}
                      alt={payment.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Global Contact Numbers */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Global Contact Numbers</h3>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {globalContacts.slice(0, 6).map((contact, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{contact.flag}</span>
                        <span className="font-semibold text-white text-sm">{contact.country}</span>
                      </div>
                      {contact.numbers.map((number, numIndex) => (
                        <div key={numIndex}>
                          <a 
                            href={`tel:${number}`}
                            className="text-gray-300 hover:text-white transition-colors duration-300 text-sm block"
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-600/50">
                    {globalContacts.slice(6).map((contact, index) => (
                      <div key={index + 6} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{contact.flag}</span>
                          <span className="font-semibold text-white text-sm">{contact.country}</span>
                        </div>
                        {contact.numbers.map((number, numIndex) => (
                          <div key={numIndex}>
                            <a 
                              href={`tel:${number}`}
                              className="text-gray-300 hover:text-white transition-colors duration-300 text-sm block"
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
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-to-br from-[#B39DDB]/10 to-transparent rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-gradient-to-br from-[#4F46E5]/10 to-transparent rounded-full blur-xl"></div>
    </section>
  );
} 