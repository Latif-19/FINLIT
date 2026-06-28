import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { Pressable, Text, TextInput, View, KeyboardAvoidingView, Platform, ScrollView, Image, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../store/useUserStore";
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

  const handleRegister = () => {
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

    // Save user state globally and authenticate
    useUserStore.getState().login(name, email);

    // Navigate to assessment screen first on register
    router.replace("/assessment");
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
            Create Account
          </Text>
          <Text className="text-gray-500 text-sm mt-1 text-center">
            Start your journey to financial literacy.
          </Text>
        </View>

        {/* Form Card */}
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mt-8">
          {/* Full Name */}
          <View>
            <Text className="text-gray-700 font-semibold mb-1.5 text-sm">Full Name</Text>
            <View className="border border-gray-300 rounded-xl flex-row items-center px-3.5 bg-gray-50/30">
              <Ionicons name="person-outline" size={20} color="gray" className="mr-2" />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                autoCapitalize="words"
                className="flex-1 py-3 text-base text-gray-800"
              />
            </View>
          </View>

          {/* Email Address */}
          <View className="mt-4">
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
                placeholder="Create a password"
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

          {/* Confirm Password */}
          <View className="mt-4">
            <Text className="text-gray-700 font-semibold mb-1.5 text-sm">Confirm Password</Text>
            <View className="border border-gray-300 rounded-xl flex-row items-center px-3.5 bg-gray-50/30">
              <Ionicons name="lock-closed-outline" size={20} color="gray" className="mr-2" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry={!confirmPasswordVisible}
                autoCapitalize="none"
                className="flex-1 py-3 text-base text-gray-800"
              />
              <Pressable onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className="p-1">
                <Ionicons
                  name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="gray"
                />
              </Pressable>
            </View>
          </View>

          {/* Error Message */}
          {error ? (
            <View className="bg-red-50 border border-red-100 rounded-xl p-3.5 mt-4 flex-row items-center">
              <Ionicons name="alert-circle-outline" size={18} color="#dc2626" />
              <Text className="text-red-600 font-semibold text-xs ml-2 flex-1">{error}</Text>
            </View>
          ) : null}

          {/* Register Button */}
          <Pressable
            onPress={handleRegister}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.98 : 1 }],
              opacity: pressed ? 0.95 : 1,
            })}
            className="bg-green-700 py-4 rounded-xl mt-6 shadow-sm active:bg-green-800"
          >
            <Text className="text-white text-center font-bold text-base">Create Account</Text>
          </Pressable>
        </View>

        {/* Sign In Link */}
        <View className="flex-row justify-center mt-8 pb-4">
          <Text className="text-gray-500 text-sm">Already have an account? </Text>
          <Pressable onPress={() => router.replace("/login")}>
            <Text className="text-green-700 font-bold text-sm">Sign In</Text>
          </Pressable>
        </View>

        {/* Keyboard spacer to allow scrolling above the keyboard */}
        {keyboardVisible && <View className="h-64" />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
