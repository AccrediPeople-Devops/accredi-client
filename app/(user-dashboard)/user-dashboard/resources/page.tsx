"use client";

import React, { useState, useEffect } from "react";
import { 
  HiOutlineDocumentText, 
  HiOutlineDownload,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineFolder,
  HiOutlineAcademicCap,
  HiOutlineClipboardList
} from "react-icons/hi";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'doc' | 'video' | 'audio' | 'other';
  size?: string;
  downloadUrl?: string;
  isDownloaded?: boolean;
}

interface ResourceCategory {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  resources: Resource[];
  isExpanded: boolean;
}

export default function ResourcesPage() {
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Simulate fetching resources data
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        // Mock data based on the screenshot
        const mockCategories: ResourceCategory[] = [
          {
            id: 'pmp-certification',
            title: 'PMP® Certification Training',
            description: 'Essential resources for PMP certification preparation',
            icon: <HiOutlineAcademicCap className="w-5 h-5" />,
            isExpanded: true,
            resources: [
              {
                id: 'pmbok-6th',
                title: 'PMBOK Guide 6th Edition',
                description: 'PMBOK Guide 6th Edition',
                type: 'pdf',
                size: '15.2 MB'
              },
              {
                id: 'pmbok-flow-6th-detailed',
                title: 'Detailed PMBOK Flow 6th Edition - Supportive Document',
                description: 'Detailed PMBOK Flow 6th Edition - Supportive Document',
                type: 'pdf',
                size: '8.7 MB'
              },
              {
                id: 'pmbok-flow-6th-simplified',
                title: 'Simplified PMBOK Flow 6th Edition - Supportive Document',
                description: 'Simplified PMBOK Flow 6th Edition - Supportive Document',
                type: 'pdf',
                size: '5.3 MB'
              },
              {
                id: 'pmbok-flow-7th-simplified',
                title: 'Simplified PMBOK Flow 7th Edition - Supportive Document',
                description: 'Simplified PMBOK Flow 7th Edition - Supportive Document',
                type: 'pdf',
                size: '6.1 MB'
              },
              {
                id: 'pmbok-changes-7th',
                title: 'Changes to pmbok-guide-7th-edition - Supportive Document',
                description: 'Changes to pmbok-guide-7th-edition - Supportive Document',
                type: 'pdf',
                size: '3.8 MB'
              },
              {
                id: 'case-study-1',
                title: 'Case Study - 1',
                description: 'Case Study - 1',
                type: 'pdf',
                size: '2.4 MB'
              },
              {
                id: 'answer-key-case-study-1',
                title: 'Answer Key - Case Study 1',
                description: 'Answer Key - Case Study 1',
                type: 'pdf',
                size: '1.2 MB'
              },
              {
                id: 'case-study-2',
                title: 'Case Study - 2',
                description: 'Case Study - 2',
                type: 'pdf',
                size: '2.8 MB'
              },
              {
                id: 'answer-key-case-study-2',
                title: 'Answer Key - Case Study 2',
                description: 'Answer Key - Case Study 2',
                type: 'pdf',
                size: '1.5 MB'
              }
            ]
          },
          {
            id: 'additional-materials',
            title: 'Additional Study Materials',
            description: 'Supplementary resources for enhanced learning',
            icon: <HiOutlineFolder className="w-5 h-5" />,
            isExpanded: false,
            resources: [
              {
                id: 'formula-guide',
                title: 'PMP Formula Guide',
                description: 'Complete guide to PMP formulas and calculations',
                type: 'pdf',
                size: '4.2 MB'
              },
              {
                id: 'glossary',
                title: 'Project Management Glossary',
                description: 'Comprehensive glossary of PM terms',
                type: 'pdf',
                size: '2.1 MB'
              },
              {
                id: 'templates',
                title: 'Project Management Templates',
                description: 'Ready-to-use PM templates and forms',
                type: 'doc',
                size: '12.5 MB'
              }
            ]
          },
          {
            id: 'practice-materials',
            title: 'Practice Materials',
            description: 'Mock exams and practice questions',
            icon: <HiOutlineClipboardList className="w-5 h-5" />,
            isExpanded: false,
            resources: [
              {
                id: 'mock-exam-1',
                title: 'Mock Exam 1 - Questions',
                description: '200 practice questions with explanations',
                type: 'pdf',
                size: '6.8 MB'
              },
              {
                id: 'mock-exam-1-answers',
                title: 'Mock Exam 1 - Answer Key',
                description: 'Detailed answers and explanations',
                type: 'pdf',
                size: '3.2 MB'
              },
              {
                id: 'flashcards',
                title: 'PMP Flashcards',
                description: 'Key concepts and definitions',
                type: 'pdf',
                size: '1.8 MB'
              }
            ]
          }
        ];

        setCategories(mockCategories);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, isExpanded: !cat.isExpanded }
          : cat
      )
    );
  };

  const handleDownload = async (resource: Resource) => {
    setDownloadingIds(prev => new Set(prev).add(resource.id));
    
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would handle the actual download here
      console.log(`Downloading: ${resource.title}`);
      
      // Mark as downloaded
      setCategories(prev => 
        prev.map(cat => ({
          ...cat,
          resources: cat.resources.map(res => 
            res.id === resource.id 
              ? { ...res, isDownloaded: true }
              : res
          )
        }))
      );
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(resource.id);
        return newSet;
      });
    }
  };

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
        return <HiOutlineDocumentText className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'doc':
        return <HiOutlineDocumentText className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'video':
        return <HiOutlineDocumentText className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'audio':
        return <HiOutlineDocumentText className="w-5 h-5 text-green-600 dark:text-green-400" />;
      default:
        return <HiOutlineDocumentText className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Resources</h1>
        <p className="text-[var(--foreground-muted)]">Download study materials, guides, and practice resources</p>
      </div>

      {/* Resource Categories */}
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
                            <span className="uppercase font-medium">{resource.type}</span>
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

      {/* Download Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {categories.reduce((total, cat) => total + cat.resources.length, 0)}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">Total Resources</div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {categories.reduce((total, cat) => 
              total + cat.resources.filter(res => res.isDownloaded).length, 0
            )}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">Downloaded</div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {categories.length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">Categories</div>
        </div>
      </div>
    </div>
  );
} 