import { mountAccordion } from "./accordion.js";
import { projects } from "./projects.js";

const accordion = document.querySelector<HTMLElement>("#accordion");
if (accordion) mountAccordion(accordion, projects);

const year = document.querySelector<HTMLElement>("#year");
if (year) year.textContent = String(new Date().getFullYear());
