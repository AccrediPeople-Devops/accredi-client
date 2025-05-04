"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "../../../../components/Input";
import RichTextEditor from "../../../../components/RichTextEditor";
import ImageUpload from "../../../../components/ImageUpload";
import MultipleImageUpload from "../../../../components/MultipleImageUpload";
import KeyFeaturesInput from "../../../../components/KeyFeaturesInput";

interface FileUpload {
  url: string;
  key: string;
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
    courseBadge: FileUpload[];
  };
  keyFeatures: string[];
  isActive: boolean;
  broucher: FileUpload[];
}

// Mock categories for dropdown
const categories = [
  { id: "67faba597db07ab585f64eae", name: "Programming" },
  { id: "67faba597db07ab585f64eaf", name: "Marketing" },
  { id: "67faba597db07ab585f64eb0", name: "Design" },
  { id: "67faba597db07ab585f64eb1", name: "Business" },
  { id: "67faba597db07ab585f64eb2", name: "Data Science" },
];

// Mock courses data for pre-filling form
const mockCoursesData: Record<string, CourseFormData> = {
  "1": {
    title: "Introduction to Web Development",
    categoryId: "67faba597db07ab585f64eae",
    shortDescription: "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
    description: "<p>This comprehensive course covers all the basics of web development, starting with HTML structure, CSS styling, and JavaScript functionality. You will build real-world projects and learn modern development practices.</p><ul><li>Understanding HTML5 semantics</li><li>CSS Grid and Flexbox</li><li>JavaScript fundamentals</li><li>Responsive design principles</li></ul>",
    upload: {
      courseImage: [{ url: "https://via.placeholder.com/500x300", key: "img1" }],
      courseSampleCertificate: [{ url: "https://via.placeholder.com/400x300", key: "cert1" }],
      courseBadge: [
        { url: "https://via.placeholder.com/100", key: "badge1" },
        { url: "https://via.placeholder.com/100", key: "badge2" }
      ]
    },
    keyFeatures: [
      "Beginner-friendly content",
      "Hands-on projects",
      "Interactive coding exercises",
      "Certificate of completion"
    ],
    isActive: true,
    broucher: [{ url: "https://via.placeholder.com/800x600", key: "brochure1" }]
  },
  "2": {
    title: "Advanced JavaScript Patterns",
    categoryId: "67faba597db07ab585f64eae",
    shortDescription: "Master advanced JavaScript patterns and concepts for modern web development.",
    description: "<p>Take your JavaScript skills to the next level with this advanced course focused on design patterns, asynchronous programming, and modern ES6+ features.</p><p>You'll learn how to write clean, maintainable, and efficient JavaScript code for complex applications.</p>",
    upload: {
      courseImage: [{ url: "https://via.placeholder.com/500x300", key: "img2" }],
      courseSampleCertificate: [{ url: "https://via.placeholder.com/400x300", key: "cert2" }],
      courseBadge: [
        { url: "https://via.placeholder.com/100", key: "badge3" }
      ]
    },
    keyFeatures: [
      "Design patterns",
      "Functional programming",
      "Asynchronous JavaScript",
      "Performance optimization"
    ],
    isActive: true,
    broucher: [{ url: "https://via.placeholder.com/800x600", key: "brochure2" }]
  }
};

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
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
    isActive: true,
    broucher: [],
  });

  useEffect(() => {
    // In a real app, you would fetch course data from an API
    // For now, we'll use our mock data
    const fetchCourse = () => {
      setIsLoadingCourse(true);
      // Simulate API fetch delay
      setTimeout(() => {
        if (mockCoursesData[params.id]) {
          setFormData(mockCoursesData[params.id]);
        } else {
          // Course not found, redirect to courses page
          alert("Course not found");
          router.push("/dashboard/courses");
        }
        setIsLoadingCourse(false);
      }, 500);
    };

    fetchCourse();
  }, [params.id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  const handleSingleImageUpload = (
    type: "courseImage" | "courseSampleCertificate" | "broucher",
    file: FileUpload
  ) => {
    if (type === "broucher") {
      setFormData((prev) => ({
        ...prev,
        broucher: [file],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        upload: {
          ...prev.upload,
          [type]: [file],
        },
      }));
    }
  };

  const handleMultipleImageUpload = (type: "courseBadge", files: FileUpload[]) => {
    setFormData((prev) => ({
      ...prev,
      upload: {
        ...prev.upload,
        [type]: files,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real application, you would send this data to your backend
    // For now, we'll just simulate a delay and redirect
    console.log("Form data to update:", formData);
    
    setTimeout(() => {
      setIsLoading(false);
      alert("Course updated successfully");
      router.push(`/dashboard/courses/${params.id}`);
    }, 1500);
  };

  if (isLoadingCourse) {
    return (
      <div className="flex justify-center items-center h-96">
        <svg className="animate-spin h-10 w-10 text-[#5B2C6F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-[#2A2A2A] rounded-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Edit Course</h1>
        <p className="text-[#D7BDE2]">Update course information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#2A2A2A] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
          
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
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <RichTextEditor
            label="Short Description"
            value={formData.shortDescription}
            onChange={(value) => handleRichTextChange("shortDescription", value)}
            placeholder="Enter a brief description (max 150 characters)"
            maxLength={150}
            minHeight="100px"
            id="edit-short-description"
          />

          <RichTextEditor
            label="Full Description"
            value={formData.description}
            onChange={(value) => handleRichTextChange("description", value)}
            placeholder="Enter detailed course description"
            minHeight="250px"
            id="edit-full-description"
          />

          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-white mr-3">Active Course</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleCheckboxChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#3A3A55] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5B2C6F]"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-[#2A2A2A] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Media & Files</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                Course Thumbnail Image
              </label>
              <ImageUpload
                value={formData.upload.courseImage[0]}
                onChange={(file) => handleSingleImageUpload("courseImage", file)}
                shape="square"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                Sample Certificate
              </label>
              <ImageUpload
                value={formData.upload.courseSampleCertificate[0]}
                onChange={(file) => handleSingleImageUpload("courseSampleCertificate", file)}
                shape="square"
              />
            </div>
          </div>

          <div className="mb-6">
            <MultipleImageUpload
              label="Course Badges"
              value={formData.upload.courseBadge}
              onChange={(files) => handleMultipleImageUpload("courseBadge", files)}
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
          <h2 className="text-xl font-semibold text-white mb-4">Key Features</h2>
          
          <KeyFeaturesInput
            value={formData.keyFeatures}
            onChange={handleKeyFeaturesChange}
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push(`/dashboard/courses/${params.id}`)}
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
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
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