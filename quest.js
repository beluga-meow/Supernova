import { QUIZ } from "../data/quiz-web.js";
import { createHeartsBar, MAX_HEARTS } from "../core/hearts.js";
import { createQuiz } from "./quiz-engine.js";

export function renderQuest(el) {
  el.innerHTML = `
    <h1>Code Quest</h1>
    <div id="bar"></div>
    <p>You have up to ${MAX_HEARTS} hearts. A wrong answer costs one, and one comes back every 10 minutes.</p>
    <div class="card"><h3>${QUIZ.title}</h3>
      <p>${QUIZ.questions.length} questions. A right answer earns 10 XP the first time you get it.</p>
      <button id="start" class="btn">Start quiz</button></div>
    <div id="play" aria-live="polite"></div>
    <div class="notice">Debugging Detective, Logic Builder, HTML Builder, Python Adventure and Network Mission are not built yet.</div>`;
  el.querySelector("#bar").append(createHeartsBar());
  const runner = createQuiz(el.querySelector("#play"), QUIZ);
  el.querySelector("#start").addEventListener("click", runner.begin);
}
