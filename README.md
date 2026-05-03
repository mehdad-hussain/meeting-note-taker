# Meeting Note Taker

Real-time meeting transcription with AI-powered summaries. Speak into your mic, watch the transcript appear live with automatic speaker detection, then generate a structured summary with key points and action items.

---

## How It Works

```
Microphone
    │
    ▼
MediaRecorder API  ──► audio chunks (binary, 250ms slices)
    │
    ▼
Deepgram WebSocket  ──► interim / final transcript JSON
    │
    ▼
useDeepgram hook   ──► Zustand store
    │
    ├──► TranscriptPanel  (live, auto-scroll)
    └──► NotesPanel       (finalized sentences, numbered)

[Stop Recording]
    │
    ▼
POST /api/summary  ──► OpenAI gpt-4o-mini
    │
    ▼
SummaryPanel  ──► summary · key points · action items
```

The browser streams audio **directly** to Deepgram's WebSocket API — no backend relay. The Deepgram API key is a `NEXT_PUBLIC_` variable because the connection is made client-side. The OpenAI call goes through a Next.js API route (`/api/summary`) so the OpenAI key is never exposed to the browser.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Speech-to-Text | Deepgram Real-Time Streaming API |
| AI Summary | OpenAI `gpt-4o-mini` |
| State | Zustand |
| Styling | Tailwind CSS v4 |
| Linting / Formatting | Biome |
| Language | TypeScript |

---

## Setup

### Prerequisites

- Node.js ≥ 22
- pnpm ≥ 10

### 1. Clone the repository

```bash
git clone <repo-url>
cd meeting-note-taker
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your keys:

```env
NEXT_PUBLIC_DEEPGRAM_API_KEY=your_deepgram_api_key
OPENAI_API_KEY=your_openai_api_key
```

> **Deepgram key:** Get one free at [deepgram.com](https://deepgram.com)  
> **OpenAI key:** Get one at [platform.openai.com](https://platform.openai.com)

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Usage

1. Click **Start Recording** — grant microphone access when prompted.
2. Speak — transcript updates in real time on the left panel; finalized sentences populate the Notes panel on the right.
3. Click **Stop Recording** when done.
4. Click **Generate Summary** — the full transcript is sent to OpenAI and returns a summary, key points, and action items.
5. Click **New Session** to reset and record again.

---

## Key Technical Decisions

| Decision | Rationale |
|---|---|
| Direct browser → Deepgram WebSocket | Eliminates backend relay, reduces latency by ~100–300 ms |
| `NEXT_PUBLIC_` for Deepgram key | Connection is client-side; accepted tradeoff for simplicity |
| `gpt-4o-mini` | ~10× cheaper than `gpt-4o`, fast, sufficient for summarization |
| Zustand | Lightweight global state without Context boilerplate |
| `response_format: json_object` | Guarantees parseable OpenAI output, no regex hacks |
| 250 ms `timeslice` on MediaRecorder | Low-latency audio streaming without hammering the socket |
| `interim_results: true` | Shows a typing preview — perceived responsiveness |
| `diarize: true` + word-level `speaker` IDs | Detects up to 3+ different voices from a single mic; consecutive segments from the same speaker are merged into one note block |
| Biome | Single tool replacing ESLint + Prettier, zero config conflicts |

---

## Known Limitations

- **Browser only** — microphone access requires a modern browser (Chrome/Edge recommended)
- **HTTPS required** in production — `getUserMedia` is blocked on non-secure origins
- **No persistence** — transcript and summary live in memory; refresh resets the session
- **Single microphone diarization** — speaker detection works well for 2–3 participants in the same room; accuracy degrades with more speakers or heavy background noise
- **Deepgram key is client-visible** — acceptable for development/demos; for production, proxy through a backend or use Deepgram's short-lived token API

---

## Scripts

```bash
pnpm dev       # Start development server
pnpm build     # Production build
pnpm start     # Start production server
pnpm lint      # Biome lint
pnpm format    # Biome format
pnpm check     # Biome check (lint + format)
```


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
