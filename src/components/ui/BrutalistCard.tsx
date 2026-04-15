interface BrutalistCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function BrutalistCard({
  children,
  className = "",
  hover = false,
}: BrutalistCardProps) {
  return (
    <div
      className={`bg-surface border-4 border-[#333333] brutalist-shadow ${
        hover ? "hover:-translate-y-2 transition-transform" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
