import { LANGS } from "../data/languages.js";
import { createHeartsBar } from "../core/hearts.js";
import { createQuiz } from "./quiz-engine.js";
import { esc } from "../core/dom.js";

const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function makeQuiz(lang) {
  const questions = shuffle(lang.words).map(word => {
    const o = shuffle([word.en, ...shuffle(lang.words.filter(x => x !== word)).slice(0, 3).map(x => x.en)]);
    return { id: `${lang.id}-${word.t}`, q: `What does "${word.t}"${word.r ? ` (${word.r})` : ""} mean?`, o, a: o.indexOf(word.en), why: `${word.t} means "${word.en}".` };
  });
  return { id: "lang", title: `${lang.name} vocabulary`, questions };
}

export function renderLanguages(el) {
  el.innerHTML = `
    <h1>Languages</h1>
    <div id="bar"></div>
    <p>Beginner vocabulary quizzes. A wrong answer costs a heart; one returns every 10 minutes.</p>
    <div class="filters"><label>Language <select id="lang">${LANGS.map(l => `<option value="${l.id}">${esc(l.name)}</option>`).join("")}</select></label></div>
    <button id="start" class="btn">Start vocabulary quiz</button>
    <div id="play" aria-live="polite"></div>
    <div class="notice">Built so far: beginner vocabulary quizzes in 7 languages. Not built yet: English, flashcards, grammar, listening, pronunciation, conversation and higher levels.</div>`;
  el.querySelector("#bar").append(createHeartsBar());
  const play = el.querySelector("#play");
  let runner = null;
  el.querySelector("#start").addEventListener("click", () => {
    runner?.destroy();
    runner = createQuiz(play, makeQuiz(LANGS.find(l => l.id === el.querySelector("#lang").value)));
    runner.begin();
  });
}
