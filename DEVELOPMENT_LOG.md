# Development Log: MSL Eco Platform

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
