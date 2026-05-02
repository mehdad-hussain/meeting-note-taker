"use client";

import { useMeetingStore } from "@/store/meetingStore";

export function ErrorBanner() {
  const error = useMeetingStore((s) => s.error);
  if (!error) return null;

  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
    >
      ⚠️ {error}
    </div>
  );
}
