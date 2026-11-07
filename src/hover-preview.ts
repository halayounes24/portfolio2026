/**
 * Hover preview: while the mouse is inside a project row that has a
 * `data-hover-image`, a small photo follows the cursor. It disappears as
 * soon as the mouse leaves that row.
 *
 * Motion (same principles as the cursor circle):
 *  - Follow-through: position rides an under-damped spring, so the photo
 *    overshoots slightly and settles when the mouse stops.
 *  - Overlapping action: the photo tilts in the direction it's travelling,
 *    like a card hanging from the pointer. The tilt has its own slower
 *    easing, so it keeps swinging back upright after the photo has stopped.
 *
 * The photo is a little taller than the row, so it pokes out past the row's
 * top/bottom edges — but its centre is kept inside the row so it never
 * drifts more than a quarter of its height outside.
 * Only on devices with a real mouse.
 */
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

const STIFFNESS = 160;
const DAMPING = 16; // under-damped → a little overshoot (critical ≈ 25)
const TILT_PER_SPEED = 1 / 180; // degrees of tilt per px/s of horizontal speed
const MAX_TILT = 9; // degrees
const TILT_EASE = 0.08; // lower = tilt lags further behind the motion
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

  // Preload previews so they appear instantly on first hover.
  for (const a of list.querySelectorAll<HTMLElement>("[data-hover-image]")) {
    new Image().src = a.dataset.hoverImage!;
  }

  let row: HTMLElement | null = null; // row currently hovered
  const mouse = { x: 0, y: 0 };
  const pos = { x: 0, y: 0 };
  const vel = { x: 0, y: 0 };
  let tilt = 0;
  let last = 0;
  let raf = 0;

  /** Where the photo should be: on the cursor, vertically kept near the row. */
  const target = () => {
    if (!row) return { ...mouse };
    const r = row.getBoundingClientRect();
    const h = frameEl.offsetHeight;
    const overhang = h * MAX_OVERHANG;
    const minY = r.top + h / 2 - overhang;
    const maxY = r.bottom - h / 2 + overhang;
    const lo = Math.min(minY, maxY);
    const hi = Math.max(minY, maxY);
    return { x: mouse.x, y: Math.min(hi, Math.max(lo, mouse.y)) };
  };

  const step = (now: number) => {
    const dt = Math.min((now - (last || now)) / 1000, 1 / 30) || 1 / 60;
    last = now;
    const t = target();

    if (reducedMotion.matches) {
      pos.x = t.x;
      pos.y = t.y;
      vel.x = vel.y = 0;
      tilt = 0;
    } else {
      vel.x += (STIFFNESS * (t.x - pos.x) - DAMPING * vel.x) * dt;
      vel.y += (STIFFNESS * (t.y - pos.y) - DAMPING * vel.y) * dt;
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;
      const wanted = Math.max(-MAX_TILT, Math.min(MAX_TILT, vel.x * TILT_PER_SPEED));
      tilt += (wanted - tilt) * TILT_EASE;
    }

    frameEl.style.transform =
      `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;

    const settled =
      !row ||
      (Math.abs(t.x - pos.x) < 0.05 &&
        Math.abs(t.y - pos.y) < 0.05 &&
        Math.hypot(vel.x, vel.y) < 1 &&
        Math.abs(tilt) < 0.01);
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
    if ((event as PointerEvent).pointerType !== "mouse") return;
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
    if (img.getAttribute("src") !== src) img.src = src;
    mouse.x = (event as PointerEvent).clientX;
    mouse.y = (event as PointerEvent).clientY;
    if (wasHidden) {
      // Appear on the cursor rather than flying in from the last spot.
      const t = target();
      pos.x = t.x;
      pos.y = t.y;
      vel.x = vel.y = 0;
      tilt = 0;
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

  // The row grows on hover and the page can scroll — keep the photo in bounds.
  addEventListener("scroll", () => row && kick(), { passive: true });
}
