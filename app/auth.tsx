import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 justify-between px-6 py-8">
      {/* Decorative Top Accent Backdrop */}
      <View className="absolute top-0 left-0 right-0 h-64 bg-green-800/10 rounded-b-[100px] -z-10" />

      {/* Top Branding Section */}
      <View className="items-center mt-6">
        <View className="w-24 h-24 bg-white rounded-3xl items-center justify-center shadow-sm border border-gray-100 overflow-hidden">
          <Image
            source={require("../assets/images/finlit-logo.jpeg")}
            className="w-20 h-20"
            resizeMode="contain"
          />
        </View>
        <Text className="text-3xl font-extrabold text-green-900 mt-4 tracking-tight">
          FinLit
        </Text>
        <Text className="text-xs uppercase font-bold text-green-700 tracking-widest mt-2 bg-green-50 px-3 py-1 rounded-full">
          Financial Freedom Guide
        </Text>
      </View>

      {/* Mid Section: Engaging Value Proposition */}
      <View className="my-8 px-2">
        <Text className="text-4xl font-extrabold text-gray-900 text-center tracking-tight leading-10">
          Master Your Money.{"\n"}
          <Text className="text-green-700">Own Your Future.</Text>
        </Text>
        
        <Text className="text-center text-gray-500 text-base mt-4 leading-6 px-4">
          Join thousands of smart savers building wealth, tracking milestones, and learning the secrets of compounding growth.
        </Text>

        {/* Core Value Proposition Pills */}
        <View className="flex-row flex-wrap justify-center gap-2 mt-6">
          <View className="flex-row items-center bg-white border border-gray-200/80 px-3.5 py-2 rounded-full shadow-sm">
            <Text className="text-sm font-semibold text-gray-700">🎯 Goal-Driven</Text>
          </View>
          <View className="flex-row items-center bg-white border border-gray-200/80 px-3.5 py-2 rounded-full shadow-sm">
            <Text className="text-sm font-semibold text-gray-700">🎓 Bite-sized Lessons</Text>
          </View>
          <View className="flex-row items-center bg-white border border-gray-200/80 px-3.5 py-2 rounded-full shadow-sm">
            <Text className="text-sm font-semibold text-gray-700">👥 Smart Community</Text>
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
          className="bg-green-700 py-[18px] rounded-2xl shadow-lg shadow-green-700/20"
        >
          <Text className="text-white text-center font-bold text-lg">
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
          className="border border-green-700/30 bg-white py-[18px] rounded-2xl mt-4"
        >
          <Text className="text-green-700 text-center font-bold text-lg">
            Already have an account? Sign In
          </Text>
        </Pressable>

        {/* Professional Emoji Branding Footer */}
        <View className="items-center mt-10">
          <Text className="text-gray-400 text-sm font-semibold tracking-wider">
            📚 Learn  •  💰 Save  •  📈 Grow
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
