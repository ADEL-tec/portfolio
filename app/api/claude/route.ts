import { NextResponse } from "next/server";
import type { ChatRequest } from "@/types";

/**
 * Claude chat endpoint — placeholder.
 *
 * Wiring needed before this works:
 *   1. `npm i @anthropic-ai/sdk`
 *   2. Set `ANTHROPIC_API_KEY` in `.env.local`
 *   3. Replace the stub below with a real `client.messages.create({ ... })`
 *      call. For streaming responses, return a `ReadableStream` and set
 *      `Content-Type: text/event-stream`.
 *
 * The shape of the request body is `ChatRequest` from `@/types`.
 */
export async function POST(request: Request) {
  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json(
      { error: "`messages` must be a non-empty array" },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Server is not configured: ANTHROPIC_API_KEY is missing." },
      { status: 503 },
    );
  }

  // Stub until the SDK is wired in. Replace this block with the real call.
  return NextResponse.json({
    role: "assistant",
    content:
      "The Claude chat endpoint is reachable, but the SDK call is not yet wired up.",
  });
}
