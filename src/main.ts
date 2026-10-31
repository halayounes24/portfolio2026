import { projects } from "./projects.js";
import { mountRolodex } from "./rolodex.js";

const rolodex = document.querySelector<HTMLElement>("#rolodex");
if (rolodex) mountRolodex(rolodex, projects);

const year = document.querySelector<HTMLElement>("#year");
if (year) year.textContent = String(new Date().getFullYear());
