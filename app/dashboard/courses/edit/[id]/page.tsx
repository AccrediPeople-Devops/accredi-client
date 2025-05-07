"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "../../../../components/Input";
import RichTextEditor from "../../../../components/RichTextEditor";
import ImageUpload from "../../../../components/ImageUpload";
import MultipleImageUpload from "../../../../components/MultipleImageUpload";
import KeyFeaturesInput from "../../../../components/KeyFeaturesInput";
import courseService from "../../../../components/service/course.service";
import courseCategoryService from "../../../../components/service/courseCategory.service";
import uploadService from "../../../../components/service/upload.service";
import config from "../../../../components/config/config";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";

interface FileUpload {
  url: string;
  key: string;
  _id?: string;
  path?: string;
}

interface CourseFormData {
  title: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  upload: {
    courseImage: FileUpload[];
    courseSampleCertificate: FileUpload[];
    courseBadge: FileUpload[];
  };
  keyFeatures: string[];
  broucher: FileUpload[];
}

interface CourseCategory {
  _id: string;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
}

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [initialFormState, setInitialFormState] =
    useState<CourseFormData | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    categoryId: "",
    shortDescription: "",
    description: "",
    upload: {
      courseImage: [],
      courseSampleCertificate: [],
      courseBadge: [],
    },
    keyFeatures: [],
    broucher: [],
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
        setError("Failed to load categories");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoadingCourse(true);
      setError("");

      try {
        // Fetch all courses instead of a specific course by ID
        const response = await courseService.getAllCourses();

        if (response && response.courses) {
          // Find the course with the matching ID
          const courseData = response.courses.find(
            (course: any) => course._id === params.id
          );

          if (courseData) {
            // Format the course data for display
            // Add url property to all file objects for display purposes
            if (courseData.upload) {
              // Process courseImage
              if (
                courseData.upload.courseImage &&
                courseData.upload.courseImage.length > 0
              ) {
                courseData.upload.courseImage =
                  courseData.upload.courseImage.map((img: any) => ({
                    ...img,
                    url: img.path ? `${config.imageUrl}${img.path}` : "",
                  }));
              }

              // Process courseSampleCertificate
              if (
                courseData.upload.courseSampleCertificate &&
                courseData.upload.courseSampleCertificate.length > 0
              ) {
                courseData.upload.courseSampleCertificate =
                  courseData.upload.courseSampleCertificate.map((img: any) => ({
                    ...img,
                    url: img.path ? `${config.imageUrl}${img.path}` : "",
                  }));
              }

              // Process courseBadge
              if (
                courseData.upload.courseBadge &&
                courseData.upload.courseBadge.length > 0
              ) {
                courseData.upload.courseBadge =
                  courseData.upload.courseBadge.map((img: any) => ({
                    ...img,
                    url: img.path ? `${config.imageUrl}${img.path}` : "",
                  }));
              }
            }

            // Process broucher
            if (courseData.broucher && courseData.broucher.length > 0) {
              courseData.broucher = courseData.broucher.map((img: any) => ({
                ...img,
                url: img.path ? `${config.imageUrl}${img.path}` : "",
              }));
            }

            setFormData(courseData);
            setInitialFormState(courseData);
          } else {
            setError("Course not found");
          }
        } else {
          setError("Failed to load course data");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setError("Error fetching course data");
      } finally {
        setIsLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [params.id, router]);

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleKeyFeaturesChange = (features: string[]) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: features,
    }));
  };

  const handleSingleImageUpload = async (
    type: "courseImage" | "courseSampleCertificate" | "broucher",
    file: FileUpload
  ) => {
    try {
      // When a file is selected from the UI, it will have a url but no path yet
      if (file.url && !file.path) {
        setIsUploadingImage(true);

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
        }
      } else if (!file.url) {
        // Handle removal - if url is empty
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
      console.error(`Error uploading ${type}:`, error);
      setError(`Failed to upload ${type}. Please try again.`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleMultipleImageUpload = async (
    type: "courseBadge",
    files: FileUpload[]
  ) => {
    try {
      // Find which files are new (have url but no path)
      const newFiles = files.filter((file) => file.url && !file.path);

      if (newFiles.length > 0) {
        setIsUploadingImage(true);

        // Process each new file for upload
        const uploadedFiles: FileUpload[] = [];
        const existingFiles = files.filter((file) => file.path);

        for (const file of newFiles) {
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
            uploadedFiles.push({
              url: `${config.imageUrl}${path}`,
              key: key,
              path: path,
            });
          }
        }

        // Update form data with all files (existing + newly uploaded)
        setFormData((prev) => ({
          ...prev,
          upload: {
            ...prev.upload,
            [type]: [...existingFiles, ...uploadedFiles],
          },
        }));
      } else if (files.length === 0) {
        // All files removed
        setFormData((prev) => ({
          ...prev,
          upload: {
            ...prev.upload,
            [type]: [],
          },
        }));
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setError(`Failed to upload ${type}. Please try again.`);
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
    if (formData.upload.courseBadge && formData.upload.courseBadge.length > 0) {
      preparedData.upload.courseBadge = formData.upload.courseBadge.map(
        (img) => ({
          key: img.key,
          path: img.path,
        })
      );
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

      // Prepare the data
      const preparedData = prepareDataForSubmission();

      // Submit the updated course data
      const response = await courseService.updateCourse(params.id, preparedData);

      if (response && response.course) {
        // Successfully updated course
        router.push("/dashboard/courses");
      } else {
        throw new Error("Failed to update course");
      }
    } catch (err: any) {
      console.error("Error updating course:", err);
      setError(err.message || "An error occurred while updating the course");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingCourse || isLoadingCategories) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" text="Loading course data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Edit Course
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Update course information and media
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
                htmlFor="shortDescription"
                className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
              >
                Short Description *
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
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
              />
            </div>

            <div>
              <label 
                className="block text-sm font-medium text-[var(--foreground-muted)] mb-2"
              >
                Course Badges
              </label>
              <MultipleImageUpload
                value={formData.upload.courseBadge}
                onChange={(files) =>
                  handleMultipleImageUpload("courseBadge", files)
                }
                maxImages={5}
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
                Updating Course...
              </>
            ) : (
              "Update Course"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
