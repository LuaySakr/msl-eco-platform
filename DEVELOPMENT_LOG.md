# Development Log: MSL Eco Platform

<<<<<<< HEAD
## 1. Project Hygiene & Security Baseline
**Rationale**: Established a security-first foundation by preventing the leakage of environmental secrets (`.env`), massive dependency trees (`node_modules/`), transient build artifacts (`dist/`, `build/`), and OS-specific metadata (`.DS_Store`). This ensures a clean repository state and protects infrastructure integrity from the outset.

---

## 2. Infrastructure Orchestration & Standardization
**Rationale**: Transitioned the application to a containerized orchestration model using Docker Compose. 
- **Deterministic Builds**: Eliminated local environment drift by standardizing dependency parity using `node:18-alpine`.
- **Developer UX**: Enabled instant code updates (Hot Reloading) via Docker volumes. This allows local changes to sync immediately without requiring a full container rebuild.
- **Service Decoupling**: Separated Frontend and Backend logic into discrete, independently scalable services while preserving legacy port mappings (Backend: `1357`, Frontend: `2468`).

---

## 3. System Visibility & Logging
**Rationale**: Improved backend transparency to ensure we can see what the server is doing in real-time.
- **Request Logging**: Following industry best practices, I integrated `morgan` middleware. This gives us instant visibility into every HTTP request, which is critical for debugging.
- **Log Verbosity**: Standardized the `LOG_LEVEL` settings so the server now provides helpful startup and error information instead of remaining silent.

---

## 4. Endpoint Alignment & Connectivity
**Rationale**: Resolved a systematic routing misalignment where the frontend was failing to resolve API calls.
- **Path Standardization**: Harmonized the frontend `axios` instance with the backend's route mounting by appending the mandatory `/api` suffix to the `baseURL`.

---

## 5. Engineering Audit: Persona & Security Analysis
**Objective**: Post-initialization analysis of the platform's functional and logical state.

### Persona Conflict
Identified a significant architectural misalignment:
- **Data Privacy**: The dashboard currently shows private information (like holdings and transactions) to everyone, even if they aren't logged in yet.
- **Role Ambiguity**: The dashboard mixes global platform metrics (e.g., "Total Users") with personal data (e.g., "My Portfolio"). This makes it unclear whether the current view is intended for a Public Admin or a Private User.
- **Auth Gap**: The frontend utilizes a legacy Email/Password UI, while the backend exclusively expects Wallet Signatures. Strategic alignment is flagged for Phase 2.

### Technical Debt Assessment
- **Resource Integrity**: Core strategic documents (LitePaper) and some internal links lead to 404s.
- **Placeholder Implementation**: Critical UI controls like "Filter Period" are currently visual-only components lacking underlying business logic.

---
=======
## Phase 1: Dockerization and Standardization

### Objective
I decided to implement Docker Compose to standardize the build and deployment process across all environments. The goal is to eliminate the "works on my machine" problem and provide a consistent, repeatable setup for any developer or deployment target.

### Why Docker?
- **Consistency**: By using containers, I ensure that the application runs in the exact same environment regardless of the host OS (Linux, macOS, Windows).
- **Isolation**: Each component (frontend, backend) runs in its own isolated environment with its own dependencies, preventing conflicts.
- **Ease of Setup**: New developers can get the entire project running with a single command (`docker-compose up --build`) without manually installing Node.js, setting up environment variables, or managing separate terminal windows.
- **Portability**: The images I build can be deployed directly to cloud providers (AWS, GCP, Azure) or Kubernetes with minimal changes.

### Key Decisions and Rationale

#### 1. Multi-Container Architecture
I chose to separate the frontend and backend into distinct services within `docker-compose.yml`. This allows for better resource management, independent logs, and the ability to scale or replace components easily in the future.

#### 2. Preserving Existing Port Configuration
I maintained the backend on port `1357` and the frontend on port `2468`, as specified in the original project documentation (`README.md`). 
- **Reason**: To ensure backward compatibility for any existing scripts or users who are using these specific ports.

#### 3. Development Mode with Hot Reloading
Instead of a static production build (e.g., serving via Nginx), I configured the Docker setup to run in development mode with volume mapping.
- **Reason**: To allow for a seamless developer experience. By mapping local directories to the container, any code changes I make are instantly reflected via Hot Module Replacement (HMR) without needing to rebuild the container.

#### 4. Specialized Base Image
I selected `node:18-alpine` as the base image for both containers.
- **Reason**: Alpine Linux is extremely lightweight, which reduces build times and minimizes the security attack surface, while Node.js 18 provides the modern features required by our dependencies.

#### 5. Frontend-Backend Communication
I configured the `REACT_APP_BACKEND_URL` environment variable within the `docker-compose.yml` to point to `http://localhost:1357`.
- **Reason**: Since the frontend is accessed through the user's browser, the API calls must point to the host's `localhost` where the backend port is exposed.

---
### Update: April 10, 2026 - First Successful Run
I verified the logs after the initial `docker compose up --build`. Both containers are healthy:
- Backend is confirmed listening on port 1357.
- Frontend compiled successfully on port 2468.
- Confirmed that Web3-related source map warnings in the frontend are expected and non-blocking.

---
### Update: April 10, 2026 - Critical UI/UX Audit & Persona Analysis

I performed a deep dive into the Dashboard logic and identified a significant "Identity Crisis" in the current implementation. While the UI is "working" (rendering), it is not yet "functional" or logically sound.

#### 1. The Persona Conflict (Admin vs. User)
The current dashboard is a hybrid that fails to distinguish between different user journeys:
- **The Admin/Public View**: The "Basic Statistics" (Active Users, Total Volume) are platform-level metrics. Displaying these alongside personal holdings on a default landing page is confusing.
- **The Private User View**: "My Portfolio," "Holdings," and "Transactions" are private data. 
- **The Logic Gap**: These private sections are currently visible to guests without login or wallet connection, which is a major security and UX flaw.

#### 2. Logical Inconsistencies
- **Ghost Transactions**: The "Transactions" and "Portfolio" sections are populated with hardcoded mock data (`dashboard.service.ts`) regardless of the user's actual state (logged in or not).
- **Premature Data**: Showing "My Holdings" before a wallet is connected makes the "Connect Wallet" button feel like an afterthought rather than a prerequisite.


---

---
### Update: April 10, 2026 - Initial UI/UX Testing Results

I performed a manual walkthrough of the dashboard to test link integrity and basic button functionality:

#### 1. Successes (Working components)
- **Modals**: Both the **Register/Login** and **Connect Wallet** buttons successfully trigger their respective popup windows.
- **Social Integration**: All social media links in the footer (Twitter, Discord, Telegram, etc.) are correctly mapped and functional.

#### 2. Identified Issues (Broken/Inactive features)
- **Broken Links**: Some key resources, such as the **LitePaper**, are currently broken or lead to inactive paths.
- **Inactive Controls**: The **Filter Periode** button in the main dashboard header is purely visual and does not yet trigger any filtering logic or dropdown.


---
### Update: April 10, 2026 - Observability Investigation: Why the Backend Is Silent

After verifying both containers were healthy, I noticed something critical: **no backend logs appeared in `docker compose logs` when the frontend was used** — no request lines, no response codes, nothing. I investigated the root cause systematically.

#### Finding 1: `LOG_LEVEL` defaults to `'error'` — startup messages are suppressed

I traced this to `backend/utils/logger.js`. The logger defaults to `'error'` level unless `LOG_LEVEL` is explicitly set in the environment:

```js
const currentLevel = (process.env.LOG_LEVEL || 'error').toLowerCase();
```

The `docker-compose.yml` does not set `LOG_LEVEL`, which means `logger.info()` calls — including the "Server listening on port 1357" startup message — are silently swallowed. The backend appears to start, but produces no output.

#### Finding 2: No HTTP request logging middleware

I inspected `backend/app.js` and confirmed there is **no request logging middleware** (no Morgan, no custom logging). Every incoming HTTP request is processed and responded to in complete silence. There is no way to observe that the backend was called at all from the logs.

#### Finding 3: The frontend barely calls the backend

I audited `src/services/dashboard.service.ts` and found that **every function returns hardcoded mock data**. There are no `getApi()` or `postApi()` calls — the entire dashboard renders without ever touching the backend. The only real API calls would come from authentication flows, which fail silently because of the next finding.

#### Finding 4: URL path mismatch — frontend missing `/api` prefix

The frontend axios client (`src/services/axios.service.ts`) sets `baseURL` to `http://localhost:1357`. However, the backend mounts all routes under `/api` in `backend/app.js`:

```js
app.use('/api', routes);
```

This means the correct path for login is `http://localhost:1357/api/v1/auth/login-signature`, but the frontend calls `/v1/auth/login-signature` — missing the `/api` prefix entirely. All auth requests are silently hitting a 404.

#### Summary of Issues Found

| # | Issue | File | Impact |
|---|-------|------|--------|
| 1 | `LOG_LEVEL` not set in Docker | `docker-compose.yml` | Startup logs suppressed |
| 2 | No HTTP request logger | `backend/app.js` | Requests are invisible |
| 3 | All dashboard data is hardcoded | `src/services/dashboard.service.ts` | Backend never reached from dashboard |
| 4 | Frontend missing `/api` prefix in base URL | `src/services/axios.service.ts` | All auth requests return 404 |

I will now fix these one by one.

---
### Fix #1: April 10, 2026 - Set `LOG_LEVEL=info` in Docker Compose

**Problem**: The backend logger defaults to `'error'` level, suppressing all `info`-level messages including the server startup confirmation.

**Fix**: Added `LOG_LEVEL=info` to the backend service environment in `docker-compose.yml`.

```yaml
environment:
  - NODE_ENV=development
  - LOG_LEVEL=info
```

**Result**: The backend will now emit startup logs (`[INFO] Server listening on port 1357`, `[INFO] Environment: development`) and any other `info`-level messages from the application code — visible directly in `docker compose logs backend`.

---
### Fix #2: April 10, 2026 - Add HTTP Request Logging (Morgan)

**Problem**: The backend had no HTTP request logging middleware. Every incoming request was processed in complete silence — no method, path, status code, or response time was ever emitted to the logs. This made it impossible to confirm whether the frontend was actually reaching the backend.

**Fix**: Installed `morgan` and wired it into `backend/app.js` after the CORS and body-parser middleware:

```js
const morgan = require('morgan');
// ...
app.use(morgan('dev'));
```

**Lesson learned during implementation**: The `docker-compose.yml` volume configuration mounts an anonymous Docker volume at `/app/node_modules` inside the container. This volume persists between rebuilds and shadows the image's own `node_modules`. Installing a new package on the host was not enough — the old volume had to be destroyed with `docker compose down -v` before the newly built image's `node_modules` (which include `morgan`) could take effect.

**Result**: Every request is now logged to stdout with method, path, status code, and response time. Confirmed working:

```
GET / 200 5.041 ms
```

---
### Fix #3: April 10, 2026 - Fix Frontend Missing `/api` Prefix

**Problem**: The frontend axios client in `src/services/axios.service.ts` was configured with `baseURL: http://localhost:1357`. However, the backend mounts all routes under `/api` in `app.js`:

```js
app.use('/api', routes);
```

This meant every frontend API call was missing the `/api` prefix. For example, the login request was going to `POST /auth/login` instead of `POST /api/v1/auth/login-signature` — landing on the backend's 404 handler every time, silently.

The Morgan logs from Fix #2 made this immediately visible:
```
POST /auth/login 404 2.019 ms
```

**Fix**: Appended `/api` to the base URL construction in `src/services/axios.service.ts`:

```ts
const http = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL || "http://localhost:1357"}/api`,
});
```

**Result**: All frontend API calls now route correctly into the backend. Confirmed with a health check:
```
GET /api/v1/healthz 200 0.540 ms
```

---
### Fix #4: April 10, 2026 - Implement Email/Password Register & Login

**Problem**: The frontend Register and Login forms were calling endpoints that did not exist in the backend:
- `POST /api/auth` (register) → 404
- `POST /api/auth/login` (login) → 404

The backend's v1 auth system was designed exclusively around blockchain wallet signatures (`POST /api/v1/auth/login-signature`). There were no email/password endpoints at all. The frontend forms were calling wrong paths on top of missing routes — a double failure.

**Root cause of path mismatch**: The frontend was calling `/auth` and `/auth/login`, skipping the `/v1/` version prefix used by all other backend routes.

**Fix implemented**:

1. Installed `bcryptjs` for secure password hashing (pure JS, no native bindings — safe for Alpine Docker images)
2. Added `getUserByEmail()` and `createEmailUser()` to `backend/services/mockData.service.js` to support email-based user lookup and creation
3. Added `register` and `login` controller methods to `backend/controllers/auth.controller.js`:
   - `register`: validates input, checks for duplicate email, hashes password with bcrypt (10 rounds), creates user, returns JWT
   - `login`: looks up user by email, verifies password with bcrypt, returns JWT
4. Added `POST /register` and `POST /login` routes to `backend/routes/auth.routes.js` under the existing `/v1/auth` prefix
5. Fixed frontend paths:
   - `Register.tsx`: `/auth` → `/v1/auth/register`
   - `Login.tsx`: `/auth/login` → `/v1/auth/login`

**Confirmed working**:
```
POST /api/v1/auth/register 200 113ms
POST /api/v1/auth/login    200 150ms
```

**Note**: User data is stored in-memory only (mock data service). Registered users will be lost on container restart. This is acceptable for the current demo state — a real database would be phase 2.

---
### Fix #5: April 10, 2026 - Add `.gitignore`

**Problem**: The repository had no `.gitignore` file. Running `git status` showed that `backend/node_modules/`, `.env`, and `.claude/` were all untracked — at risk of being accidentally committed.

**Fix**: Created `.gitignore` covering:
- `node_modules/` and `backend/node_modules/` — dependency folders, should never be in version control
- `.env` and variants — contains secrets (API keys, JWT secrets)
- `build/` and `dist/` — generated output
- `.claude/` — local AI assistant session data
- OS and IDE artifacts (`.DS_Store`, `.vscode/`, etc.)

---
*Log started on April 10, 2026*
>>>>>>> d04cdc0 (t)
