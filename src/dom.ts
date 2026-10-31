/** Tiny helper for building elements with a class and text. */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function tagList(tags: string[], className = "tags"): HTMLUListElement {
  const ul = el("ul", className);
  for (const t of tags) ul.append(el("li", undefined, t));
  return ul;
}

/** Shared name so the cover image morphs between pages (View Transitions). */
export function coverTransitionName(slug: string): string {
  return `cover-${slug}`;
}
