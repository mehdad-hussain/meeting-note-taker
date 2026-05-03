"use client";

import { Button } from "@/components/ui/Button";
import { useDeepgram } from "@/hooks/useDeepgram";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { formatDuration } from "@/lib/utils";
import { useMeetingStore } from "@/store/meetingStore";
import { Mic, MicOff, RotateCcw } from "lucide-react";

export function ControlBar() {
  const status = useMeetingStore((s) => s.status);
  const reset = useMeetingStore((s) => s.reset);
  const elapsed = useSessionTimer();
  const { startRecording, stopRecording } = useDeepgram();

  const isRecording = status === "recording";
  const isStopped = status === "stopped";

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        {isRecording && (
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
          </span>
        )}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {isRecording
            ? `Recording — ${formatDuration(elapsed)}`
            : isStopped
              ? "Recording stopped"
              : "Ready to record"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {!isRecording && !isStopped && (
          <Button variant="primary" size="lg" onClick={startRecording}>
            <Mic className="h-4 w-4" />
            Start Recording
          </Button>
        )}
        {isRecording && (
          <Button variant="danger" size="lg" onClick={stopRecording}>
            <MicOff className="h-4 w-4" />
            Stop Recording
          </Button>
        )}
        {isStopped && (
          <Button variant="secondary" size="md" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            New Session
          </Button>
        )}
      </div>
    </div>
  );
}
