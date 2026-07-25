
import { router } from "expo-router";
import React from "react";
import { Appearance, ScrollView, Text, View, Pressable, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/useUserStore";
import { useThemeColors } from "../../hooks/useThemeColors";
import "@/types/navigation";

const colorBlindOptions = [
  { id: "none", name: "Default", desc: "Standard colors", colors: ["#0A2540", "#16A34A", "#D4AF37"] },
  { id: "deuteranopia", name: "Deuteranopia", desc: "Green blind safe", colors: ["#003A60", "#0072B2", "#E69F00"] },
  { id: "protanopia", name: "Protanopia", desc: "Red blind safe", colors: ["#002C54", "#3D5AFE", "#FFC400"] },
  { id: "tritanopia", name: "Tritanopia", desc: "Blue blind safe", colors: ["#5A0B2E", "#00796B", "#00E676"] },
  { id: "high-contrast", name: "High Contrast", desc: "Maximum contrast", colors: ["#000000", "#0000FF", "#D97706"] },
  { id: "monochrome", name: "Monochrome", desc: "Grayscale layout", colors: ["#111111", "#444444", "#888888"] },
] as const;

const getThemeColorOptions = (mode: string) => {
  switch (mode) {
    case 'deuteranopia':
      return [
        { id: "emerald", name: "Classic Emerald", color: "#009E73" },
        { id: "blue", name: "Ocean Blue", color: "#0072B2" },
        { id: "purple", name: "Noble Violet", color: "#CC79A7" },
      ] as const;
    case 'protanopia':
      return [
        { id: "emerald", name: "Classic Emerald", color: "#009E73" },
        { id: "blue", name: "Ocean Blue", color: "#3D5AFE" },
        { id: "purple", name: "Noble Violet", color: "#B800FF" },
      ] as const;
    case 'tritanopia':
      return [
        { id: "emerald", name: "Classic Emerald", color: "#00796B" },
        { id: "blue", name: "Ocean Blue", color: "#00A5CF" },
        { id: "purple", name: "Noble Violet", color: "#EC407A" },
      ] as const;
    case 'high-contrast':
      return [
        { id: "emerald", name: "Classic Emerald", color: "#008000" },
        { id: "blue", name: "Ocean Blue", color: "#0000FF" },
        { id: "purple", name: "Noble Violet", color: "#800080" },
      ] as const;
    case 'monochrome':
      return [
        { id: "emerald", name: "Classic Emerald", color: "#4B5563" },
        { id: "blue", name: "Ocean Blue", color: "#374151" },
        { id: "purple", name: "Noble Violet", color: "#1F2937" },
      ] as const;
    default:
      return [
        { id: "emerald", name: "Classic Emerald", color: "#10B981" },
        { id: "blue", name: "Ocean Blue", color: "#2563EB" },
        { id: "purple", name: "Noble Violet", color: "#7C3AED" },
      ] as const;
  }
};

export default function ProfileScreen() {
  const userName = useUserStore((s) => s.name);
  const score = useUserStore((s) => s.score);
  const goal = useUserStore((s) => s.goal);
  const isPremium = useUserStore((s) => s.isPremium);
  const avatar = useUserStore((s) => s.avatar);
  const streak = useUserStore((s) => s.streak);
  const createdAt = useUserStore((s) => s.createdAt);

  const colorBlindMode = useUserStore((s) => s.colorBlindMode);
  const appThemeColor = useUserStore((s) => s.appThemeColor);
  const setColorBlindMode = useUserStore((s) => s.setColorBlindMode);
  const setAppThemeColor = useUserStore((s) => s.setAppThemeColor);
  const colors = useThemeColors();
  const colorScheme = useColorScheme();

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
      className="flex-1 bg-brand-slateBg" 
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View className="bg-white pt-16 pb-8 px-6 items-center border-b border-slate-100 shadow-sm">
        <View className="w-24 h-24 bg-brand-emerald/10 rounded-full items-center justify-center border-4 border-brand-emerald shadow-sm">
          {avatar ? (
            <Text className="text-5xl">{avatar}</Text>
          ) : (
            <Text className="text-brand-navy text-3xl font-inter-bold">
              {userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "FE"}
            </Text>
          )}
        </View>

        <Text className="text-[24px] font-inter-semibold text-brand-navy mt-4">{userName}</Text>
        <Text className="text-brand-gray font-inter text-sm mt-1">
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
          <View className="bg-brand-emerald/15 border border-brand-emerald/20 px-4 py-1.5 rounded-full mt-2.5 flex-row items-center">
            <Text className="text-brand-emerald text-xs font-inter-bold uppercase tracking-wider">
              🎯 Goal: {goal}
            </Text>
          </View>
        ) : null}

        {/* Streak badge */}
        {streak > 0 && (
          <View className="bg-brand-gold/15 border border-brand-gold/20 px-4 py-1.5 rounded-full mt-2 flex-row items-center">
            <Text className="text-brand-gold text-xs font-inter-bold uppercase tracking-wider">
              🔥 {streak} Day Streak
            </Text>
          </View>
        )}
      </View>

      {/* Menu / Settings */}
      <View className="px-5 mt-8">
        <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-widest mb-3 ml-2">ACCOUNT SETTINGS</Text>

        <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-md shadow-slate-100/40">
          <Pressable 
            onPress={() => router.push("/personal-details")}
            className="p-4 flex-row items-center border-b border-slate-50 active:bg-slate-50"
          >
            <View className="w-9 h-9 bg-brand-emerald/10 rounded-xl items-center justify-center mr-3">
              <Ionicons name="person-outline" size={18} color={colors.emerald} />
            </View>
            <Text className="text-brand-navy text-sm font-inter-semibold flex-1">Personal Details</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/home")}
            className="p-4 flex-row items-center border-b border-slate-50 active:bg-slate-50"
          >
            <View className="w-9 h-9 bg-brand-navy/5 rounded-xl items-center justify-center mr-3">
              <Ionicons name="grid-outline" size={18} color={colors.navy} />
            </View>
            <Text className="text-brand-navy text-sm font-inter-semibold flex-1">Dashboard Overview</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </Pressable>

          <Pressable
            onPress={() => router.push("/assessment-review")}
            className="p-4 flex-row items-center border-b border-slate-50 active:bg-slate-50"
          >
            <View className="w-9 h-9 bg-brand-gold/10 rounded-xl items-center justify-center mr-3">
              <Ionicons name="bar-chart-outline" size={18} color={colors.gold} />
            </View>
            <Text className="text-brand-navy text-sm font-inter-semibold flex-1">Financial Assessment</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </Pressable>

          <Pressable
            onPress={() => router.push("/badges")}
            className="p-4 flex-row items-center border-b border-slate-50 active:bg-slate-50"
          >
            <View className="w-9 h-9 bg-brand-gold/10 rounded-xl items-center justify-center mr-3">
              <Ionicons name="trophy-outline" size={18} color={colors.gold} />
            </View>
            <Text className="text-brand-navy text-sm font-inter-semibold flex-1">Badges & Achievements</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/news")}
            className="p-4 flex-row items-center border-b border-slate-50 active:bg-slate-50"
          >
            <View className="w-9 h-9 bg-brand-emerald/10 rounded-xl items-center justify-center mr-3">
              <Ionicons name="newspaper-outline" size={18} color={colors.emerald} />
            </View>
            <Text className="text-brand-navy text-sm font-inter-semibold flex-1">News & Market Updates</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </Pressable>

          <Pressable 
            onPress={() => router.push("/notifications")}
            className="p-4 flex-row items-center active:bg-slate-50"
          >
            <View className="w-9 h-9 bg-brand-emerald/10 rounded-xl items-center justify-center mr-3">
              <Ionicons name="notifications-outline" size={18} color={colors.emerald} />
            </View>
            <Text className="text-brand-navy text-sm font-inter-semibold flex-1">Notifications</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </Pressable>
        </View>

        {/* Accessibility & Theming */}
        <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-widest mt-8 mb-3 ml-2">ACCESSIBILITY & THEMING</Text>
        <View className="bg-white rounded-2xl border border-slate-100 p-5 shadow-md shadow-slate-100/40">
          <Pressable onPress={() => Appearance.setColorScheme(colorScheme === "dark" ? "light" : "dark")} accessibilityRole="button" accessibilityLabel={`Switch to ${colorScheme === "dark" ? "light" : "dark"} mode`} className="flex-row items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6 active:bg-slate-100">
            <Text className="text-brand-navy text-sm font-inter-bold">{colorScheme === "dark" ? "Light Mode" : "Dark Mode"}</Text>
            <Ionicons name={colorScheme === "dark" ? "sunny-outline" : "moon-outline"} size={20} color={colors.navy} />
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
                      : 'border-slate-100 bg-slate-50'
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
            </Text>

            <View className="flex-row flex-wrap gap-3">
              {getThemeColorOptions(colorBlindMode).map((opt) => {
                const isSelected = appThemeColor === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setAppThemeColor(opt.id)}
                    style={({ pressed }) => [{ backgroundColor: opt.color }, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
                    className="w-12 h-12 rounded-full items-center justify-center border-2 border-white shadow-sm"
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Subscription Status Section */}
        <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-widest mt-8 mb-3 ml-2">SUBSCRIPTION TIER</Text>
        <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-md shadow-slate-100/40 p-5 flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <Text className="text-brand-navy text-base font-inter-semibold">
              {isPremium ? "💎 FinLit Premium Active" : "🆓 Free Tier (Standard)"}
            </Text>
            <Text className="text-brand-gray font-inter text-xs mt-1.5 leading-5">
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
              isPremium ? "bg-red-50 border-red-200" : "bg-brand-navy border-brand-navy shadow-sm active:bg-brand-navy/95"
            }`}
          >
            <Text className={`text-xs font-inter-semibold uppercase tracking-wider ${isPremium ? "text-red-700" : "text-white"}`}>
              {isPremium ? "Downgrade" : "Upgrade"}
            </Text>
          </Pressable>
        </View>

        {/* Support & Logout */}
        <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-widest mt-8 mb-3 ml-2">GENERAL</Text>

        <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-md shadow-slate-100/40">
          <Pressable 
            onPress={() => router.push("/help-support")}
            className="p-4 flex-row items-center border-b border-slate-50 active:bg-slate-50"
          >
            <View className="w-9 h-9 bg-slate-100 rounded-xl items-center justify-center mr-3">
              <Ionicons name="help-circle-outline" size={18} color="#6B7280" />
            </View>
            <Text className="text-brand-navy text-sm font-inter-semibold flex-1">Help & Support</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </Pressable>

          <Pressable 
            onPress={() => router.push("/privacy-policy")}
            className="p-4 flex-row items-center border-b border-slate-50 active:bg-slate-50"
          >
            <View className="w-9 h-9 bg-slate-100 rounded-xl items-center justify-center mr-3">
              <Ionicons name="shield-checkmark-outline" size={18} color="#6B7280" />
            </View>
            <Text className="text-brand-navy text-sm font-inter-semibold flex-1">Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </Pressable>

          <Pressable 
            onPress={handleLogout} 
            className="p-4 flex-row items-center active:bg-slate-50"
          >
            <View className="w-9 h-9 bg-red-50 rounded-xl items-center justify-center mr-3">
              <Ionicons name="log-out-outline" size={18} color="#DC2626" />
            </View>
            <Text className="text-red-600 text-sm font-inter-bold flex-1">Sign Out</Text>
            <Ionicons name="chevron-forward" size={16} color="#FCA5A5" />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
