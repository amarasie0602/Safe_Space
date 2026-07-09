# Contributing to SafeSpace

Thanks for your interest in improving SafeSpace — an anonymous peer-support platform built as a university project. Contributions of any size are welcome, from fixing a typo to proposing a new subsystem.

## Getting started

1. Fork the repo and clone your fork.
2. Install dependencies and set up your environment (see the [root README](README.md) for the full setup, including `backend/.env`).
3. Run the app locally with `npm run dev` from the repo root, or run `backend` and `client` separately.
4. Create a branch off `main` for your change: `git checkout -b your-feature-name`.

## Project layout

- `backend/` — Express + MongoDB API. See `backend/README.md` for its structure (`models/`, `routes/`, `controllers/`, `middleware/`, `scripts/`).
- `client/` — React (Vite) frontend. See `client/README.md`.
- `BUILDPLAN.md` — the original design document for subsystems, data models, and roles. Useful background before touching auth, moderation, or the counselor flow.

## Making a change

- Keep changes focused — a bug fix shouldn't carry unrelated refactors.
- Match the existing code style in the file you're editing rather than introducing a new pattern.
- If you touch the API, update the route table in `README.md` to match.
- If you change the category taxonomy, seed data, or schemas, run `npm run seed` in `backend/` against a dev database and confirm the app still works end to end.
- Role checks (`user` / `moderator` / `admin` / `counselor`) belong in backend middleware, never only in the frontend.

## Submitting a pull request

1. Make sure the app still runs (`npm run dev`) and, for frontend changes, that you've clicked through the affected flow in a browser.
2. Run `npm test` in `backend/` and `client/` — see [Testing](README.md#testing) in the root README.
3. Write a clear PR description: what changed and why, and any manual testing you did.
4. Keep PRs scoped to one topic where possible — it makes review faster.

## Reporting bugs or proposing features

Open a GitHub issue with:
- What you expected to happen vs. what happened (for bugs), including steps to reproduce.
- For feature proposals, the problem you're trying to solve before jumping to a specific solution.

## Code of conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful — SafeSpace exists to support people sharing personal struggles, and that spirit should carry into how we collaborate on it too.
