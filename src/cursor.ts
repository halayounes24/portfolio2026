/**
 * Cursor follower: a small bright green-yellow circle that chases the mouse.
 *
 * Motion uses two animation principles:
 *  - Follow-through: position is driven by an under-damped spring, so when
 *    the mouse stops the circle overshoots slightly and settles back.
 *  - Overlapping action: the circle stretches along its direction of travel
 *    (and squashes across it). That deformation has its own, slower easing,
 *    so the shape catches up and relaxes a beat after the position does.
 *
 * It's drawn with `mix-blend-mode: difference`, so it inverts whatever is
 * under it (e.g. white text turns blue inside the circle).
 * Only on devices with a real mouse; skipped on touch screens.
 */
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

// Spring tuning — higher stiffness = snappier; lower damping = more overshoot.
const STIFFNESS = 220;
const DAMPING = 20; // critical damping would be 2·√220 ≈ 30, so this overshoots a little
const STRETCH_PER_SPEED = 1 / 1800; // how much speed (px/s) stretches the circle
const MAX_STRETCH = 0.7; // up to 1.7× long, ~0.6× wide
const STRETCH_EASE = 0.12; // how quickly the shape follows the motion (overlap)

function mountCursor(): void {
  const dot = document.createElement("div");
  dot.className = "cursor-follower";
  dot.setAttribute("aria-hidden", "true");
  document.body.append(dot);

  const target = { x: -100, y: -100 };
  const pos = { x: -100, y: -100 };
  const vel = { x: 0, y: 0 };
  let stretch = 0;
  let angle = 0;
  let last = 0;
  let frame = 0;

  const step = (now: number) => {
    // Seconds since the last frame, clamped so a background tab doesn't explode the spring.
    const dt = Math.min((now - (last || now)) / 1000, 1 / 30) || 1 / 60;
    last = now;

    if (reducedMotion.matches) {
      pos.x = target.x;
      pos.y = target.y;
      vel.x = vel.y = 0;
      stretch = 0;
    } else {
      // Spring towards the mouse (semi-implicit Euler).
      vel.x += (STIFFNESS * (target.x - pos.x) - DAMPING * vel.x) * dt;
      vel.y += (STIFFNESS * (target.y - pos.y) - DAMPING * vel.y) * dt;
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;

      // Shape lags behind the motion: ease the stretch towards what the speed asks for.
      const speed = Math.hypot(vel.x, vel.y);
      const wanted = Math.min(speed * STRETCH_PER_SPEED, MAX_STRETCH);
      stretch += (wanted - stretch) * STRETCH_EASE;
      if (speed > 20) angle = Math.atan2(vel.y, vel.x);
    }

    // Stretch along the travel direction, squash across it (keeps the area roughly constant).
    const sx = 1 + stretch;
    const sy = 1 / sx;
    dot.style.transform =
      `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) ` +
      `rotate(${angle}rad) scale(${sx}, ${sy})`;

    const settled =
      Math.abs(target.x - pos.x) < 0.05 &&
      Math.abs(target.y - pos.y) < 0.05 &&
      Math.hypot(vel.x, vel.y) < 1 &&
      stretch < 0.001;
    if (settled) {
      frame = 0;
      last = 0;
    } else {
      frame = requestAnimationFrame(step);
    }
  };

  addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    target.x = event.clientX;
    target.y = event.clientY;
    if (!dot.classList.contains("is-visible")) {
      // First appearance: start on the pointer instead of flying in from the corner.
      pos.x = target.x;
      pos.y = target.y;
      dot.classList.add("is-visible");
    }
    if (!frame) frame = requestAnimationFrame(step);
  });

  document.documentElement.addEventListener("pointerleave", () => dot.classList.remove("is-visible"));
}

if (finePointer.matches) mountCursor();
