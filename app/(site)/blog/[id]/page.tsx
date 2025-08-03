"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/app/components/site/Breadcrumb";

export default function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [rating, setRating] = useState(0);
  const [likeCount, setLikeCount] = useState(234);
  const [isLiked, setIsLiked] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    review: ''
  });

  const breadcrumbItems = [
    { label: "Blog", href: "/blog" },
    { label: "Blog Details" }
  ];

  const blogPost = {
    id: unwrappedParams.id,
    title: "Complete Guide to PMP Certification: Everything You Need to Know",
    excerpt: "Discover the comprehensive roadmap to becoming a certified Project Management Professional and accelerate your career in project management.",
    content: `
      <p>The professional development landscape has undergone a radical transformation in recent years, and certification training is no exception. At Accredi, we've witnessed firsthand how the demand for flexible, accessible, and high-quality certification programs has skyrocketed.</p>
      
      <h2>Why PMP Certification Matters</h2>
      <p>Project Management Professional (PMP) certification is one of the most recognized credentials in the project management field. It demonstrates your expertise in leading and directing projects and teams.</p>
      
      <h3>Key Benefits of PMP Certification:</h3>
      <ul>
        <li>Higher salary potential - PMP certified professionals earn 20% more on average</li>
        <li>Global recognition across industries and organizations</li>
        <li>Enhanced project management skills and methodologies</li>
        <li>Expanded career opportunities and leadership roles</li>
        <li>Professional credibility and respect from peers</li>
      </ul>
      
      <h2>PMP Certification Requirements</h2>
      <p>To be eligible for PMP certification, you must meet specific education and experience requirements:</p>
      
      <h3>Educational Background:</h3>
      <ul>
        <li><strong>Four-year degree:</strong> 4,500 hours of project management experience</li>
        <li><strong>High school diploma:</strong> 7,500 hours of project management experience</li>
      </ul>
      
      <h2>Exam Preparation Strategy</h2>
      <p>Success on the PMP exam requires dedicated preparation and the right study approach. Here's our recommended strategy:</p>
      
      <h3>Study Plan (3-4 months):</h3>
      <ol>
        <li><strong>Month 1:</strong> Complete 35 contact hours of project management education</li>
        <li><strong>Month 2:</strong> Study PMBOK Guide and practice questions</li>
        <li><strong>Month 3:</strong> Take practice exams and identify weak areas</li>
        <li><strong>Month 4:</strong> Final review and exam scheduling</li>
      </ol>
      
      <h2>Career Impact</h2>
      <p>PMP certification opens doors to exciting career opportunities and positions you as a leader in project management. Our graduates have seen immediate impacts on their careers, with many receiving promotions within 6 months of certification.</p>
    `,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c8f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      title: "Senior PMP Instructor",
      bio: "Sarah has over 15 years of project management experience and has helped thousands of professionals achieve PMP certification."
    },
    date: "2024-11-15",
    category: "Certification",
    readTime: "12 Min Read",
    tags: ["PMP", "Project Management", "Certification", "Career Development"],
    views: 1247,
    shares: 89
  };

  const relatedPosts = [
    {
      id: 2,
      title: "Agile vs Scrum: Understanding the Differences",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      category: "Technology",
      readTime: "8 Min Read"
    },
    {
      id: 3,
      title: "Cloud Computing Certifications Guide",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      category: "Technology",
      readTime: "10 Min Read"
    },
    {
      id: 4,
      title: "Building a Data-Driven Organization",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      category: "Business",
      readTime: "15 Min Read"
    }
  ];

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
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
    // Reset form
    setFormData({ name: '', email: '', review: '' });
    setRating(0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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

          {/* Article Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
              <span className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider">{blogPost.category}</span>
        </div>

            <h1 className="text-4xl lg:text-6xl font-black mb-8 leading-tight site-text-primary">
              {blogPost.title}
            </h1>

            <p className="text-xl site-text-secondary leading-relaxed mb-8">
              {blogPost.excerpt}
            </p>

            {/* Author & Meta Info */}
            <div className="site-glass backdrop-blur-xl rounded-3xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={blogPost.author.avatar}
                    alt={blogPost.author.name}
                    width={60}
                    height={60}
                    className="w-15 h-15 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <h4 className="font-bold site-text-primary">{blogPost.author.name}</h4>
                    <p className="text-sm site-text-muted">{blogPost.author.title}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm site-text-muted">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(blogPost.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{blogPost.readTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{blogPost.views} views</span>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 site-section-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Article Content */}
            <div className="lg:col-span-8">
              {/* Featured Image */}
              <div className="site-glass backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl mb-8">
                <Image
                  src={blogPost.image}
                  alt={blogPost.title}
                  width={800}
                  height={400}
                  className="w-full h-64 md:h-80 object-cover rounded-2xl"
                  priority
                />
              </div>

              {/* Article Content */}
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 mb-8">
                <div 
                  className="prose prose-lg max-w-none site-text-primary"
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                    />
                  </div>

              {/* Article Actions */}
              <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 mb-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold site-text-primary">Tags:</span>
                    {blogPost.tags.map((tag, index) => (
                      <Link 
                        key={index} 
                        href={`/blog?tag=${tag}`}
                        className="px-3 py-1 bg-[#4F46E5]/10 site-light:bg-[#4F46E5]/20 text-[#4F46E5] rounded-full text-sm hover:bg-[#4F46E5] hover:text-white transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLikeClick}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                        isLiked 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-100 site-light:bg-gray-200 site-text-primary hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="font-medium">{likeCount}</span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 site-light:bg-gray-200 site-text-primary hover:bg-[#4F46E5] hover:text-white rounded-full transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span className="font-medium">{blogPost.shares}</span>
                    </button>
                        </div>
                      </div>
                    </div>

              {/* Author Bio */}
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 mb-8">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                      <Image
                    src={blogPost.author.avatar}
                    alt={blogPost.author.name}
                    width={120}
                    height={120}
                    className="w-30 h-30 rounded-full object-cover"
                        />
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-2xl font-black site-text-primary mb-2">{blogPost.author.name}</h3>
                    <p className="text-lg font-medium text-[#4F46E5] mb-4">{blogPost.author.title}</p>
                    <p className="site-text-secondary leading-relaxed">
                      {blogPost.author.bio}
                    </p>
                        </div>
                      </div>
                    </div>

              {/* Comments Section */}
              <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                <h3 className="text-2xl font-black site-text-primary mb-8">Leave a Review</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Rating */}
                  <div>
                    <label className="block text-sm font-bold site-text-primary mb-2">Your Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                          type="button"
                            onClick={() => handleRatingClick(star)}
                          className={`w-8 h-8 transition-colors ${
                            star <= rating ? 'text-yellow-400' : 'site-text-muted'
                            }`}
                          >
                            <svg fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold site-text-primary mb-2">Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                        placeholder="Your full name"
                          required
                        />
                    </div>
                    <div>
                      <label className="block text-sm font-bold site-text-primary mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                        placeholder="Your email address"
                          required
                        />
                      </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold site-text-primary mb-2">Review *</label>
                      <textarea
                        name="review"
                        value={formData.review}
                        onChange={handleInputChange}
                        rows={5}
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary resize-none"
                      placeholder="Share your thoughts about this article..."
                        required
                    />
                  </div>

                      <button
                        type="submit"
                    className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#4F46E5]/25"
                      >
                        Submit Review
                      </button>
                    </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="space-y-8">
                {/* Search */}
                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                  <h3 className="text-xl font-bold site-text-primary mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    Search Articles
                  </h3>
                  <div className="relative">
                    <input
                      type="search"
                      placeholder="Search blog posts..."
                      className="w-full px-4 py-3 pl-12 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 site-text-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                  </div>
                </div>

                {/* Related Posts */}
                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                  <h3 className="text-xl font-bold site-text-primary mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    Related Posts
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((post) => (
                      <Link key={post.id} href={`/blog/${post.id}`} className="group block">
                        <div className="flex gap-4 p-3 rounded-2xl hover:bg-white/10 site-light:hover:bg-white/40 transition-all duration-300">
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={80}
                          height={60}
                            className="w-20 h-15 object-cover rounded-xl flex-shrink-0"
                          />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 text-xs">
                              <span className="text-[#4F46E5] font-medium">{post.category}</span>
                              <span className="site-text-muted">•</span>
                              <span className="site-text-muted">{post.readTime}</span>
                            </div>
                            <h4 className="text-sm font-bold site-text-primary group-hover:text-[#4F46E5] transition-colors line-clamp-2">
                              {post.title}
                            </h4>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                  <h3 className="text-xl font-bold site-text-primary mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#F59E0B] to-[#EF4444] rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    Newsletter
                  </h3>
                  <p className="site-text-secondary text-sm mb-4">
                    Subscribe to get the latest articles and certification tips delivered to your inbox.
                  </p>
                  <form className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                    />
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] hover:from-[#EF4444] hover:to-[#DC2626] text-white font-bold py-3 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>

                {/* Back to Blog */}
                <div className="site-glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500">
                  <Link 
                    href="/blog"
                    className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Blog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 