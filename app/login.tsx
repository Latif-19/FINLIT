import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../store/useUserStore";
import "@/types/navigation";

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Authenticate the user
    useUserStore.getState().login("", email);

    router.replace("/(tabs)/home");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      className="flex-1 bg-gray-50"
    >
      {/* Decorative Accent Background */}
      <View className="absolute top-0 left-0 right-0 h-64 bg-green-800/10 rounded-b-[100px] -z-10" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 40 }}
        className="px-6"
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="absolute top-14 left-6 z-10 p-2.5 bg-white rounded-full shadow-sm border border-gray-100 active:opacity-80"
        >
          <Ionicons name="arrow-back" size={22} color="#15803d" />
        </Pressable>

        {/* Branding header */}
        <View className="items-center mt-12">
          <View className="w-16 h-16 bg-white rounded-2xl items-center justify-center shadow-sm border border-gray-100 overflow-hidden">
            <Image
              source={require("../assets/images/finlit-logo.jpeg")}
              className="w-14 h-14"
              resizeMode="contain"
            />
          </View>
          <Text className="text-3xl font-extrabold text-green-950 mt-4 tracking-tight">
            Welcome Back
          </Text>
          <Text className="text-gray-500 text-sm mt-1 text-center">
            Sign in to continue your financial journey.
          </Text>
        </View>

        {/* Form Card */}
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mt-8">
          {/* Email Address */}
          <View>
            <Text className="text-gray-700 font-semibold mb-1.5 text-sm">Email Address</Text>
            <View className="border border-gray-300 rounded-xl flex-row items-center px-3.5 bg-gray-50/30">
              <Ionicons name="mail-outline" size={20} color="gray" className="mr-2" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 py-3 text-base text-gray-800"
              />
            </View>
          </View>

          {/* Password */}
          <View className="mt-4">
            <Text className="text-gray-700 font-semibold mb-1.5 text-sm">Password</Text>
            <View className="border border-gray-300 rounded-xl flex-row items-center px-3.5 bg-gray-50/30">
              <Ionicons name="lock-closed-outline" size={20} color="gray" className="mr-2" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                className="flex-1 py-3 text-base text-gray-800"
              />
              <Pressable onPress={() => setPasswordVisible(!passwordVisible)} className="p-1">
                <Ionicons
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="gray"
                />
              </Pressable>
            </View>
          </View>

          {/* Forgot Password */}
          <Pressable
            onPress={() => router.push("/forgot-password")}
            className="mt-3 self-end active:opacity-70"
          >
            <Text className="text-green-700 font-semibold text-sm">
              Forgot Password?
            </Text>
          </Pressable>

          {/* Error Message */}
          {error ? (
            <View className="bg-red-50 border border-red-100 rounded-xl p-3.5 mt-4 flex-row items-center">
              <Ionicons name="alert-circle-outline" size={18} color="#dc2626" />
              <Text className="text-red-600 font-semibold text-xs ml-2 flex-1">{error}</Text>
            </View>
          ) : null}

          {/* Sign In Button */}
          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.98 : 1 }],
              opacity: pressed ? 0.95 : 1,
            })}
            className="bg-green-700 py-4 rounded-xl mt-6 shadow-sm active:bg-green-800"
          >
            <Text className="text-white text-center font-bold text-base">Sign In</Text>
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-400 text-xs font-bold">OR</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Google */}
          <Pressable
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.98 : 1 }],
              opacity: pressed ? 0.95 : 1,
            })}
            className="border border-gray-200 bg-white rounded-xl py-4 flex-row justify-center items-center shadow-sm"
          >
            <Image
              source={require("../assets/images/google-logo.jpg")}
              className="w-9 h-9 rounded-full"
              resizeMode="contain"
            />
            <Text className="ml-3 font-bold text-gray-700 text-base">
              Continue with Google
            </Text>
          </Pressable>

          {/* Facebook */}
          <Pressable
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.98 : 1 }],
              opacity: pressed ? 0.95 : 1,
            })}
            className="border border-gray-200 bg-white rounded-xl py-4 flex-row justify-center items-center mt-3 shadow-sm"
          >
            <Image
              source={require("../assets/images/facebook-logo.jpg")}
              className="w-9 h-9 rounded-full"
              resizeMode="contain"
            />
            <Text className="ml-3 font-bold text-gray-700 text-base">
              Continue with Facebook
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-8 pb-4">
          <Text className="text-gray-500 text-sm">
            {"Don't have an account?"}
          </Text>

          <Pressable
            onPress={() => router.replace("/register")}
          >
            <Text className="text-green-700 font-bold text-sm ml-1">
              Create Account
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}