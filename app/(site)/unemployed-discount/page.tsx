"use client";
import React, { useState } from "react";
import Breadcrumb from "@/app/components/site/Breadcrumb";

export default function UnemployedDiscountPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    situation: '',
    previousRole: ''
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
        situation: '',
        previousRole: ''
      });
    }, 3000);
  };

  const breadcrumbItems = [
    { label: "Unemployed Discount" }
  ];

  const supportFeatures = [
    {
      icon: "🎯",
      title: "Skill Enhancement",
      description: "Upgrade your skills with industry-relevant certifications",
      gradient: "from-[#4F46E5] to-[#7C3AED]"
    },
    {
      icon: "💼",
      title: "Career Placement",
      description: "Access to job placement assistance and career guidance",
      gradient: "from-[#10B981] to-[#059669]"
    },
    {
      icon: "🤝",
      title: "Flexible Learning",
      description: "Self-paced online learning that fits your schedule",
      gradient: "from-[#F59E0B] to-[#EF4444]"
    },
    {
      icon: "🏆",
      title: "Industry Recognition",
      description: "Gain globally recognized certifications valued by employers",
      gradient: "from-[#8B5CF6] to-[#6D28D9]"
    }
  ];

  const successStories = [
    {
      name: "Sarah M.",
      role: "Project Manager",
      story: "After 8 months unemployed, I completed PMP certification and landed my dream job within 3 weeks!",
      achievement: "150% Salary Increase",
      icon: "👩‍💼"
    },
    {
      name: "David K.",
      role: "Data Analyst",
      story: "The Data Science program helped me transition from retail to tech. Now working at a Fortune 500 company.",
      achievement: "Career Transition",
      icon: "👨‍💻"
    },
    {
      name: "Maria L.",
      role: "Cloud Architect",
      story: "Cloud certification opened doors I never imagined. From unemployed to senior architect in 6 months.",
      achievement: "Fast-Track Success",
      icon: "👩‍🔬"
    }
  ];

  const discountTiers = [
    {
      title: "Essential Support",
      description: "For those recently unemployed",
      discount: "30%",
      features: ["All certification courses", "Basic career support", "Community access"],
      color: "from-[#4F46E5] to-[#7C3AED]"
    },
    {
      title: "Extended Support",
      description: "For long-term unemployment (6+ months)",
      discount: "50%",
      features: ["All certification courses", "Career coaching", "Job placement assistance", "Resume review"],
      color: "from-[#10B981] to-[#059669]",
      popular: true
    },
    {
      title: "Critical Support",
      description: "For those facing financial hardship",
      discount: "70%",
      features: ["All certification courses", "Full career support", "Mentorship program", "Interview preparation", "LinkedIn optimization"],
      color: "from-[#F59E0B] to-[#EF4444]"
    }
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
              <div className="w-3 h-3 bg-[#4F46E5] rounded-full animate-pulse"></div>
              <span className="site-text-accent font-bold text-sm uppercase tracking-wider">Career Recovery Program</span>
              <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse delay-500"></div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="site-text-primary">Rebuild Your Career, </span>
              <span className="bg-gradient-to-r from-[#4F46E5] via-[#10B981] to-[#F59E0B] bg-clip-text text-transparent">
                Reclaim Your Future
              </span>
            </h1>

            <p className="text-xl site-text-secondary max-w-4xl mx-auto leading-relaxed mb-12">
              We're here to help you through difficult times. Upskilling is now essential for career recovery. 
              Get back on track with our supportive training programs designed for your success.
            </p>

            {/* Support Message */}
            <div className="site-glass backdrop-blur-xl rounded-3xl p-8 max-w-4xl mx-auto mb-12 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="text-6xl">💪</div>
                  <div className="text-left">
                    <h3 className="text-2xl font-black bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent mb-2">
                      You're Not Alone
                    </h3>
                    <p className="site-text-secondary">We believe in your potential and are committed to your success</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black bg-gradient-to-r from-[#F59E0B] to-[#EF4444] bg-clip-text text-transparent">
                    UP TO 70% OFF
                  </div>
                  <div className="text-sm site-text-muted font-medium mt-1">Career Recovery Support</div>
                </div>
              </div>
            </div>

            {/* Recovery Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🎯</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent mb-2">1.5K+</div>
                  <div className="text-sm site-text-muted font-medium">People Helped</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">💼</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent mb-2">89%</div>
                  <div className="text-sm site-text-muted font-medium">Job Success Rate</div>
                </div>
              </div>

              <div className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">⚡</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-[#F59E0B] to-[#EF4444] bg-clip-text text-transparent mb-2">12wks</div>
                  <div className="text-sm site-text-muted font-medium">Avg. Time to Job</div>
                </div>
              </div>

              <div className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">📈</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] bg-clip-text text-transparent mb-2">140%</div>
                  <div className="text-sm site-text-muted font-medium">Avg. Salary Increase</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Features Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
              <span className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider">Support</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6">
              <strong>Comprehensive Career Support</strong>
            </h2>
            <p className="site-text-secondary text-lg max-w-3xl mx-auto">
              More than just training - we provide complete support to help you get back on your feet and advance your career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportFeatures.map((feature, index) => (
              <div key={index} className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group">
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className={`text-xl font-black mb-3 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.title}
                  </h3>
                  <p className="site-text-secondary text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discount Tiers Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-48 h-48 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
              <span className="text-[#10B981] text-sm font-semibold uppercase tracking-wider">Discounts</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6">
              <strong>Tailored Support Levels</strong>
            </h2>
            <p className="site-text-secondary text-lg max-w-3xl mx-auto">
              We understand that everyone's situation is different. Choose the support level that matches your current needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {discountTiers.map((tier, index) => (
              <div key={index} className={`site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group ${tier.popular ? 'ring-2 ring-[#10B981] relative' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-6 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${tier.color} text-white font-bold text-2xl mb-4`}>
                    {tier.discount} OFF
                  </div>
                  <h3 className="text-2xl font-black site-text-primary mb-2">
                    {tier.title}
                  </h3>
                  <p className="site-text-secondary mb-6">
                    {tier.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center justify-center gap-2 text-sm site-text-secondary">
                        <svg className="w-4 h-4 text-[#10B981] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full bg-gradient-to-r ${tier.color} hover:shadow-lg text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105`}>
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#8B5CF6]/5 site-light:bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-pulse"></div>
              <span className="text-[#8B5CF6] text-sm font-semibold uppercase tracking-wider">Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6">
              <strong>Real People, Real Success</strong>
            </h2>
            <p className="site-text-secondary text-lg max-w-3xl mx-auto">
              See how others have transformed their careers after unemployment. Your success story could be next.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{story.icon}</div>
                  <h3 className="text-xl font-black site-text-primary mb-2">
                    {story.name}
                  </h3>
                  <p className="text-[#4F46E5] font-bold mb-4">
                    {story.role}
                  </p>
                  <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-full text-sm font-bold mb-4">
                    {story.achievement}
                  </div>
                </div>
                <blockquote className="site-text-secondary text-sm leading-relaxed italic">
                  "{story.story}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
                <span className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider">Get Support</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6 leading-tight">
                Ready to <br />
                <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
                  Restart Your Career?
                </span>
              </h2>

              <div className="site-text-secondary text-lg leading-relaxed space-y-4 mb-8">
                <p>
                  Take the first step toward your career recovery. Our comprehensive support program is designed to help you bounce back stronger than ever.
                </p>
                
                <p>
                  We understand the challenges of unemployment and have helped thousands of professionals successfully transition back into rewarding careers.
                </p>
                
                <p>
                  Contact us today to discuss your situation and discover how we can support your journey back to employment.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-4 py-2">
                  <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium site-text-primary">Confidential Support</span>
                </div>
                <div className="flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-4 py-2">
                  <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium site-text-primary">No Judgment</span>
                </div>
                <div className="flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-4 py-2">
                  <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium site-text-primary">24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold site-text-primary mb-4">Application Received!</h4>
                  <p className="site-text-secondary">We understand your situation and will reach out within 24 hours with support options.</p>
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
                        className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
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
                        className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
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
                        className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold site-text-primary mb-2">Current Situation *</label>
                      <select
                        name="situation"
                        value={formData.situation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                        required
                      >
                        <option value="">Select your situation</option>
                        <option value="recently-unemployed">Recently Unemployed (&lt;3 months)</option>
                        <option value="long-term">Long-term Unemployed (6+ months)</option>
                        <option value="furloughed">Furloughed</option>
                        <option value="laid-off">Laid Off</option>
                        <option value="career-change">Seeking Career Change</option>
                        <option value="financial-hardship">Facing Financial Hardship</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold site-text-primary mb-2">Previous Role/Industry</label>
                    <input
                      type="text"
                      name="previousRole"
                      value={formData.previousRole}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                      placeholder="e.g., Marketing Manager, IT Support, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold site-text-primary mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary resize-none"
                      placeholder="Tell us about your situation and career goals..."
                      required
                    />
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
                        Processing Application...
                      </div>
                    ) : (
                      "Request Career Support"
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