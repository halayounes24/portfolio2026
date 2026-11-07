import { mountHoverPreview } from "./hover-preview.js";
import { mountProjectList } from "./project-list.js";
import { projects } from "./projects.js";

const list = document.querySelector<HTMLElement>("#project-list");
if (list) {
  mountProjectList(list, projects);
  mountHoverPreview(list);
}
