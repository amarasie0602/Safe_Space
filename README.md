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

Booking-status **push notifications** need a VAPID key pair in `backend/.env`
(`VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY`) and the matching public key in
`client/.env` (`VITE_VAPID_PUBLIC_KEY`) — generate one with:
```bash
node -e "console.log(require('web-push').generateVAPIDKeys())"
```
Everything else in the product works without these set; push notifications
are simply skipped if they're absent.

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
| POST | `/auth/login` | Public | Login, returns JWT. Rejects banned accounts; auto-lifts an expired suspension |
| POST | `/auth/reset-password` | Public | Reset password with `pseudonym` + `recoveryCode`; returns a freshly-rotated code |
| POST | `/auth/me/recovery-code/regenerate` | User | Confirm current password to invalidate the old recovery code and get a new one |
| PATCH | `/auth/profile` | User | Update placeholder avatar (`avatarId`, 0-9) and bio |
| GET | `/auth/me/stats` | User | Post count and reply count for the current user |
| GET | `/auth/me/replies` | User | The current user's replies, across both posts and threads |
| GET | `/auth/me/saved-posts` | User | The current user's saved posts (populated) |
| PATCH | `/auth/saved-posts/:postId` | User | Toggle saving a post |
| GET | `/auth/me/blocked-users` | User | The current user's blocked-users list (populated) |
| POST | `/auth/users/:id/block` | User | Block a user — hides their posts/threads from your feed, cross-device |
| POST | `/auth/users/:id/unblock` | User | Unblock a user |

### Notifications
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/notifications` | User | The current user's 30 most recent notifications |
| GET | `/notifications/stream` | User (token as `?token=` query param) | Server-Sent-Events stream — pushes a new notification the instant it's created, instead of polling |
| PATCH | `/notifications/read-all` | User | Mark all notifications read |

### Push notifications
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/push/subscribe` | User | Register a browser's Web Push subscription for this account |
| POST | `/push/unsubscribe` | User | Remove a subscription (by `endpoint`) |

### Posts
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/posts` | User (active, not suspended/banned) | Create post (keyword-flagged); rate-limited and cooldown-limited per user |
| GET | `/posts` | Public | Visible posts only, pseudonym only. Paginated: `?page=1&limit=10`, returns `{ posts, page, hasMore, total }` |
| GET | `/admin/posts` | Admin | All posts incl. flagged |
| PATCH | `/admin/posts/:id/status` | Admin | Change post status |
| DELETE | `/admin/posts/:id` | Admin | Delete post |
| GET | `/posts/:id/replies` | Public | List replies for a post |
| POST | `/posts/:id/replies` | User (active) | Add reply to a post |
| PATCH | `/posts/:id/support` | User | Toggle supporting a post |

### Threads & Replies
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/threads` | User (active, not suspended/banned) | Create thread; rate-limited and cooldown-limited per user |
| GET | `/threads` | Public | List threads. Filter by `category`/`search` (title match), paginated: `?page=1&limit=10`, returns `{ threads, page, hasMore, total }` |
| GET | `/threads/mine/supported` | User | Threads the current user has upvoted |
| GET | `/threads/:id` | Public | Single thread |
| PATCH | `/threads/:id/upvote` | User | Toggle upvoting a thread (also updates the count) |
| GET | `/threads/:id/replies` | Public | List replies for a thread |
| POST | `/threads/:id/replies` | User (active) | Add reply |
| PATCH | `/replies/:id/flag` | User | Flag a reply |
| PATCH | `/replies/:id/upvote` | User | Upvote a reply |

### Counselors
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/counselors/register` | Public | Counselor self-register |
| POST | `/counselors/login` | Public | Counselor login |
| GET | `/counselors` | Public | Verified counselors, no sensitive fields |
| GET | `/counselors/me/schedule` | Counselor | The logged-in counselor's own weekly schedule |
| PATCH | `/counselors/me/schedule` | Counselor | Set weekly recurring availability (`[{ dayOfWeek: 0-6, slots: ["09:00", ...] }]`) |
| GET | `/counselors/:id/availability` | Public | Real open slots for a counselor on a given `?date=YYYY-MM-DD` — the counselor's schedule minus already-booked times minus times already past today |
| GET | `/counselors/:id/reviews` | Public | Reviews left for a counselor (rating + comment, no reviewer identity) |
| POST | `/admin/counselors/verify/:id` | Admin | Verify a counselor |

### Bookings
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/bookings` | User | Book a session in one of the counselor's real open slots (validated against their weekly schedule + a race-safe unique index against double-booking) |
| GET | `/admin/bookings` | Admin | All bookings |
| GET | `/bookings/mine` | Counselor | The logged-in counselor's own bookings |
| GET | `/bookings/mine-as-client` | User | The current user's own bookings, each flagged with whether they've already left a review |
| PATCH | `/bookings/:id/status` | Counselor | Confirm/cancel/complete one of their bookings (`pending → confirmed/cancelled → completed`); notifies the booking's user (in-app + real-time + push) |
| POST | `/bookings/:id/review` | User | Leave a 1–5 star rating + optional comment on a completed booking (one per booking); recomputes the counselor's aggregate rating |

### Reports
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/reports` | User | Submit a report |
| GET | `/admin/reports` | Admin | All reports |
| PATCH | `/admin/reports/:id/resolve` | Admin | Resolve/dismiss report |

### Admin — user moderation
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| PATCH | `/admin/users/:id/suspend` | Admin | Temporarily suspend a user (`{ days }`, defaults to 7) — they can't log in or post until it lifts |
| PATCH | `/admin/users/:id/ban` | Admin | Indefinitely ban a user |
| PATCH | `/admin/users/:id/reinstate` | Admin | Restore a suspended/banned account to active |

### Analytics
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/admin/analytics` | Admin | Aggregate counts only — no raw personal data |

## Product features

Beyond the core CRUD flows, the frontend includes production-shaped UX:

- **Trust & safety**: a contextual (⋯) menu on every post for Report Post, Report User, and Block User, each behind a confirmation dialog with plain-language copy. Blocking is backend-persisted (`User.blockedUsers`) and syncs across devices — Profile has a "Blocked users" section to review/unblock. Reports go to the real `/reports` endpoint (the `Report` model accepts `targetType: 'user'`); moderators review them in the admin Reports Queue, with one-click **Suspend 7 days** / **Ban user** actions for user reports.
- **Moderation escalation**: beyond removing a single post, admins can suspend (temporary, auto-lifts) or ban (indefinite) a user account. A suspended/banned account can't log in, and — since a JWT can outlive a since-suspended account — content-creation routes re-check status against the database on every request, not just at login.
- **Crisis-aware composer**: typing self-harm/suicide-related language into a new post or thread shows an inline, non-blocking supportive banner linking to Crisis Resources — support surfaces immediately, without stopping the person from posting when they're ready.
- **Posting cooldown**: a short per-user cooldown on top of the existing IP-based rate limiter stops a single account from rapid-fire posting (the pattern behind pile-ons/brigading), independent of scripted abuse.
- **Site structure**: a global footer (Company/Support/Legal links + crisis disclaimer), and full static pages — About, Contact, Privacy Policy, Terms of Service, Community Guidelines, Crisis Resources.
- **Search, sort, pagination**: search + pagination on both the Posts feed (`page`/`limit` on `GET /posts`) and the Threads list (`page`/`limit`/`search` on `GET /threads`), each with a "Load more" button, a Most Recent/Most Supported sort, and search-suggestion autocomplete.
- **Form validation UX**: inline messages for empty content, missing category, and a 500-character limit with a live counter on the post form.
- **Loading & error states**: shimmering skeleton cards while content loads, and a `NetworkError` component with a "Try Again" retry action wherever a fetch can fail.
- **My Activity**: My Posts, My Replies, Saved Posts, Supported Discussions, and My Bookings (with an inline review form for completed sessions) — all backend-persisted and synced across devices.
- **Password recovery**: since pseudonymous accounts have no email, registration returns a one-time recovery code (shown once, in a dialog the user must acknowledge) that can reset a forgotten password via `/forgot-password`. The code rotates on every successful reset so a leaked-and-reused code can't grant repeat access. Lost your code without ever using it? Profile has a password-confirmed "generate a new recovery code" flow.
- **Real-time notifications**: replying to someone's post/thread, or a counselor updating a booking's status, creates a `Notification` — pushed instantly to the navbar bell over a Server-Sent-Events stream (no more polling), plus an optional Web Push notification for booking-status changes that arrives even when the tab isn't open (enable it from Profile — needs a VAPID key pair, see Setup).
- **Counselor portal**: a separate login (`/counselor-login`, its own token/session, never mixed with a regular user session), a "My Weekly Schedule" editor for setting real recurring availability, and a booking dashboard (`/counselor/bookings`) where a counselor can confirm, decline, or complete their session requests.
- **Rate limiting**: registration/login/reset-password and post/thread/reply creation are rate-limited (`express-rate-limit`) — anonymous, low-friction content creation is exactly the surface that attracts spam/abuse without it.
- **Real counselor booking**: a counselor sets their own weekly recurring schedule; the booking flow (Calendar → time slot → confirm → confirmation screen) only ever shows slots that are actually open — filtered against that schedule, already-booked times, and (for today) times already in the past — with a race-safe unique index preventing two clients from double-booking the same slot.
- **Counselor reviews**: after a session is marked completed, the client can leave a 1–5 star rating + optional comment from My Activity; the counselor's profile shows real aggregate rating/count and individual reviews instead of a placeholder.
- **Dark mode & accessible focus states**: a full dark palette, visible `:focus-visible` outlines on every link/button, and `title` + `aria-label` on icon-only buttons.
- **Not just problems**: a Gratitude & Wins category for posts and threads, a daily affirmation banner on the feed, and a Healing Reads (`/inspiration`) page of short, original, editorial articles on self-compassion, rest, gratitude, and coping skills — curated, not user-submitted, so there's no moderation queue involved.
- **Richer profiles**: beyond the placeholder avatar, a profile now has an optional 160-character bio, a "member since" date, live post/reply counts (`GET /auth/me/stats`), a blocked-users manager, a push-notification toggle, and recovery-code regeneration.
- **Installable, with real push**: a PWA manifest + app icons, plus a service worker (`client/public/sw.js`) that handles Web Push and notification clicks — still no offline caching, just installability + push.

All the gaps this project used to call out as known limitations — Block User being browser-only, counselor availability being fake placeholder text, and reviews not existing — are now real, backend-backed features (see above). The one thing still true: the service worker doesn't cache anything for offline use, so there's still no offline support, only installability + push.

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
