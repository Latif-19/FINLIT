
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/useUserStore";
import "@/types/navigation";

export default function ProfileScreen() {
  const userName = useUserStore((s) => s.name);
  const score = useUserStore((s) => s.score);
  const goal = useUserStore((s) => s.goal);
  const isPremium = useUserStore((s) => s.isPremium);
  const avatar = useUserStore((s) => s.avatar);

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
      className="flex-1 bg-[#f8fafc]" 
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View className="bg-white pt-16 pb-8 px-6 items-center border-b border-gray-200">
        <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center border-4 border-green-700 shadow-sm">
          {avatar ? (
            <Text className="text-5xl">{avatar}</Text>
          ) : (
            <Text className="text-green-800 text-3xl font-extrabold">
              {userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "FE"}
            </Text>
          )}
        </View>

        <Text className="text-2xl font-bold text-gray-800 mt-4">{userName}</Text>
        <Text className="text-gray-400 text-sm mt-1">joined June 2026</Text>

        {/* Level badge */}
        <View className="bg-green-700 px-4 py-1.5 rounded-full mt-3">
          <Text className="text-white text-xs font-bold uppercase tracking-wider">
            {getLevelLabel()}
          </Text>
        </View>

        {/* Goal badge */}
        {goal ? (
          <View className="bg-blue-100 border border-blue-200 px-4 py-1 rounded-full mt-2 flex-row items-center">
            <Text className="text-blue-800 text-xs font-extrabold uppercase tracking-wider">
              🎯 Goal: {goal}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Menu / Settings */}
      <View className="px-5 mt-8">
        <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3 ml-2">ACCOUNT SETTINGS</Text>

        <View className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <Pressable 
            onPress={() => router.push("/personal-details")}
            className="p-4 flex-row items-center border-b border-slate-50 active:bg-slate-50"
          >
            <View className="w-9 h-9 bg-teal-50 rounded-xl items-center justify-center mr-3">
              <Ionicons name="person-outline" size={18} color="#0d9488" />
            </View>
            <Text className="text-slate-800 text-sm font-bold flex-1">Personal Details</Text>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/home")}
            className="p-4 flex-row items-center border-b border-slate-50 active:bg-slate-50"
          >
            <View className="w-9 h-9 bg-blue-50 rounded-xl items-center justify-center mr-3">
              <Ionicons name="grid-outline" size={18} color="#2563eb" />
            </View>
            <Text className="text-slate-800 text-sm font-bold flex-1">Dashboard Overview</Text>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </Pressable>

          <Pressable
            onPress={() => router.push("/assessment-review")}
            className="p-4 flex-row items-center border-b border-slate-50 active:bg-slate-50"
          >
            <View className="w-9 h-9 bg-purple-50 rounded-xl items-center justify-center mr-3">
              <Ionicons name="bar-chart-outline" size={18} color="#7c3aed" />
            </View>
            <Text className="text-slate-800 text-sm font-bold flex-1">Financial Assessment</Text>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </Pressable>

          <Pressable 
            onPress={() => router.push("/notifications")}
            className="p-4 flex-row items-center active:bg-slate-50"
          >
            <View className="w-9 h-9 bg-amber-50 rounded-xl items-center justify-center mr-3">
              <Ionicons name="notifications-outline" size={18} color="#d97706" />
            </View>
            <Text className="text-slate-800 text-sm font-bold flex-1">Notifications</Text>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </Pressable>
        </View>

        {/* Subscription Status Section */}
        <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-8 mb-3 ml-2">SUBSCRIPTION TIER</Text>
        <View className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm p-5 flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <Text className="text-slate-900 text-base font-extrabold">
              {isPremium ? "💎 FinLit Premium Active" : "🆓 Free Tier (Standard)"}
            </Text>
            <Text className="text-slate-400 text-xs mt-1 font-semibold leading-4">
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
            className={`px-4 py-2.5 rounded-2xl border ${
              isPremium ? "bg-red-50 border-red-200" : "bg-teal-600 border-teal-600 active:opacity-90"
            }`}
          >
            <Text className={`text-xs font-black uppercase tracking-wide ${isPremium ? "text-red-700" : "text-white"}`}>
              {isPremium ? "Downgrade" : "Upgrade"}
            </Text>
          </Pressable>
        </View>

        {/* Support & Logout */}
        <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-8 mb-3 ml-2">GENERAL</Text>

        <View className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <Pressable 
            onPress={() => router.push("/help-support")}
            className="p-4 flex-row items-center border-b border-slate-50 active:bg-slate-50"
          >
            <View className="w-9 h-9 bg-slate-50 rounded-xl items-center justify-center mr-3">
              <Ionicons name="help-circle-outline" size={18} color="#475569" />
            </View>
            <Text className="text-slate-800 text-sm font-bold flex-1">Help & Support</Text>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </Pressable>

          <Pressable 
            onPress={() => router.push("/privacy-policy")}
            className="p-4 flex-row items-center border-b border-slate-50 active:bg-slate-50"
          >
            <View className="w-9 h-9 bg-slate-50 rounded-xl items-center justify-center mr-3">
              <Ionicons name="shield-checkmark-outline" size={18} color="#475569" />
            </View>
            <Text className="text-slate-800 text-sm font-bold flex-1">Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </Pressable>

          <Pressable 
            onPress={handleLogout} 
            className="p-4 flex-row items-center active:bg-slate-50"
          >
            <View className="w-9 h-9 bg-red-50 rounded-xl items-center justify-center mr-3">
              <Ionicons name="log-out-outline" size={18} color="#dc2626" />
            </View>
            <Text className="text-red-600 text-sm font-black flex-1">Sign Out</Text>
            <Ionicons name="chevron-forward" size={16} color="#fca5a5" />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
