/**
 * Smoke tests for `ProjectCard`. Verifies the rendered surface — title,
 * description, status badge, tech pills, and the right number of external
 * links — without trying to assert on framer-motion timings (those are
 * mocked away in `jest.setup.ts`).
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

  it("shows the first 5 technologies plus a +N overflow chip", () => {
    render(<ProjectCard project={project} locale="en" />);
    // 6 technologies in the fixture → first 5 visible + "+1" chip
    expect(screen.getByText("Flutter")).toBeInTheDocument();
    expect(screen.getByText("Dart")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
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
    // useTranslations is mocked to echo the key → status badge is "status.published".
    expect(screen.getByText("status.published")).toBeInTheDocument();
  });

  it("hides the +N chip when 5 or fewer techs", () => {
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

  it("falls back to a placeholder when project.image is empty", () => {
    const noImage = { ...project, image: "" };
    const { container } = render(
      <ProjectCard project={noImage} locale="en" />,
    );
    // The fallback initial — first character of the title — is always rendered.
    expect(within(container).getByText("A")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });
});
