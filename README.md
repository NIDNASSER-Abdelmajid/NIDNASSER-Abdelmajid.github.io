# Abdelmajid NIDNASSER — Data Engineer Portfolio

Minimalist monochrome (black & white) Data Engineer portfolio with automatic system dark/light theme support, pure SVG vector icons, interactive pipeline lineage topology, expandable project architecture blueprints, SQL-style stack explorer, and keyboard command palette (`Cmd/Ctrl + K`).

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
