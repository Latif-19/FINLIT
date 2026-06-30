# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm install
npx expo start -c
```

Create a `.env` (gitignored) with:

```
EXPO_PUBLIC_API_URL=http://<your-PC-LAN-IP>:3000/api   # e.g. http://10.84.189.51:3000/api
EXPO_PUBLIC_PAYSTACK_KEY=pk_test_xxx
```

> On a physical phone, use your PC's LAN IP (not `localhost`), and ensure port 3000 is allowed through your firewall. On the iOS simulator, `localhost` works.

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
