# SafeSpace Client

React (Vite) frontend for the SafeSpace platform — an anonymous peer support and counselor-connect app themed around a warm "Coffee & Comfort" look and feel.

## Setup

```bash
npm install
npm run dev
```

The dev server proxies `/api` to `http://localhost:5000` (see `vite.config.js`). To point at a different backend, set `VITE_API_URL` in a `.env` file in this directory.

To enable Web Push (booking-status notifications), also set
`VITE_VAPID_PUBLIC_KEY` in that `.env` — it must match the public half of
the backend's VAPID key pair (see `backend/README.md`). Without it, the
push-notification toggle in Profile simply doesn't appear.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |
| `npm test` | Run the Vitest suite |

## Structure

- `src/` — components, pages, and app logic
- `src/components/Icon.jsx` — hand-built line-icon set used throughout the UI (no emoji, no icon font)
- `src/utils/pushNotifications.js` — Web Push subscribe/unsubscribe helpers
- `public/sw.js` — service worker; handles incoming Web Push events and notification clicks
- `public/` — static assets

See the [root README](../README.md) for the full product feature list, API routes, and the design theme, and [BUILDPLAN.md](../BUILDPLAN.md) for the original subsystem design.
