"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import curriculumService from "../../../components/service/curriculum.service";
import { Curriculum } from "../../../types/curriculum";

export default function CurriculumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchCurriculum();
    }
  }, [id]);

  const fetchCurriculum = async () => {
    setIsLoading(true);
    setError("");
    try {
      // In a real application, this would fetch from the API
      // const res = await curriculumService.getCurriculumById(id);
      // if (res?.curriculum) {
      //   setCurriculum(res.curriculum);
      // }
      
      // Using mock data for now
      setCurriculum({
        _id: id,
        courseId: "67facdd9067a3cf2e7263124",
        content: [
          {
            title: "Introduction to the Course",
            description: "Welcome to the course! This introductory section covers what you'll learn and how to get the most out of the materials."
          },
          {
            title: "Setting Up Your Environment",
            description: "Learn how to install and configure the necessary tools and software for this course."
          },
          {
            title: "Core Concepts",
            description: "Dive into the fundamental principles and concepts that form the foundation of this subject area."
          },
          {
            title: "Practical Applications",
            description: "Apply what you've learned through hands-on exercises and real-world examples."
          },
          {
            title: "Advanced Techniques",
            description: "Take your skills to the next level with more sophisticated approaches and methodologies."
          },
          {
            title: "Final Project",
            description: "Consolidate your knowledge by completing a comprehensive project that demonstrates your mastery of the material."
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching curriculum");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this curriculum?")) {
      try {
        // await curriculumService.deleteCurriculum(id);
        // Show success message or notification here
        router.push("/dashboard/curriculum");
      } catch (err: any) {
        setError(err.response?.data?.message || "Error deleting curriculum");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-lg bg-[#2A2A2A] text-white hover:bg-[#5B2C6F]/20 transition-colors"
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
        </button>
        <div className="p-6 bg-[#2A2A2A] rounded-xl flex-1">
          <h1 className="text-2xl font-bold text-white mb-2">Curriculum Details</h1>
          <p className="text-[#D7BDE2]">View and manage curriculum content</p>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-[#5B2C6F] border-r-2 border-b-2 border-transparent"></div>
          <p className="mt-2 text-white/70">Loading curriculum...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white text-center">
          {error}
        </div>
      )}

      {/* Curriculum Details */}
      {!isLoading && !error && curriculum && (
        <>
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Link 
              href={`/dashboard/curriculum/edit/${id}`}
              className="px-4 py-2 rounded-lg bg-[#5B2C6F] text-white hover:bg-[#5B2C6F]/90 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Curriculum
            </Link>
            <button 
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Delete Curriculum
            </button>
          </div>
          
          {/* Curriculum Details Card */}
          <div className="bg-[#2A2A2A] rounded-xl p-6">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Course Details</h2>
                  <p className="text-[#D7BDE2]">
                    <span className="font-medium">Course ID:</span> {curriculum.courseId}
                  </p>
                  <p className="text-white/50 text-sm mt-1">
                    Last updated: {new Date(curriculum.updatedAt || "").toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#5B2C6F]/20 px-3 py-1 rounded-full text-[#D7BDE2] text-sm font-medium">
                  {curriculum.content.length} Content Items
                </div>
              </div>
            </div>
            
            {/* Content List */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-4">Curriculum Content</h3>
              <div className="space-y-4">
                {curriculum.content.map((item, index) => (
                  <div key={index} className="p-4 bg-[#1A1A1A] rounded-lg">
                    <div className="flex justify-between">
                      <h4 className="text-[#D7BDE2] font-medium">
                        {index + 1}. {item.title}
                      </h4>
                      <div className="text-white/50 text-sm">
                        Module {index + 1}
                      </div>
                    </div>
                    <div 
                      className="text-white/70 mt-2"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 