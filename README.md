# SafeSpace

A MERN stack anonymous support platform built for a university project. SafeSpace gives people a judgment-free place to talk about personal struggles, connect with peers, and reach verified counselors — without giving up their anonymity.

> For a complete reference — data models, auth model, full feature list, known limitations, and testing — see [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md).

## Subsystems

1. **Anonymous User & Issue System** — pseudonymous users post about personal struggles under categories (Mental Health, Relationships, Family, Financial Stress, Work & Burnout, Gratitude & Wins).
2. **Peer Support Community** — threaded discussions per category with replies, upvotes, and reporting.
3. **Professional Connect Module** — verified counselors listed with specialties; users can book anonymous sessions.
4. **Safety & Analytics Dashboard (admin-only)** — auto-flags posts containing risk keywords, routes them to a moderation queue, and shows aggregate analytics.

## Stack

- Backend: Node.js, Express, MongoDB Atlas (Mongoose), JWT auth
- Frontend: React (Vite), React Router, Axios

## Setup

Run both backend and client together from the repo root:
```bash
npm install
npm run dev
```

Or run each separately:

### Backend
```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev
```

### Client
```bash
cd client
npm install
npm run dev
```
The client dev server proxies `/api` to `http://localhost:5000` (see `client/vite.config.js`). Set `VITE_API_URL` in a `client/.env` file to point the axios instance at a different backend URL.

### Admin access

There's no separate admin login page — an admin is just a regular `User`
whose `role` field is `admin`, and logs in through the normal `/login`
form. After `npm run seed` (dev/test databases only), a seeded admin
account is available:

```
Nickname: admin_sage
Password: password123
```

Once logged in, an "Admin" link appears in the navbar, or go straight to
`/admin`. To promote a different account instead, register it normally
via `/register`, then set that user's `role` to `admin` directly in
MongoDB — there's intentionally no in-app way to self-promote to admin.

## Deployment

The client and backend deploy as two separate services — a static Vite
build doesn't belong on the same platform as a long-running Express +
Mongoose process, and vice versa.

### Backend → Railway (or Render/Fly/any host that runs a long-lived Node process)

1. Point the service at the `backend/` directory as its root.
2. Build/start commands are picked up automatically (`npm install` then
   `npm start`); `railway.json` pins the start command explicitly if your
   platform wants it spelled out.
3. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`,
   and `CLIENT_URL` (the deployed frontend's origin, e.g.
   `https://safespace.vercel.app` — comma-separate multiple origins if you
   have a custom domain and a Vercel preview URL both hitting the API).
   `PORT` is usually injected by the platform; `server.js` already reads it.
4. Run `npm run seed` once against your production database only if you
   actually want the seeded demo accounts there — most real deployments
   should skip it and let real users register.

### Frontend → Vercel

1. Point the project at the `client/` directory as its root; Vercel
   auto-detects the Vite framework preset (build command `npm run build`,
   output directory `dist`). `client/vercel.json` adds the SPA rewrite
   React Router needs so a direct link to e.g. `/threads/<id>` doesn't 404.
2. Set `VITE_API_URL` to the deployed backend's URL (e.g.
   `https://safespace-api.up.railway.app`) as a Vercel environment
   variable — this is read at **build** time, so redeploy after changing it.

### Why not one platform for both?

Vercel's serverless functions aren't a good fit for this backend: Mongoose
expects one long-lived connection, but serverless cold-starts would
create (and often fail to clean up) a new connection per invocation,
which is a common way to exhaust an Atlas connection pool in production.
Railway (or similar) keeps the Express process running continuously, so
the Mongoose connection is opened once at boot, exactly as `server.js`
already assumes.

## API Routes

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/register` | Public | Register pseudonymous user. Returns a one-time recovery code |
| POST | `/auth/login` | Public | Login, returns JWT |
| POST | `/auth/reset-password` | Public | Reset password with `pseudonym` + `recoveryCode`; returns a freshly-rotated code |
| PATCH | `/auth/profile` | User | Update placeholder avatar (`avatarId`, 0-9) and bio |
| GET | `/auth/me/stats` | User | Post count and reply count for the current user |
| GET | `/auth/me/replies` | User | The current user's replies, across both posts and threads |
| GET | `/auth/me/saved-posts` | User | The current user's saved posts (populated) |
| PATCH | `/auth/saved-posts/:postId` | User | Toggle saving a post |

### Notifications
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/notifications` | User | The current user's 30 most recent notifications |
| PATCH | `/notifications/read-all` | User | Mark all notifications read |

### Posts
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/posts` | User | Create post (keyword-flagged) |
| GET | `/posts` | Public | Visible posts only, pseudonym only. Paginated: `?page=1&limit=10`, returns `{ posts, page, hasMore, total }` |
| GET | `/admin/posts` | Admin | All posts incl. flagged |
| PATCH | `/admin/posts/:id/status` | Admin | Change post status |
| DELETE | `/admin/posts/:id` | Admin | Delete post |
| GET | `/posts/:id/replies` | Public | List replies for a post |
| POST | `/posts/:id/replies` | User | Add reply to a post |
| PATCH | `/posts/:id/support` | User | Toggle supporting a post |

### Threads & Replies
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/threads` | User | Create thread |
| GET | `/threads` | Public | List threads. Filter by `category`/`search` (title match), paginated: `?page=1&limit=10`, returns `{ threads, page, hasMore, total }` |
| GET | `/threads/mine/supported` | User | Threads the current user has upvoted |
| GET | `/threads/:id` | Public | Single thread |
| PATCH | `/threads/:id/upvote` | User | Toggle upvoting a thread (also updates the count) |
| GET | `/threads/:id/replies` | Public | List replies for a thread |
| POST | `/threads/:id/replies` | User | Add reply |
| PATCH | `/replies/:id/flag` | User | Flag a reply |
| PATCH | `/replies/:id/upvote` | User | Upvote a reply |

### Counselors
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/counselors/register` | Public | Counselor self-register |
| POST | `/counselors/login` | Public | Counselor login |
| GET | `/counselors` | Public | Verified counselors, no sensitive fields |
| POST | `/admin/counselors/verify/:id` | Admin | Verify a counselor |

### Bookings
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/bookings` | User | Book anonymous session |
| GET | `/admin/bookings` | Admin | All bookings |
| GET | `/bookings/mine` | Counselor | The logged-in counselor's own bookings |
| PATCH | `/bookings/:id/status` | Counselor | Confirm/cancel/complete one of their bookings (`pending → confirmed/cancelled → completed`); notifies the booking's user |

### Reports
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/reports` | User | Submit a report |
| GET | `/admin/reports` | Admin | All reports |
| PATCH | `/admin/reports/:id/resolve` | Admin | Resolve/dismiss report |

### Analytics
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/admin/analytics` | Admin | Aggregate counts only — no raw personal data |

## Product features

Beyond the core CRUD flows, the frontend includes production-shaped UX:

- **Trust & safety**: a contextual (⋯) menu on every post for Report Post, Report User, and Block User, each behind a confirmation dialog with plain-language copy. Reports go to the real `/reports` endpoint (the `Report` model now accepts `targetType: 'user'`); moderators review them in the existing admin Reports Queue.
- **Site structure**: a global footer (Company/Support/Legal links + crisis disclaimer), and full static pages — About, Contact, Privacy Policy, Terms of Service, Community Guidelines, Crisis Resources.
- **Search, sort, pagination**: search + pagination on both the Posts feed (`page`/`limit` on `GET /posts`) and the Threads list (`page`/`limit`/`search` on `GET /threads`), each with a "Load more" button and loading state. Posts also has a Most Recent/Most Supported sort.
- **Form validation UX**: inline messages for empty content, missing category, and a 500-character limit with a live counter on the post form.
- **Loading & error states**: shimmering skeleton cards while content loads, and a `NetworkError` component with a "Try Again" retry action wherever a fetch can fail.
- **My Activity**: My Posts, My Replies, Saved Posts, and Supported Discussions — all backend-persisted and synced across devices (see below).
- **Password recovery**: since pseudonymous accounts have no email, registration returns a one-time recovery code (shown once, in a dialog the user must acknowledge) that can reset a forgotten password via `/forgot-password`. The code rotates on every successful reset so a leaked-and-reused code can't grant repeat access.
- **Real notifications**: replying to someone's post/thread, or a counselor updating a booking's status, creates a `Notification` — an unread dot on the navbar bell, polled every 30s while the dropdown is mounted.
- **Counselor portal**: a separate login (`/counselor-login`, its own token/session, never mixed with a regular user session) and a booking dashboard (`/counselor/bookings`) where a counselor can confirm, decline, or complete their session requests.
- **Rate limiting**: registration/login/reset-password and post/thread/reply creation are rate-limited (`express-rate-limit`) — anonymous, low-friction content creation is exactly the surface that attracts spam/abuse without it.
- **Counselor booking**: a counselor profile page and a real multi-step booking flow (Calendar → time slot → confirm → confirmation screen) against the existing `/bookings` endpoint.
- **Dark mode & accessible focus states**: a full dark palette, visible `:focus-visible` outlines on every link/button, and `title` + `aria-label` on icon-only buttons.
- **Not just problems**: a Gratitude & Wins category for posts and threads, a daily affirmation banner on the feed, and a Healing Reads (`/inspiration`) page of short, original, editorial articles on self-compassion, rest, gratitude, and coping skills — curated, not user-submitted, so there's no moderation queue involved.
- **Richer profiles**: beyond the placeholder avatar, a profile now has an optional 160-character bio, a "member since" date, and live post/reply counts (`GET /auth/me/stats`).
- **Installable**: a PWA manifest + app icons (no service worker, so no offline support — just installable metadata).

### Known limitations (by design, not oversights)

- **Block User** — still `localStorage`-only; there's no backend model for it, so it doesn't sync across devices or stop a blocked user from seeing you.
- **Counselor booking time slots** — the multi-step booking flow's time slots are generic placeholders shown as open for every counselor (no per-counselor schedule/availability calendar exists on the backend yet). The `availability` and `rating` fields on `Counselor`, however, are real schema fields set at seed/registration time and returned by the API — only individual client reviews are not implemented (the profile page is honest about that rather than fabricating review text).

Saved Posts, Supported Discussions, My Replies, and post Support reactions used to be on this list — they're now real, backend-persisted, cross-device features (`User.savedPosts`, `Thread.upvotedBy`, `GET /auth/me/replies`, `Post.supporters`).

## Testing

```bash
cd backend && npm test   # Jest + Supertest — auth, risk-keyword flagging, admin route protection
cd client && npm test    # Vitest — pure-function and component smoke tests
```

Backend tests run against a dedicated `safespace_test` database on the same MongoDB Atlas cluster configured in `.env` (there's no local mongod in this environment), dropped after each test file. They need network access to that cluster to run.

## Design theme: Coffee & Comfort

The UI follows a warm, calm "Coffee & Comfort" theme rather than a bright social-media look:

- **Palette**: warm beige/cream surfaces, muted mocha primary, sage secondary, terracotta accent — full light and dark variants in `client/src/index.css`.
- **Typography**: Fraunces (a warm serif) for headings, Inter for body text — comfortable line height, no condensed/sharp styles.
- **Icons**: a small hand-built line-icon set (`client/src/components/Icon.jsx`) replaces emoji everywhere — reactions, categories, moods, theme toggle, search, and reassurance text are all monochrome SVG, not pictographs.
- **No glassmorphism**: solid warm surfaces and soft shadows instead of blur/gradient backgrounds, for a grounded rather than "glassy" feel.

Run `npm run seed` in `backend/` after pulling this theme update — the category taxonomy changed (`academic`/`addiction` → `work_burnout`), so old seeded data won't match the new dropdowns until you reseed.

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for setup, project layout, and PR guidelines. Please also review our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

Licensed under the [MIT License](LICENSE).
