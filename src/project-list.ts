import { el } from "./dom.js";
import { projectUrl, type Project } from "./projects.js";

/**
 * Landing-page project list. Each row links to the project page:
 *   left   — year (small), with the project name (large) underneath
 *   right  — project type (small)
 */
function renderRow(project: Project): HTMLLIElement {
  const item = el("li", "project-row");

  const link = el("a", "project-row__link");
  link.href = projectUrl(project);

  const meta = el("p", "project-row__meta", project.year);

  link.append(
    meta,
    el("h3", "project-row__title", project.title),
    el("p", "project-row__type", project.type),
  );
  item.append(link);
  return item;
}

export function mountProjectList(root: HTMLElement, projects: Project[]): void {
  root.replaceChildren(...projects.map(renderRow));
}
