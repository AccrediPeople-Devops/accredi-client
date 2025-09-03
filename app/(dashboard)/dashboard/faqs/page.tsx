"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import faqService from "@/app/components/service/faq.service";
import courseService from "@/app/components/service/course.service";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import Modal from "@/app/components/Modal";

interface FAQ {
  _id?: string;
  courseId: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  courseName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Course {
  _id: string;
  title: string;
  categoryId: string;
  isActive: boolean;
  isDeleted: boolean;
}

export default function FaqsPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchFaqs = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await faqService.getAllFaqs();
      if (res?.faqs) {
        setFaqs(res.faqs);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching FAQs");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await courseService.getAllCourses();
      if (res?.courses) {
        setCourses(
          res.courses.filter(
            (course: Course) => course.isActive && !course.isDeleted
          )
        );
      }
    } catch (err: any) {
    }
  };

  useEffect(() => {
    fetchFaqs();
    fetchCourses();
  }, []);

  const getCourseName = (courseId: string) => {
    const course = courses.find((c) => c._id === courseId);
    return course ? course.title : "Unknown Course";
  };

  // Filter FAQs based on search and course filter
  const filteredFaqs = faqs.filter((faq) => {
    const courseName = getCourseName(faq.courseId);
    const matchesSearch = 
      courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.faqs.some(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCourse = selectedCourse === "" || faq.courseId === selectedCourse;

    return matchesSearch && matchesCourse;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteClick = (faqId: string) => {
    setFaqToDelete(faqId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!faqToDelete) return;

    setIsDeleting(faqToDelete);

    try {

      await faqService.deleteFaqById(faqToDelete);

      // Refresh the FAQs data
      await fetchFaqs();
      setShowDeleteModal(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error deleting FAQ. Please try again."
      );
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="p-6 bg-[var(--background)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
              FAQ Management
            </h1>
            <p className="text-[var(--foreground-muted)]">
              Manage frequently asked questions for courses
            </p>
          </div>
          <Link
            href="/dashboard/faqs/create"
            className="inline-flex items-center px-4 py-2 bg-[var(--primary)] text-[var(--primary-text)] rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors font-medium"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add FAQs
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-[var(--foreground)] mb-2"
              >
                Search FAQs
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by course, question, or answer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--input-bg)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="course-filter"
                className="block text-sm font-medium text-[var(--foreground)] mb-2"
              >
                Filter by Course
              </label>
              <select
                id="course-filter"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--input-bg)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[var(--radius-md)] mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          /* FAQs List */
          <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-[var(--foreground-muted)] mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                  No FAQs found
                </h3>
                <p className="text-[var(--foreground-muted)] mb-4">
                  {searchTerm || selectedCourse
                    ? "No FAQs match your current filters."
                    : "Get started by creating your first FAQ."}
                </p>
                <Link
                  href="/dashboard/faqs/create"
                  className="inline-flex items-center px-4 py-2 bg-[var(--primary)] text-[var(--primary-text)] rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors font-medium"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Your First FAQ
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {filteredFaqs.map((faq) => (
                  <div key={faq.courseId} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                          {getCourseName(faq.courseId)}
                        </h3>
                        <div className="flex items-center text-sm text-[var(--foreground-muted)] space-x-4">
                          <span>{faq.faqs.length} FAQ{faq.faqs.length !== 1 ? 's' : ''}</span>
                          {faq.updatedAt && (
                            <span>Updated: {formatDate(faq.updatedAt)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/dashboard/faqs/edit/${faq.courseId}`}
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(faq._id || faq.courseId)}
                          disabled={isDeleting === (faq._id || faq.courseId)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-[var(--radius-md)] hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          {isDeleting === (faq._id || faq.courseId) ? (
                            <LoadingSpinner size="small" />
                          ) : (
                            <>
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* FAQ Preview */}
                    <div className="space-y-3">
                      {faq.faqs.slice(0, 2).map((item, index) => (
                        <div key={index} className="border-l-4 border-[var(--primary)] pl-4">
                          <h4 className="font-medium text-[var(--foreground)] mb-1">
                            {item.question}
                          </h4>
                          <p className="text-sm text-[var(--foreground-muted)] line-clamp-2">
                            {item.answer}
                          </p>
                        </div>
                      ))}
                      {faq.faqs.length > 2 && (
                        <p className="text-sm text-[var(--foreground-muted)] italic">
                          +{faq.faqs.length - 2} more FAQ{faq.faqs.length - 2 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete FAQs"
          description="Are you sure you want to delete this FAQ entry? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          isConfirming={isDeleting !== null}
          variant="danger"
        />
      </div>
    </div>
  );
} 