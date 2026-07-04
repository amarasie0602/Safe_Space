# SafeSpace Backend

Express + MongoDB Atlas API for the SafeSpace platform.

## Setup

```bash
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev
```

## Structure

- `models/` — Mongoose schemas (User, Post, Thread, Reply, Counselor, Booking, Report)
- `routes/` — Express route definitions
- `controllers/` — request handlers
- `middleware/` — auth and role-checking middleware
- `config/` — configuration helpers
