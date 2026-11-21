/**
 * Hover preview: while the mouse is inside a project row that has a
 * `data-hover-image` (the project's cover), a small photo follows the
 * cursor. It disappears as soon as the mouse leaves that row.
 *
 * Motion is deliberately calm: the photo glides after the cursor with a
 * smooth ease-out and settles exactly on it — no bending, tilting,
 * overshoot or wobble. The frame keeps a fixed height and takes each
 * photo's own shape. It may overhang the row's top/bottom edges by up to a
 * quarter of its height. Only on devices with a real mouse.
 */
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

const FOLLOW = 12; // how quickly the photo catches up (higher = snappier); no overshoot
const MAX_OVERHANG = 0.25; // fraction of the photo's height allowed outside the row

export function mountHoverPreview(list: HTMLElement): void {
  if (!finePointer.matches) return;

  const frameEl = document.createElement("div");
  frameEl.className = "hover-preview";
  frameEl.setAttribute("aria-hidden", "true");
  const img = document.createElement("img");
  img.alt = "";
  img.decoding = "async";
  frameEl.append(img);
  document.body.append(frameEl);

  // Load each preview once; reuse the decoded image afterwards.
  const images = new Map<string, HTMLImageElement>();
  const load = (src: string) => {
    let im = images.get(src);
    if (!im) {
      im = new Image();
      im.decoding = "async";
      im.src = src;
      images.set(src, im);
    }
    return im;
  };
  for (const a of list.querySelectorAll<HTMLElement>("[data-hover-image]")) load(a.dataset.hoverImage!);

  let row: HTMLElement | null = null;
  let currentSrc = "";
  const mouse = { x: 0, y: 0 };
  const pos = { x: 0, y: 0 };
  let last = 0;
  let raf = 0;

  const showImage = (src: string) => {
    if (src === currentSrc) return;
    currentSrc = src;
    const im = load(src);
    const apply = () => {
      if (src !== currentSrc) return;
      // The frame takes the photo's own shape (same height, width follows).
      frameEl.style.aspectRatio = `${im.naturalWidth} / ${im.naturalHeight}`;
      img.src = src;
      kick();
    };
    if (im.complete && im.naturalWidth) apply();
    else im.addEventListener("load", apply, { once: true });
  };

  /** Where the photo should be: on the cursor, vertically kept near the row. */
  const target = () => {
    if (!row) return { ...mouse };
    const r = row.getBoundingClientRect();
    const h = frameEl.offsetHeight;
    const overhang = h * MAX_OVERHANG;
    const minY = r.top + h / 2 - overhang;
    const maxY = r.bottom - h / 2 + overhang;
    return { x: mouse.x, y: Math.min(Math.max(minY, maxY), Math.max(Math.min(minY, maxY), mouse.y)) };
  };

  const step = (now: number) => {
    const dt = Math.min((now - (last || now)) / 1000, 1 / 30) || 1 / 60;
    last = now;
    const t = target();

    // Frame-rate independent ease-out towards the target (never overshoots).
    const k = reducedMotion.matches ? 1 : 1 - Math.exp(-FOLLOW * dt);
    pos.x += (t.x - pos.x) * k;
    pos.y += (t.y - pos.y) * k;
    frameEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;

    const settled = !row || (Math.abs(t.x - pos.x) < 0.1 && Math.abs(t.y - pos.y) < 0.1);
    if (settled) {
      raf = 0;
      last = 0;
    } else {
      raf = requestAnimationFrame(step);
    }
  };

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(step);
  };

  list.addEventListener("pointerover", (event) => {
    if (event.pointerType !== "mouse") return;
    const link = (event.target as Element).closest<HTMLElement>(".project-row__link");
    if (!link || link === row) return;
    const src = link.dataset.hoverImage;
    if (!src) {
      row = null;
      frameEl.classList.remove("is-visible");
      return;
    }
    const wasHidden = !row;
    row = link;
    showImage(src);
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    if (wasHidden) {
      // Appear on the cursor rather than gliding in from the last spot.
      const t = target();
      pos.x = t.x;
      pos.y = t.y;
    }
    frameEl.classList.add("is-visible");
    kick();
  });

  list.addEventListener("pointermove", (event) => {
    if (!row || event.pointerType !== "mouse") return;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    kick();
  });

  list.addEventListener("pointerout", (event) => {
    if (!row) return;
    const to = event.relatedTarget as Node | null;
    if (to && row.contains(to)) return; // still inside the same row
    row = null;
    frameEl.classList.remove("is-visible");
  });

  addEventListener("scroll", () => row && kick(), { passive: true });
}
