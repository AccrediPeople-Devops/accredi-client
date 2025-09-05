import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export default function Input({
  label,
  error,
  fullWidth = true,
  className = "",
  ...props
}: InputProps) {
  const id =
    props.id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className={`mb-4 ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-[var(--foreground)]"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-2 bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${error ? "border-[var(--error)]" : ""} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-[var(--error)]">{error}</p>}
    </div>
  );
}
