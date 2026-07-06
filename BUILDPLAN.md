# SafeSpace — Full Build Plan

## Project Overview

SafeSpace is a MERN stack anonymous support platform built as a university project.
It allows pseudonymous users to share personal struggles, engage in peer support,
connect with verified counselors, and be protected by an admin safety dashboard —
all without collecting real names from regular users.

---

## Subsystems

### 1. Anonymous User & Issue System
- Users register with a pseudonym (no real name collected)
- Posts are categorised under: `mental_health`, `family`, `financial`, `academic`, `relationships`, `addiction`
- Auto-flagging detects risk keywords on post creation and routes to moderation queue

### 2. Peer Support Community
- Threaded discussions per category
- Replies with upvotes and a report/flag button
- Moderation queue visible to admin/moderators

### 3. Professional Connect Module
- Counselors are a **separate collection** from anonymous users (they carry real credentials)
- Admin must verify a counselor before they appear publicly
- Users can book anonymous sessions with verified counselors

### 4. Safety & Analytics Dashboard (Admin-only)
- Auto-flagged posts routed to moderation queue
- Reports queue for flagged replies/threads/posts
- Aggregate analytics via MongoDB aggregation pipelines — **no raw personal data ever displayed**
- Metrics: post counts by category, flagged-post counts, avg resolution time

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js >= 18 |
| Framework | Express v5 |
| Database | MongoDB Atlas + Mongoose v9 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Frontend | React (Vite), React Router, Axios |
| Dev tooling | nodemon, concurrently |
| Charts | Recharts |

---

## Collections & Roles

**Collections:** `users`, `posts`, `threads`, `replies`, `counselors`, `bookings`, `reports`

**Roles:** `user`, `moderator`, `admin` (on User model) | `counselor` (on Counselor model)

> Role enforcement is **always done in backend middleware**, never via frontend checks alone.

---

## Mongoose Schemas (field reference)

### User
```
pseudonym     String  required, unique, trim, minlength:3, maxlength:32
passwordHash  String  required
role          String  enum: ['user','moderator','admin']  default:'user'
timestamps
```

### Post
```
author        ObjectId  ref:'User'  required
category      String    enum: ['mental_health','family','financial','academic','relationships','addiction']  required
content       String    required, trim, maxlength:5000
flagged       Boolean   default:false  (auto-set by keyword helper on creation)
status        String    enum: ['visible','under_review','removed']  default:'visible'
timestamps
index: { category:1, createdAt:-1 }
```

### Thread
```
author        ObjectId  ref:'User'  required
category      String    same enum as Post  required
title         String    required, trim, maxlength:150
body          String    required, trim, maxlength:5000
upvotes       Number    default:0
timestamps
index: { category:1, createdAt:-1 }
```

### Reply
```
thread        ObjectId  ref:'Thread'  required
author        ObjectId  ref:'User'  required
body          String    required, trim, maxlength:2000
upvotes       Number    default:0
flagged       Boolean   default:false
timestamps
index: { thread:1, createdAt:1 }
```

### Counselor
```
name          String   required, trim
email         String   required, unique, trim, lowercase
passwordHash  String   required
specialties   [String] enum: same 6 categories
credentials   String   trim
verified      Boolean  default:false
role          String   enum:['counselor']  default:'counselor'
timestamps
```

### Booking
```
user           ObjectId  ref:'User'       required
counselor      ObjectId  ref:'Counselor'  required
requestedTime  Date      required
status         String    enum:['pending','confirmed','completed','cancelled']  default:'pending'
notes          String    trim
timestamps
```

### Report
```
reporter    ObjectId  ref:'User'   required
targetType  String    enum:['post','thread','reply']  required
targetId    ObjectId  required
reason      String    required, trim, maxlength:500
status      String    enum:['open','resolved','dismissed']  default:'open'
resolvedBy  ObjectId  ref:'User'
resolvedAt  Date
timestamps
```

---

## Coding Conventions

- **RESTful routes:** `/posts`, `/admin/posts`, `/threads/:id/replies`
- **Controllers separated from routes** — no logic inside route files
- **All admin routes** protected by `adminOnly` middleware
- **Never expose** `passwordHash` or unverified counselor data in any API response
- **Comment safety-critical logic** (keyword flagging, moderation queue routing) clearly — this appears in the project report
- **Express v5** — async errors in route handlers propagate automatically; no need for `try/catch next(err)` pattern
- **Conventional Commits** style: `feat:`, `fix:`, `chore:`, `docs:`, `perf:`
- Small, logically-scoped commits — no batching unrelated changes

---

## Git Rules

- Never commit `backend/.env`, `node_modules/`, or `client/node_modules/`
- Do not force-push, amend published commits, or rewrite history on remote
- Confirm before first `git push` and before any destructive git operation
- Add `client/` gitignore entries before scaffolding the frontend

---

## Project Structure

```
SafeSpace/
├── backend/
│   ├── config/
│   ├── controllers/         — logic lives here
│   ├── middleware/          — auth, adminOnly, moderatorOnly
│   ├── models/              — all 7 schemas (do not redefine)
│   ├── routes/              — thin router files
│   ├── server.js
│   ├── .env                 — never commit
│   └── package.json
├── client/                  — scaffolded in Day 4 (Vite React)
│   ├── src/
│   │   ├── api/             — axios instance + interceptors
│   │   ├── context/         — AuthContext
│   │   ├── components/      — shared UI components
│   │   └── pages/           — one file per page
│   └── package.json
├── BUILDPLAN.md
└── .gitignore
```

---

## Build Timeline

---

## ✔ Day 1 — Scaffold & Schema (COMPLETE)

**Goal:** Repository bootstrap, all Mongoose schemas, server entry point.

**What was done:**
- npm package initialised (`express`, `mongoose`, `dotenv`, `cors`, `bcryptjs`, `jsonwebtoken`, `nodemon`)
- `server.js` — Express app, JSON body parser, CORS, MongoDB Atlas connection via `process.env.MONGO_URI`, health-check route, `app.listen`
- All 7 schemas created in `backend/models/` with correct field names, enums, lengths, indexes, and timestamps
- `config/`, `controllers/`, `middleware/`, `routes/` scaffold directories with `.gitkeep`
- `.gitignore` covers `node_modules/` and `.env`
- `engines: { node: ">=18" }` in package.json
- 31 commits, all Conventional Commits style

**Verified:** All schema field names, enums, and relationships confirmed. `npm run dev` starts cleanly.

---

## ✔ Day 2 — Phase A: Auth + Anonymous Posts (Backend) (COMPLETE)

**Goal:** Auth middleware, register/login, post CRUD with keyword auto-flagging. Wire everything into server.js.

**32 commits:**

### Auth Middleware (`backend/middleware/authMiddleware.js`)
1. `feat: scaffold authMiddleware.js with JWT verification stub`
2. `feat: verify JWT from Authorization header in protect middleware`
3. `feat: attach decoded user payload to req.user`
4. `feat: add adminOnly middleware checking req.user.role`

### Auth Controller (`backend/controllers/authController.js`)
5. `feat: scaffold authController with register and login stubs`
6. `feat: implement register — hash password with bcryptjs`
7. `feat: check pseudonym uniqueness before saving on register`
8. `feat: sign and return JWT on successful registration`
9. `feat: implement login — look up user by pseudonym`
10. `feat: compare password hash with bcryptjs.compare on login`
11. `feat: return 401 for wrong password or unknown pseudonym`

### Auth Routes (`backend/routes/authRoutes.js`)
12. `feat: add POST /auth/register route`
13. `feat: add POST /auth/login route`
14. `feat: mount authRoutes in server.js under /auth`

### Post Controller (`backend/controllers/postController.js`)
15. `feat: add RISK_KEYWORDS list for safety auto-flagging`
16. `feat: add containsRiskKeyword helper with safety comment block`
17. `feat: add createPost handler applying keyword flagging on save`
18. `feat: set flagged posts to under_review status on creation`
19. `feat: strip password hash from post author projection`
20. `feat: add getPosts handler excluding removed and under_review`
21. `feat: populate only author.pseudonym in public post response`
22. `feat: add adminGetPosts returning all posts including flagged`
23. `feat: populate author pseudonym in admin post response`
24. `feat: add updatePostStatus handler for admin status transitions`
25. `feat: add adminDeletePost handler`

### Post Routes (`backend/routes/postRoutes.js`)
26. `feat: add POST /posts route protected by auth middleware`
27. `feat: add GET /posts public route`
28. `feat: add GET /admin/posts route with adminOnly guard`
29. `feat: add PATCH /admin/posts/:id/status with adminOnly guard`
30. `feat: add DELETE /admin/posts/:id with adminOnly guard`
31. `feat: mount postRoutes in server.js`
32. `fix: ensure passwordHash never appears in any API response`

---

## ✔ Day 3 — Phase B: Community + Counselors + Reports + Analytics (Backend) (COMPLETE)

**Goal:** Complete all remaining backend subsystems — threads, replies, counselors, bookings, reports, and the analytics aggregation pipeline.

**38 commits:**

### Thread Controller + Routes (`backend/controllers/threadController.js`, `backend/routes/threadRoutes.js`)
1. `feat: scaffold threadController`
2. `feat: add createThread handler`
3. `feat: add getThreads handler with optional category filter`
4. `feat: add getThread handler returning single thread`
5. `feat: add POST /threads route with auth middleware`
6. `feat: add GET /threads public route`
7. `feat: mount threadRoutes in server.js`

### Reply Controller + Routes (`backend/controllers/replyController.js`, `backend/routes/replyRoutes.js`)
8. `feat: scaffold replyController`
9. `feat: add createReply handler linked to parent thread`
10. `feat: populate author pseudonym in reply response`
11. `feat: add flagReply handler setting flagged true`
12. `feat: add POST /threads/:id/replies with auth middleware`
13. `feat: add PATCH /replies/:id/flag route with auth middleware`
14. `feat: mount replyRoutes in server.js`

### Counselor Controller + Routes (`backend/controllers/counselorController.js`, `backend/routes/counselorRoutes.js`)
15. `feat: scaffold counselorController`
16. `feat: add counselor register handler with bcrypt hash`
17. `feat: add counselor login handler returning JWT with role`
18. `feat: add adminVerifyCounselor handler setting verified true`
19. `feat: add getCounselors handler — verified only`
20. `feat: strip passwordHash and email from public counselor response`
21. `feat: add POST /counselors/register and /counselors/login routes`
22. `feat: add GET /counselors and POST /admin/counselors/verify/:id routes`
23. `feat: mount counselorRoutes in server.js`

### Booking Controller + Routes (`backend/controllers/bookingController.js`, `backend/routes/bookingRoutes.js`)
24. `feat: scaffold bookingController`
25. `feat: add createBooking handler for anonymous session requests`
26. `feat: add adminGetBookings handler`
27. `feat: add POST /bookings route with auth middleware`
28. `feat: add GET /admin/bookings route with adminOnly guard`
29. `feat: mount bookingRoutes in server.js`

### Report Controller + Routes (`backend/controllers/reportController.js`, `backend/routes/reportRoutes.js`)
30. `feat: scaffold reportController`
31. `feat: add createReport handler`
32. `feat: add adminGetReports handler filtering by status`
33. `feat: add resolveReport handler setting resolvedBy and resolvedAt`
34. `feat: add POST /reports and GET /admin/reports routes`
35. `feat: add PATCH /admin/reports/:id/resolve with adminOnly guard`
36. `feat: mount reportRoutes in server.js`

### Analytics Route (`backend/controllers/analyticsController.js`, `backend/routes/analyticsRoutes.js`)
37. `feat: add analytics aggregation — post counts by category`
38. `feat: add flagged post count to analytics aggregation`
39. `feat: add avg report resolution time to analytics pipeline`
40. `feat: add GET /admin/analytics route — aggregate counts no raw data`
41. `feat: mount analyticsRoutes in server.js`

> **Day 3 note:** After Day 3, the full backend is complete. Manual test the full API with Thunder Client or curl before moving to frontend.

---

## ✔ Day 4 — Phase C: Frontend Scaffold + All Pages (React + Vite) (COMPLETE)

**Goal:** Scaffold the React frontend, wire up auth, build all user-facing pages, set up routing and the axios interceptor.

**34 commits:**

### Setup (`client/`)
1. `chore: scaffold Vite React client with npm create vite`
2. `chore: install axios and react-router-dom in client`
3. `chore: add client/node_modules and client dist to .gitignore`
4. `feat: create axios instance with base URL from env`
5. `feat: add JWT request interceptor to axios instance`

### Auth State (`client/src/context/`)
6. `feat: add AuthContext with user state and login/logout actions`
7. `feat: persist JWT to localStorage on login`
8. `feat: rehydrate auth state from localStorage on app load`
9. `feat: add PrivateRoute component redirecting unauthenticated users`
10. `feat: add AdminRoute component redirecting non-admin users`

### Auth Pages (`client/src/pages/`)
11. `feat: add Register page with pseudonym and password fields`
12. `feat: add Login page`
13. `feat: redirect to feed on successful login`
14. `feat: show field-level validation errors on auth forms`

### Post Pages
15. `feat: add PostFeed page listing visible posts`
16. `feat: add category filter tabs on PostFeed`
17. `feat: add CreatePost form with category select and content textarea`
18. `feat: add loading and error states to PostFeed`
19. `feat: show flagged badge on post card for admin users`

### Community Pages
20. `feat: add ThreadList page with category filter`
21. `feat: add CreateThread form`
22. `feat: add ThreadDetail page with replies list`
23. `feat: add CreateReply form on ThreadDetail`
24. `feat: add flag button on reply card`

### Counselor + Booking Pages
25. `feat: add CounselorList page showing verified counselors`
26. `feat: add specialty badges on CounselorCard component`
27. `feat: add BookingForm with requestedTime and notes fields`
28. `feat: show booking confirmation message on submit`

### Routing + Layout
29. `feat: configure BrowserRouter with all route definitions in App.jsx`
30. `feat: add always-visible crisis helpline banner in layout`
31. `feat: add Navbar with conditional links based on auth role`
32. `feat: add 404 Not Found page`
33. `chore: configure Vite proxy to forward /api calls to backend`
34. `feat: add global axios 401 interceptor to redirect to login`

---

## Day 5 — Phase D: Admin Dashboard + Analytics UI + Polish + E2E

**Goal:** Admin dashboard pages, analytics charts (Recharts), upvotes, end-to-end manual test fixes, and final polish.

**35 commits:**

### Admin Pages (`client/src/pages/admin/`)
1. `feat: add AdminDashboard layout with sidebar navigation`
2. `feat: add FlaggedPostsQueue page listing under_review posts`
3. `feat: add status update action on flagged post card`
4. `feat: add ReportsQueue page listing open reports`
5. `feat: add resolve and dismiss actions on report card`
6. `feat: add CounselorVerificationList with verify action`
7. `feat: add AdminBookings page with booking status list`
8. `feat: add admin post delete action on admin feed`

### Analytics UI
9. `chore: install recharts in client`
10. `feat: add AnalyticsView page consuming GET /admin/analytics`
11. `feat: add post counts by category bar chart with Recharts`
12. `feat: add flagged post count metric card`
13. `feat: add avg resolution time metric card`
14. `feat: add category trend line chart`

### Upvotes
15. `feat: add upvote endpoint for threads`
16. `feat: add upvote endpoint for replies`
17. `feat: add upvote button on thread and reply cards`
18. `feat: handle upvote optimistically in UI`

### E2E Fixes (from manual test run)
19. `fix: ensure createPost returns 201 with pseudonym populated`
20. `fix: ensure flagged posts appear in admin queue on creation`
21. `fix: ensure counselor verify returns 404 if counselor not found`
22. `fix: ensure booking rejects requestedTime in the past`
23. `fix: ensure resolveReport sets resolvedAt timestamp`
24. `fix: ensure GET /counselors never returns unverified counselors`
25. `fix: ensure admin analytics returns zero-counts not missing fields`

### UI Polish
26. `feat: add consistent Card component used across all list pages`
27. `feat: add LoadingSpinner component`
28. `feat: add ErrorMessage component`
29. `feat: add empty-state UI on all list pages`
30. `feat: style crisis helpline banner with prominent warning color`
31. `feat: add toast notifications for create, flag, and resolve actions`

### Docs + Cleanup
32. `docs: update README with full API routes table`
33. `docs: add client setup instructions to README`
34. `chore: add concurrently to run backend and client with one command`
35. `chore: remove .gitkeep files from now-populated directories`

---

## API Routes Reference (final state after Day 3)

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/register` | Public | Register pseudonymous user |
| POST | `/auth/login` | Public | Login, returns JWT |

### Posts
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/posts` | User | Create post (keyword-flagged) |
| GET | `/posts` | Public | Visible posts only, pseudonym only |
| GET | `/admin/posts` | Admin | All posts incl. flagged |
| PATCH | `/admin/posts/:id/status` | Admin | Change post status |
| DELETE | `/admin/posts/:id` | Admin | Delete post |

### Threads & Replies
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/threads` | User | Create thread |
| GET | `/threads` | Public | List threads (filter by category) |
| GET | `/threads/:id` | Public | Single thread |
| POST | `/threads/:id/replies` | User | Add reply |
| PATCH | `/replies/:id/flag` | User | Flag a reply |

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

---

## Environment Variables (`.env` — never commit)

```
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<long random secret>
PORT=5000
```

---

## Manual Test Checklist (run after Day 3 backend is complete)

- [ ] Register a user — receive JWT
- [ ] Login with same user — receive JWT
- [ ] Create a post with a risk keyword — confirm `flagged: true` and `status: under_review`
- [ ] GET `/posts` — confirm flagged post is NOT in public feed
- [ ] GET `/admin/posts` (with admin JWT) — confirm flagged post IS visible
- [ ] PATCH `/admin/posts/:id/status` — change to `visible`, confirm public feed now shows it
- [ ] POST a thread, add a reply, flag the reply
- [ ] Register a counselor — confirm `verified: false`
- [ ] Admin verifies counselor — GET `/counselors` shows them now
- [ ] Book a session — confirm in admin bookings
- [ ] Submit a report — confirm in admin reports — resolve it — confirm `resolvedAt` is set
- [ ] GET `/admin/analytics` — confirm counts by category, flagged count, avg resolution time

---

*Plan version: Day 4 complete. Starting Day 5.*
