"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiChevronDown } from "react-icons/hi";
import { useLocation } from "@/app/context/LocationContext";
import CountrySelectionModal from "@/app/components/CountrySelectionModal";
import SiteThemeToggle from "./SiteThemeToggle";

export default function Footer() {
  const [showCountryModal, setShowCountryModal] = useState(false);
  
  const { currentCountry, geolocationLoading } = useLocation();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Our Approach", href: "/#our-approach" },
    { name: "Contact Us", href: "/contact" },

  ];

  const policies = [
    { name: "Rescheduling Policy", href: "/rescheduling-policy" },
    { name: "Refund policy", href: "/refund-policy" },
    { name: "Our Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-conditions" },
  ];

  const discounts = [
    { name: "Refer & Earn", href: "/refer-earn" },
    { name: "Mil/Vet Discount", href: "/mil-vet-discount" },
    { name: "Unemployed Discount", href: "/unemployed-discount" },
  ];

  const workWithUs = [
    { name: "Become Instructor", href: "/become-instructor" },

  ];

  const forBusiness = [
    { name: "Corporate Training", href: "/business/corporate-training" },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#0F0F23] via-[#1A1A3E] to-[#2D1B69] text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#4F46E5]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#10B981]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-[#B39DDB]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-[#B39DDB] font-bold text-sm uppercase tracking-wider mb-6">
              QUICK LINKS
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-[#4F46E5] transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="lg:col-span-1">
            <h3 className="text-[#B39DDB] font-bold text-sm uppercase tracking-wider mb-6">
              POLICIES
            </h3>
            <ul className="space-y-3">
              {policies.map((policy) => (
                <li key={policy.name}>
                  <Link 
                    href={policy.href}
                    className="text-gray-300 hover:text-[#4F46E5] transition-colors duration-300 text-sm"
                  >
                    {policy.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discounts */}
          <div className="lg:col-span-1">
            <h3 className="text-[#B39DDB] font-bold text-sm uppercase tracking-wider mb-6">
              DISCOUNTS
            </h3>
            <ul className="space-y-3">
              {discounts.map((discount) => (
                <li key={discount.name}>
                  <Link 
                    href={discount.href}
                    className="text-gray-300 hover:text-[#4F46E5] transition-colors duration-300 text-sm"
                  >
                    {discount.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Work With Us */}
          <div className="lg:col-span-1">
            <h3 className="text-[#B39DDB] font-bold text-sm uppercase tracking-wider mb-6">
              WORK WITH US
            </h3>
            <ul className="space-y-3">
              {workWithUs.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-gray-300 hover:text-[#4F46E5] transition-colors duration-300 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Business */}
          <div className="lg:col-span-1">
            <h3 className="text-[#B39DDB] font-bold text-sm uppercase tracking-wider mb-6">
              FOR BUSINESS
            </h3>
            <ul className="space-y-3">
              {forBusiness.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-gray-300 hover:text-[#4F46E5] transition-colors duration-300 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Country */}
          <div className="lg:col-span-1">
          <h3 className="text-[#4F46E5] font-bold text-sm uppercase tracking-wider mb-6">
              CHOOSE COUNTRY
            </h3>
              <button
              onClick={() => setShowCountryModal(true)}
              disabled={geolocationLoading}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-3 rounded-lg border border-white/20 transition-colors duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {geolocationLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-300 flex-1 text-left">Loading...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">{currentCountry?.flag || "🌍"}</span>
                  <div className="flex-1 text-left">
                    <div className="text-sm text-gray-300">{currentCountry?.name || "Unknown"}</div>
                    <div className="text-xs text-gray-400">{currentCountry?.currencyCode || "USD"}</div>
                  </div>
                </>
              )}
              <HiChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <h3 className="text-[#4F46E5] font-bold text-sm uppercase tracking-wider mb-6 mt-2">
              FOLLOW US
            </h3>
            
            {/* Social Media Links */}
            <div className="mb-6">
              <a
                href="https://www.linkedin.com/company/accredi-people/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-[#4F46E5] transition-colors duration-300 text-sm mb-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>


          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/20 relative z-10">
        <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto py-8">
          {/* Copyright and Theme Toggle */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
            <p className="text-white font-medium text-sm">
              © 2025 AccrediPeople Certifications. All Rights Reserved.
            </p>
            {/* <div className="flex items-center gap-2">
              <span className="text-gray-300 text-sm">Theme:</span>
              <SiteThemeToggle />
            </div> */}
          </div>

          {/* Disclaimer */}
          <div className="text-center space-y-4">
            <p className="text-[#B39DDB] font-semibold text-sm mb-6">
              Disclaimer
            </p>
            <div className="max-w-6xl mx-auto space-y-4">
              <p className="text-gray-300 text-xs leading-relaxed">
                PMP®, PMI®, PMBOK®, PMI-ACP®, CAPM®, PgMP®, PfMP®, PBA®, RMP®, SP®, and OPM3® are registered marks of the Project Management Institute, Inc.
                  </p>
              <p className="text-gray-300 text-xs leading-relaxed">
                CSM®, CSPO®, CSD®, CSP®, A-CSPO®, A-CSM® are registered trademarks of Scrum Alliance®.
              </p>
              <p className="text-gray-300 text-xs leading-relaxed">
                Scaled Agile Framework® and SAFe® are registered trademarks of Scaled Agile, Inc.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Country Selection Modal */}
      <CountrySelectionModal 
        isOpen={showCountryModal} 
        onClose={() => setShowCountryModal(false)} 
      />
    </footer>
  );
}