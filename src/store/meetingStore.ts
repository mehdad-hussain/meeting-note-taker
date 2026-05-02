import type { MeetingActions, MeetingState } from "@/types/meeting";
import { create } from "zustand";

const initialState: MeetingState = {
  status: "idle",
  segments: [],
  interimText: "",
  summary: null,
  isSummaryLoading: false,
  sessionStartTime: null,
  error: null,
};

export const useMeetingStore = create<MeetingState & MeetingActions>()((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),
  addSegment: (segment) => set((state) => ({ segments: [...state.segments, segment] })),
  setInterimText: (interimText) => set({ interimText }),
  setSummary: (summary) => set({ summary }),
  setIsSummaryLoading: (isSummaryLoading) => set({ isSummaryLoading }),
  setSessionStartTime: (sessionStartTime) => set({ sessionStartTime }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
