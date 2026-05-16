import { NextResponse, type NextRequest } from "next/server";
import type { ContactFormData, ContactFormResponse } from "@/types";

/**
 * Contact form endpoint.
 *
 * - Validates payload (length, email format)
 * - Silently accepts honeypot submissions so bots learn nothing
 * - Rate-limits to 5 requests per IP per hour using an in-memory bucket
 * - Returns the typed `ContactFormResponse` envelope
 *
 * Email delivery is intentionally stubbed — wire one of Resend, SES, or
 * a Slack webhook where marked. The endpoint is excluded from the static
 * export deploy (see `.github/workflows/deploy.yml`); for production
 * delivery move this to a host that runs Node, or call a third-party form
 * service directly from the client.
 */

// ─── Rate limiter (in-memory, per process) ────────────────────────────────

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

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

// ─── Validation ───────────────────────────────────────────────────────────

function validate(data: ContactFormData): ContactFormResponse {
  if (!data.name || data.name.trim().length < 2) {
    return { ok: false, error: "Name is too short", field: "name" };
  }
  if (data.name.length > 50) {
    return { ok: false, error: "Name is too long", field: "name" };
  }
  if (!/^\S+@\S+\.\S+$/.test(data.email ?? "")) {
    return { ok: false, error: "Invalid email", field: "email" };
  }
  if (!data.subject || data.subject.trim().length < 5) {
    return { ok: false, error: "Subject is too short", field: "subject" };
  }
  if (!data.message || data.message.trim().length < 10) {
    return { ok: false, error: "Message is too short", field: "message" };
  }
  if (data.message.length > 5000) {
    return { ok: false, error: "Message is too long", field: "message" };
  }
  return { ok: true };
}

// ─── Handler ──────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: ContactFormData;
  try {
    body = (await request.json()) as ContactFormData;
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  // Honeypot — accept silently so the bot doesn't learn the field is suspect.
  if (body.website && body.website.trim() !== "") {
    return json({ ok: true });
  }

  // Rate limit before validation so abusive bots can't probe field rules.
  const ip = clientIp(request);
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests, please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const result = validate(body);
  if (!result.ok) return json(result, 400);

  // ─── TODO: forward `body` to a delivery provider ──────────────────────
  // Example with Resend:
  //   await resend.emails.send({
  //     from: 'portfolio@adel.dev',
  //     to: process.env.CONTACT_TO!,
  //     reply_to: body.email,
  //     subject: `[Portfolio] ${body.subject}`,
  //     text: `From ${body.name} <${body.email}>\n\n${body.message}`,
  //   });

  return json({ ok: true });
}

function json(body: ContactFormResponse, status = 200) {
  return NextResponse.json(body, { status });
}
