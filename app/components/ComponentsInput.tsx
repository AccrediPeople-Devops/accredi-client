import React, { useState } from "react";
import Image from "next/image";
import uploadService from "./service/upload.service";
import config from "./config/config";
import RichTextEditor from "./RichTextEditor";

interface ComponentItem {
  image: {
    path: string;
    key: string;
  };
  description: string;
  _id?: string;
}

interface ComponentsInputProps {
  value: ComponentItem[];
  onChange: (components: ComponentItem[]) => void;
  isLoading?: boolean;
}

export default function ComponentsInput({
  value,
  onChange,
  isLoading = false,
}: ComponentsInputProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const addComponent = () => {
    const newComponent: ComponentItem = {
      image: {
        path: "",
        key: "",
      },
      description: "",
    };
    onChange([...value, newComponent]);
  };

  const removeComponent = async (index: number) => {
    const component = value[index];
    
    // Delete image from server if it exists
    if (component.image.key) {
      try {
        await uploadService.deleteImage(component.image.key);
      } catch (error) {
        console.error("Error deleting component image:", error);
      }
    }
    
    const updatedComponents = value.filter((_, i) => i !== index);
    onChange(updatedComponents);
  };

  const updateDescription = (index: number, description: string) => {
    const updatedComponents = [...value];
    updatedComponents[index] = {
      ...updatedComponents[index],
      description,
    };
    onChange(updatedComponents);
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    
    try {
      // Debug: Check if token exists
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      if (!token) {
        console.error('No authentication token found');
        throw new Error('Please login again - authentication token missing');
      }
      
      // Upload image to server
      const uploadResponse = await uploadService.uploadImage(file);
      
      if (uploadResponse && uploadResponse.upload && uploadResponse.upload[0]) {
        const uploadedFile = uploadResponse.upload[0];
        
        // Update component with server response
        const updatedComponents = [...value];
        updatedComponents[index] = {
          ...updatedComponents[index],
          image: {
            path: uploadedFile.path,
            key: uploadedFile.key || uploadedFile.path,
          },
        };
        onChange(updatedComponents);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      {value.map((component, index) => (
        <div
          key={index}
          className="bg-[var(--background)] p-6 rounded-[var(--radius-lg)] border border-[var(--border)] space-y-4"
        >
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium text-[var(--foreground)]">
              Component {index + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeComponent(index)}
              className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded-[var(--radius-sm)]"
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v1H4V5zM3 8a1 1 0 011-1h12a1 1 0 110 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-2">
                Component Image *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(index, file);
                    }
                  }}
                  className="hidden"
                  id={`component-image-${index}`}
                  disabled={uploadingIndex === index || isLoading}
                />
                
                <div
                  onClick={() => {
                    if (uploadingIndex !== index && !isLoading) {
                      document.getElementById(`component-image-${index}`)?.click();
                    }
                  }}
                  className={`
                    h-40 w-full max-w-md rounded-[var(--radius-md)] relative cursor-pointer
                    flex items-center justify-center
                    bg-[var(--input-bg)] border-2 border-dashed border-[var(--primary)]/50
                    hover:border-[var(--primary)] transition-colors duration-300
                    ${uploadingIndex === index || isLoading ? "cursor-not-allowed opacity-70" : ""}
                  `}
                >
                  {uploadingIndex === index ? (
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="animate-spin h-8 w-8 text-[var(--primary)]"
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
                      <span className="mt-2 text-sm text-[var(--foreground)]/70">
                        Uploading...
                      </span>
                    </div>
                  ) : component.image.path ? (
                    <div className="relative h-full w-full rounded-[var(--radius-md)] overflow-hidden group">
                      <Image
                        src={`${config.imageUrl}${component.image.path}`}
                        alt="Component image"
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Click to change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[var(--foreground)]/70 text-sm text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 mx-auto mb-2"
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
                      Upload Component Image
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-2">
                Component Description *
              </label>
              <div className={`${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                <RichTextEditor
                  value={component.description}
                  onChange={(value) => updateDescription(index, value)}
                  placeholder="Enter detailed component description..."
                  minHeight="200px"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addComponent}
        className="w-full py-4 px-6 border-2 border-dashed border-[var(--primary)]/50 text-[var(--primary)] rounded-[var(--radius-lg)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors flex items-center justify-center gap-3 font-medium"
        disabled={isLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add New Component
      </button>
    </div>
  );
} 