"use client";
import React, { useState } from "react";
import Breadcrumb from "@/app/components/site/Breadcrumb";

export default function MilitaryDiscountPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form after success
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    }, 3000);
  };

  const breadcrumbItems = [
    { label: "Military Discount" }
  ];

  return (
    <div className="min-h-screen site-section-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden site-section-bg">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#7C3AED]/5 site-light:bg-[#7C3AED]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Main Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-8 py-4 mb-8 hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300">
              <div className="w-3 h-3 bg-[#7C3AED] rounded-full animate-pulse"></div>
              <span className="site-text-accent font-bold text-sm uppercase tracking-wider">🇺🇸 Military Discount</span>
              <div className="w-3 h-3 bg-[#F59E0B] rounded-full animate-pulse delay-500"></div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="site-text-primary">Claim Your </span>
              <span className="bg-gradient-to-r from-[#7C3AED] via-[#F59E0B] to-[#10B981] bg-clip-text text-transparent">
                50% Military Discount
              </span>
              <span className="site-text-primary"> Today!</span>
            </h1>

            <h2 className="text-2xl md:text-3xl font-bold site-text-primary mb-8">
              Honoring Your Service with Exclusive Savings
            </h2>

            <div className="max-w-4xl mx-auto space-y-6 text-xl site-text-secondary leading-relaxed mb-12">
              <p>
                At AccrediPeople Certifications, we proudly stand with our military members and veterans. We understand that transitioning to a civilian career can be challenging — and we're here to help make that journey smoother.
              </p>
              
              <p>
                Project management is a natural fit for many veterans, thanks to the leadership, organization, and problem-solving skills honed during military service. That's why we're committed to supporting you with the certifications you need to succeed in this field.
              </p>
              
              <p>
                As a token of our gratitude, we offer an exclusive 50% discount on all our courses for active military personnel and veterans. It's our way of saying thank you for your service.
              </p>

              <p className="text-2xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">
                Start your next chapter with confidence — and savings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Centered Contact Form Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#7C3AED]/5 site-light:bg-[#7C3AED]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-pulse"></div>
              <span className="text-[#7C3AED] text-sm font-semibold uppercase tracking-wider">🎖️ Get Started</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6 leading-tight">
              Ready to Claim Your <br />
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">
                Military Discount?
              </span>
            </h2>

            <div className="site-text-secondary text-lg leading-relaxed space-y-4 mb-8 max-w-3xl mx-auto">
              <p>
                Thank you for your service! Take advantage of our exclusive 50% military discount and advance your project management career with industry-recognized certifications.
              </p>
              
              <p>
                Fill out the form below and we'll get back to you within 24 hours with your discount code and course enrollment information.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-4 py-2">
                <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium site-text-primary">50% Discount</span>
              </div>
              <div className="flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-4 py-2">
                <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium site-text-primary">All Courses</span>
              </div>
              <div className="flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-4 py-2">
                <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium site-text-primary">Active Military & Veterans</span>
              </div>
            </div>
          </div>

          {/* Centered Form */}
          <div className="max-w-2xl mx-auto">
            <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold site-text-primary mb-4">Request Submitted Successfully!</h4>
                  <p className="site-text-secondary">We'll get back to you within 24 hours with your military discount code and enrollment information.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold site-text-primary mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all duration-300 site-text-primary"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold site-text-primary mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all duration-300 site-text-primary"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold site-text-primary mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all duration-300 site-text-primary"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold site-text-primary mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all duration-300 site-text-primary resize-none"
                      placeholder="Tell us about your military service and which course you're interested in..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#7C3AED]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting Request...
                      </div>
                    ) : (
                      "🎖️ Claim My Military Discount"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 