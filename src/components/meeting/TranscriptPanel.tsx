"use client";

import { Card } from "@/components/ui/Card";
import { useMeetingStore } from "@/store/meetingStore";
import { useEffect, useRef } from "react";

export function TranscriptPanel() {
  const segments = useMeetingStore((s) => s.segments);
  const interimText = useMeetingStore((s) => s.interimText);
  const status = useMeetingStore((s) => s.status);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const isEmpty = segments.length === 0 && !interimText;

  const badge = (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${status === "recording"
          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
        }`}
    >
      {status === "recording" ? "● LIVE" : "Transcript"}
    </span>
  );

  return (
    <Card title="Transcript" badge={badge}>
      <div className="h-64 overflow-y-auto pr-1 font-mono text-sm leading-relaxed">
        {isEmpty ? (
          <p className="italic text-gray-400 dark:text-gray-500">
            {status === "recording"
              ? "Listening… start speaking"
              : "Transcript will appear here when you start recording."}
          </p>
        ) : (
          <>
            {segments.map((seg) => (
              <span key={seg.id} className="text-gray-800 dark:text-gray-100">
                {seg.text}{" "}
              </span>
            ))}
            {interimText && <span className="italic text-gray-400 dark:text-gray-500">{interimText}</span>}
          </>
        )}
        <div ref={bottomRef} />
      </div>
    </Card>
  );
}
