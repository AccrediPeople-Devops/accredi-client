"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/app/components/site/Breadcrumb";

export default function EnterprisesPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Group Training", href: "/group-training" },
    { label: "Corporate Training" }
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Quote request submitted:', formData);
    // Handle form submission logic here
    alert('Quote request submitted successfully!');
    setFormData({ name: '', email: '', company: '', phone: '', message: '' });
  };

  const keyBenefits = [
    {
      title: "Cost-Effective Corporate Pricing",
      description: "By guaranteeing a group of participants, you unlock access to reduced per-student rates — allowing us to pass significant cost savings directly on to you."
    },
    {
      title: "Convenient & Disruption-Free Delivery",
      description: "Hosting training onsite minimizes business interruptions and provides a comfortable, familiar environment for your team to learn and grow."
    },
    {
      title: "Eliminated Travel Expenses",
      description: "Forget airfare, hotels, per diems, and travel logistics. With in-house training, your team learns where they work — saving time and reducing costs."
    },
    {
      title: "Stronger Team Collaboration",
      description: "Learning together strengthens team cohesion, fosters mutual trust, and encourages collective accountability — enhancing both morale and performance."
    },
    {
      title: "Customized Training Schedules",
      description: "You choose the timing. We work around your operational calendar to ensure training fits your company's unique workflow and availability."
    },
    {
      title: "Business-Relevant Learning",
      description: "With your team in one place, training can directly relate to your industry, challenges, and objectives — making sessions more practical and immediately applicable."
    },
    {
      title: "Aligned Leadership & Vision",
      description: "Our programs promote unified leadership thinking, helping executives and managers align strategy, execution, and communication."
    },
    {
      title: "Measurable Skill Development",
      description: "Track individual and team progress, monitor outcomes, and clearly demonstrate return on investment for every training initiative."
    }
  ];

  return (
    <div className="min-h-screen site-section-bg">
      {/* Hero Section */}
      <section className="relative  overflow-hidden site-section-bg">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-8 py-4 mb-8 hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300">
              <div className="w-3 h-3 bg-[#4F46E5] rounded-full animate-pulse"></div>
              <span className="site-text-accent font-bold text-sm uppercase tracking-wider">💼 For Business</span>
              <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse delay-500"></div>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
                Customized Corporate Training Solutions
              </span>
            </h1>

            <h2 className="text-2xl lg:text-3xl font-bold site-text-primary mb-8">
              Empower Your Workforce with Tailored Learning Experiences
            </h2>

            <p className="text-lg site-text-secondary max-w-4xl mx-auto leading-relaxed mb-12">
              At AccrediPeople Certifications, we specialize in delivering customized corporate training programs designed to meet your organization's unique needs. Our approach ensures that your team acquires the skills necessary to drive performance and achieve strategic objectives.
            </p>
          </div>
        </div>
      </section>

      {/* Three-Step Approach Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#8B5CF6]/5 site-light:bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black site-text-primary mb-6">
              Our Three-Step Approach to <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">Corporate Training Success</span>
            </h2>
          </div>

          <div className="space-y-16">
            {/* Step 1: Discover & Align */}
            <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                    <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
                    <span className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider">Step 1</span>
                  </div>
                  <h3 className="text-3xl font-black site-text-primary mb-6">Discover & Align</h3>
                  <p className="text-lg site-text-secondary leading-relaxed">
                    We begin by conducting a comprehensive training needs assessment to understand your organization's goals, identify skill gaps, and align stakeholders. This foundational step ensures that our training solutions are strategically aligned with your business objectives.
                  </p>
                </div>
                <div className="relative">
                  <div className="site-glass backdrop-blur-xl rounded-3xl p-8 h-64 flex items-center justify-center shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <p className="site-text-secondary font-medium">Assessment & Planning</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Design & Deliver */}
            <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="order-2 lg:order-1">
                  <div className="site-glass backdrop-blur-xl rounded-3xl p-8 h-64 flex items-center justify-center shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <p className="site-text-secondary font-medium">Training Delivery</p>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                    <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                    <span className="text-[#10B981] text-sm font-semibold uppercase tracking-wider">Step 2</span>
                  </div>
                  <h3 className="text-3xl font-black site-text-primary mb-6">Design & Deliver</h3>
                  <div className="space-y-4 text-lg site-text-secondary leading-relaxed">
                    <p>
                      Based on the assessment, we develop and deliver flexible training programs tailored to your team's requirements. Our delivery methods include:
                    </p>
                    <ul className="space-y-3 ml-4">
                      <li className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-[#10B981] rounded-full mt-3"></div>
                        <div>
                          <strong>Virtual Instructor-Led Training (VILT):</strong> Interactive online sessions led by experienced facilitators.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-[#10B981] rounded-full mt-3"></div>
                        <div>
                          <strong>On-Demand Training:</strong> Self-paced courses accessible anytime, allowing learners to progress at their convenience.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-[#10B981] rounded-full mt-3"></div>
                        <div>
                          <strong>Immersive Experiences:</strong> Real-world scenarios and simulations that provide hands-on practice in a risk-free environment.
                        </div>
                      </li>
                    </ul>
                    <p>
                      Our training is designed to be engaging and applicable, ensuring that participants can immediately apply new skills in their roles.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Sustain & Scale */}
            <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                    <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse"></div>
                    <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">Step 3</span>
                  </div>
                  <h3 className="text-3xl font-black site-text-primary mb-6">Sustain & Scale</h3>
                  <div className="space-y-4 text-lg site-text-secondary leading-relaxed">
                    <p>
                      Post-training, we focus on reinforcing learning to ensure long-term retention and application. This includes:
                    </p>
                    <ul className="space-y-3 ml-4">
                      <li className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-[#F59E0B] rounded-full mt-3"></div>
                        <div>
                          <strong>Post-Class Surveys:</strong> Gathering feedback to assess the impact of training and identify areas for improvement.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-[#F59E0B] rounded-full mt-3"></div>
                        <div>
                          <strong>Performance Tracking:</strong> Monitoring individual and team progress to measure the effectiveness of the training.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-[#F59E0B] rounded-full mt-3"></div>
                        <div>
                          <strong>Continuous Support:</strong> Providing ongoing resources and coaching to support the application of new skills in the workplace.
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="relative">
                  <div className="site-glass backdrop-blur-xl rounded-3xl p-8 h-64 flex items-center justify-center shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#F59E0B] to-[#EF4444] rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p className="site-text-secondary font-medium">Performance Tracking</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#8B5CF6]/5 site-light:bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black site-text-primary mb-6">
              Key Benefits for <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">Your Organization</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {keyBenefits.map((benefit, index) => (
              <div key={index} className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold site-text-primary mb-3">
                      {benefit.title}
                    </h3>
                    <p className="site-text-secondary leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-lg site-text-secondary max-w-4xl mx-auto leading-relaxed">
              Partner with AccrediPeople Certifications to develop a skilled, agile, and high-performing workforce. Contact us today to learn more about our customized corporate training solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-us" className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black site-text-primary mb-4">Request a Quote</h2>
              <p className="text-lg site-text-secondary">
                Get a customized training solution for your organization
              </p>
            </div>

            <div className="site-glass backdrop-blur-sm rounded-2xl p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold site-text-primary mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-bold site-text-primary mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-bold site-text-primary mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                      placeholder="Enter your company name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold site-text-primary mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold site-text-primary mb-2">
                    Training Requirements
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary resize-none"
                    placeholder="Tell us about your training needs and objectives..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#4F46E5]/25"
                >
                  Request Quote
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 