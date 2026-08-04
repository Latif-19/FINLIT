import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColors";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { useUserStore } from "../store/useUserStore";
import { LESSON_MODULES } from "@/data/lessons";

export default function CertificateScreen() {
  const colors = useThemeColors();
  const userName = useUserStore((s) => s.name);
  const score = useUserStore((s) => s.score);
  const goal = useUserStore((s) => s.goal);
  const lessonsCompleted = useUserStore((s) => s.lessonsCompleted);
  const createdAt = useUserStore((s) => s.createdAt);
  const xp = useUserStore((s) => s.xp);
  const certificateRef = useRef<ViewShot>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const isUnlocked = lessonsCompleted >= LESSON_MODULES.length;
  const completedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const joinedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : "2026";

  const getLevelLabel = () => {
    if (score >= 13) return "Wealth Builder Pro";
    if (score >= 8) return "Smart Money Manager";
    return "Financial Novice";
  };

  // Captures the certificate card as a real PNG file and opens the OS share
  // sheet, which includes "Save Image" / "Save to Files" — an actual
  // downloadable certificate, not just a text message about one.
  const handleDownload = async () => {
    if (!certificateRef.current?.capture) return;
    setIsDownloading(true);
    try {
      const uri = await certificateRef.current.capture();
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Not Available", "Saving/sharing isn't available on this device.");
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "Save or share your FinLit certificate",
      });
    } catch {
      Alert.alert("Error", "Could not generate your certificate. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-brand-slateBg"
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center px-5 pt-16 pb-4">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-brand-bg justify-center items-center border border-brand-border shadow-sm">
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </Pressable>
        <View className="ml-3">
          <Text className="text-[22px] font-inter-bold text-brand-textPrimary">Certificate</Text>
        </View>
      </View>

      {isUnlocked ? (
        <View className="px-5">
          {/* Certificate Card — wrapped so it can be captured as a real image */}
          <ViewShot ref={certificateRef} options={{ format: "png", quality: 1 }}>
          <View className="bg-brand-bg rounded-3xl border-2 border-brand-gold/30 shadow-xl overflow-hidden mb-6">
            {/* Gold banner */}
            <View className="bg-brand-navy py-6 items-center">
              <View className="w-20 h-20 bg-brand-gold/20 rounded-full items-center justify-center mb-3 border-2 border-brand-gold/40">
                <Text className="text-4xl">🏆</Text>
              </View>
              <Text className="text-brand-gold text-[10px] font-inter-bold uppercase tracking-[0.2em]">
                Certificate of Completion
              </Text>
              <Text className="text-brand-textOnDark text-2xl font-inter-bold mt-2">FinLit Ghana</Text>
            </View>

            {/* Body */}
            <View className="px-8 py-8 items-center">
              <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-[0.15em] mb-2">
                This certifies that
              </Text>
              <Text className="text-brand-textPrimary text-3xl font-inter-bold mb-2">
                {userName}
              </Text>

              <View className="w-16 h-px bg-brand-gold/40 my-4" />

              <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-[0.15em] mb-2">
                Has successfully completed the
              </Text>
              <Text className="text-brand-textPrimary text-lg font-inter-bold text-center">
                Financial Literacy Pathway
              </Text>
              <Text className="text-brand-gray text-xs font-inter text-center mt-1.5 leading-5">
                {lessonsCompleted} lessons • {xp} XP earned • Level: {getLevelLabel()}
              </Text>

              <View className="w-16 h-px bg-brand-gold/40 my-5" />

              {goal ? (
                <View className="bg-brand-emerald/5 border border-brand-emerald/15 rounded-xl px-4 py-2.5 mb-4">
                  <Text className="text-brand-emerald text-[11px] font-inter-semibold text-center">
                    🎯 Goal: {goal}
                  </Text>
                </View>
              ) : null}

              <Text className="text-brand-gray text-xs font-inter mb-1">
                {completedDate}
              </Text>
              <Text className="text-brand-gray/50 text-[10px] font-inter">
                Member since {joinedDate}
              </Text>

              {/* Decorative seal */}
              <View className="mt-6 flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-full bg-brand-gold/15 items-center justify-center border border-brand-gold/30">
                  <Ionicons name="shield-checkmark" size={14} color={colors.gold} />
                </View>
                <Text className="text-brand-gold text-[10px] font-inter-bold uppercase tracking-wider">
                  Verified by FinLit
                </Text>
              </View>
            </View>
          </View>
          </ViewShot>

          {/* Actions */}
          <View className="flex-row gap-3 mb-6">
            <Pressable
              onPress={handleDownload}
              disabled={isDownloading}
              style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }], opacity: isDownloading ? 0.7 : 1 })}
              className="flex-1 bg-brand-emerald h-12 rounded-2xl shadow-sm flex-row justify-center items-center"
            >
              {isDownloading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="download-outline" size={18} color="white" />
                  <Text className="text-brand-textOnDark font-inter-semibold text-sm ml-2 uppercase tracking-wider">
                    Download
                  </Text>
                </>
              )}
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}
              className="flex-1 bg-brand-navy h-12 rounded-2xl shadow-sm flex-row justify-center items-center"
            >
              <Ionicons name="arrow-back" size={18} color="white" />
              <Text className="text-brand-textOnDark font-inter-semibold text-sm ml-2 uppercase tracking-wider">
                Back
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        /* Locked State */
        <View className="px-5">
          <View className="bg-brand-bg rounded-2xl p-8 border border-brand-border items-center shadow-sm">
            <View className="w-20 h-20 bg-brand-slateBg rounded-full items-center justify-center mb-4">
              <Text className="text-4xl">🔒</Text>
            </View>
            <Text className="text-brand-textPrimary text-lg font-inter-semibold mb-2 text-center">
              Certificate Locked
            </Text>
            <Text className="text-brand-gray text-sm text-center font-inter leading-5 mb-4">
              Complete all {LESSON_MODULES.length} lessons to earn your FinLit Financial Literacy Certificate.
            </Text>

            <View className="h-3 bg-brand-slateBg rounded-full w-full overflow-hidden mb-2">
              <View
                className="h-full bg-brand-emerald rounded-full"
                style={{ width: `${(lessonsCompleted / LESSON_MODULES.length) * 100}%` }}
              />
            </View>
            <Text className="text-brand-gray text-xs font-inter-medium mb-6">
              {lessonsCompleted}/{LESSON_MODULES.length} lessons completed
            </Text>

            <Pressable
              onPress={() => router.replace("/(tabs)/learn")}
              style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}
              className="bg-brand-emerald px-6 py-3 rounded-xl"
            >
              <Text className="text-brand-textOnDark text-sm font-inter-bold uppercase tracking-wider">
                Continue Learning
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
