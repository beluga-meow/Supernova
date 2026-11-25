// Single source of truth for navigation and the home grid.
// status: "live" = working now, "planned" = not built yet (shown honestly).
export const SECTIONS = [
  { id: "home",     label: "Home",             blurb: "Start here.",                                       status: "live" },
  { id: "discover", label: "Discover",         blurb: "A searchable directory of useful tools and sites.", status: "live" },
  { id: "academy",  label: "Academy",          blurb: "Learn HTML, CSS, JavaScript and more by doing.",    status: "planned" },
  { id: "quest",    label: "Code Quest",       blurb: "Coding games with missions, XP and rewards.",       status: "live" },
  { id: "labs",     label: "Interactive Labs", blurb: "Network and electronics simulators.",               status: "planned" },
  { id: "science",  label: "Science",          blurb: "Periodic table and Mineral Creator.",               status: "planned" },
  { id: "math",     label: "Mathematics",      blurb: "Calculators, graphing and practice.",               status: "planned" },
  { id: "physics",  label: "Physics",          blurb: "Gravity, motion and projectile simulations.",       status: "planned" },
  { id: "languages",label: "Languages",        blurb: "Vocabulary, flashcards and quizzes.",               status: "live" },
  { id: "studio",   label: "Creative Studio",  blurb: "Palette, gradient and drawing tools.",              status: "planned" },
  { id: "dashboard",label: "My Dashboard",     blurb: "Your XP, progress and saved items.",                status: "live" }
];
