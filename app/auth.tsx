import { router } from "expo-router";
import React from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
  return (
    <ImageBackground
      source={require("../assets/images/money-bg.jpg")}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Dark Overlay for optimal text readability */}
      <View className="flex-1 bg-black/45">
        <SafeAreaView className="flex-1 justify-between px-8 py-6">
          {/* Centered Stylish Title Section */}
          <View className="flex-1 items-center justify-center pt-6 px-4">
            <Text className="text-[68px] font-poppins-extrabold text-white tracking-tight text-center">
              FinLit
            </Text>
            <Text className="text-xl font-jakarta-extrabold text-white tracking-[0.22em] mt-3 text-center uppercase opacity-95">
              Financial Freedom Guide
            </Text>
          </View>

          {/* Action Pill Buttons (Elevated position) */}
          <View className="w-full mb-20">
            {/* Sign up Button */}
            <Pressable
              onPress={() => router.push("/register")}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.98 : 1 }],
                opacity: pressed ? 0.95 : 1,
              })}
              className="bg-white h-14 rounded-full justify-center items-center shadow-lg active:bg-slate-100"
            >
              <Text className="text-brand-navy font-poppins text-lg">
                Sign up
              </Text>
            </Pressable>

            {/* Login Button */}
            <Pressable
              onPress={() => router.push("/login")}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.98 : 1 }],
                opacity: pressed ? 0.95 : 1,
              })}
              className="bg-brand-emerald h-14 rounded-full justify-center items-center mt-4 shadow-lg active:opacity-90"
            >
              <Text className="text-white font-poppins text-lg">
                Login
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}





