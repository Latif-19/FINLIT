import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../store/useUserStore";
import { authService } from "../services/auth";
import { tokenStorage } from "../services/tokenStorage";
import "@/types/navigation";

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
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

    // Authenticate against the backend.
    setIsLoading(true);
    try {
      const res = await authService.login({ email: email.trim(), password });
      const { user, token, refreshToken } = res.data;
      await tokenStorage.setTokens(token, refreshToken);
      useUserStore.getState().setAuthenticatedUser(user);
      router.replace("/(tabs)/home");
    } catch (err: any) {
      // 403 = correct password but email not verified. The backend has just
      // re-sent a fresh code, so take the user straight to the verify screen.
      if (err?.response?.status === 403) {
        router.replace({
          pathname: "/verify-email",
          params: { email: email.trim(), flow: "login" },
        });
        return;
      }
      const message =
        err?.response?.data?.message ||
        (err?.message === "Network Error"
          ? "Cannot reach the server. Is the backend running?"
          : "Unable to sign in. Please try again.");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      className="flex-1 bg-white dark:bg-slate-950"
    >
      {/* Top Money Image Banner */}
      <View className="h-60 w-full relative">
        <ImageBackground
          source={require("../assets/images/money-bg.jpg")}
          className="w-full h-full justify-start pt-14 px-6"
          resizeMode="cover"
        >
          <View className="absolute inset-0 bg-black/20" />
          {/* Back Button over Image */}
          <Pressable
            onPress={() => router.back()}
            className="z-20 w-10 h-10 bg-white/90 rounded-full justify-center items-center shadow-md active:opacity-80 dark:bg-slate-900/90"
          >
            <Ionicons name="chevron-back" size={24} color="#0A2540" />
          </Pressable>
        </ImageBackground>
      </View>

      {/* Main Content White Card overlapping the top banner */}
      <View className="flex-1 -mt-12 bg-white rounded-t-[36px] px-6 pt-4 dark:bg-slate-950">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo placed directly on top of Welcome back title */}
          <View className="items-center mt-2 mb-6">
            <Image
              source={require("../assets/images/finlit-logo.png")}
              className="w-20 h-20"
              resizeMode="contain"
            />
            <Text className="text-[32px] font-inter-bold text-brand-navy mt-2 tracking-tight dark:text-slate-100">
              Welcome back
            </Text>
            <Text className="text-brand-gray font-inter text-sm mt-1 text-center dark:text-slate-400">
              Login to your account
            </Text>
          </View>

          {/* Form Controls */}
          <View className="space-y-4">
            {/* Email Address */}
            <View>
              <Text className="text-brand-dark font-inter-semibold mb-1.5 text-sm dark:text-slate-200">Email Address</Text>
              <View className="border border-slate-200 rounded-2xl flex-row items-center px-4 bg-brand-slateBg/40 dark:border-slate-700">
                <Ionicons name="mail-outline" size={20} color="#6B7280" style={{ marginRight: 10 }} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 py-3.5 text-base text-brand-dark font-inter dark:text-slate-100"
                />
              </View>
            </View>

            {/* Password */}
            <View className="mt-4">
              <Text className="text-brand-dark font-inter-semibold mb-1.5 text-sm dark:text-slate-200">Password</Text>
              <View className="border border-slate-200 rounded-2xl flex-row items-center px-4 bg-brand-slateBg/40 dark:border-slate-700">
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={{ marginRight: 10 }} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  className="flex-1 py-3.5 text-base text-brand-dark font-inter dark:text-slate-100"
                />
                <Pressable onPress={() => setPasswordVisible(!passwordVisible)} className="p-1">
                  <Ionicons
                    name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#6B7280"
                  />
                </Pressable>
              </View>
            </View>

            {/* Forgot Password */}
            <Pressable
              onPress={() => router.push("/forgot-password")}
              className="mt-2 self-end active:opacity-70"
            >
              <Text className="text-brand-emerald font-inter-semibold text-sm dark:text-emerald-400">
                Forgot Password?
              </Text>
            </Pressable>

            {/* Error Message */}
            {error ? (
              <View className="bg-red-50 border border-red-100 rounded-2xl p-3.5 mt-4 flex-row items-center dark:bg-red-950/50">
                <Ionicons name="alert-circle-outline" size={18} color="#dc2626" />
                <Text className="text-red-600 font-inter-semibold text-xs ml-2 flex-1 dark:text-red-400">{error}</Text>
              </View>
            ) : null}

            {/* Sign In Button */}
            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.98 : 1 }],
                opacity: pressed || isLoading ? 0.95 : 1,
              })}
              className="bg-brand-emerald h-14 rounded-full mt-6 shadow-md shadow-brand-emerald/20 justify-center items-center active:opacity-90"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white text-center font-inter-semibold text-lg">Login</Text>
              )}
            </Pressable>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
              <Text className="mx-4 text-brand-gray font-inter-semibold text-xs uppercase tracking-wider dark:text-slate-400">OR</Text>
              <View className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
            </View>

            {/* Google */}
            <Pressable
              onPress={() => Alert.alert("Coming Soon", "Google sign-in will be available in the next update.")}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.98 : 1 }],
                opacity: pressed ? 0.95 : 1,
              })}
              className="border border-slate-200 bg-white rounded-full h-14 flex-row justify-center items-center shadow-sm active:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:active:bg-slate-800"
            >
              <Image
                source={require("../assets/images/google-logo.jpg")}
                className="w-6 h-6 rounded-full"
                resizeMode="contain"
              />
              <Text className="ml-3 font-inter-semibold text-brand-dark text-base dark:text-slate-100">
                Continue with Google
              </Text>
            </Pressable>

            {/* Facebook */}
            <Pressable
              onPress={() => Alert.alert("Coming Soon", "Facebook sign-in will be available in the next update.")}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.98 : 1 }],
                opacity: pressed ? 0.95 : 1,
              })}
              className="border border-slate-200 bg-white rounded-full h-14 flex-row justify-center items-center mt-3 shadow-sm active:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:active:bg-slate-800"
            >
              <Image
                source={require("../assets/images/facebook-logo.jpg")}
                className="w-6 h-6 rounded-full"
                resizeMode="contain"
              />
              <Text className="ml-3 font-inter-semibold text-brand-dark text-base dark:text-slate-100">
                Continue with Facebook
              </Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8 pb-4">
            <Text className="text-brand-gray font-inter text-sm dark:text-slate-400">
              {"Don't have an account?"}
            </Text>

            <Pressable
              onPress={() => router.replace("/register")}
            >
              <Text className="text-brand-emerald font-inter-bold text-sm ml-1.5 dark:text-emerald-400">
                Sign up
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}