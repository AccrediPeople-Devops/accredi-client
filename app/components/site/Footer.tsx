"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiChevronDown } from "react-icons/hi";

export default function Footer() {
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

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
    { name: "Refer & Earn", href: "/discounts/refer-earn" },
    { name: "Mil/Vet Discount", href: "/discounts/military-veteran" },
    { name: "Unemployed Discount", href: "/discounts/unemployed" },
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
            <div className="relative">
              <button
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-lg border border-white/20 transition-colors duration-300 w-full"
              >
                <span className="text-xl">🇺🇸</span>
                <span className="text-sm text-gray-300 flex-1 text-left">United States</span>
                <HiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${countryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {countryDropdownOpen && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-white/20 rounded text-sm">
                      <span className="text-xl">🇺🇸</span>
                      <span className="text-gray-300">United States</span>
                    </button>
                    <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-white/20 rounded text-sm">
                      <span className="text-xl">🇨🇦</span>
                      <span className="text-gray-300">Canada</span>
                    </button>
                    <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-white/20 rounded text-sm">
                      <span className="text-xl">🇬🇧</span>
                      <span className="text-gray-300">United Kingdom</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
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
    </footer>
  );
}