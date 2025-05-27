"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiChevronDown } from "react-icons/hi";

export default function Footer() {
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [disclaimerExpanded, setDisclaimerExpanded] = useState(false);

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Our Approach", href: "/approach" },
    { name: "Contact Us", href: "/contact" },
    { name: "Blogs", href: "/blogs" },
  ];

  const policies = [
    { name: "Rescheduling Policy", href: "/policies/rescheduling" },
    { name: "Refund policy", href: "/policies/refund" },
    { name: "Our Privacy Policy", href: "/policies/privacy" },
    { name: "Terms & Conditions", href: "/policies/terms" },
    { name: "100% Money Back Guarantee on PMP Training", href: "/policies/money-back-guarantee" },
  ];

  const discounts = [
    { name: "Refer & Earn", href: "/discounts/refer-earn" },
    { name: "Mil/Vet Discount", href: "/discounts/military-veteran" },
    { name: "Unemployed Discount", href: "/discounts/unemployed" },
  ];

  const workWithUs = [
    { name: "Become Instructor", href: "/careers/instructor" },
    { name: "Blog As a Guest", href: "/careers/guest-blog" },
  ];

  const forBusiness = [
    { name: "Corporate Training", href: "/business/corporate-training" },
  ];

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto py-16">
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
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
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
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
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
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
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
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
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
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
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
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-600 transition-colors duration-300 w-full"
              >
                <span className="text-xl">🇺🇸</span>
                <span className="text-sm text-gray-300 flex-1 text-left">United States</span>
                <HiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${countryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {countryDropdownOpen && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-700 rounded text-sm">
                      <span className="text-xl">🇺🇸</span>
                      <span className="text-gray-300">United States</span>
                    </button>
                    <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-700 rounded text-sm">
                      <span className="text-xl">🇨🇦</span>
                      <span className="text-gray-300">Canada</span>
                    </button>
                    <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-700 rounded text-sm">
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
      <div className="border-t border-gray-800">
        <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto py-8">
          {/* Copyright */}
          <div className="text-center mb-6">
            <p className="text-[#B39DDB] font-medium text-sm">
              © 2025 AccrediPeople Certifications. All Rights Reserved.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-xs leading-relaxed">
              <strong>Disclaimer</strong>
            </p>
            <div className="max-w-6xl mx-auto">
              {!disclaimerExpanded ? (
                <div className="space-y-4">
                  <p className="text-gray-400 text-xs leading-relaxed">
                    <strong>Disclaimer:</strong> The content on the website and/or Platform is for informational and educational purposes only. The user of this website and/or Platform (User) should not construe any such information as legal, investment, tax, financial or any other advice. Nothing contained herein constitutes any representation, solicitation, recommendation, promotion or advertisement on behalf of upGrad and / or its Affiliates (including but not limited to its subsidiaries, associates, employees, directors, key managerial personnel, consultants, trainers, advisors).
                  </p>
                  <button
                    onClick={() => setDisclaimerExpanded(true)}
                    className="text-[#4F46E5] text-xs font-semibold hover:text-[#4338CA] transition-colors"
                  >
                    READ MORE
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-400 text-xs leading-relaxed">
                    <strong>Disclaimer:</strong> The content on the website and/or Platform is for informational and educational purposes only. The user of this website and/or Platform (User) should not construe any such information as legal, investment, tax, financial or any other advice. Nothing contained herein constitutes any representation, solicitation, recommendation, promotion or advertisement on behalf of upGrad and / or its Affiliates (including but not limited to its subsidiaries, associates, employees, directors, key managerial personnel, consultants, trainers, advisors).
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    The User is solely responsible for evaluating the merits and risks associated with use of the information included as part of the content. The User agrees and covenants not to hold upGrad and its Affiliates responsible for any and all losses or damages arising from such decision made by them basis the information provided in the course and / or available on the website and/or platform. upGrad reserves the right to cancel or reschedule events in case of insufficient registrations, or if presenters cannot attend due to unforeseen circumstances. You are therefore advised to consult a upGrad agent prior to making any travel arrangements for a workshop. For more details, please refer to the Cancellation & Refund Policy.
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    CSM®, CSPO®, CSD®, CSP®, A-CSPO®, A-CSM® are registered trademarks of Scrum Alliance®. upGrad Education Private Limited is a Registered Education Ally (REA) of Scrum Alliance®. PMP is a registered mark of the Project Management Institute, Inc. CAPM is a registered mark of the Project Management Institute, Inc. PMI-ACP is a registered mark of the Project Management Institute, Inc. PMI-RMP is a registered mark of the Project Management Institute, Inc. PMI-PBA is a registered mark of the Project Management Institute, Inc. PgMP is a registered mark of the Project Management Institute, Inc. PfMP is a registered mark of the Project Management Institute, Inc. upGrad Education Private Limited is a Premier Authorized Training Partner (ATP) of Project Management Institute, Inc. The PMI Premier Authorized Training Partner logo is a registered mark of the Project Management Institute, Inc. PMBOK is a registered mark of the Project Management Institute, Inc. ITIL®, PRINCE2®, PRINCE2 Agile®, AgileSHIFT® are registered trademarks of AXELOS Limited, used under permission of AXELOS Limited. The Swirl logo™ is a trademark of AXELOS Limited, used under the permission of AXELOS Limited. All rights reserved. COBIT® is a registered trademark of the Information Systems Audit and Control Association® (ISACA®). (ISC)2® is a registered trademark of International Information Systems Security Certification Consortium, Inc. CompTIA Authorized Training Partner, CMMI® is registered in the U.S. Patent and Trademark Office by Carnegie Mellon University. FRM®, GARP™, and Global Association of Risk Professionals™, are trademarks owned by the Global Association of Risk Professionals, Inc. Global Association of Risk Professionals, Inc. (GARP™) does not endorse, promote, review, or warrant the accuracy of the products or services offered by upGrad Education Private Limited for FRM® related information, nor does it endorse any pass rates claimed by the provider. Further, GARP is not responsible for any fees or costs paid by the user. IIBA®, the IIBA® logo, BABOK®, and Business Analysis Body of Knowledge® are registered trademarks owned by the International Institute of Business Analysis. upGrad Education Private Limited is an Endorsed Education Provider of IIBA®. Scaled Agile Framework® and SAFe® are registered trademarks of Scaled Agile, Inc.® upGrad Education Private Limited is a Platinum SPCT Partner of Scaled Agile, Inc®. upGrad Education Private Limited is an Authorized Training Partner of CertNexus. upGrad Education Private Limited is a Microsoft Partner. upGrad Education Private Limited is an AWS Training Partner (ATP). upGrad Education Private Limited is an ICAgile Member Training Organization. upGrad Education Private Limited is a Professional Training Network member of scrum.org. upGrad Education Private Limited is an Accredited Examination Centre of IASSC. upGrad Education Private Limited is a Registered Education Partner (REP) of the DevOps Institute (DOI). upGrad Education Private Limited is an ATO of PeopleCert. upGrad Education Private Limited is an Authorized Training Partner (ATP) and Accredited Training Center (ATC) of the EC-Council. upGrad Education Private Limited is a Bronze Licensed Training Organization of Kanban University.
                  </p>
                  <button
                    onClick={() => setDisclaimerExpanded(false)}
                    className="text-[#4F46E5] text-xs font-semibold hover:text-[#4338CA] transition-colors"
                  >
                    READ LESS
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}