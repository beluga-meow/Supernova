import { CATEGORIES, RESOURCES } from "../data/resources.js";
import { isFav, toggleFav } from "../core/store.js";
import { esc } from "../core/dom.js";

export function renderDiscover(el) {
  el.innerHTML = `
    <h1>Discover</h1>
    <p>Hand-picked websites and tools. Save the ones you want to come back to.</p>
    <div class="filters">
      <label>Search <input id="q" type="search" placeholder="Try python, circuits, fonts"></label>
      <label>Category <select id="cat"><option value="">All categories</option>${CATEGORIES.map(c => `<option>${c}</option>`).join("")}</select></label>
      <label>Sort <select id="sort"><option value="name">Name (A–Z)</option><option value="cat">Category</option><option value="saved">Saved first</option></select></label>
      <label class="check"><input id="onlySaved" type="checkbox"> Saved only</label>
    </div>
    <p id="count" class="muted" aria-live="polite"></p>
    <div id="grid" class="section-grid"></div>`;

  const $ = s => el.querySelector(s);
  const draw = () => {
    const q = $("#q").value.trim().toLowerCase();
    const cat = $("#cat").value, sort = $("#sort").value, only = $("#onlySaved").checked;
    let list = RESOURCES.filter(x =>
      (!cat || x.cat === cat) && (!only || isFav(x.id)) &&
      (!q || `${x.name} ${x.desc} ${x.cat}`.toLowerCase().includes(q)));
    list.sort((a, b) =>
      sort === "cat" ? a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name)
      : sort === "saved" ? (isFav(b.id) - isFav(a.id)) || a.name.localeCompare(b.name)
      : a.name.localeCompare(b.name));
    $("#count").textContent = `${list.length} of ${RESOURCES.length} resources`;
    $("#grid").innerHTML = list.length ? list.map(x => `
      <article class="card res">
        <h3><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.name)}<span class="sr"> (opens in a new tab)</span></a></h3>
        <p>${esc(x.desc)}</p>
        <p class="meta">${esc(x.cat)} · ${esc(x.free)}</p>
        <button class="btn ghost small" data-id="${x.id}" aria-pressed="${isFav(x.id)}">${isFav(x.id) ? "Saved" : "Save"}</button>
      </article>`).join("")
      : `<div class="notice">No resources match. Clear the search or pick another category.</div>`;
  };
  ["#q", "#cat", "#sort", "#onlySaved"].forEach(s => $(s).addEventListener("input", draw));
  $("#grid").addEventListener("click", e => {
    const b = e.target.closest("button[data-id]"); if (!b) return;
    const x = RESOURCES.find(r => r.id === b.dataset.id);
    toggleFav(x.id, x.name);
    draw();
    $(`button[data-id="${x.id}"]`)?.focus();
  });
  draw();
}
