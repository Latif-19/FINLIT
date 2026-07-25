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
    <SafeAreaView edges={["top"]} className="flex-1 bg-brand-slateBg">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-slate-200 bg-white">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-brand-emerald/5 items-center justify-center active:opacity-80">
          <Ionicons name="arrow-back" size={24} color="#16A34A" />
        </Pressable>
        <Text className="text-lg font-inter-bold text-brand-navy">Privacy Policy</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Last Updated */}
        <View className="flex-row items-center self-start bg-brand-slateBg px-3 py-1.5 rounded-full gap-1.5 mb-3">
          <Ionicons name="time-outline" size={14} color="#6b7280" />
          <Text className="text-xs text-brand-gray font-inter-medium">Last updated: June 2026</Text>
        </View>

        {/* Intro */}
        <Text className="text-sm text-brand-gray leading-[22px] mb-5 font-inter">
          At FinLit, we value your privacy and are committed to protecting your
          personal information. This policy outlines how we collect, use, and
          safeguard your data.
        </Text>

        {/* Policy Sections */}
        {POLICY_SECTIONS.map((section) => (
          <View key={section.number} className="bg-white rounded-2xl p-[18px] mb-3 shadow-md">
            <View className="flex-row items-center mb-2.5 gap-2.5">
              <View className="w-7 h-7 rounded-full bg-brand-emerald/10 items-center justify-center">
                <Text className="text-[13px] font-inter-bold text-brand-emerald">{section.number}</Text>
              </View>
              <Text className="text-base font-inter-bold text-brand-navy flex-1">{section.title}</Text>
            </View>
            <Text className="text-sm text-brand-gray leading-[22px] pl-[38px] font-inter">{section.body}</Text>
          </View>
        ))}

        {/* Footer */}
        <View className="flex-row items-center justify-center gap-2 mt-4 py-4">
          <Ionicons name="shield-checkmark" size={20} color="#16A34A" />
          <Text className="text-xs text-brand-gray font-inter">
            Questions? Contact us at support@finlit.app
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
