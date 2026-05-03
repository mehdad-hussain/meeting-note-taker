import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  title: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, badge, children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</h2>
        {badge}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
