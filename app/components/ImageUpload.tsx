import React, { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onChange: (file: { url: string; key: string }) => void;
  value?: { url: string; key: string };
  error?: string;
  shape?: "square" | "rectangle";
}

export default function ImageUpload({
  onChange,
  value,
  error,
  shape = "square",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value?.url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // In a real app, you'd upload the file to a server here
    // and get back a URL and key. For now, we'll mock this.
    const mockUploadedFile = {
      url: previewUrl,
      key: `image-${Date.now()}-${file.name}`,
    };

    onChange(mockUploadedFile);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Get the shape-specific class
  const getShapeClass = () => {
    switch (shape) {
      case "rectangle":
        return "h-24 w-full rounded-lg";
      case "square":
      default:
        return "h-32 w-32 rounded-lg";
    }
  };

  // Determine if we should show a remove button
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange({ url: "", key: "" });
  };

  return (
    <div className="mb-4">
      <div
        onClick={triggerFileInput}
        className={`
          ${getShapeClass()} relative cursor-pointer
          flex items-center justify-center
          bg-[#2A2A2A] border-2 border-dashed
          ${
            error
              ? "border-error"
              : "border-[#3A3A55] hover:border-[#5B2C6F]"
          }
          transition-colors duration-300
          group
        `}
      >
        {preview ? (
          <div className="relative h-full w-full rounded-lg overflow-hidden">
            <Image
              src={preview}
              alt="Uploaded image"
              fill
              style={{ objectFit: "cover" }}
            />
            
            {/* Remove button with improved visibility */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-white/70 text-sm text-center">
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
      />

      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}
