import { RESOURCES } from "../data/resources.js";
import { getState, levelOf, levelProgress, XP_PER_LEVEL, resetAll } from "../core/store.js";
import { esc } from "../core/dom.js";

export function renderDashboard(el) {
  const s = getState();
  const saved = RESOURCES.filter(r => s.favorites.includes(r.id));
  el.innerHTML = `
    <h1>My Dashboard</h1>
    <p class="muted">Saved in this browser only. Clearing site data erases it.</p>
    <div class="stats">
      <div class="card"><h3>Level ${levelOf(s.xp)}</h3><p>${s.xp} XP total</p>
        <progress max="${XP_PER_LEVEL}" value="${levelProgress(s.xp)}" aria-label="Progress to next level"></progress>
        <p class="meta">${XP_PER_LEVEL - levelProgress(s.xp)} XP to level ${levelOf(s.xp) + 1}</p></div>
      <div class="card"><h3>Saved resources</h3><p>${saved.length}</p></div>
      <div class="card"><h3>Courses and lessons</h3><p>The Academy isn't built yet, so there is nothing to complete here.</p></div>
    </div>
    <h2>Saved resources</h2>
    ${saved.length ? `<ul>${saved.map(r => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.name)}</a> — ${esc(r.cat)}</li>`).join("")}</ul>`
      : `<div class="notice">Nothing saved yet. <a href="#/discover">Browse Discover</a> and press Save on a resource.</div>`}
    <h2>Recent activity</h2>
    ${s.activity.length ? `<ul>${s.activity.map(a => `<li>${esc(a.text)} <span class="muted">· ${new Date(a.at).toLocaleString()}</span></li>`).join("")}</ul>`
      : `<p class="muted">No activity yet.</p>`}
    <p><button id="reset" class="btn ghost small">Reset all progress</button></p>`;
  el.querySelector("#reset").addEventListener("click", () => {
    if (confirm("Erase all XP, saved resources and activity in this browser?")) { resetAll(); renderDashboard(el); }
  });
}
