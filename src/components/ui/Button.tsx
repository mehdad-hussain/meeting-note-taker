import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "secondary";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
          variant === "danger" && "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
          variant === "secondary" &&
          "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-4 py-2 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
