"use client";

import React, { useState, useEffect } from "react";
import { Review } from "../../types/review";
import ReviewService from "../../components/service/review.service";
import uploadService from "../../components/service/upload.service";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import Link from "next/link";
import Image from "next/image";
import config from "../../components/config/config";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await ReviewService.getAllReviews();
      if (res?.reviews) {
        setReviews(res.reviews);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      fetchReviews();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error loading reviews");
    }
  }, []);

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      // Use the dedicated API for toggling active status
      const res = await ReviewService.updateReviewStatus(id, isActive);
      if (res) {
        // Update the review in the list with the response data
        setReviews(
          reviews.map((review) =>
            review._id === id
              ? {
                  ...review,
                  isActive: res.review?.isActive || isActive,
                }
              : review
          )
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error updating review status");
    }
  };

  const handleDeleteClick = (id: string) => {
    setReviewToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;

    setIsDeleting(true);

    try {
      // Get the review to be deleted for image cleanup
      const reviewToBeDeleted = reviews.find((rev) => rev._id === reviewToDelete);

      // Delete the associated image if it exists
      if (reviewToBeDeleted && reviewToBeDeleted.image && reviewToBeDeleted.image.key) {
        try {
          await uploadService.deleteImage(reviewToBeDeleted.image.key);
        } catch (error) {
          console.error(
            `Error deleting image with key ${reviewToBeDeleted.image.key}:`,
            error
          );
          // Continue with review deletion even if image deletion fails
        }
      }

      // Delete the review
      await ReviewService.deleteReview(reviewToDelete);
      
      // Hide the modal and refresh reviews
      setShowDeleteModal(false);
      setReviewToDelete(null);
      await fetchReviews();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting review");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter reviews to show only non-deleted items
  const filteredReviews = reviews.filter((review) => !review.isDeleted);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Customer Reviews
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Manage customer testimonials and feedback
          </p>
        </div>
        <Link
          href="/dashboard/reviews/add"
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] flex items-center gap-2 hover:bg-[var(--primary-hover)] transition-colors mt-4 sm:mt-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Review
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" text="Loading reviews..." />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="mt-6 p-8 text-center border border-[var(--primary)]/10 rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] bg-[var(--background)]">
          <h3 className="text-lg font-medium text-[var(--foreground)]/80">
            No reviews have been added yet
          </h3>
          <p className="mt-2 text-[var(--foreground)]/60">
            Add your first review to get started
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReviews.map((review) => (
            <div
              key={review._id}
              className={`p-4 border border-[var(--primary)]/10 rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] bg-[var(--background)] ${
                !review.isActive && "opacity-70"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {review.image && review.image.path ? (
                    <div className="relative h-16 w-16 rounded-full overflow-hidden border border-[var(--primary)]/20">
                      <Image
                        src={`${config.imageUrl}${review.image.path}`}
                        alt={review.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-[var(--foreground)]">
                      {review.name}
                    </h3>
                    <p className="text-sm text-[var(--foreground)]/70">
                      {review.designation}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-1">
                  <Link
                    href={`/dashboard/reviews/${review._id}`}
                    className="p-1 rounded-full hover:bg-[var(--primary)]/10 text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
                    title="View review details"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                  <Link
                    href={`/dashboard/reviews/edit/${review._id}`}
                    className="p-1 rounded-full hover:bg-[var(--primary)]/10 text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
                    title="Edit review"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </Link>
                  <button
                    className="p-1 rounded-full hover:bg-red-100 text-[var(--foreground)]/70 hover:text-red-600 transition-colors"
                    onClick={() => handleDeleteClick(review._id)}
                    title="Delete review"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-3 border-t border-[var(--primary)]/10 pt-3">
                <p className="text-[var(--foreground)]/80 text-sm line-clamp-3">
                  {review.review}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-[var(--foreground)]/70">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center">
                  <span className="text-sm text-[var(--foreground)]/70 mr-2">
                    {review.isActive ? "Active" : "Inactive"}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={review.isActive}
                      onChange={() => handleToggleActive(review._id, !review.isActive)}
                      aria-label={`Toggle active state for ${review.name}`}
                    />
                    <div className="w-9 h-5 bg-[var(--input-bg)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--primary)]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[var(--background)] rounded-[var(--radius-lg)] p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-[var(--foreground)]">Confirm Delete</h3>
            <p className="mt-2 text-[var(--foreground-muted)]">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="mt-4 flex space-x-2 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setReviewToDelete(null);
                }}
                className="px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-[var(--error)] text-white rounded-[var(--radius-md)] hover:bg-[var(--error)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <LoadingSpinner size="small" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
