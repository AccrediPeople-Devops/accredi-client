import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import uploadService from "./service/upload.service";

interface EnhancedImageUploadProps {
  onChange: (file: { url: string; key: string; path?: string; isEmoji?: boolean }) => void;
  value?: { url: string; key: string; path?: string; isEmoji?: boolean };
  error?: string;
  isLoading?: boolean;
  allowEmoji?: boolean;
}

const commonEmojis = [
  // Education & Learning
  "🎓", "📚", "📖", "📝", "✏️", "🖊️", "📄", "📋", "📊", "📈",
  "🔬", "🧪", "🔭", "🧮", "📐", "📏", "🖼️", "🎨", "🖌️", "✂️",
  
  // Technology & Computer
  "💻", "🖥️", "⌨️", "🖱️", "💾", "💿", "📱", "⌚", "🎮", "🕹️",
  "📷", "📹", "🎥", "📺", "📻", "🔌", "🔋", "🛠️", "⚙️", "🔧",
  
  // Business & Success
  "💼", "📊", "📈", "📉", "💰", "💳", "🏦", "🏢", "🎯", "🏆",
  "🥇", "🥈", "🥉", "🏅", "🎖️", "⭐", "🌟", "✨", "💎", "👑",
  
  // Communication & Social
  "📧", "📨", "📩", "📮", "📪", "📫", "📬", "📭", "📤", "📥",
  "📞", "📟", "📠", "💬", "💭", "🗨️", "🗯️", "💡", "🔔", "🔕",
  
  // Design & Creative
  "🎨", "🖌️", "🖍️", "✏️", "📝", "📐", "📏", "📌", "📍", "🖇️",
  "📎", "🔗", "⛓️", "🎭", "🎪", "🎨", "🎵", "🎶", "🎼", "🎹",
  
  // Energy & Action
  "🚀", "⚡", "🔥", "💥", "✨", "🌈", "☀️", "🌙", "⭐", "🌟",
  "💫", "🔆", "🔅", "💡", "🔦", "🕯️", "🎆", "🎇", "🎊", "🎉",
  
  // Objects & Tools
  "🔨", "🔧", "⚒️", "🛠️", "⚙️", "🔩", "⚖️", "🔗", "⛓️", "📏",
  "📐", "✂️", "🔪", "🗡️", "⚔️", "🔱", "🏹", "🎯", "🎲", "🧩"
];

export default function EnhancedImageUpload({
  onChange,
  value,
  error,
  isLoading = false,
  allowEmoji = true,
}: EnhancedImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    value?.url && value.url !== "" ? value.url : null
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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
      isEmoji: false,
    };

    onChange(mockUploadedFile);
    setShowEmojiPicker(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    // Create a canvas to convert emoji to image with transparent background
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 256;  // Higher resolution
    canvas.height = 256;
    
    if (ctx) {
      // Clear canvas (transparent background)
      ctx.clearRect(0, 0, 256, 256);
      
      // Draw emoji with high quality settings
      ctx.font = '180px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 128, 128);
    }
    
    // Convert to PNG with transparency
    const dataUrl = canvas.toDataURL('image/png');
    setPreview(dataUrl);
    
    const uniqueKey = `emoji-${Date.now()}-${emoji}`;
    
    const emojiFile = {
      url: dataUrl,
      key: uniqueKey,
      isEmoji: true,
    };

    onChange(emojiFile);
    setShowEmojiPicker(false);
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
      if (value?.path && !value?.isEmoji) {
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
      onChange({ url: "", key: "", isEmoji: false });
    } catch (error) {
      console.error("Error in removeImage:", error);
    }
  };

  return (
    <div className="mb-4">
      <div className="relative">
        <div
          className={`
            h-32 w-32 rounded-[var(--radius-md)] relative
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
              {value?.isEmoji ? (
                <div className="h-full w-full flex items-center justify-center text-6xl bg-[var(--input-bg)]">
                  {preview.includes('data:image') ? (
                    <Image
                      src={preview}
                      alt="Emoji badge"
                      fill
                      style={{ objectFit: "contain" }}
                      unoptimized
                    />
                  ) : (
                    preview
                  )}
                </div>
              ) : (
                <Image
                  src={preview}
                  alt="Image preview"
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              )}
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

        {/* Action buttons */}
        {!preview && !isLoading && !deleteLoading && (
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={triggerFileInput}
              className="flex-1 px-3 py-1 text-xs bg-[var(--primary)] text-white rounded-[var(--radius-sm)] hover:bg-[var(--primary-hover)] transition-colors"
            >
              Upload Image
            </button>
            {allowEmoji && (
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex-1 px-3 py-1 text-xs bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--input-bg)] transition-colors"
              >
                Use Emoji
              </button>
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.png,.jpg,.jpeg,.gif,.webp"
        className="hidden"
        disabled={isLoading || deleteLoading}
      />

      {/* Emoji Picker */}
      {showEmojiPicker && allowEmoji && (
        <div className="mt-2 p-4 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] max-h-64 overflow-y-auto">
          <div className="text-sm text-[var(--foreground-muted)] mb-3 font-medium">Choose an emoji badge:</div>
          <div className="grid grid-cols-10 gap-1">
            {commonEmojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleEmojiSelect(emoji)}
                className="p-2 text-lg hover:bg-[var(--input-bg)] rounded-[var(--radius-sm)] transition-colors hover:scale-110 transform duration-150"
                title={`Use ${emoji} as badge`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-[var(--border)]">
            <div className="text-xs text-[var(--foreground-muted)]">
              💡 Tip: Emoji badges are automatically created with transparent backgrounds
            </div>
          </div>
        </div>
      )}

      {!preview && !isLoading && !deleteLoading && (
        <div className="mt-1 text-xs text-[var(--foreground-muted)]">
          💡 For best results, use PNG images with transparent backgrounds
        </div>
      )}

      {error && <p className="mt-1 text-sm text-[var(--error)]">{error}</p>}
    </div>
  );
} 