# Abdelmajid NIDNASSER | Data Engineer Portfolio

Minimalist monochrome (black & white) Data Engineer portfolio with separate routed pages (`Overview`, `Projects` + interactive Data Spec popups, `Experience`, `Stack`, `Blog`, `Contact`), automatic system dark/light theme support, pure SVG vector icons, and keyboard command palette (`Cmd/Ctrl + K`).

## Repository Layout

- `web/`: React 19 + TypeScript + Vite + Tailwind CSS v4 source code
- `index.html`, `favicon.svg`, `assets/`: Production static bundle synced for root GitHub Pages serving
- `.github/workflows/deploy.yml`: Automated build & GitHub Pages workflow

## Local Development

```bash
cd web && npm install
npm run dev
```

Or from the repository root:

```bash
npm run dev
npm run typecheck
npm run sync:pages
```
