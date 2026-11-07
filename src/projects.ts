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
  /** Kind of project, e.g. Campaign, Brand identity, Film. */
  type: string;
  /** Leave empty ("") if unknown — the row then shows only the type, and the page omits Year. */
  year: string;
  /** What you did on the project, e.g. ["Art Direction", "Styling"]. */
  roles: string[];
  cover: string;
  coverAlt: string;
  /** Small image that follows the cursor when hovering the project's row (optional). */
  hoverImage?: string;
  /** Short intro shown under the title on the project page. */
  /** "Project info" text shown on the project page. */
  overview: string;
  sections: Section[];
  /** Credits listed at the end of the project page (optional). */
  credits?: { role: string; name: string }[];
}

// ---------------------------------------------------------------------------
// Projects — in the order they appear on the landing page.
// Asset paths are relative to the site root, e.g. assets/projects/<slug>/cover.webp
// ---------------------------------------------------------------------------

const lorem =
  "Placeholder copy. Replace this with a few sentences in your own words. " +
  "Keep it concrete: what the situation was, what you did, and why it mattered.";

// Temporary filler for projects that don't have real content yet.
const placeholderWide: Asset = { src: "assets/placeholders/asset-wide.svg", alt: "Placeholder asset (wide)", caption: "Caption for this asset." };
const placeholderTall: Asset = { src: "assets/placeholders/asset-tall.svg", alt: "Placeholder asset (tall)", caption: "Caption for this asset." };
const placeholderSquare: Asset = { src: "assets/placeholders/asset-square.svg", alt: "Placeholder asset (square)" };

function placeholderProject(n: number, type: string, year: string): Project {
  return {
    slug: `project-${n}`,
    title: `Project ${n}`,
    type,
    year,
    roles: ["Role", "Role"],
    cover: `assets/placeholders/project-${n}.svg`,
    coverAlt: `Cover image for project ${n}`,
    overview: "A one or two sentence overview of the project: what it is and who it was for.",
    sections: [
      { heading: "The challenge", body: lorem, assets: [placeholderWide] },
      { heading: "What I did", body: lorem, assets: [placeholderTall, placeholderSquare] },
      { heading: "The outcome", body: lorem, assets: [placeholderWide] },
    ],
  };
}

// L'Occitane En Provence — real cover; story images are placeholders until uploaded
// to assets/projects/loccitane/.
const loccitane: Project = {
  ...placeholderProject(1, "Campaign", "2023"),
  slug: "loccitane",
  title: "L'Occitane En Provence",
  roles: ["Art Direction", "Styling"],
  cover: "assets/projects/loccitane/cover.webp",
  coverAlt:
    "L'Occitane gift box illustrated with a moonlit village, surrounded by arch-shaped packaging, lanterns and L'Occitane products",
  hoverImage: "assets/projects/loccitane/cover-thumb.webp",
  // Placeholder credits — replace with the real names.
  credits: [
    { role: "Client", name: "L'Occitane En Provence" },
    { role: "Art Direction", name: "Hala Younes" },
    { role: "Styling", name: "Hala Younes" },
    { role: "Photography", name: "Photographer Name" },
    { role: "Set Design", name: "Set Designer Name" },
    { role: "Production", name: "Studio Name" },
  ],
};

// Lavina Tea — real details; images are placeholders until uploaded
// to assets/projects/lavina-tea/.
const lavinaTea: Project = {
  ...placeholderProject(2, "Product", "2025"),
  slug: "lavina-tea",
  title: "Lavina Tea",
  roles: ["Packaging Design"],
  hoverImage: "assets/projects/lavina-tea/cover-thumb.webp",
  coverAlt: "Cover image for Lavina Tea",
};

// DXB | Dubai Airport — real details; images are placeholders until uploaded
// to assets/projects/dxb/.
const dxb: Project = {
  ...placeholderProject(3, "Campaign", "2026"),
  slug: "dxb",
  title: "DXB | Dubai Airport",
  roles: ["Art Direction", "Graphic Design"],
  coverAlt: "Cover image for DXB | Dubai Airport",
};

// Tabliyè — real details; images are placeholders until uploaded
// to assets/projects/tabliye/.
const tabliye: Project = {
  ...placeholderProject(5, "Product", "2017"),
  slug: "tabliye",
  title: "Tabliyè",
  roles: ["Industrial Design", "Furniture Design"],
  coverAlt: "Cover image for Tabliyè",
};

// GITEX — real details; images are placeholders until uploaded
// to assets/projects/gitex/.
const gitex: Project = {
  ...placeholderProject(6, "Event", "2024"),
  slug: "gitex",
  title: "GITEX",
  roles: ["Art Direction", "Graphic Design"],
  coverAlt: "Cover image for GITEX",
};

// City Briefings — uses the images in assets/projects/city-briefings/.
const cityBriefings: Project = {
  ...placeholderProject(4, "Event", "2025-2026"),
  slug: "city-briefings",
  title: "City Briefings",
  roles: ["Art Direction", "Graphic Design"],
  cover: "assets/projects/city-briefings/cover.webp",
  coverAlt: "Walnut nesting tables with white tile inlays in a sunlit room",
  sections: [
    {
      heading: "The challenge",
      body: lorem,
      assets: [
        {
          src: "assets/projects/city-briefings/01.webp",
          alt: "Top-down view of the tables set with food, hands holding a bowl of lemons and mint",
        },
      ],
    },
    {
      heading: "What I did",
      body: lorem,
      assets: [
        {
          src: "assets/projects/city-briefings/02.gif",
          alt: "Animated close-ups of the patterned walnut tabletops",
        },
      ],
    },
    {
      heading: "The outcome",
      body: lorem,
      assets: [
        {
          src: "assets/projects/city-briefings/03.gif",
          alt: "Animated views of the finished tables styled with food in a bright room",
        },
      ],
    },
  ],
};

// Ajman University Executive Education — real details; images to come
// (images go in assets/projects/ajman-university/).
const ajman: Project = {
  ...placeholderProject(7, "Branding", "2027"),
  slug: "ajman-university",
  title: "Ajman University Executive Education",
  roles: ["Art Direction", "Graphic Design"],
  coverAlt: "Cover image for Ajman University Executive Education",
};

// Fluidity — real details; images to come (assets/projects/fluidity/).
const fluidity: Project = {
  ...placeholderProject(8, "Exhibition", "2019"),
  slug: "fluidity",
  title: "Fluidity",
  roles: ["Art Direction", "Styling"],
  coverAlt: "Cover image for Fluidity",
};

export const projects: Project[] = [
  loccitane,
  lavinaTea,
  dxb,
  cityBriefings,
  tabliye,
  gitex,
  ajman,
  fluidity,
];

export function findProject(slug: string | null): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectUrl(project: Project): string {
  return `project.html?p=${encodeURIComponent(project.slug)}`;
}
