"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/app/components/Input";
import RichTextEditor from "@/app/components/RichTextEditor";
import ImageUpload from "@/app/components/ImageUpload";
import EnhancedImageUpload from "@/app/components/EnhancedImageUpload";
import KeyFeaturesInput from "@/app/components/KeyFeaturesInput";
import ComponentsInput from "@/app/components/ComponentsInput";
import courseCategoryService from "@/app/components/service/courseCategory.service";
import courseService from "@/app/components/service/course.service";
import uploadService from "@/app/components/service/upload.service";
import config from "@/app/components/config/config";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { Course } from "@/app/types/course";

interface FileUpload {
  url: string;
  key: string;
  _id?: string;
  path?: string;
  isEmoji?: boolean;
}

interface ComponentItem {
  image: {
    path: string;
    key: string;
  };
  description: string;
  _id?: string;
}

interface CourseFormData {
  title: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  upload: {
    courseImage: FileUpload[];
    courseSampleCertificate: FileUpload[];
    courseBadge: FileUpload;
  };
  keyFeatures: string[];
  broucher: FileUpload[];
  components: ComponentItem[];
}

interface CourseCategory {
  _id: string;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
}

export default function AddCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    categoryId: "",
    shortDescription: "",
    description: "",
    upload: {
      courseImage: [],
      courseSampleCertificate: [],
      courseBadge: { url: "", key: "" },
    },
    keyFeatures: [],
    broucher: [],
    components: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await courseCategoryService.getAllCourseCategories();
        if (response && response.courseCategories) {
          // Filter categories that are active and not deleted
          const filteredCategories = response.courseCategories.filter(
            (category: CourseCategory) =>
              category.isActive && !category.isDeleted
          );
          setCategories(filteredCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load course categories");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRichTextChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKeyFeaturesChange = (features: string[]) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: features,
    }));
  };

  const handleComponentsChange = (components: ComponentItem[]) => {
    setFormData((prev) => ({
      ...prev,
      components,
    }));
  };

  const handleSingleImageUpload = async (
    type: "courseImage" | "courseSampleCertificate" | "broucher",
    file: FileUpload
  ) => {
    try {
      // When a file is selected from the UI, it will have a url but no path yet
      if (file.url && file.url !== "" && !file.path) {
        setIsUploadingImage(true);

        try {
          // Extract actual File object from the url (which is a Blob URL)
          const response = await fetch(file.url);
          const blob = await response.blob();
          const fileExtension = file.url.split(".").pop() || "jpg";
          const actualFile = new File([blob], `upload.${fileExtension}`, {
            type: blob.type,
          });

          // Upload to server
          const uploadResponse = await uploadService.uploadImage(actualFile);

          if (
            uploadResponse &&
            uploadResponse.upload &&
            uploadResponse.upload[0]
          ) {
            const uploadedFile = uploadResponse.upload[0];
            const path = uploadedFile.path;
            const key = uploadedFile.key || path;

            // Create a new file object with the server response
            const serverFile: FileUpload = {
              url: `${config.imageUrl}${path}`,
              key: key,
              path: path,
            };

            // Update form data with the new file
            if (type === "broucher") {
              setFormData((prev) => ({
                ...prev,
                broucher: [serverFile],
              }));
            } else {
              setFormData((prev) => ({
                ...prev,
                upload: {
                  ...prev.upload,
                  [type]: [serverFile],
                },
              }));
            }
          } else {
            throw new Error(`Failed to upload ${type}`);
          }
        } catch (err) {
          console.error(`Error uploading ${type}:`, err);
          setError(`Failed to upload ${type}. Please try again.`);
        } finally {
          setIsUploadingImage(false);
        }
      } else if (!file.url || file.url === "") {
        // Image was removed - deletion is now handled directly in the ImageUpload component
        if (type === "broucher") {
          setFormData((prev) => ({
            ...prev,
            broucher: [],
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            upload: {
              ...prev.upload,
              [type]: [],
            },
          }));
        }
      }
    } catch (error) {
      console.error(`Error handling ${type}:`, error);
      setError(`Failed to process ${type}. Please try again.`);
      setIsUploadingImage(false);
    }
  };

  const handleBadgeImageUpload = async (file: FileUpload) => {
    if (!file.url || file.url === "") {
      // Image was removed
      setFormData((prev) => ({
        ...prev,
        upload: {
          ...prev.upload,
          courseBadge: { url: "", key: "" },
        },
      }));
      return;
    }

    if (file.path) {
      // File already has path, just update form data
      setFormData((prev) => ({
        ...prev,
        upload: {
          ...prev.upload,
          courseBadge: file,
        },
      }));
      return;
    }

    setIsUploadingImage(true);

    try {
      // Handle emoji case
      if (file.isEmoji) {
        // For emoji, we don't need to upload to server, just save the data URL
        setFormData((prev) => ({
          ...prev,
          upload: {
            ...prev.upload,
            courseBadge: file,
          },
        }));
        return;
      }

      // Extract actual File object from the url (which is a Blob URL)
      const response = await fetch(file.url);
      const blob = await response.blob();
      const fileExtension = file.url.split(".").pop() || "jpg";
      const actualFile = new File([blob], `upload.${fileExtension}`, {
        type: blob.type,
      });

      // Upload to server
      const uploadResponse = await uploadService.uploadImage(actualFile);

      if (
        uploadResponse &&
        uploadResponse.upload &&
        uploadResponse.upload[0]
      ) {
        const uploadedFile = uploadResponse.upload[0];
        const path = uploadedFile.path;
        const key = uploadedFile.key || path;

        // Create a new file object with the server response
        const serverFile: FileUpload = {
          url: `${config.imageUrl}${path}`,
          key: key,
          path: path,
        };

        setFormData((prev) => ({
          ...prev,
          upload: {
            ...prev.upload,
            courseBadge: serverFile,
          },
        }));
      } else {
        throw new Error("Failed to upload course badge");
      }
    } catch (err) {
      console.error("Error uploading course badge:", err);
      setError("Failed to upload course badge. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const prepareDataForSubmission = () => {
    const preparedData: any = { ...formData };

    // Format for upload.courseImage
    if (
      formData.upload.courseImage &&
      formData.upload.courseImage.length > 0
    ) {
      preparedData.upload.courseImage = formData.upload.courseImage.map(
        (img) => ({
          key: img.key,
          path: img.path,
        })
      );
    }

    // Format for upload.courseSampleCertificate
    if (
      formData.upload.courseSampleCertificate &&
      formData.upload.courseSampleCertificate.length > 0
    ) {
      preparedData.upload.courseSampleCertificate =
        formData.upload.courseSampleCertificate.map((img) => ({
          key: img.key,
          path: img.path,
        }));
    }

    // Format for upload.courseBadge
    if (formData.upload.courseBadge && formData.upload.courseBadge.key && formData.upload.courseBadge.path) {
      preparedData.upload.courseBadge = {
        key: formData.upload.courseBadge.key,
        path: formData.upload.courseBadge.path,
      };
    }

    // Format for components
    if (formData.components && formData.components.length > 0) {
      preparedData.components = formData.components.map((component) => ({
        image: {
          key: component.image.key,
          path: component.image.path,
        },
        description: component.description,
      }));
    }

    // Format for broucher
    if (formData.broucher && formData.broucher.length > 0) {
      preparedData.broucher = formData.broucher.map((img) => ({
        key: img.key,
        path: img.path,
      }));
    }

    return preparedData;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title) {
        throw new Error("Course title is required");
      }
      if (!formData.categoryId) {
        throw new Error("Course category is required");
      }
      if (!formData.shortDescription) {
        throw new Error("Short description is required");
      }
      if (!formData.description) {
        throw new Error("Full description is required");
      }
      // Check for required course image
      if (!formData.upload.courseImage.length || 
          !formData.upload.courseImage[0].path ||
          !formData.upload.courseImage[0].key) {
        throw new Error("Course image is required");
      }

      // Prepare the data
      const preparedData = prepareDataForSubmission();
      
      console.log("Submitting course data:", preparedData);

      // Submit the course data
      const response = await courseService.createCourse(preparedData);
      
      console.log("API Response:", response);

      if (response && (response.course || response.status === "success" || response.status === true)) {
        // Successfully created course
        router.push("/dashboard/courses");
      } else {
        throw new Error("Failed to create course");
      }
    } catch (err: any) {
      console.error("Error creating course:", err);
      setError(err.message || "An error occurred while creating the course");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Add Course
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Create a new course with details
          </p>
        </div>
        <Link
          href="/dashboard/courses"
          className="px-4 py-2 bg-[var(--background)] text-[var(--foreground)] rounded-[var(--radius-md)] flex items-center gap-2 hover:bg-[var(--input-bg)] transition-colors border border-[var(--border)]"
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
          Back to Courses
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Loading state for categories */}
      {isLoadingCategories ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="medium" text="Loading categories..." />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  htmlFor="title" 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                >
                  Course Title *
                </label>
                <input 
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter course title"
                  className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  required
                />
              </div>

              <div>
                <label 
                  htmlFor="categoryId" 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                >
                  Category *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                >
                  Short Description *
                </label>
                <RichTextEditor
                  value={formData.shortDescription}
                  onChange={(value) => handleRichTextChange("shortDescription", value)}
                  placeholder="Brief description for the course"
                  minHeight="120px"
                />
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
              Full Description
            </h2>
            <div>
              <label 
                htmlFor="description"
                className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
              >
                Course Details *
              </label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => handleRichTextChange("description", value)}
              />
            </div>
          </div>

          {/* Media Uploads */}
          <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
              Media and Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-2"
                >
                  Course Image *
                </label>
                <ImageUpload
                  value={formData.upload.courseImage.length > 0
                    ? formData.upload.courseImage[0]
                    : { url: "", key: "" }}
                  onChange={(file) =>
                    handleSingleImageUpload("courseImage", file)
                  }
                  isLoading={isUploadingImage}
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-2"
                >
                  Certificate Sample
                </label>
                <ImageUpload
                  value={formData.upload.courseSampleCertificate.length > 0
                    ? formData.upload.courseSampleCertificate[0]
                    : { url: "", key: "" }}
                  onChange={(file) =>
                    handleSingleImageUpload("courseSampleCertificate", file)
                  }
                  isLoading={isUploadingImage}
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-2"
                >
                  Course Badge
                </label>
                <EnhancedImageUpload
                  value={formData.upload.courseBadge}
                  onChange={handleBadgeImageUpload}
                  isLoading={isUploadingImage}
                  allowEmoji={true}
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium text-[var(--foreground-muted)] mb-2"
                >
                  Course Brochure
                </label>
                <ImageUpload
                  value={formData.broucher.length > 0
                    ? formData.broucher[0]
                    : { url: "", key: "" }}
                  onChange={(file) =>
                    handleSingleImageUpload("broucher", file)
                  }
                  isLoading={isUploadingImage}
                />
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
              Key Features
            </h2>
            <div>
              <label 
                className="block text-sm font-medium text-[var(--foreground-muted)] mb-2"
              >
                Course Features
              </label>
              <KeyFeaturesInput
                value={formData.keyFeatures}
                onChange={handleKeyFeaturesChange}
                placeholder="Add feature and press Enter"
              />
            </div>
          </div>

          {/* Components */}
          <div className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
              Course Components
            </h2>
            <div>
              <label 
                className="block text-sm font-medium text-[var(--foreground-muted)] mb-2"
              >
                Add Components
              </label>
              <ComponentsInput
                value={formData.components}
                onChange={handleComponentsChange}
                isLoading={isUploadingImage}
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || isUploadingImage}
              className="px-6 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" className="text-white" />
                  Creating Course...
                </>
              ) : (
                "Create Course"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
