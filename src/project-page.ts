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

  // Header — left half: project name. Right half (lined up under the
  // header tabs): Project info, then Year and Role.
  const header = el("header", "project__header");

  const info = el("div", "project__info");
  const about = el("div", "project__about");
  about.append(el("h2", "project__label", "Project info"), el("p", "project__text", project.overview));

  const details = el("dl", "project__details");
  for (const [label, value] of [
    ["Year", project.year],
    ["Role", project.roles.join(" / ")],
  ]) {
    const item = el("div");
    item.append(el("dt", "project__label", label), el("dd", "project__text", value));
    details.append(item);
  }
  info.append(about, details);

  header.append(el("h1", "project__title", project.title), info);

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
  const info = el("div", "project__info");
  info.append(el("p", "project__text", "That project doesn't exist (or has moved)."));
  header.append(el("h1", "project__title", "Project not found"), info);
  frag.append(header);
  return frag;
}

const root = document.querySelector<HTMLElement>("#project");
if (root) {
  const project = findProject(new URLSearchParams(location.search).get("p"));
  root.replaceChildren(project ? renderProject(project) : renderNotFound());
  document.title = `${project ? project.title : "Not found"} — Hala Younes`;
}
