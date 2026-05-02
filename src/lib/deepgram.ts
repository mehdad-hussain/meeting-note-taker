/**
 * Builds the Deepgram real-time streaming WebSocket URL.
 * Connection is made directly from the browser using the API key via
 * the WebSocket subprotocol trick: ["token", apiKey].
 */
export function buildDeepgramUrl(): string {
  const params = new URLSearchParams({
    model: "nova-2",
    language: "en-US",
    punctuate: "true",
    interim_results: "true",
    smart_format: "true",
    diarize: "true",
    utterance_end_ms: "1800",
  });
  return `wss://api.deepgram.com/v1/listen?${params.toString()}`;
}

export const AUDIO_CONSTRAINTS: MediaStreamConstraints = {
  audio: {
    channelCount: 1,
    sampleRate: 16000,
    echoCancellation: true,
    noiseSuppression: true,
  },
};
