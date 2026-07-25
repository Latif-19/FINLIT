import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../store/useUserStore";
import "@/types/navigation";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface TierInfo {
  label: string;
  color: string;
  bg: string;
  icon: IoniconsName;
}

interface BreakdownItem {
  category: string;
  level: string;
  icon: IoniconsName;
  color: string;
}

const getTierInfo = (score: number): TierInfo => {
  if (score >= 13) {
    return {
      label: "Wealth Builder Pro",
      color: "#1d4ed8",
      bg: "#dbeafe",
      icon: "trophy",
    };
  }
  if (score >= 9) {
    return {
      label: "Smart Money Manager",
      color: "#16A34A",
      bg: "#dcfce7",
      icon: "ribbon",
    };
  }
  return {
    label: "Financial Novice",
    color: "#b45309",
    bg: "#fef3c7",
    icon: "school",
  };
};

const getBreakdowns = (score: number): BreakdownItem[] => [
  {
    category: "Budgeting",
    level: score >= 11 ? "Advanced" : score >= 7 ? "Intermediate" : "Beginner",
    icon: "wallet-outline",
    color: score >= 11 ? "#16A34A" : score >= 7 ? "#b45309" : "#6b7280",
  },
  {
    category: "Savings",
    level:
      score >= 13 ? "Consistent" : score >= 8 ? "Moderate" : "Starting Out",
    icon: "cash-outline",
    color: score >= 13 ? "#16A34A" : score >= 8 ? "#b45309" : "#6b7280",
  },
  {
    category: "Investing",
    level:
      score >= 12
        ? "Knowledgeable"
        : score >= 6
          ? "Interested"
          : "Uninitiated",
    icon: "trending-up-outline",
    color: score >= 12 ? "#16A34A" : score >= 6 ? "#b45309" : "#6b7280",
  },
];

const getLevelInfo = (
  score: number
): { level: string; label: string; color: string } => {
  if (score >= 13) {
    return { level: "Level 3", label: "Pro Builder", color: "#1d4ed8" };
  }
  if (score >= 8) {
    return { level: "Level 2", label: "Manager", color: "#16A34A" };
  }
  return { level: "Level 1", label: "Novice", color: "#b45309" };
};

export default function AssessmentReviewScreen() {
  const score = useUserStore((s) => s.score);
  const goal = useUserStore((s) => s.goal);
  const lastAssessedAt = useUserStore((s) => s.lastAssessedAt);

  const tier = getTierInfo(score);
  const breakdowns = getBreakdowns(score);
  const levelInfo = getLevelInfo(score);
  const hasAssessed = score > 0;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-brand-slateBg">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-slate-200 bg-white">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-brand-emerald/5 items-center justify-center active:opacity-80"
        >
          <Ionicons name="arrow-back" size={24} color="#0A2540" />
        </Pressable>
        <Text className="text-lg font-inter-bold text-brand-navy">
          Your Assessment
        </Text>
        <View className="w-10" />
      </View>

      {hasAssessed ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Tier Badge */}
          <View
            className="bg-white rounded-3xl p-6 items-center mb-3.5 border border-slate-100 shadow-md"
            style={{ borderColor: tier.color + "30" }}
          >
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-3"
              style={{ backgroundColor: tier.bg }}
            >
              <Ionicons name={tier.icon} size={32} color={tier.color} />
            </View>
            <Text
              className="text-[22px] font-inter-bold mb-1"
              style={{ color: tier.color }}
            >
              {tier.label}
            </Text>
            <Text className="text-xs text-brand-gray font-inter-medium">
              Your Financial Tier
            </Text>
          </View>

          {/* Score Circle */}
          <View className="bg-white rounded-3xl p-6 items-center mb-3.5 shadow-md">
            <View className="w-[100px] h-[100px] rounded-full border-4 border-brand-emerald items-center justify-center mb-2.5">
              <Text className="text-3xl font-inter-bold text-brand-emerald">
                {score}
              </Text>
              <Text className="text-sm font-inter-semibold text-brand-gray -mt-1">
                / 15
              </Text>
            </View>
            <Text className="text-sm text-brand-gray font-inter-semibold">
              Assessment Score
            </Text>
          </View>

          {/* Goal Badge */}
          {goal ? (
            <View className="bg-white rounded-3xl p-4 mb-3.5 shadow-md">
              <View className="flex-row items-center gap-2 mb-2.5">
                <Ionicons name="flag-outline" size={18} color="#16A34A" />
                <Text className="text-[15px] font-inter-bold text-brand-navy">
                  Your Financial Goal
                </Text>
              </View>
              <View className="bg-brand-emerald/10 px-4 py-2.5 rounded-xl self-start">
                <Text className="text-sm font-inter-semibold text-brand-emerald">
                  {goal}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Tier Breakdown */}
          <View className="bg-white rounded-3xl p-4 mb-3.5 shadow-md">
            <Text className="text-base font-inter-bold text-brand-navy mb-3.5">
              Skill Breakdown
            </Text>
            {breakdowns.map((item) => (
              <View
                key={item.category}
                className="flex-row items-center justify-between py-2.5 border-b border-slate-100"
              >
                <View className="flex-row items-center gap-2.5">
                  <Ionicons name={item.icon} size={20} color={item.color} />
                  <Text className="text-[15px] font-inter-semibold text-brand-navy">
                    {item.category}
                  </Text>
                </View>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: item.color + "15" }}
                >
                  <Text
                    className="text-xs font-inter-semibold"
                    style={{ color: item.color }}
                  >
                    {item.level}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Level Card */}
          <View className="bg-white rounded-3xl p-4 mb-3.5 shadow-md">
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons
                name="bar-chart-outline"
                size={20}
                color={levelInfo.color}
              />
              <Text className="text-base font-inter-bold text-brand-navy">
                Your Level
              </Text>
            </View>
            <View className="flex-row items-baseline gap-2">
              <Text
                className="text-[28px] font-inter-bold"
                style={{ color: levelInfo.color }}
              >
                {levelInfo.level}
              </Text>
              <Text
                className="text-lg font-inter-semibold"
                style={{ color: levelInfo.color }}
              >
                {levelInfo.label}
              </Text>
            </View>
          </View>

          {/* Last Assessed */}
          <View className="flex-row items-center justify-center gap-1.5 mb-2">
            <Ionicons name="time-outline" size={14} color="#9ca3af" />
            <Text className="text-xs text-brand-gray font-inter-medium">
              {lastAssessedAt
                ? `Last assessed: ${new Date(lastAssessedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
                : "Not yet assessed"}
            </Text>
          </View>

          {/* Disclaimer */}
          <Text className="text-xs text-brand-gray text-center mb-4 px-5 leading-[18px]">
            Retaking the assessment will update your learning path and
            recommendations.
          </Text>

          {/* Retake Button */}
          <Pressable
            onPress={() => router.push("/assessment")}
            className="bg-brand-emerald flex-row items-center justify-center gap-2 py-4 rounded-2xl shadow-lg active:opacity-80"
          >
            <Ionicons name="refresh-outline" size={20} color="#ffffff" />
            <Text className="text-base font-inter-bold text-white">
              Retake Assessment
            </Text>
          </Pressable>
        </ScrollView>
      ) : (
        /* Empty State - Never Assessed */
        <View className="flex-1 items-center justify-center p-8">
          <View className="w-[100px] h-[100px] rounded-full bg-slate-100 items-center justify-center mb-5">
            <Ionicons name="school-outline" size={56} color="#9ca3af" />
          </View>
          <Text className="text-lg font-inter-bold text-brand-navy text-center mb-2.5">
            {"You haven't taken the assessment yet"}
          </Text>
          <Text className="text-sm text-brand-gray text-center leading-[22px] mb-7 px-4">
            Complete your financial assessment to discover your tier, get
            personalized learning paths, and track your progress.
          </Text>
          <Pressable
            onPress={() => router.push("/assessment")}
            className="bg-brand-emerald flex-row items-center justify-center gap-2 py-4 px-8 rounded-2xl shadow-lg active:opacity-80"
          >
            <Ionicons name="rocket-outline" size={20} color="#ffffff" />
            <Text className="text-base font-inter-bold text-white">
              Take Assessment
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
