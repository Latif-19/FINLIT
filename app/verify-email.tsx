import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../store/useUserStore";
import { authService } from "../services/auth";
import { tokenStorage } from "../services/tokenStorage";
import "@/types/navigation";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 30; // seconds

export default function VerifyEmailScreen() {
  const params = useLocalSearchParams<{ email?: string; flow?: string }>();
  const email = (params.email ?? "").toString();
  const flow = (params.flow ?? "register").toString();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [resendMsg, setResendMsg] = useState("");
  const inputRef = useRef<TextInput>(null);

  // Countdown for the resend button.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleVerify = async (submitted?: string) => {
    const value = (submitted ?? code).trim();
    setError("");
    if (value.length !== CODE_LENGTH) {
      setError(`Enter the ${CODE_LENGTH}-digit code we emailed you.`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.verifyEmail({ email, code: value });
      const { user, token, refreshToken } = res.data;
      await tokenStorage.setTokens(token, refreshToken);
      useUserStore.getState().setAuthenticatedUser(user);
      // Newly registered users always need the assessment. Returning users
      // (flow === "login") only skip it if they'd actually completed it before.
      if (flow === "register" || !user.lastAssessedAt) {
        router.replace("/assessment");
      } else {
        router.replace("/(tabs)/home");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (err?.message === "Network Error"
          ? "Cannot reach the server. Is the backend running?"
          : "Couldn't verify that code. Please try again.");
      setError(message);
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError("");
    setResendMsg("");
    try {
      await authService.resendCode(email);
      setResendMsg("A new code is on its way. Check your inbox.");
      setCooldown(RESEND_COOLDOWN);
    } catch {
      setError("Couldn't resend the code. Please try again shortly.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      className="flex-1 bg-brand-slateBg"
    >
      <View className="absolute top-0 left-0 right-0 h-64 bg-brand-navy/5 rounded-b-[100px] -z-10" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 40 }}
        className="px-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <Pressable
          onPress={() => router.back()}
          className="absolute top-14 left-6 z-10 p-2.5 bg-white rounded-full shadow-md border border-slate-100 active:opacity-80"
        >
          <Ionicons name="arrow-back" size={22} color="#0A2540" />
        </Pressable>

        {/* Header */}
        <View className="items-center mt-12">
          <View className="w-16 h-16 bg-brand-emerald/10 rounded-2xl items-center justify-center">
            <Ionicons name="mail-open-outline" size={30} color="#16A34A" />
          </View>
          <Text className="text-[28px] font-inter-bold text-brand-navy mt-4 tracking-tight">
            Verify your email
          </Text>
          <Text className="text-brand-gray font-inter text-sm mt-2 text-center leading-5">
            We sent a {CODE_LENGTH}-digit code to
          </Text>
          <Text className="text-brand-dark font-inter-semibold text-sm mt-0.5 text-center">
            {email || "your email"}
          </Text>
        </View>

        {/* Code entry card */}
        <View className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-100/40 border border-slate-100 mt-8">
          {/* Hidden-ish single input styled as the code field */}
          <Pressable onPress={() => inputRef.current?.focus()}>
            <View className="flex-row justify-between">
              {Array.from({ length: CODE_LENGTH }).map((_, i) => {
                const char = code[i] ?? "";
                const active = i === code.length;
                return (
                  <View
                    key={i}
                    className={`w-12 h-14 rounded-2xl border items-center justify-center ${
                      char
                        ? "border-brand-emerald bg-brand-emerald/5"
                        : active
                        ? "border-brand-navy/40 bg-brand-slateBg/40"
                        : "border-slate-200 bg-brand-slateBg/40"
                    }`}
                  >
                    <Text className="text-2xl font-inter-bold text-brand-navy">{char}</Text>
                  </View>
                );
              })}
            </View>
          </Pressable>

          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={(t) => {
              const digits = t.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
              setCode(digits);
              if (error) setError("");
              if (digits.length === CODE_LENGTH) handleVerify(digits);
            }}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            autoFocus
            // Invisible overlay input — the boxes above are the visible UI.
            className="absolute w-full h-14 opacity-0"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
          />

          {error ? (
            <Text className="text-red-500 font-inter text-sm mt-4 text-center">{error}</Text>
          ) : resendMsg ? (
            <Text className="text-brand-emerald font-inter text-sm mt-4 text-center">{resendMsg}</Text>
          ) : null}

          {/* Verify button */}
          <Pressable
            onPress={() => handleVerify()}
            disabled={isLoading}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.98 : 1 }],
              opacity: isLoading ? 0.7 : pressed ? 0.95 : 1,
            })}
            className="bg-brand-navy h-14 rounded-2xl justify-center items-center shadow-lg shadow-brand-navy/15 mt-6"
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-center font-inter-semibold text-base">
                Verify & Continue
              </Text>
            )}
          </Pressable>
        </View>

        {/* Resend */}
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-brand-gray font-inter text-sm">Didn&apos;t get it? </Text>
          <Pressable onPress={handleResend} disabled={cooldown > 0}>
            <Text
              className={`font-inter-semibold text-sm ${
                cooldown > 0 ? "text-brand-gray/50" : "text-brand-emerald"
              }`}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
