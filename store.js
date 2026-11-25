// Local progress storage. Everything lives in this browser only (localStorage).
const KEY = "supernova:v1";
const fresh = () => ({ xp: 0, favorites: [], awarded: [], activity: [], hearts: { n: 5, t: 0 } });
let state = load();

function load() {
  try { return { ...fresh(), ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
  catch { return fresh(); }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
  catch { return false; } // private mode or storage full
}
const log = text => { state.activity = [{ text, at: Date.now() }, ...state.activity].slice(0, 20); };

export const XP_PER_LEVEL = 100;
export const getState = () => state;
export const levelOf = xp => Math.floor(xp / XP_PER_LEVEL) + 1;
export const levelProgress = xp => xp % XP_PER_LEVEL;

export function addXP(amount, reason) {
  state.xp += amount;
  log(`+${amount} XP: ${reason}`);
  save();
}
export const isFav = id => state.favorites.includes(id);

// Returns true if the item is now saved. XP is given once per item, so toggling can't farm it.
export function toggleFav(id, name) {
  if (isFav(id)) {
    state.favorites = state.favorites.filter(x => x !== id);
    log(`Removed ${name} from saved`);
    save();
    return false;
  }
  state.favorites.push(id);
  log(`Saved ${name}`);
  if (!state.awarded.includes("fav:" + id)) {
    state.awarded.push("fav:" + id);
    state.xp += 5;
    log(`+5 XP: first save of ${name}`);
  }
  save();
  return true;
}
export const persist = save;
// Hearts survive a reset so it can't be used to refill them.
export function resetAll() { const h = state.hearts; state = fresh(); state.hearts = h; save(); }
