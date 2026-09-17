"use client";

import { useSyncExternalStore } from "react";

import { NO_FLASH_SCRIPT } from "@/lib/theme";

/**
 * The pre-paint theme script, emitted only into server-rendered HTML.
 *
 * It has to be a plain inline `<script>` in `<head>`: that's the only form
 * the browser runs before first paint, which is the whole point — a dark-mode
 * visitor must never see a light frame. (`next/script`'s `beforeInteractive`
 * queues inline scripts behind Next's own bootstrap chunk, so it can't make
 * that guarantee.)
 *
 * React refuses to execute `<script>` elements it creates during a *client*
 * render and logs a warning — which is what happened every time the locale
 * segment remounted on a language switch. By then `ThemeProvider` already
 * owns the `.dark` class, so the script has nothing to do. This component
 * renders it for the server snapshot and hydration pass only; on any client
 * render it renders nothing, so React never creates the element.
 */
export function ThemeScript() {
  const isServer = useSyncExternalStore(
    subscribeNoop,
    () => false,
    () => true,
  );
  if (!isServer) return null;
  return <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />;
}

function subscribeNoop() {
  return () => {};
}
