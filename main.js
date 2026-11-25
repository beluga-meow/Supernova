import { SECTIONS } from "./data/sections.js";
import { register, start } from "./router.js";
import { renderDiscover } from "./views/discover.js";
import { renderDashboard } from "./views/dashboard.js";
import { renderQuest } from "./views/quest.js";
import { renderLanguages } from "./views/languages.js";

const main = document.getElementById("main");
const nav = document.getElementById("mainNav");
const toggle = document.getElementById("menuToggle");

// Navigation is built from data, so it can never drift from the routes.
nav.innerHTML = SECTIONS.map(s => `<a href="#/${s.id}" data-id="${s.id}">${s.label}</a>`).join("");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
});

function markActive(id) {
  nav.querySelectorAll("a").forEach(a => {
    if (a.dataset.id === id) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  const s = SECTIONS.find(x => x.id === id);
  document.title = (s ? s.label + " · " : "") + "SUPERNOVA";
}

register("home", el => {
  el.innerHTML = `
    <section class="hero">
      <h1>Explore Beyond the Ordinary.</h1>
      <p>Learn to code, run virtual labs and explore science, all in one place.</p>
      <div class="hero-actions">
        <a class="btn" href="#/academy">Open the Academy</a>
        <a class="btn ghost" href="#/discover">Browse Discover</a>
      </div>
    </section>
    <h2>Everything in SUPERNOVA</h2>
    <div class="section-grid">
      ${SECTIONS.filter(s => s.id !== "home").map(s => `
        <a class="card" href="#/${s.id}">
          <h3>${s.label}</h3>
          <p>${s.blurb}</p>
          <span class="status ${s.status}">${s.status === "live" ? "Available" : "Not built yet"}</span>
        </a>`).join("")}
    </div>`;
});

// Every other section shows an honest "not built yet" page until its phase is done.
register("discover", renderDiscover);
register("dashboard", renderDashboard);
register("quest", renderQuest);
register("languages", renderLanguages);

SECTIONS.filter(s => s.status !== "live").forEach(s =>
  register(s.id, el => {
    el.innerHTML = `
      <h1>${s.label}</h1>
      <p>${s.blurb}</p>
      <div class="notice"><strong>Not built yet.</strong> This section will be built in a later phase.</div>
      <p style="margin-top:1.5rem"><a class="btn ghost" href="#/home">Back to Home</a></p>`;
  }));

register("not-found", el => {
  el.innerHTML = `<h1>Page not found</h1><p>That address does not match any SUPERNOVA section.</p><a class="btn" href="#/home">Go Home</a>`;
});

start(main, markActive);
