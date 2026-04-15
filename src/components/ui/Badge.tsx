type BadgeVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "error"
  | "pending"
  | "success";

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary-container text-on-primary-container",
  secondary: "bg-secondary text-white",
  tertiary: "bg-tertiary text-white",
  error: "bg-error text-white",
  pending: "bg-primary-fixed text-on-primary-fixed",
  success: "bg-tertiary-container text-on-tertiary-container",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "primary",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-black uppercase tracking-wider ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
