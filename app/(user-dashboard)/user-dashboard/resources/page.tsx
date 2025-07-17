"use client";

import React, { useState, useEffect } from "react";
import {
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineFolder,
  HiOutlineAcademicCap,
  HiOutlineClipboardList,
} from "react-icons/hi";
import userProfileService, {
  UserResource,
  UserResourceContent,
} from "@/app/components/user-dashboard/services/userProfile.service";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "doc" | "video" | "audio" | "other";
  size?: string;
  downloadUrl?: string;
  isDownloaded?: boolean;
  courseId?: string;
  filePath?: string;
  fileKey?: string;
}

interface ResourceCategory {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  resources: Resource[];
  isExpanded: boolean;
  courseId?: string;
}

export default function ResourcesPage() {
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  // Transform UserResource to ResourceCategory
  const transformResourceToCategory = (
    userResource: UserResource,
    index: number
  ): ResourceCategory => {
    const resources: Resource[] = userResource.content.map(
      (content: UserResourceContent) => {
        // Get file extension to determine type
        const getFileType = (fileName: string): Resource["type"] => {
          const ext = fileName.toLowerCase().split(".").pop();
          switch (ext) {
            case "pdf":
              return "pdf";
            case "doc":
            case "docx":
              return "doc";
            case "mp4":
            case "avi":
            case "mov":
              return "video";
            case "mp3":
            case "wav":
              return "audio";
            default:
              return "other";
          }
        };

        // Estimate file size based on type (placeholder logic)
        const estimateFileSize = (type: Resource["type"]): string => {
          switch (type) {
            case "pdf":
              return "2-5 MB";
            case "doc":
              return "1-3 MB";
            case "video":
              return "50-200 MB";
            case "audio":
              return "10-50 MB";
            default:
              return "Unknown";
          }
        };

        // Use the first file if multiple files exist
        const primaryFile = content.file[0];
        const fileName = primaryFile?.key || primaryFile?.path || "";
        const fileType = getFileType(fileName);

        return {
          id: content._id,
          title: content.title,
          description: content.description,
          type: fileType,
          size: estimateFileSize(fileType),
          courseId: userResource.courseId,
          filePath: primaryFile?.path,
          fileKey: primaryFile?.key,
          downloadUrl: primaryFile?.path
            ? `${
                process.env.NEXT_PUBLIC_API_URL ||
                "https://api.accredipeoplecertifications.com"
              }/${primaryFile.path}`
            : undefined,
        };
      }
    );

    let title = "Course Resources";

    return {
      id: `${userResource._id}-${index}`, // Create unique ID using resource ID and index
      title,
      description: `${resources.length} resource${
        resources.length === 1 ? "" : "s"
      } available for download`,
      icon: <HiOutlineAcademicCap className="w-5 h-5" />,
      isExpanded: true, // Default to expanded
      resources,
      courseId: userResource.courseId,
    };
  };

  // Fetch resources function
  const fetchResources = async () => {
    setIsLoading(true);
    setError("");
    try {
      console.log("Fetching user resources...");
      const response = await userProfileService.getUserResources();

      if (response.status && response.resources) {
        console.log("Received resources:", response.resources);

        // Filter and transform to categories - show only non-deleted resources with content
        const transformedCategories = response.resources
          .filter((resource) => !resource.isDeleted) // Don't show deleted resources
          .filter((resource) => resource.content && resource.content.length > 0) // Only resources with content
          .map((resource, index) =>
            transformResourceToCategory(resource, index)
          );

        setCategories(transformedCategories);
        console.log("Transformed categories:", transformedCategories);
      } else {
        console.warn("Unexpected response format:", response);
        setCategories([]);
      }
    } catch (error: any) {
      console.error("Error fetching resources:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load resources"
      );
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, isExpanded: !cat.isExpanded } : cat
      )
    );
  };

  const handleDownload = async (resource: Resource) => {
    setDownloadingIds((prev) => new Set(prev).add(resource.id));

    try {
      if (resource.downloadUrl) {
        // Create a temporary link element and trigger download
        const link = document.createElement("a");
        link.href = resource.downloadUrl;
        link.download = resource.fileKey || resource.title;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log(`Downloaded: ${resource.title}`);

        // Mark as downloaded
        setCategories((prev) =>
          prev.map((cat) => ({
            ...cat,
            resources: cat.resources.map((res) =>
              res.id === resource.id ? { ...res, isDownloaded: true } : res
            ),
          }))
        );
      } else {
        throw new Error("Download URL not available");
      }
    } catch (error: any) {
      console.error("Download failed:", error);
      alert(`Download failed: ${error.message}`);
    } finally {
      setDownloadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(resource.id);
        return newSet;
      });
    }
  };

  const getResourceIcon = (type: Resource["type"]) => {
    switch (type) {
      case "pdf":
        return (
          <HiOutlineDocumentText className="w-5 h-5 text-red-600 dark:text-red-400" />
        );
      case "doc":
        return (
          <HiOutlineDocumentText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        );
      case "video":
        return (
          <HiOutlineDocumentText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        );
      case "audio":
        return (
          <HiOutlineDocumentText className="w-5 h-5 text-green-600 dark:text-green-400" />
        );
      default:
        return (
          <HiOutlineDocumentText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground-muted)]">Loading resources...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            Resources
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Download study materials, guides, and practice resources
          </p>
        </div>

        <div className="bg-[var(--card-bg)] border border-red-200 rounded-[var(--radius-lg)] shadow-sm p-6">
          <div className="text-center py-12">
            <HiOutlineFolder className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
              Error Loading Resources
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchResources}
              className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] font-medium rounded-[var(--radius-md)] transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Resources
          </h1>
          <button
            onClick={fetchResources}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--input-bg)] hover:bg-[var(--border)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <p className="text-[var(--foreground-muted)]">
          Download study materials, guides, and practice resources
        </p>
      </div>

      {/* Resource Categories */}
      {categories.length === 0 ? (
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
          <div className="text-center py-12">
            <HiOutlineFolder className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
              No Resources Found
            </h3>
            <p className="text-[var(--foreground-muted)] mb-4">
              You don't have any resources available at the moment.
            </p>
            <button
              onClick={fetchResources}
              className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] font-medium rounded-[var(--radius-md)] transition-colors duration-200"
            >
              Refresh Resources
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[var(--border)] transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg">
                    {category.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">
                      {category.title}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-[var(--foreground-muted)] mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--foreground-muted)]">
                    {category.resources.length} resources
                  </span>
                  {category.isExpanded ? (
                    <HiOutlineChevronUp className="w-5 h-5 text-[var(--foreground-muted)]" />
                  ) : (
                    <HiOutlineChevronDown className="w-5 h-5 text-[var(--foreground-muted)]" />
                  )}
                </div>
              </button>

              {/* Category Resources */}
              {category.isExpanded && (
                <div className="border-t border-[var(--border)]">
                  <div className="p-6 space-y-4">
                    {category.resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between p-4 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--border)] transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {getResourceIcon(resource.type)}
                          <div className="flex-1">
                            <h4 className="font-medium text-[var(--foreground)] mb-1">
                              {resource.title}
                            </h4>
                            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
                              {resource.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
                              <span className="uppercase font-medium">
                                {resource.type}
                              </span>
                              {resource.size && <span>{resource.size}</span>}
                              {resource.isDownloaded && (
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                  ✓ Downloaded
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDownload(resource)}
                          disabled={downloadingIds.has(resource.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] rounded-[var(--radius-md)] font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {downloadingIds.has(resource.id) ? (
                            <>
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                              <span>Downloading...</span>
                            </>
                          ) : (
                            <>
                              <HiOutlineDownload className="w-4 h-4" />
                              <span>Download</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Download Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {categories.reduce((total, cat) => total + cat.resources.length, 0)}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">
            Total Resources
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {categories.reduce(
              (total, cat) =>
                total + cat.resources.filter((res) => res.isDownloaded).length,
              0
            )}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">
            Downloaded
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {categories.length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">
            Categories
          </div>
        </div>
      </div>
    </div>
  );
}
