"use client";

import { env } from "@/env";
import { AUDIO_CONSTRAINTS, buildDeepgramUrl } from "@/lib/deepgram";
import { useMeetingStore } from "@/store/meetingStore";
import type { TranscriptSegment } from "@/types/meeting";
import { useCallback, useRef } from "react";

// Shape of the Deepgram Results message we care about
interface DeepgramResponse {
  type: string;
  channel: {
    alternatives: Array<{
      transcript: string;
      words?: Array<{
        speaker?: number;
      }>;
    }>;
  };
  is_final: boolean;
}

function getDominantSpeaker(words: Array<{ speaker?: number }> | undefined): number | null {
  if (!words || words.length === 0) return null;

  const counts = new Map<number, number>();
  for (const word of words) {
    if (typeof word.speaker !== "number") continue;
    counts.set(word.speaker, (counts.get(word.speaker) ?? 0) + 1);
  }

  let topSpeaker: number | null = null;
  let topCount = 0;
  for (const [speaker, count] of counts) {
    if (count > topCount) {
      topSpeaker = speaker;
      topCount = count;
    }
  }

  return topSpeaker;
}

export function useDeepgram() {
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { setStatus, addSegment, setInterimText, setSessionStartTime, setError, reset } =
    useMeetingStore();

  const startRecording = useCallback(async () => {
    try {
      reset();
      setStatus("recording");
      setSessionStartTime(Date.now());

      // Request mic access
      const stream = await navigator.mediaDevices.getUserMedia(AUDIO_CONSTRAINTS);
      streamRef.current = stream;

      // Open Deepgram WebSocket – auth via subprotocol so no key is in the URL
      const ws = new WebSocket(buildDeepgramUrl(), ["token", env.NEXT_PUBLIC_DEEPGRAM_API_KEY]);
      wsRef.current = ws;

      ws.onopen = () => {
        // Start sending audio chunks only once the socket is ready
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm";

        const recorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(e.data);
          }
        };

        // 250 ms timeslice = low latency without hammering the socket
        recorder.start(250);
      };

      ws.onmessage = (event) => {
        let data: DeepgramResponse;
        try {
          data = JSON.parse(event.data as string) as DeepgramResponse;
        } catch {
          return;
        }

        if (data.type !== "Results") return;

        const alternative = data.channel?.alternatives?.[0];
        const transcript = alternative?.transcript ?? "";
        if (!transcript.trim()) return;

        if (data.is_final) {
          const segment: TranscriptSegment = {
            id: crypto.randomUUID(),
            text: transcript,
            isFinal: true,
            timestamp: Date.now(),
            speaker: getDominantSpeaker(alternative?.words),
          };
          addSegment(segment);
          setInterimText("");
        } else {
          setInterimText(transcript);
        }
      };

      ws.onerror = () => {
        setError("WebSocket connection failed. Check your Deepgram API key.");
        setStatus("error");
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Microphone access denied";
      setError(message);
      setStatus("error");
    }
  }, [reset, setStatus, setSessionStartTime, addSegment, setInterimText, setError]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
    }
    streamRef.current = null;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "CloseStream" }));
      wsRef.current.close();
    }
    wsRef.current = null;

    setInterimText("");
    setStatus("stopped");
  }, [setInterimText, setStatus]);

  return { startRecording, stopRecording };
}
