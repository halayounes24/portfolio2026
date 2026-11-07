# Assets

Everything in this folder is published with the site as-is.

```
assets/
├── projects/        one folder per project (folder name = project slug)
│   ├── project-1/
│   │   ├── cover.jpg    used on the landing page column and project page header
│   │   ├── 01.jpg       images shown in the project story, in order
│   │   ├── 02.jpg
│   │   └── …
│   └── …
├── info/            images for the Info page (e.g. portrait.jpg)
├── site/            site-wide images: favicon, social share image
├── fonts/           self-hosted Archivo font files
└── placeholders/    temporary filler images — delete once real assets are in
```

## Naming
- Lowercase, no spaces: `cover.jpg`, `01.jpg`, `02-homepage.jpg`, `03-mobile.png`.
- Number story images (`01`, `02`, …) so they sort in the order they appear.
- Each project folder name must match that project's `slug` in `src/projects.ts`.
  If you rename a project's slug, rename its folder too.

## Formats and sizes
- **Photos / renders:** `.jpg` or `.webp`. **Flat graphics / UI with text:** `.png` or `.webp`. **Logos / icons:** `.svg`.
- **Covers:** at least 2400 px wide. The cover is cropped to a tall column on the
  landing page and a wide 16:9 frame on the project page, so keep the important
  part of the image near the centre.
- **Story images:** about 2000 px on the long edge is plenty.
- Aim for under ~500 KB per image so pages load fast (compress with e.g. Squoosh).
  GitHub's web uploader rejects files over 25 MB.

## Using an asset
Uploading a file doesn't show it on the site yet — reference it in `src/projects.ts`,
e.g. `cover: "assets/projects/project-1/cover.jpg"`, or in the page's HTML.

## Uploading on github.com
Open the folder in the repo → **Add file → Upload files** → drag files in → commit.
Committing to `main` redeploys the site automatically.

## Fonts
`fonts/` holds the self-hosted Archivo font (`archivo.css` + `.woff2` files,
licensed under the SIL Open Font License — see `fonts/OFL.txt`). Every page links
`assets/fonts/archivo.css`; don't upload other files here unless you're adding a font.
