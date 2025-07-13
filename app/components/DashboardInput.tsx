import React from "react";

interface DashboardInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
}

interface DashboardSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

interface DashboardTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
}

// Base styles for all form elements
const baseInputStyles = "w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] p-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted-foreground)]";

const labelStyles = "block text-sm font-medium text-[var(--foreground)] mb-1";
const errorStyles = "mt-1 text-sm text-red-500";

export function DashboardInput({
  label,
  error,
  required = false,
  fullWidth = true,
  className = "",
  ...props
}: DashboardInputProps) {
  const id = props.id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label htmlFor={id} className={labelStyles}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        className={`${baseInputStyles} ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className={errorStyles}>{error}</p>}
    </div>
  );
}

export function DashboardSelect({
  label,
  error,
  required = false,
  fullWidth = true,
  className = "",
  children,
  ...props
}: DashboardSelectProps) {
  const id = props.id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label htmlFor={id} className={labelStyles}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={id}
        className={`${baseInputStyles} ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className={errorStyles}>{error}</p>}
    </div>
  );
}

export function DashboardTextarea({
  label,
  error,
  required = false,
  fullWidth = true,
  className = "",
  ...props
}: DashboardTextareaProps) {
  const id = props.id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label htmlFor={id} className={labelStyles}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        className={`${baseInputStyles} resize-none ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className={errorStyles}>{error}</p>}
    </div>
  );
}

// Checkbox component
interface DashboardCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function DashboardCheckbox({
  label,
  error,
  className = "",
  ...props
}: DashboardCheckboxProps) {
  const id = props.id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        className={`h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] focus:ring-2 ${className}`}
        {...props}
      />
      {label && (
        <label htmlFor={id} className="ml-2 block text-sm text-[var(--foreground)]">
          {label}
        </label>
      )}
      {error && <p className={errorStyles}>{error}</p>}
    </div>
  );
} 