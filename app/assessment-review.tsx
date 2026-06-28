import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
} from "react-native";
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
      color: "#15803d",
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
    color: score >= 11 ? "#15803d" : score >= 7 ? "#b45309" : "#6b7280",
  },
  {
    category: "Savings",
    level:
      score >= 13 ? "Consistent" : score >= 8 ? "Moderate" : "Starting Out",
    icon: "cash-outline",
    color: score >= 13 ? "#15803d" : score >= 8 ? "#b45309" : "#6b7280",
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
    color: score >= 12 ? "#15803d" : score >= 6 ? "#b45309" : "#6b7280",
  },
];

const getLevelInfo = (
  score: number
): { level: string; label: string; color: string } => {
  if (score >= 13) {
    return { level: "Level 3", label: "Pro Builder", color: "#1d4ed8" };
  }
  if (score >= 8) {
    return { level: "Level 2", label: "Manager", color: "#15803d" };
  }
  return { level: "Level 1", label: "Novice", color: "#b45309" };
};

export default function AssessmentReviewScreen() {
  const score = useUserStore((s) => s.score);
  const goal = useUserStore((s) => s.goal);

  const tier = getTierInfo(score);
  const breakdowns = getBreakdowns(score);
  const levelInfo = getLevelInfo(score);
  const hasAssessed = score > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#15803d" />
        </Pressable>
        <Text style={styles.headerTitle}>Your Assessment</Text>
        <View style={{ width: 40 }} />
      </View>

      {hasAssessed ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Tier Badge */}
          <View style={[styles.tierCard, { borderColor: tier.color + "30" }]}>
            <View style={[styles.tierIconWrap, { backgroundColor: tier.bg }]}>
              <Ionicons name={tier.icon} size={32} color={tier.color} />
            </View>
            <Text style={[styles.tierLabel, { color: tier.color }]}>
              {tier.label}
            </Text>
            <Text style={styles.tierSub}>Your Financial Tier</Text>
          </View>

          {/* Score Circle */}
          <View style={styles.scoreCard}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>{score}</Text>
              <Text style={styles.scoreOf}>/ 15</Text>
            </View>
            <Text style={styles.scoreLabel}>Assessment Score</Text>
          </View>

          {/* Goal Badge */}
          {goal ? (
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Ionicons name="flag-outline" size={18} color="#15803d" />
                <Text style={styles.goalTitle}>Your Financial Goal</Text>
              </View>
              <View style={styles.goalBadge}>
                <Text style={styles.goalText}>{goal}</Text>
              </View>
            </View>
          ) : null}

          {/* Tier Breakdown */}
          <View style={styles.breakdownCard}>
            <Text style={styles.sectionTitle}>Skill Breakdown</Text>
            {breakdowns.map((item) => (
              <View key={item.category} style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                  <Text style={styles.breakdownCategory}>{item.category}</Text>
                </View>
                <View
                  style={[
                    styles.breakdownBadge,
                    { backgroundColor: item.color + "15" },
                  ]}
                >
                  <Text
                    style={[styles.breakdownLevel, { color: item.color }]}
                  >
                    {item.level}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Level Card */}
          <View style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <Ionicons name="bar-chart-outline" size={20} color={levelInfo.color} />
              <Text style={styles.sectionTitle}>Your Level</Text>
            </View>
            <View style={styles.levelContent}>
              <Text style={[styles.levelNumber, { color: levelInfo.color }]}>
                {levelInfo.level}
              </Text>
              <Text style={[styles.levelLabel, { color: levelInfo.color }]}>
                {levelInfo.label}
              </Text>
            </View>
          </View>

          {/* Last Assessed */}
          <View style={styles.lastAssessed}>
            <Ionicons name="time-outline" size={14} color="#9ca3af" />
            <Text style={styles.lastAssessedText}>
              Last assessed: June 2026
            </Text>
          </View>

          {/* Disclaimer */}
          <Text style={styles.disclaimer}>
            Retaking the assessment will update your learning path and
            recommendations.
          </Text>

          {/* Retake Button */}
          <Pressable
            onPress={() => router.push("/assessment")}
            style={styles.retakeButton}
          >
            <Ionicons name="refresh-outline" size={20} color="#ffffff" />
            <Text style={styles.retakeButtonText}>Retake Assessment</Text>
          </Pressable>
        </ScrollView>
      ) : (
        /* Empty State - Never Assessed */
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="school-outline" size={56} color="#9ca3af" />
          </View>
          <Text style={styles.emptyTitle}>
            {"You haven't taken the assessment yet"}
          </Text>
          <Text style={styles.emptyBody}>
            Complete your financial assessment to discover your tier, get
            personalized learning paths, and track your progress.
          </Text>
          <Pressable
            onPress={() => router.push("/assessment")}
            style={styles.takeButton}
          >
            <Ionicons name="rocket-outline" size={20} color="#ffffff" />
            <Text style={styles.takeButtonText}>Take Assessment</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  /* Tier Card */
  tierCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  tierIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  tierLabel: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  tierSub: {
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "500",
  },

  /* Score Card */
  scoreCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#15803d",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: "800",
    color: "#15803d",
  },
  scoreOf: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9ca3af",
    marginTop: -4,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "600",
  },

  /* Goal Card */
  goalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },
  goalBadge: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  goalText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#15803d",
  },

  /* Breakdown Card */
  breakdownCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 14,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  breakdownLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  breakdownCategory: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  breakdownBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  breakdownLevel: {
    fontSize: 13,
    fontWeight: "600",
  },

  /* Level Card */
  levelCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  levelContent: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  levelNumber: {
    fontSize: 28,
    fontWeight: "800",
  },
  levelLabel: {
    fontSize: 18,
    fontWeight: "600",
  },

  /* Last Assessed */
  lastAssessed: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 8,
  },
  lastAssessedText: {
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "500",
  },

  /* Disclaimer */
  disclaimer: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
    lineHeight: 18,
  },

  /* Retake Button */
  retakeButton: {
    backgroundColor: "#15803d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#15803d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },

  /* Empty State */
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
    marginBottom: 10,
  },
  emptyBody: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  takeButton: {
    backgroundColor: "#15803d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: "#15803d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  takeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});
