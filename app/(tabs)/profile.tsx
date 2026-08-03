
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/useUserStore";
import { useThemeColors } from "../../hooks/useThemeColors";
import "@/types/navigation";

const appearanceOptions = [
  { id: "system", name: "System Default", desc: "Automatically match your device", icon: "phone-portrait-outline" },
  { id: "light", name: "Light", desc: "Always use a light appearance", icon: "sunny-outline" },
  { id: "dark", name: "Dark", desc: "Always use a dark appearance", icon: "moon-outline" },
] as const;

export default function ProfileScreen() {
  const userName = useUserStore((s) => s.name);
  const score = useUserStore((s) => s.score);
  const goal = useUserStore((s) => s.goal);
  const isPremium = useUserStore((s) => s.isPremium);
  const avatar = useUserStore((s) => s.avatar);
  const streak = useUserStore((s) => s.streak);
  const createdAt = useUserStore((s) => s.createdAt);

<<<<<<< HEAD
  const themeMode = useUserStore((s) => s.themeMode);
  const setThemeMode = useUserStore((s) => s.setThemeMode);
=======
  const colorBlindMode = useUserStore((s) => s.colorBlindMode);
  const appThemeColor = useUserStore((s) => s.appThemeColor);
  const setColorBlindMode = useUserStore((s) => s.setColorBlindMode);
  const setAppThemeColor = useUserStore((s) => s.setAppThemeColor);
  const isDarkMode = useUserStore((s) => s.isDarkMode);
  const setDarkMode = useUserStore((s) => s.setDarkMode);
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
  const colors = useThemeColors();

  const handleLogout = () => {
    useUserStore.getState().logout();
    router.replace("/auth");
  };

  const getLevelLabel = () => {
    if (score >= 13) return "Level 3 • Pro Builder";
    if (score >= 8) return "Level 2 • Manager";
    return "Level 1 • Novice";
  };

  return (
    <ScrollView 
      className="flex-1 bg-brand-slateBg dark:bg-slate-950" 
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
<<<<<<< HEAD
      <View className="bg-white dark:bg-slate-900 pt-16 pb-8 px-6 items-center border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <View className="w-24 h-24 bg-brand-emerald/10 dark:bg-brand-emerald/20 rounded-full items-center justify-center border-4 border-brand-emerald shadow-sm">
=======
      <View className="bg-brand-bg pt-16 pb-8 px-6 items-center border-b border-brand-border shadow-sm">
        <View className="w-24 h-24 bg-brand-emerald/10 rounded-full items-center justify-center border-4 border-brand-emerald shadow-sm">
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
          {avatar ? (
            <Text className="text-5xl">{avatar}</Text>
          ) : (
            <Text className="text-brand-navy dark:text-slate-100 text-3xl font-inter-bold">
              {userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "FE"}
            </Text>
          )}
        </View>

        <Text className="text-[24px] font-inter-semibold text-brand-navy dark:text-slate-100 mt-4">{userName}</Text>
        <Text className="text-brand-gray dark:text-slate-400 font-inter text-sm mt-1">
          {createdAt
            ? `joined ${new Date(createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
            : "Just joined"}
        </Text>

        {/* Level badge */}
        <View className="bg-brand-navy px-4 py-1.5 rounded-full mt-3">
          <Text className="text-white text-xs font-inter-semibold uppercase tracking-wider">
            {getLevelLabel()}
          </Text>
        </View>

        {/* Goal badge */}
        {goal ? (
          <View className="bg-brand-emerald/15 dark:bg-brand-emerald/20 border border-brand-emerald/20 dark:border-brand-emerald/30 px-4 py-1.5 rounded-full mt-2.5 flex-row items-center">
            <Text className="text-brand-emerald dark:text-emerald-400 text-xs font-inter-bold uppercase tracking-wider">
              🎯 Goal: {goal}
            </Text>
          </View>
        ) : null}

        {/* Streak badge */}
        {streak > 0 && (
          <View className="bg-brand-gold/15 dark:bg-brand-gold/20 border border-brand-gold/20 dark:border-brand-gold/30 px-4 py-1.5 rounded-full mt-2 flex-row items-center">
            <Text className="text-brand-gold dark:text-amber-400 text-xs font-inter-bold uppercase tracking-wider">
              🔥 {streak} Day Streak
            </Text>
          </View>
        )}
      </View>

      {/* Menu / Settings */}
      <View className="px-5 mt-8">
        <Text className="text-brand-gray dark:text-slate-400 text-[10px] font-inter-semibold uppercase tracking-widest mb-3 ml-2">ACCOUNT SETTINGS</Text>

<<<<<<< HEAD
        <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-md shadow-slate-100/40">
          <Pressable 
            onPress={() => router.push("/personal-details")}
            className="p-4 flex-row items-center border-b border-slate-50 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800"
=======
        <View className="bg-brand-bg rounded-2xl border border-brand-border overflow-hidden shadow-md shadow-slate-100/40">
          <Pressable 
            onPress={() => router.push("/personal-details")}
            className="p-4 flex-row items-center border-b border-brand-border active:bg-brand-slateBg"
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
          >
            <View className="w-9 h-9 bg-brand-emerald/10 dark:bg-brand-emerald/20 rounded-xl items-center justify-center mr-3">
              <Ionicons name="person-outline" size={18} color={colors.emerald} />
            </View>
<<<<<<< HEAD
            <Text className="text-brand-navy dark:text-slate-100 text-sm font-inter-semibold flex-1">Personal Details</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
=======
            <Text className="text-brand-navy text-sm font-inter-semibold flex-1">Personal Details</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.gray} />
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/home")}
<<<<<<< HEAD
            className="p-4 flex-row items-center border-b border-slate-50 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800"
=======
            className="p-4 flex-row items-center border-b border-brand-border active:bg-brand-slateBg"
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
          >
            <View className="w-9 h-9 bg-brand-navy/5 dark:bg-slate-700/60 rounded-xl items-center justify-center mr-3">
              <Ionicons name="grid-outline" size={18} color={colors.navy} />
            </View>
<<<<<<< HEAD
            <Text className="text-brand-navy dark:text-slate-100 text-sm font-inter-semibold flex-1">Dashboard Overview</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
=======
            <Text className="text-brand-navy text-sm font-inter-semibold flex-1">Dashboard Overview</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.gray} />
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
          </Pressable>

          <Pressable
            onPress={() => router.push("/assessment-review")}
<<<<<<< HEAD
            className="p-4 flex-row items-center border-b border-slate-50 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800"
=======
            className="p-4 flex-row items-center border-b border-brand-border active:bg-brand-slateBg"
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
          >
            <View className="w-9 h-9 bg-brand-gold/10 dark:bg-brand-gold/20 rounded-xl items-center justify-center mr-3">
              <Ionicons name="bar-chart-outline" size={18} color={colors.gold} />
            </View>
<<<<<<< HEAD
            <Text className="text-brand-navy dark:text-slate-100 text-sm font-inter-semibold flex-1">Financial Assessment</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
=======
            <Text className="text-brand-navy text-sm font-inter-semibold flex-1">Financial Assessment</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.gray} />
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
          </Pressable>

          <Pressable
            onPress={() => router.push("/badges")}
<<<<<<< HEAD
            className="p-4 flex-row items-center border-b border-slate-50 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800"
=======
            className="p-4 flex-row items-center border-b border-brand-border active:bg-brand-slateBg"
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
          >
            <View className="w-9 h-9 bg-brand-gold/10 dark:bg-brand-gold/20 rounded-xl items-center justify-center mr-3">
              <Ionicons name="trophy-outline" size={18} color={colors.gold} />
            </View>
<<<<<<< HEAD
            <Text className="text-brand-navy dark:text-slate-100 text-sm font-inter-semibold flex-1">Badges & Achievements</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
=======
            <Text className="text-brand-navy text-sm font-inter-semibold flex-1">Badges & Achievements</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.gray} />
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/news")}
<<<<<<< HEAD
            className="p-4 flex-row items-center border-b border-slate-50 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800"
=======
            className="p-4 flex-row items-center border-b border-brand-border active:bg-brand-slateBg"
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
          >
            <View className="w-9 h-9 bg-brand-emerald/10 dark:bg-brand-emerald/20 rounded-xl items-center justify-center mr-3">
              <Ionicons name="newspaper-outline" size={18} color={colors.emerald} />
            </View>
<<<<<<< HEAD
            <Text className="text-brand-navy dark:text-slate-100 text-sm font-inter-semibold flex-1">News & Market Updates</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
=======
            <Text className="text-brand-navy text-sm font-inter-semibold flex-1">News & Market Updates</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.gray} />
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
          </Pressable>

          <Pressable 
            onPress={() => router.push("/notifications")}
<<<<<<< HEAD
            className="p-4 flex-row items-center active:bg-slate-50 dark:active:bg-slate-800"
=======
            className="p-4 flex-row items-center active:bg-brand-slateBg"
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
          >
            <View className="w-9 h-9 bg-brand-emerald/10 dark:bg-brand-emerald/20 rounded-xl items-center justify-center mr-3">
              <Ionicons name="notifications-outline" size={18} color={colors.emerald} />
            </View>
<<<<<<< HEAD
            <Text className="text-brand-navy dark:text-slate-100 text-sm font-inter-semibold flex-1">Notifications</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </Pressable>
        </View>

        {/* Appearance */}
        <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-widest mt-8 mb-3 ml-2">APPEARANCE</Text>
        <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-md shadow-slate-100/40">
          <View className="px-5 pt-5 pb-4">
            <Text className="text-brand-navy dark:text-slate-100 text-sm font-inter-bold mb-1">Color Appearance</Text>
            <Text className="text-brand-gray dark:text-slate-400 text-xs font-inter">
              Choose how the app looks — dark, light, or matching your system:
=======
            <Text className="text-brand-navy text-sm font-inter-semibold flex-1">Notifications</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.gray} />
          </Pressable>
        </View>

        {/* Accessibility & Theming */}
        <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-widest mt-8 mb-3 ml-2">ACCESSIBILITY & THEMING</Text>
        <View className="bg-brand-bg rounded-2xl border border-brand-border p-5 shadow-md shadow-slate-100/40">
          <Pressable onPress={() => setDarkMode(!isDarkMode)} accessibilityRole="button" accessibilityLabel={`Switch to ${isDarkMode ? "light" : "dark"} mode`} className="flex-row items-center justify-between bg-brand-slateBg border border-brand-border rounded-xl p-3 mb-6 active:opacity-80">
            <Text className="text-brand-navy text-sm font-inter-bold">{isDarkMode ? "Light Mode" : "Dark Mode"}</Text>
            <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={20} color={colors.navy} />
          </Pressable>
          <Text className="text-brand-navy text-sm font-inter-bold mb-1">Color Blindness Mode</Text>
          <Text className="text-brand-gray text-xs mb-3 font-inter">
            Select a contrast profile optimized for different color vision needs:
          </Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="flex-row mb-6"
            contentContainerStyle={{ paddingRight: 10 }}
          >
            {colorBlindOptions.map((opt) => {
              const isSelected = colorBlindMode === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => setColorBlindMode(opt.id)}
                  style={{ width: 140 }}
                  className={`p-3 mr-3 rounded-xl border ${
                    isSelected 
                      ? 'border-brand-emerald bg-brand-emerald/5' 
                      : 'border-brand-border bg-brand-slateBg'
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-brand-navy text-[13px] font-inter-semibold" numberOfLines={1}>
                      {opt.name}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={16} color={opt.colors[1]} />
                    )}
                  </View>
                  <Text className="text-[10px] text-brand-gray mb-3 font-inter" numberOfLines={2}>
                    {opt.desc}
                  </Text>
                  
                  {/* Swatches */}
                  <View className="flex-row gap-1">
                    {opt.colors.map((c, i) => (
                      <View 
                        key={i} 
                        style={{ backgroundColor: c, width: 14, height: 14, borderRadius: 7 }} 
                      />
                    ))}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <View>
            <Text className="text-brand-navy text-sm font-inter-bold mb-1">App Custom Color</Text>
            <Text className="text-brand-gray text-xs mb-4 font-inter">
              Choose a primary brand color theme optimized for your selected mode:
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
            </Text>
          </View>

          {appearanceOptions.map((opt, idx) => {
            const isSelected = themeMode === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setThemeMode(opt.id)}
                className={`p-4 flex-row items-center ${
                  idx < appearanceOptions.length - 1 ? "border-b border-slate-50 dark:border-slate-800" : ""
                } active:bg-slate-50 dark:active:bg-slate-800`}
              >
                <View className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${
                  isSelected ? "bg-brand-emerald/10 dark:bg-brand-emerald/20" : "bg-slate-100 dark:bg-slate-800"
                }`}>
                  <Ionicons name={opt.icon} size={18} color={isSelected ? colors.emerald : "#6B7280"} />
                </View>
                <View className="flex-1">
                  <Text className="text-brand-navy dark:text-slate-100 text-sm font-inter-semibold">{opt.name}</Text>
                  <Text className="text-brand-gray dark:text-slate-400 text-xs font-inter mt-0.5">{opt.desc}</Text>
                </View>
                {isSelected ? (
                  <Ionicons name="checkmark-circle" size={20} color={colors.emerald} />
                ) : (
                  <View className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-600" />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Subscription Status Section */}
        <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-widest mt-8 mb-3 ml-2">SUBSCRIPTION TIER</Text>
<<<<<<< HEAD
        <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-md shadow-slate-100/40 p-5 flex-row justify-between items-center">
=======
        <View className="bg-brand-bg rounded-2xl border border-brand-border overflow-hidden shadow-md shadow-slate-100/40 p-5 flex-row justify-between items-center">
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
          <View className="flex-1 pr-4">
            <Text className="text-brand-navy dark:text-slate-100 text-base font-inter-semibold">
              {isPremium ? "💎 FinLit Premium Active" : "🆓 Free Tier (Standard)"}
            </Text>
            <Text className="text-brand-gray dark:text-slate-400 font-inter text-xs mt-1.5 leading-5">
              {isPremium 
                ? "You have full access to simulators, audio modules, and AI Coach." 
                : "Unlock advanced financial engines, offline audio, and personal AI Coach."}
            </Text>
          </View>
          <Pressable 
            onPress={() => {
              if (isPremium) {
                useUserStore.getState().setPremium(false);
              } else {
                router.push("/paywall");
              }
            }}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
            className={`px-4 py-2.5 rounded-2xl border justify-center items-center ${
              isPremium ? "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900" : "bg-brand-navy border-brand-navy shadow-sm active:bg-brand-navy/95"
            }`}
          >
            <Text className={`text-xs font-inter-semibold uppercase tracking-wider ${isPremium ? "text-red-700 dark:text-red-400" : "text-white"}`}>
              {isPremium ? "Downgrade" : "Upgrade"}
            </Text>
          </Pressable>
        </View>

        {/* Support & Logout */}
        <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-widest mt-8 mb-3 ml-2">GENERAL</Text>

<<<<<<< HEAD
        <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-md shadow-slate-100/40">
          <Pressable 
            onPress={() => router.push("/help-support")}
            className="p-4 flex-row items-center border-b border-slate-50 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800"
          >
            <View className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl items-center justify-center mr-3">
              <Ionicons name="help-circle-outline" size={18} color="#6B7280" />
            </View>
            <Text className="text-brand-navy dark:text-slate-100 text-sm font-inter-semibold flex-1">Help & Support</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
=======
        <View className="bg-brand-bg rounded-2xl border border-brand-border overflow-hidden shadow-md shadow-slate-100/40">
          <Pressable 
            onPress={() => router.push("/help-support")}
            className="p-4 flex-row items-center border-b border-brand-border active:bg-brand-slateBg"
          >
            <View className="w-9 h-9 bg-brand-slateBg rounded-xl items-center justify-center mr-3">
              <Ionicons name="help-circle-outline" size={18} color={colors.gray} />
            </View>
            <Text className="text-brand-navy text-sm font-inter-semibold flex-1">Help & Support</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.gray} />
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
          </Pressable>

          <Pressable 
            onPress={() => router.push("/privacy-policy")}
<<<<<<< HEAD
            className="p-4 flex-row items-center border-b border-slate-50 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800"
          >
            <View className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl items-center justify-center mr-3">
              <Ionicons name="shield-checkmark-outline" size={18} color="#6B7280" />
            </View>
            <Text className="text-brand-navy dark:text-slate-100 text-sm font-inter-semibold flex-1">Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
=======
            className="p-4 flex-row items-center border-b border-brand-border active:bg-brand-slateBg"
          >
            <View className="w-9 h-9 bg-brand-slateBg rounded-xl items-center justify-center mr-3">
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.gray} />
            </View>
            <Text className="text-brand-navy text-sm font-inter-semibold flex-1">Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.gray} />
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
          </Pressable>

          <Pressable 
            onPress={handleLogout} 
<<<<<<< HEAD
            className="p-4 flex-row items-center active:bg-slate-50 dark:active:bg-slate-800"
=======
            className="p-4 flex-row items-center active:bg-brand-slateBg"
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
          >
            <View className="w-9 h-9 bg-red-50 dark:bg-red-950/50 rounded-xl items-center justify-center mr-3">
              <Ionicons name="log-out-outline" size={18} color="#DC2626" />
            </View>
            <Text className="text-red-600 dark:text-red-400 text-sm font-inter-bold flex-1">Sign Out</Text>
            <Ionicons name="chevron-forward" size={16} color="#FCA5A5" />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
