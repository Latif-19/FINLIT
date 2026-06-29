import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../store/useUserStore";

type PlanId = "monthly" | "three_months" | "yearly";
type MethodId = "momo" | "telecel" | "card";

interface Plan {
  id: PlanId;
  title: string;
  price: string;
  period: string;
  badge?: string;
  desc: string;
}

interface PaymentMethod {
  id: MethodId;
  name: string;
  icon: string;
  color: string;
}

import { SUBSCRIPTION_PLANS, PAYMENT_METHODS } from "@/data/paywall";

const PLANS = SUBSCRIPTION_PLANS;
const METHODS = PAYMENT_METHODS;

export default function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("three_months");
  const [selectedMethod, setSelectedMethod] = useState<MethodId>("momo");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubscribe = () => {
    setIsLoading(true);
    // Simulate mobile money prompt / card validation delay
    setTimeout(() => {
      setIsLoading(false);
      setPaymentSuccess(true);
      useUserStore.getState().setPremium(true);
    }, 2500);
  };

  const handleCloseSuccess = () => {
    setPaymentSuccess(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#1f2937" />
        </Pressable>
        <Text style={styles.headerTitle}>FinLit Premium</Text>
        <View style={{ width: 40 }} />
      </View>

      {paymentSuccess ? (
        /* Success Overlay Screen */
        <View style={styles.successContainer}>
          <View style={styles.successIconWrap}>
            <Ionicons name="checkmark-circle" size={80} color="#15803d" />
          </View>
          <Text style={styles.successTitle}>Welcome to Premium! 🎉</Text>
          <Text style={styles.successBody}>
            {"Your subscription has been activated successfully. All simulators, AI tools, certificates, and offline modes are now fully unlocked."}
          </Text>
          <Pressable onPress={handleCloseSuccess} style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Start Exploring</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Headline */}
          <View style={styles.headlineSection}>
            <Text style={styles.headlineTitle}>Unlock Financial Mastery</Text>
            <Text style={styles.headlineSubtitle}>
              {"Empower your wallet with premium features and certified credentials"}
            </Text>
          </View>

          {/* Premium Value Props */}
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={styles.featureIconWrap}>
                <Ionicons name="chatbubble-ellipses" size={20} color="#15803d" />
              </View>
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitleText}>Unlimited AI Coach Pro</Text>
                <Text style={styles.featureDescText}>
                  Ask unlimited questions and get tailored savings analysis with our smart assistant.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconWrap}>
                <Ionicons name="ribbon" size={20} color="#15803d" />
              </View>
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitleText}>Accredited Certificates</Text>
                <Text style={styles.featureDescText}>
                  Earn official downloadable certificates to share on LinkedIn or build your CV.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconWrap}>
                <Ionicons name="calculator" size={20} color="#15803d" />
              </View>
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitleText}>Advanced Simulators</Text>
                <Text style={styles.featureDescText}>
                  Unlock tax estimators, SSNIT planners, GSE stock sandbox, and inflation models.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconWrap}>
                <Ionicons name="volume-high" size={20} color="#15803d" />
              </View>
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitleText}>Audio Lessons {"&"} Offline Mode</Text>
                <Text style={styles.featureDescText}>
                  Listen to modules hands-free and download lessons to learn without internet data.
                </Text>
              </View>
            </View>
          </View>

          {/* Plan Picker */}
          <Text style={styles.sectionLabel}>CHOOSE YOUR PLAN</Text>
          <View style={styles.planContainer}>
            {PLANS.map((plan) => (
              <Pressable
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.selectedPlanCard,
                ]}
              >
                {plan.badge && (
                  <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                )}
                <View style={styles.planHeader}>
                  <Text style={styles.planTitle}>{plan.title}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planPeriod}>/{plan.period}</Text>
                  </View>
                </View>
                <Text style={styles.planDesc}>{plan.desc}</Text>
              </Pressable>
            ))}
          </View>

          {/* Payment Method Picker */}
          <Text style={styles.sectionLabel}>SELECT PAYMENT METHOD</Text>
          <View style={styles.methodContainer}>
            {METHODS.map((m) => (
              <Pressable
                key={m.id}
                onPress={() => setSelectedMethod(m.id)}
                style={[
                  styles.methodCard,
                  selectedMethod === m.id && styles.selectedMethodCard,
                ]}
              >
                <View
                  style={[
                    styles.methodIconBox,
                    { backgroundColor: m.color + "15" },
                  ]}
                >
                  {m.image ? (
                    <Image
                      source={m.image}
                      style={{ width: 26, height: 26, borderRadius: 4 }}
                      resizeMode="contain"
                    />
                  ) : (
                    <Ionicons name={m.icon as any} size={18} color={m.color} />
                  )}
                </View>
                <Text style={styles.methodName}>{m.name}</Text>
                <View style={styles.radioOuter}>
                  {selectedMethod === m.id && <View style={styles.radioInner} />}
                </View>
              </Pressable>
            ))}
          </View>

          {/* Action Area */}
          <View style={styles.actionBox}>
            <Pressable
              onPress={handleSubscribe}
              disabled={isLoading}
              style={styles.payButton}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.payButtonText}>
                  Subscribe {"&"} Unlock
                </Text>
              )}
            </Pressable>
            <Text style={styles.disclaimerText}>
              Cancel subscription anytime. Payments are securely encrypted and processed by local carriers.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },

  /* Headline Section */
  headlineSection: {
    alignItems: "center",
    marginVertical: 12,
  },
  headlineTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },
  headlineSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
    paddingHorizontal: 10,
  },

  /* Feature List */
  featureList: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitleText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
  },
  featureDescText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
    lineHeight: 16,
  },

  /* Section Label */
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#9ca3af",
    letterSpacing: 1.2,
    marginTop: 30,
    marginBottom: 12,
    marginLeft: 2,
  },

  /* Plan Picker */
  planContainer: {
    gap: 12,
  },
  planCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    position: "relative",
  },
  selectedPlanCard: {
    borderColor: "#15803d",
    backgroundColor: "#f0fdf4",
  },
  planBadge: {
    position: "absolute",
    top: -10,
    right: 16,
    backgroundColor: "#15803d",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  planBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  planPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  planPeriod: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  planDesc: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },

  /* Payment Method Picker */
  methodContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  selectedMethodCard: {
    backgroundColor: "#fafafa",
  },
  methodIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  methodName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#15803d",
  },

  /* Action Box */
  actionBox: {
    marginTop: 32,
    alignItems: "center",
  },
  payButton: {
    backgroundColor: "#15803d",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#15803d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  disclaimerText: {
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 15,
    paddingHorizontal: 20,
  },

  /* Success State */
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  successIconWrap: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },
  successBody: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  continueButton: {
    backgroundColor: "#15803d",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    shadowColor: "#15803d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
});
