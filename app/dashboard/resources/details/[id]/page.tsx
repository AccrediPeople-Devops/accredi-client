"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import resourceService from "../../../../components/service/resource.service";
import courseService from "../../../../components/service/course.service";
import { formatDate } from "../../../../utils/dateUtils";
import config from "../../../../components/config/config";

interface ResourceFile {
  url: string;
  key: string;
  path?: string;
  _id?: string;
  name?: string;
  size?: number;
  type?: string;
}

interface ResourceItem {
  title: string;
  description: string;
  file: ResourceFile[];
  _id?: string;
}

interface Resource {
  _id?: string;
  courseId: string;
  content: ResourceItem[];
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ResourceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const resourceId = params.id as string;

  const [resource, setResource] = useState<Resource | null>(null);
  const [courseName, setCourseName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (resourceId) {
      fetchResource();
    }
  }, [resourceId]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes("image/")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (type.includes("pdf")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (type.includes("word") || type.includes("doc")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (type.includes("sheet") || type.includes("excel") || type.includes("csv")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (type.includes("presentation") || type.includes("powerpoint")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      );
    } else if (type.includes("video")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    } else if (type.includes("audio")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
  };

  const fetchResource = async () => {
    try {
      const response = await resourceService.getResourceById(resourceId);
      if (response && response.resource) {
        // Process and validate the resource data
        const processedResource = { ...response.resource };
        
        // Ensure file URLs are valid
        if (processedResource.content && Array.isArray(processedResource.content)) {
          processedResource.content = processedResource.content.map((item: ResourceItem) => {
            if (item.file && Array.isArray(item.file)) {
              item.file = item.file.map((file: ResourceFile) => {
                // Ensure file has a valid URL
                if (!file.url) {
                  console.warn('File missing URL:', file);
                  // If file has a path but no URL, construct a fallback URL
                  if (file.path) {
                    file.url = file.path;
                  }
                }
                return file;
              });
            }
            return item;
          });
        }
        
        console.log("Processed resource:", processedResource);
        setResource(processedResource);
        fetchCourseName(processedResource.courseId);
      } else if (response && !response.status) {
        setError(response.message || "Resource not found");
      } else {
        setError("Failed to load resource data");
      }
    } catch (err: any) {
      console.error("Error fetching resource:", err);
      setError(err.response?.data?.message || "Error loading resource");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourseName = async (courseId: string) => {
    try {
      const response = await courseService.getCourseById(courseId);
      if (response && response.course) {
        setCourseName(response.course.title);
      }
    } catch (err) {
      console.error("Error fetching course name:", err);
    }
  };

  const handleOpenResource = (url: string) => {
    console.log("File URL:", url);
    
    // Handle undefined URL
    if (!url || typeof url !== 'string') {
      console.error("Error: URL is undefined, empty, or not a string");
      return;
    }
    
    try {
      // Make sure URL is absolute and properly formatted
      let downloadUrl = url;
      
      // If URL is relative (doesn't start with http), prepend the server base URL
      if (!url.startsWith('http')) {
        // Make sure we're using the proper server URL from config
        const configUrl = config.imageUrl;
        
        // Remove any leading slashes from url and trailing slashes from baseUrl
        const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
        const cleanBaseUrl = configUrl.endsWith('/') ? configUrl : `${configUrl}/`;
        
        downloadUrl = `${cleanBaseUrl}${cleanUrl}`;
      }
      
      console.log("Download URL:", downloadUrl);
      
      // Create an anchor element and set attributes for download
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      // Safely extract filename from URL
      let filename = 'download';
      try {
        if (url.includes('/')) {
          const parts = url.split('/');
          const lastPart = parts[parts.length - 1];
          if (lastPart && lastPart.trim() !== '') {
            filename = lastPart;
          }
        }
      } catch (error) {
        console.error("Error parsing filename from URL:", error);
      }
      
      a.download = filename;
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a); // Append to body
      a.click(); // Trigger the download
      document.body.removeChild(a); // Clean up
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" text="Loading resource data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Resource Details</h1>
          <Link
            href="/dashboard/resources"
            className="px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)] transition-colors flex items-center gap-2"
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
            Back to Resources
          </Link>
        </div>
        <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] rounded-[var(--radius-md)]">
          {error}
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Resource Details</h1>
          <Link
            href="/dashboard/resources"
            className="px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)] transition-colors flex items-center gap-2"
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
            Back to Resources
          </Link>
        </div>
        <div className="p-4 text-center bg-[var(--input-bg)] rounded-[var(--radius-md)] text-[var(--foreground-muted)]">
          <p>Resource not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Resource Details</h1>
          <p className="text-[var(--foreground-muted)]">
            View resources for {courseName}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/resources/edit/${resourceId}`}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-8 8a2 2 0 01-.707.707l-2 1a1 1 0 01-1.414-1.414l1-2a2 2 0 01.707-.707l8-8z" />
              <path fillRule="evenodd" d="M11 19a1 1 0 01-1-1v-2a1 1 0 112 0v2a1 1 0 01-1 1z" clipRule="evenodd" />
            </svg>
            Edit
          </Link>
          <Link
            href="/dashboard/resources"
            className="px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)] transition-colors flex items-center gap-2"
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
            Back
          </Link>
        </div>
      </div>

      {/* Resource info */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-medium text-[var(--foreground)]">Resource Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-[var(--foreground-muted)]">Course</p>
              <p className="text-[var(--foreground)]">{courseName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground-muted)]">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  resource.isDeleted
                    ? "bg-[var(--error)]/10 text-[var(--error)]"
                    : "bg-[var(--success)]/10 text-[var(--success)]"
                }`}
              >
                {resource.isDeleted ? "Deleted" : "Active"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground-muted)]">Created At</p>
              <p className="text-[var(--foreground)]">{resource.createdAt ? formatDate(resource.createdAt) : "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground-muted)]">Updated At</p>
              <p className="text-[var(--foreground)]">{resource.updatedAt ? formatDate(resource.updatedAt) : "-"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resource items */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-medium text-[var(--foreground)]">Resource Items ({resource.content?.length || 0})</h2>
        </div>

        {!resource.content || resource.content.length === 0 ? (
          <div className="p-6 text-center text-[var(--foreground-muted)]">
            <p>No resource items found</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {resource.content.map((item, index) => (
              <div key={item._id || index} className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-medium text-[var(--foreground)]">{item.title}</h3>
                    {item.description && (
                      <p className="mt-1 text-[var(--foreground-muted)]">{item.description}</p>
                    )}
                  </div>

                  {item.file && item.file.length > 0 && (
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-[var(--foreground-muted)] mb-2">Files ({item.file.length}):</p>
                      <div className="space-y-2">
                        {item.file.map((file, fileIndex) => {
                          // Debug the file object
                          console.log(`File ${fileIndex}:`, file);
                          return (
                            <div key={fileIndex} className="flex items-center bg-[var(--input-bg)] p-2 rounded-[var(--radius-sm)]">
                              <div className="flex-shrink-0 text-[var(--primary)] mr-2">
                                {getFileIcon(file.type || '')}
                              </div>
                              <div className="flex-1 min-w-0 mr-3">
                                <p className="text-sm font-medium text-[var(--foreground)] truncate">
                                  {file.name || file.path?.split('/').pop() || `File ${fileIndex + 1}`}
                                </p>
                                {file.size && (
                                  <p className="text-xs text-[var(--foreground-muted)]">
                                    {formatFileSize(file.size)}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => file && file.url ? handleOpenResource(file.url) : console.error("No URL found for file", file)}
                                className="text-[var(--primary)] hover:underline flex items-center px-2 py-1 text-sm"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Download
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 