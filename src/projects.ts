export interface Asset {
  src: string;
  alt: string;
  caption?: string;
}

export interface Section {
  heading: string;
  body: string;
  /** Assets shown alongside this section's text. */
  assets: Asset[];
}

export interface Project {
  /** Used in the URL: project.html?p=<slug> */
  slug: string;
  title: string;
  discipline: string;
  year: string;
  cover: string;
  coverAlt: string;
  /** Short intro shown under the title on the project page. */
  overview: string;
  /** Key facts, e.g. role, team, tools, duration. */
  facts: { label: string; value: string }[];
  sections: Section[];
  link?: { label: string; href: string };
}

// ---------------------------------------------------------------------------
// Placeholder content — replace with real projects.
// ---------------------------------------------------------------------------

const lorem =
  "Placeholder copy. Replace this with a few sentences in your own words. " +
  "Keep it concrete: what the situation was, what you did, and why it mattered.";

const wide: Asset = { src: "assets/placeholders/asset-wide.svg", alt: "Placeholder asset (wide)", caption: "Caption for this asset." };
const tall: Asset = { src: "assets/placeholders/asset-tall.svg", alt: "Placeholder asset (tall)", caption: "Caption for this asset." };
const square: Asset = { src: "assets/placeholders/asset-square.svg", alt: "Placeholder asset (square)" };

const disciplines = ["Product design", "Brand identity", "Web development", "UX research", "Motion", "Creative direction"];

export const projects: Project[] = disciplines.map((discipline, i) => {
  const n = i + 1;
  return {
    slug: `project-${n}`,
    title: `Project ${n}`,
    discipline,
    year: String(2026 - Math.floor(i / 2)),
    cover: `assets/placeholders/project-${n}.svg`,
    coverAlt: `Cover image for project ${n}`,
    overview: "A one or two sentence overview of the project: what it is and who it was for.",
    facts: [
      { label: "Role", value: "Your role" },
      { label: "Team", value: "Who you worked with" },
      { label: "Tools", value: "Figma, TypeScript, …" },
      { label: "Duration", value: "3 months" },
    ],
    sections: [
      { heading: "The challenge", body: lorem, assets: [wide] },
      { heading: "What I did", body: lorem, assets: [tall, square] },
      { heading: "The outcome", body: lorem, assets: [wide] },
    ],
    link: { label: "Visit live project", href: "#" },
  };
});

export function findProject(slug: string | null): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectUrl(project: Project): string {
  return `project.html?p=${encodeURIComponent(project.slug)}`;
}
