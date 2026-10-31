import { mountAccordion } from "./accordion.js";
import { projects } from "./projects.js";

const accordion = document.querySelector<HTMLElement>("#accordion");
if (accordion) mountAccordion(accordion, projects);
