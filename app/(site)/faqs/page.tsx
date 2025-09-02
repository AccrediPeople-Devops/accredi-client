"use client";

import React, { useState, useEffect } from "react";
import courseService from "@/app/components/service/course.service";
import RichTextRenderer from "@/app/components/RichTextRenderer";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
}

interface FAQ {
  _id: string;
  courseId: string;
  faqs: FAQItem[];
  createdAt: string;
  updatedAt: string;
}

interface Course {
  _id: string;
  title: string;
  faqId?: FAQ;
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<{ course: Course; faq: FAQ }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

  const fetchFAQs = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await courseService.getAllCourses();
      
      if (res?.courses) {
        // Extract courses that have FAQ data
        const coursesWithFAQs = res.courses
          .filter((course: Course) => course.faqId && course.faqId.faqs && course.faqId.faqs.length > 0)
          .map((course: Course) => ({
            course,
            faq: course.faqId!
          }));
        
        setFaqs(coursesWithFAQs);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching FAQs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const toggleAccordion = (faqId: string) => {
    const newOpenAccordions = new Set(openAccordions);
    if (newOpenAccordions.has(faqId)) {
      newOpenAccordions.delete(faqId);
    } else {
      newOpenAccordions.add(faqId);
    }
    setOpenAccordions(newOpenAccordions);
  };

  // Filter FAQs based on search term
  const filteredFAQs = faqs.filter(({ course, faq }) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      faq.faqs.some(
        (item) =>
          item.question.toLowerCase().includes(searchLower) ||
          item.answer.toLowerCase().includes(searchLower)
      )
    );
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--primary)]/10 via-[var(--background)] to-[var(--primary)]/5 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-[var(--foreground-muted)] mb-8 max-w-3xl mx-auto">
            Find answers to common questions about our courses, enrollment, and certification programs
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for questions, answers, or courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-12 text-lg border border-[var(--border)] rounded-[var(--radius-xl)] bg-[var(--card)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent shadow-lg"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[var(--foreground-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-[var(--radius-lg)] mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : filteredFAQs.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-16 w-16 text-[var(--foreground-muted)] mb-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-2xl font-semibold text-[var(--foreground)] mb-3">
                {searchTerm ? "No FAQs found" : "No FAQs available"}
              </h3>
              <p className="text-[var(--foreground-muted)] mb-6">
                {searchTerm
                  ? "Try adjusting your search terms or browse all FAQs."
                  : "FAQs will appear here once they are added to courses."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="inline-flex items-center px-4 py-2 bg-[var(--primary)] text-[var(--primary-text)] rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredFAQs.map(({ course, faq }) => (
              <div
                key={faq._id}
                className="bg-[var(--card)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-sm overflow-hidden"
              >
                {/* Course Header */}
                <div className="bg-gradient-to-r from-[var(--primary)]/5 to-transparent px-6 py-4 border-b border-[var(--border)]">
                  <h2 className="text-2xl font-bold text-[var(--foreground)] flex items-center">
                    <svg
                      className="w-6 h-6 mr-3 text-[var(--primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    {course.title}
                  </h2>
                  <p className="text-[var(--foreground-muted)] mt-1">
                    {faq.faqs.length} question{faq.faqs.length !== 1 ? 's' : ''} answered
                  </p>
                </div>

                {/* FAQ Items */}
                <div className="divide-y divide-[var(--border)]">
                  {faq.faqs.map((item, index) => (
                    <div key={item._id} className="transition-all duration-200">
                      <button
                        onClick={() => toggleAccordion(`${faq._id}-${item._id}`)}
                        className="w-full px-6 py-6 text-left hover:bg-[var(--input-bg)] transition-colors focus:outline-none focus:bg-[var(--input-bg)]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-semibold text-[var(--foreground)] pr-4">
                            <RichTextRenderer content={item.question} />
                          </div>
                          <svg
                            className={`w-5 h-5 text-[var(--primary)] transition-transform duration-200 flex-shrink-0 ${
                              openAccordions.has(`${faq._id}-${item._id}`) ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </button>
                      
                      {openAccordions.has(`${faq._id}-${item._id}`) && (
                        <div className="px-6 pb-6 transition-all duration-200">
                          <div className="bg-[var(--input-bg)] rounded-[var(--radius-lg)] p-4 border-l-4 border-[var(--primary)]">
                            <RichTextRenderer content={item.answer} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Section */}
        {!isLoading && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--primary)]/5 rounded-[var(--radius-xl)] p-8 border border-[var(--border)]">
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">
                Still have questions?
              </h3>
              <p className="text-[var(--foreground-muted)] mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our support team is here to help you with any questions about our courses and certification programs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-[var(--primary)] text-[var(--primary-text)] rounded-[var(--radius-lg)] hover:bg-[var(--primary-hover)] transition-colors font-medium"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contact Support
                </a>
                <a
                  href="/courses"
                  className="inline-flex items-center px-6 py-3 bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-lg)] hover:bg-[var(--input-bg)] transition-colors font-medium"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Browse Courses
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 