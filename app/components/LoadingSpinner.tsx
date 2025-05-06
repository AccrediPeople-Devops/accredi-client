import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
  fullScreen?: boolean;
  text?: string;
}

/**
 * A consistent loading spinner component for use across the application
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  className = "",
  fullScreen = false,
  text,
}) => {
  const sizeMap = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-b-2",
    large: "h-12 w-12 border-b-3",
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full ${sizeMap[size]} border-[var(--primary)] ${className}`}
    ></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--background)]/80 z-50">
        <div className="flex flex-col items-center">
          {spinner}
          {text && (
            <p className="mt-4 text-[var(--foreground-muted)]">{text}</p>
          )}
        </div>
      </div>
    );
  }

  if (text) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        {spinner}
        <p className="mt-2 text-[var(--foreground-muted)]">{text}</p>
      </div>
    );
  }

  return spinner;
}; 