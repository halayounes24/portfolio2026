import { coverTransitionName, el, tagList } from "./dom.js";
import { projects, projectUrl, type Project } from "./projects.js";

function renderTile(project: Project): HTMLLIElement {
  const item = el("li", "tile");
  const link = el("a", "tile__link");
  link.href = projectUrl(project);

  const media = el("div", "tile__media");
  const img = el("img");
  img.src = project.cover;
  img.alt = "";
  img.loading = "lazy";
  img.decoding = "async";
  img.style.viewTransitionName = coverTransitionName(project.slug);
  media.append(img);

  link.append(media, el("h2", "tile__title", project.title), tagList([project.discipline, project.year]));
  item.append(link);
  return item;
}

const grid = document.querySelector<HTMLElement>("#project-grid");
if (grid) grid.replaceChildren(...projects.map(renderTile));
