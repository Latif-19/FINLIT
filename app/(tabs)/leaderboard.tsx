import React, { useState, useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/useUserStore";
import { gamificationService } from "../../services/gamification";
import { MOCK_LEADERBOARD } from "@/data/leaderboard";
import type { LeaderboardEntry } from "@/types/api";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function LeaderboardScreen() {
  const colors = useThemeColors();
  const userName = useUserStore((s) => s.name);
  const userXp = useUserStore((s) => s.xp);
  const avatar = useUserStore((s) => s.avatar);

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number>(0);

  // Pull the ranked leaderboard from the backend on focus. If the server is
  // unreachable, fall back to the mock data merged with the local user.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      gamificationService
        .getLeaderboard()
        .then((res) => {
          if (!active) return;
          setEntries(res.data.entries);
          setCurrentUserRank(res.data.currentUserRank);
        })
        .catch(() => {
          if (!active) return;
          const fallback = [
            ...MOCK_LEADERBOARD,
            { userId: "current", name: userName, avatar, xp: userXp, rank: 0 },
          ]
            .sort((a, b) => b.xp - a.xp)
            .map((entry, index) => ({ ...entry, rank: index + 1 }));
          setEntries(fallback);
          setCurrentUserRank(fallback.find((e) => e.userId === "current")?.rank ?? fallback.length);
        });
      return () => {
        active = false;
      };
    }, [userName, avatar, userXp])
  );

  const topThree = entries.slice(0, 3);
  const rest = entries.slice(3);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { emoji: "🥇", bg: "bg-yellow-50", border: "border-yellow-200" };
    if (rank === 2) return { emoji: "🥈", bg: "bg-slate-50", border: "border-slate-200" };
    if (rank === 3) return { emoji: "🥉", bg: "bg-orange-50", border: "border-orange-200" };
    return { emoji: "", bg: "bg-white", border: "border-slate-100" };
  };

  return (
    <ScrollView
      className="flex-1 bg-brand-slateBg"
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="bg-brand-navy pt-16 pb-8 px-6 rounded-b-[40px] shadow-lg shadow-brand-navy/15">
        <Text className="text-brand-gold text-[10px] font-inter-semibold uppercase tracking-widest">
          Weekly Rankings
        </Text>
        <Text className="text-white text-[28px] font-inter-bold mt-1 tracking-tight">
          Leaderboard
        </Text>
        <Text className="text-white/60 text-xs font-inter mt-2">
          Top learners ranked by XP earned
        </Text>

        {/* Current user rank card */}
        <View className="bg-white/10 border border-white/20 rounded-2xl p-4 mt-6 flex-row items-center">
          <View className="w-12 h-12 bg-white/10 rounded-2xl items-center justify-center border border-white/20">
            <Text className="text-2xl">{avatar}</Text>
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-white text-xs font-inter-semibold uppercase tracking-wider">
              Your Rank
            </Text>
            <Text className="text-white text-2xl font-inter-bold mt-0.5">
              #{currentUserRank}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-brand-gold text-[10px] font-inter-semibold uppercase tracking-wider">
              XP
            </Text>
            <Text className="text-white text-xl font-inter-bold mt-0.5">
              {userXp.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      <View className="px-5 -mt-4">
        {/* Top 3 Podium */}
        <View className="flex-row justify-center items-end gap-3 mt-2 mb-6">
          {[1, 0, 2].map((podiumIndex) => {
            const entry = topThree[podiumIndex];
            if (!entry) return <View key={podiumIndex} className="flex-1" />;
            const badge = getRankBadge(entry.rank);
            const heights = [140, 110, 95];

            return (
              <View key={entry.userId} className="flex-1 items-center">
                <View className={`w-16 h-16 rounded-2xl items-center justify-center border-2 ${badge.border} ${badge.bg} shadow-md`}>
                  <Text className="text-3xl">{entry.avatar}</Text>
                </View>
                <Text className="text-brand-navy text-xs font-inter-bold mt-2 text-center" numberOfLines={1}>
                  {entry.name.split(" ")[0]}
                </Text>
                <Text className="text-brand-gray text-[10px] font-inter">
                  {entry.xp.toLocaleString()} XP
                </Text>
                <View
                  className={`w-full ${badge.bg} border ${badge.border} rounded-2xl items-center justify-center mt-2 pt-3 pb-4`}
                  style={{ minHeight: heights[podiumIndex] }}
                >
                  <Text className="text-2xl mb-1">{badge.emoji}</Text>
                  <Text className="text-brand-navy text-lg font-inter-bold">
                    #{entry.rank}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Remaining ranks */}
        <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-widest mb-3 ml-2">
          ALL RANKINGS
        </Text>
        <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-md shadow-slate-100/40">
          {rest.length === 0 && (
            <View className="items-center py-8 px-6">
              <Ionicons name="people-outline" size={30} color="#94A3B8" />
              <Text className="text-brand-navy text-sm font-inter-bold mt-3 text-center">
                You're leading the pack!
              </Text>
              <Text className="text-brand-gray text-xs mt-1 text-center leading-4">
                As more learners join and earn XP, they'll show up here.
              </Text>
            </View>
          )}
          {rest.map((entry, index) => {
            const isCurrentUser = entry.rank === currentUserRank;
            return (
              <View
                key={entry.userId}
                className={`flex-row items-center p-4 ${
                  index < rest.length - 1 ? "border-b border-slate-50" : ""
                } ${isCurrentUser ? "bg-brand-emerald/5" : ""}`}
              >
                <Text className="text-brand-gray font-inter-bold text-sm w-8 text-center">
                  #{entry.rank}
                </Text>
                <View className="w-10 h-10 bg-brand-slateBg rounded-xl items-center justify-center ml-2">
                  <Text className="text-xl">{entry.avatar}</Text>
                </View>
                <View className="flex-1 ml-3">
                  <Text className={`text-sm font-inter-semibold ${isCurrentUser ? "text-brand-emerald" : "text-brand-navy"}`}>
                    {entry.name} {isCurrentUser ? "(You)" : ""}
                  </Text>
                </View>
                <View className="bg-brand-navy/5 px-3 py-1.5 rounded-xl">
                  <Text className="text-brand-navy text-xs font-inter-bold">
                    {entry.xp.toLocaleString()} XP
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Info note */}
        <View className="flex-row items-start bg-brand-emerald/5 border border-brand-emerald/20 rounded-2xl p-4 mt-6">
          <Ionicons name="information-circle" size={18} color={colors.emerald} style={{ marginTop: 2 }} />
          <Text className="text-brand-gray text-xs font-inter ml-2 flex-1 leading-5">
            Earn XP by completing lessons, quizzes, and maintaining daily streaks.
            Rankings update in real-time when the backend is connected.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
