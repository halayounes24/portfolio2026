export interface Project {
  id: string;
  title: string;
  year: string;
  role: string;
  /** One-liner shown in the hover preview. */
  summary: string;
  /** Longer copy shown when the card is fully open. */
  description: string;
  image: string;
  imageAlt: string;
  tags: string[];
  link?: { label: string; href: string };
}

// Placeholder content — swap in real projects later.
export const projects: Project[] = [1, 2, 3, 4, 5, 6].map((n) => ({
  id: `project-${n}`,
  title: `Project ${n}`,
  year: String(2026 - Math.floor((n - 1) / 2)),
  role: "Role / discipline",
  summary: "A one-line summary of the project that appears on hover.",
  description:
    "A longer description of the project: the problem, what you did, and the outcome. " +
    "This only appears once the card is fully opened, so it can run a few sentences.",
  image: `images/project-${n}.svg`,
  imageAlt: `Placeholder image for project ${n}`,
  tags: ["Tag one", "Tag two", "Tag three"],
  link: { label: "View project", href: "#" },
}));
