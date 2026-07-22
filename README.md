# Meetfleet

The History's First Social OS — marketing landing page.

Live at **[meetfleet.org](https://meetfleet.org/)**.

## Stack

- **React 18** + **Vite** — SPA, fast HMR, optimized production build
- **Tailwind CSS** — utility styling
- **Framer Motion** — scroll-driven animation (sticky scenes, parallax, reveals)

## Development

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build to dist/
npm run preview  # preview the production build locally
npm run lint     # lint
```

## Structure

```
public/                     static assets served at the site root
  favicon.svg / .png        brand favicons (black smile mark)
  og.webp                   social share card (Open Graph / Twitter)
  devices.webp, SAS.webp    section imagery
  sas.pdf                   technical white paper
  CNAME                     custom domain for GitHub Pages
src/
  components/
    animations/             StickyScene + scroll-progress context
    media/                  IntroVideo, LazyVideo
    organisms/              page sections (Hero, Message, Sas, Invention,
                            GradientGrid, Ecosystem, Download)
  assets/                   bundled fonts (Alliance No.2) + logo
  App.jsx                   section composition
```

## Deployment

Pushing to `main` triggers the GitHub Actions workflow
([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)), which builds
the site and publishes `dist/` to GitHub Pages. The custom domain is pinned via
`public/CNAME`.

> Note: manage the domain through `public/CNAME` in the repo — editing it in the
> GitHub web UI can revert Pages to a legacy branch build and break the deploy.
