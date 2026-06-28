import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PolicySection {
  number: number;
  title: string;
  body: string;
}

const POLICY_SECTIONS: PolicySection[] = [
  {
    number: 1,
    title: "Data Collection",
    body: "We collect name, email, age, financial goals, and learning progress to personalize your experience.",
  },
  {
    number: 2,
    title: "Data Usage",
    body: "Your data is used solely to provide personalized learning paths, track progress, and improve app features. We never sell your personal information.",
  },
  {
    number: 3,
    title: "Data Storage",
    body: "All data is stored securely using encrypted databases. Passwords are hashed using bcrypt. JWT tokens expire after 24 hours.",
  },
  {
    number: 4,
    title: "Third-Party Services",
    body: "We use Firebase Auth for authentication, Cloudinary for media delivery, and analytics tools for engagement tracking. These services have their own privacy policies.",
  },
  {
    number: 5,
    title: "Your Data Rights",
    body: "You can request access to, modification of, or deletion of your personal data at any time by contacting support@finlit.app.",
  },
  {
    number: 6,
    title: "Compliance",
    body: "FinLit complies with Ghana Data Protection Act, 2012 (Act 843). User personal data is stored and processed in accordance with local regulations.",
  },
  {
    number: 7,
    title: "Policy Changes",
    body: "We may update this policy periodically. Users will be notified of significant changes via in-app notification.",
  },
];

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#15803d" />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Last Updated */}
        <View style={styles.updatedBadge}>
          <Ionicons name="time-outline" size={14} color="#6b7280" />
          <Text style={styles.updatedText}>Last updated: June 2026</Text>
        </View>

        {/* Intro */}
        <Text style={styles.introText}>
          At FinLit, we value your privacy and are committed to protecting your
          personal information. This policy outlines how we collect, use, and
          safeguard your data.
        </Text>

        {/* Policy Sections */}
        {POLICY_SECTIONS.map((section) => (
          <View key={section.number} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{section.number}</Text>
              </View>
              <Text style={styles.cardTitle}>{section.title}</Text>
            </View>
            <Text style={styles.cardBody}>{section.body}</Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons name="shield-checkmark" size={20} color="#15803d" />
          <Text style={styles.footerText}>
            Questions? Contact us at support@finlit.app
          </Text>
        </View>
      </ScrollView>
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
  updatedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 12,
  },
  updatedText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  introText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 22,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#15803d",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#166534",
    flex: 1,
  },
  cardBody: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 22,
    paddingLeft: 38,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 13,
    color: "#6b7280",
  },
});
