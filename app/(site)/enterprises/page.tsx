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
    { label: "Custom Corporate Training Plans" }
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

  return (
    <div className="min-h-screen site-section-bg">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden site-section-bg">
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
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black mb-6 leading-tight">
              <span className="site-text-primary">Custom Dedicated </span>
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
                Workshops Plans
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* Main Approach Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#8B5CF6]/5 site-light:bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 h-96 flex items-center justify-center shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="site-text-secondary font-medium">Custom Training Plans</p>
                  <p className="text-sm site-text-muted">Tailored solutions for your organization</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl lg:text-5xl font-black site-text-primary mb-6">
                Our 3-Part Approach Has One Goal: <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">Your Success</span>
              </h2>
              <p className="text-lg site-text-secondary leading-relaxed mb-8">
                Our approach includes three fundamental phases designed to align perfectly with your goals and enhance learning outcomes.
              </p>
              <a 
                href="#contact-us" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#4F46E5]/25"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Step 1: Assess */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-48 h-48 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                  <span className="text-[#10B981] text-sm font-semibold uppercase tracking-wider">Step 1</span>
                </div>
                <h2 className="text-4xl font-black site-text-primary mb-6">Assess</h2>
                <p className="text-lg site-text-secondary leading-relaxed">
                  The first step is understanding your organization's needs. Conducting a training needs assessment guides your learning journey and helps us design effective programs that maximize the impact of your training efforts. This ensures that you meet your business goals and use your resources wisely.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold site-text-primary mb-4">A good training needs assessment helps you:</h3>
                <ul className="space-y-3">
                  {[
                    "Understand Your Goals and Needs",
                    "Identify Skill Gaps", 
                    "Align Leaders and Stakeholders",
                    "Set Clear Learning Goals"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                        <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="site-text-secondary leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Deliver */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#8B5CF6]/5 site-light:bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
              <span className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider">Step 2</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black site-text-primary mb-6">Deliver</h2>
            <p className="text-lg site-text-secondary max-w-4xl mx-auto leading-relaxed">
              The second step in our approach is training delivery. Together, we craft a flexible training strategy, selecting topics, methods, and timelines tailored to your needs. During training, we provide continuous support to ensure your initiatives align with the latest industry standards, driving sustainable success.
            </p>
          </div>

          {/* Three Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Business Driven Approach",
                description: "Company leaders excel when they align their programs and initiatives with the organization's broader strategic goals. This requires a deep understanding of the business and the ability to pinpoint where learning and development can enhance the skillsets essential for executing the organization's strategy effectively.",
                gradient: "from-[#4F46E5] to-[#7C3AED]"
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: "Flexible Solutions",
                description: "Recognizing that everyone learns differently, we offer flexible learning options tailored to your needs. Whether you require single courses or comprehensive programs, our experts will design a learning plan that aligns with your business goals and accommodates each team member's learning style.",
                gradient: "from-[#10B981] to-[#059669]",
                links: [
                  { text: "Virtual Instructor-led Training", href: "/leadership-training" },
                  { text: "On-Demand Training", href: "/training-courses" }
                ]
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Immersive Experience",
                description: "Our training experiences place participants in realistic leadership scenarios, providing a risk-free environment to practice decision-making and problem-solving. Guided by expert facilitators, these highly interactive sessions combine role-playing, simulations, and group discussions to create impactful learning moments that enhance on-the-job performance.",
                gradient: "from-[#F59E0B] to-[#EF4444]"
              }
            ].map((card, index) => (
              <div key={index} className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold site-text-primary mb-4">{card.title}</h3>
                <p className="site-text-secondary leading-relaxed mb-4">{card.description}</p>
                {card.links && (
                  <ul className="space-y-2">
                    {card.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link href={link.href} className="text-[#4F46E5] hover:text-[#7C3AED] font-medium transition-colors">
                          • {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilitated Workshops Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-48 h-48 bg-[#8B5CF6]/5 site-light:bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Left Side */}
              <div className="lg:border-r lg:border-white/20 lg:pr-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold site-text-primary">Facilitated Workshops for the Whole Team</h3>
                </div>
                <p className="site-text-secondary leading-relaxed mb-6">
                  Our leadership workshops develop collective skills through a team-based approach. Leaders' strengths and experiences in this collaborative setting contribute to a learning environment that enhances the entire team.
                </p>
                <Link 
                  href="/group-training/dedicated-workshops" 
                  className="inline-flex items-center gap-2 text-[#4F46E5] hover:text-[#7C3AED] font-bold transition-colors"
                >
                  Learn More About Group Training
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Right Side */}
              <div>
                <p className="site-text-secondary leading-relaxed mb-6">
                  Through our experiential methods, teams engage in shared learning journeys that offer substantial benefits:
                </p>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Develop an aligned leadership vision",
                      description: "Leadership alignment is a driving force for team synergy. When participants learn and practice together as a unified group, they observe firsthand how their leadership affects team dynamics."
                    },
                    {
                      title: "Build a Leadership Community",
                      description: "Learning is most impactful through peer networks. Our workshops cultivate a community of leadership practice where teammates inspire, motivate, and hold each other accountable."
                    },
                    {
                      title: "Foster Mutual Understanding and Trust",
                      description: "Effective team leadership is built on trust. Our workshops create a safe environment where teams can openly exchange feedback, value different perspectives, and build stronger connections."
                    },
                    {
                      title: "Upskill Your Entire Team's Leadership",
                      description: "Our engaging workshops, aimed at developing emerging leaders or strengthening senior leadership, unlock collective leadership capabilities that can significantly influence your organization's direction."
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-bold text-[#4F46E5]">{benefit.title}</h4>
                      <p className="text-sm site-text-muted leading-relaxed">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Reinforce */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#EF4444]/5 site-light:bg-[#EF4444]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-1">
                <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <div className="w-2 h-2 bg-[#EF4444] rounded-full animate-pulse"></div>
                  <span className="text-[#EF4444] text-sm font-semibold uppercase tracking-wider">Step 3</span>
                </div>
                <h2 className="text-4xl font-black site-text-primary mb-6">Reinforce</h2>
              </div>
              <div className="lg:col-span-2">
                <p className="text-lg site-text-secondary leading-relaxed">
                  The third step in our approach is skill reinforcement. Reinforcement is a continuous effort to ensure you consistently use the skills and insights you've gained. We provide post-class support and resources to ensure your investment in training translates into noticeable and consistent improvements in performance and productivity.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Supplemental Resources",
                  items: [
                    "90 days access to course recordings",
                    "On-demand reference materials", 
                    "Embedded knowledge checks"
                  ],
                  gradient: "from-[#4F46E5] to-[#7C3AED]"
                },
                {
                  title: "Post-Class Student Surveys",
                  items: [
                    "Assess the impact of training",
                    "Pinpoint additional skills gaps",
                    "Inform future training plans"
                  ],
                  gradient: "from-[#10B981] to-[#059669]"
                },
                {
                  title: "Report & Track Performance",
                  items: [
                    "Track individual and team progress",
                    "Monitor employee engagement",
                    "Determine return on investment"
                  ],
                  gradient: "from-[#F59E0B] to-[#EF4444]"
                }
              ].map((resource, index) => (
                <div key={index} className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300">
                  <h3 className={`text-lg font-bold bg-gradient-to-r ${resource.gradient} bg-clip-text text-transparent mb-4`}>
                    {resource.title}
                  </h3>
                  <ul className="space-y-3">
                    {resource.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-4 h-4 mt-0.5">
                          <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="site-text-secondary text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Professional Coaching */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#8B5CF6]/5 site-light:bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            
            {/* Content */}
            <div>
              <h3 className="text-4xl font-black site-text-primary mb-6">
                Comprehensive Professional <span className="bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] bg-clip-text text-transparent">Coaching</span>
              </h3>
              <p className="text-lg site-text-secondary leading-relaxed">
                As a part of your training, we include reinforcement strategies to enhance the training experience. Utilizing 1:1 coaching, mentoring, and team coaching methods ensures that skills are retained and effectively applied in real-world scenarios.
              </p>
            </div>

            {/* Image Placeholder */}
            <div className="relative">
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 h-80 flex items-center justify-center shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <p className="site-text-secondary font-medium">Professional Coaching</p>
                  <p className="text-sm site-text-muted">1:1 and team coaching sessions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coaching Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* 1:1 Coaching */}
            <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
              <h4 className="text-xl font-bold text-[#4F46E5] mb-4">1:1 Coaching and Mentoring</h4>
              <p className="site-text-secondary leading-relaxed mb-6">
                When learning new skills, individualized attention from a coach or mentor in a safe space for personal growth is highly impactful. Coaches and mentors provide individuals with reinforcement that models and rewards desired behaviors, gives them a sense of purpose, and offers them meaningful feedback for improvement.
              </p>
              <p className="site-text-secondary leading-relaxed mb-4">
                Through regular one-on-one sessions, participants receive:
              </p>
              <ul className="space-y-3">
                {[
                  "Feedback on leadership opportunities and challenges",
                  "Accountability to practice new leadership behaviors",
                  "Customized advice for unique situations",
                  "Mentorship to navigate organizational dynamics"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-4 h-4 mt-0.5">
                      <svg className="w-4 h-4 text-[#4F46E5]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="site-text-secondary text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Team Coaching */}
            <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
              <h4 className="text-xl font-bold text-[#10B981] mb-4">Team Coaching</h4>
              <p className="site-text-secondary leading-relaxed mb-6">
                Coaching a team adds an extra layer of reinforcement through peer learning. This collective environment encourages teamwork, supports collaborative behavior, and ensures participant feedback. Team coaching fosters motivation within the group, promoting shared responsibility and mutual support.
              </p>
              <p className="site-text-secondary leading-relaxed mb-4">
                Our team coaching develops leadership skills in a team setting with:
              </p>
              <ul className="space-y-3">
                {[
                  "Team coaching tailored to the team's objectives",
                  "Collective learning reinforced by peer observations",
                  "Cross-training teammates to give constructive feedback",
                  "Accountability to shared team leadership goals"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-4 h-4 mt-0.5">
                      <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="site-text-secondary text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
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