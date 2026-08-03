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
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useUserStore } from "../store/useUserStore";
import { authService } from "../services/auth";
import { tokenStorage } from "../services/tokenStorage";
import "@/types/navigation";

export default function LoginScreen() {
  const colors = useThemeColors();
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
      // Accounts that verified but never finished the onboarding assessment
      // (e.g. the app was closed mid-flow) go there instead of the dashboard.
      router.replace(user.lastAssessedAt ? "/(tabs)/home" : "/assessment");
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      className="flex-1 bg-brand-slateBg"
    >
      {/* Decorative Accent Background */}
      <View className="absolute top-0 left-0 right-0 h-64 bg-brand-navy/5 rounded-b-[100px] -z-10" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 40 }}
        className="px-6"
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="absolute top-14 left-6 z-10 p-2.5 bg-brand-bg rounded-full shadow-md border border-brand-border active:opacity-80"
        >
          <Ionicons name="arrow-back" size={22} color={colors.navy} />
        </Pressable>

        {/* Branding header */}
        <View className="items-center mt-12">
          <View className="w-16 h-16 bg-brand-bg rounded-2xl items-center justify-center shadow-md border border-brand-border overflow-hidden">
            <Image
              source={require("../assets/images/finlit-logo.jpeg")}
              className="w-14 h-14"
              resizeMode="contain"
            />
          </View>
          <Text className="text-[32px] font-inter-bold text-brand-navy mt-4 tracking-tight">
            Welcome Back
          </Text>
          <Text className="text-brand-gray font-inter text-sm mt-1 text-center">
            Sign in to continue your financial journey.
          </Text>
        </View>

        {/* Form Card */}
        <View className="bg-brand-bg rounded-3xl p-6 shadow-lg shadow-slate-100/40 border border-brand-border mt-8">
          {/* Email Address */}
          <View>
            <Text className="text-brand-dark font-inter-semibold mb-1.5 text-sm">Email Address</Text>
            <View className="border border-brand-border rounded-2xl flex-row items-center px-4 bg-brand-slateBg/40">
              <Ionicons name="mail-outline" size={20} color={colors.gray} style={{ marginRight: 10 }} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 py-3.5 text-base text-brand-dark font-inter"
              />
            </View>
          </View>

          {/* Password */}
          <View className="mt-4">
            <Text className="text-brand-dark font-inter-semibold mb-1.5 text-sm">Password</Text>
            <View className="border border-brand-border rounded-2xl flex-row items-center px-4 bg-brand-slateBg/40">
              <Ionicons name="lock-closed-outline" size={20} color={colors.gray} style={{ marginRight: 10 }} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                className="flex-1 py-3.5 text-base text-brand-dark font-inter"
              />
              <Pressable onPress={() => setPasswordVisible(!passwordVisible)} className="p-1">
                <Ionicons
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.gray}
                />
              </Pressable>
            </View>
          </View>

          {/* Forgot Password */}
          <Pressable
            onPress={() => router.push("/forgot-password")}
            className="mt-3 self-end active:opacity-70"
          >
            <Text className="text-brand-emerald font-inter-semibold text-sm">
              Forgot Password?
            </Text>
          </Pressable>

          {/* Error Message */}
          {error ? (
            <View className="bg-red-50 border border-red-100 rounded-2xl p-3.5 mt-4 flex-row items-center">
              <Ionicons name="alert-circle-outline" size={18} color="#dc2626" />
              <Text className="text-red-600 font-inter-semibold text-xs ml-2 flex-1">{error}</Text>
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
            className="bg-brand-navy h-14 rounded-2xl mt-6 shadow-md shadow-brand-navy/10 justify-center items-center"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white text-center font-inter-semibold text-base">Sign In</Text>
            )}
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-brand-slateBg" />
            <Text className="mx-4 text-brand-gray font-inter-semibold text-xs uppercase tracking-wider">OR</Text>
            <View className="flex-1 h-px bg-brand-slateBg" />
          </View>

          {/* Google */}
          <Pressable
            onPress={() => Alert.alert("Coming Soon", "Google sign-in will be available in the next update.")}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.98 : 1 }],
              opacity: pressed ? 0.95 : 1,
            })}
            className="border border-brand-border bg-brand-bg rounded-2xl h-14 flex-row justify-center items-center shadow-sm active:bg-brand-slateBg"
          >
            <Image
              source={require("../assets/images/google-logo.jpg")}
              className="w-6 h-6 rounded-full"
              resizeMode="contain"
            />
            <Text className="ml-3 font-inter-semibold text-brand-dark text-base">
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
            className="border border-brand-border bg-brand-bg rounded-2xl h-14 flex-row justify-center items-center mt-3 shadow-sm active:bg-brand-slateBg"
          >
            <Image
              source={require("../assets/images/facebook-logo.jpg")}
              className="w-6 h-6 rounded-full"
              resizeMode="contain"
            />
            <Text className="ml-3 font-inter-semibold text-brand-dark text-base">
              Continue with Facebook
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-8 pb-4">
          <Text className="text-brand-gray font-inter text-sm">
            {"Don't have an account?"}
          </Text>

          <Pressable
            onPress={() => router.replace("/register")}
          >
            <Text className="text-brand-emerald font-inter-bold text-sm ml-1.5">
              Create Account
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}