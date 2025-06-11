"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReviewForm from "@/app/components/reviews/ReviewForm";
import { Review, ReviewFormData } from "@/app/types/review";
import ReviewService from "@/app/components/service/review.service";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

export default function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: reviewId } = use(params);
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  const handleUpdateReview = async (formData: ReviewFormData) => {
    if (!review) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Create a payload that matches the validator schema
      const payload = {
        id: reviewId,
        name: formData.name,
        designation: formData.designation,
        review: formData.review,
        image: {
          path: formData.image.path,
          key: formData.image.key,
          _id: formData.image._id,
        },
      };

      // Update the review details
      const res = await ReviewService.updateReview(reviewId, payload);

      // Check if active status changed
      if (review.isActive !== formData.isActive) {
        try {
          await ReviewService.updateReviewStatus(reviewId, formData.isActive);
        } catch (statusErr) {
          console.error("Error updating active status:", statusErr);
        }
      }

      router.push("/dashboard/reviews");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error updating review");
      setIsSubmitting(false);
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
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Review</h1>
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
          {error || "The review you are trying to edit does not exist or has been removed."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Review</h1>
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

      {/* Error message */}
      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
        <div className="p-6">
          <ReviewForm
            initialData={review}
            onSubmit={handleUpdateReview}
            onCancel={() => router.push("/dashboard/reviews")}
          />
        </div>
      </div>
    </div>
  );
} 