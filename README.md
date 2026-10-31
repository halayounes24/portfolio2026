# portfolio2026
My portfolio will be so cool.

One-page static site: HTML + CSS + TypeScript (compiled with `tsc`, no bundler).

## Structure
- `public/` — static files copied as-is into `dist/`
  - `index.html` — intro + work section markup
  - `styles.css` — all styles; tokens (colours, rolodex sizing) live at the top
  - `images/` — project images (placeholders for now)
- `src/` — TypeScript, compiled to `dist/`
  - `projects.ts` — project data (edit this to add/change projects)
  - `rolodex.ts` — renders the cards and handles open/close
  - `main.ts` — entry point
- `dist/` — build output (git-ignored)

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
