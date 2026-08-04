import React, { useState, useRef, useEffect } from "react";
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
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColors";
import { authService } from "../services/auth";

type Step = "email" | "code" | "password" | "success";

// Matches the backend's 6-digit reset code (AuthService#assignResetCode).
const CODE_LENGTH = 6;

export default function ForgotPasswordScreen() {
  const colors = useThemeColors();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // OTP Verification Code state
  const [otp, setOtp] = useState<string[]>(() => Array(CODE_LENGTH).fill(""));
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);

  // Password Reset state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Refs for OTP input fields — one slot per digit, so the count is driven by
  // CODE_LENGTH rather than hard-coded.
  const otpRefs = useRef<(TextInput | null)[]>([]);
  const focusOtp = (index: number) => otpRefs.current[index]?.focus();

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: any;
    if (step === "code" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Start timer again when code is resent
  const handleResendCode = async () => {
    if (!canResend || isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      await authService.forgotPassword(email.trim());
      setTimer(45);
      setCanResend(false);
      setOtp(Array(CODE_LENGTH).fill(""));
      focusOtp(0);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (err?.message === "Network Error"
          ? "Cannot reach the server. Is the backend running?"
          : "Couldn't resend the code. Please try again.");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async () => {
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      setStep("code");
      setTimer(45);
      setCanResend(false);
      // Give UI a moment to render before focusing
      setTimeout(() => focusOtp(0), 100);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (err?.message === "Network Error"
          ? "Cannot reach the server. Is the backend running?"
          : "Couldn't send the reset code. Please try again.");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError("");
    const codeString = otp.join("");
    if (codeString.length < CODE_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      // Checks the code without consuming it, so a wrong code fails here
      // instead of after the user has typed a new password.
      await authService.verifyResetCode({ email: email.trim(), code: codeString });
      setStep("password");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (err?.message === "Network Error"
          ? "Cannot reach the server. Is the backend running?"
          : "Couldn't verify that code. Please try again.");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
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

    setIsLoading(true);
    try {
      await authService.resetPassword({
        email: email.trim(),
        code: otp.join(""),
        newPassword: password,
      });
      setStep("success");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (err?.message === "Network Error"
          ? "Cannot reach the server. Is the backend running?"
          : "Couldn't reset your password. Please try again.");
      setError(message);
      // The code is re-checked server-side here, so an expired one only
      // surfaces at this point — send them back to request a fresh code.
      if (/expired|not valid/i.test(message)) {
        setStep("code");
        setOtp(Array(CODE_LENGTH).fill(""));
        setCanResend(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    setError("");
    const digits = text.replace(/[^0-9]/g, "");

    // Pasting the whole code into one box should fill the row, not just one slot.
    if (digits.length > 1) {
      const next = Array(CODE_LENGTH).fill("");
      digits
        .slice(0, CODE_LENGTH)
        .split("")
        .forEach((d, i) => (next[i] = d));
      setOtp(next);
      focusOtp(Math.min(digits.length, CODE_LENGTH) - 1);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = digits.slice(-1);
    setOtp(newOtp);

    if (digits && index < CODE_LENGTH - 1) {
      focusOtp(index + 1);
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    // Backspace on an empty box clears the previous one and steps back.
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      focusOtp(index - 1);
    }
  };

  const handleBack = () => {
    if (step === "email") {
      router.back();
    } else if (step === "code") {
      setStep("email");
      setError("");
    } else if (step === "password") {
      setStep("code");
      setError("");
      setOtp(Array(CODE_LENGTH).fill(""));
      setTimeout(() => focusOtp(0), 100);
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
        {/* Back Button (hidden on success step) */}
        {step !== "success" && (
          <Pressable
            onPress={handleBack}
            className="absolute top-14 left-6 z-10 p-2.5 bg-brand-bg rounded-full shadow-md border border-brand-border active:opacity-80"
          >
            <Ionicons name="arrow-back" size={22} color={colors.navy} />
          </Pressable>
        )}

        {/* Branding header */}
        <View className="items-center mt-12">
          <View className="w-16 h-16 bg-brand-bg rounded-2xl items-center justify-center shadow-md border border-brand-border overflow-hidden">
            <Image
              source={require("../assets/images/finlit-logo.png")}
              className="w-14 h-14"
              resizeMode="contain"
            />
          </View>
          
          {step === "email" && (
            <>
              <Text className="text-[32px] font-inter-bold text-brand-navy mt-4 tracking-tight">
                Reset Password
              </Text>
              <Text className="text-brand-gray font-inter text-sm mt-1 text-center px-4">
                {"Forgot your credentials? We'll help you get right back in."}
              </Text>
            </>
          )}

          {step === "code" && (
            <>
              <Text className="text-[32px] font-inter-bold text-brand-navy mt-4 tracking-tight">
                Verify Identity
              </Text>
              <Text className="text-brand-gray font-inter text-sm mt-1 text-center px-4">
                We sent a 6-digit reset code to:{"\n"}
                <Text className="font-inter-semibold text-brand-emerald">{email}</Text>
              </Text>
            </>
          )}

          {step === "password" && (
            <>
              <Text className="text-[32px] font-inter-bold text-brand-navy mt-4 tracking-tight">
                New Password
              </Text>
              <Text className="text-brand-gray font-inter text-sm mt-1 text-center px-4">
                Your email is verified. Please enter your new password below.
              </Text>
            </>
          )}

          {step === "success" && (
            <>
              <Text className="text-[32px] font-inter-bold text-brand-navy mt-4 tracking-tight">
                All Done!
              </Text>
              <Text className="text-brand-gray font-inter text-sm mt-1 text-center px-4">
                Your password has been successfully updated.
              </Text>
            </>
          )}
        </View>

        {/* Form Card */}
        <View className="bg-brand-bg rounded-3xl p-6 shadow-lg shadow-slate-100/40 border border-brand-border mt-8">
          
          {/* STEP 1: EMAIL INPUT */}
          {step === "email" && (
            <View>
              <Text className="text-brand-dark font-inter-semibold mb-1.5 text-sm">Email Address</Text>
              <View className="border border-brand-border rounded-2xl flex-row items-center px-4 bg-brand-slateBg/40">
                <Ionicons name="mail-outline" size={20} color={colors.gray} style={{ marginRight: 10 }} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your registered email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 py-3.5 text-base text-brand-dark font-inter"
                  editable={!isLoading}
                />
              </View>

              {error ? (
                <View className="bg-red-50 border border-red-100 rounded-2xl p-3.5 mt-4 flex-row items-center">
                  <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
                  <Text className="text-red-600 font-inter-semibold text-xs ml-2 flex-1">{error}</Text>
                </View>
              ) : null}

              <Pressable
                onPress={handleSendCode}
                disabled={isLoading}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  opacity: pressed || isLoading ? 0.95 : 1,
                })}
                className="bg-brand-navy h-14 rounded-2xl mt-6 shadow-md shadow-brand-navy/10 justify-center items-center flex-row"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
                ) : null}
                <Text className="text-white text-center font-inter-bold text-base">
                  {isLoading ? "Sending Code..." : "Send Reset Code"}
                </Text>
              </Pressable>
            </View>
          )}

          {/* STEP 2: CODE VERIFICATION (OTP) */}
          {step === "code" && (
            <View>
              <Text className="text-brand-dark font-inter-semibold mb-3 text-center text-sm">
                Enter 6-Digit Code
              </Text>
              
              <View className="flex-row justify-between px-1 mb-4">
                {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                  <TextInput
                    key={index}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                    }}
                    value={otp[index]}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleOtpKeyPress(e, index)}
                    placeholder="•"
                    placeholderTextColor="#d1d5db"
                    keyboardType="number-pad"
                    // Long enough to accept a pasted full code, which
                    // handleOtpChange then spreads across every box.
                    maxLength={CODE_LENGTH}
                    className="w-11 h-14 border border-brand-border rounded-2xl text-center text-xl font-inter-bold bg-brand-slateBg/40 text-brand-dark"
                    editable={!isLoading}
                  />
                ))}
              </View>

              <Text className="text-center text-xs text-brand-gray mt-1 mb-2">
                Enter the 6-digit code sent to your email
              </Text>

              {error ? (
                <View className="bg-red-50 border border-red-100 rounded-2xl p-3.5 mt-2 flex-row items-center">
                  <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
                  <Text className="text-red-600 font-inter-semibold text-xs ml-2 flex-1">{error}</Text>
                </View>
              ) : null}

              {/* Countdown / Resend */}
              <View className="flex-row justify-center items-center mt-4">
                <Text className="text-brand-gray font-inter text-xs">{"Didn't receive the code? "}</Text>
                <Pressable
                  onPress={handleResendCode}
                  disabled={!canResend || isLoading}
                >
                  <Text className={`text-xs font-inter-bold ${canResend ? "text-brand-emerald" : "text-brand-gray"}`}>
                    {canResend ? "Resend Code" : `Resend in ${timer}s`}
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={handleVerifyCode}
                disabled={isLoading}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  opacity: pressed || isLoading ? 0.95 : 1,
                })}
                className="bg-brand-navy h-14 rounded-2xl mt-6 shadow-md shadow-brand-navy/10 justify-center items-center flex-row"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
                ) : null}
                <Text className="text-white text-center font-inter-bold text-base">
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Text>
              </Pressable>
            </View>
          )}

          {/* STEP 3: NEW PASSWORD RESET */}
          {step === "password" && (
            <View>
              {/* Password */}
              <View>
                <Text className="text-brand-dark font-inter-semibold mb-1.5 text-sm">New Password</Text>
                <View className="border border-brand-border rounded-2xl flex-row items-center px-4 bg-brand-slateBg/40">
                  <Ionicons name="lock-closed-outline" size={20} color={colors.gray} style={{ marginRight: 10 }} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter new password"
                    secureTextEntry={!passwordVisible}
                    autoCapitalize="none"
                    autoComplete="off"
                    textContentType="none"
                    importantForAutofill="no"
                    className="flex-1 py-3.5 text-base text-brand-dark font-inter"
                    editable={!isLoading}
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

              {/* Confirm Password */}
              <View className="mt-4">
                <Text className="text-brand-dark font-inter-semibold mb-1.5 text-sm">Confirm Password</Text>
                <View className="border border-brand-border rounded-2xl flex-row items-center px-4 bg-brand-slateBg/40">
                  <Ionicons name="lock-closed-outline" size={20} color={colors.gray} style={{ marginRight: 10 }} />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    secureTextEntry={!confirmPasswordVisible}
                    autoCapitalize="none"
                    autoComplete="off"
                    textContentType="none"
                    importantForAutofill="no"
                    className="flex-1 py-3.5 text-base text-brand-dark font-inter"
                    editable={!isLoading}
                  />
                  <Pressable onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className="p-1">
                    <Ionicons
                      name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.gray}
                    />
                  </Pressable>
                </View>
                {confirmPassword.length > 0 && (
                  <View className="flex-row items-center mt-1.5">
                    <Ionicons
                      name={password === confirmPassword ? "checkmark-circle" : "close-circle"}
                      size={14}
                      color={password === confirmPassword ? colors.success : colors.danger}
                    />
                    <Text
                      className={`text-xs font-inter-medium ml-1.5 ${
                        password === confirmPassword ? "text-brand-emerald" : "text-red-600"
                      }`}
                    >
                      {password === confirmPassword ? "Passwords match" : "Passwords don't match yet"}
                    </Text>
                  </View>
                )}
              </View>

              {error ? (
                <View className="bg-red-50 border border-red-100 rounded-2xl p-3.5 mt-4 flex-row items-center">
                  <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
                  <Text className="text-red-600 font-inter-semibold text-xs ml-2 flex-1">{error}</Text>
                </View>
              ) : null}

              <Pressable
                onPress={handleResetPassword}
                disabled={isLoading}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  opacity: pressed || isLoading ? 0.95 : 1,
                })}
                className="bg-brand-navy h-14 rounded-2xl mt-6 shadow-md shadow-brand-navy/10 justify-center items-center flex-row"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
                ) : null}
                <Text className="text-white text-center font-inter-bold text-base">
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Text>
              </Pressable>
            </View>
          )}

          {/* STEP 4: SUCCESS */}
          {step === "success" && (
            <View className="items-center py-4">
              <View className="w-20 h-20 bg-brand-emerald/10 rounded-full items-center justify-center border border-brand-emerald/20 mb-4">
                <Ionicons name="checkmark-circle" size={54} color={colors.emerald} />
              </View>
              
              <Text className="text-brand-dark font-inter text-sm text-center leading-6 px-4">
                Your account is ready! Go ahead and sign in with your updated password to continue building financial literacy.
              </Text>

              <Pressable
                onPress={() => router.replace("/login")}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  opacity: pressed ? 0.95 : 1,
                })}
                className="bg-brand-navy h-14 rounded-2xl mt-8 w-full shadow-md shadow-brand-navy/10 justify-center items-center"
              >
                <Text className="text-white text-center font-inter-semibold text-base">
                  Go to Login
                </Text>
              </Pressable>
            </View>
          )}

        </View>

        {/* Footer */}
        {step === "email" && (
          <View className="flex-row justify-center mt-8 pb-4">
            <Text className="text-brand-gray font-inter text-sm">
              {"Don't have an account?"}
            </Text>
            <Pressable onPress={() => router.replace("/register")}>
              <Text className="text-brand-emerald font-inter-bold text-sm ml-1.5">
                Create Account
              </Text>
            </Pressable>
          </View>
        )}

        {step !== "email" && step !== "success" && (
          <View className="flex-row justify-center mt-8 pb-4">
            <Text className="text-brand-gray font-inter text-sm">
              Remembered your password?
            </Text>
            <Pressable onPress={() => router.replace("/login")}>
              <Text className="text-brand-emerald font-inter-bold text-sm ml-1.5">
                Sign In
              </Text>
            </Pressable>
          </View>
        )}

        {/* Keyboard spacer to allow scrolling above the keyboard */}
        {keyboardVisible && <View className="h-64" />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
