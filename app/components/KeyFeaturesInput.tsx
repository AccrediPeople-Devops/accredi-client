import React, { useState } from "react";

interface KeyFeaturesInputProps {
  label?: string;
  error?: string;
  value: string[];
  onChange: (features: string[]) => void;
  placeholder?: string;
}

export default function KeyFeaturesInput({
  label = "Key Features",
  error,
  value = [],
  onChange,
  placeholder = "Add a key feature",
}: KeyFeaturesInputProps) {
  const [newFeature, setNewFeature] = useState("");

  const addFeature = () => {
    if (newFeature.trim() === "") return;
    onChange([...value, newFeature.trim()]);
    setNewFeature("");
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...value];
    updatedFeatures.splice(index, 1);
    onChange(updatedFeatures);
  };

  return (
    <div className="mb-4 w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
          {label}
        </label>
      )}
      
      <div className="flex mb-2">
        <input
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          className="flex-1 px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] rounded-l-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addFeature();
            }
          }}
        />
        <button
          type="button"
          onClick={addFeature}
          className="bg-[var(--primary)] text-white px-4 py-2 rounded-r-[var(--radius-md)] hover:bg-[var(--primary)]/90"
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map((feature, index) => (
            <div 
              key={index} 
              className="inline-flex items-center bg-[var(--primary)]/20 text-[var(--foreground)] px-3 py-1.5 rounded-full"
            >
              <span>{feature}</span>
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="ml-2 text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
          ))}
        </div>
      )}
      
      {error && <p className="mt-1 text-sm text-[var(--error)]">{error}</p>}
    </div>
  );
} 