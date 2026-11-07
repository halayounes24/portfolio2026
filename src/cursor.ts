/**
 * Cursor follower: a bright green-yellow circle that trails the mouse.
 * It's drawn with `mix-blend-mode: difference`, so it inverts whatever is
 * under it — e.g. white text turns dark/blue inside the circle.
 * Only on devices with a real mouse; skipped on touch screens.
 */
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

function mountCursor(): void {
  const dot = document.createElement("div");
  dot.className = "cursor-follower";
  dot.setAttribute("aria-hidden", "true");
  document.body.append(dot);

  let targetX = -100;
  let targetY = -100;
  let x = targetX;
  let y = targetY;
  let frame = 0;

  const render = () => {
    // Ease towards the mouse for a soft trail (snap if reduced motion is on).
    const ease = reducedMotion.matches ? 1 : 0.3;
    x += (targetX - x) * ease;
    y += (targetY - y) * ease;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.1 ? requestAnimationFrame(render) : 0;
  };

  addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    targetX = event.clientX;
    targetY = event.clientY;
    dot.classList.add("is-visible");
    if (!frame) frame = requestAnimationFrame(render);
  });

  document.documentElement.addEventListener("pointerleave", () => dot.classList.remove("is-visible"));
}

if (finePointer.matches) mountCursor();
