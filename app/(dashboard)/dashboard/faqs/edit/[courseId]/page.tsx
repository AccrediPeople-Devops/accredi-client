"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import faqService from "@/app/components/service/faq.service";
import courseService from "@/app/components/service/course.service";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

interface Course {
  _id: string;
  title: string;
  categoryId: string;
  isActive: boolean;
  isDeleted: boolean;
}

interface FaqItem {
  question: string;
  answer: string;
}

export default function EditFaqPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>([{ question: "", answer: "" }]);
  const [faqId, setFaqId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const fetchData = async () => {
    setIsLoadingData(true);
    setError("");
    
    try {
      // Fetch course details and existing FAQs in parallel
      const [courseRes, faqRes] = await Promise.all([
        courseService.getCourseById(courseId),
        faqService.getFaqsByCourse(courseId)
      ]);

      console.log("Course data:", courseRes);
      console.log("FAQ data:", faqRes);

      // Set course data
      if (courseRes?.course) {
        setCourse(courseRes.course);
      } else {
        setError("Course not found");
        return;
      }

      // Set FAQ data
      if (faqRes?.faqs && faqRes.faqs.length > 0) {
        // Find the FAQ entry for this course
        const courseFaqs = faqRes.faqs.find((faqEntry: any) => faqEntry.courseId === courseId);
        if (courseFaqs && courseFaqs.faqs && courseFaqs.faqs.length > 0) {
          setFaqs(courseFaqs.faqs);
          setFaqId(courseFaqs._id); // Store the FAQ ID for updating
        }
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Error fetching data. Please try again.");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  const addFaqItem = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFaqItem = (index: number) => {
    if (faqs.length > 1) {
      const newFaqs = faqs.filter((_, i) => i !== index);
      setFaqs(newFaqs);
    }
  };

  const updateFaqItem = (index: number, field: keyof FaqItem, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
    
    // Clear field-specific error when user starts typing
    const errorKey = `faq_${index}_${field}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    faqs.forEach((faq, index) => {
      if (!faq.question.trim()) {
        newErrors[`faq_${index}_question`] = "Question is required";
      }
      if (!faq.answer.trim()) {
        newErrors[`faq_${index}_answer`] = "Answer is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("=== UPDATE FAQ OPERATION START ===");
      console.log("Course ID:", courseId);
      console.log("FAQs to update:", faqs);

      // Filter out empty FAQs and trim values
      const validFaqs = faqs
        .filter(faq => faq.question.trim() && faq.answer.trim())
        .map(faq => ({
          question: faq.question.trim(),
          answer: faq.answer.trim()
        }));

      if (validFaqs.length === 0) {
        setError("Please add at least one FAQ with both question and answer.");
        return;
      }

      // Use the appropriate method based on whether we have an existing FAQ ID
      if (faqId) {
        // Update existing FAQs using PUT endpoint
        await faqService.updateFaqs(faqId, courseId, validFaqs);
        console.log("FAQ update successful (PUT)");
      } else {
        // Create new FAQs using POST endpoint
        await faqService.createOrUpdateFaqs(courseId, validFaqs);
        console.log("FAQ create successful (POST)");
      }

      // Redirect to FAQ list page
      router.push("/dashboard/faqs");
      console.log("=== UPDATE FAQ OPERATION SUCCESS ===");
    } catch (err: any) {
      console.log("=== UPDATE FAQ OPERATION FAILED ===");
      console.error("Update failed:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error updating FAQs. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="p-6 bg-[var(--background)] min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="p-6 bg-[var(--background)] min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[var(--radius-md)]">
            {error}
            <div className="mt-4">
              <Link
                href="/dashboard/faqs"
                className="inline-flex items-center px-4 py-2 text-[var(--primary)] bg-[var(--primary)]/10 rounded-[var(--radius-md)] hover:bg-[var(--primary)]/20 transition-colors font-medium"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[var(--background)] min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
              Edit FAQs
            </h1>
            <p className="text-[var(--foreground-muted)]">
              Update frequently asked questions for: <span className="font-medium">{course?.title}</span>
            </p>
          </div>
          <Link
            href="/dashboard/faqs"
            className="inline-flex items-center px-4 py-2 text-[var(--foreground)] bg-[var(--input-bg)] rounded-[var(--radius-md)] hover:bg-[var(--border)] transition-colors font-medium"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to FAQs
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[var(--radius-md)] mb-6">
            {error}
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-6">
          {/* Course Info */}
          <div className="mb-6 p-4 bg-[var(--input-bg)]/50 rounded-[var(--radius-md)] border border-[var(--border)]">
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
              Course Information
            </h3>
            <p className="text-[var(--foreground-muted)]">
              <span className="font-medium">Course:</span> {course?.title}
            </p>
          </div>

          {/* FAQs Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[var(--foreground)]">
                FAQs <span className="text-red-500">*</span>
              </h3>
              <button
                type="button"
                onClick={addFaqItem}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-[var(--primary)] bg-[var(--primary)]/10 rounded-[var(--radius-md)] hover:bg-[var(--primary)]/20 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add FAQ
              </button>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="p-4 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--input-bg)]/50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-[var(--foreground)]">
                      FAQ #{index + 1}
                    </h4>
                    {faqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFaqItem(index)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Question */}
                  <div className="mb-4">
                    <label
                      htmlFor={`question-${index}`}
                      className="block text-sm font-medium text-[var(--foreground)] mb-2"
                    >
                      Question <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id={`question-${index}`}
                      value={faq.question}
                      onChange={(e) => updateFaqItem(index, "question", e.target.value)}
                      placeholder="Enter the question..."
                      className={`w-full px-4 py-2 border rounded-[var(--radius-md)] bg-[var(--input-bg)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${
                        errors[`faq_${index}_question`] ? "border-red-500" : "border-[var(--border)]"
                      }`}
                    />
                    {errors[`faq_${index}_question`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`faq_${index}_question`]}
                      </p>
                    )}
                  </div>

                  {/* Answer */}
                  <div>
                    <label
                      htmlFor={`answer-${index}`}
                      className="block text-sm font-medium text-[var(--foreground)] mb-2"
                    >
                      Answer <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id={`answer-${index}`}
                      value={faq.answer}
                      onChange={(e) => updateFaqItem(index, "answer", e.target.value)}
                      placeholder="Enter the answer..."
                      rows={4}
                      className={`w-full px-4 py-2 border rounded-[var(--radius-md)] bg-[var(--input-bg)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-vertical ${
                        errors[`faq_${index}_answer`] ? "border-red-500" : "border-[var(--border)]"
                      }`}
                    />
                    {errors[`faq_${index}_answer`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`faq_${index}_answer`]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-[var(--border)]">
            <Link
              href="/dashboard/faqs"
              className="px-6 py-2 text-[var(--foreground)] bg-[var(--input-bg)] rounded-[var(--radius-md)] hover:bg-[var(--border)] transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-6 py-2 bg-[var(--primary)] text-[var(--primary-text)] rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 