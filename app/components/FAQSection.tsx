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

interface FAQSectionProps {
  courseId?: string; // If provided, shows FAQs for specific course only
  title?: string;
  subtitle?: string;
  maxItems?: number; // Limit number of FAQ items to show
  showSearch?: boolean;
  showCourseTitle?: boolean;
  className?: string;
}

export default function FAQSection({
  courseId,
  title = "Frequently Asked Questions",
  subtitle = "Find answers to common questions",
  maxItems,
  showSearch = true,
  showCourseTitle = true,
  className = ""
}: FAQSectionProps) {
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
        let coursesWithFAQs = res.courses
          .filter((course: Course) => course.faqId && course.faqId.faqs && course.faqId.faqs.length > 0)
          .map((course: Course) => ({
            course,
            faq: course.faqId!
          }));

                 // If courseId is provided, filter to show only that course's FAQs
         if (courseId) {
           coursesWithFAQs = coursesWithFAQs.filter(({ course }: { course: Course }) => course._id === courseId);
         }
        
        setFaqs(coursesWithFAQs);
      }
    } catch (err: any) {
      console.error("Error fetching FAQs:", err);
      setError(err.response?.data?.message || "Error fetching FAQs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [courseId]);

  const toggleAccordion = (faqId: string) => {
    const newOpenAccordions = new Set(openAccordions);
    if (newOpenAccordions.has(faqId)) {
      newOpenAccordions.delete(faqId);
    } else {
      newOpenAccordions.add(faqId);
    }
    setOpenAccordions(newOpenAccordions);
  };

  // Filter and limit FAQs
  const processedFAQs = faqs
    .filter(({ course, faq }) => {
      if (!showSearch || !searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        course.title.toLowerCase().includes(searchLower) ||
        faq.faqs.some(
          (item) =>
            item.question.toLowerCase().includes(searchLower) ||
            item.answer.toLowerCase().includes(searchLower)
        )
      );
    })
    .map(({ course, faq }) => ({
      course,
      faq: {
        ...faq,
        faqs: maxItems ? faq.faqs.slice(0, maxItems) : faq.faqs
      }
    }));

  if (isLoading) {
    return (
      <div className={`py-12 ${className}`}>
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-12 ${className}`}>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-[var(--radius-lg)]">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (processedFAQs.length === 0) {
    return (
      <div className={`py-12 ${className}`}>
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-[var(--foreground-muted)] mb-4"
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
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            No FAQs available
          </h3>
          <p className="text-[var(--foreground-muted)]">
            FAQs will appear here once they are added.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-12 ${className}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
          {title}
        </h2>
        <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto mb-8">
          {subtitle}
        </p>
        
        {/* Search Bar */}
        {showSearch && (
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--card)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]"
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
        )}
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {processedFAQs.map(({ course, faq }) => (
          <div
            key={faq._id}
            className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-sm overflow-hidden"
          >
            {/* Course Header - only show if not filtering by specific course and showCourseTitle is true */}
            {!courseId && showCourseTitle && (
              <div className="bg-[var(--primary)]/5 px-6 py-3 border-b border-[var(--border)]">
                <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-[var(--primary)]"
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
                </h3>
              </div>
            )}

            {/* FAQ Items */}
            <div className="divide-y divide-[var(--border)]">
              {faq.faqs.map((item) => (
                <div key={item._id} className="transition-all duration-200">
                  <button
                    onClick={() => toggleAccordion(`${faq._id}-${item._id}`)}
                    className="w-full px-6 py-5 text-left hover:bg-[var(--input-bg)] transition-colors focus:outline-none focus:bg-[var(--input-bg)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-base font-semibold text-[var(--foreground)] pr-4">
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
                    <div className="px-6 pb-5 transition-all duration-200">
                      <div className="bg-[var(--input-bg)] rounded-[var(--radius-md)] p-4 border-l-4 border-[var(--primary)]">
                        <RichTextRenderer 
                          content={item.answer} 
                          className="text-[var(--foreground)] leading-relaxed"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* View All Link - show only if maxItems is set and there are more items */}
      {maxItems && faqs.some(({ faq }) => faq.faqs.length > maxItems) && (
        <div className="text-center mt-8">
          <a
            href="/faqs"
            className="inline-flex items-center px-6 py-3 bg-[var(--primary)] text-[var(--primary-text)] rounded-[var(--radius-lg)] hover:bg-[var(--primary-hover)] transition-colors font-medium"
          >
            View All FAQs
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
} 