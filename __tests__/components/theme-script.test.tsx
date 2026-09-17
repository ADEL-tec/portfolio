/**
 * `ThemeScript` must never create a `<script>` during a client render —
 * that is the exact case React warns about ("Encountered a script tag while
 * rendering React component"). jsdom's `render` is a client render, not a
 * hydration, so this covers the locale-switch remount path.
 */

import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

import { ThemeScript } from "@/components/theme-script";

describe("ThemeScript", () => {
  it("renders nothing on the client and logs no React warning", () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => {});
    const { container } = render(<ThemeScript />);
    expect(container.querySelector("script")).toBeNull();
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it("emits the inline no-flash script in server-rendered HTML", () => {
    const html = renderToStaticMarkup(<ThemeScript />);
    expect(html).toMatch(/^<script>/);
    expect(html).toContain("portfolio-theme");
  });
});
