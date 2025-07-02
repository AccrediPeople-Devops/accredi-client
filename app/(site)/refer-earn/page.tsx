"use client";
import React, { useState } from "react";
import Breadcrumb from "@/app/components/site/Breadcrumb";
import { referEarnService, ReferEarnFormData } from "@/app/components/service/referEarn.service";

export default function ReferEarnPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
    
    // Clear status messages when user modifies form
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors([]);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Sanitize and prepare form data
      const sanitizedData = referEarnService.sanitizeFormData(formData);
      
      // Validate form data
      const validation = referEarnService.validateFormData(sanitizedData);
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setSubmitStatus({
          type: 'error',
          message: 'Please correct the errors below and try again.'
        });
        return;
      }

      // Submit form data
      const response = await referEarnService.submitReferEarnForm(sanitizedData);

      if (response.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Message Sent Successfully!'
        });
        
        // Reset form on successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        
        // Scroll to success message
        setTimeout(() => {
          const element = document.getElementById('form-status');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      } else {
        setSubmitStatus({
          type: 'error',
          message: response.message
        });
      }
    } catch (error) {
      console.error('Unexpected error during form submission:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbItems = [
    { label: "Refer & Earn" }
  ];

  const steps = [
    {
      step: "01",
      title: "Share Your Link",
      description: "Get your unique referral link and share it with friends"
    },
    {
      step: "02", 
      title: "Friend Enrolls",
      description: "Your friend signs up and enrolls in any certification program"
    },
    {
      step: "03",
      title: "Earn Free Course",
      description: "Receive a free course within 30 working days of their enrollment"
    }
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
              <span className="site-text-accent font-bold text-sm uppercase tracking-wider">Refer & Earn Program</span>
              <div className="w-3 h-3 bg-[#F59E0B] rounded-full animate-pulse delay-500"></div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="site-text-primary">Refer & Earn a </span>
              <span className="bg-gradient-to-r from-[#7C3AED] via-[#F59E0B] to-[#10B981] bg-clip-text text-transparent">
                Free Course!
              </span>
            </h1>

            <h2 className="text-2xl md:text-3xl font-bold site-text-primary mb-8">
              Invite Your Friends. Reward Yourself.
            </h2>

            <div className="max-w-4xl mx-auto space-y-6 text-xl site-text-secondary leading-relaxed mb-12">
              <p>
                Love learning with us? Spread the word! When you refer a friend who enrolls in one of our courses, 
                you'll receive a free course as a thank-you — delivered within 30 working days of their successful enrollment.
              </p>
              
              <p>
                It's our way of saying thanks for growing our learning community.
              </p>
              
              <p className="text-2xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">
                Start referring and unlock your rewards today!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-48 h-48 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#7C3AED]/5 site-light:bg-[#7C3AED]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
              <span className="text-[#10B981] text-sm font-semibold uppercase tracking-wider">Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6">
              <strong>How It Works</strong>
            </h2>
            <p className="site-text-secondary text-lg max-w-3xl mx-auto">
              Getting started is simple! Follow these three easy steps to start earning your free courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] rounded-full text-white font-black text-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.step}
                </div>
                <h3 className="text-xl font-black site-text-primary mb-4">
                  {step.title}
                </h3>
                <p className="site-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#7C3AED]/5 site-light:bg-[#7C3AED]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-pulse"></div>
                <span className="text-[#7C3AED] text-sm font-semibold uppercase tracking-wider">Get Started</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6 leading-tight">
                Ready to Start <br />
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">
                  Referring Friends?
                </span>
              </h2>

              <div className="site-text-secondary text-lg leading-relaxed space-y-4 mb-8">
                <p>
                  Join our referral program and help your friends and colleagues advance their careers while earning free courses for yourself.
                </p>
                
                <p>
                  When you refer someone to AccrediPeople Certifications and they successfully enroll, you'll receive a free course within 30 working days. Both you and your referral benefit from world-class training.
                </p>
                
                <p>
                  Contact us today to get your unique referral link and start earning free courses.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-4 py-2">
                  <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium site-text-primary">Free Courses</span>
                </div>
                <div className="flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-4 py-2">
                  <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium site-text-primary">30 Day Delivery</span>
                </div>
                <div className="flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-4 py-2">
                  <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium site-text-primary">No Limits</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
              
              {/* Status Messages */}
              <div id="form-status">
                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div className="mb-6 p-6 bg-gradient-to-r from-[#EF4444]/20 to-[#DC2626]/20 border border-[#EF4444]/30 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#EF4444] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#EF4444] text-lg mb-2">Please correct the following errors:</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {validationErrors.map((error, index) => (
                            <li key={index} className="text-sm site-text-secondary">{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {submitStatus.type === 'error' && (
                  <div className="mb-6 p-6 bg-gradient-to-r from-[#EF4444]/20 to-[#DC2626]/20 border border-[#EF4444]/30 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#EF4444] rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#EF4444] text-lg">Submission Failed</h3>
                        <p className="site-text-secondary">{submitStatus.message}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {submitStatus.type === 'success' ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold site-text-primary mb-4">{submitStatus.message}</h4>
                  <p className="site-text-secondary">We'll get back to you within 24 hours with your referral information.</p>
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
                      placeholder="Tell us about your referral goals..."
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
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending Message...
                      </div>
                    ) : (
                      "Get Started Now"
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