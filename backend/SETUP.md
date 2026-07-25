# FinLit Backend — Setup & Run Guide

Spring Boot (Java) monolith that serves the FinLit mobile app. This guide assumes
**zero backend experience** — follow it top to bottom.

---

## What you need installed

| Tool | Status | Notes |
|------|--------|-------|
| Java 25 | ✅ already installed | The language the backend runs on |
| IntelliJ IDEA | ✅ already installed | Where you open & run the backend |
| PostgreSQL 16 | ⬜ install this | The database. Its installer also gives you **pgAdmin** (visual DB viewer) |
| Maven | ❌ not needed | The project includes a "wrapper" (`mvnw`) that handles it automatically |

Download PostgreSQL: https://www.postgresql.org/download/windows
During install: choose a password for the `postgres` user (remember it — you'll set it
as the `DB_PASSWORD` env var below), keep port **5432**, and keep **pgAdmin 4** ticked.

> 🔐 The DB password is **not** stored in the code. Set it as a `DB_PASSWORD`
> environment variable in your IntelliJ run config (Run → Edit Configurations →
> Environment variables → `DB_PASSWORD=your_password`), alongside `GEMINI_API_KEY`.

---

## One-time: create the `finlit` database

The backend connects to a database named `finlit`. Create it once.

### Option A — pgAdmin (visual, recommended for beginners)
1. Open **pgAdmin 4**.
2. Expand **Servers → PostgreSQL 16** (enter your `postgres` password if asked).
3. Right-click **Databases → Create → Database…**
4. Name it **`finlit`** → **Save**.

### Option B — one command (PowerShell)
```powershell
& "C:\Program Files\PostgreSQL\16\bin\createdb.exe" -U postgres finlit
```
(enter your `postgres` password when prompted)

---

## Running the backend

### Easiest — from IntelliJ
1. **File → Open** → select the `backend` folder → Open.
2. Wait for IntelliJ to import the Maven project (progress bar, bottom right).
   It downloads dependencies the first time — give it a minute.
3. Open `src/main/java/com/finlit/FinlitBackendApplication.java`.
4. Click the green ▶ arrow next to `public class FinlitBackendApplication`.

### Alternative — from a terminal (in the `backend` folder)
```bash
./mvnw spring-boot:run       # Git Bash
.\mvnw.cmd spring-boot:run    # PowerShell / CMD
```

---

## How you know it worked

In the console you should see lines like:
```
Tomcat started on port 3000 (http) with context path '/api'
Started FinlitBackendApplication in 3.2 seconds
```

Then open this in a browser:
```
http://localhost:3000/api/health
```
You should see:
```json
{ "status": "ok", "service": "finlit-backend", "time": "..." }
```

That means the backend is alive and talking to the database. 🎉

---

## Configuration reference

All settings live in `src/main/resources/application.properties`:
- **Port / prefix:** `3000` + `/api` — matches the app's API base URL exactly.
- **Database:** `localhost:5432/finlit`, user `postgres`, password from the
  `DB_PASSWORD` environment variable (never hardcoded).
- **Schema:** `ddl-auto=update` — Hibernate builds the tables automatically from the
  Java classes, so you never write schema SQL by hand.

---

## Build roadmap

- [x] **Phase 1 — Skeleton**: project, config, DB connection, `/health`.
- [x] **Phase 2 — User model**: `User` entity + repository.
- [x] **Phase 3 — Auth**: register, login, refresh, JWT + bcrypt, global exception handling.
- [x] **Phase 4 — Content**: lessons + news (entity → repo → dto → service → controller), seeded.
- [x] **Phase 4b — Progress**: dashboard, complete lesson (XP + streak), log savings, assessment scoring.
- [x] **Phase 4c — Gamification**: leaderboard ranking, badges (10, auto-unlock), quiz scoring.
- [x] **Phase 4d — Simulations**: save + history (JSON storage), unlocks Explorer badge.
- [x] **Phase 4e — Notifications**: list (starter seed) + mark-as-read.
- [x] **Phase 4f — Community**: posts, replies, like/unlike toggle (per-user like state).
- [x] **Phase 4g — Tutor**: AI chat proxying Gemini (set GEMINI_API_KEY to enable replies).

**🎉 All 7 feature domains done.**
- [x] **Phase 5 — Full seed**: all 6 modules' quizzes (30 questions) loaded.
- [x] **Phase 6 — Connect the app**: every screen wired to the backend.
  - Auth (register/login/JWT/refresh), Home dashboard, Learn (lessons + quizzes),
    Assessment, Leaderboard, Badges, Simulations, Community, Notifications, Tutor.
  - Each call has an offline fallback; frontend type-checks with 0 errors.

**🎉 FinLit is fully connected — frontend ↔ Spring Boot ↔ PostgreSQL.**

## Enabling the AI Tutor
The tutor needs a Google Gemini API key. In IntelliJ:
Run → Edit Configurations → FinlitBackendApplication → Environment variables →
add `GEMINI_API_KEY=your_key_here`. Without it, `/tutor/chat` returns 503 (everything
else works fine).
- [ ] **Phase 5 — Full seed data**: load the complete lesson/quiz/news catalog.
- [ ] **Phase 6 — Connect the app**: point the frontend at the backend, replace mock data.

## Endpoints available so far

Public:
- `GET  /api/health`
- `POST /api/auth/register` · `POST /api/auth/login` · `POST /api/auth/refresh` · `POST /api/auth/forgot-password`

Require `Authorization: Bearer <token>`:
- `GET  /api/lessons` · `GET /api/lessons/{id}`
- `GET  /api/news` · `GET /api/news/{id}`

## Tip: always Stop before Re-running
In IntelliJ, click the red ■ **Stop** before running again, or the old server keeps
port 3000 and the new one can't start ("Port 3000 was already in use").
