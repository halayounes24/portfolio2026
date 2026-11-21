import { el } from "./dom.js";
import { projectUrl, type Project } from "./projects.js";

/**
 * Landing-page project list. Each row links to the project page:
 *   left   — "type / year" (small), the project name (large), and a one-line
 *            description that opens on hover (always shown on touch screens)
 *   right  — your roles, e.g. "Art Direction / Styling" (small)
 */
function renderRow(project: Project): HTMLLIElement {
  const item = el("li", "project-row");

  const link = el("a", "project-row__link");
  link.href = projectUrl(project);
  if (project.hoverImage) link.dataset.hoverImage = project.hoverImage;

  const meta = el("p", "project-row__meta", [project.type, project.year].filter(Boolean).join(" / "));

  // Name + one-liner share the "title" area so the closed one-liner takes no space.
  const name = el("div", "project-row__name");
  const tagline = el("div", "project-row__tagline");
  tagline.append(el("p", undefined, project.tagline));
  name.append(el("h3", "project-row__title", project.title), tagline);

  link.append(meta, name, el("p", "project-row__roles", project.roles.join(" / ")));
  item.append(link);
  return item;
}

export function mountProjectList(root: HTMLElement, projects: Project[]): void {
  root.replaceChildren(...projects.map(renderRow));
}
