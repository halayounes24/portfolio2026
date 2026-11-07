import { coverTransitionName, el } from "./dom.js";
import { findProject, projects, projectUrl, type Asset, type Project } from "./projects.js";

function renderAsset(asset: Asset): HTMLElement {
  const figure = el("figure", "asset");
  const img = el("img");
  img.src = asset.src;
  img.alt = asset.alt;
  img.loading = "lazy";
  img.decoding = "async";
  figure.append(img);
  if (asset.caption) figure.append(el("figcaption", undefined, asset.caption));
  return figure;
}

function renderProject(project: Project): DocumentFragment {
  const frag = document.createDocumentFragment();

  // Header
  const header = el("header", "project__header");
  header.append(
    // Same "type / year" label as the project's row on the landing page.
    el("p", "project__meta", `${project.type} / ${project.year}`),
    el("h1", "project__title", project.title),
    el("p", "project__overview", project.overview),
  );

  const facts = el("dl", "project__facts");
  for (const f of [{ label: "Role", value: project.roles.join(" / ") }, ...project.facts]) {
    const row = el("div");
    row.append(el("dt", undefined, f.label), el("dd", undefined, f.value));
    facts.append(row);
  }
  header.append(facts);

  // Cover
  const cover = el("figure", "project__cover");
  const coverImg = el("img");
  coverImg.src = project.cover;
  coverImg.alt = project.coverAlt;
  coverImg.style.viewTransitionName = coverTransitionName(project.slug);
  cover.append(coverImg);

  frag.append(header, cover);

  // Story: text column stays in view while its assets scroll past.
  for (const section of project.sections) {
    const s = el("section", "story");
    const text = el("div", "story__text");
    text.append(el("h2", undefined, section.heading), el("p", undefined, section.body));
    const media = el("div", "story__media");
    media.append(...section.assets.map(renderAsset));
    s.append(text, media);
    frag.append(s);
  }

  if (project.link) {
    const a = el("a", "project__cta", project.link.label);
    a.href = project.link.href;
    a.rel = "noopener";
    frag.append(a);
  }

  // Next project
  const i = projects.indexOf(project);
  const next = projects[(i + 1) % projects.length];
  const nav = el("nav", "project__next");
  nav.setAttribute("aria-label", "Next project");
  const nextLink = el("a");
  nextLink.href = projectUrl(next);
  nextLink.append(el("span", "project__next-label", "Next project"), el("span", "project__next-title", next.title));
  nav.append(nextLink);
  frag.append(nav);

  return frag;
}

function renderNotFound(): DocumentFragment {
  const frag = document.createDocumentFragment();
  const header = el("header", "project__header");
  header.append(
    el("h1", "project__title", "Project not found"),
    el("p", "project__overview", "That project doesn't exist (or has moved)."),
  );
  frag.append(header);
  return frag;
}

const root = document.querySelector<HTMLElement>("#project");
if (root) {
  const project = findProject(new URLSearchParams(location.search).get("p"));
  root.replaceChildren(project ? renderProject(project) : renderNotFound());
  document.title = `${project ? project.title : "Not found"} — Hala Younes`;
}
