import { env } from "@/env";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openaiApiKey = env.OPENAI_API_KEY.trim();
const openai = new OpenAI({ apiKey: openaiApiKey });

export async function POST(req: NextRequest) {
  if (!openaiApiKey || openaiApiKey === "your_openai_key_here") {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured. Set a real key in env." },
      { status: 500 },
    );
  }

  try {
    const body = (await req.json()) as { transcript?: unknown };
    const { transcript } = body;

    if (!transcript || typeof transcript !== "string" || transcript.trim().length < 10) {
      return NextResponse.json({ error: "Transcript is too short to summarize." }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a meeting assistant. Analyze the transcript and return ONLY a valid JSON object with this exact structure:
{
  "summary": "2-3 sentence overview of the meeting",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "actionItems": ["action 1", "action 2"]
}
If there are no action items, return an empty array. Be concise and professional.`,
        },
        {
          role: "user",
          content: `Meeting transcript:\n\n${transcript}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return NextResponse.json(parsed);
  } catch (err) {
    // Return actionable messages for common upstream API failures.
    if (err instanceof OpenAI.APIError) {
      if (err.status === 401) {
        return NextResponse.json(
          { error: "OpenAI API key is invalid. Update OPENAI_API_KEY" },
          { status: 401 },
        );
      }

      if (err.status === 429) {
        return NextResponse.json(
          { error: "OpenAI rate limit reached. Please retry in a moment." },
          { status: 429 },
        );
      }

      return NextResponse.json(
        { error: `OpenAI request failed (${err.status ?? "unknown"}).` },
        { status: 502 },
      );
    }

    console.error("[/api/summary]", err);
    return NextResponse.json(
      { error: "Failed to generate summary. Please try again." },
      { status: 500 },
    );
  }
}
