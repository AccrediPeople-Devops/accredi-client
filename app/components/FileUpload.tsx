import React, { useState, useRef, useCallback } from "react";
import uploadService from "./service/upload.service";
import config from "./config/config";
import { LoadingSpinner } from "./LoadingSpinner";

interface FileData {
  url: string;
  key: string;
  path?: string;
  _id?: string;
  name?: string;
  type?: string;
  size?: number;
}

interface FileUploadProps {
  files: FileData[];
  onChange: (files: FileData[]) => void;
  isLoading?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  allowedFileTypes?: string;
}

export default function FileUpload({
  files = [],
  onChange,
  isLoading = false,
  multiple = true,
  maxFiles = 10,
  allowedFileTypes = "*"
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    const totalFiles = files.length + selectedFiles.length;
    if (totalFiles > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }

    const filesToUpload: File[] = Array.from(selectedFiles);
    const newFiles: FileData[] = [...files];
    
    for (const file of filesToUpload) {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create a temporary file object with local URL
      const tempFile: FileData = {
        url: URL.createObjectURL(file),
        key: tempId,
        name: file.name,
        type: file.type,
        size: file.size,
      };
      
      newFiles.push(tempFile);
      
      // Set this file as uploading
      setUploading(prev => ({ ...prev, [tempId]: true }));
      
      try {
        // Upload file to server
        const uploadResponse = await uploadService.uploadImage(file);
        
        if (uploadResponse && uploadResponse.upload && uploadResponse.upload[0]) {
          const uploadedFile = uploadResponse.upload[0];
          const path = uploadedFile.path;
          const key = uploadedFile.key || path;
          
          // Update the temporary file with server details
          const fileIndex = newFiles.findIndex(f => f.key === tempId);
          if (fileIndex !== -1) {
            newFiles[fileIndex] = {
              url: `${config.imageUrl}${path}`,
              key: key,
              path: path,
              name: file.name,
              type: file.type,
              size: file.size,
            };
            
            // Update the files array
            onChange([...newFiles]);
          }
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        // Remove the temporary file on error
        const fileIndex = newFiles.findIndex(f => f.key === tempId);
        if (fileIndex !== -1) {
          newFiles.splice(fileIndex, 1);
          onChange([...newFiles]);
        }
      } finally {
        // Remove from uploading state
        setUploading(prev => {
          const newState = { ...prev };
          delete newState[tempId];
          return newState;
        });
      }
    }
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = async (fileToRemove: FileData) => {
    try {
      // If the file has a path, it was uploaded to the server
      if (fileToRemove.path) {
        setUploading(prev => ({ ...prev, [fileToRemove.key]: true }));
        try {
          // Delete from server
          await uploadService.deleteImage(fileToRemove.key);
        } catch (error) {
          console.error("Error deleting file from server:", error);
        }
      } else if (fileToRemove.url.startsWith('blob:')) {
        // For client-side previews, release object URL
        URL.revokeObjectURL(fileToRemove.url);
      }
      
      // Remove from files array
      const newFiles = files.filter(file => file.key !== fileToRemove.key);
      onChange(newFiles);
    } catch (error) {
      console.error("Error removing file:", error);
    } finally {
      setUploading(prev => {
        const newState = { ...prev };
        delete newState[fileToRemove.key];
        return newState;
      });
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (isLoading || Object.keys(uploading).length > 0) return;
      
      const droppedFiles = e.dataTransfer.files;
      if (!droppedFiles || droppedFiles.length === 0) return;
      
      // Create a synthetic event
      const fileInput = fileInputRef.current;
      if (fileInput) {
        // Create a new DataTransfer object
        const dataTransfer = new DataTransfer();
        
        // Add dropped files
        for (let i = 0; i < droppedFiles.length; i++) {
          dataTransfer.items.add(droppedFiles[i]);
        }
        
        // Set files property
        fileInput.files = dataTransfer.files;
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
    },
    [isLoading, uploading]
  );

  const triggerFileInput = () => {
    if (!isLoading && Object.keys(uploading).length === 0) {
      fileInputRef.current?.click();
    }
  };

  const isAnyFileUploading = Object.keys(uploading).length > 0;

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`
          p-6 rounded-[var(--radius-md)] 
          bg-[var(--input-bg)] border-2 border-dashed border-[var(--border)]
          hover:border-[var(--primary)]/50
          ${isLoading || isAnyFileUploading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
          transition-colors duration-300 text-center
        `}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <LoadingSpinner size="medium" />
            <p className="mt-2 text-[var(--foreground-muted)]">Loading...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="mt-2 text-sm text-[var(--foreground)]">
              <span className="font-medium text-[var(--primary)]">Click to upload</span> or drag and drop
            </p>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              PDF, DOC, PPT, XLS, CSV, TXT, images, audio, and video files supported
            </p>
            {files.length > 0 && (
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                {files.length} of {maxFiles} files uploaded
              </p>
            )}
          </>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={allowedFileTypes}
        className="hidden"
        multiple={multiple}
        disabled={isLoading || isAnyFileUploading}
      />

      {/* File previews */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-[var(--foreground)]">Uploaded Files</h4>
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] divide-y divide-[var(--border)]">
            {files.map((file, index) => (
              <div key={file.key || index} className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 text-[var(--primary)]">
                    {getFileIcon(file.type || '')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">
                      {file.name || file.path?.split('/').pop() || `File ${index + 1}`}
                    </p>
                    {file.size && (
                      <p className="text-xs text-[var(--foreground-muted)]">
                        {formatFileSize(file.size)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {uploading[file.key] ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file);
                      }}
                      className="text-[var(--error)] hover:text-[var(--error)]/80 transition-colors"
                      disabled={isLoading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 