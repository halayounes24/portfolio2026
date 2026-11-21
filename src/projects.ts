export interface Asset {
  /** Image (.webp/.jpg/.png/.gif) or video (.mp4 — plays silently on a loop). */
  src: string;
  alt: string;
  caption?: string;
  /** For videos: a still image shown while the video loads. */
  poster?: string;
}

/** A block of text (left half) with an image or video beside it (right half). */
export interface Section {
  heading?: string;
  /** Separate paragraphs with a blank line. */
  body: string;
  asset?: Asset;
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
  /** Hero image at the top of the project page (shown at its natural shape). */
  cover: string;
  coverAlt: string;
  /** Small copy of the cover (cover-thumb.webp) that follows the cursor over the project's row (optional). */
  hoverImage?: string;
  /** "Project info" text on the project page. Separate paragraphs with a blank line. */
  description: string;
  /** One-line description shown under the name on the landing page (on hover; always on touch screens). */
  tagline: string;
  /** Text + image sections shown below the hero, in order (optional). */
  sections?: Section[];
  /** Extra images shown below the sections, full width, in order (optional). */
  gallery?: Asset[];
  /** Credits listed at the end of the project page (optional). */
  credits?: { role: string; name: string }[];
}

// ---------------------------------------------------------------------------
// Projects — in the order they appear on the landing page.
// Asset paths are relative to the site root, e.g. assets/projects/<slug>/cover.webp
// ---------------------------------------------------------------------------

// Starting values for each project; real details override them below.
function placeholderProject(n: number, type: string, year: string): Project {
  return {
    slug: `project-${n}`,
    title: `Project ${n}`,
    type,
    year,
    roles: ["Role", "Role"],
    cover: `assets/placeholders/project-${n}.svg`,
    coverAlt: `Cover image for project ${n}`,
    description: "A short description of the project: what it is, who it was for, and what you did.",
    tagline: "A one-line description of the project.",
  };
}

// L'Occitane En Provence — real hero image; further images to come
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
  ...placeholderProject(2, "Product", "2023-2025"),
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

// Tabliyè — hero and gallery images in assets/projects/tabliye/.
const tabliye: Project = {
  ...placeholderProject(5, "Product", "2017"),
  slug: "tabliye",
  title: "Tabliyè",
  tagline: "A new take on Arabic traditional furniture.",
  roles: ["Industrial Design", "Furniture Design"],
  description: [
    "Tabliyè is a re-invention of the old traditional Middle Eastern Tabliyeh, a simple, low, round wooden table. It is both a coffee table and a dining table. This work explores the preservation of the cultural values of this tool and keeping social habits alive, while improving the functionality to match the current setup and timeframe. The product experience is designed to be as simple and hassle-free as possible.",
    "The concept of Tabliyè was born in Italy. The influence and origin are Arab; the setup is Western. Arabic culture, food and art are all a whirl of an emotional and rich experience, especially when they inspire everyday useful objects.",
  ].join("\n\n"),
  cover: "assets/projects/tabliye/cover.webp",
  coverAlt: "Walnut nesting tables with white tile inlays in a sunlit room",
  sections: [
    {
      heading: "What is it, and why renovate?",
      body: [
        "The Tabliyeh comes from a time of traditional floor seating with no chairs. Back then, houses were very small and space was limited. At mealtime, the Tabliyeh would be placed in the living area for sharing a meal and lounging around it. It would then be removed so the space could be used for other activities.",
        "Most Middle Eastern families think of sharing a meal together as having a purely sentimental value with social aspects. A lot of them still prefer to share a meal in the living area, even though that space has nowadays changed into a modern setup.",
        "Preserving the cultural values of this tool and keeping social habits alive, while improving the functionality to match the current setup and time, is crucial. The challenge was to do this without turning the Tabliyeh into a nostalgic piece, and without losing it to generic modern furniture.",
      ].join("\n\n"),
      asset: {
        src: "assets/projects/tabliye/old.mp4",
        poster: "assets/projects/tabliye/old-poster.webp",
        alt: "Black-and-white footage of a family sharing a meal around a traditional round Tabliyeh",
      },
    },
  ],
  hoverImage: "assets/projects/tabliye/cover-thumb.webp", // small copy of the cover
  gallery: [
    {
      src: "assets/projects/tabliye/01.webp",
      alt: "Top-down view of the tables set with food, hands holding a bowl of lemons and mint",
    },
    { src: "assets/projects/tabliye/02.gif", alt: "Animated close-ups of the patterned walnut tabletops" },
    {
      src: "assets/projects/tabliye/03.gif",
      alt: "Animated views of the finished tables styled with food in a bright room",
    },
  ],
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

// City Briefings — real details; images are placeholders until uploaded
// to assets/projects/city-briefings/.
const cityBriefings: Project = {
  ...placeholderProject(4, "Event", "2025-2026"),
  slug: "city-briefings",
  title: "City Briefings",
  roles: ["Art Direction", "Graphic Design"],
  coverAlt: "Cover image for City Briefings",
};


// Ajman University Executive Education — real details; images to come
// (images go in assets/projects/ajman-university/).
const ajman: Project = {
  ...placeholderProject(7, "Branding", "2026"),
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

// Office of Development Affairs — real details; images to come
// (assets/projects/development-affairs/).
const developmentAffairs: Project = {
  ...placeholderProject(9, "Branding", "2023-2025"),
  slug: "development-affairs",
  title: "Office of Development Affairs",
  roles: ["Art Direction", "Graphic Design", "Training"],
  coverAlt: "Cover image for Office of Development Affairs",
};

// The Enzo Mari Chair — real details; images to come
// (assets/projects/enzo-mari-chair/).
const enzoMariChair: Project = {
  ...placeholderProject(10, "Product", "2023"),
  slug: "enzo-mari-chair",
  title: "The Enzo Mari Chair",
  roles: ["Industrial Design", "Furniture Design"],
  coverAlt: "Cover image for The Enzo Mari Chair",
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
  developmentAffairs,
  enzoMariChair,
];

export function findProject(slug: string | null): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectUrl(project: Project): string {
  return `project.html?p=${encodeURIComponent(project.slug)}`;
}
