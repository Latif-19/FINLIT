import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
  return (
    <SafeAreaView className="flex-1 bg-brand-slateBg justify-between px-6 py-8">
      {/* Decorative Top Accent Backdrop */}
      <View className="absolute top-0 left-0 right-0 h-64 bg-brand-navy/5 rounded-b-[100px] -z-10" />

      {/* Top Branding Section */}
      <View className="items-center mt-6">
        <View className="w-24 h-24 bg-brand-bg rounded-3xl items-center justify-center shadow-md border border-brand-border overflow-hidden">
          <Image
            source={require("../assets/images/finlit-logo.jpeg")}
            className="w-20 h-20"
            resizeMode="contain"
          />
        </View>
        <Text className="text-[32px] font-inter-bold text-brand-navy mt-4 tracking-tight">
          FinLit
        </Text>
        <Text className="text-xs uppercase font-inter-semibold text-brand-emerald tracking-widest mt-2 bg-brand-emerald/10 px-3.5 py-1.5 rounded-full">
          Financial Freedom Guide
        </Text>
      </View>

      {/* Mid Section: Engaging Value Proposition */}
      <View className="my-8 px-2">
        <Text className="text-[32px] font-inter-bold text-brand-navy text-center tracking-tight leading-[38px]">
          Master Your Money.{"\n"}
          <Text className="text-brand-emerald">Own Your Future.</Text>
        </Text>
        
        <Text className="text-center text-brand-gray font-inter text-base mt-4 leading-6 px-4">
          Join thousands of smart savers building wealth, tracking milestones, and learning the secrets of compounding growth.
        </Text>

        {/* Core Value Proposition Pills */}
        <View className="flex-row flex-wrap justify-center gap-2 mt-6">
          <View className="flex-row items-center bg-brand-bg border border-brand-border px-4 py-2 rounded-2xl shadow-sm">
            <Text className="text-sm font-inter-medium text-brand-dark">🎯 Goal-Driven</Text>
          </View>
          <View className="flex-row items-center bg-brand-bg border border-brand-border px-4 py-2 rounded-2xl shadow-sm">
            <Text className="text-sm font-inter-medium text-brand-dark">🎓 Bite-sized Lessons</Text>
          </View>
          <View className="flex-row items-center bg-brand-bg border border-brand-border px-4 py-2 rounded-2xl shadow-sm">
            <Text className="text-sm font-inter-medium text-brand-dark">👥 Smart Community</Text>
          </View>
        </View>
      </View>

      {/* Bottom Actions Section */}
      <View className="w-full mb-4">
        {/* Create Account Button */}
        <Pressable
          onPress={() => router.push("/register")}
          style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.95 : 1,
          })}
          className="bg-brand-navy h-14 rounded-2xl justify-center items-center shadow-lg shadow-brand-navy/15"
        >
          <Text className="text-white text-center font-inter-semibold text-base">
            Create Free Account
          </Text>
        </Pressable>

        {/* Sign In Button */}
        <Pressable
          onPress={() => router.push("/login")}
          style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.95 : 1,
          })}
          className="border border-brand-navy/20 bg-brand-bg h-14 rounded-2xl justify-center items-center mt-4 active:bg-brand-slateBg"
        >
          <Text className="text-brand-navy text-center font-inter-semibold text-base">
            Already have an account? Sign In
          </Text>
        </Pressable>

        {/* Professional Emoji Branding Footer */}
        <View className="items-center mt-10">
          <Text className="text-brand-gray font-inter-semibold text-xs tracking-widest uppercase">
            📚 Learn  •  💰 Save  •  📈 Grow
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
