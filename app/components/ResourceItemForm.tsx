import React, { useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import FileUpload from "./FileUpload";
import uploadService from "./service/upload.service";
import config from "./config/config";

interface ResourceFile {
  url: string;
  key: string;
  path?: string;
  _id?: string;
  name?: string;
  type?: string;
  size?: number;
}

interface ResourceItem {
  title: string;
  description: string;
  file: ResourceFile[];
  _id?: string;
}

interface ResourceItemFormProps {
  items: ResourceItem[];
  onChange: (items: ResourceItem[]) => void;
  isLoading?: boolean;
}

export default function ResourceItemForm({
  items = [],
  onChange,
  isLoading = false,
}: ResourceItemFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);

  const handleAddItem = () => {
    const newItem: ResourceItem = {
      title: "",
      description: "",
      file: [],
    };
    onChange([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (window.confirm("Are you sure you want to remove this resource item?")) {
      const newItems = [...items];
      newItems.splice(index, 1);
      onChange(newItems);
    }
  };

  const handleItemChange = (index: number, field: keyof ResourceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    onChange(newItems);
  };

  const handleFilesChange = (index: number, files: ResourceFile[]) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      file: files,
    };
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-[var(--foreground)]">Resource Items</h3>
        <button
          type="button"
          onClick={handleAddItem}
          disabled={isLoading || isUploading}
          className="px-3 py-1 bg-[var(--primary)] text-white rounded-[var(--radius-sm)] text-xs hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-4 text-center bg-[var(--input-bg)] rounded-[var(--radius-md)] text-[var(--foreground-muted)]">
          <p>No resource items added yet.</p>
          <p className="text-sm mt-1">Click &apos;Add Item&apos; to create your first resource.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item, index) => (
            <div 
              key={index}
              className="p-4 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--input-bg)]"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-[var(--foreground)]">
                  Item {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  disabled={isLoading || isUploading}
                  className="px-2 py-1 bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20 rounded-[var(--radius-sm)] text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label 
                    htmlFor={`item-${index}-title`}
                    className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                  >
                    Title *
                  </label>
                  <input 
                    type="text"
                    id={`item-${index}-title`}
                    value={item.title}
                    onChange={(e) => handleItemChange(index, "title", e.target.value)}
                    placeholder="Enter resource title"
                    className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    required
                  />
                </div>

                <div>
                  <label 
                    htmlFor={`item-${index}-description`}
                    className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id={`item-${index}-description`}
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    placeholder="Enter resource description"
                    rows={3}
                    className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label 
                    className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                  >
                    Files *
                  </label>
                  <FileUpload
                    files={item.file}
                    onChange={(files) => handleFilesChange(index, files)}
                    isLoading={isLoading}
                    multiple={true}
                    maxFiles={5}
                    allowedFileTypes="*"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 