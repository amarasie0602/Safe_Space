# SafeSpace Backend

Express + MongoDB Atlas API for the SafeSpace platform.

## Setup

```bash
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev
```

Booking-status push notifications need a VAPID key pair
(`VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` in `.env`) — generate one with
`node -e "console.log(require('web-push').generateVAPIDKeys())"`. Everything
else works without it; push sends are just skipped if it's unset.

## Seed data

`npm run seed` wipes and repopulates every collection with realistic sample
data — users of each role, posts across all 6 categories (Mental Health,
Relationships, Family, Financial Stress, Work & Burnout, Gratitude & Wins —
including one auto-flagged into the moderation queue), threads with
supportive replies (including one pre-flagged), 5 counselors with bios,
specialties, a real weekly `weeklySchedule`, and a rating (one left
unverified for the verification demo), bookings (including one `completed`
booking with a seeded `Review`), and reports (including one already
resolved). Login credentials for every seeded account are printed to the
console when the script finishes.

**Only run this against a dev/test database** — it deletes all existing data
in every collection first.

```bash
npm run seed
```

## Tests

```bash
npm test
```

Jest + Supertest, run against a dedicated `safespace_test` database on the
same Atlas cluster as `MONGO_URI` (there's no local mongod in this
environment) — dropped after each test file. Needs network access to that
cluster. Covers auth (including recovery-code password reset), the
risk-keyword auto-flagging gate on post creation, and admin-route access
control.

## Structure

- `models/` — Mongoose schemas (User, Post, Thread, Reply, Counselor, Booking, Review, Report, Notification, PushSubscription)
- `routes/` — Express route definitions
- `controllers/` — request handlers
- `middleware/` — auth (incl. `requireActiveUser` for suspended/banned checks), role-checking, and rate-limiting/cooldown middleware
- `utils/` — small shared helpers (`webPush.js` configures the VAPID-signed `web-push` client)
- `config/` — configuration helpers
- `scripts/` — one-off scripts (e.g. `seed.js`)
- `tests/` — Jest + Supertest suite
