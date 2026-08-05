import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { ScrollView, Text, View, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../store/useUserStore";
import { gamificationService } from "../services/gamification";
import { useThemeColors } from "../hooks/useThemeColors";

// Badge title to image mapping
const BADGE_IMAGES: Record<string, any> = {
  "First Steps": require("../assets/first.jpg"),
  "Getting Smart": require("../assets/gettingsmart.jpg"),
  "Financial Guru": require("../assets/guru.jpg"),
  "Perfect Score": require("../assets/pscore.jpg"),
  "On Fire": require("../assets/fire.jpg"),
  "Unstoppable": require("../assets/unstoppable.jpg"),
  "Saver": require("../assets/saver.jpg"),
  "Goal Crusher": require("../assets/crusher.jpg"),
  "Explorer": require("../assets/explorer.jpg"),
  "Curious Mind": require("../assets/curious_mind.png"),
};

function getBadgeImage(title: string) {
  return BADGE_IMAGES[title] ?? null;
}

// A professional vector icon per badge (fallback)
const BADGE_ICONS: Record<string, React.ComponentProps<typeof Ionicons>["name"]> = {
  "first-lesson": "footsteps",
  "three-lessons": "library",
  "all-lessons": "trophy",
  "quiz-perfect": "ribbon",
  "streak-3": "flame",
  "streak-7": "flash",
  "first-savings": "cash",
  "savings-goal": "flag",
  "simulator-user": "calculator",
  "ai-tutor": "chatbubbles",
};

function badgeIcon(id: string): React.ComponentProps<typeof Ionicons>["name"] {
  return BADGE_ICONS[id] ?? "medal";
}

export default function BadgesScreen() {
  const colors = useThemeColors();
  const badges = useUserStore((s) => s.badges);

  // Refresh badge unlock state from the backend whenever this screen is shown.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      gamificationService
        .getBadges()
        .then((res) => {
          if (active) useUserStore.getState().applyBadges(res.data);
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }, [])
  );

  const unlocked = badges.filter((b) => b.unlockedAt !== null);
  const locked = badges.filter((b) => b.unlockedAt === null);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-brand-slateBg">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-brand-navy pt-10 pb-10 px-6 rounded-b-[40px] shadow-lg shadow-brand-navy/15">
          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            className="w-9 h-9 bg-brand-border/40 rounded-full items-center justify-center border border-brand-border/60 mb-5 active:opacity-80"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </Pressable>

          <Text className="text-brand-gold text-[10px] font-inter-semibold uppercase tracking-widest">
            Your Achievements
          </Text>
          <Text className="text-brand-textOnDark text-[28px] font-inter-bold mt-1 tracking-tight">
            Badges
          </Text>
          <Text className="text-brand-textOnDark/60 text-xs font-inter mt-2">
            {unlocked.length} of {badges.length} badges earned
          </Text>

          {/* Progress bar */}
          <View className="w-full h-2 bg-brand-border/40 rounded-full mt-4 overflow-hidden">
            <View
              style={{ width: `${(unlocked.length / badges.length) * 100}%` }}
              className="h-full bg-brand-gold rounded-full"
            />
          </View>
        </View>

        <View className="px-5 -mt-4">
          {/* Unlocked badges */}
          {unlocked.length > 0 && (
            <>
              <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-widest mb-3 ml-2">
                EARNED ({unlocked.length})
              </Text>
              <View className="flex-row flex-wrap gap-3 mb-6">
                {unlocked.map((badge) => {
                  const imgSource = getBadgeImage(badge.name);
                  return (
                    <View
                      key={badge.id}
                      className="bg-brand-bg rounded-2xl border border-brand-emerald/20 p-4 w-[47%] shadow-md shadow-brand-shadow"
                    >
                      <View className="w-14 h-14 bg-brand-emerald/10 rounded-2xl items-center justify-center overflow-hidden">
                        {imgSource ? (
                          <Image
                            source={imgSource}
                            style={{ width: 36, height: 36, resizeMode: "contain" }}
                          />
                        ) : (
                          <Ionicons name={badgeIcon(badge.id)} size={28} color={colors.emerald} />
                        )}
                      </View>
                      <Text className="text-brand-textPrimary text-sm font-inter-bold mt-3">
                        {badge.name}
                      </Text>
                      <Text className="text-brand-gray text-[10px] font-inter mt-1 leading-4">
                        {badge.description}
                      </Text>
                      <View className="flex-row items-center mt-2">
                        <Ionicons name="checkmark-circle" size={12} color={colors.emerald} />
                        <Text className="text-brand-emerald text-[10px] font-inter-bold ml-1 uppercase tracking-wider">
                          Earned
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {/* Locked badges */}
          <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-widest mb-3 ml-2">
            LOCKED ({locked.length})
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {locked.map((badge) => {
              const imgSource = getBadgeImage(badge.name);
              return (
                <View
                  key={badge.id}
                  className="bg-brand-bg rounded-2xl border border-brand-border p-4 w-[47%] shadow-sm opacity-60"
                >
                  <View className="w-14 h-14 bg-brand-slateBg rounded-2xl items-center justify-center overflow-hidden">
                    {imgSource ? (
                      <Image
                        source={imgSource}
                        style={{ width: 36, height: 36, resizeMode: "contain", opacity: 0.5 }}
                      />
                    ) : (
                      <Ionicons name={badgeIcon(badge.id)} size={28} color={colors.gray} />
                    )}
                  </View>
                  <Text className="text-brand-textPrimary text-sm font-inter-bold mt-3">
                    {badge.name}
                  </Text>
                  <Text className="text-brand-gray text-[10px] font-inter mt-1 leading-4">
                    {badge.description}
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="lock-closed" size={12} color={colors.gray} />
                    <Text className="text-brand-gray text-[10px] font-inter-bold ml-1 uppercase tracking-wider">
                      Locked
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Tip */}
          <View className="flex-row items-start bg-brand-navy/5 bg-brand-slateBg border border-brand-navy/10 rounded-2xl p-4 mt-6">
            <Ionicons name="bulb-outline" size={18} color={colors.navy} style={{ marginTop: 2 }} />
            <Text className="text-brand-gray text-xs font-inter ml-2 flex-1 leading-5">
              Complete lessons, maintain streaks, and use app features to unlock more badges.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
