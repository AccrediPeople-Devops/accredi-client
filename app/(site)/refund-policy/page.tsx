"use client";
import React from "react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen site-bg-primary">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#4F46E5]/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#B39DDB]/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#10B981]/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-6 py-3 mb-6 hover:bg-white/20 transition-all duration-300">
            <div className="w-2 h-2 bg-[#EF4444] rounded-full animate-pulse"></div>
            <span className="site-text-primary text-sm font-bold uppercase tracking-wider">Legal Information</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black site-text-primary mb-4 leading-tight">
            REFUND POLICY
          </h1>
          <p className="site-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Our commitment to providing fair and transparent refund terms for all training courses.
          </p>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto">
          <div className="site-glass backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500">
            
            {/* Refund Policy Content */}
            <div className="prose prose-lg max-w-none">
              
              {/* Introduction */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold site-text-primary mb-4">Refund Policy</h2>
                <p className="site-text-secondary leading-relaxed mb-4">
                  Thank you for buying our courses. We want to make sure that our users have a rewarding experience while they are discovering information, assessing, and purchasing our training courses, whether it may be for online or classroom training courses.
                </p>
                <p className="site-text-secondary leading-relaxed">
                  As with any online purchase experience, the below are the terms and conditions that govern the Refund Policy. When you buy a training course on the AccrediPeople Certifications website you agree to our Privacy Policy, Terms of Use, and the points below.
                </p>
              </div>

              {/* Classroom Training */}
              <div className="mb-8 p-6 site-glass rounded-2xl site-border border">
                <h3 className="text-xl font-bold site-text-primary mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#4F46E5] rounded-full"></div>
                  Cancellation & Refunds: Classroom Training
                </h3>
                <div className="space-y-4">
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#EF4444] mt-1 font-bold">•</span>
                    AccrediPeople Certifications, reserves the right to postpone/cancel an event, or change the location of an event because of insufficient enrolments, instructor illness or force-majeure events (like floods, earthquakes, political instability, etc.)
                  </p>
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#10B981] mt-1 font-bold">•</span>
                    In case AccrediPeople Certifications cancels an event, 100% refund will be paid to the delegate.
                  </p>
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#F59E0B] mt-1 font-bold">•</span>
                    If a cancellation is done by a delegate 7 days (or more) prior to the event, 10% of the total paid fee will be deducted and the remaining amount will be refunded to the delegate.
                  </p>
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#EF4444] mt-1 font-bold">•</span>
                    If a cancellation is done by a delegate within 7 days (or less) of the event, no refunds will be made.
                  </p>
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#8B5CF6] mt-1 font-bold">•</span>
                    Money back guarantee is void if the participant has accessed more than 25% content of an e-learning course or has attended Classroom's training for more than 1 day.
                  </p>
                </div>
              </div>

              {/* Online Training */}
              <div className="mb-8 p-6 site-glass rounded-2xl site-border border">
                <h3 className="text-xl font-bold site-text-primary mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  Cancellation & Refunds: Online Training
                </h3>
                <div className="space-y-4">
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#10B981] mt-1 font-bold">•</span>
                    If the cancellation is done by the delegate within 48 hours of subscribing, 5% will be deducted as administration fee.
                  </p>
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#EF4444] mt-1 font-bold">•</span>
                    If the cancellation is done by the delegate after 48 hours of subscribing no refund will be made.
                  </p>
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#EF4444] mt-1 font-bold">•</span>
                    No refund will be made to the delegate after 48 hours of subscribing to the course.
                  </p>
                  <p className="site-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-[#8B5CF6] mt-1 font-bold">•</span>
                    Money back guarantee is void if the participant has accessed more than 25% content of an e-learning course or has attended Online Classrooms/received recordings for more than 1 day.
                  </p>
                </div>
              </div>

              {/* Important Notice */}
              <div className="p-6 bg-gradient-to-r from-[#EF4444]/10 to-[#F59E0B]/10 rounded-2xl border border-[#EF4444]/20">
                <h3 className="text-xl font-bold site-text-primary mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#EF4444] rounded-full"></div>
                  Important Notice
                </h3>
                <p className="site-text-secondary leading-relaxed">
                  Please read our refund policy carefully before purchasing any course. By proceeding with your purchase, you acknowledge that you have read, understood, and agree to these terms and conditions.
                </p>
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