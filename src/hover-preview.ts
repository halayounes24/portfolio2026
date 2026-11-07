/**
 * Hover preview: while the mouse is inside a project row that has a
 * `data-hover-image`, a small photo follows the cursor ("flying carpet").
 * It disappears as soon as the mouse leaves that row.
 *
 * Motion:
 *  - Follow-through: the photo's position rides an under-damped spring, so
 *    it overshoots slightly and settles when the mouse stops.
 *  - Overlapping action: instead of tilting, the photo *bends* like cloth.
 *    Its middle leads in the direction of travel while the edges trail, so
 *    the sides arc (one bows out, the other in). The bend is driven by
 *    speed through its own softer spring, so it keeps rippling gently after
 *    the photo has stopped.
 *
 * The bend is drawn with WebGL on a fine mesh so the curve is perfectly
 * smooth; if WebGL isn't available the plain photo is shown instead.
 * The photo is a little taller than the row and may overhang its edges by
 * up to a quarter of its height. Only on devices with a real mouse.
 */
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

// Position spring (follow-through).
const STIFFNESS = 150;
const DAMPING = 17; // critical ≈ 24.5 → a small overshoot

// Bend spring (overlapping action). Bend is in px at the middle of the photo.
const BEND_PER_SPEED = 0.045; // px of bend per px/s of speed
const MAX_BEND_X = 0.14; // × photo width  (sides arc when moving left/right)
const MAX_BEND_Y = 0.08; // × photo height (top/bottom arc when moving up/down)
const BEND_STIFFNESS = 90;
const BEND_DAMPING = 13; // softer than the position spring → ripples a little

const MAX_OVERHANG = 0.25; // fraction of the photo's height allowed outside the row
const MESH = 24; // mesh resolution (segments per side)

// ---------------------------------------------------------------------------
// WebGL "carpet" renderer
// ---------------------------------------------------------------------------

const VERTEX = `
attribute vec2 a_uv;
uniform vec2 u_canvas;  // canvas size (css px)
uniform vec2 u_size;    // photo size (css px)
uniform vec2 u_pad;     // room around the photo for the bend (css px)
uniform vec2 u_bend;    // bend at the middle (css px)
uniform vec4 u_crop;    // texture offset.xy + scale.zw (object-fit: cover)
varying vec2 v_uv;
void main() {
  vec2 p = u_pad + a_uv * u_size;
  p.x += u_bend.x * sin(3.14159265 * a_uv.y); // rows shift → left/right sides arc
  p.y += u_bend.y * sin(3.14159265 * a_uv.x); // columns shift → top/bottom arc
  vec2 clip = p / u_canvas * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  v_uv = u_crop.xy + a_uv * u_crop.zw;
}`;

const FRAGMENT = `
precision mediump float;
uniform sampler2D u_tex;
varying vec2 v_uv;
void main() { gl_FragColor = texture2D(u_tex, v_uv); }`;

interface Carpet {
  canvas: HTMLCanvasElement;
  setImage(img: HTMLImageElement): void;
  draw(width: number, height: number, bendX: number, bendY: number): void;
}

function createCarpet(): Carpet | null {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // Grid mesh over the photo (uv 0..1), drawn as triangles.
  const uvs: number[] = [];
  for (let y = 0; y <= MESH; y++) for (let x = 0; x <= MESH; x++) uvs.push(x / MESH, y / MESH);
  const indices: number[] = [];
  for (let y = 0; y < MESH; y++) {
    for (let x = 0; x < MESH; x++) {
      const i = y * (MESH + 1) + x;
      indices.push(i, i + 1, i + MESH + 1, i + 1, i + MESH + 2, i + MESH + 1);
    }
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
  const aUv = gl.getAttribLocation(program, "a_uv");
  gl.enableVertexAttribArray(aUv);
  gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const uCanvas = u("u_canvas");
  const uSize = u("u_size");
  const uPad = u("u_pad");
  const uBend = u("u_bend");
  const uCrop = u("u_crop");

  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

  let imgAspect = 1;
  let ready = false;

  return {
    canvas,
    setImage(img) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      imgAspect = img.naturalWidth / img.naturalHeight;
      ready = true;
    },
    draw(width, height, bendX, bendY) {
      const padX = width * MAX_BEND_X + 2;
      const padY = height * MAX_BEND_Y + 2;
      const cw = width + 2 * padX;
      const ch = height + 2 * padY;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const pw = Math.round(cw * dpr);
      const ph = Math.round(ch * dpr);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
        canvas.style.width = `${cw}px`;
        canvas.style.height = `${ch}px`;
        canvas.style.left = `${-padX}px`;
        canvas.style.top = `${-padY}px`;
      }
      gl.viewport(0, 0, pw, ph);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (!ready) return;

      // object-fit: cover — crop the texture to the photo box's aspect ratio.
      const boxAspect = width / height;
      let sx = 1;
      let sy = 1;
      if (imgAspect > boxAspect) sx = boxAspect / imgAspect;
      else sy = imgAspect / boxAspect;

      gl.uniform2f(uCanvas, cw, ch);
      gl.uniform2f(uSize, width, height);
      gl.uniform2f(uPad, padX, padY);
      gl.uniform2f(uBend, bendX, bendY);
      gl.uniform4f(uCrop, (1 - sx) / 2, (1 - sy) / 2, sx, sy);
      gl.drawElements(gl.TRIANGLES, MESH * MESH * 6, gl.UNSIGNED_SHORT, 0);
    },
  };
}

// ---------------------------------------------------------------------------

export function mountHoverPreview(list: HTMLElement): void {
  if (!finePointer.matches) return;

  const frameEl = document.createElement("div");
  frameEl.className = "hover-preview";
  frameEl.setAttribute("aria-hidden", "true");
  document.body.append(frameEl);

  const carpet = createCarpet();
  const fallbackImg = document.createElement("img"); // used if WebGL is unavailable
  fallbackImg.alt = "";
  frameEl.append(carpet ? carpet.canvas : fallbackImg);

  // Load each preview once; reuse the decoded image afterwards.
  const images = new Map<string, HTMLImageElement>();
  const load = (src: string) => {
    let img = images.get(src);
    if (!img) {
      img = new Image();
      img.decoding = "async";
      img.src = src;
      images.set(src, img);
    }
    return img;
  };
  for (const a of list.querySelectorAll<HTMLElement>("[data-hover-image]")) load(a.dataset.hoverImage!);

  let row: HTMLElement | null = null;
  let currentSrc = "";
  const mouse = { x: 0, y: 0 };
  const pos = { x: 0, y: 0 };
  const vel = { x: 0, y: 0 };
  const bend = { x: 0, y: 0 };
  const bendVel = { x: 0, y: 0 };
  let last = 0;
  let raf = 0;

  const showImage = (src: string) => {
    if (src === currentSrc) return;
    currentSrc = src;
    const img = load(src);
    if (!carpet) {
      fallbackImg.src = src;
      return;
    }
    const upload = () => src === currentSrc && carpet.setImage(img);
    if (img.complete && img.naturalWidth) upload();
    else img.addEventListener("load", upload, { once: true });
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
    const w = frameEl.offsetWidth;
    const h = frameEl.offsetHeight;

    if (reducedMotion.matches) {
      pos.x = t.x;
      pos.y = t.y;
      vel.x = vel.y = bend.x = bend.y = bendVel.x = bendVel.y = 0;
    } else {
      // Position: follow-through spring.
      vel.x += (STIFFNESS * (t.x - pos.x) - DAMPING * vel.x) * dt;
      vel.y += (STIFFNESS * (t.y - pos.y) - DAMPING * vel.y) * dt;
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;

      // Bend: the middle leads in the direction of travel; edges trail.
      const maxX = w * MAX_BEND_X;
      const maxY = h * MAX_BEND_Y;
      const wantX = Math.max(-maxX, Math.min(maxX, vel.x * BEND_PER_SPEED));
      const wantY = Math.max(-maxY, Math.min(maxY, vel.y * BEND_PER_SPEED));
      bendVel.x += (BEND_STIFFNESS * (wantX - bend.x) - BEND_DAMPING * bendVel.x) * dt;
      bendVel.y += (BEND_STIFFNESS * (wantY - bend.y) - BEND_DAMPING * bendVel.y) * dt;
      bend.x += bendVel.x * dt;
      bend.y += bendVel.y * dt;
    }

    frameEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
    carpet?.draw(w, h, bend.x, bend.y);

    const settled =
      !row ||
      (Math.abs(t.x - pos.x) < 0.05 &&
        Math.abs(t.y - pos.y) < 0.05 &&
        Math.hypot(vel.x, vel.y) < 1 &&
        Math.abs(bend.x) + Math.abs(bend.y) < 0.05 &&
        Math.hypot(bendVel.x, bendVel.y) < 0.5);
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
      // Appear on the cursor, flat, rather than flying in from the last spot.
      const t = target();
      pos.x = t.x;
      pos.y = t.y;
      vel.x = vel.y = bend.x = bend.y = bendVel.x = bendVel.y = 0;
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
