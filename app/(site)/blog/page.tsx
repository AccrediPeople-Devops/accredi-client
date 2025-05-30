"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Breadcrumb from "@/app/components/site/Breadcrumb";

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const breadcrumbItems = [
    { label: "Blog" }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "How to Succeed in Online Learning: Tips for Students",
      excerpt: "The discusses the advantages of using LMS for upskilling employees, managing compliance training,",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      date: "Nov 02, 2024",
      category: "Business",
      readTime: "10 Min Read",
      comments: "(Comments)"
    },
    {
      id: 2,
      title: "The Future of Education: Why Online Learning is Here to Stay",
      excerpt: "The discusses the advantages of using LMS for upskilling employees, managing compliance training,",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      date: "Nov 02, 2024",
      category: "Business",
      readTime: "10 Min Read",
      comments: "(Comments)"
    },
    {
      id: 3,
      title: "Creating a Productive Study Space for Online Learning",
      excerpt: "The discusses the advantages of using LMS for upskilling employees, managing compliance training,",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      date: "Nov 02, 2024",
      category: "Business",
      readTime: "10 Min Read",
      comments: "(Comments)"
    },
    {
      id: 4,
      title: "The Future of LMS: Trends Shaping E-Learning in 2024",
      excerpt: "The discusses the advantages of using LMS for upskilling employees, managing compliance training,",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      date: "March 02, 2024",
      category: "Business",
      readTime: "10 Min Read",
      comments: "(Comments)"
    },
    {
      id: 5,
      title: "How to Choose the Right LMS for Your Organization",
      excerpt: "The discusses the advantages of using LMS for upskilling employees, managing compliance training,",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      date: "Oct 02, 2024",
      category: "Business",
      readTime: "10 Min Read",
      comments: "(Comments)"
    },
    {
      id: 6,
      title: "Boosting Employee Engagement with Gamified LMS Features",
      excerpt: "The discusses the advantages of using LMS for upskilling employees, managing compliance training,",
      image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      date: "June 02, 2024",
      category: "Business",
      readTime: "10 Min Read",
      comments: "(Comments)"
    },
    {
      id: 7,
      title: "How an LMS Supports Employee Development",
      excerpt: "The discusses the advantages of using LMS for upskilling employees, managing compliance training,",
      image: "https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      date: "Dec 02, 2024",
      category: "Business",
      readTime: "10 Min Read",
      comments: "(Comments)"
    },
    {
      id: 8,
      title: "Top 5 LMS Integrations Every Business Should Consider",
      excerpt: "The discusses the advantages of using LMS for upskilling employees, managing compliance training,",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      date: "Nov 02, 2024",
      category: "Business",
      readTime: "10 Min Read",
      comments: "(Comments)"
    },
    {
      id: 9,
      title: "Maximizing ROI: How to Measure the Success of Your LMS",
      excerpt: "The discusses the advantages of using LMS for upskilling employees, managing compliance training,",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      date: "Nov 02, 2024",
      category: "Business",
      readTime: "10 Min Read",
      comments: "(Comments)"
    }
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

      {/* Page Header Section */}
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
                {/* <div className="relative z-10 animate-float">
                  <Image
                    src="/images/blog/blog-hero.png"
                    alt="Student with books"
                    width={400}
                    height={500}
                    className="w-80 h-96 object-contain filter drop-shadow-2xl"
                    unoptimized
                  />
                </div> */}

                {/* Floating Decorative Shapes around Student */}
                <div className="absolute -top-4 -left-8 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg transform rotate-12 animate-bounce opacity-80"></div>
                <div className="absolute top-16 -right-6 w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-pulse opacity-80"></div>
                <div className="absolute -bottom-8 -left-12 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl transform -rotate-6 animate-bounce opacity-80" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-20 -right-8 w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg transform rotate-45 animate-pulse opacity-80" style={{ animationDelay: '1s' }}></div>
                
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
                Our Blogs
              </h1>
              
              <p className="text-white/90 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
                Discover insights, tips, and trends in professional development, certification training, and career advancement.
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

      {/* Blog Cards Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="lg:container lg:mx-auto lg:max-w-7xl px-3.5 lg:px-8">
          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {blogPosts.map((post, index) => (
              <div 
                key={post.id} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Blog Image */}
                <div className="relative overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-[#4F46E5] text-white px-3 py-2 rounded-lg flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium">{post.date}</span>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  {/* Meta Information */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-[#4F46E5] font-medium">{post.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{post.comments}</span>
                    </div>
                  </div>

                  {/* Blog Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#4F46E5] transition-colors duration-300 line-clamp-2">
                    <Link href={`/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </h3>

                  {/* Blog Excerpt */}
                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* More Blogs Button and Pagination */}
          <div className="flex flex-col items-center space-y-8">
            {/* More Blogs Button */}
            <Link
              href="/blog"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#4F46E5] to-[#3730A3] hover:from-[#3730A3] hover:to-[#312E81] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <span>More Blogs</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            {/* Pagination */}
            <nav className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-[#4F46E5] text-white border border-[#4F46E5]'
                        : 'border border-gray-300 text-gray-600 hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5]'
                    }`}
                  >
                    {page.toString().padStart(2, '0')}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
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