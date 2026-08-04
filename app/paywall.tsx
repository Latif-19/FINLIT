import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useUserStore } from "../store/useUserStore";
import { profileService } from "../services/profile";
import { usePaystack } from "react-native-paystack-webview";

type PlanId = "monthly" | "three_months" | "yearly";

interface Plan {
  id: PlanId;
  title: string;
  amount: number; // in GHS (not pesewas)
  period: string;
  badge?: string;
  desc: string;
}

const PLANS: Plan[] = [
  {
    id: "monthly",
    title: "Monthly Pass",
    amount: 19.99,
    period: "month",
    desc: "Perfect for a quick learning sprint",
  },
  {
    id: "three_months",
    title: "Quarterly Saver",
    amount: 49.99,
    period: "3 months",
    badge: "POPULAR",
    desc: "Saves 16% compared to monthly",
  },
  {
    id: "yearly",
    title: "Yearly Pro",
    amount: 129.99,
    period: "year",
    badge: "BEST VALUE",
    desc: "Saves 45% — our ultimate package",
  },
];

function generateRef(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `FINLIT-${ts}-${rand}`.toUpperCase();
}

export default function PaywallScreen() {
  const colors = useThemeColors();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("three_months");
  const [email, setEmail] = useState(useUserStore.getState().email || "");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { popup } = usePaystack();
  const userEmail = useUserStore((s) => s.email);

  const plan = PLANS.find((p) => p.id === selectedPlan)!;

  const handleSubscribe = () => {
    const payerEmail = email.trim() || userEmail;
    if (!payerEmail) {
      Alert.alert("Email Required", "Please enter your email to proceed with payment.");
      return;
    }

    setIsLoading(true);
    const reference = generateRef();

    // Safety net: react-native-paystack-webview never calls the onError
    // callback for WebView/JS failures (it silently closes the modal), so the
    // Subscribe button could stay stuck on its spinner forever. Reset loading
    // after a generous window if neither success nor cancel ever fired.
    const safetyTimer = setTimeout(() => setIsLoading(false), 3 * 60 * 1000);

    popup.checkout({
      email: payerEmail,
      // GHS amount — the (patched) library converts to whole pesewas. See
      // patches/react-native-paystack-webview: Math.round applied so that
      // 19.99 * 100 = 1999 instead of 1998.999… (Paystack rejects non-integers).
      amount: plan.amount,
      reference,
      onSuccess: () => {
        clearTimeout(safetyTimer);
        setIsLoading(false);
        useUserStore.getState().setPremium(true); // optimistic
        setPaymentSuccess(true);
        // Persist premium on the backend — it re-verifies this reference with
        // Paystack server-side before granting the tier, so this call alone
        // can't be spoofed by hitting the endpoint directly.
        profileService
          .activatePremium(reference)
          .then((r) => useUserStore.getState().setAuthenticatedUser(r.data))
          .catch(() => {
            // Offline — will reconcile on next login (backend reflects the tier).
          });
      },
      onCancel: () => {
        clearTimeout(safetyTimer);
        setIsLoading(false);
      },
      onError: (err: any) => {
        clearTimeout(safetyTimer);
        setIsLoading(false);
        Alert.alert("Payment Error", err?.message || "Something went wrong. Please try again.");
      },
    });
  };

  const handleCloseSuccess = () => {
    setPaymentSuccess(false);
    router.back();
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-brand-slateBg">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-brand-border bg-brand-bg">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-brand-slateBg items-center justify-center active:opacity-80">
          <Ionicons name="close" size={24} color={colors.dark} />
        </Pressable>
        <Text className="text-lg font-inter-bold text-brand-navy">FinLit Premium</Text>
        <View style={{ width: 40 }} />
      </View>

      {paymentSuccess ? (
        <View className="flex-1 items-center justify-center p-7">
          <View className="mb-6">
            <Ionicons name="checkmark-circle" size={80} color={colors.emerald} />
          </View>
          <Text className="text-2xl font-inter-bold text-brand-navy text-center">Welcome to Premium!</Text>
          <Text className="text-sm text-brand-dark text-center mt-2.5 mb-8 px-3 leading-5">
            Your subscription has been activated. All simulators, AI tools, and premium content are now unlocked.
          </Text>
          <Pressable onPress={handleCloseSuccess} className="bg-brand-emerald py-4 px-10 rounded-2xl shadow-md shadow-brand-emerald/30 active:opacity-80">
            <Text className="text-white text-base font-inter-bold">Start Exploring</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Headline */}
          <View className="items-center my-3">
            <Text className="text-[26px] font-inter-black text-brand-navy text-center">Unlock Financial Mastery</Text>
            <Text className="text-sm text-brand-gray text-center mt-1.5 leading-5 px-2.5">
              Empower your wallet with premium features and certified credentials
            </Text>
          </View>

          {/* Premium Value Props */}
          <View className="bg-brand-bg rounded-3xl p-4 border border-brand-border mt-5">
            <View className="flex-row items-start py-3">
              <View className="w-9 h-9 rounded-[10px] bg-brand-emerald/10 items-center justify-center mr-3">
                <Ionicons name="chatbubble-ellipses" size={20} color={colors.emerald} />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-inter-bold text-brand-dark">Unlimited AI Coach Pro</Text>
                <Text className="text-xs text-brand-gray mt-0.5 leading-4">
                  Ask unlimited questions and get tailored savings analysis.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start py-3">
              <View className="w-9 h-9 rounded-[10px] bg-brand-emerald/10 items-center justify-center mr-3">
                <Ionicons name="ribbon" size={20} color={colors.emerald} />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-inter-bold text-brand-dark">Accredited Certificates</Text>
                <Text className="text-xs text-brand-gray mt-0.5 leading-4">
                  Earn downloadable certificates to share on LinkedIn or your CV.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start py-3">
              <View className="w-9 h-9 rounded-[10px] bg-brand-emerald/10 items-center justify-center mr-3">
                <Ionicons name="calculator" size={20} color={colors.emerald} />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-inter-bold text-brand-dark">Advanced Simulators</Text>
                <Text className="text-xs text-brand-gray mt-0.5 leading-4">
                  Unlock tax estimators, SSNIT planners, and inflation models.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start py-3">
              <View className="w-9 h-9 rounded-[10px] bg-brand-emerald/10 items-center justify-center mr-3">
                <Ionicons name="volume-high" size={20} color={colors.emerald} />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-inter-bold text-brand-dark">Audio Lessons & Offline Mode</Text>
                <Text className="text-xs text-brand-gray mt-0.5 leading-4">
                  Listen hands-free and download lessons to learn without data.
                </Text>
              </View>
            </View>
          </View>

          {/* Plan Picker */}
          <Text className="text-xs font-inter-extrabold text-brand-gray tracking-widest mt-7 mb-3 ml-0.5">CHOOSE YOUR PLAN</Text>
          <View className="gap-3">
            {PLANS.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => setSelectedPlan(p.id)}
                className={`bg-brand-bg rounded-[20px] p-4 border-2 relative active:opacity-80 ${
                  selectedPlan === p.id
                    ? "border-brand-emerald bg-brand-emerald/10"
                    : "border-brand-border"
                }`}
              >
                {p.badge && (
                  <View className="absolute -top-2.5 right-4 bg-brand-emerald px-2 py-0.5 rounded-lg">
                    <Text className="text-[9px] font-inter-extrabold text-white tracking-wider">{p.badge}</Text>
                  </View>
                )}
                <View className="flex-row justify-between items-center">
                  <Text className="text-base font-inter-bold text-brand-navy">{p.title}</Text>
                  <View className="flex-row items-baseline">
                    <Text className="text-lg font-inter-extrabold text-brand-navy">GH₵ {p.amount.toFixed(2)}</Text>
                    <Text className="text-xs text-brand-gray font-inter-medium">/{p.period}</Text>
                  </View>
                </View>
                <Text className="text-xs text-brand-gray mt-1">{p.desc}</Text>
              </Pressable>
            ))}
          </View>

          {/* Email Input */}
          <Text className="text-xs font-inter-extrabold text-brand-gray tracking-widest mt-7 mb-3 ml-0.5">YOUR EMAIL</Text>
          <View className="flex-row items-center bg-brand-bg rounded-2xl border border-brand-border px-3.5 py-3.5">
            <Ionicons name="mail-outline" size={18} color={colors.gray} style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-[15px] text-brand-navy"
              placeholder="you@example.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Action Area */}
          <View className="mt-8 items-center">
            <Pressable
              onPress={handleSubscribe}
              disabled={isLoading}
              className="bg-brand-emerald w-full py-4 rounded-2xl items-center justify-center shadow-md shadow-brand-emerald/30 active:opacity-80"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-base font-inter-extrabold">
                  Pay GH₵ {plan.amount.toFixed(2)} & Subscribe
                </Text>
              )}
            </Pressable>
            <Text className="text-[11px] text-brand-gray text-center mt-3 leading-[15px] px-5">
              Payments processed securely by Paystack. Cancel anytime from your profile.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
