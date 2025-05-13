"use client";

import React, { useState, useEffect } from "react";
import {
  CourseCategory,
  ImageItem,
  ValidationError,
} from "../../types/courseCategory";
import { getCategoryPlaceholderImage } from "../../utils/imageUtils";
import uploadService from "../service/upload.service";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
        setImagePreview(previewUrl);
        setImagePath(initialData.image[0].key);
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
        setImagePreview(previewUrl);
        setImagePath(initialCategory.image[0].key);
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
            image: [
              {
                path: path,
                key: key,
                _id: undefined,
              },
            ],
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
      image: [],
    }));
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

    if (!imageFile && (!initialData?.image || initialData.image.length === 0)) {
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

      // Only try to upload a new image if we have an image file and it wasn't already uploaded
      if (imageFile && (!formData.image || formData.image.length === 0)) {
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

            updatedFormData.image = [
              {
                path: imagePath,
                key: key,
                _id: undefined,
              },
            ];

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
          <label
            htmlFor="image"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Image
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
              disabled={isUploadingImage}
            />
            {imagePreview ? (
              <div className="relative h-32 w-32 mr-4 rounded-[var(--radius-md)] overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Category preview"
                  className="h-full w-full object-cover"
                />
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
              <div className="flex flex-col items-center justify-center h-32 w-32 border-2 border-dashed border-[var(--primary)]/30 rounded-[var(--radius-md)]">
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
                className="flex flex-col items-center justify-center h-32 w-32 border-2 border-dashed border-[var(--primary)]/30 rounded-[var(--radius-md)] cursor-pointer hover:border-[var(--primary)]/60 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[var(--primary)]/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
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
                className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-[var(--radius-md)] text-[var(--background)] bg-[var(--primary)] hover:bg-[var(--primary)]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
                tabIndex={0}
              >
                Browse
              </label>
            )}
          </div>
          {getError("image") && (
            <p className="mt-1 text-sm text-red-500">{getError("image")}</p>
          )}
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
