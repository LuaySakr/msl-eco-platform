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
