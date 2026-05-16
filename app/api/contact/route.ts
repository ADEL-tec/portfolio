import { NextResponse } from "next/server";
import type { ContactFormData, ContactFormResponse } from "@/types";

/**
 * Contact form endpoint — validates payload and (eventually) forwards it
 * to a delivery provider. Wire one of: Resend, SES, Postmark, or a Slack
 * webhook in the marked block below.
 */
export async function POST(request: Request) {
  let body: ContactFormData;
  try {
    body = (await request.json()) as ContactFormData;
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  // Honeypot — silent accept so bots don't learn anything from the response.
  if (body.website && body.website.trim() !== "") {
    return json({ ok: true });
  }

  const validation = validate(body);
  if (!validation.ok) return json(validation, 400);

  // ─── TODO: forward `body` to your delivery provider ────────────────────
  // Example with Resend:
  //   await resend.emails.send({ from, to, subject: body.subject, text: body.message });

  return json({ ok: true });
}

function validate(data: ContactFormData): ContactFormResponse {
  if (!data.name || data.name.trim().length < 2) {
    return { ok: false, error: "Name is too short", field: "name" };
  }
  if (!/^\S+@\S+\.\S+$/.test(data.email ?? "")) {
    return { ok: false, error: "Invalid email", field: "email" };
  }
  if (!data.message || data.message.trim().length < 10) {
    return { ok: false, error: "Message is too short", field: "message" };
  }
  return { ok: true };
}

function json(body: ContactFormResponse, status = 200) {
  return NextResponse.json(body, { status });
}
