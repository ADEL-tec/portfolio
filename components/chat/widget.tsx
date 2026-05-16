"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Download,
  MessageCircle,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClaudeChat } from "@/lib/hooks/use-claude-chat";
import type { Locale } from "@/i18n/routing";
import type { ChatMessage as ChatMessageType } from "@/types";
import { ChatMessage } from "./message";

const MAX_INPUT_LENGTH = 1500;

/**
 * Floating chat widget. Bottom-right launcher button expands into a panel
 * with the conversation, a typing indicator while waiting on the model,
 * and a composer with a Send button.
 *
 * Mounted from the locale layout so it appears on every page. The launcher
 * is `aria-expanded`-driven; closing collapses focus back to it.
 *
 * Note on RTL: the widget stays anchored to the visual bottom-right even
 * in RTL locales (chat-widget convention). Text inside follows `<html dir>`.
 */
export function ChatWidget() {
  const t = useTranslations("Chat");
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const { messages, status, error, isLoading, send, reset } = useClaudeChat();

  // Focus the composer when the panel opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Auto-scroll to the latest message on update.
  useEffect(() => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages, isLoading]);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!draft.trim() || isLoading) return;
    void send(draft);
    setDraft("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter submits, Shift+Enter inserts a newline.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <>
      {/* ─── Launcher ─────────────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("closeLabel") : t("openLabel")}
        aria-expanded={open}
        aria-controls="chat-panel"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "fixed bottom-6 right-6 z-40",
          "inline-flex size-14 items-center justify-center rounded-full",
          "bg-brand-600 text-white shadow-xl shadow-brand-900/30",
          "transition-colors hover:bg-brand-700",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="inline-flex"
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <MessageCircle className="size-5" aria-hidden="true" />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* ─── Panel ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="chat-panel"
            role="dialog"
            aria-modal="false"
            aria-label={t("title")}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed bottom-24 right-6 z-40",
              "flex h-[min(36rem,calc(100svh-8rem))] w-[min(24rem,calc(100vw-3rem))] flex-col",
              "overflow-hidden rounded-2xl border border-border bg-card shadow-2xl",
            )}
          >
            {/* Header */}
            <header className="flex items-center justify-between gap-2 border-b border-border bg-background/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400"
                >
                  <Bot className="size-4" />
                </span>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-foreground">
                    {t("title")}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {t("subtitle")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => downloadTranscript(messages)}
                      aria-label={t("download")}
                      title={t("download")}
                    >
                      <Download className="size-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={reset}
                      aria-label={t("clear")}
                      title={t("clear")}
                    >
                      <RotateCcw className="size-3.5" aria-hidden="true" />
                    </Button>
                  </>
                )}
              </div>
            </header>

            {/* Messages */}
            <div
              ref={scrollerRef}
              className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
            >
              {messages.length === 0 ? (
                <EmptyState />
              ) : (
                messages.map((m) => (
                  <ChatMessage
                    key={m.id}
                    message={m}
                    isAssistant={m.role === "assistant"}
                  />
                ))
              )}
              {isLoading && <TypingIndicator />}
              {(status === "error" || status === "offline") && (
                <ErrorBanner
                  message={
                    status === "offline" ? t("offline") : (error ?? t("error"))
                  }
                />
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={onSubmit}
              className="flex items-end gap-2 border-t border-border bg-background/50 px-3 py-3"
            >
              <label htmlFor="chat-input" className="sr-only">
                {t("placeholder")}
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                maxLength={MAX_INPUT_LENGTH}
                placeholder={t("placeholder")}
                disabled={status === "offline"}
                className={cn(
                  "min-h-[2.5rem] max-h-32 flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm",
                  "transition-colors placeholder:text-muted-foreground",
                  "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                )}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!draft.trim() || isLoading || status === "offline"}
                aria-label={t("send")}
              >
                <Send
                  className="size-4 rtl:rotate-180"
                  aria-hidden="true"
                />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────

function EmptyState() {
  const t = useTranslations("Chat");
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <span
        aria-hidden="true"
        className="inline-flex size-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400"
      >
        <Bot className="size-6" />
      </span>
      <p className="max-w-[15rem] text-sm text-muted-foreground">
        {t("welcome")}
      </p>
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────

function TypingIndicator() {
  const t = useTranslations("Chat");
  return (
    <div
      className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-muted px-3 py-2.5 text-sm text-muted-foreground self-start"
      aria-label={t("thinking")}
    >
      <span className="sr-only">{t("thinking")}</span>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block size-1.5 rounded-full bg-current"
          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.12,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Error banner ─────────────────────────────────────────────────────────

function ErrorBanner({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      role="status"
      className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
    >
      {message}
    </motion.div>
  );
}

// ─── Download transcript ──────────────────────────────────────────────────

function downloadTranscript(messages: ChatMessageType[]) {
  if (typeof document === "undefined" || messages.length === 0) return;
  const lines = messages.map((m) => {
    const ts = new Date(m.createdAt).toISOString();
    return `[${ts}] ${m.role.toUpperCase()}: ${m.content}`;
  });
  const blob = new Blob([lines.join("\n\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `chat-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
