import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import uploadService from "./service/upload.service";

interface FileUpload {
  url: string;
  key: string;
  path?: string;
  _id?: string;
}

interface MultipleImageUploadProps {
  label?: string;
  value: FileUpload[];
  onChange: (files: FileUpload[]) => void;
  error?: string;
  maxImages?: number;
  isLoading?: boolean;
}

export default function MultipleImageUpload({
  label = "Images",
  value = [],
  onChange,
  error,
  maxImages = 999, // Essentially unlimited
  isLoading = false,
}: MultipleImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deletingIndices, setDeletingIndices] = useState<number[]>([]);
  
  // Reset file input when needed
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [value.length]);
  
  // Debug logging for value changes
  useEffect(() => {
    console.log("MultipleImageUpload value updated:", value);
  }, [value]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Check if adding more images would exceed the maximum
    if (value.length + files.length > maxImages) {
      alert(`You can upload a maximum of ${maxImages} images`);
      return;
    }

    // Process each file
    const newUploads: FileUpload[] = [];
    Array.from(files).forEach(file => {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Generate a unique key for each file that includes timestamp
      const uniqueKey = `badge-${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name.replace(/\s+/g, '-')}`;
      
      const mockUploadedFile: FileUpload = {
        url: previewUrl,
        key: uniqueKey,
      };
      
      newUploads.push(mockUploadedFile);
    });
    
    onChange([...value, ...newUploads]);
    
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const triggerFileInput = () => {
    if (!isLoading && deletingIndices.length === 0) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fileInputRef.current?.click();
    }
  };
  
  const removeImage = async (index: number) => {
    console.log(`Attempting to remove image at index ${index}`);
    console.log("Current value:", value);
    console.log("Image to delete:", value[index]);
    
    // First mark as deleting for UI feedback
    setDeletingIndices(prev => [...prev, index]);
    
    try {
      const fileToRemove = value[index];
      
      // Handle server-side deletion if needed
      if (fileToRemove?.path) {
        try {
          console.log("Deleting from server - key:", fileToRemove.key);
          await uploadService.deleteImage(fileToRemove.key);
          console.log("Server delete successful");
        } catch (error) {
          console.error("Server delete failed:", error);
          // Continue with UI removal even if server delete fails
        }
      }
      
      // Clean up blob URL if it exists
      if (fileToRemove?.url && fileToRemove.url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(fileToRemove.url);
        } catch (e) {
          console.warn("Failed to revoke object URL:", e);
        }
      }
      
      // Create a new array without the deleted item
      const updatedFiles = value.filter((_, i) => i !== index);
      console.log("Updated files after deletion:", updatedFiles);
      
      // Update parent component
      onChange(updatedFiles);
    } catch (error) {
      console.error("Error in removeImage:", error);
    } finally {
      // Always clean up the deleting state
      setDeletingIndices(prev => prev.filter(i => i !== index));
    }
  };

  return (
    <div className="mb-4 w-full">
      {label && label !== "" && (
        <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">{label}</label>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
        {/* Existing images */}
        {Array.isArray(value) && value.map((file, index) => (
          <div 
            key={`badge-${index}-${file.key || Math.random()}`}
            className="relative group aspect-square h-20 w-20 rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)] bg-[var(--input-bg)]"
          >
            {deletingIndices.includes(index) ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
              </div>
            ) : null}
            
            {file.url && (
              <Image
                src={file.url}
                alt={`Uploaded image ${index + 1}`}
                fill
                className="object-cover"
              />
            )}
            
            {/* Delete button wrapper with higher z-index */}
            <div 
              className="absolute top-0 right-0 p-2 z-50" 
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  removeImage(index);
                }}
                className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-md"
                title="Remove image"
                disabled={isLoading || deletingIndices.includes(index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
        
        {/* Add image button */}
        {Array.isArray(value) && value.length < maxImages && (
          <div
            onClick={triggerFileInput}
            className={`
              aspect-square h-20 w-20 rounded-[var(--radius-md)] 
              border-2 border-dashed border-[var(--primary)]/30 
              hover:border-[var(--primary)]/60 
              flex flex-col items-center justify-center 
              bg-[var(--input-bg)] 
              ${isLoading || deletingIndices.length > 0 ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} 
              transition-colors
            `}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-[var(--primary)]"
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
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[var(--foreground)]/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="mt-1 text-xs text-[var(--foreground)]/50">Add</span>
              </>
            )}
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        multiple
        disabled={isLoading || deletingIndices.length > 0}
      />
      
      {error && <p className="mt-1 text-sm text-[var(--error)]">{error}</p>}
      
      <p className="text-xs text-[var(--foreground)]/50">
        {Array.isArray(value) ? value.length : 0} of {maxImages} images uploaded
      </p>
    </div>
  );
} 