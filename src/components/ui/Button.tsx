import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    const base =
      variant === "primary"
        ? "btn-primary"
        : variant === "secondary"
        ? "btn-secondary"
        : "btn-ghost";

    const sizeClass =
      size === "sm"
        ? "!px-3 !py-1.5 !text-xs"
        : size === "lg"
        ? "!px-6 !py-3 !text-base"
        : "";

    return (
      <button ref={ref} className={cn(base, sizeClass, className)} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
