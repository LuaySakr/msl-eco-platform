<<<<<<< HEAD
# Project Changes

## 1. Docker Setup
- Added a `docker-compose.yml` file to run the frontend and backend together.
- Used a lightweight background system (Node.js 18) to keep everything fast.
- Set up "Hot Reloading" so the code changes show up instantly without restarting.
- Kept the same ports as before: 1357 for backend and 2468 for frontend.

## 2. Server Logging
- Added a tool called `morgan` so we can see every request in the console.
- Fixed the server so it actually shows running messages on startup.
- Made it much easier to track down errors and see what the server is doing.

## 3. Connection Fix
- Fixed a bug where the frontend couldn't talk to the backend.
- Added `/api` to the frontend settings to match the backend's path.
- All buttons and data now connect to the server correctly.

## 4. Cleanup & Safety
- Added a `.gitignore` file to keep secret passwords (`.env`) safe.
- Blocked `node_modules` from being uploaded to keep the project clean.
- Added a `.dockerignore` to make the Docker builds faster.

## 5. What's Next (Phase 2)
- **Auth layer**: Implement email/password endpoints (`/register`, `/login`), the backend currently only supports wallet signature 
  login, leaving the existing UI forms non-functional.
- **Persistence**: Replace the in-memory mock data service with a real database 
  (PostgreSQL or MySQL), all registered users and state are lost on every 
  container restart.
- **Data contracts**: Wire the dashboard to real API calls, every chart, 
  holding, and transaction is currently hardcoded in `dashboard.service.ts` 
  and never touches the backend.
=======
# Changes Summary

## 1. Dockerization
- Added `docker-compose.yml` with separate `frontend` (port 2468) and `backend` (port 1357) services
- Used `node:18-alpine` base image for both
- Volume mapping enabled for hot reloading in development

## 2. Observability Baseline
- Set `LOG_LEVEL=info` in backend Docker environment — startup logs were silently suppressed
- Installed `morgan` and wired it into `backend/app.js` — no HTTP requests were being logged at all

## 3. API Path Fix
- Frontend axios `baseURL` was missing the `/api` prefix
- All requests were hitting 404 silently; fixed in `src/services/axios.service.ts`

## 4. Auth Endpoints
- Backend had no email/password auth — only wallet signature login existed
- Implemented `POST /api/v1/auth/register` and `POST /api/v1/auth/login`
- Password hashing via `bcryptjs`; user stored in existing in-memory mock data service
- Fixed frontend call paths in `Register.tsx` and `Login.tsx`

## 5. Hygiene
- Added `.gitignore` — `node_modules/`, `.env`, and `.claude/` were untracked and at risk of being committed

## Known Gaps (Phase 2)
- Registered users are lost on container restart — needs a real database
- Dashboard data is fully hardcoded — `dashboard.service.ts` never calls the backend
- Header shows hardcoded user name ("Bright Mba") — not wired to authenticated user
>>>>>>> fb1d28b (t)
