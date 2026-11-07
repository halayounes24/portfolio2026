import { el } from "./dom.js";
import { projectUrl, type Project } from "./projects.js";

/**
 * Landing-page project list. Each row links to the project page:
 *   left   — "type / year" (small), with the project name (large) underneath
 *   right  — your roles, e.g. "Art Direction / Styling" (small)
 */
function renderRow(project: Project): HTMLLIElement {
  const item = el("li", "project-row");

  const link = el("a", "project-row__link");
  link.href = projectUrl(project);
  if (project.hoverImage) link.dataset.hoverImage = project.hoverImage;

  const meta = el("p", "project-row__meta", `${project.type} / ${project.year}`);

  link.append(
    meta,
    el("h3", "project-row__title", project.title),
    el("p", "project-row__roles", project.roles.join(" / ")),
  );
  item.append(link);
  return item;
}

export function mountProjectList(root: HTMLElement, projects: Project[]): void {
  root.replaceChildren(...projects.map(renderRow));
}
