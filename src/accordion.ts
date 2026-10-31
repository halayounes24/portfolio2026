import { coverTransitionName, el, tagList } from "./dom.js";
import { projectUrl, type Project } from "./projects.js";

function renderPanel(project: Project, index: number): HTMLLIElement {
  const item = el("li", "panel");

  const link = el("a", "panel__link");
  link.href = projectUrl(project);
  link.setAttribute("aria-label", `${project.title} — ${project.discipline}, ${project.year}`);

  const img = el("img", "panel__img");
  img.src = project.cover;
  img.alt = "";
  img.decoding = "async";
  img.style.viewTransitionName = coverTransitionName(project.slug);

  const number = el("span", "panel__index", String(index + 1).padStart(2, "0"));

  // Shown while collapsed: title running up the column.
  const spine = el("span", "panel__spine", project.title);
  spine.setAttribute("aria-hidden", "true");

  // Shown while expanded.
  const info = el("div", "panel__info");
  info.append(el("h3", "panel__title", project.title), tagList([project.discipline, project.year]));

  link.append(img, number, spine, info);
  item.append(link);
  return item;
}

export function mountAccordion(root: HTMLElement, projects: Project[]): void {
  root.replaceChildren(...projects.map(renderPanel));
}
