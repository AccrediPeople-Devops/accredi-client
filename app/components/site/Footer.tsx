"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiChevronDown } from "react-icons/hi";
import { useLocation } from "@/app/context/LocationContext";
import CountrySelectionModal from "@/app/components/CountrySelectionModal";

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

          {/* Choose Country */}
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
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/20 relative z-10">
        <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto py-8">
          {/* Copyright */}
          <div className="text-center mb-6">
            <p className="text-white font-medium text-sm">
              © 2025 AccrediPeople Certifications. All Rights Reserved.
            </p>
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