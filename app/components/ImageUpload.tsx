import React, { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onChange: (file: { url: string; key: string }) => void;
  value?: { url: string; key: string };
  error?: string;
}

export default function ImageUpload({
  onChange,
  value,
  error,
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
      key: `profile-${Date.now()}-${file.name}`,
    };

    onChange(mockUploadedFile);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-white">
        Profile Image
      </label>

      <div
        onClick={triggerFileInput}
        className={`
          h-32 w-32 rounded-full relative cursor-pointer
          flex items-center justify-center
          bg-input-bg border-2 border-dashed
          ${
            error
              ? "border-error"
              : "border-secondary/50 hover:border-secondary"
          }
          transition-colors duration-300
        `}
      >
        {preview ? (
          <div className="relative h-full w-full rounded-full overflow-hidden">
            <Image
              src={preview}
              alt="Profile preview"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <div className="text-secondary/70 text-sm text-center">
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
