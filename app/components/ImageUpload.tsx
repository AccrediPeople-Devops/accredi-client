import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import uploadService from "./service/upload.service";

interface ImageUploadProps {
  onChange: (file: { url: string; key: string; path?: string }) => void;
  value?: { url: string; key: string; path?: string };
  error?: string;
  isLoading?: boolean;
}

export default function ImageUpload({
  onChange,
  value,
  error,
  isLoading = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    value?.url && value.url !== "" ? value.url : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Reset file input value when preview is removed
  useEffect(() => {
    if (!preview && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Generate a unique key
    const uniqueKey = `image-${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name.replace(/\s+/g, '-')}`;
    
    const mockUploadedFile = {
      url: previewUrl,
      key: uniqueKey,
    };

    onChange(mockUploadedFile);
  };

  const triggerFileInput = () => {
    if (!isLoading && !deleteLoading) {
      // Reset file input value before triggering click
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fileInputRef.current?.click();
    }
  };

  const removeImage = async () => {
    try {
      if (value?.path) {
        try {
          setDeleteLoading(true);
          console.log("Attempting to delete image with key:", value.key);
          // Delete the image from the backend
          await uploadService.deleteImage(value.key);
          console.log("Image deleted successfully:", value.key);
        } catch (error) {
          console.error("Error deleting image:", error);
        } finally {
          setDeleteLoading(false);
        }
      } else if (value?.url && value.url.startsWith('blob:')) {
        // For client-side previews, release object URL to prevent memory leaks
        try {
          URL.revokeObjectURL(value.url);
        } catch (e) {
          console.warn("Failed to revoke object URL:", e);
        }
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setPreview(null);
      onChange({ url: "", key: "" });
    } catch (error) {
      console.error("Error in removeImage:", error);
    }
  };

  return (
    <div className="mb-4">
      <div
        onClick={triggerFileInput}
        className={`
          h-32 w-32 rounded-[var(--radius-md)] relative cursor-pointer
          flex items-center justify-center
          bg-[var(--input-bg)] border-2 border-dashed
          ${
            error
              ? "border-[var(--error)]"
              : "border-[var(--primary)]/50 hover:border-[var(--primary)]"
          }
          ${(isLoading || deleteLoading) ? "cursor-not-allowed opacity-70" : ""}
          transition-colors duration-300
        `}
      >
        {isLoading || deleteLoading ? (
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
            <span className="mt-2 text-xs text-[var(--foreground)]/70">
              {deleteLoading ? "Deleting..." : "Uploading..."}
            </span>
          </div>
        ) : preview ? (
          <div className="relative h-full w-full rounded-[var(--radius-md)] overflow-hidden group">
            <Image
              src={preview}
              alt="Image preview"
              fill
              style={{ objectFit: "cover" }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
        ) : (
          <div className="text-[var(--foreground)]/70 text-sm text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mx-auto mb-1"
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
            Upload Image
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isLoading || deleteLoading}
      />

      {error && <p className="mt-1 text-sm text-[var(--error)]">{error}</p>}
    </div>
  );
}
