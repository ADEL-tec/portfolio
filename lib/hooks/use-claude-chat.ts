"use client";

import { useCallback, useRef, useState } from "react";
import { useLocale } from "next-intl";

import type { Locale } from "@/i18n/routing";
import type { ChatMessage, ChatRequest } from "@/types";

export type ChatStatus = "idle" | "sending" | "error" | "offline";

export interface UseClaudeChatResult {
  /** Full conversation, oldest first. Includes both user and assistant turns. */
  messages: ChatMessage[];
  /** Current request state. `offline` means the route 404'd (static export). */
  status: ChatStatus;
  /** Last error message, or `null` if nothing has gone wrong since the last send. */
  error: string | null;
  /** True while a request is in flight. */
  isLoading: boolean;
  /** Submit a user message and append the assistant reply when it arrives. */
  send: (content: string) => Promise<void>;
  /** Clear the conversation and any error state. */
  reset: () => void;
}

/**
 * Drives a chat conversation against `/api/claude`.
 *
 * The hook owns the message list and the request lifecycle. Append is
 * optimistic — the user message shows immediately, the assistant turn
 * comes later. The most recent in-flight request is tracked via a ref so
 * a second `send()` doesn't race a previous reply.
 *
 * The active locale is sent with each request so the system prompt nudges
 * Claude to reply in the visitor's language.
 */
export function useClaudeChat(): UseClaudeChatResult {
  const locale = useLocale() as Locale;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  /** Sequence number for the most recently-issued request. Replies from
   *  earlier requests are dropped so a slow first send can't overwrite a
   *  fast second one. */
  const requestSeq = useRef(0);

  const send = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      };

      // Capture the history at submit time so the API call uses exactly
      // what the user sees on screen.
      let historyForRequest: ChatMessage[] = [];
      setMessages((prev) => {
        historyForRequest = [...prev, userMsg];
        return historyForRequest;
      });

      const mySeq = ++requestSeq.current;
      setStatus("sending");
      setError(null);

      try {
        const body: ChatRequest & { locale: Locale } = {
          locale,
          messages: historyForRequest.map(({ role, content }) => ({
            role,
            content,
          })),
        };
        const res = await fetch("/api/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        // A different send() superseded this one — drop the reply.
        if (mySeq !== requestSeq.current) return;

        if (res.status === 404) {
          setStatus("offline");
          return;
        }

        if (!res.ok) {
          const errBody = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          setError(errBody?.error ?? `Request failed (${res.status})`);
          setStatus("error");
          return;
        }

        const data = (await res.json()) as { content: string };
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: data.content,
            createdAt: Date.now(),
          },
        ]);
        setStatus("idle");
      } catch (e) {
        if (mySeq !== requestSeq.current) return;
        // Network errors typically also mean the API isn't reachable.
        setStatus("offline");
        if (e instanceof Error) setError(e.message);
      }
    },
    [locale],
  );

  const reset = useCallback(() => {
    requestSeq.current += 1;
    setMessages([]);
    setStatus("idle");
    setError(null);
  }, []);

  return {
    messages,
    status,
    error,
    isLoading: status === "sending",
    send,
    reset,
  };
}
