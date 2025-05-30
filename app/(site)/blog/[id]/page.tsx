"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Breadcrumb from "@/app/components/site/Breadcrumb";

export default function BlogDetailsPage({ params }: { params: { id: string } }) {
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    review: ''
  });

  const breadcrumbItems = [
    { label: "Blog", href: "/blog" },
    { label: "Blog Details" }
  ];

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Review submitted:', { ...formData, rating });
  };

  const socialLinks = [
    { name: "Facebook", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "LinkedIn", href: "#" },
    { name: "Twitter", href: "#" }
  ];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb Section */}
      <div className="bg-white py-4">
        <div className="lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Page Header Section - Same as Blog List but with "Blog Details" */}
      <section className="relative bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#B39DDB] py-20 lg:py-32 overflow-hidden">
        {/* Background Shape */}
        <div 
          className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-20"
          style={{
            backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 1000\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/></pattern></defs><rect width=\"100%\" height=\"100%\" fill=\"url(%23grain)\"/></svg>')"
          }}
        ></div>

        {/* Decorative Background Shapes */}
        <div className="absolute top-20 left-10 w-24 h-24 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-pink-300 to-purple-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute top-40 right-20 w-16 h-16 opacity-25">
          <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-orange-400 rounded-lg transform rotate-45 animate-bounce"></div>
        </div>
        <div className="absolute bottom-32 left-20 w-20 h-20 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-blue-300 to-indigo-400 rounded-xl transform -rotate-12 animate-pulse"></div>
        </div>
        <div className="absolute bottom-20 right-32 w-12 h-12 opacity-35">
          <div className="w-full h-full bg-gradient-to-br from-green-300 to-teal-400 rounded-full animate-bounce"></div>
        </div>

        {/* Social Media Links - Left Side */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm rounded-r-2xl py-8 px-4 hidden lg:block">
          <div className="flex flex-col items-center space-y-3">
            {socialLinks.map((social, index) => (
              <React.Fragment key={social.name}>
                <Link
                  href={social.href}
                  className="text-white hover:text-yellow-300 text-xs font-medium transition-colors duration-300 transform hover:scale-110"
                >
                  {social.name}
                </Link>
                {index < socialLinks.length - 1 && (
                  <span className="text-white/60 text-xs">//</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="relative lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          <div className="text-center relative">
            {/* Student Image with Floating Animation - Positioned on Right */}
            <div className="absolute top-0 right-0 lg:right-20 hidden lg:block">
              <div className="relative">
                {/* Main Student Image with Floating Animation */}
                <div className="relative z-10 animate-float">
                  <Image
                    src="/images/blog/blog-hero.png"
                    alt="Student with books"
                    width={400}
                    height={500}
                    className="w-80 h-96 object-contain filter drop-shadow-2xl"
                    unoptimized
                  />
                </div>

                {/* Floating Decorative Shapes around Student */}
                <div className="absolute -top-4 -left-8 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg transform rotate-12 animate-bounce opacity-80"></div>
                <div className="absolute top-16 -right-6 w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-pulse opacity-80"></div>
                <div className="absolute -bottom-8 -left-12 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl transform -rotate-6 animate-bounce opacity-80" style={{ animationDelay: '0.5s' }}></div>
                
                {/* Additional floating elements */}
                <div className="absolute top-32 -left-6 w-4 h-4 bg-white/40 rounded-full animate-ping"></div>
                <div className="absolute bottom-40 right-0 w-5 h-5 bg-white/50 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                
                {/* Book/Study Icons floating around */}
                <div className="absolute top-8 left-16 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center animate-bounce text-white text-xs font-bold" style={{ animationDelay: '0.7s' }}>
                  📚
                </div>
                <div className="absolute bottom-16 left-8 w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse text-white text-xs" style={{ animationDelay: '1.2s' }}>
                  💡
                </div>
              </div>
            </div>

            {/* Main Content - Centered */}
            <div className="relative z-20 pt-12 lg:pt-24">
              {/* Main Title */}
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-tight">
                Blog Details
              </h1>
              
              <p className="text-white/90 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
                Dive deep into professional development insights and certification training strategies.
              </p>
            </div>

            {/* Mobile Student Image */}
            <div className="lg:hidden mt-12 flex justify-center">
              <div className="relative">
                <div className="animate-float">
                  <Image
                    src="/images/blog/blog-hero.png"
                    alt="Student with books"
                    width={300}
                    height={350}
                    className="w-64 h-80 object-contain filter drop-shadow-2xl"
                    unoptimized
                  />
                </div>
                {/* Mobile decorative elements */}
                <div className="absolute -top-4 -left-4 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg animate-bounce opacity-80"></div>
                <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-pulse opacity-80"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
          <div className="absolute bottom-1/4 left-2/3 w-2 h-2 bg-white/50 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </section>

      {/* Blog Details Content */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-8">
              {/* Blog Image */}
              <div className="mb-8">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="The Future of Professional Development"
                  width={800}
                  height={400}
                  className="w-full h-64 lg:h-96 object-cover rounded-2xl"
                  unoptimized
                />
              </div>

              {/* Blog Content */}
              <div className="space-y-8">
                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  The Future of Professional Development: Why Accredi Certification Training is Here to Stay
                </h1>

                {/* Author and Meta Info */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                      alt="Jordan Walk"
                      width={60}
                      height={60}
                      className="w-15 h-15 rounded-full object-cover"
                      unoptimized
                    />
                    <div>
                      <p className="text-sm text-gray-600">Published By</p>
                      <h4 className="text-lg font-bold text-gray-900">Jordan Walk</h4>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Nov 02, 2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-[#4F46E5] font-medium">Professional Development</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>(165 Comments)</span>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    The professional development landscape has undergone a radical transformation in recent years, and certification training is no exception. At Accredi, we've witnessed firsthand how the demand for flexible, accessible, and high-quality certification programs has skyrocketed. What began as an alternative to traditional classroom-based certification has now solidified into an essential component of modern professional development.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Flexibility and Accessibility in Certification Training</h2>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">
                    One of the most significant advantages of Accredi's certification programs is the flexibility they offer. Professionals are no longer bound by geographic location or rigid schedules. Our online certification courses allow learners to access materials at their own pace and fit study time into their busy lives.
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed mb-8">
                    With Accredi's platform, professional development is accessible from anywhere with an internet connection. This accessibility helps bridge the gap for professionals in remote areas, making high-quality certification training more inclusive and far-reaching than ever before.
                  </p>

                  {/* Points Box */}
                  <div className="bg-gradient-to-r from-[#4F46E5]/5 to-[#B39DDB]/5 border-l-4 border-[#4F46E5] rounded-lg p-6 my-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">A Personalized Learning Experience with Accredi</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-[#4F46E5] mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-700">Our certification platforms have evolved to offer a highly personalized experience tailored to each professional's career goals and learning style.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-[#4F46E5] mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-700">Accredi offers certifications in fields ranging from Project Management (PMP®) and Agile methodologies to Six Sigma, Cloud Computing, and DevOps.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-[#4F46E5] mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-700">Our training adapts to individual learning preferences - some professionals benefit from interactive workshops, while others excel through self-paced study materials.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Quote Box */}
                  <div className="relative bg-gradient-to-br from-[#4F46E5] to-[#3730A3] rounded-2xl p-8 my-12 text-white">
                    <div className="absolute top-4 left-4 text-6xl text-white/20">"</div>
                    <div className="absolute bottom-4 right-4 text-6xl text-white/20 rotate-180">"</div>
                    
                    <p className="text-lg lg:text-xl leading-relaxed mb-6 relative z-10">
                      Professional development in the modern world transcends traditional classrooms and rigid schedules; it is a lifelong journey accessible to anyone, anywhere, with a drive to learn and grow through quality certification training.
                    </p>
                    
                    <div className="flex items-center gap-4 relative z-10">
                      <Image
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                        alt="Johnson Taylor"
                        width={50}
                        height={50}
                        className="w-12 h-12 rounded-full object-cover"
                        unoptimized
                      />
                      <div>
                        <p className="text-white/90 text-sm">Senior Learning Architect</p>
                        <h4 className="text-white font-bold">Johnson Taylor</h4>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Lifelong Learning and Professional Skill Development</h2>
                  
                  <p className="text-gray-700 leading-relaxed mb-8">
                    Lifelong learning is becoming essential for professionals who want to stay relevant in their careers, and Accredi caters to this need by offering comprehensive certification programs, workshops, and specialized courses that focus on in-demand skills and industry-recognized credentials.
                  </p>

                  {/* Image Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <Image
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                      alt="Professional Development"
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover rounded-xl"
                      unoptimized
                    />
                    <Image
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                      alt="Online Learning"
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover rounded-xl"
                      unoptimized
                    />
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    As we move forward, the role of certification training in professional development will only expand. By embracing these changes, professionals and organizations alike can benefit from education that meets the needs of a rapidly evolving business landscape. Accredi's certification programs are not just a passing trend – they represent the future of professional development.
                  </p>
                </div>

                {/* Tags and Share */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-gray-900">Tags:</span>
                    <Link href="#" className="px-3 py-1 bg-gray-100 hover:bg-[#4F46E5] hover:text-white rounded-full text-sm transition-colors">Education</Link>
                    <Link href="#" className="px-3 py-1 bg-gray-100 hover:bg-[#4F46E5] hover:text-white rounded-full text-sm transition-colors">Development</Link>
                    <Link href="#" className="px-3 py-1 bg-gray-100 hover:bg-[#4F46E5] hover:text-white rounded-full text-sm transition-colors">Certification</Link>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">Share:</span>
                    <Link href="#" className="w-8 h-8 bg-gray-100 hover:bg-[#3B82F6] hover:text-white rounded-full flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </Link>
                    <Link href="#" className="w-8 h-8 bg-gray-100 hover:bg-[#E1306C] hover:text-white rounded-full flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.668-.069 4.948-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </Link>
                    <Link href="#" className="w-8 h-8 bg-gray-100 hover:bg-[#1877F2] hover:text-white rounded-full flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Comments Section - Will continue in next part... */}
                
                {/* Comments Section */}
                <div className="pt-12 border-t border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Total Reviews (165)</h3>
                  
                  {/* Comments List */}
                  <div className="space-y-8 mb-12">
                    {/* Comment 1 */}
                    <div className="flex gap-4">
                      <Image
                        src="https://images.unsplash.com/photo-1494790108755-2616b332c8f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                        alt="Alisa Manama"
                        width={60}
                        height={60}
                        className="w-15 h-15 rounded-full object-cover flex-shrink-0"
                        unoptimized
                      />
                      <div className="flex-1">
                        <div className="mb-3">
                          <h4 className="font-bold text-gray-900">
                            Alisa Manama <span className="text-sm font-normal text-gray-600">Product Designer</span>
                          </h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          This article really resonates with me! As a working parent, Accredi's certification programs have been a game-changer. I'm able to continue my professional development without sacrificing family time. I genuinely believe that this is the future of professional training.
                        </p>
                        <div className="flex items-center justify-between">
                          <button className="text-[#4F46E5] hover:text-[#3730A3] font-medium text-sm">Reply</button>
                          <span className="text-gray-500 text-sm">18 July, 2024</span>
                        </div>
                      </div>
                    </div>

                    {/* Comment 2 */}
                    <div className="flex gap-4">
                      <Image
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                        alt="Jordan Walk"
                        width={60}
                        height={60}
                        className="w-15 h-15 rounded-full object-cover flex-shrink-0"
                        unoptimized
                      />
                      <div className="flex-1">
                        <div className="mb-3">
                          <h4 className="font-bold text-gray-900">
                            Jordan Walk <span className="text-sm font-normal text-gray-600">By Author</span>
                          </h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          Absolutely! It's amazing how Accredi's platform adapts to our lives, isn't it? Being able to balance work, family, and professional development is such a huge advantage. Glad it's working so well for you!
                        </p>
                        <div className="flex items-center justify-between">
                          <button className="text-[#4F46E5] hover:text-[#3730A3] font-medium text-sm">Reply</button>
                          <span className="text-gray-500 text-sm">18 July, 2024</span>
                        </div>
                      </div>
                    </div>

                    {/* Comment 3 - Nested */}
                    <div className="ml-12 flex gap-4">
                      <Image
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                        alt="Lisa Oliva"
                        width={60}
                        height={60}
                        className="w-15 h-15 rounded-full object-cover flex-shrink-0"
                        unoptimized
                      />
                      <div className="flex-1">
                        <div className="mb-3">
                          <h4 className="font-bold text-gray-900">
                            Lisa Oliva <span className="text-sm font-normal text-gray-600">Fashion Designer</span>
                          </h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          This article really resonates with me! As a working parent, Accredi's certification training has been a game-changer. I'm able to continue my education without sacrificing family time. I genuinely believe that this is the future of education.
                        </p>
                        <div className="flex items-center justify-between">
                          <button className="text-[#4F46E5] hover:text-[#3730A3] font-medium text-sm">Reply</button>
                          <span className="text-gray-500 text-sm">18 July, 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comment Form */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Submit Your Reviews</h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-gray-700 font-medium">Your Ratings</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRatingClick(star)}
                            className={`w-6 h-6 ${
                              star <= rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            <svg fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                          required
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                          required
                        />
                      </div>
                      <textarea
                        name="review"
                        placeholder="Write Review"
                        value={formData.review}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-none"
                        required
                      ></textarea>
                      <button
                        type="submit"
                        className="flex items-center gap-3 bg-gradient-to-r from-[#4F46E5] to-[#3730A3] hover:from-[#3730A3] hover:to-[#312E81] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Submit Review
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Right Side */}
            <div className="lg:col-span-4">
              <div className="space-y-8">
                {/* Search */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#3730A3] rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Search</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Search blogs to discover a vast world of online content on countless topics.</p>
                  <div className="relative">
                    <input
                      type="search"
                      placeholder="Search..."
                      className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#4F46E5]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#3730A3] rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14-4H5m14 8H5m14 4H5" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Category</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Project Management", count: 45 },
                      { name: "Agile & Scrum", count: 32 },
                      { name: "Six Sigma", count: 28 },
                      { name: "Cloud Computing", count: 35 },
                      { name: "DevOps", count: 22 }
                    ].map((category, index) => (
                      <Link
                        key={index}
                        href="#"
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          index === 2 ? 'bg-[#4F46E5] text-white' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">{category.name} - ({category.count})</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Continue with more sidebar sections... */}
                
                {/* Latest Posts */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#3730A3] rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Latest Post</h3>
                  </div>
                  <div className="space-y-6">
                    {[
                      {
                        title: "Creating a Productive Study Space for Online Learning",
                        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                        category: "Development",
                        readTime: "10 Min Read"
                      },
                      {
                        title: "Universities, colleges, and independent platforms",
                        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                        category: "Development", 
                        readTime: "10 Min Read"
                      },
                      {
                        title: "How to Succeed in Online Learning: Tips for Students",
                        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                        category: "Development",
                        readTime: "10 Min Read"
                      }
                    ].map((post, index) => (
                      <div key={index} className="flex gap-3">
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={80}
                          height={60}
                          className="w-20 h-15 object-cover rounded-lg flex-shrink-0"
                          unoptimized
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              <span className="text-[#4F46E5]">{post.category}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 leading-tight hover:text-[#4F46E5] transition-colors cursor-pointer">
                            <Link href="#">{post.title}</Link>
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#3730A3] rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Keywords</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Business", "Design", "Development", "Technology", 
                      "Fitness", "Cooking", "Health Care"
                    ].map((keyword, index) => (
                      <Link
                        key={index}
                        href="#"
                        className="px-3 py-2 bg-gray-100 hover:bg-[#4F46E5] hover:text-white text-sm rounded-lg transition-colors"
                      >
                        {keyword}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#3730A3] rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Newsletter</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Subscribe our newsletter to get every update</p>
                  <form className="space-y-3">
                    <input
                      type="email"
                      placeholder="Search Blogs"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#3730A3] hover:from-[#3730A3] hover:to-[#312E81] text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
                    >
                      Subscribe
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 