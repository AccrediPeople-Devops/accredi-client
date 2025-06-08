"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Extended testimonials data with more detailed information
const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    position: "Sr. Product Manager",
    company: "Microsoft",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    content: "Accredi's approach is revolutionary. They don't just teach you frameworks—they rewire your thinking. My PMP certification opened doors I never knew existed. The instructors are industry veterans who understand real-world challenges, not just textbook scenarios.",
    fullReview: "I was stuck in a junior role for years despite my technical skills. The PMP certification through Accredi changed everything. The instructors didn't just prepare me for the exam—they prepared me for leadership. Within 6 months of certification, I was promoted to Senior Product Manager with a 200% salary increase. The personalized mentorship and real-world case studies made all the difference.",
    rating: 5,
    achievement: "200% Salary Increase",
    beforeRole: "Junior Business Analyst",
    afterRole: "Sr. Product Manager",
    timeframe: "6 months",
    certification: "PMP",
    location: "Seattle, WA",
    industry: "Technology",
    courseDuration: "6 weeks",
    reviewDate: "2024-01-15"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    position: "Cloud Architect",
    company: "Amazon Web Services",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    content: "The personalized mentorship was game-changing. My instructor didn't just prepare me for AWS certification—they prepared me for career transformation. The hands-on labs and real-world scenarios were invaluable.",
    fullReview: "Moving from traditional IT to cloud was intimidating, but Accredi made it seamless. The AWS Solutions Architect course wasn't just about passing an exam—it was about understanding cloud architecture at a fundamental level. The instructors are actual AWS professionals, not just trainers. The practical labs gave me confidence to design real solutions. Now I'm leading cloud migration projects at AWS.",
    rating: 5,
    achievement: "Leadership Role",
    beforeRole: "System Administrator",
    afterRole: "Cloud Architect",
    timeframe: "4 months",
    certification: "AWS Solutions Architect",
    location: "Austin, TX",
    industry: "Cloud Computing",
    courseDuration: "8 weeks",
    reviewDate: "2024-02-10"
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    position: "VP of Operations",
    company: "Johnson & Johnson",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    content: "Six Sigma certification through Accredi didn't just improve my skills—it transformed how I approach complex problems. The ROI is immeasurable. The statistical analysis and process improvement methodologies are now core to how I think.",
    fullReview: "Healthcare operations are incredibly complex, and Six Sigma gave me the tools to make systematic improvements. Accredi's approach combines statistical rigor with practical application. The project-based learning meant I was solving real problems while learning. I've since led initiatives that saved our division over $2M annually. The certification opened doors to the C-suite.",
    rating: 5,
    achievement: "C-Suite Position",
    beforeRole: "Operations Manager",
    afterRole: "VP of Operations",
    timeframe: "8 months",
    certification: "Six Sigma Black Belt",
    location: "New Brunswick, NJ",
    industry: "Healthcare",
    courseDuration: "12 weeks",
    reviewDate: "2024-01-28"
  },
  {
    id: 4,
    name: "James Thompson",
    position: "Scrum Master",
    company: "Spotify",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    content: "The interactive learning environment at Accredi is unmatched. Real scenarios, expert feedback, and a supportive community made all the difference. I went from struggling with team dynamics to confidently leading multiple scrum teams.",
    fullReview: "Transitioning from development to leadership was challenging. The Certified Scrum Master course at Accredi wasn't just theory—it was practical leadership training. They taught me how to facilitate difficult conversations, manage stakeholder expectations, and build high-performing teams. The community aspect was incredible; I'm still in touch with classmates who've become my professional network.",
    rating: 5,
    achievement: "Tech Leadership",
    beforeRole: "Senior Developer",
    afterRole: "Scrum Master",
    timeframe: "3 months",
    certification: "Certified Scrum Master",
    location: "Stockholm, Sweden",
    industry: "Music Technology",
    courseDuration: "4 weeks",
    reviewDate: "2024-03-05"
  },
  {
    id: 5,
    name: "Emily Zhang",
    position: "Digital Transformation Lead",
    company: "Goldman Sachs",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    content: "Accredi's comprehensive approach to DevOps certification went beyond technical skills. They taught me to think strategically about transformation. The financial sector is notoriously resistant to change, but the frameworks I learned made transformation possible.",
    fullReview: "Financial services are highly regulated and change-resistant, making DevOps adoption challenging. Accredi's course covered not just technical implementation but organizational change management. I learned to build buy-in from stakeholders, manage compliance requirements, and measure transformation success. Now I'm leading a $50M digital transformation initiative.",
    rating: 5,
    achievement: "Strategic Role",
    beforeRole: "DevOps Engineer",
    afterRole: "Transformation Lead",
    timeframe: "5 months",
    certification: "DevOps Expert",
    location: "New York, NY",
    industry: "Financial Services",
    courseDuration: "10 weeks",
    reviewDate: "2024-02-18"
  },
  {
    id: 6,
    name: "David Kim",
    position: "Cybersecurity Director",
    company: "Tesla",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    content: "The CISSP preparation at Accredi was thorough and practical. They don't just teach you to pass the exam—they prepare you to be a security leader. The threat modeling and risk assessment frameworks are now part of my daily toolkit.",
    fullReview: "Cybersecurity is evolving rapidly, and staying current requires continuous learning. Accredi's CISSP course was comprehensive, covering both technical and management aspects of security. The instructors are practicing CISOs and security architects who bring real-world experience. The case studies were based on actual incidents, making the learning highly relevant.",
    rating: 5,
    achievement: "Executive Position",
    beforeRole: "Security Analyst",
    afterRole: "Cybersecurity Director",
    timeframe: "7 months",
    certification: "CISSP",
    location: "Palo Alto, CA",
    industry: "Automotive Technology",
    courseDuration: "8 weeks",
    reviewDate: "2024-01-10"
  },
  {
    id: 7,
    name: "Lisa Johnson",
    position: "Quality Assurance Manager",
    company: "Pfizer",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    content: "The Lean Six Sigma Green Belt certification transformed how I approach quality management. Accredi's methodology is practical and immediately applicable. I've implemented process improvements that saved our department over $1M annually.",
    fullReview: "Pharmaceutical quality management requires precision and systematic thinking. The Lean Six Sigma course at Accredi taught me to identify waste, measure performance, and implement sustainable improvements. The DMAIC methodology became second nature. I've since led multiple successful process optimization projects and was promoted to department manager.",
    rating: 5,
    achievement: "Process Innovation",
    beforeRole: "QA Specialist",
    afterRole: "QA Manager",
    timeframe: "4 months",
    certification: "Lean Six Sigma Green Belt",
    location: "New York, NY",
    industry: "Pharmaceutical",
    courseDuration: "6 weeks",
    reviewDate: "2024-02-25"
  },
  {
    id: 8,
    name: "Michael Brown",
    position: "Data Science Lead",
    company: "Netflix",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    content: "The Machine Learning certification course at Accredi bridged the gap between academic theory and industry practice. The hands-on projects with real datasets prepared me for the challenges of production ML systems.",
    fullReview: "Moving from traditional software development to data science required learning entirely new skills. Accredi's ML course wasn't just about algorithms—it covered the entire ML lifecycle, from data engineering to model deployment. The instructors are practicing data scientists from top tech companies. The capstone project became part of my portfolio that landed me this role at Netflix.",
    rating: 5,
    achievement: "Career Pivot",
    beforeRole: "Software Engineer",
    afterRole: "Data Science Lead",
    timeframe: "6 months",
    certification: "Machine Learning Expert",
    location: "Los Gatos, CA",
    industry: "Entertainment Technology",
    courseDuration: "12 weeks",
    reviewDate: "2024-03-12"
  }
];

const certificationTypes = [
  "All Certifications",
  "PMP",
  "AWS Solutions Architect", 
  "Six Sigma Black Belt",
  "Certified Scrum Master",
  "DevOps Expert",
  "CISSP",
  "Lean Six Sigma Green Belt",
  "Machine Learning Expert"
];

const industries = [
  "All Industries",
  "Technology",
  "Healthcare", 
  "Financial Services",
  "Cloud Computing",
  "Music Technology",
  "Automotive Technology",
  "Pharmaceutical",
  "Entertainment Technology"
];

const stats = [
  { number: "5,000+", label: "Certified Professionals", icon: "🎓", description: "Successfully trained and certified" },
  { number: "98%", label: "Pass Rate", icon: "✅", description: "First-attempt certification success" },
  { number: "4.9/5", label: "Average Rating", icon: "⭐", description: "Based on student feedback" },
  { number: "200%", label: "Average Salary Increase", icon: "📈", description: "Post-certification career growth" }
];

export default function ReviewsPage() {
  const [selectedCertification, setSelectedCertification] = useState("All Certifications");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;

  // Filter testimonials based on selected filters
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesCertification = selectedCertification === "All Certifications" || 
      testimonial.certification === selectedCertification;
    const matchesIndustry = selectedIndustry === "All Industries" || 
      testimonial.industry === selectedIndustry;
    const matchesSearch = searchTerm === "" || 
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCertification && matchesIndustry && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTestimonials.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const paginatedTestimonials = filteredTestimonials.slice(startIndex, startIndex + reviewsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCertification, selectedIndustry, searchTerm]);

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
          <div className="text-center mb-16">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 site-glass backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse"></div>
              <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">Success Stories</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black mb-6 leading-tight">
              <span className="site-text-primary">What Our </span>
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
                Students Say
              </span>
            </h1>
            <p className="text-xl site-text-secondary font-medium leading-relaxed max-w-3xl mx-auto">
              Real feedback from professionals who transformed their careers with our industry-leading certification training programs
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="site-glass backdrop-blur-sm rounded-2xl p-6 site-border border hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                  <div className="text-3xl font-black site-text-primary mb-2">{stat.number}</div>
                  <div className="text-sm site-text-secondary font-medium mb-1">{stat.label}</div>
                  <div className="text-xs site-text-muted">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 site-section-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredTestimonials.length === 0 ? (
            <div className="text-center py-12">
              <div className="site-glass backdrop-blur-xl rounded-3xl p-12 site-border border">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold site-text-primary mb-4">No Reviews Found</h3>
                <p className="site-text-secondary mb-6">
                  Try adjusting your filters or search terms to find reviews
                </p>
                <button
                  onClick={() => {
                    setSelectedCertification("All Certifications");
                    setSelectedIndustry("All Industries");
                    setSearchTerm("");
                  }}
                  className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedTestimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="site-glass backdrop-blur-xl rounded-3xl p-6 site-border border shadow-2xl hover:bg-white/15 site-light:hover:bg-white/70 transition-all duration-500 hover:scale-105 group cursor-pointer"
                    onClick={() => setSelectedReview(testimonial)}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white/20 site-light:ring-slate-300">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#10B981] rounded-lg flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold site-text-primary group-hover:text-[#4F46E5] transition-colors">
                          {testimonial.name}
                        </h3>
                        <p className="site-text-secondary text-sm">{testimonial.position}</p>
                        <p className="site-text-muted text-xs">{testimonial.company}</p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>

                    {/* Content Preview */}
                    <blockquote className="text-site-text-primary leading-relaxed mb-6 line-clamp-4">
                      "{testimonial.content}"
                    </blockquote>

                    {/* Certification Badge */}
                    <div className="flex items-center justify-between">
                      <div className="bg-gradient-to-r from-[#4F46E5]/20 to-[#7C3AED]/20 site-light:from-[#4F46E5]/30 site-light:to-[#7C3AED]/30 rounded-xl px-3 py-1 border border-[#4F46E5]/30">
                        <span className="text-[#4F46E5] text-sm font-semibold">{testimonial.certification}</span>
                      </div>
                      <div className="text-[#10B981] text-sm font-bold">
                        {testimonial.achievement}
                      </div>
                    </div>

                    {/* Read More Indicator */}
                    <div className="mt-4 text-center">
                      <span className="text-[#4F46E5] text-sm font-semibold group-hover:underline">
                        Read Full Story →
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 site-glass rounded-xl site-border border site-text-primary hover:bg-white/10 site-light:hover:bg-white/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                            currentPage === i + 1
                              ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white'
                              : 'site-glass site-border border site-text-primary hover:bg-white/10 site-light:hover:bg-white/60'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 site-glass rounded-xl site-border border site-text-primary hover:bg-white/10 site-light:hover:bg-white/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 site-section-bg relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="site-glass backdrop-blur-xl rounded-3xl p-12 site-border border shadow-2xl">
            <h2 className="text-4xl font-black site-text-primary mb-6">
              Ready to Join Our <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">Success Stories?</span>
            </h2>
            <p className="text-xl site-text-secondary mb-8 max-w-2xl mx-auto">
              Transform your career with industry-leading certification training. Join thousands of professionals who have already accelerated their success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#4F46E5]/25"
              >
                Browse Certifications
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-3 site-text-primary px-8 py-4 rounded-2xl font-bold text-lg site-border border transition-all duration-300 hover:bg-white/10 site-light:hover:bg-white/60"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Get Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80">
          <div className="site-glass backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto site-border border shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-6 right-6 w-10 h-10 site-glass rounded-full flex items-center justify-center site-text-primary hover:bg-white/20 site-light:hover:bg-white/60 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-white/20 site-light:ring-slate-300">
                  <Image
                    src={selectedReview.image}
                    alt={selectedReview.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-[#10B981] rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold site-text-primary mb-2">{selectedReview.name}</h2>
                <p className="text-xl site-text-secondary mb-1">{selectedReview.position}</p>
                <p className="site-text-muted">{selectedReview.company} • {selectedReview.location}</p>
                
                {/* Rating */}
                <div className="flex gap-1 mt-3">
                  {[...Array(selectedReview.rating)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-[#F59E0B]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                  <span className="ml-2 site-text-secondary text-sm">
                    Reviewed on {new Date(selectedReview.reviewDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Career Journey */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Journey Visualization */}
              <div>
                <h3 className="text-2xl font-bold site-text-primary mb-6">Career Transformation</h3>
                
                <div className="space-y-6">
                  {/* Before */}
                  <div className="site-glass rounded-2xl p-6 site-border border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm site-text-muted mb-1">BEFORE</div>
                        <div className="text-xl font-bold site-text-primary">{selectedReview.beforeRole}</div>
                      </div>
                      <div className="w-12 h-12 bg-gray-500/20 site-light:bg-slate-300/50 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 site-text-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>

                  {/* After */}
                  <div className="bg-gradient-to-r from-[#10B981]/20 to-[#059669]/20 site-light:from-[#10B981]/30 site-light:to-[#059669]/30 rounded-2xl p-6 border border-[#10B981]/30 site-light:border-[#10B981]/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-[#10B981] mb-1 font-semibold">AFTER</div>
                        <div className="text-xl font-bold site-text-primary">{selectedReview.afterRole}</div>
                      </div>
                      <div className="w-12 h-12 bg-[#10B981]/20 site-light:bg-[#10B981]/30 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div>
                <h3 className="text-2xl font-bold site-text-primary mb-6">Training Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="site-glass rounded-xl p-4 site-border border text-center">
                    <div className="text-2xl font-bold text-[#4F46E5] mb-1">{selectedReview.certification}</div>
                    <div className="text-xs site-text-muted">Certification</div>
                  </div>
                  <div className="site-glass rounded-xl p-4 site-border border text-center">
                    <div className="text-2xl font-bold text-[#F59E0B] mb-1">{selectedReview.courseDuration}</div>
                    <div className="text-xs site-text-muted">Course Duration</div>
                  </div>
                  <div className="site-glass rounded-xl p-4 site-border border text-center">
                    <div className="text-2xl font-bold text-[#10B981] mb-1">{selectedReview.timeframe}</div>
                    <div className="text-xs site-text-muted">To Success</div>
                  </div>
                  <div className="site-glass rounded-xl p-4 site-border border text-center">
                    <div className="text-2xl font-bold text-[#7C3AED] mb-1">{selectedReview.industry}</div>
                    <div className="text-xs site-text-muted">Industry</div>
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-r from-[#10B981]/20 to-[#059669]/20 site-light:from-[#10B981]/30 site-light:to-[#059669]/30 rounded-2xl p-4 border border-[#10B981]/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#10B981] mb-1">{selectedReview.achievement}</div>
                    <div className="text-sm site-text-secondary">Career Achievement</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Review */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold site-text-primary mb-4">Full Success Story</h3>
              <blockquote className="text-lg site-text-primary leading-relaxed italic">
                "{selectedReview.fullReview}"
              </blockquote>
            </div>

            {/* CTA */}
            <div className="text-center border-t border-white/20 site-light:border-slate-200 pt-8">
              <p className="site-text-secondary mb-6">
                Ready to start your own transformation journey?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/courses"
                  className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                >
                  Explore {selectedReview.certification} Training
                </Link>
                <Link
                  href="/contact"
                  className="site-text-primary px-6 py-3 rounded-xl font-semibold site-border border hover:bg-white/10 site-light:hover:bg-white/60 transition-all duration-300"
                >
                  Get Free Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
} 