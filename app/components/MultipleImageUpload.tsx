import React, { useState, useRef } from "react";
import Image from "next/image";

interface FileUpload {
  url: string;
  key: string;
  _id?: string;
}

interface MultipleImageUploadProps {
  label?: string;
  value: FileUpload[];
  onChange: (files: FileUpload[]) => void;
  error?: string;
  maxImages?: number;
}

export default function MultipleImageUpload({
  label = "Images",
  value = [],
  onChange,
  error,
  maxImages = 10,
}: MultipleImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      
      // In a real app, you'd upload the file to a server here
      // and get back a URL and key. For now, we'll mock this.
      const mockUploadedFile: FileUpload = {
        url: previewUrl,
        key: `badge-${Date.now()}-${file.name}`,
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
    fileInputRef.current?.click();
  };
  
  const removeImage = (index: number) => {
    const updatedFiles = [...value];
    updatedFiles.splice(index, 1);
    onChange(updatedFiles);
  };

  return (
    <div className="mb-4 w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-white">{label}</label>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
        {/* Existing images */}
        {value.map((file, index) => (
          <div 
            key={file.key || index}
            className="relative group aspect-square h-20 w-20 rounded-lg overflow-hidden border border-[#3A3A55] bg-[#2A2A2A]"
          >
            <Image
              src={file.url}
              alt={`Uploaded image ${index + 1}`}
              fill
              className="object-cover"
            />
            
            {/* Always visible remove button with hover effect */}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-md"
              title="Remove image"
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
        ))}
        
        {/* Add image button */}
        {value.length < maxImages && (
          <div
            onClick={triggerFileInput}
            className="aspect-square h-20 w-20 rounded-lg border-2 border-dashed border-[#3A3A55] hover:border-[#5B2C6F] flex flex-col items-center justify-center bg-[#2A2A2A] cursor-pointer transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white/70"
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
            <span className="mt-1 text-xs text-white/70">Add</span>
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
      />
      
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
      
      <p className="text-xs text-white/50">
        {value.length} of {maxImages} images uploaded
      </p>
    </div>
  );
} 