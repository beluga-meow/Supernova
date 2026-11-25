export const QUIZ = { id: "web", title: "Web Basics Quiz", questions: [
  { id: "q1", q: "Which HTML tag makes the largest heading?", o: ["<h6>", "<h1>", "<head>", "<title>"], a: 1, why: "<h1> is the top-level heading; <h6> is the smallest." },
  { id: "q2", q: "Which CSS property changes the color of text?", o: ["font-color", "text-style", "color", "foreground"], a: 2, why: "color sets the text color; there is no font-color property." },
  { id: "q3", q: "Which declaration turns an element into a flex container?", o: ["display: flex;", "flex: container;", "position: flex;", "layout: flex;"], a: 0, why: "display: flex enables flexbox on the element's children." },
  { id: "q4", q: "How do you start a single-line comment in JavaScript?", o: ["#", "<!--", "//", "**"], a: 2, why: "// comments out the rest of the line. # is Python; <!-- is HTML." },
  { id: "q5", q: "What does typeof null return in JavaScript?", o: ["\"null\"", "\"object\"", "\"undefined\"", "\"number\""], a: 1, why: "It is a long-standing quirk: typeof null is \"object\"." },
  { id: "q6", q: "Which HTTP status code means \"Not Found\"?", o: ["200", "301", "404", "500"], a: 2, why: "404 means the server can't find the requested page." }
] };
