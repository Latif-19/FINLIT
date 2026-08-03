# FinLit backend

The FinLit backend is a Spring Boot 4.1 REST API for the FinLit mobile app. It provides authentication, learning content, progress tracking, gamification, simulations, community features, notifications, profiles, and an AI tutor.

## Technology

- Java 21 and Spring Boot 4.1
- PostgreSQL with Spring Data JPA/Hibernate
- Spring Security, stateless JWT authentication, and BCrypt password hashing
- Maven Wrapper (`mvnw` / `mvnw.cmd`)

## Run locally

1. Install Java 21 and PostgreSQL.
2. Create a PostgreSQL database named `finlit`.
3. Set `DB_PASSWORD` to the password for the local `postgres` user.
4. From this directory, run:

```powershell
.\mvnw.cmd spring-boot:run
```

The API starts at `http://localhost:3000/api`. Confirm it is available:

```http
GET /api/health
```

```json
{ "status": "ok", "service": "finlit-backend", "time": "..." }
```

For more detailed local PostgreSQL and IntelliJ setup steps, see [SETUP.md](SETUP.md).

## Configuration

Configuration lives in `src/main/resources/application.properties`. Secrets should be supplied through environment variables or an untracked `secrets.properties` file.

| Variable | Purpose | Local default |
| --- | --- | --- |
| `PORT` | HTTP server port | `3000` |
| `DB_PASSWORD` | PostgreSQL password | empty |
| `APP_JWT_SECRET` | Secret used to sign JWTs | development-only value |
| `MAIL_HOST`, `MAIL_PORT` | SMTP server | Gmail / `587` |
| `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM` | Email sender credentials/details | empty / FinLit sender |
| `GEMINI_API_KEY` | Enables the AI tutor | empty |
| `GEMINI_MODEL` | Gemini model name | `gemini-flash-latest` |
| `GEMINI_THINKING_BUDGET` | Tutor reasoning budget | `128` |

Never use the bundled JWT fallback in production. Configure a long, random `APP_JWT_SECRET`, production database credentials, and SMTP credentials instead.

## Authentication

`/api/health` and every `/api/auth/**` route are public. Every other route requires:

```http
Authorization: Bearer <access-token>
```

Access tokens expire after 24 hours. Refresh tokens expire after 30 days. Passwords are stored as BCrypt hashes. Authentication is stateless: the API does not create server sessions.

## API reference

Unless marked **Public**, endpoints require the bearer token above. Request bodies are JSON.

### Health

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/health` | Public | Service health check. |

### Authentication

| Method | Path | Description |
| --- | --- | --- |
| POST | `/auth/register` | Creates an account and sends a verification code. |
| POST | `/auth/verify-email` | Verifies an email address and returns tokens. |
| POST | `/auth/resend-code` | Sends another verification code when applicable. |
| POST | `/auth/login` | Authenticates a verified account and returns tokens. |
| POST | `/auth/refresh` | Exchanges a refresh token for a new token response. |
| POST | `/auth/forgot-password` | Requests a password-reset email when applicable. |

```json
// POST /auth/register
{ "name": "Ada Mensah", "email": "ada@example.com", "password": "six-or-more-characters" }

// POST /auth/verify-email
{ "email": "ada@example.com", "code": "123456" }

// POST /auth/login
{ "email": "ada@example.com", "password": "six-or-more-characters" }

// POST /auth/refresh
{ "refreshToken": "<refresh-token>" }
```

`/auth/resend-code` and `/auth/forgot-password` each receive `{ "email": "ada@example.com" }`. Registration, login, and verification validate inputs; passwords must contain at least six characters and verification codes must contain exactly six digits.

### Learning content

| Method | Path | Description |
| --- | --- | --- |
| GET | `/lessons` | Lists learning modules. |
| GET | `/lessons/{id}` | Retrieves one learning module. |
| GET | `/news` | Lists news articles, newest first. |
| GET | `/news/{id}` | Retrieves one article. |

### Progress

| Method | Path | Description |
| --- | --- | --- |
| GET | `/progress` | Retrieves the authenticated user's dashboard progress. |
| POST | `/progress/lesson` | Marks a lesson complete and updates progress. |
| POST | `/progress/savings` | Records a positive savings amount. |
| POST | `/progress/assessment` | Submits assessment answers and a financial goal. |

```json
// POST /progress/lesson
{ "lessonId": 1 }

// POST /progress/savings
{ "amount": 50.0 }

// POST /progress/assessment
{ "answers": [1, 2, 3], "goal": "Build an Emergency Fund" }
```

### Gamification

| Method | Path | Description |
| --- | --- | --- |
| GET | `/gamification/leaderboard` | Returns leaderboard data including the current user. |
| GET | `/gamification/badges` | Lists the current user's badges. |
| POST | `/gamification/quiz-score` | Submits answers for a module quiz. |

The quiz request includes a `moduleId` and a non-empty `answers` list. Each answer uses the `QuizAnswerDto` shape expected by the client and backend.

### Simulations

| Method | Path | Description |
| --- | --- | --- |
| POST | `/simulations/save` | Saves a simulator run. |
| GET | `/simulations/history` | Lists the current user's saved runs. |

```json
// POST /simulations/save
{
  "type": "savings",
  "parameters": { "monthlyContribution": 100 },
  "result": { "projectedBalance": 1200 }
}
```

### Community

| Method | Path | Description |
| --- | --- | --- |
| GET | `/community/posts` | Lists posts with the authenticated user's like state. |
| POST | `/community/posts` | Creates a post. Returns `201 Created`. |
| POST | `/community/posts/{postId}/like` | Toggles the current user's like on a post. |
| POST | `/community/posts/{postId}/replies` | Adds a reply to a post. |

```json
// POST /community/posts
{ "category": "Savings", "content": "How do you track weekly spending?" }

// POST /community/posts/{postId}/replies
{ "content": "I review mine every Sunday." }
```

Post and reply content are required and limited to 2,000 characters.

### Notifications, profile, and tutor

| Method | Path | Description |
| --- | --- | --- |
| GET | `/notifications` | Lists the user's notifications. |
| POST | `/notifications/{id}/read` | Marks one notification as read. |
| GET | `/profile` | Retrieves the authenticated user's profile. |
| PUT | `/profile` | Updates name, avatar, age, and phone. |
| POST | `/profile/premium` | Activates premium after payment processing. |
| POST | `/tutor/chat` | Sends a message and optional conversation history to the AI tutor. |

```json
// PUT /profile
{ "name": "Ada Mensah", "avatar": "🦉", "age": "25", "phone": "+233000000000" }

// POST /tutor/chat
{ "message": "How do I make a savings budget?", "history": [] }
```

The tutor returns `503 Service Unavailable` when `GEMINI_API_KEY` is not configured.

## Errors

Validation errors and application exceptions are formatted by the global exception handler. Requests without a valid bearer token receive JSON with HTTP `401 Unauthorized`. Typical errors include `400` for invalid request data, `401` for missing/invalid authentication, `404` for missing resources, and `409` for conflicts such as an already-registered account.

## Project structure

```text
src/main/java/com/finlit/
  auth/           Registration, verification, login, refresh, and email flows
  config/         JWT and Spring Security configuration
  content/        Lessons and news
  progress/       Progress, savings, lessons, and assessment scoring
  gamification/   Leaderboard, badges, and quiz scoring
  simulation/     Saved simulator runs
  community/      Posts, replies, and likes
  notification/   User notifications
  tutor/          Gemini-backed AI tutor
  user/           Current-user profile management
  common/         Health endpoint and shared error handling
```

## Build and test

```powershell
.\mvnw.cmd test
.\mvnw.cmd package
```
