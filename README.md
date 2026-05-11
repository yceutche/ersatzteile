# Ersatzteile MF 1014

Bilingual spare parts catalog and order manager for the Massey Ferguson MF 1014 tractor.

## Features
- 🔍 Browse 76 spare parts in German & French
- 📷 Part images with zoom
- ❤️ Wishlist with quantity management
- 📄 PDF export (client-side)
- ✉️ Email & WhatsApp sharing
- 📶 Offline-first PWA
- 🌐 DE / FR UI language toggle

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

Output: `dist/`

## Deploy

Deployed automatically to **Cloudflare Pages** via GitHub Actions on push to `main`.

### Manual deploy
```bash
npx wrangler pages deploy dist --project-name=ersatzteile-mf1014
```

## GitHub Secrets required
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Project docs
- [SPEC.md](SPEC.md) — Product specification
- [user-stories.md](user-stories.md) — User stories
- [screens.md](screens.md) — UX screen definitions
- [datamodel.md](datamodel.md) — Data model
- [tech-stack.md](tech-stack.md) — Technical stack
- [instruction.md](instruction.md) — Development milestones & instructions
- [CHANGELOG.md](CHANGELOG.md) — Version history
