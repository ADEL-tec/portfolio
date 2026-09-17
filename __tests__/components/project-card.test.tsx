/**
 * Smoke tests for `ProjectCard`. Verifies the rendered surface — category
 * line, title, description, status badge, tech pills, artwork fallbacks,
 * and the right number of external links — without asserting on
 * framer-motion timings (those are mocked away in `jest.setup.ts`).
 *
 * Note: `next-intl`'s `useTranslations` is mocked to echo the key path, so
 * the rendered status label is `"status.published"` not `"Published"`. We
 * assert on the key path rather than the human-facing string.
 */

import { render, screen, within } from "@testing-library/react";

import { ProjectCard } from "@/components/sections/project-card";
import type { Project } from "@/lib/data";

const project: Project = {
  id: "awashz",
  category: "mobile",
  platforms: ["android", "ios"],
  status: "published",
  order: 1,
  featured: true,
  title: {
    en: "AwashZ — On-Demand Car Wash",
    fr: "AwashZ",
    ar: "أوشز",
  },
  subtitle: { en: "S", fr: "S", ar: "S" },
  description: {
    en: "A Flutter app that books car wash on demand.",
    fr: "...",
    ar: "...",
  },
  fullDescription: { en: "F", fr: "F", ar: "F" },
  features: { en: [], fr: [], ar: [] },
  highlights: {
    en: ["Production Ready", "Real-time"],
    fr: [],
    ar: [],
  },
  monogram: "AW",
  metric: {
    en: "Published on Google Play",
    fr: "Publié sur Google Play",
    ar: "منشور على Google Play",
  },
  technologies: ["Flutter", "Dart", "Firebase", "FCM", "Maps", "REST"],
  role: { en: "Lead", fr: "Lead", ar: "قائد" },
  duration: { en: "3 months", fr: "3 mois", ar: "3 أشهر" },
  image: "/images/projects/awashz.jpg",
  images: [],
  links: {
    playStore: "https://play.google.com/store/example",
    appStore: "https://apps.apple.com/example",
    github: "https://github.com/example",
  },
};

describe("ProjectCard", () => {
  it("renders the project title and description", () => {
    render(<ProjectCard project={project} locale="en" />);
    expect(
      screen.getByText("AwashZ — On-Demand Car Wash"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Flutter app that books car wash/i),
    ).toBeInTheDocument();
  });

  it("labels the card with its category", () => {
    render(<ProjectCard project={project} locale="en" />);
    expect(screen.getByText("categories.mobile")).toBeInTheDocument();
  });

  it("shows the first 4 technologies plus a +N overflow chip", () => {
    render(<ProjectCard project={project} locale="en" />);
    // 6 technologies in the fixture → first 4 visible + "+2" chip
    expect(screen.getByText("Flutter")).toBeInTheDocument();
    expect(screen.getByText("Dart")).toBeInTheDocument();
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("renders one external link per non-empty link", () => {
    render(<ProjectCard project={project} locale="en" />);
    const externalLinks = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href")?.startsWith("https://"));
    expect(externalLinks).toHaveLength(3);
    expect(
      externalLinks.every((a) => a.getAttribute("target") === "_blank"),
    ).toBe(true);
  });

  it("renders live and case-study links when present", () => {
    const withMore = {
      ...project,
      links: { live: "https://example.com", caseStudy: "https://example.com/case" },
    };
    render(<ProjectCard project={withMore} locale="en" />);
    expect(screen.getByLabelText("viewLive")).toBeInTheDocument();
    expect(screen.getByLabelText("caseStudy")).toBeInTheDocument();
  });

  it("links the title and image to the project detail page", () => {
    render(<ProjectCard project={project} locale="en" />);
    const internal = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href")?.startsWith("/projects/"));
    expect(internal.length).toBeGreaterThanOrEqual(2);
    for (const a of internal) {
      expect(a.getAttribute("href")).toBe("/projects/awashz");
    }
  });

  it("renders the status badge using the translator key path", () => {
    render(<ProjectCard project={project} locale="en" />);
    expect(screen.getByText("status.published")).toBeInTheDocument();
  });

  it("hides the +N chip when 4 or fewer techs", () => {
    const small = {
      ...project,
      technologies: ["Flutter", "Dart", "Firebase"],
    };
    render(<ProjectCard project={small} locale="en" />);
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it("renders highlights as outline badges (first 2)", () => {
    render(<ProjectCard project={project} locale="en" />);
    expect(screen.getByText("Production Ready")).toBeInTheDocument();
    expect(screen.getByText("Real-time")).toBeInTheDocument();
  });

  describe("artwork", () => {
    it("uses the hero image when there are no screenshots", () => {
      const { container } = render(<ProjectCard project={project} locale="en" />);
      const imgs = container.querySelectorAll("img");
      expect(imgs).toHaveLength(1);
      expect(imgs[0]?.getAttribute("src")).toBe("/images/projects/awashz.jpg");
    });

    it("prefers a phone screenshot for a mobile project", () => {
      const withShots = { ...project, images: ["/images/projects/awashz-1.png"] };
      const { container } = render(<ProjectCard project={withShots} locale="en" />);
      const imgs = container.querySelectorAll("img");
      expect(imgs).toHaveLength(1);
      expect(imgs[0]?.getAttribute("src")).toBe("/images/projects/awashz-1.png");
    });

    it("falls back to the monogram with no image at all", () => {
      const bare = { ...project, image: "", images: [] };
      const { container } = render(<ProjectCard project={bare} locale="en" />);
      expect(container.querySelector("img")).toBeNull();
      // Monogram appears once in the artwork tile and once beside the title.
      expect(within(container).getAllByText("AW").length).toBeGreaterThanOrEqual(2);
    });

    it("renders a terminal tile for a backend project without artwork", () => {
      const api = {
        ...project,
        category: "backend" as const,
        platforms: [],
        image: "",
        links: {},
      };
      const { container } = render(<ProjectCard project={api} locale="en" />);
      expect(container.querySelector("img")).toBeNull();
      expect(container.querySelector("pre")).not.toBeNull();
      expect(screen.getByText("categories.backend")).toBeInTheDocument();
    });
  });
});
