import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

import type { ChatRequest } from "@/types";

/**
 * Claude chat endpoint for the portfolio assistant.
 *
 * - Uses the Anthropic SDK to call `claude-haiku-4-5-20251001` (fast and
 *   inexpensive, well-suited for short portfolio Q&A).
 * - System prompt is composed server-side from portfolio facts so the
 *   client can't override it and burn credit on arbitrary tasks.
 * - Rate-limited to 10 messages per IP per hour using an in-memory bucket.
 * - Caps message count and per-message length to bound upstream spend.
 *
 * Excluded from the static-export deploy (the workflow moves `app/api/`
 * aside before `next build`). The chat widget falls back to an "offline"
 * state when the route 404s in production.
 */

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS_OUT = 600;
const MAX_MESSAGES = 24;
const MAX_MESSAGE_LENGTH = 2000;

// ─── Rate limiter (per-process, in-memory) ────────────────────────────────

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 10;

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function rateLimit(ip: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (bucket.count >= MAX_REQUESTS) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true };
}

function clientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

// ─── System prompt builder ────────────────────────────────────────────────

const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  fr: "French",
  ar: "Arabic",
};

function buildSystemPrompt(locale: string): string {
  const languageName = LOCALE_NAMES[locale] ?? "English";
  return [
    "You are Adel's portfolio assistant.",
    "Help visitors learn about Adel's projects, skills, and collaboration",
    "opportunities. Be friendly, professional, and knowledgeable about",
    "Flutter, full-stack development, and Adel's work.",
    "",
    "About Adel:",
    "- Full-Stack Developer & Flutter Expert based in Doha, Qatar",
    "- 5+ years of experience shipping production mobile and web apps",
    "- Currently a Flutter Developer at Fiveline Website Solutions",
    "- Education: Master's in Web and Knowledge Engineering (2024),",
    "  BSc in Software Engineering (2021)",
    "",
    "Featured projects (published on Play Store / App Store):",
    "1. AwashZ — On-demand car wash app (Flutter, Firebase, FCM, Google Maps)",
    "2. Glamix — Salon booking platform (Flutter, Firebase, payment gateway)",
    "3. Discount Plus — Digital discounts & loyalty (Flutter, Firebase",
    "   Realtime DB, QR/barcode scanning), live on iOS + Android",
    "",
    "Skills: Flutter/Dart (Expert), Node.js + Express + NestJS (Advanced),",
    "React + TypeScript (Advanced), Firebase + MongoDB + PostgreSQL,",
    "GCP + AWS + Docker, Clean Architecture, BLoC, Provider.",
    "",
    "Guidelines:",
    "- Keep replies concise (2–5 sentences when possible).",
    "- Reference specific projects when relevant.",
    "- For collaboration inquiries, suggest emailing meriouaadel22@gmail.com",
    "  or using the contact form on this site.",
    `- Reply in ${languageName} unless the user writes in another language —`,
    "  in that case, match the user's language.",
    "- Don't invent projects, employers, or features that aren't listed",
    "  above. If you don't know, say so and offer to connect by email.",
  ].join("\n");
}

// ─── Handler ──────────────────────────────────────────────────────────────

type ChatRequestBody = ChatRequest & { locale?: string };

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Server is not configured: ANTHROPIC_API_KEY is missing." },
      { status: 503 },
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json(
      { error: "`messages` must be a non-empty array" },
      { status: 400 },
    );
  }
  if (body.messages.length > MAX_MESSAGES) {
    return NextResponse.json(
      { error: "Conversation is too long; clear history and try again." },
      { status: 400 },
    );
  }
  for (const m of body.messages) {
    if (typeof m.content !== "string" || m.content.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Each message must be ≤ ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 },
      );
    }
  }

  const ip = clientIp(request);
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many messages — please wait a moment." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const locale = body.locale ?? "en";
  const systemPrompt = buildSystemPrompt(locale);

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS_OUT,
      system: systemPrompt,
      messages: body.messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

    return NextResponse.json({ role: "assistant", content: text });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upstream model call failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
