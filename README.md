# FinLit — Financial Literacy Mobile App 🦉

A mobile app that teaches personal finance to Ghanaian students, young professionals, and informal-sector workers — through bite-sized lessons, quizzes, real-world simulations, gamification, a community forum, and an AI tutor.

Built for **KNUST CodeQuest 2026**.

---

## ✨ Features

- **Structured learning modules** — MoMo budgeting, digital debt, Treasury Bills, pensions & SSNIT, student loans, campus side-hustles
- **Interactive simulations** — MoMo fees, T-Bill yields, loan interest, PAYE tax, inflation (with real Ghanaian rates)
- **Quizzes & assessment** — end-of-module quizzes and an onboarding assessment that builds a personalised learning path
- **Gamification** — XP, streaks, 10 unlockable badges, and a live leaderboard
- **Community forum** — post questions, reply, and like
- **AI Tutor** — a Gemini-powered coach that answers Ghanaian personal-finance questions
- **News feed** — curated local financial news
- **Premium tier** — unlocked via Paystack payment

---

## 🧱 Tech Stack

| Layer        | Technology                                                                           |
| ------------ | ------------------------------------------------------------------------------------ |
| **Frontend** | React Native (Expo SDK 54) + TypeScript, Expo Router, NativeWind (Tailwind), Zustand |
| **Backend**  | Spring Boot 4 (Java 21+), Spring Web, Spring Security, Spring Data JPA               |
| **Database** | PostgreSQL                                                                           |
| **Auth**     | JWT (access + refresh) with bcrypt password hashing                                  |
| **AI**       | Google Gemini (`gemini-flash-latest`), proxied server-side                           |
| **Payments** | Paystack                                                                             |

---

## 📁 Repository Structure

```
FinLit-v2/
├── app/               # Expo Router screens (the mobile app)
├── components/ services/ store/ data/ types/   # frontend modules
├── backend/           # Spring Boot API (see backend/SETUP.md)
│   └── src/main/java/com/finlit/
│       ├── auth/  content/  progress/  gamification/
│       ├── simulation/  community/  notification/  tutor/  user/
│       └── common/    # shared exceptions + global handler
└── README.md
```

The app talks to the backend over a shared API client (`services/api.ts`) that attaches the JWT and auto-refreshes on 401.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** + npm and the **Expo Go** app on your phone
- **Java 21+** (the backend uses the Maven wrapper, so no separate Maven install)
- **PostgreSQL 16** (create an empty database named `finlit`)

### 1. Backend (Spring Boot)

See **[`backend/SETUP.md`](backend/SETUP.md)** for full details. In short:

```bash
cd backend
# set env vars first (see below), then:
./mvnw spring-boot:run        # or run FinlitBackendApplication in IntelliJ
```

Required environment variables (set them in your IntelliJ run config):

| Variable         | Purpose                                                                              |
| ---------------- | ------------------------------------------------------------------------------------ |
| `DB_PASSWORD`    | your local PostgreSQL password                                                       |
| `GEMINI_API_KEY` | Google AI Studio key — enables the AI Tutor (optional; falls back to canned answers) |

The API runs on **`http://localhost:3000/api`**.

### 2. Frontend (Expo)

```bash
npm install
npx expo start -c
```

Create a `.env` (gitignored) with:

```
EXPO_PUBLIC_API_URL=http://<your-PC-LAN-IP>:3000/api   # e.g. http://10.84.189.51:3000/api
EXPO_PUBLIC_PAYSTACK_KEY=pk_test_xxx
```

> On a physical phone, use your PC's LAN IP (not `localhost`), and ensure port 3000 is allowed through your firewall. On the iOS simulator, `localhost` work.

---

## 🔌 API Overview

All routes are under `/api`. Public: `/health`, `/auth/**`. Everything else requires a Bearer token.

- **Auth** — `POST /auth/register · /login · /refresh · /forgot-password`
- **Content** — `GET /lessons · /lessons/{id} · /news · /news/{id}`
- **Progress** — `GET /progress`, `POST /progress/lesson · /savings · /assessment`
- **Gamification** — `GET /gamification/leaderboard · /badges`, `POST /gamification/quiz-score`
- **Simulations** — `POST /simulations/save`, `GET /simulations/history`
- **Community** — `GET/POST /community/posts`, `POST /community/posts/{id}/like · /replies`
- **Notifications** — `GET /notifications`, `POST /notifications/{id}/read`
- **Tutor** — `POST /tutor/chat`
- **Profile** — `GET/PUT /profile`, `POST /profile/premium`

---

## 👥 Team — Group 100, KNUST

Melchizedek Bright Kafui Attubrah · Antwi Jeffter Boakye · Abdul Latif Habib Hassim · Dapaah Lawrence · Amankwah Kwabena Owusu
