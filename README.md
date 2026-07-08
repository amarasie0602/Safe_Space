# SafeSpace

A MERN stack anonymous support platform built for a university project.

## Subsystems

1. **Anonymous User & Issue System** — pseudonymous users post about personal struggles under categories (mental health, family, financial, academic, relationships, addiction).
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

## API Routes

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/register` | Public | Register pseudonymous user |
| POST | `/auth/login` | Public | Login, returns JWT |

### Posts
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/posts` | User | Create post (keyword-flagged) |
| GET | `/posts` | Public | Visible posts only, pseudonym only. Paginated: `?page=1&limit=10`, returns `{ posts, page, hasMore, total }` |
| GET | `/admin/posts` | Admin | All posts incl. flagged |
| PATCH | `/admin/posts/:id/status` | Admin | Change post status |
| DELETE | `/admin/posts/:id` | Admin | Delete post |

### Threads & Replies
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/threads` | User | Create thread |
| GET | `/threads` | Public | List threads (filter by category) |
| GET | `/threads/:id` | Public | Single thread |
| PATCH | `/threads/:id/upvote` | User | Upvote a thread |
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
- **Search, sort, pagination**: a search bar with suggestions on the Posts feed, a Most Recent/Most Supported sort, and real backend pagination (`page`/`limit` on `GET /posts`) with a "Load more" button and loading state.
- **Form validation UX**: inline messages for empty content, missing category, and a 500-character limit with a live counter on the post form.
- **Loading & error states**: shimmering skeleton cards while content loads, and a `NetworkError` component with a "Try Again" retry action wherever a fetch can fail.
- **My Activity**: My Posts, My Replies, Saved Posts, and Supported Discussions.
- **Counselor booking**: a counselor profile page and a real multi-step booking flow (Calendar → time slot → confirm → confirmation screen) against the existing `/bookings` endpoint.
- **Dark mode & accessible focus states**: a full dark palette, visible `:focus-visible` outlines on every link/button, and `title` + `aria-label` on icon-only buttons.

### Known limitations (by design, not oversights)

Several of the above are intentionally **browser-local only**, because the backend has no supporting data model for them yet. Each is called out in code comments where implemented:

- **Block User** and **Saved Posts** — stored in `localStorage`; they don't sync across devices or stop a blocked user from seeing you.
- **Supported Discussions** and **My Replies** — also `localStorage`-tracked, since there's no endpoint to query "threads I upvoted" or "replies I've made across every thread."
- **Post "Support" reactions** — client-side only; the `Post` model has no like/reaction field.
- **Counselor availability & reviews** — the booking flow's time slots are generic placeholders (no per-counselor schedule exists yet), and the profile page's Reviews section is an honest "not available yet" placeholder rather than fabricated data.

Turning any of these into real, synced features just needs the corresponding backend model/endpoint — the frontend is already structured to swap the `localStorage` calls for API calls.
