"use client";

import React, { useState } from "react";
import Breadcrumb from "@/app/components/site/Breadcrumb";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    course: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeContact, setActiveContact] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        company: '',
        course: '',
        message: ''
      });
    }, 3000);
  };

  const breadcrumbItems = [
    { label: "Contact" }
  ];

  const contactMethods = [
    {
      title: "Email Support",
      description: "Get detailed answers to all your questions",
      value: "support@accredi.com",
      href: "mailto:support@accredi.com",
      icon: "📧",
      gradient: "from-[#4F46E5] to-[#7C3AED]",
      stats: "24h Response"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our training advisors",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
      icon: "📞",
      gradient: "from-[#10B981] to-[#059669]",
      stats: "Live Support"
    },
    {
      title: "Live Chat",
      description: "Real-time assistance for immediate help",
      value: "Chat Now",
      href: "#",
      icon: "💬",
      gradient: "from-[#F59E0B] to-[#D97706]",
      stats: "Instant Help"
    },
    {
      title: "Global Office",
      description: "Visit our headquarters for in-person consultation",
      value: "2389 Mountain Green Road, NY 10001",
      href: "#",
      icon: "📍",
      gradient: "from-[#EF4444] to-[#DC2626]",
      stats: "9AM - 6PM EST"
    }
  ];

  const courses = [
    "Project Management (PMP)",
    "Agile & Scrum",
    "Data Science & Analytics",
    "Cloud Computing (AWS/Azure)",
    "Cybersecurity",
    "Digital Marketing",
    "IT Service Management",
    "Business Analysis",
    "Quality Management",
    "Other"
  ];

  return (
    <div className="min-h-screen site-section-bg">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden site-section-bg">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
              <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse"></div>
              <span className="site-text-accent font-bold text-sm uppercase tracking-wider">Get In Touch</span>
              <div className="w-3 h-3 bg-[#4F46E5] rounded-full animate-pulse delay-500"></div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="site-text-primary">Ready to </span>
              <span className="bg-gradient-to-r from-[#4F46E5] via-[#10B981] to-[#F59E0B] bg-clip-text text-transparent">
                Transform
              </span>
              <span className="block site-text-primary">Your Career?</span>
            </h1>

            <p className="text-xl site-text-secondary max-w-4xl mx-auto leading-relaxed mb-12">
              Connect with our expert training advisors to find the perfect certification path for your goals. 
              We're here to guide you every step of the way to professional success.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">⚡</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-[#F59E0B] to-[#EF4444] bg-clip-text text-transparent mb-2">24/7</div>
                  <div className="text-sm site-text-muted font-medium">Support Available</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🚀</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent mb-2">&lt;30min</div>
                  <div className="text-sm site-text-muted font-medium">Response Time</div>
                </div>
              </div>

              <div className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🎯</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent mb-2">98%</div>
                  <div className="text-sm site-text-muted font-medium">Satisfaction Rate</div>
                </div>
              </div>

              <div className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🌍</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] bg-clip-text text-transparent mb-2">100+</div>
                  <div className="text-sm site-text-muted font-medium">Countries Served</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
              <span className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider">Multiple Ways to Connect</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6">
              <strong>Choose Your Preferred Method</strong>
            </h2>
            <p className="site-text-secondary text-lg max-w-3xl mx-auto">
              We offer multiple convenient ways to get in touch. Select the method that works best for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <div 
                key={index} 
                className={`site-glass backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 cursor-pointer group ${
                  activeContact === index ? 'ring-2 ring-[#4F46E5] scale-105' : 'hover:scale-105'
                }`}
                onClick={() => setActiveContact(index)}
              >
                <div className="text-center">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{method.icon}</div>
                  <h3 className={`text-xl font-black mb-4 bg-gradient-to-r ${method.gradient} bg-clip-text text-transparent`}>
                    {method.title}
                  </h3>
                  <p className="site-text-secondary text-sm leading-relaxed mb-4">{method.description}</p>
                  <a href={method.href} className="site-text-primary font-semibold hover:underline block mb-4">
                    {method.value}
                  </a>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${method.gradient} text-white text-xs font-bold`}>
                    <span>{method.stats}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-48 h-48 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-2">
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 h-full">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                    <span className="text-[#10B981] text-sm font-bold">📞 CONTACT INFO</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-black mb-6 leading-tight site-text-primary">
                    Let's Start Your
                    <span className="block bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent">
                      Success Journey
                    </span>
                  </h3>
                  <p className="site-text-secondary text-lg leading-relaxed mb-8">
                    Our expert advisors are ready to help you choose the right certification path 
                    and answer all your questions about our training programs.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold site-text-primary mb-1">Email Support</h4>
                      <a href="mailto:support@accredi.com" className="text-[#4F46E5] hover:underline text-lg">
                        support@accredi.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold site-text-primary mb-1">Phone Support</h4>
                      <a href="tel:+15551234567" className="text-[#10B981] hover:underline text-lg">
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold site-text-primary mb-1">Global Headquarters</h4>
                      <p className="site-text-secondary">2389 Mountain Green Road</p>
                      <p className="site-text-secondary">New York, NY 10001</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t site-border">
                  <div className="text-center">
                    <h5 className="font-bold site-text-primary mb-2">Business Hours</h5>
                    <p className="site-text-secondary text-sm">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                    <p className="site-text-secondary text-sm">Saturday: 10:00 AM - 4:00 PM EST</p>
                    <p className="site-text-secondary text-sm">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                    <span className="text-[#4F46E5] text-sm font-bold">📝 GET STARTED</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-black mb-4 leading-tight site-text-primary">
                    Send Us a Message
                  </h3>
                  <p className="site-text-secondary text-lg">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                {submitted ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold site-text-primary mb-4">Message Sent Successfully!</h4>
                    <p className="site-text-secondary">Thank you for contacting us. We'll get back to you within 24 hours.</p>
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
                          className="w-full px-4 py-4 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary placeholder-opacity-60"
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
                          className="w-full px-4 py-4 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary placeholder-opacity-60"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold site-text-primary mb-2">Company/Organization</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary placeholder-opacity-60"
                          placeholder="Company name (optional)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold site-text-primary mb-2">Course of Interest</label>
                        <select
                          name="course"
                          value={formData.course}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                        >
                          <option value="">Select a course</option>
                          {courses.map((course, index) => (
                            <option key={index} value={course}>{course}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold site-text-primary mb-2">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-4 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary placeholder-opacity-60 resize-none"
                        placeholder="Tell us about your certification goals and any specific questions you have..."
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#4F46E5]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-3">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending Message...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <span>Send Message</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </div>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 lg:h-[500px] relative overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1635959652972!5d0"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 site-light:grayscale-0 grayscale"
        ></iframe>
        
        {/* Map Overlay */}
        <div className="absolute top-8 left-8 site-glass backdrop-blur-xl rounded-3xl shadow-2xl p-6 max-w-sm hover:bg-white/20 site-light:hover:bg-white/80 transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-black site-text-primary">Our Location</h3>
          </div>
          <p className="site-text-secondary font-medium mb-1">2389 Mountain Green Road</p>
          <p className="site-text-secondary font-medium mb-3">New York, NY 10001</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
            <span className="text-[#10B981] font-bold text-sm">Open Now</span>
          </div>
        </div>

        {/* Quick Contact Button */}
        <div className="absolute bottom-8 right-8">
          <button className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300 hover:shadow-2xl hover:shadow-[#10B981]/25">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
} 