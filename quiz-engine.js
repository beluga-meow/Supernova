// Shared quiz runner: hearts, XP, feedback. quiz = { id, title, questions: [{id, q, o[], a, why}] }
import { getHearts, loseHeart, fmt } from "../core/hearts.js";
import { getState, addXP } from "../core/store.js";
import { esc } from "../core/dom.js";

export function createQuiz(play, quiz) {
  let blocked = false;
  const tick = () => { const cd = play.querySelector("#cd"); if (cd) cd.textContent = fmt(getHearts().msToNext); };
  const showBlocked = () => {
    blocked = true;
    play.innerHTML = `<div class="notice"><strong>Out of hearts.</strong> Next heart in <span id="cd"></span>. Come back when one returns.</div>`;
    tick();
  };
  const onHearts = () => {
    if (!play.isConnected) return destroy();
    if (!blocked) return;
    if (getHearts().n > 0) { blocked = false; play.innerHTML = `<div class="notice">A heart is back. You can start the quiz.</div>`; } else tick();
  };
  const destroy = () => window.removeEventListener("hearts:change", onHearts);
  window.addEventListener("hearts:change", onHearts);

  function ask(i, right) {
    const q = quiz.questions[i], total = quiz.questions.length;
    play.innerHTML = `<h2>Question ${i + 1} of ${total}</h2><p><strong>${esc(q.q)}</strong></p>
      <div class="options">${q.o.map((t, k) => `<button class="btn ghost opt" data-k="${k}">${esc(t)}</button>`).join("")}</div><div id="fb"></div>`;
    let done = false;
    play.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
      if (done) return; done = true;
      const k = +b.dataset.k, ok = k === q.a;
      play.querySelectorAll(".opt").forEach((o, j) => { o.disabled = true; if (j === q.a) o.classList.add("good"); else if (j === k) o.classList.add("bad"); });
      let msg = ok ? "Correct." : "Not quite.";
      if (ok) {
        const key = `quiz:${quiz.id}:${q.id}`;
        if (!getState().awarded.includes(key)) { getState().awarded.push(key); addXP(10, `${quiz.title}, question ${i + 1}`); msg += " +10 XP."; }
      } else loseHeart();
      const out = !ok && getHearts().n === 0, last = i === total - 1;
      play.querySelector("#fb").innerHTML = `<p>${msg} ${esc(q.why)}</p>` + (out ? "" : `<button id="next" class="btn">${last ? "See results" : "Next question"}</button>`);
      if (out) return showBlocked();
      const next = play.querySelector("#next"); next.focus();
      next.addEventListener("click", () => last ? finish(right + (ok ? 1 : 0)) : ask(i + 1, right + (ok ? 1 : 0)));
    }));
  }
  const finish = right => {
    play.innerHTML = `<h2>Done</h2><p>You got ${right} of ${quiz.questions.length} right.</p><button id="again" class="btn ghost">Try again</button>`;
    play.querySelector("#again").addEventListener("click", begin);
  };
  function begin() { if (getHearts().n === 0) return showBlocked(); blocked = false; ask(0, 0); }
  return { begin, destroy };
}
