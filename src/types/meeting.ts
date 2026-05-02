export type RecordingStatus = "idle" | "recording" | "stopped" | "error";

export interface TranscriptSegment {
  id: string;
  text: string;
  isFinal: boolean;
  timestamp: number;
  speaker: number | null;
}

export interface MeetingSummary {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
}

export interface MeetingState {
  status: RecordingStatus;
  segments: TranscriptSegment[];
  interimText: string;
  summary: MeetingSummary | null;
  isSummaryLoading: boolean;
  sessionStartTime: number | null;
  error: string | null;
}

export interface MeetingActions {
  setStatus: (status: RecordingStatus) => void;
  addSegment: (segment: TranscriptSegment) => void;
  setInterimText: (text: string) => void;
  setSummary: (summary: MeetingSummary) => void;
  setIsSummaryLoading: (loading: boolean) => void;
  setSessionStartTime: (time: number) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}
