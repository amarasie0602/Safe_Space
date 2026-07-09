# SafeSpace Backend

Express + MongoDB Atlas API for the SafeSpace platform.

## Setup

```bash
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev
```

## Seed data

`npm run seed` wipes and repopulates every collection with realistic sample
data — users of each role, posts across all 6 categories (Mental Health,
Relationships, Family, Financial Stress, Work & Burnout, Gratitude & Wins —
including one auto-flagged into the moderation queue), threads with
supportive replies (including one pre-flagged), 5 counselors with bios,
specialties, an availability string, and a rating (one left unverified for
the verification demo), bookings, and reports (including one already
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

- `models/` — Mongoose schemas (User, Post, Thread, Reply, Counselor, Booking, Report, Notification)
- `routes/` — Express route definitions
- `controllers/` — request handlers
- `middleware/` — auth, role-checking, and rate-limiting middleware
- `config/` — configuration helpers
- `scripts/` — one-off scripts (e.g. `seed.js`)
- `tests/` — Jest + Supertest suite
