"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReviewForm from "@/app/components/reviews/ReviewForm";
import { Review } from "@/app/types/review";
import ReviewService from "@/app/components/service/review.service";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

export default function AddReviewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAddReview = async (
    newReview: Omit<Review, "_id" | "createdAt" | "updatedAt" | "isDeleted">
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      // Create a payload that matches the validator schema
      const payload = {
        name: newReview.name,
        designation: newReview.designation,
        review: newReview.review,
        image: {
          path: newReview.image.path,
          key: newReview.image.key,
          _id: newReview.image._id,
        },
      };

      const res = await ReviewService.createReview(payload);
      
      // If the user wanted the review to be active, update the status
      if (newReview.isActive && res?.review?._id) {
        try {
          await ReviewService.updateReviewStatus(res.review._id, true);
        } catch (statusErr) {
        }
      }

      router.push("/dashboard/reviews");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error adding review");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Add New Review</h1>
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
            initialData={null}
            onSubmit={handleAddReview}
            onCancel={() => router.push("/dashboard/reviews")}
          />
        </div>
      </div>
    </div>
  );
} 