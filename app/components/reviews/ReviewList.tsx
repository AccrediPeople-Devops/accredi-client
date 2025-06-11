"use client";

import React from "react";
import Image from "next/image";
import { Review } from "../../types/review";
import config from "../config/config";

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
  onEdit: (review: Review) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  showDeletedUI?: boolean;
}

export default function ReviewList({
  reviews,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
  showDeletedUI = false,
}: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 border border-[var(--primary)]/10 rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] bg-[var(--background)]"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-[var(--primary)]/20"></div>
              <div className="flex-1">
                <div className="h-4 w-24 bg-[var(--primary)]/20 rounded mb-2"></div>
                <div className="h-3 w-32 bg-[var(--primary)]/10 rounded"></div>
              </div>
            </div>
            <div className="mt-3 h-16 bg-[var(--primary)]/10 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="mt-6 p-8 text-center border border-[var(--primary)]/10 rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] bg-[var(--background)]">
        <h3 className="text-lg font-medium text-[var(--foreground)]/80">
          No reviews have been added yet
        </h3>
        <p className="mt-2 text-[var(--foreground)]/60">
          Add your first review to get started
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map((review) => (
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
              <button
                className="p-1 rounded-full hover:bg-[var(--primary)]/10 text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
                onClick={() => onEdit(review)}
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
              </button>
              <button
                className="p-1 rounded-full hover:bg-red-100 text-[var(--foreground)]/70 hover:text-red-600 transition-colors"
                onClick={() => onDelete(review._id)}
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
                  onChange={() => onToggleActive(review._id, !review.isActive)}
                  aria-label={`Toggle active state for ${review.name}`}
                />
                <div className="w-9 h-5 bg-[var(--input-bg)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--primary)]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary)]"></div>
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
