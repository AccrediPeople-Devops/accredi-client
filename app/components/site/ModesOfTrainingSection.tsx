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
    <div className="bg-gradient-to-br from-gray-50 to-white">
      {/* Live Virtual Classes Section */}
      <section className="pt-8 md:pt-16 pb-8 md:pb-16">
        <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="col-span-12 md:col-span-7 lg:col-span-6" data-aos="fade-right">
              {/* Heading */}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                <strong>
                  Live Virtual <br />
                  <span className="text-[#4F46E5]">Classes with Industry Experts.</span>
                </strong>
              </h2>

              {/* Text */}
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Gain Real-World Insights from Leaders with 20+ Years' Experience. Get hands-on insights and career advice from trainers who've been there, done that.
              </p>
            </div>
            
            <div className="col-span-12 md:col-span-5 lg:col-span-6" data-aos="fade-left">
              <div className="relative">
                <Image
                  src="https://goldstandardcertifications.com/assets/img/attend-live.png"
                  alt="Live Virtual Classes with Industry Experts"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-2xl shadow-lg"
                  loading="lazy"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Paced Learning Section */}
      <section className="pt-8 md:pt-16 pb-8 md:pb-16">
        <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="col-span-12 md:col-span-7 lg:col-span-6" data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                <strong>
                  Learn at Your Own Speed. <br />
                  <span className="text-[#4F46E5]">Our ready-made courses fit your timeline</span>
                </strong>
              </h2>

              {/* Text */}
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Whether you speed through or take it slow. Fast or Flexible: Our Courses Match Your Learning Pace and Career Goals.
              </p>
            </div>
            
            <div className="col-span-12 md:col-span-5 lg:col-span-6">
              <div className="relative">
                <Image
                  src="https://goldstandardcertifications.com/assets/Jump right in with ready-made courses.jpeg"
                  alt="Self-Paced Ready-Made Courses"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-2xl shadow-lg"
                  loading="lazy"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Training Modes Grid Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <strong>Expert training</strong> in a classroom, online or from home!
            </h2>
          </div>

          {/* Training Modes Grid */}
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex min-h-[600px]">
                {trainingModes.map((mode, index) => (
                  <div 
                    key={mode.id} 
                    className={`cursor-pointer group ${
                      activeTab === mode.id 
                        ? 'flex-[2]' 
                        : 'flex-1'
                    } ${index > 0 ? 'border-l border-gray-200' : ''}`}
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
                        <div className="absolute inset-0 bg-black bg-opacity-50 transition-all duration-300"></div>
                        <div className="absolute inset-0 bg-[#3730A3] bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300"></div>
                        
                        {/* Popular Badge */}
                        {mode.popular && (
                          <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded">
                            POPULAR
                          </div>
                        )}

                        {/* Content */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white text-lg font-bold mb-2 whitespace-pre-line">
                            {mode.title}
                          </h3>
                          <div className="flex justify-end">
                            {activeTab === mode.id ? (
                              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Content - Only shows when expanded */}
                      {activeTab === mode.id && (
                        <div className="bg-white p-6 flex-1 min-h-[600px] flex flex-col justify-center animate-slide-in-right">
                          <div className="space-y-4">
                            {mode.features.map((feature, index) => {
                              const IconComponent = feature.icon;
                              return (
                                <div key={index} className="flex items-start gap-3">
                                                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[#E0E7FF] rounded-lg">
                  <IconComponent className="w-4 h-4 text-[#4F46E5]" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                                      {feature.title}
                                    </h4>
                                    <p className="text-gray-600 text-xs leading-relaxed">
                                      {feature.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                            
                            {mode.link && (
                              <div className="pt-3 border-t border-gray-200">
                                <a 
                                  href={mode.link.url}
                                  className="inline-flex items-center gap-2 text-[#4F46E5] font-semibold text-sm hover:text-[#4338CA] transition-colors duration-300"
                                >
                                  {mode.link.text}
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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