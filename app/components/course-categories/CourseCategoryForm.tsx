"use client";

import React, { useState, useEffect } from "react";
import {
  CourseCategory,
  ImageItem,
  ValidationError,
} from "../../types/courseCategory";
import { getCategoryPlaceholderImage } from "../../utils/imageUtils";

interface CourseCategoryFormProps {
  initialData: CourseCategory | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function CourseCategoryForm({
  initialData,
  onSubmit,
  onCancel,
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

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        image: initialData.image,
        isActive: initialData.isActive,
      });

      if (initialData.image && initialData.image.length > 0) {
        setImagePreview(initialData.image[0].url);
      }
    }
  }, [initialData]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear image errors
      setErrors(errors.filter((error) => error.field !== "image"));
    }
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
      // In a real application, you would upload the image file to your server/CDN
      // and get back a URL and key, then include that in your formData

      let updatedFormData = { ...formData };

      if (imageFile) {
        // Simulate image upload
        // In a real app, you would call your API to upload the image
        const mockUploadedImage: ImageItem = {
          url: imagePreview || getCategoryPlaceholderImage(formData.name),
          key: `${Date.now()}-${imageFile.name}`,
        };

        updatedFormData.image = [mockUploadedImage];
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
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                    if (initialData) {
                      setFormData({ ...formData, image: [] });
                    }
                  }}
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
            {!imagePreview && (
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

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            className="py-2 px-4 border border-[var(--primary)]/10 rounded-[var(--radius-md)] text-[var(--foreground)] hover:bg-[var(--primary)]/5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-4 shadow-sm text-[var(--background)] bg-[var(--primary)] rounded-[var(--radius-md)] hover:bg-[var(--primary)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
