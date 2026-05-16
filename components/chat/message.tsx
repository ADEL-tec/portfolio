"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { copyToClipboard, formatDate } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import type { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
  /** When true, copy button appears on hover and Markdown-ish blocks render. */
  isAssistant?: boolean;
}

/**
 * One chat bubble. Layout:
 *   • User messages — inline-end aligned, brand-blue bubble
 *   • Assistant messages — inline-start aligned, muted bubble, copy button
 *
 * Content rendering is intentionally minimal: a small tokenizer splits the
 * content into prose paragraphs and triple-backtick code blocks. Inline
 * code (single backticks) gets monospaced styling. Anything fancier would
 * pull in a markdown library — we want the chat bundle to stay slim.
 */
export function ChatMessage({ message, isAssistant }: ChatMessageProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Chat");
  const [copied, setCopied] = useState(false);

  const timestamp = formatDate(message.createdAt, locale, {
    hour: "numeric",
    minute: "2-digit",
  });

  const onCopy = async () => {
    const ok = await copyToClipboard(message.content);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const blocks = parseBlocks(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group flex flex-col gap-1",
        isAssistant ? "items-start" : "items-end",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
          isAssistant
            ? "rounded-bl-sm bg-muted text-foreground"
            : "rounded-br-sm bg-brand-600 text-white",
        )}
      >
        {blocks.map((block, i) =>
          block.type === "code" ? (
            <pre
              key={i}
              className={cn(
                "my-1 overflow-x-auto rounded-lg p-3 text-xs leading-relaxed",
                isAssistant
                  ? "bg-background/60 font-mono text-foreground"
                  : "bg-black/20 font-mono",
              )}
            >
              {block.text}
            </pre>
          ) : (
            <p
              key={i}
              className="whitespace-pre-wrap [&:not(:last-child)]:mb-1"
            >
              {renderInline(block.text)}
            </p>
          ),
        )}
      </div>

      <div
        className={cn(
          "flex items-center gap-1.5 text-[10px] text-muted-foreground",
          isAssistant ? "ps-2" : "pe-2",
        )}
      >
        <span>{timestamp}</span>
        {isAssistant && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onCopy}
            aria-label={copied ? t("copied") : t("copy")}
            title={copied ? t("copied") : t("copy")}
            className={cn(
              "opacity-0 transition-opacity",
              "group-hover:opacity-100 focus-visible:opacity-100",
            )}
          >
            {copied ? (
              <Check className="size-3 text-accent-500" aria-hidden="true" />
            ) : (
              <Copy className="size-3" aria-hidden="true" />
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Minimal markdown-ish parsing ─────────────────────────────────────────

type Block = { type: "code" | "text"; text: string };

/** Split content on triple-backtick fences so code can render in a `<pre>`. */
function parseBlocks(content: string): Block[] {
  const out: Block[] = [];
  const fence = /```[a-zA-Z0-9_-]*\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = fence.exec(content)) !== null) {
    if (match.index > lastIndex) {
      out.push({ type: "text", text: content.slice(lastIndex, match.index) });
    }
    out.push({ type: "code", text: match[1]!.replace(/\n$/, "") });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    out.push({ type: "text", text: content.slice(lastIndex) });
  }
  return out.length ? out : [{ type: "text", text: content }];
}

/** Replace **bold** and `inline code` with styled spans. Anything else
 *  passes through unchanged so model output reads naturally. */
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // One regex handles both `code` and **bold** so order is preserved.
  const re = /(\*\*[^*]+\*\*)|(`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={key++}>{token.slice(2, -2)}</strong>,
      );
    } else {
      nodes.push(
        <code
          key={key++}
          className="rounded bg-background/40 px-1 py-0.5 font-mono text-[0.85em]"
        >
          {token.slice(1, -1)}
        </code>,
      );
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes.length ? nodes : [text];
}
