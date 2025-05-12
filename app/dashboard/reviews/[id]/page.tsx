"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Review } from "../../../types/review";
import ReviewService from "../../../components/service/review.service";
import uploadService from "../../../components/service/upload.service";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import config from "../../../components/config/config";

export default function ReviewDetailsPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const unwrappedParams = React.use(params as Promise<{ id: string }>);
  const reviewId = unwrappedParams.id;

  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await ReviewService.getAllReviews();
        if (res?.reviews) {
          const foundReview = res.reviews.find((r: Review) => r._id === reviewId);
          if (foundReview) {
            setReview(foundReview);
          } else {
            setError("Review not found");
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error fetching review");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReview();
  }, [reviewId]);

  const handleToggleActive = async () => {
    if (!review) return;

    try {
      const newActiveState = !review.isActive;
      const res = await ReviewService.updateReviewStatus(reviewId, newActiveState);
      if (res) {
        setReview({
          ...review,
          isActive: newActiveState,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error updating review status");
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!review) return;

    setIsDeleting(true);

    try {
      // Delete the associated image if it exists
      if (review.image && review.image.key) {
        try {
          await uploadService.deleteImage(review.image.key);
        } catch (error) {
          console.error(`Error deleting image with key ${review.image.key}:`, error);
          // Continue with review deletion even if image deletion fails
        }
      }

      // Delete the review
      await ReviewService.deleteReview(reviewId);
      
      // Navigate back to reviews list
      router.push("/dashboard/reviews");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting review");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" text="Loading review details..." />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Review Details</h1>
          <Link
            href="/dashboard/reviews"
            className="px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)] transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Reviews
          </Link>
        </div>
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error || "The review you are looking for does not exist or has been removed."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Review Details</h1>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/reviews/edit/${review._id}`}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
            onClick={handleDeleteClick}
            className="px-4 py-2 bg-[var(--error)] text-white rounded-[var(--radius-md)] hover:bg-[var(--error)]/90 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
          <Link
            href="/dashboard/reviews"
            className="px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)] transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </Link>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Review details card */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
          <h2 className="text-lg font-medium text-[var(--foreground)]">Review Information</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[var(--foreground)]/70">
              {review.isActive ? "Active" : "Inactive"}
            </span>
            <button
              onClick={handleToggleActive}
              className="relative inline-flex items-center cursor-pointer"
            >
              <div className={`w-10 h-5 rounded-full transition-all ${review.isActive ? 'bg-[var(--primary)]' : 'bg-[var(--input-bg)]'}`}>
                <div className={`absolute top-[2px] left-[2px] bg-white h-4 w-4 rounded-full shadow transform transition-transform ${review.isActive ? 'translate-x-5' : 'translate-x-0'}`}>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Reviewer image */}
          <div className="md:col-span-3 flex flex-col items-center">
            <div className="relative h-32 w-32 rounded-full overflow-hidden border border-[var(--primary)]/20 mb-4">
              {review.image && review.image.path ? (
                <Image
                  src={`${config.imageUrl}${review.image.path}`}
                  alt={review.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-[var(--primary)]/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-[var(--primary)]/50"
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
            </div>
          </div>

          {/* Review details */}
          <div className="md:col-span-9 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-1">Name</h3>
              <p className="text-lg font-medium text-[var(--foreground)]">{review.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-1">Designation</h3>
              <p className="text-[var(--foreground)]">{review.designation}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-1">Review</h3>
              <p className="text-[var(--foreground)] p-4 bg-[var(--input-bg)] rounded-[var(--radius-md)] border border-[var(--border)]">
                {review.review}
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-1">Added on</h3>
                <p className="text-[var(--foreground-muted)]">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-1">Last updated</h3>
                <p className="text-[var(--foreground-muted)]">
                  {new Date(review.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Warning about deletion */}
      <div className="p-4 bg-[var(--warning)]/10 border border-[var(--warning)]/30 text-[var(--warning)] rounded-[var(--radius-md)] flex items-start space-x-3">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 flex-shrink-0"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <div>
          <h3 className="font-medium">Warning</h3>
          <p>Once a review is deleted, it cannot be recovered. Please make sure you want to proceed with deletion.</p>
        </div>
      </div>

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
                onClick={() => setShowDeleteModal(false)}
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