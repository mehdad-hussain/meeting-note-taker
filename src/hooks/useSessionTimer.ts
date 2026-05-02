"use client";

import { useMeetingStore } from "@/store/meetingStore";
import { useEffect, useState } from "react";

export function useSessionTimer(): number {
  const [elapsed, setElapsed] = useState(0);
  const status = useMeetingStore((s) => s.status);
  const sessionStartTime = useMeetingStore((s) => s.sessionStartTime);

  useEffect(() => {
    if (status !== "recording" || !sessionStartTime) {
      if (status !== "recording") setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [status, sessionStartTime]);

  return elapsed;
}
