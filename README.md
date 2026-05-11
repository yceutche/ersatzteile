# Ersatzteile MF 1014

Bilingual (DE / FR) spare parts catalog and order manager for the **Massey Ferguson MF 1014** tractor.  
Built as an offline-first Progressive Web App (PWA) — installable on desktop and mobile.

**Live production URL:** https://ersatzteile-mf1014.pages.dev  
**GitHub repository:** https://github.com/yceutche/ersatzteile

---

## Features

- Browse **76 spare parts** across **11 categories**
- Part images with pinch-to-zoom
- Bilingual UI — toggle between **Deutsch** and **Français** at any time
- Wishlist with per-item **quantity management**
- Client-side **PDF export** (jsPDF + autoTable)
- **Email & WhatsApp** sharing
- **Offline-first PWA** — installable, works without internet after first load
- Scroll-to-top button, category filter chips, search bar
- Quantity selector on catalog cards and detail screen

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS v3 |
| State / persistence | Zustand v4 + localStorage |
| PDF generation | jsPDF + jspdf-autotable |
| XSS sanitisation | DOMPurify |
| PWA / Service Worker | vite-plugin-pwa (Workbox) |
| Hosting | Cloudflare Pages |
| CI/CD | GitHub Actions |
| Node version | 20+ |

---

## Prerequisites

- **Node.js 20+** — https://nodejs.org
- **npm 10+** (bundled with Node 20)
- **Git**
- **Cloudflare account** (for production deployment)
- **Wrangler CLI** — installed automatically via `npx`

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (hot-reload)
npm run dev
```

Open http://localhost:5173 in your browser.

The dev server supports:
- Hot Module Replacement (HMR)
- TypeScript type checking on save
- Tailwind CSS JIT

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server at http://localhost:5173 |
| `npm run build` | Type-check + build production bundle to `dist/` |
| `npm run preview` | Serve the production build locally (http://localhost:4173) |
| `npm run lint` | Run ESLint on `src/` |
| `npm run tsc` | Run TypeScript type-check without emitting files |
| `npm run test` | Run unit tests (Vitest) |

---

## Production Build

```bash
npm run build
```

Output is written to `dist/`. Includes:
- Chunked JS bundles (vendor / pdf / state / app)
- Minified CSS
- PWA service worker (`sw.js`) with precached assets
- `manifest.webmanifest` for installability

Preview the production build locally before deploying:

```bash
npm run preview
```

---

## Deployment

### Cloudflare Pages — Manual Deploy

Requires a one-time login (opens browser OAuth):

```bash
npx wrangler login
```

Then deploy:

```bash
npm run build
npx wrangler pages deploy dist --project-name=ersatzteile-mf1014
```

First run will ask to **create the project** — choose `Create a new project` and set production branch to `main`.

Subsequent deploys go to the same project and are live within seconds.

**URLs after deploy:**
- Latest deployment: `https://<hash>.ersatzteile-mf1014.pages.dev`
- Permanent production alias: `https://ersatzteile-mf1014.pages.dev`

---

### Cloudflare Pages — Automatic CI/CD via GitHub Actions

Every push to `main` triggers the workflow at `.github/workflows/deploy.yml`:

1. Lint (`eslint`)
2. Type-check (`tsc --noEmit`)
3. Test (`vitest run`)
4. Build (`npm run build`)
5. Deploy to Cloudflare Pages

**Required GitHub repository secrets** (Settings → Secrets → Actions):

| Secret | Where to find it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard → My Profile → API Tokens → Create Token → use **"Edit Cloudflare Pages"** template |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → right sidebar (any page) |

Add them at: https://github.com/yceutche/ersatzteile/settings/secrets/actions

---

## Project Structure

```
ersatzteile/
├── public/
│   ├── _headers          # Cloudflare: CSP, HSTS, security headers
│   ├── _redirects        # Cloudflare: SPA fallback (/* → /index.html)
│   └── images/           # Part images
├── src/
│   ├── components/
│   │   ├── catalog/      # CatalogScreen, PartCard, SearchBar, CategoryChips
│   │   ├── detail/       # PartDetailScreen
│   │   ├── export/       # ExportScreen (PDF / share)
│   │   ├── settings/     # SettingsScreen (language, theme)
│   │   ├── wishlist/     # WishlistScreen
│   │   └── shared/       # BottomNav, Header, ScrollToTopButton, …
│   ├── data/
│   │   └── parts.json    # All 76 parts with bilingual fields
│   ├── i18n/
│   │   ├── de.json       # German UI strings
│   │   └── fr.json       # French UI strings
│   ├── store/
│   │   ├── wishlistStore.ts   # Zustand wishlist (persisted)
│   │   └── settingsStore.ts   # Zustand settings (persisted)
│   ├── types/index.ts    # Shared TypeScript types
│   └── utils/            # i18n, pdfGenerator, sanitize, shareHelpers
├── .github/workflows/
│   └── deploy.yml        # GitHub Actions CI/CD pipeline
├── wrangler.toml         # Cloudflare Pages config
├── vite.config.ts        # Vite + PWA plugin config
├── tailwind.config.js    # Tailwind custom tokens
├── tsconfig.json
└── package.json
```

---

## Environment & Configuration

No `.env` file is needed for local development — the app is fully client-side with no server secrets.

For CI/CD, set the two GitHub secrets listed above. Wrangler reads them automatically during the deploy step.

The `wrangler.toml` at the root configures:
- Project name: `ersatzteile-mf1014`
- Build output: `dist/`
- Compatibility date: `2026-05-11`

---

## Offline / PWA

After the first load, the app is fully cached by the Workbox service worker. Users can:
- Install it to their home screen (Android / iOS / Desktop)
- Use all catalog, wishlist, and export features without internet
- Generate and download PDFs offline

---

## Browser Support

All modern browsers (Chrome 90+, Firefox 90+, Safari 14+, Edge 90+).  
Service Worker requires HTTPS in production — satisfied by Cloudflare Pages automatically.
