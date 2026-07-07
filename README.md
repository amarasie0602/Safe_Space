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
