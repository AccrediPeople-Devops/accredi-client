"
use client";
import React from "react";

export default function ReschedulingPolicyPage() {
  return (
    <div className="min-h-screen site-bg-primary">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#4F46E5]/10 rounded-full blur-2xl "></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#B39DDB]/10 rounded-full blur-2xl  "></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#10B981]/10 rounded-full blur-2xl  "></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-6 py-3 mb-6 hover:bg-white/20 transition-all duration-300">
            <div className="w-2 h-2 bg-[#F59E0B] rounded-full "></div>
            <span className="site-text-primary text-sm font-bold uppercase tracking-wider">Legal Information</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black site-text-primary mb-4 leading-tight">
            RESCHEDULING POLICY
          </h1>
          <p className="site-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Flexible rescheduling options to accommodate your training needs and schedule changes.
          </p>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto">
          <div className="site-glass backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500">
            
            {/* Rescheduling Policy Content */}
            <div className="prose prose-lg max-w-none">
              
              {/* Company Rescheduling */}
              <div className="mb-8 p-6 site-glass rounded-2xl site-border border">
                <h3 className="text-xl font-bold site-text-primary mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#4F46E5] rounded-full"></div>
                  When AccrediPeople Certifications Reschedules
                </h3>
                <p className="site-text-secondary leading-relaxed mb-4">
                  In case AccrediPeople Certifications reschedules the training event, the options available to the delegate are:
                </p>
                <div className="space-y-4">
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#10B981] mt-1 font-bold">•</span>
                    100% refund will be made, if the rescheduled dates do not fit into the delegate's schedule.
                  </p>
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#4F46E5] mt-1 font-bold">•</span>
                    The delegate would have the privilege of rescheduling and attending a class in future at his/her convenience, at any location, on any date of scheduled training.
                  </p>
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#F59E0B] mt-1 font-bold">•</span>
                    The delegate, if wishes to, can send his/her replacement. However, this should be intimated to AccrediPeople Certifications at least 3 days ahead of the event date.
                  </p>
                </div>
              </div>

              {/* Delegate Rescheduling */}
              <div className="mb-8 p-6 site-glass rounded-2xl site-border border">
                <h3 className="text-xl font-bold site-text-primary mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#EF4444] rounded-full"></div>
                  When Delegate Requests Rescheduling
                </h3>
                <p className="site-text-secondary leading-relaxed mb-4">
                  Whereas, if for some unforeseen reasons, a delegate wishes to reschedule his/her registration to a future date, a rescheduling fee is charged as mentioned below:
                </p>
                <div className="space-y-4">
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#F59E0B] mt-1 font-bold">•</span>
                    If the request of rescheduling is received ahead of 7days or more, 10% of registration fee will be charged.
                  </p>
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#8B5CF6] mt-1 font-bold">•</span>
                    Please note that rescheduling will be subject to availability of seats.
                  </p>
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#EF4444] mt-1 font-bold">•</span>
                    If the request of rescheduling is received within 7 days or less, no refund will be made to the delegate.
                  </p>
                </div>
              </div>

              {/* Quick Reference */}
              <div className="p-6 bg-gradient-to-r from-[#4F46E5]/10 to-[#10B981]/10 rounded-2xl border border-[#4F46E5]/20">
                <h3 className="text-xl font-bold site-text-primary mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  Quick Reference
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold site-text-primary text-sm">Company Reschedules:</h4>
                    <p className="site-text-secondary text-sm">✅ 100% refund option</p>
                    <p className="site-text-secondary text-sm">✅ Free future rescheduling</p>
                    <p className="site-text-secondary text-sm">✅ Replacement allowed (3 days notice)</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold site-text-primary text-sm">Delegate Reschedules:</h4>
                    <p className="site-text-secondary text-sm">⚠️ 7+ days: 10% fee</p>
                    <p className="site-text-secondary text-sm">⚠️ Subject to seat availability</p>
                    <p className="site-text-secondary text-sm">❌ &lt;7 days: No refund</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-12">
          <a 
            href="/"
            className="group/cta relative overflow-hidden bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#4F46E5]/25 inline-flex items-center gap-3"
          >
            <svg className="w-5 h-5 group-hover/cta:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="relative z-10">Back to Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300"></div>
          </a>
        </div>
      </div>
    </div>
  );
} 