import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, View, Pressable, Switch, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/useUserStore";
import { useThemeColors } from "../../hooks/useThemeColors";
import { profileService } from "../../services/profile";
import "@/types/navigation";

export default function ProfileScreen() {
  const userName = useUserStore((s) => s.name);
  const score = useUserStore((s) => s.score);
  const goal = useUserStore((s) => s.goal);
  const isPremium = useUserStore((s) => s.isPremium);
  const avatar = useUserStore((s) => s.avatar);
  const streak = useUserStore((s) => s.streak);
  const createdAt = useUserStore((s) => s.createdAt);

  const isDarkMode = useUserStore((s) => s.isDarkMode);
  const setDarkMode = useUserStore((s) => s.setDarkMode);

  const colors = useThemeColors();

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

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Permission to access your photo library is required to upload a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newUri = result.assets[0].uri;
      useUserStore.getState().setAvatar(newUri);
      try {
        await profileService.updateProfile({
          name: userName,
          avatar: newUri,
        });
      } catch {
        // Optimistic local update already applied
      }
    }
  };

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
      <View className="bg-brand-bg pt-16 pb-8 px-6 items-center border-b border-brand-border shadow-sm">
        <Pressable onPress={handlePickImage} accessibilityRole="button" accessibilityLabel="Upload profile picture" className="relative active:opacity-85">
          <View className="w-24 h-24 bg-brand-emerald/10 rounded-full items-center justify-center border-4 border-brand-emerald shadow-sm overflow-hidden">
            {isImageUri(avatar) ? (
              <Image source={{ uri: avatar }} className="w-full h-full" resizeMode="cover" />
            ) : avatar ? (
              <Text className="text-5xl">{avatar}</Text>
            ) : (
              <Text className="text-brand-textPrimary text-3xl font-inter-bold">
                {userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "FE"}
              </Text>
            )}
          </View>
          <View className="absolute bottom-0 right-0 bg-brand-emerald w-7 h-7 rounded-full items-center justify-center border-2 border-white shadow-sm">
            <Ionicons name="camera" size={14} color="white" />
          </View>
        </Pressable>

        <Text className="text-[24px] font-inter-semibold text-brand-textPrimary mt-4">{userName}</Text>
        <Text className="text-brand-gray font-inter text-sm mt-1">
          {createdAt
            ? `joined ${new Date(createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
            : "Just joined"}
        </Text>

        {/* Level badge */}
        <View className="bg-brand-navy px-4 py-1.5 rounded-full mt-3">
          <Text className="text-brand-textOnDark text-xs font-inter-semibold uppercase tracking-wider">
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

        <View className="bg-brand-bg rounded-3xl border border-brand-border overflow-hidden shadow-sm">
          <Pressable 
            onPress={() => router.push("/personal-details")}
            className="p-4 flex-row items-center justify-between border-b border-brand-border/60 active:bg-brand-slateBg"
          >
            <View className="flex-1">
              <Text className="text-brand-textPrimary text-base font-inter-semibold">Personal Details</Text>
              <Text className="text-brand-gray text-xs font-inter mt-0.5">Name, email, age, and phone</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.gray} />
          </Pressable>

          <Pressable
            onPress={() => router.push("/assessment-review")}
            className="p-4 flex-row items-center justify-between border-b border-brand-border/60 active:bg-brand-slateBg"
          >
            <View className="flex-1">
              <Text className="text-brand-textPrimary text-base font-inter-semibold">Financial Assessment</Text>
              <Text className="text-brand-gray text-xs font-inter mt-0.5">Review your financial health score</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.gray} />
          </Pressable>

          <Pressable
            onPress={() => router.push("/badges")}
            className="p-4 flex-row items-center justify-between border-b border-brand-border/60 active:bg-brand-slateBg"
          >
            <View className="flex-1">
              <Text className="text-brand-textPrimary text-base font-inter-semibold">Badges & Achievements</Text>
              <Text className="text-brand-gray text-xs font-inter mt-0.5">Unlocked milestones and awards</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.gray} />
          </Pressable>

          <Pressable 
            onPress={() => router.push("/notifications")}
            className="p-4 flex-row items-center justify-between active:bg-brand-slateBg"
          >
            <View className="flex-1">
              <Text className="text-brand-textPrimary text-base font-inter-semibold">Notifications</Text>
              <Text className="text-brand-gray text-xs font-inter mt-0.5">Reminders and streak alerts</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.gray} />
          </Pressable>
        </View>

        {/* Accessibility & Theming */}
        <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-widest mt-8 mb-3 ml-2">ACCESSIBILITY & THEMING</Text>
        <View className="bg-brand-bg rounded-2xl border border-brand-border p-5 shadow-md shadow-brand-shadow">
          <Pressable 
            onPress={() => setDarkMode(!isDarkMode)} 
            accessibilityRole="button" 
            accessibilityLabel={`Switch to ${isDarkMode ? "light" : "dark"} mode`} 
            className="flex-row items-center justify-between bg-brand-slateBg border border-brand-border rounded-xl p-3 active:opacity-80"
          >
            <Text className="text-brand-textPrimary text-sm font-inter-bold">{isDarkMode ? "Light Mode" : "Dark Mode"}</Text>
            <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={20} color={colors.navy} />
          </Pressable>
        </View>

        {/* Subscription Status Section */}
        <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-widest mt-8 mb-3 ml-2">SUBSCRIPTION TIER</Text>
        <View className="bg-brand-bg rounded-2xl border border-brand-border overflow-hidden shadow-md shadow-brand-shadow p-5 flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <Text className="text-brand-textPrimary text-base font-inter-semibold">
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
            <Text className={`text-xs font-inter-semibold uppercase tracking-wider ${isPremium ? "text-red-700" : "text-brand-textOnDark"}`}>
              {isPremium ? "Downgrade" : "Upgrade"}
            </Text>
          </Pressable>
        </View>

        {/* Support & Logout */}
        <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-widest mt-8 mb-3 ml-2">GENERAL</Text>

        <View className="bg-brand-bg rounded-2xl border border-brand-border overflow-hidden shadow-md shadow-brand-shadow">
          <Pressable 
            onPress={() => router.push("/help-support")}
            className="p-4 flex-row items-center border-b border-brand-border active:bg-brand-slateBg"
          >
            <View className="w-9 h-9 bg-brand-slateBg rounded-xl items-center justify-center mr-3">
              <Ionicons name="help-circle-outline" size={18} color={colors.gray} />
            </View>
            <Text className="text-brand-textPrimary text-sm font-inter-semibold flex-1">Help & Support</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.gray} />
          </Pressable>

          <Pressable 
            onPress={() => router.push("/privacy-policy")}
            className="p-4 flex-row items-center border-b border-brand-border active:bg-brand-slateBg"
          >
            <View className="w-9 h-9 bg-brand-slateBg rounded-xl items-center justify-center mr-3">
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.gray} />
            </View>
            <Text className="text-brand-textPrimary text-sm font-inter-semibold flex-1">Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.gray} />
          </Pressable>

          <Pressable 
            onPress={handleLogout} 
            className="p-4 flex-row items-center active:bg-brand-slateBg"
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
