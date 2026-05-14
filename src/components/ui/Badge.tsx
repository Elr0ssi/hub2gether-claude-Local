import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "tag" | "muted";
  className?: string;
}

export function Badge({ children, variant = "accent", className }: BadgeProps) {
  return (
    <span
      className={cn(
        variant === "accent" ? "accent-badge" : variant === "tag" ? "tag" : "tag",
        className
      )}
    >
      {children}
    </span>
  );
}
