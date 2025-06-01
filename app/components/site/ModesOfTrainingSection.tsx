"use client";
import Image from "next/image";
import React, { useState } from "react";
import { 
  MdLiveTv, 
  MdHeadset, 
  MdFlightTakeoff, 
  MdSchool,
  MdSupport,
  MdCalendarToday,
  MdBarChart,
  MdDevices,
  MdPeople,
  MdLocationCity,
  MdGroup,
  MdAttachMoney,
  MdBuild,
  MdAccountBalance,
  MdDiversity3
} from "react-icons/md";

export default function ModesOfTrainingSection() {
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const toggleTab = (tabIndex: number) => {
    setActiveTab(activeTab === tabIndex ? null : tabIndex);
  };

  const trainingModes = [
    {
      id: 1,
      title: "Online\nInstructor-led",
      popular: true,
      backgroundImage: "https://goldstandardcertifications.com/assets/img/attend-live.png",
      features: [
        {
          icon: MdLiveTv,
          title: "Live classes",
          description: "Join a scheduled class with a live instructor and other delegates"
        },
        {
          icon: MdHeadset,
          title: "Fully interactive",
          description: "Ask questions, share documents, interact with whiteboards, ask live questions and communicate with your trainer and peers."
        },
        {
          icon: MdFlightTakeoff,
          title: "No travel or accommodation costs",
          description: "An affordable way to boost your career."
        },
        {
          icon: MdSchool,
          title: "Access the best pool of trainers, wherever you are",
          description: "We use the same pool of expert trainers for our Online Instructor-led courses, so no need to leave where you live or work."
        }
      ]
    },
    {
      id: 2,
      title: "Online\nSelf-paced",
      popular: true,
      backgroundImage: "https://goldstandardcertifications.com/assets/Jump right in with ready-made courses.jpeg",
      features: [
        {
          icon: MdSupport,
          title: "Tutor support 24/7",
          description: "Our expert trainers are on hand to help you with any questions which may arise."
        },
        {
          icon: MdCalendarToday,
          title: "Immediate access for 90 days",
          description: "All of our courses come with a standard 90 days access which can be upgraded if need be."
        },
        {
          icon: MdBarChart,
          title: "Personal performance reports",
          description: "Keep track of your own progression throughout your course and ensure continuous improvement."
        },
        {
          icon: MdDevices,
          title: "Compatible on all devices",
          description: "Whether you're on the move or at home, our courses are available to you."
        }
      ]
    },
    {
      id: 3,
      title: "Classroom",
      popular: false,
      backgroundImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      features: [
        {
          icon: MdPeople,
          title: "Highly experienced trainers",
          description: "All of our trainers are highly qualified, having 10+ years of real-world experience."
        },
        {
          icon: MdLocationCity,
          title: "State of the art training venues",
          description: "We use the highest quality learning facilities to make sure your experience is as comfortable as possible."
        },
        {
          icon: MdGroup,
          title: "Small class sizes",
          description: "We limit our class sizes to promote better discussion and ensure everyone has a personalized experience in a safe environment."
        },
        {
          icon: MdAttachMoney,
          title: "Great value for money",
          description: "Get more bang for your buck! If you find your chosen course cheaper elsewhere, we'll match it!"
        }
      ]
    },
    {
      id: 4,
      title: "Onsite",
      popular: false,
      backgroundImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      features: [
        {
          icon: MdBuild,
          title: "Tailored learning experience",
          description: "Our courses can be adapted to meet your individual project or business requirements regardless of scope."
        },
        {
          icon: MdAccountBalance,
          title: "Maximise your training budget",
          description: "Cut unnecessary costs and focus your entire budget on what really matters, the training."
        },
        {
          icon: MdDiversity3,
          title: "Team building opportunity",
          description: "This gives your team a great opportunity to come together, bond, and discuss, which may be limited in a standard classroom setting."
        }
      ],
      link: {
        text: "Learn more about Onsite training",
        url: "/onsite-training"
      }
    }
  ];

  return (
    <div className="site-section-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#4F46E5]/10 site-light:bg-[#4F46E5]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#10B981]/10 site-light:bg-[#10B981]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B39DDB]/5 site-light:bg-[#B39DDB]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Live Virtual Classes Section */}
      <section className="pt-16 md:pt-24 pb-8 md:pb-16 relative z-10">
        <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="col-span-12 md:col-span-7 lg:col-span-6" data-aos="fade-right">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                <span className="text-[#10B981] text-sm font-semibold uppercase tracking-wider">Live Training</span>
              </div>

              {/* Heading */}
              <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6 leading-tight">
                <strong>
                  Live Virtual <br />
                  <span className="bg-gradient-to-r from-[#4F46E5] to-[#B39DDB] bg-clip-text text-transparent">Classes with Industry Experts.</span>
                </strong>
              </h2>

              {/* Text */}
              <p className="site-text-secondary text-lg mb-8 leading-relaxed">
                Gain Real-World Insights from Leaders with 20+ Years' Experience. Get hands-on insights and career advice from trainers who've been there, done that.
              </p>

              {/* CTA Button */}
              <button className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#10B981]/25">
                Join Live Classes
              </button>
            </div>
            
            <div className="col-span-12 md:col-span-5 lg:col-span-6" data-aos="fade-left">
              <div className="relative">
                <div className="site-glass backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
                  <Image
                    src="https://goldstandardcertifications.com/assets/img/attend-live.png"
                    alt="Live Virtual Classes with Industry Experts"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-2xl"
                    loading="lazy"
                    unoptimized
                  />
                  {/* Floating Stats */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl p-4 text-white shadow-xl">
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-xs">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Paced Learning Section */}
      <section className="pt-8 md:pt-16 pb-8 md:pb-16 relative z-10">
        <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="col-span-12 md:col-span-5 lg:col-span-6 order-2 md:order-1">
              <div className="relative">
                <div className="site-glass backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
                  <Image
                    src="https://goldstandardcertifications.com/assets/Jump right in with ready-made courses.jpeg"
                    alt="Self-Paced Ready-Made Courses"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-2xl"
                    loading="lazy"
                    unoptimized
                  />
                  {/* Floating Stats */}
                  <div className="absolute -top-4 -left-4 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl p-4 text-white shadow-xl">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-xs">Access</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-7 lg:col-span-6 order-1 md:order-2" data-aos="fade-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse"></div>
                <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">Self-Paced</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6 leading-tight">
                <strong>
                  Learn at Your Own Speed. <br />
                  <span className="bg-gradient-to-r from-[#F59E0B] to-[#EF4444] bg-clip-text text-transparent">Our ready-made courses fit your timeline</span>
                </strong>
              </h2>

              {/* Text */}
              <p className="site-text-secondary text-lg mb-8 leading-relaxed">
                Whether you speed through or take it slow. Fast or Flexible: Our Courses Match Your Learning Pace and Career Goals.
              </p>

              {/* CTA Button */}
              <button className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#F59E0B]/25">
                Start Learning Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Training Modes Grid Section */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
              <span className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider">Training Options</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6">
              <strong>Expert training</strong> 
              <span className="block bg-gradient-to-r from-[#4F46E5] via-[#B39DDB] to-[#10B981] bg-clip-text text-transparent">
                in a classroom, online or from home!
              </span>
            </h2>
          </div>

          {/* Training Modes Grid */}
          <div className="w-full">
            <div className="site-glass backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex min-h-[600px]">
                {trainingModes.map((mode, index) => (
                  <div 
                    key={mode.id} 
                    className={`cursor-pointer group ${
                      activeTab === mode.id 
                        ? 'flex-[2]' 
                        : 'flex-1'
                    } ${index > 0 ? 'border-l border-white/20 site-light:border-slate-200' : ''}`}
                    onClick={() => toggleTab(mode.id)}
                  >
                    <div className="flex h-full">
                      {/* Card Image */}
                      <div 
                        className={`relative ${activeTab === mode.id ? 'w-64' : 'w-full'} h-full min-h-[600px] flex-shrink-0`}
                        style={{
                          backgroundImage: `url(${mode.backgroundImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F23]/60 via-[#1A1A3E]/60 to-[#2D1B69]/60 site-light:from-slate-900/40 site-light:via-slate-800/40 site-light:to-slate-700/40 transition-all duration-300"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/0 to-[#7C3AED]/0 group-hover:from-[#4F46E5]/30 group-hover:to-[#7C3AED]/30 transition-all duration-300"></div>
                        
                        {/* Popular Badge */}
                        {mode.popular && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            POPULAR
                          </div>
                        )}

                        {/* Content */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white text-xl font-bold mb-4 whitespace-pre-line">
                            {mode.title}
                          </h3>
                          <div className="flex justify-end">
                            {activeTab === mode.id ? (
                              <div className="w-10 h-10 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30 site-light:border-slate-300 group-hover:bg-white/30 site-light:group-hover:bg-white/40 transition-all duration-300">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Content - Only shows when expanded */}
                      {activeTab === mode.id && (
                        <div className="site-glass backdrop-blur-sm p-8 flex-1 min-h-[600px] flex flex-col justify-center animate-slide-in-right site-border border-l">
                          <div className="space-y-6">
                            {mode.features.map((feature, index) => {
                              const IconComponent = feature.icon;
                              return (
                                <div key={index} className="flex items-start gap-4">
                                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 site-light:from-[#4F46E5]/30 site-light:to-[#7C3AED]/30 rounded-2xl border border-[#4F46E5]/30 site-light:border-[#4F46E5]/50">
                                    <IconComponent className="w-6 h-6 text-[#4F46E5]" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold site-text-primary mb-2 text-base">
                                      {feature.title}
                                    </h4>
                                    <p className="site-text-secondary text-sm leading-relaxed">
                                      {feature.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                            
                            {mode.link && (
                              <div className="pt-6 site-border border-t">
                                <a 
                                  href={mode.link.url}
                                  className="inline-flex items-center gap-2 text-[#4F46E5] font-bold text-base hover:text-white site-light:hover:text-[#4F46E5] transition-colors duration-300 site-glass backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-white/20 site-light:hover:bg-white/60"
                                >
                                  {mode.link.text}
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes slide-in-right {
              from {
                opacity: 0;
                transform: translateX(20px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            .animate-slide-in-right {
              animation: slide-in-right 0.3s ease-out;
            }
          `}</style>
        </div>
      </section>
    </div>
  );
} 