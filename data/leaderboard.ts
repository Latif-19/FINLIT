// Mock leaderboard data — will be replaced by GET /api/gamification/leaderboard
import { LeaderboardEntry } from "@/types/api";

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { userId: "u1", name: "Kwame Asante", avatar: "🧑‍💻", xp: 2450, rank: 1 },
  { userId: "u2", name: "Ama Mensah", avatar: "👩‍🎓", xp: 2180, rank: 2 },
  { userId: "u3", name: "Kofi Darko", avatar: "🧑‍💼", xp: 1920, rank: 3 },
  { userId: "u4", name: "Efua Owusu", avatar: "👩‍🔬", xp: 1750, rank: 4 },
  { userId: "u5", name: "Yaw Boateng", avatar: "🧑‍🏫", xp: 1600, rank: 5 },
  { userId: "u6", name: "Abena Osei", avatar: "👩‍⚕️", xp: 1420, rank: 6 },
  { userId: "u7", name: "Kwesi Appiah", avatar: "🧑‍🎨", xp: 1300, rank: 7 },
  { userId: "u8", name: "Adwoa Frimpong", avatar: "👩‍🍳", xp: 1150, rank: 8 },
  { userId: "u9", name: "Nana Agyeman", avatar: "🧑‍🔧", xp: 980, rank: 9 },
  { userId: "u10", name: "Akwasi Sarpong", avatar: "🧑‍🚀", xp: 820, rank: 10 },
];
