import { router, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/useUserStore";
import { progressService } from "../../services/progress";
import { contentService } from "../../services/content";
import { categoryMeta, mapBackendNews, type Article } from "@/data/news";
import { AVATAR_OPTIONS } from "@/data/avatars";
import { getSmartRecommendations, SmartRecommendation } from "@/data/recommendations";
import { useThemeColors } from "../../hooks/useThemeColors";

function formatDuration(totalSeconds: number): string {
  const totalMinutes = Math.round(totalSeconds / 60);
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

const isImageUri = (str?: string | null) => {
  if (!str) return false;
  return (
    str.startsWith("http") ||
    str.startsWith("file:") ||
    str.startsWith("content:") ||
    str.startsWith("data:") ||
    str.includes("/")
  );
};

/** How many articles the dashboard mini-feed shows. */
const NEWS_PREVIEW_COUNT = 3;

/**
 * Offline fallback only — the real articles come from GET /news on focus.
 * Category chip colours are looked up via categoryMeta() rather than stored
 * per item, so these can't drift from what the News tab renders.
 */
const HOME_NEWS_PREVIEW: Article[] = [
  {
    id: 1,
    title: "Bank of Ghana Adjusts Monetary Policy Rate to Curb Inflation",
    source: "Bank of Ghana",
    sourceUrl: "",
    category: "Policy",
    time: "2h ago",
    readTime: "3 min read",
    image: "https://picsum.photos/seed/bog-monetary-policy/800/450",
    summary: "The MPC revised the policy rate to manage inflation, affecting deposit yields and loan costs.",
    paragraphs: [],
  },
  {
    id: 2,
    title: "E-Levy & MoMo Fees: 3 Strategies to Save on Transfers",
    source: "Joy Business",
    sourceUrl: "",
    category: "Fintech",
    time: "5h ago",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/momo-elevy-ghana/800/450",
    summary: "How mobile money charges affect your daily cash flow and tips to reduce transfer costs.",
    paragraphs: [],
  },
  {
    id: 3,
    title: "T-Bills Explained: Ghana's Safest Investment in 2026",
    source: "Ghana Stock Exchange",
    sourceUrl: "",
    category: "Investing",
    time: "1d ago",
    readTime: "5 min read",
    image: "https://picsum.photos/seed/tbills-gse-invest/800/450",
    summary: "A beginner's guide to Treasury Bills, current yields, and how to buy them via mobile money.",
    paragraphs: [],
  },
];

export default function HomeScreen() {
  const colors = useThemeColors();

  const userName = useUserStore((s) => s.name);
  const score = useUserStore((s) => s.score);
  const avatar = useUserStore((s) => s.avatar);
  const xp = useUserStore((s) => s.xp);
  const lessonsCompleted = useUserStore((s) => s.lessonsCompleted);
  const totalTimeSpentSeconds = useUserStore((s) => s.totalTimeSpentSeconds);
  const userGoal = useUserStore((s) => s.goal);
  const streak = useUserStore((s) => s.streak);

  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  // Live news for the mini-feed, falling back to the bundled preview when
  // offline — the same pattern the News tab uses, so the two agree.
  const [newsPreview, setNewsPreview] = useState<Article[]>(HOME_NEWS_PREVIEW);

  // Pull the real dashboard (XP, streak, lessons, badges) from the backend
  // every time this screen comes into focus, and sync it into the store.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      progressService
        .getProgress()
        .then((res) => {
          if (active) useUserStore.getState().applyProgress(res.data);
        })
        .catch(() => {
          // Offline or server down — keep whatever is already in the store.
        });

      contentService
        .getNews()
        .then((res) => {
          if (active && Array.isArray(res.data) && res.data.length > 0) {
            setNewsPreview(mapBackendNews(res.data).slice(0, NEWS_PREVIEW_COUNT));
          }
        })
        .catch(() => {
          // Offline — keep the bundled preview articles.
        });

      return () => {
        active = false;
      };
    }, [])
  );

  const handleAvatarSelect = (char: string) => {
    useUserStore.getState().setAvatar(char);
    setAvatarModalOpen(false);
  };

  const smartRecs = getSmartRecommendations();

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <ScrollView
      className="flex-1 bg-brand-slateBg"
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── PREMIUM HEADER BLOCK ── */}
      <View className="bg-brand-navy pt-16 pb-10 px-6 rounded-b-[40px] shadow-lg shadow-brand-navy/15">
        <View className="flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <Text className="text-brand-gold text-[10px] font-inter-semibold uppercase tracking-widest">
              {getGreeting()}
            </Text>
            <Text
              className="text-brand-textOnDark text-[32px] font-inter-bold mt-1 tracking-tight"
              numberOfLines={1}
            >
              Hi, {userName.split(" ")[0]}! 👋
            </Text>
          </View>

          <Pressable
            onPress={() => setAvatarModalOpen(true)}
            style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.95 : 1 }] })}
            className="w-16 h-16 bg-brand-border/40 rounded-2xl items-center justify-center border-2 border-brand-border/80 shadow-sm overflow-hidden"
          >
            {isImageUri(avatar) ? (
              <Image source={{ uri: avatar }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <Text className="text-3xl">{avatar}</Text>
            )}
            <View className="absolute -bottom-1 -right-1 bg-brand-emerald w-5 h-5 rounded-full items-center justify-center border border-brand-navy">
              <Ionicons name="pencil" size={10} color={colors.bg} />
            </View>
          </Pressable>
        </View>

        {/* User Badges Row */}
        <View className="mt-6 flex-row flex-wrap items-center gap-2">
          <View className="px-3.5 py-1.5 rounded-2xl bg-brand-border/30 border border-brand-border/20 flex-row items-center">
            <Ionicons name="ribbon" size={13} color={colors.gold} />
            <Text className="text-brand-textOnDark text-[10px] font-inter-semibold uppercase tracking-wider ml-1.5">
              {score >= 13
                ? "Wealth Builder Pro"
                : score >= 8
                ? "Smart Manager"
                : "Novice Explorer"}
            </Text>
          </View>
          {userGoal && (
            <View className="px-3.5 py-1.5 rounded-2xl bg-brand-border/30 border border-brand-border/20 flex-row items-center">
              <Ionicons name="flag" size={13} color={colors.emerald} />
              <Text className="text-brand-textOnDark text-[10px] font-inter-semibold uppercase tracking-wider ml-1.5">
                Target: {userGoal}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="px-5 -mt-5">

        {/* ── STREAK & DAILY TRACKER ── */}
        <View className="bg-brand-bg rounded-2xl p-5 border border-brand-border shadow-lg shadow-brand-shadow">
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-widest">
                DAILY STREAK
              </Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-brand-textPrimary text-[32px] font-inter-bold">{streak}</Text>
                <Text className="text-brand-gray text-sm font-inter ml-2 mt-2">
                  {streak === 1 ? "day" : "days"} 🔥
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => router.push("/(tabs)/leaderboard")}
              className="bg-brand-gold/10 border border-brand-gold/20 rounded-xl px-3 py-1.5 flex-row items-center"
            >
              <Ionicons name="trophy" size={13} color={colors.gold} />
              <Text className="text-brand-gold font-inter-bold text-xs ml-1.5">Ranks</Text>
            </Pressable>
          </View>

          {/* Weekly calendar dots */}
          <View className="flex-row justify-between">
            {weekDays.map((day, index) => {
              const isActive = index < adjustedToday && streak > 0;
              const isToday = index === adjustedToday;
              return (
                <View key={index} className="items-center">
                  <Text className="text-brand-gray text-[10px] font-inter-bold mb-2">{day}</Text>
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      isToday
                        ? "bg-brand-emerald border-2 border-brand-emerald"
                        : isActive
                        ? "bg-brand-emerald/15 border border-brand-emerald/30"
                        : "bg-brand-slateBg border border-brand-border"
                    }`}
                  >
                    {isActive || isToday ? (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={isToday ? "white" : colors.emerald}
                      />
                    ) : (
                      <View className="w-2 h-2 bg-brand-slateBg rounded-full" />
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── QUICK PROGRESS STATS ── */}
        <View className="flex-row mt-4 gap-3">
          <View className="flex-1 bg-brand-bg p-4 rounded-2xl border border-brand-border shadow-md">
            <View className="flex-row justify-between items-center">
              <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-wider">
                Lessons
              </Text>
              <View className="w-6 h-6 bg-brand-emerald/10 rounded-lg items-center justify-center dark:bg-brand-emerald/20">
                <Ionicons name="book" size={12} color={colors.emerald} />
              </View>
            </View>
            <Text className="text-brand-textPrimary text-2xl font-inter-bold mt-2">{lessonsCompleted}</Text>
          </View>

          <View className="flex-1 bg-brand-bg p-4 rounded-2xl border border-brand-border shadow-md">
            <View className="flex-row justify-between items-center">
              <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-wider">
                XP Score
              </Text>
              <View className="w-6 h-6 bg-brand-gold/10 rounded-lg items-center justify-center">
                <Ionicons name="flash" size={12} color={colors.gold} />
              </View>
            </View>
            <Text className="text-brand-textPrimary text-2xl font-inter-bold mt-2">
              {xp} <Text className="text-xs text-brand-gold font-inter-bold">XP</Text>
            </Text>
          </View>

          <View className="flex-1 bg-brand-bg p-4 rounded-2xl border border-brand-border shadow-md">
            <View className="flex-row justify-between items-center">
              <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-wider">
                Learning
              </Text>
              <View className="w-6 h-6 bg-brand-navy/10 rounded-lg items-center justify-center">
                <Ionicons name="time" size={12} color={colors.text} />
              </View>
            </View>
            <Text className="text-brand-textPrimary text-2xl font-inter-bold mt-2">
              {formatDuration(totalTimeSpentSeconds)}
            </Text>
          </View>
        </View>

        {/* ── FINANCIAL NEWS MINI-FEED ── */}
        <View className="mt-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[24px] font-inter-semibold text-brand-textPrimary">Financial News</Text>
            <Pressable
              onPress={() => router.push("/(tabs)/news")}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              className="flex-row items-center gap-1"
            >
              <Text className="text-brand-emerald text-[13px] font-inter-bold">See All</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.emerald} />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingRight: 4 }}
          >
            {newsPreview.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push("/(tabs)/news")}
                style={({ pressed }) => ({
                  width: 240,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
                className="bg-brand-bg rounded-2xl overflow-hidden border border-brand-border shadow-sm"
              >
                {/* Card image */}
                <Image
                  source={{ uri: item.image }}
                  style={{ width: "100%", height: 120 }}
                  resizeMode="cover"
                />

                {/* Category chip on image */}
                <View
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    backgroundColor: categoryMeta(item.category).bg,
                    borderColor: categoryMeta(item.category).border,
                    borderWidth: 1,
                    borderRadius: 999,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text
                    style={{ color: categoryMeta(item.category).text, fontSize: 9, fontWeight: "700" }}
                  >
                    {item.category.toUpperCase()}
                  </Text>
                </View>

                <View className="p-3">
                  <Text
                    className="text-[13px] font-inter-bold text-brand-textPrimary leading-[18px]"
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <Text
                    className="text-[11px] text-brand-gray font-inter mt-1 leading-[15px]"
                    numberOfLines={2}
                  >
                    {item.summary}
                  </Text>
                  <View className="flex-row items-center mt-2 gap-1">
                    <Text className="text-[10px] text-brand-gray font-inter-semibold">
                      {item.source}
                    </Text>
                    <Text className="text-brand-gray text-[10px]">·</Text>
                    <Text className="text-[10px] text-brand-gray font-inter">{item.time}</Text>
                  </View>
                </View>
              </Pressable>
            ))}

            {/* See all card */}
            <Pressable
              onPress={() => router.push("/(tabs)/news")}
              style={({ pressed }) => ({
                width: 100,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
              className="bg-brand-navy/5 border border-brand-border rounded-2xl items-center justify-center gap-2"
            >
              <View className="w-10 h-10 bg-brand-navy rounded-full items-center justify-center">
                <Ionicons name="arrow-forward" size={18} color={colors.text} />
              </View>
              <Text className="text-[11px] font-inter-bold text-brand-textPrimary text-center px-2 leading-4">
                More News
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* ── SMART RECOMMENDATIONS ── */}
        <Text className="text-[24px] font-inter-semibold text-brand-textPrimary mt-8 mb-4">
          Recommended for You
        </Text>
        {smartRecs.map((rec: SmartRecommendation) => (
          <Pressable
            key={rec.id}
            onPress={() => router.push(rec.route as any)}
            style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.99 : 1 }] })}
            className="bg-brand-bg p-4 rounded-2xl border border-brand-border shadow-lg shadow-brand-shadow flex-row items-center justify-between mb-3"
          >
            <View className="flex-row items-center flex-1 mr-3">
              <View className="w-11 h-11 bg-brand-slateBg rounded-xl items-center justify-center mr-3">
                <Text className="text-xl">{rec.icon}</Text>
              </View>
              <View className="flex-1">
                <View className="bg-brand-emerald/10 self-start px-2 py-0.5 rounded-lg border border-brand-emerald/20 mb-1">
                  <Text className="text-brand-emerald text-[9px] font-inter-bold uppercase tracking-wider">
                    {rec.tag}
                  </Text>
                </View>
                <Text
                  className="text-[15px] font-inter-semibold text-brand-textPrimary"
                  numberOfLines={1}
                >
                  {rec.title}
                </Text>
                <Text
                  className="text-brand-gray font-inter text-[11px] mt-0.5 leading-4"
                  numberOfLines={1}
                >
                  {rec.desc}
                </Text>
              </View>
            </View>
            <View className="w-9 h-9 bg-brand-navy rounded-xl items-center justify-center shadow-sm">
              <Ionicons name="arrow-forward" size={16} color={colors.text} />
            </View>
          </Pressable>
        ))}

        {/* ── QUICK ACCESS TOOLS ── */}
        <Text className="text-[24px] font-inter-semibold text-brand-textPrimary mt-8 mb-4">
          Quick Access
        </Text>
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => router.push("/simulations")}
            style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}
            className="flex-1 bg-brand-bg p-5 rounded-2xl border border-brand-border shadow-md items-center justify-center"
          >
            <View className="w-12 h-12 bg-brand-emerald/10 rounded-2xl items-center justify-center mb-3">
              <Ionicons name="calculator-outline" size={22} color={colors.emerald} />
            </View>
            <Text className="text-sm font-inter-semibold text-brand-textPrimary">Simulators</Text>
            <Text className="text-[10px] text-brand-gray mt-1.5 text-center leading-4 font-inter px-2">
              MoMo fees, T-Bills, loans
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/ai-tutor")}
            style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}
            className="flex-1 bg-brand-bg p-5 rounded-2xl border border-brand-border shadow-md items-center justify-center"
          >
            <View className="w-12 h-12 bg-brand-navy/5 rounded-2xl items-center justify-center mb-3">
              <Ionicons name="chatbubbles-outline" size={22} color={colors.navy} />
            </View>
            <Text className="text-sm font-inter-semibold text-brand-textPrimary">AI Coach</Text>
            <Text className="text-[10px] text-brand-gray mt-1.5 text-center leading-4 font-inter px-2">
              Ask finance questions
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/badges")}
            style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}
            className="flex-1 bg-brand-bg p-5 rounded-2xl border border-brand-border shadow-md items-center justify-center"
          >
            <View className="w-12 h-12 bg-brand-gold/10 rounded-2xl items-center justify-center mb-3">
              <Ionicons name="trophy-outline" size={22} color={colors.gold} />
            </View>
            <Text className="text-sm font-inter-semibold text-brand-textPrimary">Badges</Text>
            <Text className="text-[10px] text-brand-gray mt-1.5 text-center leading-4 font-inter px-2">
              View achievements
            </Text>
          </Pressable>
        </View>

      </View>

      {/* ── AVATAR CHOOSER MODAL ── */}
      <Modal visible={avatarModalOpen} transparent animationType="fade">
        <View className="flex-1 bg-brand-navy/60 justify-center items-center px-6">
          <View className="bg-brand-bg w-full rounded-2xl p-6 max-w-sm shadow-2xl border border-brand-border">
            <View className="flex-row justify-between items-center border-b border-brand-border pb-4">
              <Text className="text-brand-textPrimary text-lg font-inter-bold">Choose Character</Text>
              <Pressable
                onPress={() => setAvatarModalOpen(false)}
                className="p-1 active:opacity-75"
              >
                <Ionicons name="close" size={24} color={colors.gray} />
              </Pressable>
            </View>

            <Text className="text-brand-gray text-xs my-4 text-center font-inter leading-5">
              Select a personal character to represent your financial dashboard avatar.
            </Text>

            <View className="flex-row flex-wrap justify-center gap-3.5 mt-2">
              {AVATAR_OPTIONS.map((item, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleAvatarSelect(item.char)}
                  className="w-[72] h-[72] rounded-2xl bg-brand-slateBg active:bg-brand-emerald/10 border border-brand-border items-center justify-center active:border-brand-emerald"
                >
                  <Text className="text-3xl">{item.char}</Text>
                  <Text className="text-[8px] text-brand-gray font-inter-bold mt-1 uppercase tracking-wide">
                    {item.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
