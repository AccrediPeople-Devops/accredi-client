"use client";
import React from "react";
import Link from "next/link";
import Breadcrumb from "@/app/components/site/Breadcrumb";

export default function PaymentSuccessPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Payment", href: "/pricing" },
    { label: "Success" },
  ];

  return (
    <div className="min-h-screen site-section-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl "></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl  "></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl  "></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 max-w-lg w-full">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#10B981]/25 animate-bounce">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-black site-text-primary mb-4">
                Payment Successful!
              </h1>
            </div>

            {/* Success Message */}
            <div className="mb-8 p-6 bg-gradient-to-br from-[#10B981]/10 to-[#059669]/5 rounded-2xl border border-[#10B981]/20">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-[#10B981] mb-3">
                  🎉 Welcome to AccrediPeople Certifications!
                </h3>
                <p className="site-text-secondary text-sm">
                  Your order is confirmed and you’ll receive your onboarding
                  instructions shortly.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link
                href="/"
                className="flex-1 px-6 py-4 site-glass backdrop-blur-sm rounded-2xl site-border border site-text-primary hover:bg-white/10 site-light:hover:bg-white/20 transition-all duration-300 font-semibold text-center"
              >
                Back to Home
              </Link>
            </div>

            {/* Support Link */}
            <div className="text-center">
              <p className="text-sm site-text-muted mb-2">
                Need help getting started with your premium features?
              </p>
              <Link
                href="/contact"
                className="text-sm text-[#4F46E5] hover:text-[#4338CA] transition-colors font-medium"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
