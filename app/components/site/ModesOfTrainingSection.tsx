"use client";
import Image from "next/image";
import React from "react";

export default function ModesOfTrainingSection() {
  return (
    <div className="site-section-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#4F46E5]/10 site-light:bg-[#4F46E5]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#10B981]/10 site-light:bg-[#10B981]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B39DDB]/5 site-light:bg-[#B39DDB]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Section Header */}
      <section className="pt-16 md:pt-24 pb-8 md:pb-16 relative z-10">
        <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <div className="w-2 h-2 bg-emerald-400 site-light:bg-emerald-600 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 site-light:text-emerald-600 text-sm font-bold uppercase tracking-wider">Mode of Delivering the training</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-black mb-6 leading-tight site-text-primary">
            Your Learning, Your Way: <br />
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#B39DDB] to-[#10B981] bg-clip-text text-transparent">
              Instructor-Led, Self-Paced, & Classroom
            </span>
          </h2>
          
          <p className="text-lg site-text-secondary max-w-4xl mx-auto leading-relaxed mb-12">
            At AccrediPeopleCertifications, we believe that learning should fit your goals, your schedule, and your lifestyle. That's why we offer flexible training modes, each designed to give you the best experience—no matter how you choose to learn.
          </p>
        </div>
      </section>

      {/* Instructor-Led Live Virtual Classes Section */}
      <section className="pt-8 md:pt-16 pb-8 md:pb-16 relative z-10">
        <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="col-span-12 md:col-span-7 lg:col-span-6" data-aos="fade-right">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-4xl">🎓</span>
                <span className="text-indigo-400 site-light:text-indigo-600 text-sm font-semibold uppercase tracking-wider">Instructor-Led Live Virtual</span>
              </div>

              {/* Heading */}
              <h3 className="text-4xl md:text-5xl font-black site-text-primary mb-6 leading-tight">
                <strong>
                  Live Virtual Classes <br />
                  <span className="bg-gradient-to-r from-[#4F46E5] to-[#B39DDB] bg-clip-text text-transparent">with Industry Experts</span>
                </strong>
              </h3>

              {/* Text */}
              <p className="site-text-secondary text-lg mb-4 leading-relaxed">
                Join scheduled online sessions led by expert instructors in real time. Interact, ask questions, participate in discussions, and collaborate with peers—all from the comfort of your home or office.
              </p>
              <p className="text-indigo-400 site-light:text-indigo-600 font-semibold text-sm mb-8">
                Ideal for professionals who value structure, guidance, and live interaction.
              </p>
            </div>
            
            <div className="col-span-12 md:col-span-5 lg:col-span-6" data-aos="fade-left">
              <div className="relative">
                <div className="site-glass backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
                  <Image
                    src="https://goldstandardcertifications.com/assets/img/attend-live.png"
                    alt="Instructor-Led Live Virtual Classes"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-2xl"
                    loading="lazy"
                    unoptimized
                  />
                  {/* Floating Stats */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl p-4 text-white shadow-xl">
                    <div className="text-2xl font-bold">Live</div>
                    <div className="text-xs">Interactive</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classroom Training Section */}
      <section className="pt-8 md:pt-16 pb-8 md:pb-16 relative z-10">
        <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="col-span-12 md:col-span-5 lg:col-span-6 order-2 md:order-1">
              <div className="relative">
                <div className="site-glass backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Classroom Training"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-2xl"
                    loading="lazy"
                    unoptimized
                  />
                  {/* Floating Stats */}
                  <div className="absolute -top-4 -left-4 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl p-4 text-white shadow-xl">
                    <div className="text-2xl font-bold">Face</div>
                    <div className="text-xs">to Face</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-7 lg:col-span-6 order-1 md:order-2" data-aos="fade-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-4xl">🏫</span>
                <span className="text-emerald-400 site-light:text-emerald-600 text-sm font-semibold uppercase tracking-wider">Classroom Training</span>
              </div>

              <h3 className="text-4xl md:text-5xl font-black site-text-primary mb-6 leading-tight">
                <strong>
                  Traditional Learning <br />
                  <span className="bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent">in Premium Venues</span>
                </strong>
              </h3>

              {/* Text */}
              <p className="site-text-secondary text-lg mb-4 leading-relaxed">
                Prefer learning face-to-face? Attend in-person training sessions at select locations, led by certified trainers with hands-on experience. Engage deeply with content, network with peers, and experience focused, distraction-free learning.
              </p>
              <p className="text-emerald-400 site-light:text-emerald-600 font-semibold text-sm mb-8">
                Perfect for those who thrive in traditional, immersive learning environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Paced Online Learning Section */}
      <section className="pt-8 md:pt-16 pb-8 md:pb-16 relative z-10">
        <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="col-span-12 md:col-span-7 lg:col-span-6" data-aos="fade-right">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-4xl">💻</span>
                <span className="text-amber-400 site-light:text-amber-600 text-sm font-semibold uppercase tracking-wider">Self-Paced Online</span>
              </div>

              {/* Heading */}
              <h3 className="text-4xl md:text-5xl font-black site-text-primary mb-6 leading-tight">
                <strong>
                  Learn at Your Own Speed <br />
                  <span className="bg-gradient-to-r from-[#F59E0B] to-[#EF4444] bg-clip-text text-transparent">24/7 Flexible Access</span>
                </strong>
              </h3>

              {/* Text */}
              <p className="site-text-secondary text-lg mb-4 leading-relaxed">
                Learn on your own terms with 24/7 access to high-quality video lessons, downloadable resources, and practice materials. Progress at your own pace, revisit modules anytime, and balance learning with your personal and professional commitments.
              </p>
              <p className="text-amber-400 site-light:text-amber-600 font-semibold text-sm mb-8">
                Best suited for independent learners who want flexibility and control.
              </p>
            </div>
            
            <div className="col-span-12 md:col-span-5 lg:col-span-6" data-aos="fade-left">
              <div className="relative">
                <div className="site-glass backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
                  <Image
                    src="https://goldstandardcertifications.com/assets/Jump right in with ready-made courses.jpeg"
                    alt="Self-Paced Online Learning"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-2xl"
                    loading="lazy"
                    unoptimized
                  />
                  {/* Floating Stats */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl p-4 text-white shadow-xl">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-xs">Access</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onsite Corporate Training Section */}
      <section className="pt-8 md:pt-16 pb-8 md:pb-16 relative z-10">
        <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="col-span-12 md:col-span-5 lg:col-span-6 order-2 md:order-1">
              <div className="relative">
                <div className="site-glass backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Onsite Corporate Training"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-2xl"
                    loading="lazy"
                    unoptimized
                  />
                  {/* Floating Stats */}
                  <div className="absolute -top-4 -left-4 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl p-4 text-white shadow-xl">
                    <div className="text-2xl font-bold">Your</div>
                    <div className="text-xs">Location</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-7 lg:col-span-6 order-1 md:order-2" data-aos="fade-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-4xl">🧳</span>
                <span className="text-violet-400 site-light:text-violet-600 text-sm font-semibold uppercase tracking-wider">Onsite Corporate</span>
              </div>

              <h3 className="text-4xl md:text-5xl font-black site-text-primary mb-6 leading-tight">
                <strong>
                  Customized Learning <br />
                  <span className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] bg-clip-text text-transparent">at Your Workplace</span>
                </strong>
              </h3>

              {/* Text */}
              <p className="site-text-secondary text-lg mb-4 leading-relaxed">
                Bring expert-led training directly to your team with onsite sessions tailored to your organization's goals. Certified instructors deliver interactive, industry-relevant content at your location—minimizing downtime and maximizing impact.
              </p>
              <p className="text-violet-400 site-light:text-violet-600 font-semibold text-sm mb-8">
                Great for: Teams seeking customized, collaborative learning without leaving the office.
              </p>
            </div>
          </div>
        </div>
      </section>
                            
      {/* Bottom CTA Section */}
      <section className="pt-8 md:pt-16 pb-16 md:pb-24 relative z-10">
        <div className="px-5 md:px-16 w-full 2xl:max-w-7xl mx-auto text-center">
          {/* Main CTA */}
          <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-2xl font-black site-text-primary">No matter your learning style, we've got you covered.</span>
            </div>
            <p className="text-lg site-text-secondary">
              Choose the mode that fits you best—or combine them for a blended learning experience that empowers you to succeed, your way.
            </p>
          </div>

          {/* Professional Excellence Badge */}
          <div className="inline-flex items-center gap-3 site-glass backdrop-blur-sm rounded-full px-8 py-4">
            <span className="text-2xl">🌟</span>
            <span className="text-xl font-black bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
              What Sets Us Apart - Professional Excellence
            </span>
          </div>
        </div>
      </section>
    </div>
  );
} 