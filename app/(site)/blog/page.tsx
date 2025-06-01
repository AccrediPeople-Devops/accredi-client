"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/app/components/site/Breadcrumb";

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const postsPerPage = 6;

  const breadcrumbItems = [
    { label: "Blog" }
  ];

  const categories = ["All", "Certification", "Career Development", "Technology", "Business"];

  const blogPosts = [
    {
      id: 1,
      title: "Complete Guide to PMP Certification: Everything You Need to Know",
      excerpt: "Discover the comprehensive roadmap to becoming a certified Project Management Professional and accelerate your career in project management.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      date: "2024-11-15",
      category: "Certification",
      readTime: "12 Min Read",
      author: "Sarah Johnson",
      featured: true
    },
    {
      id: 2,
      title: "The Future of Remote Work: Essential Skills for 2024",
      excerpt: "Explore the evolving landscape of remote work and discover the critical skills professionals need to thrive in distributed teams.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      date: "2024-11-12",
      category: "Career Development",
      readTime: "8 Min Read",
      author: "Michael Chen",
      featured: false
    },
    {
      id: 3,
      title: "Agile vs Scrum: Understanding the Differences and When to Use Each",
      excerpt: "A comprehensive comparison of Agile and Scrum methodologies to help you choose the right approach for your projects.",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      date: "2024-11-10",
      category: "Technology",
      readTime: "10 Min Read",
      author: "Emily Rodriguez",
      featured: true
    },
    {
      id: 4,
      title: "Cloud Computing Certifications: AWS vs Azure vs Google Cloud",
      excerpt: "Compare the top cloud certification programs and discover which path aligns best with your career goals and industry demands.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      date: "2024-11-08",
      category: "Technology",
      readTime: "15 Min Read",
      author: "David Kumar",
      featured: false
    },
    {
      id: 5,
      title: "Building a Data-Driven Organization: Analytics Certification Guide",
      excerpt: "Learn how to leverage data analytics certifications to drive business insights and make informed strategic decisions.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      date: "2024-11-05",
      category: "Business",
      readTime: "11 Min Read",
      author: "Lisa Zhang",
      featured: false
    },
    {
      id: 6,
      title: "Cybersecurity Career Path: Essential Certifications and Skills",
      excerpt: "Navigate the cybersecurity landscape with our comprehensive guide to the most valuable certifications and in-demand skills.",
      image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      date: "2024-11-03",
      category: "Certification",
      readTime: "13 Min Read",
      author: "Alex Thompson",
      featured: true
    }
  ];

  // Filter and search logic
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);
  const featuredPosts = blogPosts.filter(post => post.featured).slice(0, 3);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
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
              <span className="site-text-accent font-bold text-sm uppercase tracking-wider">Knowledge Hub</span>
              <div className="w-3 h-3 bg-[#4F46E5] rounded-full animate-pulse delay-500"></div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="site-text-primary">Insights & </span>
              <span className="bg-gradient-to-r from-[#4F46E5] via-[#10B981] to-[#F59E0B] bg-clip-text text-transparent">
                Expertise
              </span>
              <span className="block site-text-primary">Blog</span>
            </h1>

            <p className="text-xl site-text-secondary max-w-4xl mx-auto leading-relaxed mb-12">
              Discover insights, tips, and trends in professional development, certification training, 
              and career advancement from industry experts and thought leaders.
            </p>

            {/* Blog Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">📝</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent mb-2">{blogPosts.length}+</div>
                  <div className="text-sm site-text-muted font-medium">Articles</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🎯</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent mb-2">5</div>
                  <div className="text-sm site-text-muted font-medium">Categories</div>
                </div>
              </div>

              <div className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">👥</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-[#F59E0B] to-[#EF4444] bg-clip-text text-transparent mb-2">50K+</div>
                  <div className="text-sm site-text-muted font-medium">Readers</div>
                </div>
              </div>

              <div className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">⭐</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] bg-clip-text text-transparent mb-2">4.9</div>
                  <div className="text-sm site-text-muted font-medium">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#4F46E5]/5 site-light:bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse"></div>
              <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">Featured Content</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6">
              <strong>Editor's Picks</strong>
            </h2>
            <p className="site-text-secondary text-lg max-w-3xl mx-auto">
              Hand-selected articles that deliver the most value to your professional development journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {featuredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="group">
                <div className="site-glass backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105">
                  <div className="relative overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={400}
                      height={250}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white px-3 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <span className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent font-bold">
                        {post.category}
                      </span>
                      <span className="site-text-muted">{post.readTime}</span>
                      <span className="site-text-muted">{formatDate(post.date)}</span>
                    </div>
                    
                    <h3 className="text-xl font-black site-text-primary mb-3 group-hover:text-[#4F46E5] transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="site-text-secondary leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm site-text-muted">By {post.author}</span>
                      <div className="flex items-center gap-2 text-[#4F46E5] group-hover:gap-3 transition-all duration-300">
                        <span className="text-sm font-medium">Read More</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-16 md:py-24 site-section-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-48 h-48 bg-[#10B981]/5 site-light:bg-[#10B981]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#F59E0B]/5 site-light:bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
              <span className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider">All Articles</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black site-text-primary mb-6">
              <strong>Explore Our Content</strong>
            </h2>
          </div>

          {/* Search and Filter Controls */}
          <div className="site-glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-bold site-text-primary mb-2">Search Articles</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-12 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                    placeholder="Search by title or content..."
                  />
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 site-text-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-bold site-text-primary mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 site-glass backdrop-blur-sm rounded-2xl site-border border focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 site-text-primary"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-6 pt-6 border-t site-border flex items-center justify-between">
              <p className="site-text-secondary">
                Showing {startIndex + 1}-{Math.min(startIndex + postsPerPage, filteredPosts.length)} of {filteredPosts.length} articles
              </p>
              {(searchQuery || selectedCategory !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setCurrentPage(1);
                  }}
                  className="text-[#4F46E5] hover:underline font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {currentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="group">
                <article className="site-glass backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 h-full">
                  <div className="relative overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={400}
                      height={250}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-3 py-2 rounded-full text-xs font-bold">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4 text-sm site-text-muted">
                      <span>{formatDate(post.date)}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                      <span>•</span>
                      <span>By {post.author}</span>
                    </div>

                    <h3 className="text-xl font-black site-text-primary mb-3 group-hover:text-[#4F46E5] transition-colors duration-300 line-clamp-2 flex-grow">
                      {post.title}
                    </h3>

                    <p className="site-text-secondary leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-sm site-text-muted">Read Article</span>
                      <div className="flex items-center gap-2 text-[#4F46E5] group-hover:gap-3 transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <nav className="site-glass backdrop-blur-xl rounded-3xl p-4 shadow-xl">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl site-border border site-text-primary hover:bg-[#4F46E5] hover:text-white transition-all duration-300 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl font-bold transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-[#4F46E5] text-white border border-[#4F46E5]'
                            : 'site-border border site-text-primary hover:bg-[#4F46E5] hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl site-border border site-text-primary hover:bg-[#4F46E5] hover:text-white transition-all duration-300 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </nav>
            </div>
          )}

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 site-text-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.055a7.962 7.962 0 01-6-2.764M3 3l18 18" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold site-text-primary mb-4">No Articles Found</h3>
              <p className="site-text-secondary mb-6">
                We couldn't find any articles matching your search criteria. Try adjusting your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setCurrentPage(1);
                }}
                className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-all duration-300"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 