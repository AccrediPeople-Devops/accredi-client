import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export default function TextArea({
  label,
  error,
  fullWidth = true,
  className = "",
  ...props
}: TextAreaProps) {
  const id =
    props.id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className={`mb-4 ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-white"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full px-4 py-2 bg-[#2A2A2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B2C6F] ${error ? "border-error" : ""} ${className}`}
        rows={4}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
} 