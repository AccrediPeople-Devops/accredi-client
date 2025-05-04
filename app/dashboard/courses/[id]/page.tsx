"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface FileUpload {
  url: string;
  key: string;
  _id?: string;
}

interface Course {
  _id: string;
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
  createdAt: string;
}

// Mock categories
const categories = [
  { id: "67faba597db07ab585f64eae", name: "Programming" },
  { id: "67faba597db07ab585f64eaf", name: "Marketing" },
  { id: "67faba597db07ab585f64eb0", name: "Design" },
  { id: "67faba597db07ab585f64eb1", name: "Business" },
  { id: "67faba597db07ab585f64eb2", name: "Data Science" },
];

// Mock course data
const mockCourseData: Record<string, Course> = {
  "1": {
    _id: "1",
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
    broucher: [{ url: "https://via.placeholder.com/800x600", key: "brochure1" }],
    createdAt: "2023-04-15T10:30:00Z"
  },
  "2": {
    _id: "2",
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
    broucher: [{ url: "https://via.placeholder.com/800x600", key: "brochure2" }],
    createdAt: "2023-05-20T09:15:00Z"
  }
};

export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch the course data from your API
    // For now, we'll use the mock data
    const fetchCourse = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        if (mockCourseData[params.id]) {
          setCourse(mockCourseData[params.id]);
        }
        setLoading(false);
      }, 500);
    };

    fetchCourse();
  }, [params.id]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    
    // In a real app, you would make an API call here
    // For now, we'll just simulate a deletion
    setTimeout(() => {
      setIsDeleting(false);
      setShowDeleteModal(false);
      router.push("/dashboard/courses");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <svg className="animate-spin h-10 w-10 text-[#5B2C6F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-[#2A2A2A] rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Course Not Found</h1>
        <p className="text-white mb-6">The course you are looking for does not exist or has been removed.</p>
        <Link 
          href="/dashboard/courses"
          className="px-4 py-2 bg-[#5B2C6F] text-white rounded-lg hover:bg-[#5B2C6F]/90 transition-colors"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="p-6 bg-[#2A2A2A] rounded-xl flex flex-wrap justify-between items-center">
        <div>
          <div className="flex items-center mb-1">
            <Link
              href="/dashboard/courses"
              className="flex items-center text-[#D7BDE2] hover:text-white transition-colors mr-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Link>
            <h1 className="text-2xl font-bold text-white">{course.title}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-[#D7BDE2]">{getCategoryName(course.categoryId)}</span>
            <span className="w-1 h-1 bg-[#D7BDE2] rounded-full"></span>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              course.isActive 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              {course.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link 
            href={`/dashboard/courses/edit/${course._id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Course
          </Link>
          <button
            onClick={handleDeleteClick}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-[#2A2A2A] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
            
            <div className="mb-6">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                {course.upload.courseImage[0] && (
                  <Image 
                    src={course.upload.courseImage[0].url} 
                    alt={course.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-white mb-1">Short Description</h3>
              <p className="text-white/70">{course.shortDescription}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white mb-1">Full Description</h3>
              <div 
                className="text-white/70 prose prose-invert prose-sm max-w-none" 
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </div>
          </div>
          
          {/* Key Features */}
          <div className="bg-[#2A2A2A] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Key Features</h2>
            
            <div className="flex flex-wrap gap-2">
              {course.keyFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-[#5B2C6F]/20 text-white px-3 py-1.5 rounded-full"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
          
          {/* Course Brochure */}
          {course.broucher[0] && (
            <div className="bg-[#2A2A2A] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Course Brochure</h2>
              
              <div className="border border-[#3A3A55] rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#5B2C6F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="ml-3">
                    <div className="text-white font-medium">Course Brochure</div>
                    <div className="text-white/50 text-sm">PDF Document</div>
                  </div>
                </div>
                <a
                  href={course.broucher[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-[#5B2C6F] text-white text-sm rounded-lg hover:bg-[#5B2C6F]/90 transition-colors"
                >
                  Download
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Details */}
          <div className="bg-[#2A2A2A] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Details</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-white/50 mb-1">Category</h3>
                <p className="text-white">{getCategoryName(course.categoryId)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-white/50 mb-1">Added on</h3>
                <p className="text-white">{formatDate(course.createdAt)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-white/50 mb-1">Status</h3>
                <div className="mt-1">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    course.isActive 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {course.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Certificate & Badges */}
          <div className="bg-[#2A2A2A] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Certificate & Badges</h2>
            
            {course.upload.courseSampleCertificate[0] && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-white mb-2">Sample Certificate</h3>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image 
                    src={course.upload.courseSampleCertificate[0].url} 
                    alt="Sample Certificate"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            )}
            
            {course.upload.courseBadge.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-white mb-2">Course Badges</h3>
                <div className="grid grid-cols-3 gap-2">
                  {course.upload.courseBadge.map((badge, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image 
                        src={badge.url} 
                        alt={`Badge ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#2A2A2A] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-white mb-6">
              Are you sure you want to delete "{course.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-transparent border border-[#5B2C6F] text-white rounded-lg hover:bg-[#5B2C6F]/10 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Course"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 