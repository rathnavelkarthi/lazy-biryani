"use client";

import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary-container text-on-primary-container border-4 border-[#333333]",
  secondary:
    "bg-surface-container-highest text-on-surface border-4 border-[#333333]",
  danger: "bg-secondary text-white border-4 border-[#333333]",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm font-bold",
  md: "px-6 py-3 text-lg font-bold",
  lg: "px-10 py-5 text-2xl font-black",
};

interface BrutalistButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

export function BrutalistButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: BrutalistButtonProps) {
  return (
    <button
      className={`font-[family-name:var(--font-plus-jakarta-sans)] brutalist-shadow brutalist-shadow-hover transition-all ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
