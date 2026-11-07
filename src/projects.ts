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
  /** Who the project was for. */
  client: string;
  /** Kind of project, e.g. Campaign, Brand identity, Film. */
  type: string;
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
// Projects — in the order they appear on the landing page.
// Asset paths are relative to the site root, e.g. assets/projects/<slug>/cover.webp
// ---------------------------------------------------------------------------

const lorem =
  "Placeholder copy. Replace this with a few sentences in your own words. " +
  "Keep it concrete: what the situation was, what you did, and why it mattered.";

const project1: Project = {
  slug: "project-1",
  title: "Project 1", // TODO: real name
  client: "Client name", // TODO
  type: "Product design", // TODO
  year: "2026", // TODO
  cover: "assets/projects/project-1/cover.webp",
  coverAlt: "Walnut nesting tables with white tile inlays in a sunlit room",
  overview: "A one or two sentence overview of the project: what it is and who it was for.",
  facts: [
    { label: "Role", value: "Your role" },
    { label: "Team", value: "Who you worked with" },
    { label: "Materials", value: "Walnut, …" },
    { label: "Duration", value: "3 months" },
  ],
  sections: [
    {
      heading: "The challenge",
      body: lorem,
      assets: [
        {
          src: "assets/projects/project-1/01.webp",
          alt: "Top-down view of the tables set with food, hands holding a bowl of lemons and mint",
        },
      ],
    },
    {
      heading: "What I did",
      body: lorem,
      assets: [
        {
          src: "assets/projects/project-1/02.gif",
          alt: "Animated close-ups of the patterned walnut tabletops",
        },
      ],
    },
    {
      heading: "The outcome",
      body: lorem,
      assets: [
        {
          src: "assets/projects/project-1/03.gif",
          alt: "Animated views of the finished tables styled with food in a bright room",
        },
      ],
    },
  ],
};

// Temporary filler for projects that don't have real content yet.
const placeholderWide: Asset = { src: "assets/placeholders/asset-wide.svg", alt: "Placeholder asset (wide)", caption: "Caption for this asset." };
const placeholderTall: Asset = { src: "assets/placeholders/asset-tall.svg", alt: "Placeholder asset (tall)", caption: "Caption for this asset." };
const placeholderSquare: Asset = { src: "assets/placeholders/asset-square.svg", alt: "Placeholder asset (square)" };

function placeholderProject(n: number, type: string, year: string): Project {
  return {
    slug: `project-${n}`,
    title: `Project ${n}`,
    client: "Client name",
    type,
    year,
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
      { heading: "The challenge", body: lorem, assets: [placeholderWide] },
      { heading: "What I did", body: lorem, assets: [placeholderTall, placeholderSquare] },
      { heading: "The outcome", body: lorem, assets: [placeholderWide] },
    ],
    link: { label: "Visit live project", href: "#" },
  };
}

export const projects: Project[] = [
  project1,
  placeholderProject(2, "Brand identity", "2026"),
  placeholderProject(3, "Campaign", "2025"),
  placeholderProject(4, "Film", "2025"),
  placeholderProject(5, "Website", "2024"),
  placeholderProject(6, "Art direction", "2024"),
];

export function findProject(slug: string | null): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectUrl(project: Project): string {
  return `project.html?p=${encodeURIComponent(project.slug)}`;
}
