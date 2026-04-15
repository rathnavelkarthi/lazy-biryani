import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`bg-surface border-4 border-[#333333] px-6 py-4 text-lg font-bold brutalist-shadow focus:outline-none focus:ring-0 focus:border-primary transition-colors ${
            error ? "border-error" : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-sm font-bold text-error">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
