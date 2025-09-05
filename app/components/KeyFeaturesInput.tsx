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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingValue(value[index]);
  };

  const saveEdit = () => {
    if (editingValue.trim() === "") return;
    const updatedFeatures = [...value];
    updatedFeatures[editingIndex!] = editingValue.trim();
    onChange(updatedFeatures);
    setEditingIndex(null);
    setEditingValue("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const moveFeature = (fromIndex: number, toIndex: number) => {
    const updatedFeatures = [...value];
    const [movedFeature] = updatedFeatures.splice(fromIndex, 1);
    updatedFeatures.splice(toIndex, 0, movedFeature);
    onChange(updatedFeatures);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveFeature(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      moveFeature(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    if (index < value.length - 1) {
      moveFeature(index, index + 1);
    }
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
        <div className="mt-3 space-y-2">
          <div className="text-xs text-[var(--foreground-muted)] mb-2">
            💡 <strong>Tips:</strong> Click any feature to edit • Drag to reorder • Press Enter to save • Press Escape to cancel
          </div>
          {value.map((feature, index) => (
            <div 
              key={index} 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-2 p-3 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--input-bg)]/80 transition-colors group ${
                draggedIndex === index ? 'opacity-50' : ''
              } ${editingIndex === index ? 'ring-2 ring-[var(--primary)]' : ''}`}
            >
              {/* Drag handle and move buttons */}
              <div className="flex flex-col items-center gap-1">
                <div className="cursor-move text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
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
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-0.5 text-[var(--foreground-muted)] hover:text-[var(--primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === value.length - 1}
                    className="p-0.5 text-[var(--foreground-muted)] hover:text-[var(--primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Feature number */}
              <div className="flex-shrink-0 w-6 h-6 bg-[var(--primary)] text-white text-xs rounded-full flex items-center justify-center font-medium">
                {index + 1}
              </div>

              {/* Feature content */}
              {editingIndex === index ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="flex-1 px-3 py-1 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveEdit();
                      } else if (e.key === "Escape") {
                        e.preventDefault();
                        cancelEdit();
                      }
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-[var(--radius-sm)] transition-colors"
                    title="Save changes"
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-[var(--radius-sm)] transition-colors"
                    title="Cancel editing"
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
              ) : (
                <div className="flex-1 flex items-center gap-2">
                  <span 
                    className="flex-1 text-[var(--foreground)] cursor-pointer hover:text-[var(--primary)] transition-colors"
                    onClick={() => startEditing(index)}
                    title="Click to edit"
                  >
                    {feature}
                  </span>
                  <button
                    type="button"
                    onClick={() => startEditing(index)}
                    className="p-1 text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-[var(--radius-sm)] transition-colors opacity-0 group-hover:opacity-100"
                    title="Edit feature"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-1 text-[var(--foreground-muted)] hover:text-red-600 hover:bg-red-50 rounded-[var(--radius-sm)] transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove feature"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {error && <p className="mt-1 text-sm text-[var(--error)]">{error}</p>}
    </div>
  );
} 