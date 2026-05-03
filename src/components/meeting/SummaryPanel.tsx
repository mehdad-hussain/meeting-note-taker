"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { buildTranscriptText } from "@/lib/utils";
import { useMeetingStore } from "@/store/meetingStore";
import type { MeetingSummary } from "@/types/meeting";
import { CheckCircle, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

export function SummaryPanel() {
  const status = useMeetingStore((s) => s.status);
  const segments = useMeetingStore((s) => s.segments);
  const summary = useMeetingStore((s) => s.summary);
  const isSummaryLoading = useMeetingStore((s) => s.isSummaryLoading);
  const setSummary = useMeetingStore((s) => s.setSummary);
  const setIsSummaryLoading = useMeetingStore((s) => s.setIsSummaryLoading);
  const [error, setError] = useState<string | null>(null);

  if (status !== "stopped") return null;

  async function handleGenerateSummary() {
    setError(null);
    setIsSummaryLoading(true);
    try {
      const transcript = buildTranscriptText(segments);
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string; };
        throw new Error(data.error ?? "Summary generation failed");
      }

      const data = (await res.json()) as MeetingSummary;
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate summary.");
    } finally {
      setIsSummaryLoading(false);
    }
  }

  return (
    <Card title="Meeting Summary">
      {!summary && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Recording stopped. Ready to generate your meeting summary.
          </p>
          <Button
            variant="primary"
            onClick={handleGenerateSummary}
            disabled={isSummaryLoading || segments.length === 0}
          >
            {isSummaryLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isSummaryLoading ? "Generating…" : "Generate Summary"}
          </Button>
          {error && <p className="text-xs text-red-500">{error}</p>}
          {segments.length === 0 && (
            <p className="text-xs text-amber-600">No transcript found — nothing to summarize.</p>
          )}
        </div>
      )}

      {summary && (
        <div className="space-y-5">
          <section>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Summary
            </h3>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">{summary.summary}</p>
          </section>

          {summary.keyPoints.length > 0 && (
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Key Points
              </h3>
              <ul className="space-y-1">
                {summary.keyPoints.map((point) => (
                  <li
                    key={`${point.slice(0, 10)}-${Math.random()}`}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200"
                  >
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    {point}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {summary.actionItems.length > 0 && (
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Action Items
              </h3>
              <ul className="space-y-1">
                {summary.actionItems.map((item, i) => (
                  <li
                    key={`${item.slice(0, 10)}-${Math.random()}`}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </Card>
  );
}
