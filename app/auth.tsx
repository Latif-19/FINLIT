import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
  return (
    <SafeAreaView className="flex-1 bg-brand-slateBg items-center px-6 py-8">
      {/* Decorative Top Accent Backdrop */}
      <View className="absolute top-0 left-0 right-0 h-64 bg-brand-navy/5 rounded-b-[100px] -z-10" />

      {/* Top Branding Section */}
      <View className="items-center flex-1 justify-center">
        <Image
            source={require("../assets/images/finlit-logo.png")}
            className="w-64 h-64"
            resizeMode="contain"
        />
        <Text className="text-[28px] font-inter-bold text-brand-emerald mt-4">
          Financial Freedom Guide
        </Text>
      </View>

      {/* Bottom Actions Section */}
        <View className="w-full max-w-xs mx-auto mb-12 bg-brand-slateBg rounded-2xl p-2">
        {/* Create Account Button */}
        <Pressable
          onPress={() => router.push("/register")}
          style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.95 : 1,
          })}
          className="bg-brand-emerald h-12 rounded-2xl justify-center items-center shadow-lg shadow-brand-emerald/15"
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
          className="border border-brand-navy/20 bg-brand-bg h-12 rounded-2xl justify-center items-center mt-2 shadow-lg shadow-brand-navy/15 active:bg-brand-slateBg"
        >
          <Text className="text-brand-textOnDark text-center font-inter-semibold text-base">
            Already have an account? Sign In
          </Text>
        </Pressable>


      </View>
    </SafeAreaView>
  );
}
