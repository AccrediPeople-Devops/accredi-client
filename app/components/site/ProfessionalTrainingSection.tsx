"use client";
import React from "react";
import { 
  MdFolder, 
  MdCalendarToday, 
  MdPublic, 
  MdDeviceHub 
} from "react-icons/md";

export default function ProfessionalTrainingSection() {
  const features = [
    {
      icon: MdFolder,
      title: "Largest global course portfolio",
      description: "You won't find better value in the marketplace. If you do find a lower price, we will beat it."
    },
    {
      icon: MdCalendarToday,
      title: "Best choice of dates for classroom courses",
      description: "A variety of delivery methods are available depending on your learning preference."
    },
    {
      icon: MdPublic,
      title: "Most venues globally",
      description: "We have locations stretching the entire globe, allowing flexible training wherever you need it."
    },
    {
      icon: MdDeviceHub,
      title: "Multichannel delivery",
      description: "We're the only provider to have classroom, online instructor-led, online self-paced and in-house training methods globally."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Side - Professional Training */}
          <div className="lg:col-span-8">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                <span className="text-gray-900">Professional training, </span><span className="text-[#4F46E5]">the way it should be done.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#E0E7FF] rounded-lg">
                  <IconComponent className="w-6 h-6 text-[#4F46E5]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3 text-lg">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side - Our New Normal */}
          <div className="lg:col-span-4">
            <div 
              className="bg-gradient-to-br from-[#4F46E5] to-[#3730A3] rounded-lg p-8 text-white flex flex-col justify-between"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(79, 70, 229, 0.9), rgba(55, 48, 163, 0.9)), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: 'fit-content'
              }}
            >
              <div>
                <h3 className="text-2xl font-bold mb-6">Our new normal</h3>
                
                <p className="text-white/90 mb-6 leading-relaxed">
                  Over the course of the current health crisis we've adapted the way we work to allow our 
                  clients to continue getting the same great quality training, whilst in a safe environment. 
                  All of our courses are available as online instructor-led, you get the feel of a classroom 
                  course but from the comfort of your own home.
                </p>

                <div className="text-[#B39DDB] bg-white/10 p-4 rounded-lg mb-6">
                  <p className="font-bold text-base">
                    We're currently offering up to 25% off all Online Instructor-led courses. Don't miss out!
                  </p>
                </div>
              </div>

              <div>
                <button className="bg-[#B39DDB] hover:bg-[#9C88C4] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full">
                  Enquire now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 