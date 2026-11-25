// Tiny hash router: #/academy -> renders the "academy" view into <main>.
const routes = new Map();

export function register(id, render) { routes.set(id, render); }

export function start(mount, onChange) {
  const go = () => {
    const id = location.hash.replace(/^#\/?/, "") || "home";
    const render = routes.get(id) || routes.get("not-found");
    mount.innerHTML = "";
    render(mount, id);
    onChange(id);
    mount.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  };
  window.addEventListener("hashchange", go);
  go();
}
