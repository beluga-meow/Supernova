// Hearts: max 5, one returns every 10 minutes. Based on timestamps, so hearts
// keep regenerating while the tab is closed.
import { getState, persist } from "./store.js";
export const MAX_HEARTS = 5;
export const REGEN_MS = 10 * 60 * 1000;
const emit = () => window.dispatchEvent(new CustomEvent("hearts:change"));

function sync(now = Date.now()) {
  const h = getState().hearts;
  if (h.n >= MAX_HEARTS) { if (h.t) { h.t = 0; persist(); } return; }
  if (!h.t || h.t > now) { h.t = now; persist(); return; } // missing or clock moved back
  const gained = Math.floor((now - h.t) / REGEN_MS);
  if (gained > 0) {
    h.n = Math.min(MAX_HEARTS, h.n + gained);
    h.t = h.n >= MAX_HEARTS ? 0 : h.t + gained * REGEN_MS;
    persist();
  }
}
export function getHearts() {
  sync();
  const h = getState().hearts;
  return { n: h.n, msToNext: h.n < MAX_HEARTS ? Math.max(0, REGEN_MS - (Date.now() - h.t)) : 0 };
}
// Returns false if there were no hearts left.
export function loseHeart() {
  sync();
  const h = getState().hearts;
  if (h.n <= 0) return false;
  if (h.n === MAX_HEARTS) h.t = Date.now();
  h.n--; persist(); emit();
  return true;
}
export const fmt = ms => { const s = Math.ceil(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

// 8-bit heart: pixel grid with a computed outline, drawn as crisp SVG rects.
const SHAPE = [".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."];
const filled = new Set();
SHAPE.forEach((row, y) => [...row].forEach((c, x) => { if (c === "X") filled.add(x + "," + y); }));
const outline = new Set();
filled.forEach(k => { const [x, y] = k.split(",").map(Number);
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx, dy]) => { const n = (x+dx) + "," + (y+dy); if (!filled.has(n)) outline.add(n); }); });
const rects = (set, cls) => [...set].map(k => { const [x, y] = k.split(","); return `<rect class="${cls}" x="${x}" y="${y}" width="1" height="1"/>`; }).join("");
const heartSvg = full => `<svg class="px-heart ${full ? "full" : "empty"}" viewBox="-1 -1 9 8" shape-rendering="crispEdges" aria-hidden="true">${rects(outline, "ol")}${rects(filled, "fill")}${full ? '<rect class="shine" x="1" y="1" width="1" height="1"/>' : ""}</svg>`;

// A hearts panel to place inside a game or quiz view. Cleans itself up when the view is left.
export function createHeartsBar() {
  const el = document.createElement("div");
  el.className = "hearts-bar";
  el.setAttribute("role", "img");
  let last = getHearts().n;
  const draw = () => {
    const { n, msToNext } = getHearts();
    el.innerHTML = Array.from({ length: MAX_HEARTS }, (_, i) => heartSvg(i < n)).join("") +
      `<span class="px-timer" aria-hidden="true">${n < MAX_HEARTS ? "NEXT " + fmt(msToNext) : "FULL"}</span>`;
    el.setAttribute("aria-label", `${n} of ${MAX_HEARTS} hearts` + (n < MAX_HEARTS ? `, next heart in ${fmt(msToNext)}` : ""));
    if (n < last) { el.classList.add("hit"); setTimeout(() => el.classList.remove("hit"), 400); }
    last = n;
  };
  const id = setInterval(() => {
    if (!el.isConnected) { clearInterval(id); window.removeEventListener("hearts:change", draw); return; }
    sync(); emit(); // once per second so countdowns update
  }, 1000);
  window.addEventListener("hearts:change", draw);
  draw();
  return el;
}
