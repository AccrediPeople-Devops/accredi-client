"use client";
import React, { useState } from "react";
import Breadcrumb from "@/app/components/site/Breadcrumb";

export default function MilVetDiscountPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    serviceStatus: '',
    branch: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        message: '',
        serviceStatus: '',
        branch: ''
      });
    }, 3000);
  };

  const breadcrumbItems = [
    { label: "Military/Veteran Discount" }
  ];

  const benefits = [
    {
      icon: "🎖️",
      title: "Military Discount",
      description: "Up to 50% off all certification programs",
      gradient: "from-[#059669] to-[#047857]"
    },
    {
      icon: "🛡️",
      title: "Career Transition Support",
      description: "Dedicated guidance for civilian career transition",
      gradient: "from-[#4F46E5] to-[#7C3AED]"
    },
    {
      icon: "🎓",
      title: "Priority Enrollment",
      description: "Fast-track access to high-demand courses",
      gradient: "from-[#F59E0B] to-[#EF4444]"
    },
    {
      icon: "🤝",
      title: "Veteran Community",
      description: "Connect with fellow veterans in tech careers",
      gradient: "from-[#8B5CF6] to-[#6D28D9]"
    }
  ];

  const eligibility = [
    {
      title: "Active Duty Military",
      description: "All branches of active military service",
      icon: "🪖"
    },
    {
      title: "Veterans",
      description: "Honorably discharged veterans with DD214",
      icon: "🎖️"
    },
    {
      title: "Military Spouses",
      description: "Spouses of active duty and veteran service members",
      icon: "💙"
    },
    {
      title: "Military Dependents",
      description: "Children of active duty and veteran service members",
      icon: "👨‍👩‍👧‍👦"
    }
  ];

  const popularCourses = [
    {
      title: "Project Management Professional (PMP)",
      description: "Transition leadership skills to civilian project management",
      discount: "50%",
      color: "from-[#059669] to-[#047857]"
    },
    {
      title: "Cybersecurity Fundamentals",
      description: "Apply military security experience to IT security",
      discount: "45%",
      color: "from-[#4F46E5] to-[#7C3AED]"
    },
    {
      title: "Cloud Computing Certification",
      description: "High-demand skills for technology careers",
      discount: "40%",
      color: "from-[#F59E0B] to-[#EF4444]"
    }
  ];

  return (
    <div className="min-h-screen site-section-bg">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden site-section-bg">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#059669]/5 site-light:bg-[#059669]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Main Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-8 py-4 mb-8 hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300">
              <div className="w-3 h-3 bg-[#059669] rounded-full animate-pulse"></div>
              <span className="site-text-accent font-bold text-sm uppercase tracking-wider">Military & Veterans</span>
              <div className="w-3 h-3 bg-[#4F46E5] rounded-full animate-pulse delay-500"></div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="site-text-primary">Honoring Service, </span>
              <span className="bg-gradient-to-r from-[#059669] via-[#4F46E5] to-[#F59E0B] bg-clip-text text-transparent">
                Advancing Careers
              </span>
            </h1>

            <p className="text-xl site-text-secondary max-w-4xl mx-auto leading-relaxed mb-12">
              We honor the service and sacrifice of our military personnel and veterans. 
              Your dedication deserves our recognition and support as you transition to civilian careers.
            </p>

            {/* Discount Highlight */}
            <div className="site-glass backdrop-blur-xl rounded-3xl p-8 max-w-4xl mx-auto mb-12 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="text-6xl">🇺🇸</div>
                  <div className="text-left">
                    <h3 className="text-2xl font-black bg-gradient-to-r from-[#059669] to-[#047857] bg-clip-text text-transparent mb-2">
                      Thank You For Your Service
                    </h3>
                    <p className="site-text-secondary">Exclusive discounts for military personnel and veterans</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black bg-gradient-to-r from-[#F59E0B] to-[#EF4444] bg-clip-text text-transparent">
                    UP TO 50% OFF
                  </div>
                  <div className="text-sm site-text-muted font-medium mt-1">All Certification Programs</div>
                </div>
              </div>
            </div>

            {/* Program Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🎖️</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-[#059669] to-[#047857] bg-clip-text text-transparent mb-2">2K+</div>
                  <div className="text-sm site-text-muted font-medium">Veterans Trained</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">💼</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent mb-2">95%</div>
                  <div className="text-sm site-text-muted font-medium">Job Placement</div>
                </div>
              </div>

              <div className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">⭐</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-[#F59E0B] to-[#EF4444] bg-clip-text text-transparent mb-2">4.9</div>
                  <div className="text-sm site-text-muted font-medium">Rating</div>
                </div>
              </div>

              <div className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🛡️</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] bg-clip-text text-transparent mb-2">24/7</div>
                  <div className="text-sm site-text-muted font-medium">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#059669]/5 site-light:bg-[#059669]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#059669] rounded-full animate-pulse"></div>
              <span className="text-[#059669] text-sm font-semibold uppercase tracking-wider">Benefits</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6">
              <strong>Exclusive Military Benefits</strong>
            </h2>
            <p className="site-text-secondary text-lg max-w-3xl mx-auto">
              Comprehensive support designed specifically for military personnel and veterans transitioning to civilian careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group">
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{benefit.icon}</div>
                  <h3 className={`text-xl font-black mb-3 bg-gradient-to-r ${benefit.gradient} bg-clip-text text-transparent`}>
                    {benefit.title}
                  </h3>
                  <p className="site-text-secondary text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-48 h-48 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#059669]/5 site-light:bg-[#059669]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
              <span className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider">Eligibility</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6">
              <strong>Who Qualifies</strong>
            </h2>
            <p className="site-text-secondary text-lg max-w-3xl mx-auto">
              We extend our gratitude and support to all members of the military community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {eligibility.map((item, index) => (
              <div key={index} className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group text-center">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-xl font-black site-text-primary mb-4">
                  {item.title}
                </h3>
                <p className="site-text-secondary leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#8B5CF6]/5 site-light:bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#059669]/5 site-light:bg-[#059669]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-pulse"></div>
              <span className="text-[#8B5CF6] text-sm font-semibold uppercase tracking-wider">Popular Programs</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6">
              <strong>Top Military Career Transitions</strong>
            </h2>
            <p className="site-text-secondary text-lg max-w-3xl mx-auto">
              Courses specifically chosen for their relevance to military-to-civilian career transitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularCourses.map((course, index) => (
              <div key={index} className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group">
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${course.color} text-white font-bold text-lg mb-4`}>
                    {course.discount} OFF
                  </div>
                  <h3 className="text-xl font-black site-text-primary mb-4">
                    {course.title}
                  </h3>
                  <p className="site-text-secondary leading-relaxed">
                    {course.description}
                  </p>
                </div>
                <button className={`w-full bg-gradient-to-r ${course.color} hover:shadow-lg text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105`}>
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#059669]/5 site-light:bg-[#059669]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-[#059669] rounded-full animate-pulse"></div>
                <span className="text-[#059669] text-sm font-semibold uppercase tracking-wider">Apply Today</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6 leading-tight">
                Ready to <br />
                <span className="bg-gradient-to-r from-[#059669] to-[#4F46E5] bg-clip-text text-transparent">
                  Start Your Journey?
                </span>
              </h2>

              <div className="site-text-secondary text-lg leading-relaxed space-y-4 mb-8">
                <p>
                  Transform your military experience into civilian career success. Our specialized programs are designed for service members ready to make the transition.
                </p>
                
                <p>
                  We understand the unique challenges of military-to-civilian career transitions and provide the support you need to succeed in your next chapter.
                </p>
                
                <p>
                  Contact us today to learn about your eligibility and discover how we can help you achieve your career goals.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-4 py-2">
                  <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium site-text-primary">GI Bill Accepted</span>
                </div>
                <div className="flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-4 py-2">
                  <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium site-text-primary">Veteran Support</span>
                </div>
                <div className="flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-4 py-2">
                  <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium site-text-primary">Career Guidance</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#059669] to-[#047857] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold site-text-primary mb-4">Application Received!</h4>
                  <p className="site-text-secondary">Thank you for your service. We'll contact you within 24 hours with discount information.</p>
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
                        className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all duration-300 site-text-primary"
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
                        className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all duration-300 site-text-primary"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold site-text-primary mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all duration-300 site-text-primary"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold site-text-primary mb-2">Service Status *</label>
                      <select
                        name="serviceStatus"
                        value={formData.serviceStatus}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all duration-300 site-text-primary"
                        required
                      >
                        <option value="">Select status</option>
                        <option value="active">Active Duty</option>
                        <option value="veteran">Veteran</option>
                        <option value="spouse">Military Spouse</option>
                        <option value="dependent">Military Dependent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold site-text-primary mb-2">Military Branch</label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all duration-300 site-text-primary"
                    >
                      <option value="">Select branch (optional)</option>
                      <option value="army">Army</option>
                      <option value="navy">Navy</option>
                      <option value="airforce">Air Force</option>
                      <option value="marines">Marines</option>
                      <option value="coastguard">Coast Guard</option>
                      <option value="spaceforce">Space Force</option>
                      <option value="national-guard">National Guard</option>
                      <option value="reserves">Reserves</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold site-text-primary mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all duration-300 site-text-primary resize-none"
                      placeholder="Tell us about your career goals and training interests..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065F46] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#059669]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing Application...
                      </div>
                    ) : (
                      "Apply for Military Discount"
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