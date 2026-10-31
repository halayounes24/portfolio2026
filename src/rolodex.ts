import type { Project } from "./projects.js";

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderCard(project: Project, index: number): HTMLLIElement {
  const item = el("li", "card");
  item.id = project.id;
  item.style.setProperty("--i", String(index));

  const bodyId = `${project.id}-body`;

  // The tab is the always-visible strip and the toggle button.
  const tab = el("button", "card__tab");
  tab.type = "button";
  tab.setAttribute("aria-expanded", "false");
  tab.setAttribute("aria-controls", bodyId);
  tab.append(
    el("span", "card__index", String(index + 1).padStart(2, "0")),
    el("span", "card__title", project.title),
    el("span", "card__meta", `${project.role} · ${project.year}`),
  );

  const body = el("div", "card__body");
  body.id = bodyId;

  const figure = el("figure", "card__media");
  const img = el("img");
  img.src = project.image;
  img.alt = project.imageAlt;
  img.loading = "lazy";
  img.decoding = "async";
  figure.append(img);

  const summary = el("p", "card__summary", project.summary);

  const details = el("div", "card__details");
  details.append(el("p", "card__description", project.description));

  const tags = el("ul", "card__tags");
  for (const tag of project.tags) tags.append(el("li", undefined, tag));
  details.append(tags);

  if (project.link) {
    const a = el("a", "card__link", project.link.label);
    a.href = project.link.href;
    details.append(a);
  }

  body.append(summary, figure, details);
  item.append(tab, body);
  return item;
}

export function mountRolodex(root: HTMLElement, projects: Project[]): void {
  root.replaceChildren(...projects.map(renderCard));

  const setOpen = (card: HTMLElement, open: boolean) => {
    card.classList.toggle("is-open", open);
    card.querySelector(".card__tab")?.setAttribute("aria-expanded", String(open));
  };

  const closeAll = (except?: HTMLElement) => {
    root.querySelectorAll<HTMLElement>(".card.is-open").forEach((c) => {
      if (c !== except) setOpen(c, false);
    });
  };

  root.addEventListener("click", (event) => {
    const tab = (event.target as Element).closest<HTMLButtonElement>(".card__tab");
    if (!tab) return;
    const card = tab.closest<HTMLElement>(".card");
    if (!card) return;

    const opening = !card.classList.contains("is-open");
    closeAll(card);
    setOpen(card, opening);

    if (opening) {
      // Wait for the expansion to start so the scroll lands on the final position.
      requestAnimationFrame(() =>
        card.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const open = root.querySelector<HTMLElement>(".card.is-open");
    if (!open) return;
    setOpen(open, false);
    open.querySelector<HTMLButtonElement>(".card__tab")?.focus();
  });
}
