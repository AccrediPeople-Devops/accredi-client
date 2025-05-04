"use client";

import React, { useState, useEffect } from "react";
import { Review, ReviewFormData, ValidationError } from "../../types/review";
import uploadService from "../service/upload.service";
import config from "../config/config";

interface ReviewFormProps {
  initialData: Review | null;
  onSubmit: (data: ReviewFormData) => void;
  onCancel: () => void;
}

export default function ReviewForm({
  initialData,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    name: "",
    designation: "",
    review: "",
    image: {
      path: "",
      key: "",
    },
    isActive: true,
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        designation: initialData.designation,
        review: initialData.review,
        image: initialData.image,
        isActive: initialData.isActive,
      });

      if (initialData.image && initialData.image.path) {
        // Construct the image preview URL from path
        const previewUrl = `${config.imageUrl}${initialData.image.path}`;
        setImagePreview(previewUrl);
        setImagePath(initialData.image.key);
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Clear validation errors for this field
    setErrors(errors.filter((error) => error.field !== name));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);
      setIsUploadingImage(true);

      try {
        // Upload image to server
        const uploadResponse = await uploadService.uploadImage(file);
        console.log("Upload response:", uploadResponse);

        if (
          uploadResponse &&
          uploadResponse.upload &&
          uploadResponse.upload[0] &&
          uploadResponse.upload[0].path
        ) {
          // Get the path from the response
          const path = uploadResponse.upload[0].path;
          const key = uploadResponse.upload[0].key || path;
          const imageBaseUrl = config.imageUrl;
          const fullImageUrl = `${imageBaseUrl}${path}`;

          // Store the path in state for later deletion
          setImagePath(path);

          // Store the path and key in the form data according to ImageItem interface
          setFormData((prev) => ({
            ...prev,
            image: {
              path: path,
              key: key,
              _id: undefined,
            },
          }));

          // Update image preview with the constructed URL
          setImagePreview(fullImageUrl);
        } else {
          throw new Error("Invalid upload response");
        }

        // Clear errors
        setErrors(errors.filter((error) => error.field !== "image"));
      } catch (error) {
        console.error("Error uploading image:", error);
        setErrors((prev) => [
          ...prev.filter((e) => e.field !== "image"),
          {
            field: "image",
            message: "Failed to upload image. Please try again.",
          },
        ]);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleClearImage = async () => {
    if (imagePath) {
      try {
        // Call the delete API with the stored path
        await uploadService.deleteImage(imagePath);
        console.log("Image deleted successfully");
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }

    // Clear states regardless of API success
    setImagePreview(null);
    setImageFile(null);
    setImagePath(null);
    setFormData((prev) => ({
      ...prev,
      image: {
        path: "",
        key: "",
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!formData.name.trim()) {
      newErrors.push({
        field: "name",
        message: "Name is required",
      });
    }

    if (!formData.designation.trim()) {
      newErrors.push({
        field: "designation",
        message: "Designation is required",
      });
    }

    if (!formData.review.trim()) {
      newErrors.push({
        field: "review",
        message: "Review content is required",
      });
    }

    if (!imagePreview && !initialData?.image?.path) {
      newErrors.push({
        field: "image",
        message: "Profile image is required",
      });
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

      // Only try to upload a new image if we have an image file and it wasn't already uploaded
      if (imageFile && (!formData.image || !formData.image.path)) {
        try {
          setIsUploadingImage(true);
          const uploadResponse = await uploadService.uploadImage(imageFile);

          if (
            uploadResponse &&
            uploadResponse.upload &&
            uploadResponse.upload[0] &&
            uploadResponse.upload[0].path
          ) {
            const imagePath = uploadResponse.upload[0].path;
            const key = uploadResponse.upload[0].key || imagePath;
            const imageBaseUrl = config.imageUrl;
            const fullImageUrl = `${imageBaseUrl}${imagePath}`;

            updatedFormData.image = {
              path: imagePath,
              key: key,
              _id: undefined,
            };

            // Update image preview with the constructed URL
            setImagePreview(fullImageUrl);
          } else {
            throw new Error("Invalid upload response");
          }
        } catch (uploadError) {
          console.error(
            "Error uploading image during submission:",
            uploadError
          );
          throw new Error("Failed to upload image. Please try again.");
        } finally {
          setIsUploadingImage(false);
        }
      }

      onSubmit(updatedFormData);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors([
        ...errors,
        { field: "form", message: "Error submitting form. Please try again." },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName: string): string | null => {
    const error = errors.find((err) => err.field === fieldName);
    return error ? error.message : null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
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
            className={`mt-1 block w-full px-3 py-2 bg-[var(--background)] border ${
              getFieldError("name")
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-[var(--primary)]/30 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
            } rounded-[var(--radius-md)] shadow-sm`}
          />
          {getFieldError("name") && (
            <p className="mt-1 text-sm text-red-600">{getFieldError("name")}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="designation"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Designation
          </label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 bg-[var(--background)] border ${
              getFieldError("designation")
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-[var(--primary)]/30 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
            } rounded-[var(--radius-md)] shadow-sm`}
            placeholder="e.g. CEO at XYZ Company"
          />
          {getFieldError("designation") && (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError("designation")}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="review"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Review
          </label>
          <textarea
            id="review"
            name="review"
            value={formData.review}
            onChange={handleChange}
            rows={4}
            className={`mt-1 block w-full px-3 py-2 bg-[var(--background)] border ${
              getFieldError("review")
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-[var(--primary)]/30 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
            } rounded-[var(--radius-md)] shadow-sm`}
            placeholder="Write the testimonial content here"
          ></textarea>
          {getFieldError("review") && (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError("review")}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Profile Image
          </label>
          <div className="mt-1 flex items-center space-x-6">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
              disabled={isUploadingImage}
            />
            {imagePreview ? (
              <div className="relative">
                <div className="h-32 w-32 rounded-full overflow-hidden border border-[var(--primary)]/20">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  onClick={handleClearImage}
                  disabled={isUploadingImage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ) : isUploadingImage ? (
              <div className="flex flex-col items-center justify-center h-32 w-32 border-2 border-dashed border-[var(--primary)]/30 rounded-full">
                <svg
                  className="animate-spin h-8 w-8 text-[var(--primary)]"
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
                <span className="mt-2 text-sm text-[var(--foreground)]/70">
                  Uploading...
                </span>
              </div>
            ) : (
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center h-32 w-32 border-2 border-dashed border-[var(--primary)]/30 rounded-full cursor-pointer hover:bg-[var(--primary)]/5 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[var(--primary)]/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="mt-2 text-sm text-[var(--foreground)]/70">
                  Upload image
                </span>
              </label>
            )}
            {!imagePreview && !isUploadingImage && (
              <label
                htmlFor="image"
                className="text-sm text-[var(--foreground)]/70"
              >
                Please upload a profile image for the reviewer
              </label>
            )}
          </div>
          {getFieldError("image") && (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError("image")}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-[var(--primary)] border-[var(--primary)]/30 rounded"
          />
          <label
            htmlFor="isActive"
            className="ml-2 block text-sm text-[var(--foreground)]"
          >
            Active review (shown on the website)
          </label>
        </div>
      </div>

      {getFieldError("form") && (
        <div className="bg-red-50 border border-red-400 text-red-800 px-4 py-3 rounded relative">
          {getFieldError("form")}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 border border-[var(--primary)]/30 text-[var(--foreground)] rounded-[var(--radius-md)] hover:bg-[var(--primary)]/5 transition-colors"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--primary)] text-[var(--background)] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] hover:opacity-90 transition-opacity disabled:opacity-70"
          disabled={isSubmitting || isUploadingImage}
        >
          {isSubmitting ? (
            <span className="flex items-center">
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
              Saving...
            </span>
          ) : initialData ? (
            "Update Review"
          ) : (
            "Add Review"
          )}
        </button>
      </div>
    </form>
  );
}
