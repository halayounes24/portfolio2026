# portfolio2026
My portfolio will be so cool.

One-page static site: HTML + CSS + TypeScript (compiled with `tsc`, no bundler).

## Structure
- `public/` — static files (`index.html`, `styles.css`) copied as-is into `dist/`
- `src/` — TypeScript, compiled to `dist/`
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
