"use client";

import React, { useState, useEffect } from "react";
import ReviewList from "../../components/reviews/ReviewList";
import ReviewForm from "../../components/reviews/ReviewForm";
import { Review, ReviewFormData } from "../../types/review";
import ReviewService from "../../components/service/review.service";
import uploadService from "../../components/service/upload.service";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

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

  const addReview = async (review: Review) => {
    // Create a payload that matches the validator schema
    const payload = {
      name: review.name,
      designation: review.designation,
      review: review.review,
      image: {
        path: review.image.path,
        key: review.image.key,
        _id: review.image._id,
      },
    };

    const res = await ReviewService.createReview(payload);
    if (res) {
      return res;
    }
  };

  const updateReview = async (id: string, review: Review) => {
    // Create a payload that matches the validator schema
    const payload = {
      id,
      name: review.name,
      designation: review.designation,
      review: review.review,
      image: {
        path: review.image.path,
        key: review.image.key,
        _id: review.image._id,
      },
    };

    const res = await ReviewService.updateReview(id, payload);
    if (res) {
      return res;
    }
  };

  const deleteReview = async (id: string) => {
    // Get the review to be deleted
    const reviewToDelete = reviews.find((rev) => rev._id === id);

    // Delete the associated image first if it exists
    if (reviewToDelete && reviewToDelete.image && reviewToDelete.image.key) {
      try {
        // Use the upload service to delete the image by key
        await uploadService.deleteImage(reviewToDelete.image.key);
      } catch (error) {
        console.error(
          `Error deleting image with key ${reviewToDelete.image.key}:`,
          error
        );
        // Continue with review deletion even if image deletion fails
      }
    }

    // Now delete the review
    const res = await ReviewService.deleteReview(id);
    if (res) {
      return res;
    }
  };

  useEffect(() => {
    try {
      fetchReviews();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error loading reviews");
    }
  }, []);

  const handleAddReview = async (
    newReview: Omit<Review, "_id" | "createdAt" | "updatedAt" | "isDeleted">
  ) => {
    // Create a properly formatted review object with the correct structure
    const review: Review = {
      _id: `temp-id-${Date.now()}`,
      ...newReview,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await addReview(review);
      if (res) {
        // If the user wanted the review to be active, update the status
        if (newReview.isActive) {
          try {
            // Only call this if res.review exists and has an _id
            if (res.review && res.review._id) {
              await ReviewService.updateReviewStatus(res.review._id, true);
            }
          } catch (statusErr) {
            console.error("Error setting initial active status:", statusErr);
          }
        }

        // Refresh data to show the new review
        await fetchReviews();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error adding review");
    } finally {
      setIsFormOpen(false);
    }
  };

  const handleUpdateReview = async (formData: ReviewFormData) => {
    if (!editingReview) return;

    try {
      // Create updated review with existing id and timestamps
      const updatedReview: Review = {
        _id: editingReview._id,
        ...formData,
        isDeleted: editingReview.isDeleted,
        createdAt: editingReview.createdAt,
        updatedAt: new Date().toISOString(),
      };

      // First update the review details
      const res = await updateReview(updatedReview._id, updatedReview);

      // Store the original isActive state to check if it changed
      const originalReview = reviews.find((r) => r._id === updatedReview._id);
      const didActiveStatusChange =
        originalReview && originalReview.isActive !== updatedReview.isActive;

      // If the active status changed, update it separately
      if (didActiveStatusChange) {
        try {
          await ReviewService.updateReviewStatus(
            updatedReview._id,
            updatedReview.isActive
          );
        } catch (statusErr) {
          console.error("Error updating active status:", statusErr);
        }
      }

      // Refresh the data after update
      await fetchReviews();

      setEditingReview(null);
      setIsFormOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error updating review");
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      // Get the review to be deleted for image cleanup
      const reviewToDelete = reviews.find((rev) => rev._id === id);

      // Delete the associated image first if it exists
      if (reviewToDelete && reviewToDelete.image && reviewToDelete.image.key) {
        try {
          await uploadService.deleteImage(reviewToDelete.image.key);
        } catch (error) {
          console.error(
            `Error deleting image with key ${reviewToDelete.image.key}:`,
            error
          );
        }
      }

      // Now delete the review
      await deleteReview(id);

      // Refresh data after deletion
      await fetchReviews();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting review");
    }
  };

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

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setIsFormOpen(true);
  };

  // Filter reviews to show only non-deleted items
  const filteredReviews = reviews.filter((review) => !review.isDeleted);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Customer Reviews
        </h1>
        <button
          className="px-4 py-2 bg-[var(--primary)] text-[var(--background)] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] hover:opacity-90 transition-opacity mt-3 sm:mt-0"
          onClick={() => {
            setEditingReview(null);
            setIsFormOpen(true);
          }}
        >
          Add Review
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {isFormOpen && (
        <div className="mt-6 p-6 border border-[var(--primary)]/10 rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] bg-[var(--background)]">
          <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
            {editingReview ? "Edit Review" : "Add New Review"}
          </h2>
          <ReviewForm
            initialData={editingReview}
            onSubmit={editingReview ? handleUpdateReview : handleAddReview}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingReview(null);
            }}
          />
        </div>
      )}

      <ReviewList
        reviews={filteredReviews}
        isLoading={isLoading}
        onEdit={handleEditReview}
        onDelete={handleDeleteReview}
        onToggleActive={handleToggleActive}
        showDeletedUI={false}
      />
    </div>
  );
}
