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
          className="block mb-2 text-sm font-medium text-white"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`auth-input ${error ? "border-error" : ""} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}
