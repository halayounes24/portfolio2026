# portfolio2026
My portfolio will be so cool.

One-page static site: HTML + CSS + TypeScript (compiled with `tsc`, no bundler).

## Structure
- `public/` — static files copied as-is into `dist/`
  - `index.html` — landing page: intro + accordion of projects
  - `project.html` — project page template (`project.html?p=<slug>`)
  - `styles.css` — all styles; tokens (colours, accordion sizing) live at the top
  - `images/` — project covers and assets (placeholders for now)
- `src/` — TypeScript, compiled to `dist/`
  - `projects.ts` — **all project content** (title, tags, facts, story sections, assets)
  - `accordion.ts` — renders the landing-page columns
  - `project-page.ts` — renders a project page from the `?p=` slug
  - `main.ts` — landing page entry point
  - `dom.ts` — small DOM helpers

## Develop
```bash
npm install
npm run build
npm run serve
```

## Deploy
- **GitHub Pages:** `.github/workflows/deploy.yml` builds and deploys on every push to `main`.
  In repo Settings → Pages, set **Source** to **GitHub Actions**.
- **Cloudflare Pages (later):** build command `npm run build`, output directory `dist`.
