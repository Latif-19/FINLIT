import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { Pressable, Text, TextInput, View, KeyboardAvoidingView, Platform, ScrollView, Image, Keyboard, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../store/useUserStore";
import { authService } from "../services/auth";
import { tokenStorage } from "../services/tokenStorage";
import "@/types/navigation";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Create the account on the backend.
    setIsLoading(true);
    try {
      const res = await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      const { user, token, refreshToken } = res.data;
      await tokenStorage.setTokens(token, refreshToken);
      useUserStore.getState().setAuthenticatedUser(user);
      // New users go to the assessment first.
      router.replace("/assessment");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (err?.message === "Network Error"
          ? "Cannot reach the server. Is the backend running?"
          : "Unable to create your account. Please try again.");
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
        contentContainerStyle={{ 
          flexGrow: 1, 
          justifyContent: keyboardVisible ? "flex-start" : "center", 
          paddingVertical: 40 
        }}
        className="px-6"
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="absolute top-14 left-6 z-10 p-2.5 bg-white rounded-full shadow-md border border-slate-100 active:opacity-80"
        >
          <Ionicons name="arrow-back" size={22} color="#0A2540" />
        </Pressable>

        {/* Branding header */}
        <View className="items-center mt-12">
          <View className="w-16 h-16 bg-white rounded-2xl items-center justify-center shadow-md border border-slate-100 overflow-hidden">
            <Image
              source={require("../assets/images/finlit-logo.jpeg")}
              className="w-14 h-14"
              resizeMode="contain"
            />
          </View>
          <Text className="text-[32px] font-inter-bold text-brand-navy mt-4 tracking-tight">
            Create Account
          </Text>
          <Text className="text-brand-gray font-inter text-sm mt-1 text-center">
            Start your journey to financial literacy.
          </Text>
        </View>

        {/* Form Card */}
        <View className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-100/40 border border-slate-100 mt-8">
          {/* Full Name */}
          <View>
            <Text className="text-brand-dark font-inter-semibold mb-1.5 text-sm">Full Name</Text>
            <View className="border border-slate-200 rounded-2xl flex-row items-center px-4 bg-brand-slateBg/40">
              <Ionicons name="person-outline" size={20} color="#6B7280" style={{ marginRight: 10 }} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                autoCapitalize="words"
                className="flex-1 py-3.5 text-base text-brand-dark font-inter"
              />
            </View>
          </View>

          {/* Email Address */}
          <View className="mt-4">
            <Text className="text-brand-dark font-inter-semibold mb-1.5 text-sm">Email Address</Text>
            <View className="border border-slate-200 rounded-2xl flex-row items-center px-4 bg-brand-slateBg/40">
              <Ionicons name="mail-outline" size={20} color="#6B7280" style={{ marginRight: 10 }} />
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
            <View className="border border-slate-200 rounded-2xl flex-row items-center px-4 bg-brand-slateBg/40">
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={{ marginRight: 10 }} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                autoComplete="off"
                textContentType="none"
                className="flex-1 py-3.5 text-base text-brand-dark font-inter"
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

          {/* Confirm Password */}
          <View className="mt-4">
            <Text className="text-brand-dark font-inter-semibold mb-1.5 text-sm">Confirm Password</Text>
            <View className="border border-slate-200 rounded-2xl flex-row items-center px-4 bg-brand-slateBg/40">
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={{ marginRight: 10 }} />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry={!confirmPasswordVisible}
                autoCapitalize="none"
                autoComplete="off"
                textContentType="none"
                className="flex-1 py-3.5 text-base text-brand-dark font-inter"
              />
              <Pressable onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className="p-1">
                <Ionicons
                  name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6B7280"
                />
              </Pressable>
            </View>
          </View>

          {/* Error Message */}
          {error ? (
            <View className="bg-red-50 border border-red-100 rounded-2xl p-3.5 mt-4 flex-row items-center">
              <Ionicons name="alert-circle-outline" size={18} color="#dc2626" />
              <Text className="text-red-600 font-inter-semibold text-xs ml-2 flex-1">{error}</Text>
            </View>
          ) : null}

          {/* Register Button */}
          <Pressable
            onPress={handleRegister}
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
              <Text className="text-white text-center font-inter-semibold text-base">Create Account</Text>
            )}
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-slate-100" />
            <Text className="mx-4 text-brand-gray font-inter-semibold text-xs uppercase tracking-wider">OR</Text>
            <View className="flex-1 h-px bg-slate-100" />
          </View>

          {/* Google */}
          <Pressable
            onPress={() => Alert.alert("Coming Soon", "Google sign-up will be available in the next update.")}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.98 : 1 }],
              opacity: pressed ? 0.95 : 1,
            })}
            className="border border-slate-200 bg-white rounded-2xl h-14 flex-row justify-center items-center shadow-sm active:bg-slate-50"
          >
            <Image
              source={require("../assets/images/google-logo.jpg")}
              className="w-6 h-6 rounded-full"
              resizeMode="contain"
            />
            <Text className="ml-3 font-inter-semibold text-brand-dark text-base">
              Sign up with Google
            </Text>
          </Pressable>

          {/* Facebook */}
          <Pressable
            onPress={() => Alert.alert("Coming Soon", "Facebook sign-up will be available in the next update.")}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.98 : 1 }],
              opacity: pressed ? 0.95 : 1,
            })}
            className="border border-slate-200 bg-white rounded-2xl h-14 flex-row justify-center items-center mt-3 shadow-sm active:bg-slate-50"
          >
            <Image
              source={require("../assets/images/facebook-logo.jpg")}
              className="w-6 h-6 rounded-full"
              resizeMode="contain"
            />
            <Text className="ml-3 font-inter-semibold text-brand-dark text-base">
              Sign up with Facebook
            </Text>
          </Pressable>
        </View>

        {/* Sign In Link */}
        <View className="flex-row justify-center mt-8 pb-4">
          <Text className="text-brand-gray font-inter text-sm">Already have an account? </Text>
          <Pressable onPress={() => router.replace("/login")}>
            <Text className="text-brand-emerald font-inter-bold text-sm ml-1.5">Sign In</Text>
          </Pressable>
        </View>

        {/* Keyboard spacer to allow scrolling above the keyboard */}
        {keyboardVisible && <View className="h-64" />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
