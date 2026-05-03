import { ControlBar } from "@/components/meeting/ControlBar";
import { ErrorBanner } from "@/components/meeting/ErrorBanner";
import { NotesPanel } from "@/components/meeting/NotesPanel";
import { SummaryPanel } from "@/components/meeting/SummaryPanel";
import { TranscriptPanel } from "@/components/meeting/TranscriptPanel";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Meeting Note Taker
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Real-time transcription by Deepgram · Summaries by OpenAI
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="space-y-4">
        <ControlBar />
        <ErrorBanner />

        <div className="grid gap-4 md:grid-cols-2">
          <TranscriptPanel />
          <NotesPanel />
        </div>

        <SummaryPanel />
      </div>
    </main>
  );
}
