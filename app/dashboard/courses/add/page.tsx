"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "../../../components/Input";
import RichTextEditor from "../../../components/RichTextEditor";
import ImageUpload from "../../../components/ImageUpload";
import MultipleImageUpload from "../../../components/MultipleImageUpload";
import KeyFeaturesInput from "../../../components/KeyFeaturesInput";
import courseCategoryService from "../../../components/service/courseCategory.service";
import courseService from "../../../components/service/course.service";
import uploadService from "../../../components/service/upload.service";
import config from "../../../components/config/config";

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

export default function AddCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
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
      alert(`Failed to upload ${type}. Please try again.`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleMultipleImageUpload = async (
    type: "courseBadge",
    files: FileUpload[]
  ) => {
    try {
      // Process each file that has a url but no path (new uploads)
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          if (file.url && !file.path) {
            setIsUploadingImage(true);

            // Extract actual File object
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

              // Return the processed file
              return {
                url: `${config.imageUrl}${path}`,
                key: key,
                path: path,
              };
            }
            setIsUploadingImage(false);
          }
          // Return the original file if it already has a path or we couldn't process it
          return file;
        })
      );

      // Update form data with processed files
      setFormData((prev) => ({
        ...prev,
        upload: {
          ...prev.upload,
          [type]: processedFiles.filter(Boolean) as FileUpload[],
        },
      }));
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      alert(`Failed to upload ${type}. Please try again.`);
    }
  };

  // Function to prepare data for API submission
  const prepareDataForSubmission = () => {
    // Create a new object with the right format for the backend
    const submissionData = {
      title: formData.title,
      categoryId: formData.categoryId,
      shortDescription: formData.shortDescription,
      description: formData.description,
      keyFeatures: formData.keyFeatures,
      upload: {
        courseImage: formData.upload.courseImage.map((file) => ({
          path: file.path,
          key: file.key,
        })),
        courseSampleCertificate: formData.upload.courseSampleCertificate.map(
          (file) => ({
            path: file.path,
            key: file.key,
          })
        ),
        courseBadge: formData.upload.courseBadge.map((file) => ({
          path: file.path,
          key: file.key,
        })),
      },
      broucher: formData.broucher.map((file) => ({
        path: file.path,
        key: file.key,
      })),
    };

    return submissionData;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isUploadingImage) {
        alert("Please wait for images to finish uploading");
        setIsLoading(false);
        return;
      }

      // Prepare data in the format expected by the backend
      const submissionData = prepareDataForSubmission();

      // Send data to backend using the course service
      const response = await courseService.createCourse(submissionData);
      if (response && response.status) {
        alert("Course created successfully");
        router.push("/dashboard/courses");
      } else {
        alert("Error creating course");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Error creating course");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-[#2A2A2A] rounded-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Add New Course</h1>
        <p className="text-[#D7BDE2]">Create a new course in your catalog</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        aria-label="Add course form"
      >
        <div className="bg-[#2A2A2A] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Course Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter course title"
            />

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-white">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#2A2A2A] text-white border border-[#5B2C6F]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B2C6F]"
                required
                disabled={isLoadingCategories}
                aria-label="Course Category"
              >
                <option value="" disabled>
                  {isLoadingCategories
                    ? "Loading categories..."
                    : "Select a category"}
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <RichTextEditor
            label="Short Description"
            value={formData.shortDescription}
            onChange={(value) =>
              handleRichTextChange("shortDescription", value)
            }
            placeholder="Enter a brief description (max 150 characters)"
            maxLength={150}
            minHeight="100px"
          />

          <RichTextEditor
            label="Full Description"
            value={formData.description}
            onChange={(value) => handleRichTextChange("description", value)}
            placeholder="Enter detailed course description"
            minHeight="250px"
          />
        </div>

        <div className="bg-[#2A2A2A] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Media & Files
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                Course Thumbnail Image
              </label>
              <ImageUpload
                value={formData.upload.courseImage[0]}
                onChange={(file) =>
                  handleSingleImageUpload("courseImage", file)
                }
                shape="square"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                Sample Certificate
              </label>
              <ImageUpload
                value={formData.upload.courseSampleCertificate[0]}
                onChange={(file) =>
                  handleSingleImageUpload("courseSampleCertificate", file)
                }
                shape="square"
              />
            </div>
          </div>

          <div className="mb-6">
            <MultipleImageUpload
              label="Course Badges"
              value={formData.upload.courseBadge}
              onChange={(files) =>
                handleMultipleImageUpload("courseBadge", files)
              }
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-white">
              Course Brochure
            </label>
            <ImageUpload
              value={formData.broucher[0]}
              onChange={(file) => handleSingleImageUpload("broucher", file)}
              shape="rectangle"
            />
            <p className="text-xs text-white/50 mt-1">
              Upload a PDF or image file for the course brochure
            </p>
          </div>
        </div>

        <div className="bg-[#2A2A2A] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Key Features
          </h2>

          <KeyFeaturesInput
            value={formData.keyFeatures}
            onChange={handleKeyFeaturesChange}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/courses")}
            className="px-6 py-2 bg-transparent border border-[#5B2C6F] text-white rounded-lg hover:bg-[#5B2C6F]/10 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-[#5B2C6F] text-white rounded-lg hover:bg-[#5B2C6F]/90 transition-colors flex items-center"
          >
            {isLoading ? (
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
                Saving...
              </>
            ) : (
              <>Save Course</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
