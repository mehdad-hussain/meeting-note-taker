"use client";

import { Card } from "@/components/ui/Card";
import { useMeetingStore } from "@/store/meetingStore";
import { useMemo } from "react";

const NOTE_MERGE_GAP_MS = 2200;

type LiveNote = {
  id: string;
  speaker: number | null;
  text: string;
  lastTimestamp: number;
};

function mergeNoteText(current: string, incoming: string): string {
  const trimmedCurrent = current.trimEnd();
  const trimmedIncoming = incoming.trimStart();
  if (!trimmedCurrent) return trimmedIncoming;
  if (!trimmedIncoming) return trimmedCurrent;
  return `${trimmedCurrent} ${trimmedIncoming}`;
}

export function NotesPanel() {
  const segments = useMeetingStore((s) => s.segments);
  const notes = useMemo(() => {
    return segments.reduce<LiveNote[]>((acc, seg) => {
      const previous = acc.at(-1);

      if (!previous) {
        acc.push({
          id: seg.id,
          speaker: seg.speaker,
          text: seg.text,
          lastTimestamp: seg.timestamp,
        });
        return acc;
      }

      const sameSpeaker = previous.speaker === seg.speaker;
      const bothUnknown = previous.speaker === null && seg.speaker === null;
      const withinMergeGap = seg.timestamp - previous.lastTimestamp <= NOTE_MERGE_GAP_MS;

      if ((sameSpeaker || bothUnknown) && withinMergeGap) {
        previous.text = mergeNoteText(previous.text, seg.text);
        previous.lastTimestamp = seg.timestamp;
        return acc;
      }

      acc.push({
        id: seg.id,
        speaker: seg.speaker,
        text: seg.text,
        lastTimestamp: seg.timestamp,
      });

      return acc;
    }, []);
  }, [segments]);

  return (
    <Card title="Live Notes">
      <div className="h-64 space-y-2 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="italic text-sm text-gray-400 dark:text-gray-500">
            Finalized sentences appear here as you speak.
          </p>
        ) : (
          notes.map((note, i) => (
            <div
              key={note.id}
              className="flex gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <span className="mt-0.5 shrink-0 text-xs font-bold text-blue-500">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {note.speaker === null ? "Speaker" : `Speaker ${note.speaker + 1}`}
                </p>
                <p>{note.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
