"use client";

import React, { useState, useEffect } from "react";
import {
  CourseCategory,
  ImageItem,
  ValidationError,
} from "../../types/courseCategory";
import { getCategoryPlaceholderImage } from "../../utils/imageUtils";
import uploadService from "../service/upload.service";
import EnhancedImageUpload from "../EnhancedImageUpload";
import config from "../config/config";

interface CourseCategoryFormProps {
  initialData?: CourseCategory | null;
  initialCategory?: {
    name: string;
    description: string;
    image: ImageItem[];
    isActive: boolean;
  };
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  submitButtonText?: string;
}

export default function CourseCategoryForm({
  initialData,
  initialCategory,
  onSubmit,
  onCancel,
  submitButtonText = "Save Changes",
}: CourseCategoryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: [] as ImageItem[],
    isActive: true,
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [currentImageData, setCurrentImageData] = useState<{ url: string; key: string; path?: string; isEmoji?: boolean } | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        image: initialData.image,
        isActive: initialData.isActive,
      });

      if (initialData.image && initialData.image.length > 0) {
        // Construct the image preview URL from path
        const previewUrl = initialData.image[0].path
          ? `${config.imageUrl}${initialData.image[0].path}`
          : initialData.image[0].url || '';
        setCurrentImageData({
          url: previewUrl,
          key: initialData.image[0].key,
          path: initialData.image[0].path,
        });
      }
    } else if (initialCategory) {
      setFormData({
        name: initialCategory.name,
        description: initialCategory.description,
        image: initialCategory.image,
        isActive: initialCategory.isActive,
      });

      if (initialCategory.image && initialCategory.image.length > 0) {
        // Construct the image preview URL from path
        const previewUrl = initialCategory.image[0].path
          ? `${config.imageUrl}${initialCategory.image[0].path}`
          : initialCategory.image[0].url || '';
        setCurrentImageData({
          url: previewUrl,
          key: initialCategory.image[0].key,
          path: initialCategory.image[0].path,
        });
      }
    }
  }, [initialData, initialCategory]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors for this field
    setErrors(errors.filter((error) => error.field !== name));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleImageChange = (imageData: { url: string; key: string; path?: string; isEmoji?: boolean }) => {
    // Update current image data
    setCurrentImageData(imageData);
    
    // Update form data according to ImageItem interface
    if (imageData.url && imageData.key) {
      setFormData((prev) => ({
        ...prev,
        image: [
          {
            path: imageData.path || imageData.key,
            key: imageData.key,
            _id: undefined,
          },
        ],
      }));
    } else {
      // Clear image from form data
      setFormData((prev) => ({
        ...prev,
        image: [],
      }));
      setCurrentImageData(null);
    }

    // Clear errors
    setErrors(errors.filter((error) => error.field !== "image"));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!formData.name.trim()) {
      newErrors.push({ field: "name", message: "Name is required" });
    }

    if (!formData.description.trim()) {
      newErrors.push({
        field: "description",
        message: "Description is required",
      });
    }

    if (!currentImageData && (!initialData?.image || initialData.image.length === 0)) {
      newErrors.push({ field: "image", message: "Image is required" });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let updatedFormData = { ...formData };

      // Image data is already handled by the enhanced upload component
      // No additional upload logic needed here as EnhancedImageUpload handles it

      // If editing, preserve the ID and other fields
      if (initialData) {
        onSubmit({
          ...initialData,
          ...updatedFormData,
          updatedAt: new Date().toISOString(),
        });
      } else {
        onSubmit(updatedFormData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors([
        ...errors,
        { field: "form", message: "Failed to submit form. Please try again." },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getError = (field: string): string | null => {
    const error = errors.find((e) => e.field === field);
    return error ? error.message : null;
  };

  return (
    <div className="bg-[var(--background)] border border-[var(--primary)]/10 rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">
        {initialData ? "Edit Category" : "Add New Category"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 bg-[var(--input-bg)] border ${
              getError("name") ? "border-red-500" : "border-[var(--primary)]/10"
            } rounded-[var(--radius-md)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50`}
            placeholder="Category name"
          />
          {getError("name") && (
            <p className="mt-1 text-sm text-red-500">{getError("name")}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 bg-[var(--input-bg)] border ${
              getError("description")
                ? "border-red-500"
                : "border-[var(--primary)]/10"
            } rounded-[var(--radius-md)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50`}
            placeholder="Category description"
          />
          {getError("description") && (
            <p className="mt-1 text-sm text-red-500">
              {getError("description")}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Category Image / Emoji *
          </label>
          <EnhancedImageUpload
            value={currentImageData || { url: "", key: "" }}
            onChange={handleImageChange}
            isLoading={isUploadingImage}
            allowEmoji={true}
            error={getError("image") || undefined}
          />
          <div className="mt-1 text-xs text-[var(--foreground-muted)]">
            💡 Upload an image or choose an emoji. Emojis are automatically converted to high-quality images with transparent backgrounds.
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)]/50 border-[var(--primary)]/30 rounded"
          />
          <label
            htmlFor="isActive"
            className="ml-2 block text-sm text-[var(--foreground)]"
          >
            Active
          </label>
        </div>

        {getError("form") && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-[var(--radius-md)]">
            {getError("form")}
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          {onCancel && (
          <button
            type="button"
            onClick={onCancel}
              className="px-4 py-2 border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] hover:bg-[var(--input-bg)] transition-colors"
              disabled={isSubmitting}
          >
            Cancel
          </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors flex items-center disabled:bg-[var(--primary)]/70 disabled:cursor-not-allowed"
            disabled={isSubmitting || isUploadingImage}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              submitButtonText
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
