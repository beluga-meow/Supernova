# SUPERNOVA

Explore Beyond the Ordinary.

## Run locally
ES modules need a web server (double-clicking index.html will not work).
- VS Code: install "Live Server", right-click index.html, "Open with Live Server".
- Or in this folder: `python -m http.server 8000` then open http://localhost:8000

## Deploy (GitHub + Cloudflare Pages)
1. Push this folder to a GitHub repository.
2. Cloudflare dashboard > Workers & Pages > Create > Pages > Connect to Git.
3. Pick the repo. Framework preset: None. Build command: empty. Output directory: `/`.
4. Save and deploy.

## Structure
- `index.html` page shell
- `css/` tokens (brand), base, layout
- `js/main.js` entry, `js/router.js` hash router, `js/data/sections.js` section list
- `assets/`, `data/` reserved for later phases
